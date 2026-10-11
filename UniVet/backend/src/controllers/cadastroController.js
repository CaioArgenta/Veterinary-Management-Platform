const cadastroService = require('../services/cadastroService')

async function criarEstabelecimento(req, res) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        mensagem: 'Faça login para concluir o cadastro.',
      })
    }

    const { nomeEstabelecimento, tipoEstabelecimento, nomeCompleto, telefone } = req.body

    if (
      !nomeEstabelecimento?.trim() ||
      !tipoEstabelecimento ||
      !nomeCompleto?.trim()
    ) {
      return res.status(400).json({
        mensagem: 'Preencha os campos obrigatórios.',
      })
    }

    const estabelecimento = await cadastroService.criarEstabelecimento({
      token,
      nomeEstabelecimento: nomeEstabelecimento.trim(),
      tipoEstabelecimento,
      nomeCompleto: nomeCompleto.trim(),
      telefone: telefone?.trim() || null,
    })

    return res.status(201).json({
      mensagem: 'Estabelecimento cadastrado com sucesso.',
      estabelecimento,
    })
  } catch (error) {
    console.error('Erro ao cadastrar estabelecimento:', error)

    return res.status(error.status || 500).json({
      mensagem: error.message || 'Não foi possível cadastrar o estabelecimento.',
    })
  }
}

module.exports = {
  criarEstabelecimento,
}
