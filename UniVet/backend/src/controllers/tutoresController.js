
const tutoresService = require('../services/tutoresService')

async function listarTutores(req, res) {
  try {
    const tutores = await tutoresService.listarTutores(
      req.supabase,
      req.estabelecimentoId
    )

    return res.status(200).json(tutores)
  } catch (error) {
    console.error(error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao listar tutores.'
    })
  }
}

async function buscarTutor(req, res) {
  try {
    const tutor = await tutoresService.buscarTutor(
      req.supabase,
      req.params.id,
      req.estabelecimentoId
    )

    if (!tutor) {
      return res.status(404).json({
        mensagem: 'Tutor não encontrado.'
      })
    }

    return res.status(200).json(tutor)
  } catch (error) {
    console.error(error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao buscar tutor.'
    })
  }
}

async function criarTutor(req, res) {
  try {
    const tutor = await tutoresService.criarTutor(
      req.supabase,
      req.body,
      req.estabelecimentoId
    )

    return res.status(201).json(tutor)
  } catch (error) {
    console.error(error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao criar tutor.'
    })
  }
}

async function atualizarTutor(req, res) {
  try {
    const tutor = await tutoresService.atualizarTutor(
      req.supabase,
      req.params.id,
      req.body,
      req.estabelecimentoId
    )

    if (!tutor) {
      return res.status(404).json({
        mensagem: 'Tutor não encontrado.'
      })
    }

    return res.status(200).json(tutor)
  } catch (error) {
    console.error(error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao atualizar tutor.'
    })
  }
}

async function excluirTutor(req, res) {
  try {
    const tutor = await tutoresService.excluirTutor(
      req.supabase,
      req.params.id,
      req.estabelecimentoId
    )

    if (!tutor) {
      return res.status(404).json({
        mensagem: 'Tutor não encontrado.'
      })
    }

    return res.status(200).json({
      mensagem: 'Tutor excluído com sucesso.'
    })
  } catch (error) {
    console.error(error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao excluir tutor.'
    })
  }
}

module.exports = {
  listarTutores,
  buscarTutor,
  criarTutor,
  atualizarTutor,
  excluirTutor
}
