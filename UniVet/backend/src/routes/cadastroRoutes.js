const express = require('express')
const cadastroController = require('../controllers/cadastroController')

const router = express.Router()

router.post('/estabelecimento', cadastroController.criarEstabelecimento)

module.exports = router
