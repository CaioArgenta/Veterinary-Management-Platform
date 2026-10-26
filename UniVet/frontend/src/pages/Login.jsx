
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { entrar, recuperarSenha } from '../services/auth'
import logo from '../assets/gps.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recuperandoSenha, setRecuperandoSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')

    const emailInformado = email.trim()

    if (!emailInformado || !senha) {
      setErro('Preencha o e-mail e a senha para continuar.')
      return
    }

    setLoading(true)

    try {
      await entrar(emailInformado, senha)
      navigate('/app/dashboard', { replace: true })
    } catch (error) {
      setErro(error.message || 'Não foi possível entrar na sua conta.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRecuperarSenha() {
    setErro('')
    setMensagem('')

    if (!email.trim()) {
      setErro('Informe seu e-mail no campo acima para recuperar a senha.')
      return
    }

    setRecuperandoSenha(true)

    try {
      await recuperarSenha(email.trim())
      setMensagem(
        'Se o e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha.'
      )
    } catch (error) {
      setErro(error.message || 'Não foi possível solicitar a recuperação.')
    } finally {
      setRecuperandoSenha(false)
    }
  }

  return (
    <main
      className="min-h-screen bg-[#F7F5F0] flex"
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      <aside className="hidden lg:flex lg:w-[420px] xl:w-[500px] shrink-0 bg-[#0C4A45] flex-col justify-between p-10 xl:p-12 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none"
        />

        <div
          aria-hidden="true"
          className="absolute bottom-20 -left-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none"
        />

        <Link
          to="/"
          aria-label="UniVet - página inicial"
          className="flex items-center gap-3 relative z-10 w-fit"
        >
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center overflow-hidden">
            <img
              src={logo}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          <span className="text-white font-semibold text-xl">
            UniVet
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#7DD3C8] mb-5">
            Gestão veterinária
          </span>

          <h2
            className="text-4xl xl:text-5xl font-normal text-white mb-5 leading-tight"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            Cuidado que conecta.
            <br />
            <em className="text-[#7DD3C8]">Gestão que simplifica.</em>
          </h2>

          <p className="text-white/75 text-base xl:text-lg leading-relaxed">
            Organize tutores, pacientes, consultas e vacinações em um só lugar.
            Mais organização para você cuidar do que realmente importa.
          </p>

          <div className="mt-9 space-y-4">
            {[
              'Cadastro de tutores e animais',
              'Agenda e acompanhamento de consultas',
              'Prontuários e controle de vacinação',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-[#7DD3C8]">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  >
                    <path d="m4 10 4 4 8-8" />
                  </svg>
                </span>

                <span className="text-sm text-white/85">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs relative z-10">
          © {new Date().getFullYear()} UniVet
        </p>
      </aside>

      <section className="flex-1 flex flex-col items-center justify-center px-5 py-10 sm:px-8">
        <Link
          to="/"
          aria-label="UniVet - página inicial"
          className="flex items-center gap-2.5 mb-10 lg:hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0C4A45] flex items-center justify-center overflow-hidden">
            <img
              src={logo}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          <span className="font-semibold text-[#0C1A1A] text-xl">
            UniVet
          </span>
        </Link>

        <div className="w-full max-w-[410px]">
          <header className="mb-8">
            <p className="text-sm font-medium text-[#0C4A45] mb-2">
              Bem-vindo de volta
            </p>

            <h1
              className="text-3xl sm:text-4xl font-normal text-[#0C1A1A] mb-3"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              Entrar na conta
            </h1>

            <p className="text-[#6B7280] text-sm leading-relaxed">
              Acesse sua conta para continuar gerenciando sua rotina
              veterinária.
            </p>
          </header>

          {erro && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-5 flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>

              <p className="text-sm leading-relaxed">{erro}</p>
            </div>
          )}

          {mensagem && (
            <div
              role="status"
              aria-live="polite"
              className="mb-5 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <path d="m4 10 4 4 8-8" />
              </svg>

              <p className="text-sm leading-relaxed">{mensagem}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#0C1A1A] mb-2"
              >
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErro('')
                  setMensagem('')
                }}
                placeholder="voce@clinica.com.br"
                required
                disabled={loading}
                className="w-full bg-white border border-[#D8D5CE] rounded-xl px-4 py-3.5 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#0C4A45]/20 focus:border-[#0C4A45] transition-colors disabled:opacity-60"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <label
                  htmlFor="senha"
                  className="block text-sm font-semibold text-[#0C1A1A]"
                >
                  Senha
                </label>

                <button
                  type="button"
                  onClick={handleRecuperarSenha}
                  disabled={loading || recuperandoSenha}
                  className="text-xs font-semibold text-[#0C4A45] hover:underline disabled:opacity-50"
                >
                  {recuperandoSenha
                    ? 'Enviando...'
                    : 'Esqueci a senha'}
                </button>
              </div>

              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => {
                    setSenha(e.target.value)
                    setErro('')
                  }}
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                  className="w-full bg-white border border-[#D8D5CE] rounded-xl px-4 py-3.5 pr-12 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#0C4A45]/20 focus:border-[#0C4A45] transition-colors disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha((valor) => !valor)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={mostrarSenha}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#6B7280] hover:text-[#0C4A45] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30"
                >
                  {mostrarSenha ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                      <path d="M9.9 5.2A10.8 10.8 0 0112 5c7 0 10 7 10 7a16 16 0 01-3.1 4.2" />
                      <path d="M6.2 6.2C3.5 8 2 12 2 12s3 7 10 7a10.8 10.8 0 004.1-.8" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="w-5 h-5"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || recuperandoSenha}
              className="w-full min-h-[50px] bg-[#0C4A45] text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-[#0A3D38] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/40 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>

                  Entrando na conta...
                </>
              ) : (
                'Entrar na conta'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B7280]">
              Ainda não tem conta?{' '}
              <Link
                to="/cadastro"
                className="font-semibold text-[#0C4A45] hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </div>

          <footer className="mt-9 pt-6 border-t border-[#EAE8E3] text-center">
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Ao entrar, você concorda com os nossos{' '}
              <Link
                to="/termos"
                className="text-[#0C4A45] hover:underline"
              >
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link
                to="/privacidade"
                className="text-[#0C4A45] hover:underline"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </footer>
        </div>
      </section>
    </main>
  )
}
