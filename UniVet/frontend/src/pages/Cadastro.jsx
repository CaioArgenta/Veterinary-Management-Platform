import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/gps.png'
import { supabase } from '../services/supabase'

const UFS = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG',
  'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR',
  'RS', 'SC', 'SE', 'SP', 'TO',
]

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map(s => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              s < current
                ? 'bg-[#0C4A45] text-white'
                : s === current
                  ? 'bg-[#0C4A45] text-white ring-4 ring-[#0C4A45]/20'
                  : 'bg-[#EAE8E3] text-[#9CA3AF]'
            }`}
          >
            {s < current ? (
              <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
                <polyline
                  points="2 6 5 9 10 3"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              s
            )}
          </div>

          {s < total && (
            <div
              className={`h-0.5 w-10 rounded-full transition-all ${
                s < current ? 'bg-[#0C4A45]' : 'bg-[#EAE8E3]'
              }`}
            />
          )}
        </div>
      ))}

      <span className="text-xs text-[#9CA3AF] ml-1">
        Passo {current} de {total}
      </span>
    </div>
  )
}

function PasswordStrength({ senha }) {
  const strength = (() => {
    if (!senha) return 0

    let score = 0

    if (senha.length >= 8) score++
    if (/[A-Z]/.test(senha)) score++
    if (/[0-9]/.test(senha)) score++
    if (/[^A-Za-z0-9]/.test(senha)) score++

    return score
  })()

  const labels = ['', 'Fraca', 'Razoável', 'Boa', 'Forte']

  const colors = [
    '',
    'bg-rose-400',
    'bg-amber-400',
    'bg-blue-400',
    'bg-emerald-500',
  ]

  if (!senha) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${
              i <= strength ? colors[strength] : 'bg-[#EAE8E3]'
            }`}
          />
        ))}
      </div>

      <p
        className={`text-xs ${
          strength <= 1
            ? 'text-rose-500'
            : strength === 2
              ? 'text-amber-500'
              : strength === 3
                ? 'text-blue-500'
                : 'text-emerald-600'
        }`}
      >
        Senha {labels[strength]}
      </p>
    </div>
  )
}

