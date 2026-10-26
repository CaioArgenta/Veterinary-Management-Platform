import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../services/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

const VACINAS_LISTA = [
  'V10',
  'V8',
  'V3',
  'V4',
  'Antirrábica',
  'Giardia',
  'Bordetella',
  'Gripe felina',
  'Outra',
]

function dataAtual() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function formatarData(data) {
  if (!data) return '—'

  const [ano, mes, dia] = data.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

function obterStatus(proximaDose) {
  if (!proximaDose) return 'Sem próxima dose'

  const hoje = dataAtual()
  const limite = new Date(`${hoje}T00:00:00`)
  limite.setDate(limite.getDate() + 30)

  const dataLimite = [
    limite.getFullYear(),
    String(limite.getMonth() + 1).padStart(2, '0'),
    String(limite.getDate()).padStart(2, '0'),
  ].join('-')

  if (proximaDose < hoje) return 'Atrasada'
  if (proximaDose <= dataLimite) return 'Próxima'
  return 'Em dia'
}

function formatarNomeAnimal(animal) {
  if (!animal) return 'Animal não identificado'
  return animal.nome || animal.nome_animal || 'Animal sem nome'
}

async function lerResposta(response) {
  const texto = await response.text()

  if (!texto) {
    if (!response.ok) {
      throw new Error(`Erro na requisição (${response.status}).`)
    }

    return null
  }

  let resultado

  try {
    resultado = JSON.parse(texto)
  } catch {
    throw new Error('O servidor retornou uma resposta inválida.')
  }

  if (!response.ok) {
    throw new Error(
      resultado?.mensagem ||
        resultado?.erro ||
        `Erro na requisição (${response.status}).`
    )
  }

  return resultado
}

async function requisicaoAPI(caminho, opcoes = {}) {
  const { data, error } = await supabase.auth.getSession()

  if (error) throw error

  const token = data?.session?.access_token

  if (!token) {
    throw new Error('Sua sessão expirou. Entre novamente no sistema.')
  }

  let response

  try {
    response = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
        ...opcoes.headers,
      },
    })
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Verifique se o backend está ativo e se o proxy do Vite está configurado.'
    )
  }

  return lerResposta(response)
}

function Modal({ titulo, onFechar, children, largura = 'max-w-xl' }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar()
      }}
    >
      <div
        className={`max-h-[90vh] w-full ${largura} overflow-y-auto rounded-2xl bg-white shadow-xl`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-gray-800">{titulo}</h2>

          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg px-3 py-1 text-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/10'

function CartaoEstatistica({ titulo, valor, descricao, cor }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{titulo}</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">{valor}</p>
          <p className="mt-1 text-xs text-gray-500">{descricao}</p>
        </div>

        <div className={`h-3 w-3 rounded-full ${cor}`} />
      </div>
    </div>
  )
}

