const dashboardService = require('../services/dashboardService')

async function dashboard(req, res) {
  try {
    const dados = await dashboardService.buscarDashboard(
      req.estabelecimentoId
    )

    return res.status(200).json(dados)
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      mensagem: 'Erro ao carregar dashboard.'
    })
  }
}

module.exports = {
  dashboard
}