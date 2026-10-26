const agendaService = require('../services/agendaService')

function registrarErro(contexto, error) {
  console.error(`Erro ${contexto}:`, error.message)
  console.error('Código:', error.code || 'Não informado')
  console.error('Detalhes:', error.details || 'Não informado')
  console.error('Hint:', error.hint || 'Não informado')
}

function responderErro(res, mensagem, error) {
  const status = error.status || 500

  return res.status(status).json({
    mensagem: status === 500 ? mensagem : error.message,
    ...(status === 500 ? { detalhe: error.message } : {})
  })
}

async function listar(req, res) {
  try {
    const consultas = await agendaService.listar(
      req.estabelecimentoId,
      {
        data: req.query.data,
        data_inicio: req.query.data_inicio,
        data_fim: req.query.data_fim,
        status: req.query.status
      }
    )

    return res.status(200).json(consultas)
  } catch (error) {
    registrarErro('ao carregar agenda', error)

    return responderErro(
      res,
      'Erro ao carregar a agenda.',
      error
    )
  }
}

async function buscarPorId(req, res) {
  try {
    const consulta = await agendaService.buscarPorId(
      req.params.id,
      req.estabelecimentoId
    )

    if (!consulta) {
      return res.status(404).json({
        mensagem: 'Consulta não encontrada.'
      })
    }

    return res.status(200).json(consulta)
  } catch (error) {
    registrarErro('ao buscar consulta', error)

    return responderErro(
      res,
      'Erro ao buscar consulta.',
      error
    )
  }
}

async function criar(req, res) {
  try {
    const consulta = await agendaService.criar(
      req.body,
      req.estabelecimentoId
    )

    return res.status(201).json(consulta)
  } catch (error) {
    registrarErro('ao criar consulta', error)

    return responderErro(
      res,
      'Erro ao criar consulta.',
      error
    )
  }
}

async function atualizar(req, res) {
  try {
    const consulta = await agendaService.atualizar(
      req.params.id,
      req.body,
      req.estabelecimentoId
    )

    if (!consulta) {
      return res.status(404).json({
        mensagem: 'Consulta não encontrada.'
      })
    }

    return res.status(200).json(consulta)
  } catch (error) {
    registrarErro('ao atualizar consulta', error)

    return responderErro(
      res,
      'Erro ao atualizar consulta.',
      error
    )
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar
}