export default function Cadastro() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erros, setErros] = useState({})
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmSenha: '',
    perfil: '',
    crmv: '',
    crmvUF: '',
    nomeEstabelecimento: '',
    tipoEstabelecimento: '',
  })

  function set(field, value) {
    setForm(f => ({
      ...f,
      [field]: value,
    }))

    setErros(e => ({
      ...e,
      [field]: '',
      geral: '',
    }))
  }

  function formatTelefone(v) {
    const n = v.replace(/\D/g, '').slice(0, 11)

    if (n.length <= 10) {
      return n
        .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
        .replace(/-$/, '')
    }

    return n
      .replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
      .replace(/-$/, '')
  }

  function validateStep1() {
    const e = {}

    if (!form.nome.trim()) {
      e.nome = 'Nome completo é obrigatório.'
    }

    if (!form.email.trim()) {
      e.email = 'E-mail é obrigatório.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'E-mail inválido.'
    }

    if (!form.senha) {
      e.senha = 'Senha é obrigatória.'
    } else if (form.senha.length < 8) {
      e.senha = 'A senha deve ter pelo menos 8 caracteres.'
    }

    if (!form.confirmSenha) {
      e.confirmSenha = 'Confirme sua senha.'
    } else if (form.senha !== form.confirmSenha) {
      e.confirmSenha = 'As senhas não coincidem.'
    }

    setErros(e)

    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e = {}

    if (!form.nomeEstabelecimento.trim()) {
      e.nomeEstabelecimento = 'Nome do estabelecimento é obrigatório.'
    }

    if (!form.tipoEstabelecimento) {
      e.tipoEstabelecimento = 'Selecione o tipo do estabelecimento.'
    }

    if (!form.perfil) {
      e.perfil = 'Selecione seu perfil.'
    }

    if (form.perfil === 'veterinario') {
      if (!form.crmv.trim()) {
        e.crmv = 'CRMV é obrigatório para veterinários.'
      } else if (!/^\d{3,6}$/.test(form.crmv.trim())) {
        e.crmv = 'CRMV deve conter apenas números (3–6 dígitos).'
      }

      if (!form.crmvUF) {
        e.crmvUF = 'Selecione o estado do CRMV.'
      }
    }

    setErros(e)

    return Object.keys(e).length === 0
  }

  function handleNext() {
    if (validateStep1()) {
      setStep(2)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!validateStep2()) return

    setLoading(true)
    setErros({})

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.senha,
        options: {
          data: {
            nome_completo: form.nome.trim(),
            telefone: form.telefone || null,
            perfil: form.perfil,
            crmv:
            form.perfil === 'veterinario'
              ? `${form.crmv}/${form.crmvUF}`
              : null,
            nome_estabelecimento: form.nomeEstabelecimento.trim(),
            tipo_estabelecimento: form.tipoEstabelecimento,
          },
        emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) {
        if (error.message.toLowerCase().includes('already registered')) {
          throw new Error('Este e-mail já está cadastrado.')
        }

        throw error
      }

      if (!data.user) {
        throw new Error('Não foi possível criar a conta.')
      }

      if (!data.session) {
        throw new Error(
          'Conta criada, mas é necessário confirmar o e-mail antes de entrar.'
        )
      }

      const { error: estabelecimentoError } = await supabase.rpc(
        'criar_estabelecimento_inicial',
        {
          p_nome_estabelecimento: form.nomeEstabelecimento.trim(),
          p_tipo_estabelecimento: form.tipoEstabelecimento,
          p_nome_completo: form.nome.trim(),
          p_email: form.email.trim(),
          p_telefone: form.telefone || null,
          p_crmv:
            form.perfil === 'veterinario'
              ? `${form.crmv}/${form.crmvUF}`
              : null,
        }
      )

      if (estabelecimentoError) {
        throw estabelecimentoError
      }

      navigate('/app/dashboard')
    } catch (error) {
      console.error('Erro no cadastro:', error)

      setErros({
        geral: error.message || 'Não foi possível criar sua conta.',
      })
    } finally {
      setLoading(false)
    }
  }

  const isVet = form.perfil === 'veterinario'

  return (
    <div
      className="min-h-screen bg-[#F7F5F0] flex"
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0 bg-[#0C4A45] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-10 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center overflow-hidden">
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

        <div className="relative z-10">
          <h2
            className="text-4xl font-normal text-white mb-4 leading-tight"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            Comece hoje,
            <br />
            <em className="text-[#7DD3C8]">gratuitamente</em>
          </h2>

          <p className="text-[#7DD3C8] text-lg leading-relaxed mb-10">
            Crie sua conta e organize sua prática veterinária desde o primeiro dia.
          </p>

          <div className="space-y-4">
            {[
              'Tutores e animais organizados',
              'Prontuário eletrônico',
              'Agenda veterinária',
              'Dados protegidos',
              'Acesso ao sistema após o cadastro',
            ].map(text => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#7DD3C8]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#7DD3C8] text-xs font-bold">
                    ✓
                  </span>
                </div>

                <p className="text-[#7DD3C8] text-sm">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs relative z-10">
          © 2026 UniVet
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        <Link
          to="/"
          className="flex items-center gap-2 mb-8 lg:hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0C4A45] flex items-center justify-center overflow-hidden">
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

        <div className="w-full max-w-[440px]">
          <div className="mb-6">
            <h1
              className="text-3xl font-normal text-[#0C1A1A] mb-1"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              {step === 1
                ? 'Criar sua conta'
                : 'Seu estabelecimento'}
            </h1>

            <p className="text-[#6B7280] text-sm">
              {step === 1 ? (
                <>
                  Já tem conta?{' '}
                  <Link
                    to="/login"
                    className="text-[#0C4A45] font-semibold hover:underline"
                  >
                    Entrar
                  </Link>
                </>
              ) : (
                'Quase lá! Só mais alguns detalhes.'
              )}
            </p>
          </div>

          <StepIndicator current={step} total={2} />

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
                  Nome completo <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  value={form.nome}
                  onChange={e => set('nome', e.target.value)}
                  placeholder="Dra. Ana Souza"
                  className={`w-full bg-white border rounded-[10px] px-4 py-3 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 transition-all ${
                    erros.nome
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-[#D8D5CE] focus:ring-[#0C4A45]/30 focus:border-[#0C4A45]'
                  }`}
                />

                {erros.nome && (
                  <p className="text-xs text-rose-500 mt-1">
                    {erros.nome}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
                  E-mail <span className="text-rose-500">*</span>
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="ana@clinica.com.br"
                  className={`w-full bg-white border rounded-[10px] px-4 py-3 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 transition-all ${
                    erros.email
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-[#D8D5CE] focus:ring-[#0C4A45]/30 focus:border-[#0C4A45]'
                  }`}
                />

                {erros.email && (
                  <p className="text-xs text-rose-500 mt-1">
                    {erros.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
                  Telefone
                </label>

                <input
                  type="tel"
                  value={form.telefone}
                  onChange={e =>
                    set('telefone', formatTelefone(e.target.value))
                  }
                  placeholder="(11) 99999-9999"
                  className="w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-3 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
                  Senha <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={form.senha}
                    onChange={e => set('senha', e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={`w-full bg-white border rounded-[10px] px-4 py-3 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 transition-all pr-11 ${
                      erros.senha
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-[#D8D5CE] focus:ring-[#0C4A45]/30 focus:border-[#0C4A45]'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                  >
                    {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                <PasswordStrength senha={form.senha} />

                {erros.senha && (
                  <p className="text-xs text-rose-500 mt-1">
                    {erros.senha}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
                  Confirmar senha <span className="text-rose-500">*</span>
                </label>

                <input
                  type="password"
                  value={form.confirmSenha}
                  onChange={e =>
                    set('confirmSenha', e.target.value)
                  }
                  placeholder="••••••••"
                  className={`w-full bg-white border rounded-[10px] px-4 py-3 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 transition-all ${
                    erros.confirmSenha
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-[#D8D5CE] focus:ring-[#0C4A45]/30 focus:border-[#0C4A45]'
                  }`}
                />

                {erros.confirmSenha && (
                  <p className="text-xs text-rose-500 mt-1">
                    {erros.confirmSenha}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-[#0C4A45] text-white font-semibold py-3 rounded-[10px] hover:bg-[#0a3d38] transition-colors text-sm"
              >
                Continuar →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {erros.geral && (
                <div className="p-3 rounded-[10px] bg-rose-50 border border-rose-200">
                  <p className="text-sm text-rose-600">
                    {erros.geral}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
                  Nome do estabelecimento{' '}
                  <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  value={form.nomeEstabelecimento}
                  onChange={e =>
                    set('nomeEstabelecimento', e.target.value)
                  }
                  placeholder="Clínica Vet Vida"
                  className={`w-full bg-white border rounded-[10px] px-4 py-3 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 transition-all ${
                    erros.nomeEstabelecimento
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-[#D8D5CE] focus:ring-[#0C4A45]/30 focus:border-[#0C4A45]'
                  }`}
                />

                {erros.nomeEstabelecimento && (
                  <p className="text-xs text-rose-500 mt-1">
                    {erros.nomeEstabelecimento}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
                  Tipo do estabelecimento{' '}
                  <span className="text-rose-500">*</span>
                </label>

                <select
                  value={form.tipoEstabelecimento}
                  onChange={e =>
                    set('tipoEstabelecimento', e.target.value)
                  }
                  className={`w-full bg-white border rounded-[10px] px-4 py-3 text-sm text-[#0C1A1A] focus:outline-none focus:ring-2 transition-all ${
                    erros.tipoEstabelecimento
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-[#D8D5CE] focus:ring-[#0C4A45]/30 focus:border-[#0C4A45]'
                  }`}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="CLINICA">Clínica</option>
                  <option value="CONSULTORIO">Consultório</option>
                  <option value="HOSPITAL">Hospital</option>
                  <option value="AUTONOMO">Autônomo</option>
                </select>

                {erros.tipoEstabelecimento && (
                  <p className="text-xs text-rose-500 mt-1">
                    {erros.tipoEstabelecimento}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0C1A1A] mb-2">
                  Qual é o seu perfil?{' '}
                  <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: 'veterinario',
                      label: 'Veterinário(a)',
                      icon: '🩺',
                    },
                    {
                      value: 'outro',
                      label: 'Outro profissional',
                      icon: '👤',
                    },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('perfil', opt.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        form.perfil === opt.value
                          ? 'border-[#0C4A45] bg-[#E8F4F0]'
                          : 'border-[#D8D5CE] bg-white hover:border-[#0C4A45]/40'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>

                      <span className="text-sm font-medium text-[#0C1A1A]">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>

                {erros.perfil && (
                  <p className="text-xs text-rose-500 mt-1">
                    {erros.perfil}
                  </p>
                )}
              </div>

              {isVet && (
                <div className="p-4 bg-[#E8F4F0] rounded-xl border border-[#0C4A45]/20 space-y-3">
                  <p className="text-xs font-semibold text-[#0C4A45]">
                    Registro profissional
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                        Número do CRMV{' '}
                        <span className="text-rose-500">*</span>
                      </label>

                      <input
                        type="text"
                        inputMode="numeric"
                        value={form.crmv}
                        onChange={e =>
                          set(
                            'crmv',
                            e.target.value
                              .replace(/\D/g, '')
                              .slice(0, 6)
                          )
                        }
                        placeholder="12345"
                        className="w-full bg-white border border-[#D8D5CE] rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45]"
                      />

                      {erros.crmv && (
                        <p className="text-xs text-rose-500 mt-1">
                          {erros.crmv}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                        UF <span className="text-rose-500">*</span>
                      </label>

                      <select
                        value={form.crmvUF}
                        onChange={e =>
                          set('crmvUF', e.target.value)
                        }
                        className="w-full bg-white border border-[#D8D5CE] rounded-[10px] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45]"
                      >
                        <option value="">UF</option>

                        {UFS.map(uf => (
                          <option key={uf} value={uf}>
                            {uf}
                          </option>
                        ))}
                      </select>

                      {erros.crmvUF && (
                        <p className="text-xs text-rose-500 mt-1">
                          {erros.crmvUF}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#6B7280]">
                    O CRMV será exibido como informado / não verificado no MVP.
                  </p>
                </div>
              )}

              <div className="flex items-start gap-2.5">
                <input
                  id="termos"
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-0.5 rounded border-[#D8D5CE] accent-[#0C4A45] cursor-pointer shrink-0"
                />

                <label
                  htmlFor="termos"
                  className="text-xs text-[#6B7280] cursor-pointer leading-relaxed"
                >
                  Li e concordo com os{' '}
                  <Link
                    to="/termos"
                    className="text-[#0C4A45] hover:underline font-medium"
                  >
                    Termos de Uso
                  </Link>{' '}
                  e a{' '}
                  <Link
                    to="/privacidade"
                    className="text-[#0C4A45] hover:underline font-medium"
                  >
                    Política de Privacidade
                  </Link>{' '}
                  do UniVet.
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 border border-[#D8D5CE] text-[#6B7280] font-medium py-3 rounded-[10px] hover:bg-[#EAE8E3] transition-colors text-sm"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#E05C2A] text-white font-semibold py-3 rounded-[10px] hover:bg-[#C4501F] transition-colors disabled:opacity-60 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}