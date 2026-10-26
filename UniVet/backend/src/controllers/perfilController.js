const perfilService = require('../services/perfilService')

async function buscarPerfil(req, res) {
  try {
    const perfil = await perfilService.buscarPerfil(
      req.perfil.id
    )

    return res.status(200).json(perfil)
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)

    return res.status(error.status || 500).json({
      mensagem: error.status
        ? error.message
        : 'Erro ao carregar perfil.'
    })
  }
}

async function atualizarPerfil(req, res) {
  try {
    const perfil = await perfilService.atualizarPerfil(
      req.perfil.id,
      req.body
    )

    return res.status(200).json({
      mensagem: 'Perfil atualizado com sucesso.',
      perfil
    })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)

    return res.status(error.status || 500).json({
      mensagem: error.status
        ? error.message
        : 'Erro ao atualizar perfil.'
    })
  }
}

module.exports = {
  buscarPerfil,
  atualizarPerfil
}