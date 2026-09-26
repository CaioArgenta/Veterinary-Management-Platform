import { useEffect, useState } from 'react'

import { supabase } from '../services/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

function somenteNumeros(valor) {
  return valor.replace(/\D/g, '')
}

function formatarCPF(valor) {
  const numeros = somenteNumeros(valor).slice(0, 11)

  if (numeros.length <= 3) return numeros

  if (numeros.length <= 6) {
    return `${numeros.slice(0, 3)}.${numeros.slice(3)}`
  }

  if (numeros.length <= 9) {
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`
  }

  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`
}

function formatarTelefone(valor) {
  const numeros = somenteNumeros(valor).slice(0, 11)

  if (numeros.length <= 2) return numeros

  if (numeros.length <= 7) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
  }

  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`
}

function validarCPF(cpf) {
  const numeros = somenteNumeros(cpf)

  if (numeros.length !== 11) return false
  if (/^(\d)\1{10}$/.test(numeros)) return false

  let soma = 0

  for (let i = 0; i < 9; i++) {
    soma += Number(numeros[i]) * (10 - i)
  }

  let resto = (soma * 10) % 11

  if (resto === 10) resto = 0

  if (resto !== Number(numeros[9])) return false

  soma = 0

  for (let i = 0; i < 10; i++) {
    soma += Number(numeros[i]) * (11 - i)
  }

  resto = (soma * 10) % 11

  if (resto === 10) resto = 0

  return resto === Number(numeros[10])
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0C1A1A] mb-1.5">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#D8D5CE] rounded-lg px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/10"
      />
    </div>
  )
}

function ModalTutor({
  tutor,
  fechar,
  salvar,
  salvando,
}) {
  const [form, setForm] = useState({
    nome: tutor?.nome_completo || '',
    cpf: tutor?.cpf ? formatarCPF(tutor.cpf) : '',
    telefone: tutor?.telefone
      ? formatarTelefone(tutor.telefone)
      : '',
    email: tutor?.email || '',
    endereco: tutor?.endereco || '',
  })

  const [erro, setErro] = useState('')

  function alterar(campo, valor) {
    setErro('')

    let novoValor = valor

    if (campo === 'cpf') {
      novoValor = formatarCPF(valor)
    }

    if (campo === 'telefone') {
      novoValor = formatarTelefone(valor)
    }

    setForm(atual => ({
      ...atual,
      [campo]: novoValor,
    }))
  }

  function validarFormulario() {
    const nome = form.nome.trim()
    const cpf = somenteNumeros(form.cpf)
    const telefone = somenteNumeros(form.telefone)
    const email = form.email.trim()

    if (!nome) {
      return 'Digite o nome completo do tutor.'
    }

    if (nome.length < 3) {
      return 'O nome deve ter pelo menos 3 caracteres.'
    }

    if (!telefone) {
      return 'Digite o telefone do tutor.'
    }

    if (telefone.length !== 10 && telefone.length !== 11) {
      return 'Digite um telefone válido com DDD.'
    }

    if (cpf && cpf.length !== 11) {
      return 'O CPF deve conter 11 números.'
    }

    if (cpf && !validarCPF(cpf)) {
      return 'Digite um CPF válido.'
    }

    if (email && !validarEmail(email)) {
      return 'Digite um e-mail válido.'
    }

    return ''
  }

  async function confirmar() {
    const erroValidacao = validarFormulario()

    if (erroValidacao) {
      setErro(erroValidacao)
      return
    }

    const resultado = await salvar(form)

    if (resultado?.erro) {
      setErro(resultado.erro)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
      onClick={fechar}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EAE8E3]">
          <div>
            <h2 className="text-lg font-semibold text-[#0C1A1A]">
              {tutor ? 'Editar tutor' : 'Novo tutor'}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {tutor
                ? 'Atualize os dados do tutor'
                : 'Cadastre os dados do responsável'}
            </p>
          </div>

          <button
            onClick={fechar}
            disabled={salvando}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#F5F4F0] hover:text-gray-700 transition-colors disabled:opacity-50 text-xl"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {erro && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <span className="mt-0.5">!</span>
              <p>{erro}</p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs font-semibold tracking-wide text-[#6B716F] uppercase">
              Informações pessoais
            </p>
          </div>

          <div className="space-y-4">
            <Campo
              label="Nome completo *"
              value={form.nome}
              onChange={valor => alterar('nome', valor)}
              placeholder="Nome completo"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo
                label="CPF"
                value={form.cpf}
                onChange={valor => alterar('cpf', valor)}
                placeholder="000.000.000-00"
              />

              <Campo
                label="Telefone *"
                value={form.telefone}
                onChange={valor => alterar('telefone', valor)}
                placeholder="(14) 99999-9999"
              />
            </div>

            <Campo
              label="E-mail"
              value={form.email}
              onChange={valor => alterar('email', valor)}
              placeholder="email@exemplo.com"
              type="email"
            />

            <div className="pt-2">
              <Campo
                label="Endereço"
                value={form.endereco}
                onChange={valor => alterar('endereco', valor)}
                placeholder="Rua, número, bairro, cidade - UF"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 py-5 border-t border-[#EAE8E3] bg-[#FCFCFA]">
          <button
            onClick={fechar}
            disabled={salvando}
            className="flex-1 border border-[#D8D5CE] bg-white rounded-lg py-2.5 text-sm font-medium text-[#39413F] hover:bg-[#F5F4F0] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={confirmar}
            disabled={salvando}
            className="flex-1 bg-[#0C4A45] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#0A3F3B] transition-colors disabled:opacity-60"
          >
            {salvando
              ? 'Salvando...'
              : tutor
                ? 'Salvar alterações'
                : 'Cadastrar tutor'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DetalhesTutor({
  tutor,
  fechar,
  editar,
}) {
  if (!tutor) return null

  const animais = tutor.animal_tutores || []

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={fechar}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EAE8E3]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0C4A45]">
              Detalhes do tutor
            </p>

            <h2 className="text-lg font-semibold text-[#0C1A1A] mt-1">
              {tutor.nome_completo}
            </h2>
          </div>

          <button
            onClick={fechar}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#F5F4F0] hover:text-gray-700 transition-colors text-xl"
            aria-label="Fechar detalhes"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#E8F4F0] flex items-center justify-center text-[#0C4A45] font-semibold text-lg">
              {tutor.nome_completo
                ?.charAt(0)
                .toUpperCase() || 'T'}
            </div>

            <div>
              <p className="font-semibold text-[#0C1A1A]">
                {tutor.nome_completo}
              </p>

              <p className="text-xs text-gray-400 mt-0.5">
                {tutor.cpf
                  ? formatarCPF(tutor.cpf)
                  : 'CPF não informado'}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold tracking-wide text-[#6B716F] uppercase mb-3">
              Informações de contato
            </p>

            <div className="border border-[#EAE8E3] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#EAE8E3]">
                <p className="text-xs text-gray-400 mb-1">
                  Telefone
                </p>

                <p className="text-sm text-[#303735]">
                  {tutor.telefone
                    ? formatarTelefone(tutor.telefone)
                    : 'Não informado'}
                </p>
              </div>

              <div className="px-4 py-3 border-b border-[#EAE8E3]">
                <p className="text-xs text-gray-400 mb-1">
                  E-mail
                </p>

                <p className="text-sm text-[#303735] break-all">
                  {tutor.email || 'Não informado'}
                </p>
              </div>

              <div className="px-4 py-3">
                <p className="text-xs text-gray-400 mb-1">
                  Endereço
                </p>

                <p className="text-sm text-[#303735]">
                  {tutor.endereco || 'Não informado'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold tracking-wide text-[#6B716F] uppercase">
                Animais
              </p>

              <span className="text-xs text-gray-400">
                {animais.length}{' '}
                {animais.length === 1
                  ? 'animal'
                  : 'animais'}
              </span>
            </div>

            {animais.length === 0 ? (
              <div className="border border-dashed border-[#D8D5CE] rounded-xl p-5 text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#F2F6F4] flex items-center justify-center">
                  <span className="text-sm">🐾</span>
                </div>

                <p className="text-sm font-medium text-[#303735]">
                  Nenhum animal vinculado
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Os animais vinculados a este tutor aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {animais.map(relacao => {
                  const animal = relacao.animais

                  return (
                    <div
                      key={relacao.id}
                      className="flex items-center gap-3 border border-[#EAE8E3] rounded-xl px-4 py-3"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#E8F4F0] flex items-center justify-center">
                        🐾
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#303735] truncate">
                          {animal?.nome || 'Animal'}
                        </p>

                        <p className="text-xs text-gray-400">
                          {animal?.especie || 'Espécie não informada'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-5 border-t border-[#EAE8E3] bg-[#FCFCFA]">
          <button
            onClick={() => editar(tutor)}
            className="w-full bg-[#0C4A45] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#0A3F3B] transition-colors"
          >
            Editar tutor
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Tutores() {
  const [tutores, setTutores] = useState([])
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(null)
  const [detalhes, setDetalhes] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    carregarTutores()
  }, [])

  async function obterToken() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    if (!session?.access_token) {
      throw new Error('Usuário não autenticado.')
    }

    return session.access_token
  }

  async function requisicaoAPI(url, opcoes = {}) {
    const token = await obterToken()

    const resposta = await fetch(`${API_URL}${url}`, {
      ...opcoes,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(opcoes.headers || {}),
      },
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
      throw new Error(
        dados.mensagem || 'Erro ao realizar a operação.'
      )
    }

    return dados
  }

  async function carregarTutores() {
    try {
      setCarregando(true)
      setErro('')

      const data = await requisicaoAPI('/api/tutores')

      setTutores(data || [])
    } catch (error) {
      console.error('Erro ao carregar tutores:', error)

      setErro(
        error.message ||
          'Não foi possível carregar os tutores.'
      )
    } finally {
      setCarregando(false)
    }
  }

  async function salvarTutor(dados) {
    try {
      setSalvando(true)
      setErro('')

      const dadosTutor = {
        nome_completo: dados.nome.trim(),

        cpf:
          somenteNumeros(dados.cpf) || null,

        telefone:
          somenteNumeros(dados.telefone),

        email:
          dados.email.trim().toLowerCase() || null,

        endereco:
          dados.endereco.trim() || null,
      }

      const editando = modal !== 'novo'

      if (!editando) {
        await requisicaoAPI('/api/tutores', {
          method: 'POST',
          body: JSON.stringify(dadosTutor),
        })
      } else {
        await requisicaoAPI(
          `/api/tutores/${modal.id}`,
          {
            method: 'PUT',
            body: JSON.stringify(dadosTutor),
          }
        )
      }

      await carregarTutores()

      setModal(null)

      setSucesso(
        editando
          ? 'Tutor atualizado com sucesso.'
          : 'Tutor cadastrado com sucesso.'
      )

      setTimeout(() => {
        setSucesso('')
      }, 3500)

      return {
        sucesso: true,
      }
    } catch (error) {
      console.error(
        'Erro ao salvar tutor:',
        error
      )

      return {
        erro:
          error.message ||
          'Não foi possível salvar o tutor.',
      }
    } finally {
      setSalvando(false)
    }
  }

  const termo = busca
    .trim()
    .toLowerCase()

  const tutoresFiltrados =
    tutores.filter(tutor => {
      if (!termo) return true

      return (
        tutor.nome_completo
          ?.toLowerCase()
          .includes(termo) ||
        tutor.email
          ?.toLowerCase()
          .includes(termo) ||
        tutor.telefone
          ?.toLowerCase()
          .includes(termo) ||
        tutor.cpf
          ?.toLowerCase()
          .includes(termo)
      )
    })

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {modal !== null && (
        <ModalTutor
          tutor={
            modal === 'novo'
              ? null
              : modal
          }
          fechar={() => {
            if (!salvando) {
              setModal(null)
            }
          }}
          salvar={salvarTutor}
          salvando={salvando}
        />
      )}

      {detalhes && (
        <DetalhesTutor
          tutor={detalhes}
          fechar={() => setDetalhes(null)}
          editar={tutor => {
            setDetalhes(null)
            setModal(tutor)
          }}
        />
      )}

      {sucesso && (
        <div className="fixed right-6 bottom-6 z-[60] flex items-center gap-3 bg-white border border-[#DDE9E5] shadow-xl rounded-xl px-4 py-3.5 min-w-[280px]">
          <div className="w-8 h-8 rounded-full bg-[#E8F4F0] text-[#0C4A45] flex items-center justify-center font-semibold">
            ✓
          </div>

          <div>
            <p className="text-sm font-semibold text-[#0C1A1A]">
              Sucesso
            </p>

            <p className="text-sm text-gray-500">
              {sucesso}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#0C1A1A]">
            Tutores
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {tutores.length}{' '}
            {tutores.length === 1
              ? 'tutor cadastrado'
              : 'tutores cadastrados'}
          </p>
        </div>

        <button
          onClick={() => setModal('novo')}
          className="inline-flex items-center justify-center gap-2 bg-[#0C4A45] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0A3F3B] transition-colors"
        >
          <span className="text-lg leading-none">
            +
          </span>

          Novo tutor
        </button>
      </div>

      {erro && (
        <div className="mb-5 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          <span className="font-semibold">
            !
          </span>

          <p>{erro}</p>
        </div>
      )}

      <div className="mb-5">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />

            <path d="m20 20-3.5-3.5" />
          </svg>

          <input
            value={busca}
            onChange={e =>
              setBusca(e.target.value)
            }
            placeholder="Buscar por nome, CPF, e-mail ou telefone..."
            className="w-full bg-white border border-[#D8D5CE] rounded-xl pl-11 pr-11 py-3 text-sm outline-none transition-all focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/10"
          />

          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-[#F5F4F0] hover:text-gray-700"
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden">
        {carregando ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-[#F5F4F0] rounded-lg" />
              <div className="h-12 bg-[#F5F4F0] rounded-lg" />
              <div className="h-12 bg-[#F5F4F0] rounded-lg" />
              <div className="h-12 bg-[#F5F4F0] rounded-lg" />
            </div>
          </div>
        ) : tutoresFiltrados.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#F2F6F4] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#0C4A45]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />

                <circle
                  cx="12"
                  cy="7"
                  r="4"
                />
              </svg>
            </div>

            <p className="font-semibold text-[#0C1A1A]">
              {busca
                ? 'Nenhum tutor encontrado'
                : 'Nenhum tutor cadastrado'}
            </p>

            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {busca
                ? 'Tente buscar por outro nome, CPF, e-mail ou telefone.'
                : 'Cadastre um tutor para começar a organizar os responsáveis pelos pacientes.'}
            </p>

            {!busca && (
              <button
                onClick={() =>
                  setModal('novo')
                }
                className="mt-5 inline-flex items-center gap-2 bg-[#0C4A45] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0A3F3B] transition-colors"
              >
                <span className="text-lg leading-none">
                  +
                </span>

                Novo tutor
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#FAFAF8]">
                <tr className="border-b border-[#EAE8E3]">
                  <th className="text-left px-5 py-4 font-medium text-[#39413F]">
                    Tutor
                  </th>

                  <th className="text-left px-5 py-4 font-medium text-[#39413F]">
                    Contato
                  </th>

                  <th className="text-left px-5 py-4 font-medium text-[#39413F]">
                    Animais
                  </th>

                  <th className="text-right px-5 py-4 font-medium text-[#39413F]">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {tutoresFiltrados.map(tutor => {
                  const quantidadeAnimais =
                    tutor.animal_tutores
                      ?.length || 0

                  const inicial =
                    tutor.nome_completo
                      ?.charAt(0)
                      .toUpperCase() || 'T'

                  return (
                    <tr
                      key={tutor.id}
                      className="border-b border-[#EAE8E3] last:border-b-0 hover:bg-[#FCFCFA] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E8F4F0] flex items-center justify-center text-[#0C4A45] font-semibold shrink-0">
                            {inicial}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-[#0C1A1A] truncate">
                              {tutor.nome_completo}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              {tutor.cpf
                                ? formatarCPF(
                                    tutor.cpf
                                  )
                                : 'CPF não informado'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[#303735]">
                          {tutor.telefone
                            ? formatarTelefone(
                                tutor.telefone
                              )
                            : 'Telefone não informado'}
                        </p>

                        <p className="text-xs text-gray-400 mt-1 truncate max-w-[250px]">
                          {tutor.email ||
                            'E-mail não informado'}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-[#E8F4F0] flex items-center justify-center text-sm">
                            🐾
                          </span>

                          <div>
                            <p className="font-medium text-[#303735]">
                              {quantidadeAnimais}
                            </p>

                            <p className="text-xs text-gray-400">
                              {quantidadeAnimais === 1
                                ? 'animal'
                                : 'animais'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() =>
                              setDetalhes(tutor)
                            }
                            className="inline-flex items-center gap-1.5 border border-[#D8D5CE] bg-white px-3 py-2 rounded-lg text-sm font-medium text-[#39413F] hover:bg-[#F5F4F0] transition-colors"
                          >
                            Detalhes
                          </button>

                          <button
                            onClick={() =>
                              setModal(tutor)
                            }
                            className="inline-flex items-center gap-1.5 border border-[#D8D5CE] bg-white px-3 py-2 rounded-lg text-sm font-medium text-[#0C4A45] hover:bg-[#F5F4F0] transition-colors"
                          >
                            Editar

                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!carregando &&
        tutoresFiltrados.length > 0 &&
        busca && (
          <p className="text-xs text-gray-400 mt-3">
            Mostrando {tutoresFiltrados.length}{' '}
            de {tutores.length} tutores.
          </p>
        )}
    </div>
  )
}