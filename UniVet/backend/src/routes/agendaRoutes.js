const express = require('express')
const auth = require('../middlewares/auth')
const verificarPermissao = require('../middlewares/permissao')
const agendaController = require('../controllers/agendaController')

const router = express.Router()

router.use(auth)

router.get(
  '/',
  verificarPermissao('agenda', 'visualizar'),
  agendaController.listar
)

router.get(
  '/:id',
  verificarPermissao('agenda', 'visualizar'),
  agendaController.buscarPorId
)

router.post(
  '/',
  verificarPermissao('agenda', 'cadastrar'),
  agendaController.criar
)

router.put(
  '/:id',
  verificarPermissao('agenda', 'editar'),
  agendaController.atualizar
)

module.exports = router