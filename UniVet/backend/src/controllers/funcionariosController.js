const funcionariosService = require('../services/funcionariosService')

function responderErro(res, error, mensagemErro) {
  console.error(mensagemErro, error)

  const status = Number.isInteger(error.status)
    ? error.status
    : 500

  return res.status(status).json({
    mensagem:
      status !== 500 && error.message
        ? error.message
        : mensagemErro
  })
}

async function executar(res, operacao, mensagemErro, statusSucesso = 200) {
  try {
    const resultado = await operacao()
    return res.status(statusSucesso).json(resultado)
  } catch (error) {
    return responderErro(res, error, mensagemErro)
  }
}

function listar(req, res) {
  return executar(
    res,
    () => funcionariosService.listarFuncionarios(
      req.estabelecimentoId
    ),
    'Erro ao listar funcionários.'
  )
}

function criar(req, res) {
  return executar(
    res,
    () => funcionariosService.criarFuncionario(
      req.body,
      req.estabelecimentoId
    ),
    'Erro ao cadastrar funcionário.',
    201
  )
}

async function atualizar(req, res) {
  try {
    const funcionario =
      await funcionariosService.atualizarFuncionario(
        req.params.id,
        req.body,
        req.estabelecimentoId
      )

    if (!funcionario) {
      return res.status(404).json({
        mensagem: 'Funcionário não encontrado.'
      })
    }

    return res.status(200).json(funcionario)
  } catch (error) {
    return responderErro(
      res,
      error,
      'Erro ao atualizar funcionário.'
    )
  }
}

async function alterarStatus(req, res) {
  try {
    const funcionario =
      await funcionariosService.alterarStatusFuncionario(
        req.params.id,
        req.body.ativo,
        req.estabelecimentoId
      )

    if (!funcionario) {
      return res.status(404).json({
        mensagem: 'Funcionário não encontrado.'
      })
    }

    return res.status(200).json(funcionario)
  } catch (error) {
    return responderErro(
      res,
      error,
      'Erro ao alterar situação do funcionário.'
    )
  }
}

module.exports = {
  listar,
  criar,
  atualizar,
  alterarStatus
}