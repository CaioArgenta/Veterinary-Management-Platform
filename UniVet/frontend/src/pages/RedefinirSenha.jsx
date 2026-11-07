
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import logo from '../assets/gps.png'

export default function RedefinirSenha() {
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [verificando, setVerificando] = useState(true)
  const [autorizado, setAutorizado] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    let ativo = true

    async function verificarSessao() {
      const parametros = new URLSearchParams(window.location.search)

      if (parametros.get('tipo') !== 'recuperacao') {
        if (ativo) {
          setErro('Link de recuperação inválido.')
          setVerificando(false)
        }
        return
      }

      const { data, error } = await supabase.auth.getSession()

      if (!ativo) return

      if (error || !data.session) {
        setErro('Link inválido ou expirado. Solicite uma nova recuperação de senha.')
      } else {
        setAutorizado(true)
      }

      setVerificando(false)
    }

    verificarSessao()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, session) => {
      if (evento === 'PASSWORD_RECOVERY' && session && ativo) {
        setAutorizado(true)
        setVerificando(false)
        setErro('')
      }
    })

    return () => {
      ativo = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: senha,
      })

      if (error) {
        throw error
      }

      await supabase.auth.signOut()

      setSucesso(true)
    } catch (error) {
      setErro(
        error.message || 'Não foi possível atualizar sua senha.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main
      className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-5 py-10"
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      <section className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0C4A45] overflow-hidden">
              <img src={logo} alt="UniVet" className="w-full h-full object-contain" />
            </div>

            <span className="text-xl font-semibold text-[#0C4A45]">
              UniVet
            </span>
          </Link>

          <h1
            className="text-3xl font-normal text-[#0C1A1A] mb-3"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            {sucesso ? 'Senha atualizada!' : 'Redefinir senha'}
          </h1>

          <p className="text-sm text-[#6B7280]">
            {sucesso
              ? 'Sua senha foi alterada. Você já pode entrar novamente na sua conta.'
              : 'Crie uma nova senha para acessar sua conta UniVet.'}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {verificando ? (
            <p className="text-center text-sm text-gray-600">
              Verificando link de recuperação...
            </p>
          ) : sucesso ? (
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="w-full bg-[#0C4A45] text-white font-semibold py-3.5 rounded-xl hover:bg-[#0A3D38]"
            >
              Ir para o login
            </button>
          ) : !autorizado ? (
            <div className="space-y-4">
              <div
                role="alert"
                className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm"
              >
                {erro}
              </div>

              <Link
                to="/login"
                className="block text-center text-sm font-semibold text-[#0C4A45] hover:underline"
              >
                Voltar para o login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {erro && (
                <div
                  role="alert"
                  className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm"
                >
                  {erro}
                </div>
              )}

              <div>
                <label
                  htmlFor="senha"
                  className="block text-sm font-semibold text-[#0C1A1A] mb-2"
                >
                  Nova senha
                </label>

                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={carregando}
                  className="w-full border border-[#D8D5CE] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="block text-sm font-semibold text-[#0C1A1A] mb-2"
                >
                  Confirmar nova senha
                </label>

                <input
                  id="confirmarSenha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Digite a senha novamente"
                  autoComplete="new-password"
                  required
                  disabled={carregando}
                  className="w-full border border-[#D8D5CE] rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/20"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={mostrarSenha}
                  onChange={(e) => setMostrarSenha(e.target.checked)}
                  className="accent-[#0C4A45]"
                />
                Mostrar senhas
              </label>

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-[#0C4A45] text-white font-semibold py-3.5 rounded-xl hover:bg-[#0A3D38] disabled:opacity-60"
              >
                {carregando ? 'Atualizando senha...' : 'Salvar nova senha'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} UniVet
        </p>
      </section>
    </main>
  )
}
