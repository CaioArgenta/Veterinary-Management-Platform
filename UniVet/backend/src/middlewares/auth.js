
const { createClient } = require('@supabase/supabase-js')
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
      console.error('Erro ao buscar perfil:', perfilError)

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

    const chavePublica =
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY

    if (!chavePublica) {
      console.error('Chave pública do Supabase não configurada.')

      return res.status(500).json({
        mensagem: 'Configuração do Supabase incompleta.'
      })
    }

    
      const supabaseUsuario = createClient(
        process.env.SUPABASE_URL,
        chavePublica,
        {
          global: {
            headers: { Authorization: `Bearer ${token}` }
          },
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        }
      )

      const { data: identidade, error: erroIdentidade } =
        await supabaseUsuario.rpc('testar_identidade_auditoria')

      console.log('Identidade reconhecida pelo banco:', identidade)
      console.log(
        'Erro no teste de identidade:',
        erroIdentidade?.message || null
      )


    req.user = data.user
    req.perfil = perfil
    req.estabelecimentoId = perfil.estabelecimento_id
    req.supabase = supabaseUsuario

    return next()
  } catch (error) {
    console.error('Erro de autenticação:', error)

    return res.status(500).json({
      mensagem: 'Erro de autenticação.'
    })
  }
}

module.exports = auth
