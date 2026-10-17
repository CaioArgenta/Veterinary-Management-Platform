const rastreabilidadeService = require('../services/rastreabilidadeService');

async function listar(req, res) {
  try {
    const estabelecimentoId = req.estabelecimentoId;

    if (!estabelecimentoId) {
      return res.status(403).json({
        mensagem: 'Estabelecimento não identificado.',
      });
    }

    const resultado = await rastreabilidadeService.listarLogs(
      estabelecimentoId,
      {
        pagina: req.query.pagina,
        limite: req.query.limite,
        acao: req.query.acao,
        tabela: req.query.tabela,
        dataInicio: req.query.dataInicio,
        dataFim: req.query.dataFim,
      }
    );

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro ao listar rastreabilidade:', error);

    return res.status(500).json({
      mensagem: 'Não foi possível carregar a rastreabilidade.',
    });
  }
}

module.exports = {
  listar,
};