import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { buscarPerfil, atualizarPerfil } from '../services/perfil'

const TIPOS = {
  ADMINISTRADOR: 'Administrador',
  VETERINARIO: 'Veterinário',
  FUNCIONARIO: 'Funcionário',
}

const MAX_FOTO = 2 * 1024 * 1024

export default function Perfil() {
  const [perfil, setPerfil] = useState(null)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [removendoFoto, setRemovendoFoto] = useState(false)
  const [versaoFoto, setVersaoFoto] = useState(Date.now())
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [alterandoSenha, setAlterandoSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarPerfil()

        setPerfil(dados)
        setNome(dados.nome_completo || '')
        setTelefone(dados.telefone || '')
        setVersaoFoto(Date.now())
      } catch (error) {
        setErro(error.message)
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [])

  function mensagemErro(error) {
    return error?.message || 'Ocorreu um erro inesperado.'
  }

  function limparMensagens() {
    setErro('')
    setSucesso('')
  }

  async function salvar(event) {
    event.preventDefault()
    limparMensagens()
    setSalvando(true)

    try {
      const resposta = await atualizarPerfil({
        nome_completo: nome,
        telefone,
      })

      setPerfil((atual) => ({
        ...atual,
        ...resposta.perfil,
      }))

      setNome(resposta.perfil.nome_completo || '')
      setTelefone(resposta.perfil.telefone || '')
      setSucesso('Informações pessoais atualizadas.')
    } catch (error) {
      setErro(mensagemErro(error))
    } finally {
      setSalvando(false)
    }
  }

  async function enviarFoto(event) {
    const arquivo = event.target.files?.[0]
    event.target.value = ''

    if (!arquivo) return

    limparMensagens()

    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!tiposPermitidos.includes(arquivo.type)) {
      setErro('Escolha uma imagem JPG, PNG ou WebP.')
      return
    }

    if (arquivo.size > MAX_FOTO) {
      setErro('A foto deve ter no máximo 2 MB.')
      return
    }

    setEnviandoFoto(true)

    try {
      const {
        data: { user },
        error: usuarioErro,
      } = await supabase.auth.getUser()

      if (usuarioErro || !user) {
        throw new Error('Sua sessão expirou. Entre novamente.')
      }

      const extensao = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      }[arquivo.type]

      const caminho = `${user.id}/avatar.${extensao}`
      const caminhoAnterior = perfil?.foto_path

      const { error: uploadErro } = await supabase.storage
        .from('avatars')
        .upload(caminho, arquivo, {
          upsert: true,
          contentType: arquivo.type,
          cacheControl: '0',
        })

      if (uploadErro) throw uploadErro

      const resposta = await atualizarPerfil({
        foto_path: caminho,
      })

      setPerfil((atual) => ({
        ...atual,
        ...resposta.perfil,
      }))

      setVersaoFoto(Date.now())

      if (caminhoAnterior && caminhoAnterior !== caminho) {
        const { error: exclusaoErro } = await supabase.storage
          .from('avatars')
          .remove([caminhoAnterior])

        if (exclusaoErro) {
          console.error(
            'Não foi possível excluir a foto anterior:',
            exclusaoErro
          )
        }
      }

      setSucesso('Foto de perfil atualizada.')
    } catch (error) {
      setErro(mensagemErro(error))
    } finally {
      setEnviandoFoto(false)
    }
  }

  async function removerFoto() {
    if (!perfil?.foto_path) return

    limparMensagens()
    setRemovendoFoto(true)

    const caminhoAntigo = perfil.foto_path

    try {
      const resposta = await atualizarPerfil({
        foto_path: null,
      })

      setPerfil((atual) => ({
        ...atual,
        ...resposta.perfil,
        foto_path: null,
      }))

      setVersaoFoto(Date.now())

      const { error: exclusaoErro } = await supabase.storage
        .from('avatars')
        .remove([caminhoAntigo])

      if (exclusaoErro) {
        console.error('Erro ao excluir foto:', exclusaoErro)
        setSucesso(
          'Foto removida do perfil, mas não foi possível excluir o arquivo do Storage.'
        )
      } else {
        setSucesso('Foto de perfil removida.')
      }
    } catch (error) {
      setErro(mensagemErro(error))
    } finally {
      setRemovendoFoto(false)
    }
  }

  async function alterarSenha(event) {
    event.preventDefault()
    limparMensagens()

    if (senha.length < 8) {
      setErro('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setAlterandoSenha(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: senha,
      })

      if (error) throw error

      setSenha('')
      setConfirmarSenha('')
      setSucesso('Senha alterada com sucesso.')
    } catch (error) {
      setErro(mensagemErro(error))
    } finally {
      setAlterandoSenha(false)
    }
  }

  const primeiroNome = (perfil?.nome_completo || 'U')
    .trim()
    .split(' ')[0]

  const fotoUrl = perfil?.foto_path
    ? `${supabase.storage
        .from('avatars')
        .getPublicUrl(perfil.foto_path).data.publicUrl}?v=${versaoFoto}`
    : null

  if (carregando) {
    return (
      <div className="p-8 text-sm text-[#64716D]">
        Carregando perfil...
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className="m-6 rounded-xl bg-white p-6 text-sm text-red-600">
        {erro || 'Não foi possível carregar seu perfil.'}
      </div>
    )
  }

  return (
    <div
      className="min-h-full bg-[#F7F5F0] p-6 md:p-8"
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm text-[#71807B]">
            Conta e preferências
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#0C4A45]">
            Meu perfil
          </h1>
          <p className="mt-2 text-sm text-[#71807B]">
            Gerencie suas informações pessoais e de acesso.
          </p>
        </div>

        {erro && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            {erro}
          </p>
        )}

        {sucesso && (
          <p
            role="status"
            className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            {sucesso}
          </p>
        )}

        <section className="rounded-2xl border border-[#EAE8E3] bg-white p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {fotoUrl ? (
              <img
                key={fotoUrl}
                src={fotoUrl}
                alt="Foto do perfil"
                onError={() => {
                  setVersaoFoto(Date.now())
                }}
                className="h-20 w-20 rounded-full border border-[#EAE8E3] object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#D8EAE5] text-3xl font-semibold text-[#0C4A45]">
                {primeiroNome.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold text-[#183B36]">
                {perfil.nome_completo || 'Usuário'}
              </h2>
              <p className="text-sm text-[#71807B]">
                {TIPOS[perfil.tipo] || 'Usuário'}
              </p>
              <p className="mt-1 text-xs text-[#87928D]">
                JPG, PNG ou WebP · Máximo de 2 MB
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <label
                className={`cursor-pointer rounded-xl bg-[#0C4A45] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#083B37] ${
                  enviandoFoto
                    ? 'pointer-events-none opacity-60'
                    : ''
                }`}
              >
                {enviandoFoto ? 'Enviando...' : 'Alterar foto'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={enviarFoto}
                  disabled={enviandoFoto}
                  className="hidden"
                />
              </label>

              {perfil.foto_path && (
                <button
                  type="button"
                  onClick={removerFoto}
                  disabled={removendoFoto}
                  className="rounded-xl border border-[#DCDDD6] px-4 py-2.5 text-sm font-medium text-[#344C46] hover:bg-[#F7F5F0] disabled:opacity-60"
                >
                  {removendoFoto ? 'Removendo...' : 'Remover'}
                </button>
              )}
            </div>
          </div>
        </section>

        <form
          onSubmit={salvar}
          className="rounded-2xl border border-[#EAE8E3] bg-white p-6 md:p-8"
        >
          <h2 className="text-base font-semibold text-[#183B36]">
            Informações pessoais
          </h2>
          <p className="mt-1 text-sm text-[#71807B]">
            Atualize seu nome e telefone de contato.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#344C46]">
                Nome completo
              </span>
              <input
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
                minLength={3}
                maxLength={120}
                className="w-full rounded-xl border border-[#DCDDD6] px-4 py-3 text-sm outline-none focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/10"
                placeholder="Seu nome completo"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#344C46]">
                Telefone
              </span>
              <input
                type="tel"
                value={telefone}
                onChange={(event) => setTelefone(event.target.value)}
                maxLength={20}
                className="w-full rounded-xl border border-[#DCDDD6] px-4 py-3 text-sm outline-none focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/10"
                placeholder="(14) 99999-9999"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#344C46]">
                E-mail
              </span>
              <input
                type="email"
                value={perfil.email || ''}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-[#EAE8E3] bg-[#F7F7F4] px-4 py-3 text-sm text-[#71807B]"
              />
              <span className="mt-1 block text-xs text-[#87928D]">
                O e-mail é somente para consulta nesta tela.
              </span>
            </label>
          </div>

          <div className="mt-8 flex justify-end border-t border-[#EAE8E3] pt-5">
            <button
              type="submit"
              disabled={salvando}
              className="rounded-xl bg-[#0C4A45] px-5 py-3 text-sm font-semibold text-white hover:bg-[#083B37] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-[#EAE8E3] bg-white p-6 md:p-8">
          <h2 className="text-base font-semibold text-[#183B36]">
            Informações profissionais
          </h2>
          <p className="mt-1 text-sm text-[#71807B]">
            Dados do seu acesso e vínculo com o estabelecimento.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-[#344C46]">
                Tipo de usuário
              </p>
              <div className="rounded-xl border border-[#EAE8E3] bg-[#F7F7F4] px-4 py-3 text-sm text-[#71807B]">
                {TIPOS[perfil.tipo] || 'Usuário'}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[#344C46]">
                CRMV
              </p>
              <div className="rounded-xl border border-[#EAE8E3] bg-[#F7F7F4] px-4 py-3 text-sm text-[#71807B]">
                {perfil.crmv || 'Não informado'}
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-medium text-[#344C46]">
                Identificador do estabelecimento
              </p>
              <div className="break-all rounded-xl border border-[#EAE8E3] bg-[#F7F7F4] px-4 py-3 text-sm text-[#71807B]">
                {perfil.estabelecimento_id || 'Não vinculado'}
              </div>
            </div>
          </div>
        </section>

        <form
          onSubmit={alterarSenha}
          className="rounded-2xl border border-[#EAE8E3] bg-white p-6 md:p-8"
        >
          <h2 className="text-base font-semibold text-[#183B36]">
            Segurança
          </h2>
          <p className="mt-1 text-sm text-[#71807B]">
            Escolha uma nova senha para sua conta.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#344C46]">
                Nova senha
              </span>
              <input
                type="password"
                autoComplete="new-password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                minLength={8}
                required
                className="w-full rounded-xl border border-[#DCDDD6] px-4 py-3 text-sm outline-none focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/10"
                placeholder="Mínimo de 8 caracteres"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#344C46]">
                Confirmar nova senha
              </span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                minLength={8}
                required
                className="w-full rounded-xl border border-[#DCDDD6] px-4 py-3 text-sm outline-none focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/10"
                placeholder="Digite a senha novamente"
              />
            </label>
          </div>

          <div className="mt-8 flex justify-end border-t border-[#EAE8E3] pt-5">
            <button
              type="submit"
              disabled={alterandoSenha}
              className="rounded-xl bg-[#0C4A45] px-5 py-3 text-sm font-semibold text-white hover:bg-[#083B37] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {alterandoSenha ? 'Alterando...' : 'Alterar senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}