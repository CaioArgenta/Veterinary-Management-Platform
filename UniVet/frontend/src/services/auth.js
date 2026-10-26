
import { supabase } from './supabase'

export async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  })

  if (error) {
    const mensagem = error.message.toLowerCase()

    if (mensagem.includes('invalid login credentials')) {
      throw new Error('E-mail ou senha incorretos.')
    }

    if (mensagem.includes('email not confirmed')) {
      throw new Error('Confirme seu e-mail antes de entrar.')
    }

    throw new Error('Não foi possível entrar. Tente novamente.')
  }

  if (!data.user) {
    throw new Error('Não foi possível identificar o usuário.')
  }

  try {
    await configurarPerfil(data.user)
  } catch (error) {
    await supabase.auth.signOut()
    throw error
  }

  return data.user
}

async function configurarPerfil(user) {
  const { data: perfil, error } = await supabase
    .from('perfis')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw new Error('Erro ao verificar o perfil do usuário.')
  }

  if (perfil) {
    return
  }

  const metadata = user.user_metadata || {}

  if (
    !metadata.nome_estabelecimento ||
    !metadata.tipo_estabelecimento ||
    !metadata.nome_completo
  ) {
    throw new Error(
      'Os dados do cadastro não foram encontrados. Entre em contato com o suporte.'
    )
  }

  const { error: cadastroError } = await supabase.rpc(
    'criar_estabelecimento_inicial',
    {
      p_nome_estabelecimento: metadata.nome_estabelecimento,
      p_tipo_estabelecimento: metadata.tipo_estabelecimento,
      p_nome_completo: metadata.nome_completo,
      p_email: user.email,
      p_telefone: metadata.telefone || null,
      p_crmv: metadata.crmv || null,
    }
  )

  if (cadastroError) {
    throw new Error('Não foi possível configurar seu perfil.')
  }

  const { data: novoPerfil, error: novoPerfilError } = await supabase
    .from('perfis')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (novoPerfilError || !novoPerfil) {
    throw new Error(
      'O perfil não foi encontrado após a configuração inicial.'
    )
  }
}

export async function recuperarSenha(email) {
  if (!email.trim()) {
    throw new Error('Informe seu e-mail para recuperar a senha.')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim(),
    {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    }
  )

  if (error) {
    throw new Error('Não foi possível enviar o e-mail de recuperação.')
  }
}
