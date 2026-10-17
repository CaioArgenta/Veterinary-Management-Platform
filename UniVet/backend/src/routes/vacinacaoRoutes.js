
const express = require('express')
const router = express.Router()

const auth = require('../middlewares/auth')
const verificarPermissao = require('../middlewares/permissao')
const vacinacaoController = require('../controllers/vacinacaoController')

router.use(auth)

router.get(
  '/',
  verificarPermissao('vacinacao', 'visualizar'),
  vacinacaoController.listar
)

router.get(
  '/:id',
  verificarPermissao('vacinacao', 'visualizar'),
  vacinacaoController.buscarPorId
)

router.post(
  '/',
  verificarPermissao('vacinacao', 'cadastrar'),
  vacinacaoController.cadastrar
)

module.exports = router
