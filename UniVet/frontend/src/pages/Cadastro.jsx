import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

function Campo({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  autoComplete,
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[#263A35]"
      >
        {label}{required ? ' *' : ''}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/10"
      />
    </div>
  )
}

export default function Cadastro() {
  const navigate = useNavigate()

  const [etapa, setEtapa] = useState(1)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [nomeEstabelecimento, setNomeEstabelecimento] = useState('')
  const [tipoEstabelecimento, setTipoEstabelecimento] =
    useState('CLINICA')

  function atualizarTelefone(event) {
    const numeros = event.target.value.replace(/\D/g, '').slice(0, 11)

    let formatado = numeros

    if (numeros.length > 2) {
      formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
    }

    if (numeros.length > 7) {
      formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
    }

    setTelefone(formatado)
  }

  function validarPrimeiraEtapa(event) {
    event.preventDefault()
    setErro('')

    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErro('Informe um e-mail válido.')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setEtapa(2)
  }

  async function finalizarCadastro(event) {
    event.preventDefault()
    setErro('')

    if (!nomeEstabelecimento.trim()) {
      setErro('Informe o nome do estabelecimento.')
      return
    }

    setCarregando(true)

    try {
      const { data, error: erroCadastro } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: senha,
        options: {
          data: {
            nome_completo: nome.trim(),
            telefone: telefone.trim() || null,
          },
        },
      })

      if (erroCadastro) {
        throw new Error(erroCadastro.message)
      }

      if (!data.session?.access_token) {
        throw new Error(
          'A conta foi criada, mas não há uma sessão ativa. Confira se a confirmação de e-mail está desativada no Supabase. Se necessário, entre pela tela de login.'
        )
      }

      const resposta = await fetch(`${API_URL}/api/cadastro/estabelecimento`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({
          nomeCompleto: nome.trim(),
          telefone: telefone.trim() || null,
          nomeEstabelecimento: nomeEstabelecimento.trim(),
          tipoEstabelecimento,
        }),
      })

      const textoResposta = await resposta.text()
      let resultado = {}

      if (textoResposta) {
        try {
          resultado = JSON.parse(textoResposta)
        } catch {
          resultado = {}
        }
      }

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            resultado.message ||
            resultado.mensagem ||
            `Não foi possível criar o estabelecimento. Código: ${resposta.status}.`
        )
      }

      navigate('/app/dashboard', { replace: true })
    } catch (error) {
      console.error('Erro no cadastro:', error)

      setErro(
        error.message ||
          'Não foi possível concluir o cadastro. Tente novamente.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0C4A45] text-3xl text-white">
            <span aria-hidden="true">🐾</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#0C4A45]">
            Criar sua conta
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Comece a organizar sua clínica com o UniVet.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
              <span>Etapa {etapa} de 2</span>
              <span>
                {etapa === 1 ? 'Seus dados' : 'Seu estabelecimento'}
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full bg-[#0C4A45] transition-all ${
                  etapa === 1 ? 'w-1/2' : 'w-full'
                }`}
              />
            </div>
          </div>

          {erro && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {erro}
            </div>
          )}

          {etapa === 1 ? (
            <form onSubmit={validarPrimeiraEtapa} className="space-y-4">
              <Campo
                label="Nome completo"
                name="nome"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Seu nome completo"
                required
                autoComplete="name"
              />

              <Campo
                label="E-mail"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@exemplo.com"
                required
                autoComplete="email"
              />

              <Campo
                label="Telefone"
                name="telefone"
                type="tel"
                value={telefone}
                onChange={atualizarTelefone}
                placeholder="(00) 00000-0000"
                autoComplete="tel"
              />

              <Campo
                label="Senha"
                name="senha"
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Mínimo de 6 caracteres"
                required
                autoComplete="new-password"
              />

              <Campo
                label="Confirmar senha"
                name="confirmarSenha"
                type={mostrarSenha ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                placeholder="Digite a senha novamente"
                required
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setMostrarSenha((atual) => !atual)}
                className="text-sm font-medium text-[#0C4A45] hover:underline"
              >
                {mostrarSenha ? 'Ocultar senhas' : 'Mostrar senhas'}
              </button>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#E05C2A] px-4 py-3 font-semibold text-white transition hover:bg-[#c94c20] focus:outline-none focus:ring-2 focus:ring-[#E05C2A]/40"
              >
                Continuar →
              </button>
            </form>
          ) : (
            <form onSubmit={finalizarCadastro} className="space-y-4">
              <Campo
                label="Nome do estabelecimento"
                name="nomeEstabelecimento"
                value={nomeEstabelecimento}
                onChange={(event) =>
                  setNomeEstabelecimento(event.target.value)
                }
                placeholder="Ex.: Clínica Veterinária UniVet"
                required
              />

              <div className="space-y-1.5">
                <label
                  htmlFor="tipoEstabelecimento"
                  className="block text-sm font-medium text-[#263A35]"
                >
                  Tipo de estabelecimento *
                </label>

                <select
                  id="tipoEstabelecimento"
                  name="tipoEstabelecimento"
                  value={tipoEstabelecimento}
                  onChange={(event) =>
                    setTipoEstabelecimento(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/10"
                >
                  <option value="CLINICA">Clínica veterinária</option>
                  <option value="CONSULTORIO">Consultório</option>
                  <option value="HOSPITAL">Hospital veterinário</option>
                  <option value="AUTONOMO">Autônomo</option>
                </select>
              </div>

              <p className="rounded-xl bg-[#F7F5F0] p-3 text-sm leading-5 text-gray-600">
                Sua conta será cadastrada como administrador do
                estabelecimento. Você poderá cadastrar veterinários e outros
                funcionários depois.
              </p>

              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-xl bg-[#E05C2A] px-4 py-3 font-semibold text-white transition hover:bg-[#c94c20] focus:outline-none focus:ring-2 focus:ring-[#E05C2A]/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {carregando ? 'Criando conta...' : 'Criar conta e acessar →'}
              </button>

              <button
                type="button"
                disabled={carregando}
                onClick={() => {
                  setErro('')
                  setEtapa(1)
                }}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              >
                ← Voltar
              </button>
            </form>
          )}
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-semibold text-[#0C4A45] hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </main>
  )
}