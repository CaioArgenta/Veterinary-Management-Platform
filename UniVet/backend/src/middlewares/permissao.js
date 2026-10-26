const supabase = require('../services/supabase')

function verificarPermissao(modulo, acao) {
  return async (req, res, next) => {
    try {
      if (!req.perfil || !req.perfil.id || !req.estabelecimentoId) {
        return res.status(401).json({
          mensagem: 'Usuário não autenticado corretamente.'
        })
      }

      if (req.perfil.tipo === 'ADMINISTRADOR') {
        return next()
      }

      const acoes = {
        visualizar: 'pode_visualizar',
        cadastrar: 'pode_cadastrar',
        editar: 'pode_editar',
        excluir: 'pode_excluir'
      }

      const coluna = acoes[acao]

      if (!coluna) {
        return res.status(400).json({
          mensagem: 'Permissão inválida.'
        })
      }

      const { data, error } = await supabase
        .from('permissoes_funcionarios')
        .select(coluna)
        .eq('perfil_id', req.perfil.id)
        .eq('estabelecimento_id', req.estabelecimentoId)
        .eq('modulo', modulo)
        .maybeSingle()

      if (error) {
        console.error('Erro ao consultar permissões:', error)

        return res.status(500).json({
          mensagem: 'Erro ao verificar permissão.'
        })
      }

      if (!data || data[coluna] !== true) {
        return res.status(403).json({
          mensagem: 'Você não tem permissão para realizar esta ação.'
        })
      }

      return next()
    } catch (error) {
      console.error('Erro no middleware de permissões:', error)

      return res.status(500).json({
        mensagem: 'Erro ao verificar permissão.'
      })
    }
  }
}

module.exports = verificarPermissao