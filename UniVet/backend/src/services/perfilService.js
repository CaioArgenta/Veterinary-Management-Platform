
const supabase = require('./supabase')

async function buscarPerfil(usuarioId) {
  const { data, error } = await supabase
    .from('perfis')
    .select(`
      id,
      nome_completo,
      email,
      telefone,
      tipo,
      crmv,
      estabelecimento_id,
      foto_path
    `)
    .eq('id', usuarioId)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    const erro = new Error('Perfil não encontrado.')
    erro.status = 404
    throw erro
  }

  return data
}

async function atualizarPerfil(usuarioId, dados) {
  const permitidos = ['nome_completo', 'telefone', 'foto_path']
  const camposRecebidos = Object.keys(dados || {})

  if (
    camposRecebidos.length === 0 ||
    camposRecebidos.some((campo) => !permitidos.includes(campo))
  ) {
    const erro = new Error('Dados inválidos para atualizar o perfil.')
    erro.status = 400
    throw erro
  }

  const atualizacao = {}

  if (Object.hasOwn(dados, 'nome_completo')) {
    const nome = dados.nome_completo

    if (
      typeof nome !== 'string' ||
      nome.trim().length < 3 ||
      nome.trim().length > 120
    ) {
      const erro = new Error('Informe um nome completo válido.')
      erro.status = 400
      throw erro
    }

    atualizacao.nome_completo = nome.trim()
  }

  if (Object.hasOwn(dados, 'telefone')) {
    const telefone = dados.telefone

    if (
      telefone !== null &&
      (typeof telefone !== 'string' || telefone.length > 20)
    ) {
      const erro = new Error('Telefone inválido.')
      erro.status = 400
      throw erro
    }

    atualizacao.telefone = telefone?.trim() || null
  }

  if (Object.hasOwn(dados, 'foto_path')) {
    const caminho = dados.foto_path

    if (caminho !== null) {
      const caminhoValido =
        typeof caminho === 'string' &&
        new RegExp(
          `^${usuarioId}/avatar\\.(jpg|jpeg|png|webp)$`
        ).test(caminho)

      if (!caminhoValido) {
        const erro = new Error('Caminho da foto inválido.')
        erro.status = 400
        throw erro
      }
    }

    atualizacao.foto_path = caminho
  }

  const { data, error } = await supabase
    .from('perfis')
    .update(atualizacao)
    .eq('id', usuarioId)
    .select(`
      id,
      nome_completo,
      email,
      telefone,
      tipo,
      crmv,
      estabelecimento_id,
      foto_path
    `)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    const erro = new Error('Não foi possível atualizar o perfil.')
    erro.status = 404
    throw erro
  }

  return data
}

module.exports = {
  buscarPerfil,
  atualizarPerfil,
}
