const express = require('express')

const auth = require('../middlewares/auth')
const perfilController = require('../controllers/perfilController')

const router = express.Router()

router.use(auth)

router.get('/', perfilController.buscarPerfil)
router.patch('/', perfilController.atualizarPerfil)

module.exports = router