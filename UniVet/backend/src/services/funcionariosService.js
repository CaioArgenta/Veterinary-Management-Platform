const supabase = require('./supabase')

const MODULOS = [
  'dashboard',
  'tutores',
  'animais',
  'agenda',
  'consultas',
  'vacinacao',
  'funcionarios'
]

function erro(mensagem, status = 400) {
  const error = new Error(mensagem)
  error.status = status
  return error
}

function limparTelefone(valor) {
  return valor ? String(valor).replace(/\D/g, '') : ''
}

function validarDados(dados, criar = false) {
  const nome = dados.nome_completo?.trim()
  const email = dados.email?.trim().toLowerCase()
  const telefone = limparTelefone(dados.telefone)

  if (!nome || nome.length < 3) {
    throw erro('Informe o nome completo do funcionário.')
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw erro('Informe um e-mail válido.')
  }

  if (telefone && telefone.length < 10) {
    throw erro('Telefone inválido.')
  }

  if (criar && (!dados.senha || dados.senha.length < 8)) {
    throw erro('A senha inicial deve ter pelo menos 8 caracteres.')
  }

  if (
    dados.tipo !== undefined &&
    !['FUNCIONARIO', 'VETERINARIO'].includes(dados.tipo)
  ) {
    throw erro('Função inválida.')
  }

  return {
    nome_completo: nome,
    email,
    telefone: telefone || null,
    tipo: dados.tipo || 'FUNCIONARIO'
  }
}

function validarPermissoes(permissoes = []) {
  if (!Array.isArray(permissoes)) {
    throw erro('Formato de permissões inválido.')
  }

  const modulosRecebidos = new Set()

  return permissoes.map((permissao) => {
    if (!MODULOS.includes(permissao.modulo)) {
      throw erro(`Módulo inválido: ${permissao.modulo}`)
    }

    if (modulosRecebidos.has(permissao.modulo)) {
      throw erro(
        `O módulo ${permissao.modulo} foi informado mais de uma vez.`
      )
    }

    modulosRecebidos.add(permissao.modulo)

    const podeVisualizar = permissao.pode_visualizar === true
    const podeCadastrar = permissao.pode_cadastrar === true
    const podeEditar = permissao.pode_editar === true
    const podeExcluir = permissao.pode_excluir === true

    if (
      (podeCadastrar || podeEditar || podeExcluir) &&
      !podeVisualizar
    ) {
      throw erro(
        `O funcionário precisa poder visualizar o módulo ${permissao.modulo} para realizar outras ações.`
      )
    }

    return {
      modulo: permissao.modulo,
      pode_visualizar: podeVisualizar,
      pode_cadastrar: podeCadastrar,
      pode_editar: podeEditar,
      pode_excluir: podeExcluir
    }
  })
}

async function salvarPermissoes(
  perfilId,
  estabelecimentoId,
  permissoes = []
) {
  const recebidas = validarPermissoes(permissoes)

  const porModulo = new Map(
    recebidas.map((permissao) => [
      permissao.modulo,
      permissao
    ])
  )

  const registros = MODULOS.map((modulo) => {
    const permissao = porModulo.get(modulo)

    return {
      perfil_id: perfilId,
      estabelecimento_id: estabelecimentoId,
      modulo,
      pode_visualizar: permissao?.pode_visualizar || false,
      pode_cadastrar: permissao?.pode_cadastrar || false,
      pode_editar: permissao?.pode_editar || false,
      pode_excluir: permissao?.pode_excluir || false,
      atualizado_em: new Date().toISOString()
    }
  })

  const { error } = await supabase
    .from('permissoes_funcionarios')
    .upsert(registros, {
      onConflict: 'perfil_id,modulo'
    })

  if (error) throw error
}

async function listarFuncionarios(estabelecimentoId) {
  const { data, error } = await supabase
    .from('perfis')
    .select(`
      id,
      estabelecimento_id,
      nome_completo,
      email,
      telefone,
      tipo,
      crmv,
      ativo,
      criado_em,
      atualizado_em,
      permissoes_funcionarios (
        modulo,
        pode_visualizar,
        pode_cadastrar,
        pode_editar,
        pode_excluir
      )
    `)
    .eq('estabelecimento_id', estabelecimentoId)
    .order('nome_completo')

  if (error) throw error

  return data || []
}

