const supabase = require('./supabase')

function erro(mensagem, status = 400) {
  const error = new Error(mensagem)
  error.status = status
  return error
}

function limparNumero(valor) {
  return valor ? valor.replace(/\D/g, '') : ''
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function listarTutores(estabelecimentoId) {
  const { data, error } = await supabase
    .from('tutores')
    .select(`
      id,
      nome_completo,
      cpf,
      telefone,
      email,
      endereco,
      ativo,
      criado_em,
      atualizado_em,
      animal_tutores (
        id,
        principal,
        animais (
          id,
          nome,
          especie,
          raca,
          sexo
        )
      )
    `)
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('ativo', true)
    .order('nome_completo')

  if (error) {
    throw error
  }

  return data || []
}

async function buscarTutor(id, estabelecimentoId) {
  const { data, error } = await supabase
    .from('tutores')
    .select(`
      id,
      nome_completo,
      cpf,
      telefone,
      email,
      endereco,
      ativo,
      criado_em,
      atualizado_em,
      animal_tutores (
        id,
        principal,
        animais (
          id,
          nome,
          especie,
          raca,
          sexo
        )
      )
    `)
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

async function validarDadosTutor(dados) {
  const nome = dados.nome_completo?.trim()
  const telefone = limparNumero(dados.telefone)
  const cpf = limparNumero(dados.cpf)
  const email = dados.email?.trim().toLowerCase() || null

  if (!nome || nome.length < 3) {
    throw erro('Nome completo é obrigatório.')
  }

  if (!telefone || telefone.length < 10) {
    throw erro('Telefone inválido.')
  }

  if (email && !validarEmail(email)) {
    throw erro('E-mail inválido.')
  }

  if (cpf && cpf.length !== 11) {
    throw erro('CPF deve possuir 11 números.')
  }

  return {
    nome_completo: nome,
    telefone,
    cpf: cpf || null,
    email,
    endereco: dados.endereco?.trim() || null
  }
}

async function verificarDuplicados(
  dados,
  estabelecimentoId,
  id = null
) {
  if (dados.cpf) {
    let consultaCpf = supabase
      .from('tutores')
      .select('id')
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('cpf', dados.cpf)
      .eq('ativo', true)

    if (id) {
      consultaCpf = consultaCpf.neq('id', id)
    }

    const { data: tutorCpf, error: erroCpf } = await consultaCpf.maybeSingle()

    if (erroCpf) {
      throw erroCpf
    }

    if (tutorCpf) {
      throw erro(
        id
          ? 'Já existe outro tutor com este CPF.'
          : 'Já existe um tutor cadastrado com este CPF.',
        409
      )
    }
  }

  if (dados.email) {
    let consultaEmail = supabase
      .from('tutores')
      .select('id')
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('email', dados.email)
      .eq('ativo', true)

    if (id) {
      consultaEmail = consultaEmail.neq('id', id)
    }

    const { data: tutorEmail, error: erroEmail } =
      await consultaEmail.maybeSingle()

    if (erroEmail) {
      throw erroEmail
    }

    if (tutorEmail) {
      throw erro(
        id
          ? 'Já existe outro tutor com este e-mail.'
          : 'Já existe um tutor cadastrado com este e-mail.',
        409
      )
    }
  }
}

async function criarTutor(dados, estabelecimentoId) {
  const tutor = await validarDadosTutor(dados)

  await verificarDuplicados(tutor, estabelecimentoId)

  const { data, error } = await supabase
    .from('tutores')
    .insert({
      estabelecimento_id: estabelecimentoId,
      nome_completo: tutor.nome_completo,
      cpf: tutor.cpf,
      telefone: tutor.telefone,
      email: tutor.email,
      endereco: tutor.endereco,
      ativo: true
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

async function atualizarTutor(
  id,
  dados,
  estabelecimentoId
) {
  const { data: tutorAtual, error: erroTutor } = await supabase
    .from('tutores')
    .select('id')
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('ativo', true)
    .maybeSingle()

  if (erroTutor) {
    throw erroTutor
  }

  if (!tutorAtual) {
    return null
  }

  const tutor = await validarDadosTutor(dados)

  await verificarDuplicados(
    tutor,
    estabelecimentoId,
    id
  )

  const { data, error } = await supabase
    .from('tutores')
    .update({
      nome_completo: tutor.nome_completo,
      cpf: tutor.cpf,
      telefone: tutor.telefone,
      email: tutor.email,
      endereco: tutor.endereco,
      atualizado_em: new Date().toISOString()
    })
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

async function excluirTutor(id, estabelecimentoId) {
  const { data, error } = await supabase
    .from('tutores')
    .update({
      ativo: false,
      atualizado_em: new Date().toISOString()
    })
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('ativo', true)
    .select()
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

module.exports = {
  listarTutores,
  buscarTutor,
  criarTutor,
  atualizarTutor,
  excluirTutor
}