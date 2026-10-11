
const animaisService = require('../services/animaisService')

async function listar(req, res) {
  try {
    const animais = await animaisService.listarAnimais(
      req.estabelecimentoId
    )

    return res.status(200).json(animais)
  } catch (error) {
    console.error(error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao listar animais.'
    })
  }
}

async function buscar(req, res) {
  try {
    const animal = await animaisService.buscarAnimal(
      req.params.id,
      req.estabelecimentoId
    )

    if (!animal) {
      return res.status(404).json({
        mensagem: 'Animal não encontrado.'
      })
    }

    return res.status(200).json(animal)
  } catch (error) {
    console.error(error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao buscar animal.'
    })
  }
}

async function criar(req, res) {
  try {
    const animal = await animaisService.criarAnimal(
      req.body,
      req.estabelecimentoId
    )

    return res.status(201).json(animal)
  } catch (error) {
    console.error(error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao cadastrar animal.'
    })
  }
}

async function atualizar(req, res) {
  try {
    const animal = await animaisService.atualizarAnimal(
      req.params.id,
      req.body,
      req.estabelecimentoId
    )

    if (!animal) {
      return res.status(404).json({
        mensagem: 'Animal não encontrado.'
      })
    }

    return res.status(200).json(animal)
  } catch (error) {
    console.error(error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao atualizar animal.'
    })
  }
}

async function excluir(req, res) {
  try {
    const animal = await animaisService.excluirAnimal(
      req.params.id,
      req.estabelecimentoId
    )

    if (!animal) {
      return res.status(404).json({
        mensagem: 'Animal não encontrado.'
      })
    }

    return res.status(200).json({
      mensagem: 'Animal excluído com sucesso.'
    })
  } catch (error) {
    console.error(error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Erro ao excluir animal.'
    })
  }
}

module.exports = {
  listar,
  buscar,
  criar,
  atualizar,
  excluir
}
