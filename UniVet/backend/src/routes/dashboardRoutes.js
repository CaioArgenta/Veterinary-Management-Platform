const express = require('express')

const auth = require('../middlewares/auth')
const dashboardController = require('../controllers/dashboardController')

const router = express.Router()

router.use(auth)

router.get('/', dashboardController.dashboard)

module.exports = router