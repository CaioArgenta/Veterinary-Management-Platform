
const { createClient } = require('@supabase/supabase-js')

async function criarEstabelecimento(dados) {
  const url = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY

  console.log('URL carregada:', Boolean(url))
  console.log('Chave carregada:', Boolean(anonKey))

  if (!url || !anonKey) {
    throw new Error(
      'Configure SUPABASE_URL e SUPABASE_ANON_KEY no backend.'
    )
  }

  const supabase = createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${dados.token}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  const { data: usuario, error: usuarioError } =
    await supabase.auth.getUser(dados.token)

  if (usuarioError || !usuario.user) {
    const erro = new Error('Sessão inválida. Entre novamente.')
    erro.status = 401
    throw erro
  }

  const {
    nomeEstabelecimento,
    tipoEstabelecimento,
    nomeCompleto,
    telefone,
  } = dados

  const { data, error } = await supabase.rpc(
    'criar_estabelecimento_inicial',
    {
      p_nome_estabelecimento: nomeEstabelecimento,
      p_tipo_estabelecimento: tipoEstabelecimento,
      p_nome_completo: nomeCompleto,
      p_email: usuario.user.email,
      p_telefone: telefone || null,
      p_crmv: null,
    }
  )

  if (error) {
    console.error('Erro ao criar estabelecimento:', error.message)
    throw new Error(error.message)
  }

  return data
}

module.exports = {
  criarEstabelecimento,
}
