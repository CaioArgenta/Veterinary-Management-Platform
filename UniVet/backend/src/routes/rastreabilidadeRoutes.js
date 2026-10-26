const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const rastreabilidadeController = require('../controllers/rastreabilidadeController');

router.get('/', auth, rastreabilidadeController.listar);

module.exports = router;