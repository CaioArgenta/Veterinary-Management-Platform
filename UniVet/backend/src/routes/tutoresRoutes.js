const express = require('express')

const auth = require('../middlewares/auth')
const verificarPermissao = require('../middlewares/permissao')
const tutoresController = require('../controllers/tutoresController')

const router = express.Router()

router.use(auth)

router.get(
  '/',
  verificarPermissao('tutores', 'visualizar'),
  tutoresController.listarTutores
)

router.get(
  '/:id',
  verificarPermissao('tutores', 'visualizar'),
  tutoresController.buscarTutor
)

router.post(
  '/',
  verificarPermissao('tutores', 'cadastrar'),
  tutoresController.criarTutor
)

router.put(
  '/:id',
  verificarPermissao('tutores', 'editar'),
  tutoresController.atualizarTutor
)

router.delete(
  '/:id',
  verificarPermissao('tutores', 'excluir'),
  tutoresController.excluirTutor
)

module.exports = router