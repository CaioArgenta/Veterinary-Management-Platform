const express = require('express')

const auth = require('../middlewares/auth')
const verificarPermissao = require('../middlewares/permissao')
const funcionariosController = require('../controllers/funcionariosController')

const router = express.Router()

router.use(auth)

router.get(
  '/',
  verificarPermissao('funcionarios', 'visualizar'),
  funcionariosController.listar
)

router.post(
  '/',
  verificarPermissao('funcionarios', 'cadastrar'),
  funcionariosController.criar
)

router.put(
  '/:id',
  verificarPermissao('funcionarios', 'editar'),
  funcionariosController.atualizar
)

router.patch(
  '/:id/status',
  verificarPermissao('funcionarios', 'editar'),
  funcionariosController.alterarStatus
)

module.exports = router