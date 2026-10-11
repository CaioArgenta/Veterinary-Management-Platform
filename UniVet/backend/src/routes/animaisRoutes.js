const express = require('express')
const auth = require('../middlewares/auth')
const verificarPermissao = require('../middlewares/permissao')
const animaisController = require('../controllers/animaisController')

const router = express.Router()

router.use(auth)

router.get(
  '/',
  verificarPermissao('animais', 'visualizar'),
  animaisController.listar
)

router.get(
  '/:id',
  verificarPermissao('animais', 'visualizar'),
  animaisController.buscar
)

router.post(
  '/',
  verificarPermissao('animais', 'cadastrar'),
  animaisController.criar
)

router.put(
  '/:id',
  verificarPermissao('animais', 'editar'),
  animaisController.atualizar
)

router.delete(
  '/:id',
  verificarPermissao('animais', 'excluir'),
  animaisController.excluir
)

module.exports = router