async function criarFuncionario(dados, estabelecimentoId) {
  const funcionario = validarDados(dados, true)
  const permissoes = validarPermissoes(dados.permissoes || [])

  const { data: existente, error: erroBusca } = await supabase
    .from('perfis')
    .select('id')
    .eq('email', funcionario.email)
    .maybeSingle()

  if (erroBusca) throw erroBusca

  if (existente) {
    throw erro('Já existe um perfil com este e-mail.', 409)
  }

  const { data: conta, error: erroConta } =
    await supabase.auth.admin.createUser({
      email: funcionario.email,
      password: dados.senha,
      email_confirm: true,
      user_metadata: {
        nome_completo: funcionario.nome_completo
      }
    })

  if (erroConta) {
    throw erro(
      erroConta.message || 'Não foi possível criar a conta.',
      400
    )
  }

  try {
    const { data: perfil, error: erroPerfil } = await supabase
      .from('perfis')
      .insert({
        id: conta.user.id,
        estabelecimento_id: estabelecimentoId,
        nome_completo: funcionario.nome_completo,
        email: funcionario.email,
        telefone: funcionario.telefone,
        tipo: funcionario.tipo,
        ativo: true
      })
      .select()
      .single()

    if (erroPerfil) throw erroPerfil

    await salvarPermissoes(
      perfil.id,
      estabelecimentoId,
      permissoes
    )

    return perfil
  } catch (error) {
    await supabase
      .from('permissoes_funcionarios')
      .delete()
      .eq('perfil_id', conta.user.id)
      .eq('estabelecimento_id', estabelecimentoId)

    await supabase
      .from('perfis')
      .delete()
      .eq('id', conta.user.id)
      .eq('estabelecimento_id', estabelecimentoId)

    const { error: erroExclusao } =
      await supabase.auth.admin.deleteUser(conta.user.id)

    if (erroExclusao) {
      console.error(
        'Não foi possível remover a conta criada:',
        erroExclusao
      )
    }

    throw error
  }
}

async function atualizarFuncionario(
  id,
  dados,
  estabelecimentoId
) {
  const { data: atual, error: erroAtual } = await supabase
    .from('perfis')
    .select('id, tipo')
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .maybeSingle()

  if (erroAtual) throw erroAtual
  if (!atual) return null

  if (atual.tipo === 'ADMINISTRADOR') {
    throw erro(
      'Não é possível editar um administrador por esta tela.',
      403
    )
  }

  const funcionario = validarDados(dados)

  if (dados.senha && dados.senha.length < 8) {
    throw erro('A senha deve ter pelo menos 8 caracteres.')
  }

  const { data: duplicado, error: erroDuplicado } = await supabase
    .from('perfis')
    .select('id')
    .eq('email', funcionario.email)
    .neq('id', id)
    .maybeSingle()

  if (erroDuplicado) throw erroDuplicado

  if (duplicado) {
    throw erro('Este e-mail já está sendo utilizado.', 409)
  }

  const atualizacaoAuth = {
    email: funcionario.email,
    user_metadata: {
      nome_completo: funcionario.nome_completo
    }
  }

  if (dados.senha) {
    atualizacaoAuth.password = dados.senha
  }

  const { error: erroAuth } =
    await supabase.auth.admin.updateUserById(id, atualizacaoAuth)

  if (erroAuth) {
    throw erro(
      erroAuth.message || 'Não foi possível atualizar a conta.'
    )
  }

  const { data, error } = await supabase
    .from('perfis')
    .update({
      nome_completo: funcionario.nome_completo,
      email: funcionario.email,
      telefone: funcionario.telefone,
      tipo: funcionario.tipo,
      atualizado_em: new Date().toISOString()
    })
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .select()
    .single()

  if (error) throw error

  if (dados.permissoes !== undefined) {
    await salvarPermissoes(
      id,
      estabelecimentoId,
      dados.permissoes
    )
  }

  return data
}

async function alterarStatusFuncionario(
  id,
  ativo,
  estabelecimentoId
) {
  if (typeof ativo !== 'boolean') {
    throw erro(
      'Informe se o funcionário deve ficar ativo ou inativo.'
    )
  }

  const { data: atual, error: erroAtual } = await supabase
    .from('perfis')
    .select('id, tipo')
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .maybeSingle()

  if (erroAtual) throw erroAtual
  if (!atual) return null

  if (atual.tipo === 'ADMINISTRADOR') {
    throw erro(
      'Não é possível desativar um administrador por esta tela.',
      403
    )
  }

  const { data, error } = await supabase
    .from('perfis')
    .update({
      ativo,
      atualizado_em: new Date().toISOString()
    })
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .select('id, nome_completo, email, ativo')
    .single()

  if (error) throw error

  return data
}

module.exports = {
  MODULOS,
  listarFuncionarios,
  criarFuncionario,
  atualizarFuncionario,
  alterarStatusFuncionario
}