function EtiquetaStatus({ status }) {
  const estilos = {
    Atrasada: 'bg-red-50 text-red-700',
    Próxima: 'bg-amber-50 text-amber-700',
    'Em dia': 'bg-emerald-50 text-emerald-700',
    'Sem próxima dose': 'bg-gray-100 text-gray-600',
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
        estilos[status] || estilos['Sem próxima dose']
      }`}
    >
      {status}
    </span>
  )
}

function NovaVacinaModal({ animais, onFechar, onSalvar, salvando }) {
  const [formulario, setFormulario] = useState({
    animal_id: '',
    nome_vacina: '',
    outraVacina: '',
    data_aplicacao: dataAtual(),
    proxima_dose: '',
    observacoes: '',
  })

  const [erro, setErro] = useState('')

  function atualizarCampo(campo, valor) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }))
  }

  async function enviarFormulario(e) {
    e.preventDefault()
    setErro('')

    const nomeVacina =
      formulario.nome_vacina === 'Outra'
        ? formulario.outraVacina.trim()
        : formulario.nome_vacina

    if (!formulario.animal_id || !nomeVacina || !formulario.data_aplicacao) {
      setErro('Preencha o animal, a vacina e a data de aplicação.')
      return
    }

    if (
      formulario.proxima_dose &&
      formulario.proxima_dose < formulario.data_aplicacao
    ) {
      setErro('A próxima dose não pode ser anterior à aplicação.')
      return
    }

    try {
      await onSalvar({
        animal_id: formulario.animal_id,
        nome_vacina: nomeVacina,
        data_aplicacao: formulario.data_aplicacao,
        proxima_dose: formulario.proxima_dose || null,
        observacoes: formulario.observacoes.trim() || null,
      })
    } catch (error) {
      setErro(error.message || 'Não foi possível registrar a vacinação.')
    }
  }

  return (
    <Modal titulo="Registrar vacinação" onFechar={onFechar}>
      <form onSubmit={enviarFormulario} className="space-y-5">
        {erro && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        <Campo label="Animal *">
          <select
            required
            value={formulario.animal_id}
            onChange={(e) => atualizarCampo('animal_id', e.target.value)}
            className={inputClass}
          >
            <option value="">Selecione um animal</option>
            {animais.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {formatarNomeAnimal(animal)}
                {animal.especie ? ` — ${animal.especie}` : ''}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Vacina *">
          <select
            required
            value={formulario.nome_vacina}
            onChange={(e) => atualizarCampo('nome_vacina', e.target.value)}
            className={inputClass}
          >
            <option value="">Selecione uma vacina</option>
            {VACINAS_LISTA.map((vacina) => (
              <option key={vacina} value={vacina}>
                {vacina}
              </option>
            ))}
          </select>
        </Campo>

        {formulario.nome_vacina === 'Outra' && (
          <Campo label="Nome da vacina *">
            <input
              required
              value={formulario.outraVacina}
              onChange={(e) => atualizarCampo('outraVacina', e.target.value)}
              className={inputClass}
              placeholder="Digite o nome da vacina"
              maxLength={120}
            />
          </Campo>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Data de aplicação *">
            <input
              required
              type="date"
              max={dataAtual()}
              value={formulario.data_aplicacao}
              onChange={(e) =>
                atualizarCampo('data_aplicacao', e.target.value)
              }
              className={inputClass}
            />
          </Campo>

          <Campo label="Próxima dose">
            <input
              type="date"
              min={formulario.data_aplicacao || undefined}
              value={formulario.proxima_dose}
              onChange={(e) =>
                atualizarCampo('proxima_dose', e.target.value)
              }
              className={inputClass}
            />
          </Campo>
        </div>

        <Campo label="Observações">
          <textarea
            rows={3}
            maxLength={2000}
            value={formulario.observacoes}
            onChange={(e) => atualizarCampo('observacoes', e.target.value)}
            className={inputClass}
            placeholder="Informações adicionais sobre a aplicação..."
          />
        </Campo>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={salvando || animais.length === 0}
            className="rounded-xl bg-[#0C4A45] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#093b37] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Registrar vacinação'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function DetalhesVacinaModal({ vacinacao, onFechar }) {
  const animal = vacinacao.animais

  const detalhes = [
    ['Animal', formatarNomeAnimal(animal)],
    ['Espécie', animal?.especie || '—'],
    ['Vacina', vacinacao.nome_vacina],
    ['Data de aplicação', formatarData(vacinacao.data_aplicacao)],
    ['Próxima dose', formatarData(vacinacao.proxima_dose)],
    ['Status', obterStatus(vacinacao.proxima_dose)],
    ['Observações', vacinacao.observacoes || 'Nenhuma observação registrada'],
  ]

  return (
    <Modal titulo="Detalhes da vacinação" onFechar={onFechar}>
      <div className="space-y-0">
        {detalhes.map(([titulo, valor]) => (
          <div
            key={titulo}
            className="grid grid-cols-1 gap-1 border-b border-gray-100 py-3 last:border-b-0 sm:grid-cols-[150px_1fr]"
          >
            <span className="text-sm text-gray-500">{titulo}</span>
            <span className="break-words text-sm font-medium text-gray-800">
              {titulo === 'Status' ? (
                <EtiquetaStatus status={valor} />
              ) : (
                valor
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onFechar}
          className="rounded-xl bg-[#0C4A45] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#093b37]"
        >
          Fechar
        </button>
      </div>
    </Modal>
  )
}

export default function Vacinacao() {
  const [vacinacoes, setVacinacoes] = useState([])
  const [animais, setAnimais] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [vacinaSelecionada, setVacinaSelecionada] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  const carregarDados = useCallback(async () => {
    setCarregando(true)
    setErro('')

    try {
      const [listaVacinacoes, listaAnimais] = await Promise.all([
        requisicaoAPI('/api/vacinacao'),
        requisicaoAPI('/api/animais'),
      ])

      setVacinacoes(
        Array.isArray(listaVacinacoes)
          ? listaVacinacoes
          : listaVacinacoes?.data || []
      )

      setAnimais(
        Array.isArray(listaAnimais)
          ? listaAnimais
          : listaAnimais?.data || []
      )
    } catch (error) {
      console.error('Erro ao carregar vacinação:', error)
      setErro(error.message || 'Não foi possível carregar os dados.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const estatisticas = useMemo(() => {
    const atrasadas = vacinacoes.filter(
      (vacina) => obterStatus(vacina.proxima_dose) === 'Atrasada'
    ).length

    const proximas = vacinacoes.filter(
      (vacina) => obterStatus(vacina.proxima_dose) === 'Próxima'
    ).length

    const emDia = vacinacoes.filter(
      (vacina) => obterStatus(vacina.proxima_dose) === 'Em dia'
    ).length

    return {
      total: vacinacoes.length,
      atrasadas,
      proximas,
      emDia,
    }
  }, [vacinacoes])

  const vacinacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR')

    return vacinacoes.filter((vacina) => {
      const nomeAnimal = formatarNomeAnimal(vacina.animais)
      const status = obterStatus(vacina.proxima_dose)

      const correspondeBusca =
        !termo ||
        nomeAnimal.toLocaleLowerCase('pt-BR').includes(termo) ||
        (vacina.nome_vacina || '').toLocaleLowerCase('pt-BR').includes(termo) ||
        (vacina.animais?.especie || '')
          .toLocaleLowerCase('pt-BR')
          .includes(termo)

      const correspondeStatus =
        filtroStatus === 'Todos' || status === filtroStatus

      return correspondeBusca && correspondeStatus
    })
  }, [vacinacoes, busca, filtroStatus])

  async function registrarVacinacao(dados) {
    setSalvando(true)
    setMensagem('')

    try {
      await requisicaoAPI('/api/vacinacao', {
        method: 'POST',
        body: JSON.stringify(dados),
      })

      setModalAberto(false)
      setMensagem('Vacinação registrada com sucesso.')
      await carregarDados()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-full space-y-6 bg-[#F7F5F0] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#0C4A45]">
            Gestão veterinária
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-800 sm:text-2xl">
            Vacinação
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Acompanhe as aplicações e as próximas doses dos pacientes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMensagem('')
            setErro('')
            setModalAberto(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0C4A45] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#093b37]"
        >
          <span className="text-lg leading-none">+</span>
          Registrar vacina
        </button>
      </div>

      {erro && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{erro}</span>
          <button
            type="button"
            onClick={carregarDados}
            className="self-start font-semibold underline sm:self-auto"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {mensagem && (
        <div
          role="status"
          className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {mensagem}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CartaoEstatistica
          titulo="Vacinações registradas"
          valor={estatisticas.total}
          descricao="Total de aplicações cadastradas"
          cor="bg-[#0C4A45]"
        />
        <CartaoEstatistica
          titulo="Doses atrasadas"
          valor={estatisticas.atrasadas}
          descricao="Precisam de acompanhamento"
          cor="bg-red-500"
        />
        <CartaoEstatistica
          titulo="Próximas doses"
          valor={estatisticas.proximas}
          descricao="Vencem nos próximos 30 dias"
          cor="bg-amber-500"
        />
        <CartaoEstatistica
          titulo="Em dia"
          valor={estatisticas.emDia}
          descricao="Com próxima dose programada"
          cor="bg-emerald-500"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-gray-800">
              Histórico de vacinações
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Consulte as aplicações registradas para os animais.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar animal ou vacina..."
              aria-label="Buscar animal ou vacina"
              className={`${inputClass} sm:min-w-64`}
            />

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              aria-label="Filtrar por status"
              className={`${inputClass} sm:w-48`}
            >
              <option value="Todos">Todos os status</option>
              <option value="Em dia">Em dia</option>
              <option value="Próxima">Próxima dose</option>
              <option value="Atrasada">Atrasada</option>
              <option value="Sem próxima dose">Sem próxima dose</option>
            </select>
          </div>
        </div>

        {carregando ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#0C4A45]" />
            <p className="text-sm text-gray-500">
              Carregando vacinações...
            </p>
          </div>
        ) : vacinacoesFiltradas.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0C4A45]/10 text-2xl text-[#0C4A45]">
              +
            </div>
            <h3 className="font-semibold text-gray-800">
              {vacinacoes.length === 0
                ? 'Nenhuma vacinação registrada'
                : 'Nenhum resultado encontrado'}
            </h3>
            <p className="mt-2 max-w-md text-sm text-gray-500">
              {vacinacoes.length === 0
                ? 'Registre a primeira aplicação para começar o histórico de vacinação.'
                : 'Tente mudar a busca ou selecionar outro status.'}
            </p>

            {vacinacoes.length === 0 && (
              <button
                type="button"
                onClick={() => {
                  setErro('')
                  setModalAberto(true)
                }}
                className="mt-5 rounded-xl bg-[#0C4A45] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#093b37]"
              >
                Registrar primeira vacina
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      'Animal',
                      'Vacina',
                      'Aplicação',
                      'Próxima dose',
                      'Status',
                      'Detalhes',
                    ].map((titulo) => (
                      <th
                        key={titulo}
                        className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {titulo}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {vacinacoesFiltradas.map((vacina) => {
                    const status = obterStatus(vacina.proxima_dose)

                    return (
                      <tr
                        key={vacina.id}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800">
                            {formatarNomeAnimal(vacina.animais)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {vacina.animais?.especie || 'Espécie não informada'}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-gray-700">
                          {vacina.nome_vacina}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatarData(vacina.data_aplicacao)}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {formatarData(vacina.proxima_dose)}
                        </td>

                        <td className="px-5 py-4">
                          <EtiquetaStatus status={status} />
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setVacinaSelecionada(vacina)}
                            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#0C4A45] hover:bg-[#0C4A45]/10"
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
              Exibindo {vacinacoesFiltradas.length}{' '}
              {vacinacoesFiltradas.length === 1
                ? 'registro'
                : 'registros'}
            </div>
          </>
        )}
      </section>

      {modalAberto && (
        <NovaVacinaModal
          animais={animais}
          onFechar={() => setModalAberto(false)}
          onSalvar={registrarVacinacao}
          salvando={salvando}
        />
      )}

      {vacinaSelecionada && (
        <DetalhesVacinaModal
          vacinacao={vacinaSelecionada}
          onFechar={() => setVacinaSelecionada(null)}
        />
      )}
    </div>
  )
}