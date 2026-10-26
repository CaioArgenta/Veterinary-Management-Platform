
import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

async function requisicaoPerfil(caminho = '', opcoes = {}) {
  const {
    data: { session },
    error: sessaoError,
  } = await supabase.auth.getSession()

  if (sessaoError) {
    throw new Error('Não foi possível validar sua sessão.')
  }

  if (!session?.access_token) {
    throw new Error('Sua sessão expirou. Entre novamente.')
  }

  const resposta = await fetch(`${API_URL}/api/perfil${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...opcoes.headers,
    },
  })

  const dados = await resposta.json().catch(() => ({}))

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao acessar o perfil.')
  }

  return dados
}

export function buscarPerfil() {
  return requisicaoPerfil()
}

export function atualizarPerfil(dados) {
  return requisicaoPerfil('', {
    method: 'PATCH',
    body: JSON.stringify(dados),
  })
}
