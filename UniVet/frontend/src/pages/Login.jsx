import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/gps.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!email || !senha) {
      setErro('Preencha e-mail e senha para continuar.')
      return
    }

    setLoading(true)

    setTimeout(() => {
      navigate('/app/dashboard')
    }, 1200)
  }

  return (
    <div
      className="min-h-screen bg-[#F7F5F0] flex"
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      {/* Painel esquerdo */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] shrink-0 bg-[#0C4A45] flex-col justify-between p-12 relative overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-20 -left-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center overflow-hidden">
            <img
              src={logo}
              alt="UniVet"
              className="w-full h-full object-contain"
            />
          </div>

          <span className="text-white font-semibold text-xl">
            UniVet
          </span>
        </Link>

        {/* Conteúdo central */}
        <div className="relative z-10">
          <h2
            className="text-4xl font-normal text-white mb-4 leading-tight"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            Bem-vindo de
            <br />
            <em className="text-[#7DD3C8]">volta</em>
          </h2>

          <p className="text-[#7DD3C8] text-lg leading-relaxed mb-10">
            Seus pacientes estão esperando. Acesse sua conta e continue de
            onde parou.
          </p>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: '4.2k+', l: 'Veterinários ativos' },
              { n: '98k+', l: 'Animais cadastrados' },
              { n: '310k+', l: 'Consultas realizadas' },
              { n: '100%', l: 'Dados protegidos' },
            ].map((s) => (
              <div
                key={s.l}
                className="bg-white/10 rounded-xl p-4"
              >
                <p className="text-2xl font-bold text-white">
                  {s.n}
                </p>

                <p className="text-xs text-[#7DD3C8] mt-0.5">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <p className="text-white/30 text-xs relative z-10">
          © 2026 UniVet · Feito para veterinários brasileiros
        </p>
      </div>

      {/* Painel direito */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo mobile */}
        <Link
          to="/"
          className="flex items-center gap-2 mb-8 lg:hidden"
        >
          <div className="w-7 h-7 rounded-lg bg-[#0C4A45] flex items-center justify-center overflow-hidden">
            <img
              src={logo}
              alt="UniVet"
              className="w-full h-full object-contain"
            />
          </div>

          <span className="font-semibold text-[#0C1A1A] text-lg">
            UniVet
          </span>
        </Link>

        {/* Formulário */}
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1
              className="text-3xl font-normal text-[#0C1A1A] mb-2"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              Entrar na conta
            </h1>

            <p className="text-[#6B7280] text-sm">
              Não tem conta?{' '}
              <Link
                to="/cadastro"
                className="text-[#0C4A45] font-semibold hover:underline"
              >
                Criar gratuitamente
              </Link>
            </p>
          </div>

          {/* Erro */}
          {erro && (
            <div className="mb-5 flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3 text-sm">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                />
              </svg>

              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ana.souza@clinica.com.br"
                className="w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-3 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45] transition-all"
              />
            </div>

            {/* Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-[#0C1A1A]">
                  Senha
                </label>

                <a
                  href="#"
                  className="text-xs text-[#0C4A45] hover:underline font-medium"
                >
                  Esqueci a senha
                </a>
              </div>

              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-3 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45] transition-all pr-11"
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {mostrarSenha ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Lembrar */}
            <div className="flex items-center gap-2">
              <input
                id="lembrar"
                type="checkbox"
                className="w-4 h-4 rounded border-[#D8D5CE] accent-[#0C4A45] cursor-pointer"
              />

              <label
                htmlFor="lembrar"
                className="text-sm text-[#6B7280] cursor-pointer select-none"
              >
                Manter conectado por 30 dias
              </label>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0C4A45] text-white font-semibold py-3 rounded-[10px] hover:bg-[#0a3d38] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>

                  Entrando…
                </>
              ) : (
                'Entrar na conta'
              )}
            </button>
          </form>

          {/* Termos */}
          <div className="mt-8 pt-6 border-t border-[#EAE8E3] text-center">
            <p className="text-xs text-[#9CA3AF]">
              Ao entrar, você concorda com nossos{' '}
              <a
                href="#"
                className="text-[#0C4A45] hover:underline"
              >
                Termos de Uso
              </a>{' '}
              e{' '}
              <a
                href="#"
                className="text-[#0C4A45] hover:underline"
              >
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}