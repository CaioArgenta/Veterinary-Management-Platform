const supabase = require('../services/supabase')

async function auth(req, res, next) {
  try {
    const authorization = req.headers.authorization

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        mensagem: 'Token não informado.'
      })
    }

    const token = authorization.replace('Bearer ', '').trim()

    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({
        mensagem: 'Token inválido ou expirado.'
      })
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('id, estabelecimento_id, tipo, ativo')
      .eq('id', data.user.id)
      .maybeSingle()

    if (perfilError) {
      console.error(perfilError)

      return res.status(500).json({
        mensagem: 'Erro ao buscar perfil do usuário.'
      })
    }

    if (!perfil) {
      return res.status(403).json({
        mensagem: 'Perfil do usuário não encontrado.'
      })
    }

    if (!perfil.ativo) {
      return res.status(403).json({
        mensagem: 'Usuário inativo.'
      })
    }

    if (!perfil.estabelecimento_id) {
      return res.status(403).json({
        mensagem: 'Usuário não possui estabelecimento.'
      })
    }

    req.user = data.user
    req.perfil = perfil
    req.estabelecimentoId = perfil.estabelecimento_id

    next()
  } catch (error) {
    console.error(error)

    res.status(500).json({
      mensagem: 'Erro de autenticação.'
    })
  }
}

module.exports = auth