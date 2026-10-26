const consultasService = require('../services/consultasService')

async function listar(req, res) {
  try {
    const consultas = await consultasService.listarConsultas(
      req.estabelecimentoId
    )

    return res.json(consultas)
  } catch (error) {
    console.error('Erro ao listar consultas:', error)

    return res.status(500).json({
      mensagem: 'Erro ao listar consultas.'
    })
  }
}

async function listarVeterinarios(req, res) {
  try {
    const veterinarios = await consultasService.listarVeterinarios(
      req.estabelecimentoId
    )

    return res.json(veterinarios)
  } catch (error) {
    console.error('Erro ao listar veterinários:', error)

    return res.status(error.status || 500).json({
      mensagem: error.status ? error.message : 'Erro ao carregar veterinários.'
    })
  }
}

async function buscar(req, res) {
  try {
    const consulta = await consultasService.buscarConsulta(
      req.params.id,
      req.estabelecimentoId
    )

    if (!consulta) {
      return res.status(404).json({
        mensagem: 'Consulta não encontrada.'
      })
    }

    return res.json(consulta)
  } catch (error) {
    console.error('Erro ao buscar consulta:', error)

    return res.status(500).json({
      mensagem: 'Erro ao buscar consulta.'
    })
  }
}

async function criar(req, res) {
  try {
    if (!['ADMINISTRADOR', 'VETERINARIO'].includes(req.perfil.tipo)) {
      return res.status(403).json({
        mensagem: 'Somente administradores e veterinários podem registrar consultas.'
      })
    }

    const consulta = await consultasService.criarConsulta(
      req.body,
      req.estabelecimentoId
    )

    return res.status(201).json(consulta)
  } catch (error) {
    console.error('Erro ao criar consulta:', error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao criar consulta.'
    })
  }
}

async function atualizar(req, res) {
  try {
    const consulta = await consultasService.atualizarConsulta(
      req.params.id,
      req.body,
      req.estabelecimentoId
    )

    if (!consulta) {
      return res.status(404).json({
        mensagem: 'Consulta não encontrada.'
      })
    }

    return res.json(consulta)
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao atualizar consulta.'
    })
  }
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  listarVeterinarios
}