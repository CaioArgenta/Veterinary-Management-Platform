const express = require('express')
const auth = require('../middlewares/auth')
const verificarPermissao = require('../middlewares/permissao')
const consultasController = require('../controllers/consultasController')

const router = express.Router()

router.use(auth)

router.get(
  '/veterinarios',
  verificarPermissao('consultas', 'visualizar'),
  consultasController.listarVeterinarios
)

router.get(
  '/',
  verificarPermissao('consultas', 'visualizar'),
  consultasController.listar
)

router.get(
  '/:id',
  verificarPermissao('consultas', 'visualizar'),
  consultasController.buscar
)

router.post(
  '/',
  verificarPermissao('consultas', 'cadastrar'),
  consultasController.criar
)

router.put(
  '/:id',
  verificarPermissao('consultas', 'editar'),
  consultasController.atualizar
)

module.exports = router