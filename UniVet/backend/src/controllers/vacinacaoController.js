const vacinacaoService = require('../services/vacinacaoService')

function responderErro(res, error, mensagem) {
  console.error(mensagem, error)

  return res.status(error.status || 500).json({
    mensagem: error.status
      ? error.message
      : mensagem
  })
}

async function listar(req, res) {
  try {
    const vacinacoes = await vacinacaoService.listar(
      req.estabelecimentoId
    )

    return res.status(200).json(vacinacoes)
  } catch (error) {
    return responderErro(
      res,
      error,
      'Erro ao listar vacinações.'
    )
  }
}

async function buscarPorId(req, res) {
  try {
    const vacinacao = await vacinacaoService.buscarPorId(
      req.params.id,
      req.estabelecimentoId
    )

    if (!vacinacao) {
      return res.status(404).json({
        mensagem: 'Vacinação não encontrada.'
      })
    }

    return res.status(200).json(vacinacao)
  } catch (error) {
    return responderErro(
      res,
      error,
      'Erro ao buscar vacinação.'
    )
  }
}

async function cadastrar(req, res) {
  try {
    const vacinacao = await vacinacaoService.cadastrar(
      req.body,
      req.estabelecimentoId
    )

    return res.status(201).json(vacinacao)
  } catch (error) {
    return responderErro(
      res,
      error,
      'Erro ao registrar vacinação.'
    )
  }
}

module.exports = {
  listar,
  buscarPorId,
  cadastrar
}
