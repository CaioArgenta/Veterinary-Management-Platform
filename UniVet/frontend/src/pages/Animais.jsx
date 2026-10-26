
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

const ESPECIES = ['Cão', 'Gato', 'Ave', 'Roedor', 'Réptil', 'Outro']

const ESPECIE_ICON = {
  Cão: '🐕',
  Gato: '🐈',
  Ave: '🦜',
  Réptil: '🦎',
  Outro: '🐾',
  CANINO: '🐕',
  FELINO: '🐈',
  AVE: '🦜',
  REPTIL: '🦎',
  OUTRO: '🐾',
}

const SEXOS = [
  'Macho',
  'Fêmea',
  'Macho castrado',
  'Fêmea castrada',
  'Indefinido',
]

function normalizarEspecie(especie) {
  const valor = String(especie || '').trim().toLowerCase()

  const especies = {
    cão: 'Cão',
    cao: 'Cão',
    canino: 'Cão',
    gato: 'Gato',
    felino: 'Gato',
    ave: 'Ave',
    réptil: 'Réptil',
    reptil: 'Réptil',
    outro: 'Outro',
  }

  return especies[valor] || especie || 'Outro'
}


function converterEspecieParaBanco(especie) {
  const especies = {
    'Cão': 'CANINO',
    'Gato': 'FELINO',
    'Ave': 'AVE',
    'Roedor': 'ROEDOR',
    'Réptil': 'REPTIL',
    'Outro': 'OUTRO',
  }

  return especies[especie] || especie
}


function converterSexoParaBanco(sexo) {
  const sexos = {
    'Macho': 'MACHO',
    'Fêmea': 'FEMEA',
    'Macho castrado': 'CASTRADO_MACHO',
    'Fêmea castrada': 'CASTRADA_FEMEA',
    'Indefinido': 'INDEFINIDO',
  }

  return sexos[sexo] || sexo
}


function normalizarSexo(sexo) {
  const valor = String(sexo || '').trim().toLowerCase()

  if (valor === 'macho') return 'Macho'
  if (valor === 'fêmea' || valor === 'femea') return 'Fêmea'

  return sexo || ''
}

async function obterToken() {
  const { data, error } = await supabase.auth.getSession()

  if (error) throw error

  const token = data.session?.access_token

  if (!token) {
    throw new Error('Sua sessão expirou. Entre novamente no UniVet.')
  }

  return token
}

async function requisicaoAPI(endpoint, opcoes = {}) {
  const token = await obterToken()

  const resposta = await fetch(`${API_URL}/api/${endpoint}`, {
    ...opcoes,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
      ...opcoes.headers,
    },
  })

  const texto = await resposta.text()
  let resultado = {}

  if (texto) {
    try {
      resultado = JSON.parse(texto)
    } catch {
      throw new Error(
        `Resposta inválida da API. Verifique a rota e o servidor (HTTP ${resposta.status}).`
      )
    }
  }

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem ||
        resultado.erro ||
        resultado.message ||
        `Erro na requisição (HTTP ${resposta.status}).`
    )
  }

  return resultado
}

function extrairLista(resultado, chave) {
  if (Array.isArray(resultado)) return resultado
  if (Array.isArray(resultado?.dados)) return resultado.dados
  if (Array.isArray(resultado?.data)) return resultado.data
  if (Array.isArray(resultado?.[chave])) return resultado[chave]
  return []
}

function extrairRegistro(resultado) {
  return resultado?.dados || resultado?.data || resultado?.animal || resultado
}

function converterAnimal(animal) {
  const relacoes = animal.animal_tutores || []
  const relacaoPrincipal =
    relacoes.find((relacao) => relacao.principal) || relacoes[0]

  const tutor = animal.tutor || relacaoPrincipal?.tutores

  return {
    id: animal.id,
    nome: animal.nome || '',
    especie: normalizarEspecie(animal.especie),
    raca: animal.raca || '',
    sexo: normalizarSexo(animal.sexo),
    nascimento: animal.data_nascimento || '',
    peso: animal.peso ?? '',
    microchip: animal.microchip || '',
    observacoes: animal.observacoes || '',
    tutorId: tutor?.id || relacaoPrincipal?.tutor_id || '',
    tutorNome: tutor?.nome_completo || 'Sem tutor',
  }
}

function calcularIdade(nascimento) {
  if (!nascimento) return 'Não informada'

  const data = new Date(`${nascimento}T12:00:00`)

  if (Number.isNaN(data.getTime())) return 'Não informada'

  const hoje = new Date()

  if (data > hoje) return 'Data inválida'

  let anos = hoje.getFullYear() - data.getFullYear()
  let meses = hoje.getMonth() - data.getMonth()

  if (hoje.getDate() < data.getDate()) meses--

  if (meses < 0) {
    anos--
    meses += 12
  }

  if (anos === 0 && meses === 0) return 'Menos de 1 mês'
  if (anos === 0) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`
  if (meses === 0) return `${anos} ${anos === 1 ? 'ano' : 'anos'}`

  return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${meses} ${meses === 1 ? 'mês' : 'meses'}`
}

function formatarData(data) {
  if (!data) return 'Não informada'

  const valor = new Date(`${data}T12:00:00`)

  if (Number.isNaN(valor.getTime())) return 'Não informada'

  return valor.toLocaleDateString('pt-BR')
}

function mensagemErro(error) {
  return error?.message || 'Ocorreu um erro inesperado.'
}

function Icone({ nome, tamanho = 18, className = '' }) {
  const caminhos = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    paw: (
      <>
        <ellipse cx="12" cy="16" rx="5" ry="4" />
        <ellipse cx="5.5" cy="10" rx="2" ry="3" />
        <ellipse cx="10" cy="6.5" rx="2" ry="3" />
        <ellipse cx="15" cy="6.5" rx="2" ry="3" />
        <ellipse cx="18.5" cy="10" rx="2" ry="3" />
      </>
    ),
    close: (
      <>
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4Z" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="m19 6-1 14H6L5 6" />
        <path d="M10 11v5M14 11v5" />
      </>
    ),
    weight: (
      <>
        <path d="M5 8h14l2 12H3L5 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </>
    ),
  }

  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {caminhos[nome] || caminhos.info}
    </svg>
  )
}

function Campo({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-[#354341]">
        {label}
      </span>
      {children}
    </label>
  )
}

const classeCampo =
  'w-full rounded-xl border border-[#E4E7E2] bg-white px-3.5 py-2.5 text-sm text-[#20302E] outline-none transition focus:border-[#0C4A45] focus:ring-2 focus:ring-[#0C4A45]/10'

function Modal({ titulo, descricao, onClose, children, largura = 'max-w-2xl' }) {
  useEffect(() => {
    function fecharComEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', fecharComEscape)

    return () => window.removeEventListener('keydown', fecharComEscape)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#102321]/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`flex max-h-[92vh] w-full ${largura} flex-col overflow-hidden rounded-2xl bg-[#FDFCF9] shadow-2xl`}
      >
        <header className="flex items-start justify-between border-b border-[#EAE8E3] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[#15312E]">{titulo}</h2>
            {descricao && (
              <p className="mt-1 text-sm text-[#7A807E]">{descricao}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-2 text-[#65716E] transition hover:bg-[#F0EFE9]"
          >
            <Icone nome="close" />
          </button>
        </header>

        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </section>
    </div>
  )
}

function NovoAnimalModal({
  onClose,
  onSalvar,
  tutores,
  salvando,
  animalInicial = null,
}) {
  const editando = Boolean(animalInicial)

  const [form, setForm] = useState(() => ({
    nome: animalInicial?.nome || '',
    especie: animalInicial?.especie || '',
    raca: animalInicial?.raca || '',
    sexo: animalInicial?.sexo || '',
    nascimento: animalInicial?.nascimento || '',
    peso: animalInicial?.peso ?? '',
    microchip: animalInicial?.microchip || '',
    tutorId: animalInicial?.tutorId || '',
    observacoes: animalInicial?.observacoes || '',
  }))

  const [erroFormulario, setErroFormulario] = useState('')

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  async function cadastrar(event) {
    event.preventDefault()
    setErroFormulario('')

    if (!form.nome.trim()) {
      setErroFormulario('Informe o nome do animal.')
      return
    }

    if (!form.especie) {
      setErroFormulario('Selecione a espécie.')
      return
    }

    if (!form.sexo) {
      setErroFormulario('Selecione o sexo.')
      return
    }

    if (form.peso !== '' && Number(form.peso) <= 0) {
      setErroFormulario('O peso deve ser maior que zero.')
      return
    }

    try {
      await onSalvar({
        ...form,
        nome: form.nome.trim(),
        raca: form.raca.trim(),
        peso: form.peso === '' ? null : Number(form.peso),
      })
    } catch (error) {
      setErroFormulario(mensagemErro(error))
    }
  }

  return (
    <Modal
      titulo={editando ? 'Editar animal' : 'Cadastrar animal'}
      descricao={
        editando
          ? 'Atualize as informações do paciente.'
          : 'Preencha os dados para cadastrar um novo paciente.'
      }
      onClose={onClose}
    >
      <form onSubmit={cadastrar} className="space-y-5">
        <div className="rounded-xl bg-[#F1F5F0] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0C4A45]">
            <Icone nome="paw" />
            Dados do animal
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="Nome *" className="sm:col-span-2">
              <input
                autoFocus
                className={classeCampo}
                value={form.nome}
                onChange={(e) => alterar('nome', e.target.value)}
                placeholder="Ex.: Thor"
                maxLength={100}
                required
              />
            </Campo>

            <Campo label="Espécie *">
              <select
                className={classeCampo}
                value={form.especie}
                onChange={(e) => alterar('especie', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                {ESPECIES.map((especie) => (
                  <option key={especie} value={especie}>
                    {especie}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Raça">
              <input
                className={classeCampo}
                value={form.raca}
                onChange={(e) => alterar('raca', e.target.value)}
                placeholder="Ex.: Golden Retriever"
                maxLength={100}
              />
            </Campo>

            <Campo label="Sexo *">
              <select
                className={classeCampo}
                value={form.sexo}
                onChange={(e) => alterar('sexo', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                {SEXOS.map((sexo) => (
                  <option key={sexo} value={sexo}>
                    {sexo}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Data de nascimento">
              <input
                type="date"
                className={classeCampo}
                value={form.nascimento}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => alterar('nascimento', e.target.value)}
              />
            </Campo>

            <Campo label="Peso (kg)">
              <input
                type="number"
                className={classeCampo}
                value={form.peso}
                onChange={(e) => alterar('peso', e.target.value)}
                placeholder="Ex.: 12,5"
                min="0.01"
                max="9999"
                step="0.01"
              />
            </Campo>

            <Campo label="Microchip">
              <input
                className={classeCampo}
                value={form.microchip}
                onChange={(e) => alterar('microchip', e.target.value)}
                placeholder="Número do microchip"
                maxLength={100}
              />
            </Campo>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0C4A45]">
            <Icone nome="user" />
            Responsável
          </div>

          <Campo label="Tutor">
            <select
              className={classeCampo}
              value={form.tutorId}
              onChange={(e) => alterar('tutorId', e.target.value)}
            >
              <option value="">Sem tutor vinculado</option>
              {tutores.map((tutor) => (
                <option key={tutor.id} value={tutor.id}>
                  {tutor.nome_completo || tutor.nome || 'Tutor sem nome'}
                </option>
              ))}
            </select>
            {tutores.length === 0 && (
              <span className="mt-1.5 block text-xs text-[#8B918F]">
                Cadastre um tutor na página Tutores para vinculá-lo depois.
              </span>
            )}
          </Campo>
        </div>

        <Campo label="Observações">
          <textarea
            className={`${classeCampo} min-h-24 resize-y`}
            value={form.observacoes}
            onChange={(e) => alterar('observacoes', e.target.value)}
            placeholder="Informações adicionais sobre o paciente..."
            maxLength={5000}
          />
        </Campo>

        {erroFormulario && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erroFormulario}
          </div>
        )}

        <div className="flex justify-end gap-3 border-t border-[#EAE8E3] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="rounded-xl border border-[#E4E7E2] px-4 py-2.5 text-sm font-medium text-[#46524F] transition hover:bg-[#F4F3EE] disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={salvando}
            className="rounded-xl bg-[#0C4A45] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#093B37] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {salvando
              ? 'Salvando...'
              : editando
                ? 'Salvar alterações'
                : 'Cadastrar animal'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function InfoItem({ titulo, valor }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[#858C88]">{titulo}</p>
      <p className="mt-1 break-words text-sm font-medium text-[#263633]">
        {valor || 'Não informado'}
      </p>
    </div>
  )
}

function AnimalDetail({ animal, onClose, onEditar, onExcluir, excluindo }) {
  const [aba, setAba] = useState('dados')

  if (!animal) return null

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-[#102321]/35 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <aside className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-[#FDFCF9] shadow-2xl">
        <header className="flex items-center justify-between border-b border-[#EAE8E3] px-6 py-5">
          <span className="text-sm font-medium text-[#79817D]">
            Ficha do paciente
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar ficha"
            className="rounded-lg p-2 text-[#65716E] transition hover:bg-[#F0EFE9]"
          >
            <Icone nome="close" />
          </button>
        </header>

        <div className="px-6 pb-6 pt-7">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2E9] text-4xl">
              {ESPECIE_ICON[animal.especie] || '🐾'}
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-2xl font-semibold text-[#15312E]">
                {animal.nome}
              </h2>
              <p className="mt-1 text-sm text-[#737D78]">
                {[animal.especie, animal.raca].filter(Boolean).join(' · ') ||
                  'Espécie não informada'}
              </p>
              <span className="mt-2 inline-flex rounded-full bg-[#E6F1E8] px-2.5 py-1 text-xs font-medium text-[#286747]">
                Paciente ativo
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#EAE8E3] bg-white p-4">
              <p className="text-xs text-[#858C88]">Idade</p>
              <p className="mt-1 text-base font-semibold text-[#263633]">
                {calcularIdade(animal.nascimento)}
              </p>
            </div>

            <div className="rounded-xl border border-[#EAE8E3] bg-white p-4">
              <p className="text-xs text-[#858C88]">Peso atual</p>
              <p className="mt-1 text-base font-semibold text-[#263633]">
                {animal.peso !== '' && animal.peso !== null
                  ? `${animal.peso} kg`
                  : 'Não informado'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex border-b border-[#EAE8E3]">
            <button
              type="button"
              onClick={() => setAba('dados')}
              className={`border-b-2 px-4 py-3 text-sm font-medium ${
                aba === 'dados'
                  ? 'border-[#0C4A45] text-[#0C4A45]'
                  : 'border-transparent text-[#858C88] hover:text-[#263633]'
              }`}
            >
              Dados gerais
            </button>
            <button
              type="button"
              onClick={() => setAba('observacoes')}
              className={`border-b-2 px-4 py-3 text-sm font-medium ${
                aba === 'observacoes'
                  ? 'border-[#0C4A45] text-[#0C4A45]'
                  : 'border-transparent text-[#858C88] hover:text-[#263633]'
              }`}
            >
              Observações
            </button>
          </div>

          {aba === 'dados' ? (
            <div className="mt-5 space-y-6">
              <section>
                <h3 className="mb-4 text-sm font-semibold text-[#15312E]">
                  Informações do animal
                </h3>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                  <InfoItem titulo="Nome" valor={animal.nome} />
                  <InfoItem titulo="Espécie" valor={animal.especie} />
                  <InfoItem titulo="Raça" valor={animal.raca} />
                  <InfoItem titulo="Sexo" valor={animal.sexo} />
                  <InfoItem
                    titulo="Nascimento"
                    valor={formatarData(animal.nascimento)}
                  />
                  <InfoItem
                    titulo="Microchip"
                    valor={animal.microchip}
                  />
                </div>
              </section>

              <section className="border-t border-[#EAE8E3] pt-5">
                <h3 className="mb-4 text-sm font-semibold text-[#15312E]">
                  Tutor responsável
                </h3>
                <div className="flex items-center gap-3 rounded-xl border border-[#EAE8E3] bg-white p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F0E9] text-[#0C4A45]">
                    <Icone nome="user" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#263633]">
                      {animal.tutorNome}
                    </p>
                    <p className="mt-0.5 text-xs text-[#858C88]">
                      Responsável cadastrado
                    </p>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <section className="mt-5">
              <h3 className="mb-3 text-sm font-semibold text-[#15312E]">
                Observações clínicas
              </h3>
              <div className="whitespace-pre-wrap rounded-xl border border-[#EAE8E3] bg-white p-4 text-sm leading-6 text-[#46524F]">
                {animal.observacoes || 'Nenhuma observação cadastrada.'}
              </div>
            </section>
          )}

          <div className="mt-8 flex flex-col gap-3 border-t border-[#EAE8E3] pt-5">
            <button
              type="button"
              onClick={onEditar}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0C4A45] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#093B37]"
            >
              <Icone nome="edit" tamanho={16} />
              Editar ficha
            </button>

            <button
              type="button"
              onClick={onExcluir}
              disabled={excluindo}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
            >
              <Icone nome="trash" tamanho={16} />
              {excluindo ? 'Inativando...' : 'Inativar animal'}
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default function Animais() {
  const [animais, setAnimais] = useState([])
  const [tutores, setTutores] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroEspecie, setFiltroEspecie] = useState('Todos')
  const [animalSelecionado, setAnimalSelecionado] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [animalEditando, setAnimalEditando] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const carregarDados = useCallback(async () => {
    setCarregando(true)
    setErro('')

    try {
      const [resultadoAnimais, resultadoTutores] = await Promise.all([
        requisicaoAPI('animais'),
        requisicaoAPI('tutores'),
      ])

      setAnimais(
        extrairLista(resultadoAnimais, 'animais').map(converterAnimal)
      )
      setTutores(extrairLista(resultadoTutores, 'tutores'))
    } catch (error) {
      setErro(mensagemErro(error))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  async function salvarAnimal(formulario) {
    setSalvando(true)
    setErro('')
    setSucesso('')

    const dados = {
      nome: formulario.nome,
      especie: converterEspecieParaBanco(formulario.especie),
      raca: formulario.raca || null,
      sexo: converterSexoParaBanco(formulario.sexo) || null,
      data_nascimento: formulario.nascimento || null,
      peso:
        formulario.peso === '' || formulario.peso === null
          ? null
          : Number(formulario.peso),
      microchip: formulario.microchip || null,
      observacoes: formulario.observacoes || null,
      tutor_id: formulario.tutorId || null,
    }

    try {
      if (animalEditando) {
        await requisicaoAPI(`animais/${animalEditando.id}`, {
          method: 'PUT',
          body: JSON.stringify(dados),
        })

        setSucesso('Animal atualizado com sucesso.')
      } else {
        await requisicaoAPI('animais', {
          method: 'POST',
          body: JSON.stringify(dados),
        })

        setSucesso('Animal cadastrado com sucesso.')
      }

      setModalAberto(false)
      setAnimalEditando(null)
      setAnimalSelecionado(null)
      await carregarDados()
    } catch (error) {
      setErro(mensagemErro(error))
      throw error
    } finally {
      setSalvando(false)
    }
  }

  async function inativarAnimal() {
    if (!animalSelecionado) return

    const confirmar = window.confirm(
      `Deseja realmente inativar o cadastro de ${animalSelecionado.nome}?`
    )

    if (!confirmar) return

    setExcluindo(true)
    setErro('')
    setSucesso('')

    try {
      await requisicaoAPI(`animais/${animalSelecionado.id}`, {
        method: 'DELETE',
      })

      setAnimalSelecionado(null)
      setSucesso('Animal inativado com sucesso.')
      await carregarDados()
    } catch (error) {
      setErro(mensagemErro(error))
    } finally {
      setExcluindo(false)
    }
  }

  function abrirEdicao() {
    setAnimalEditando(animalSelecionado)
    setAnimalSelecionado(null)
    setModalAberto(true)
  }

  const animaisFiltrados = animais.filter((animal) => {
    const termo = busca.trim().toLowerCase()

    const correspondeBusca =
      animal.nome.toLowerCase().includes(termo) ||
      animal.raca.toLowerCase().includes(termo) ||
      animal.tutorNome.toLowerCase().includes(termo) ||
      animal.especie.toLowerCase().includes(termo)

    const correspondeEspecie =
      filtroEspecie === 'Todos' ||
      animal.especie.toLowerCase() === filtroEspecie.toLowerCase()

    return correspondeBusca && correspondeEspecie
  })

  const quantidadeCaes = animais.filter(
    (animal) => animal.especie === 'Cão'
  ).length

  const quantidadeGatos = animais.filter(
    (animal) => animal.especie === 'Gato'
  ).length

  const quantidadeOutros = animais.length - quantidadeCaes - quantidadeGatos

  return (
    <main className="mx-auto min-h-full max-w-[1500px] p-4 sm:p-6">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#7A807E]">Cadastro e acompanhamento</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#0C1A1A]">
            Animais
          </h1>
          <p className="mt-1 text-sm text-[#8B918F]">
            Gerencie os pacientes e consulte suas informações.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setAnimalEditando(null)
            setModalAberto(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E05C2A] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C94B20]"
        >
          <Icone nome="plus" tamanho={17} />
          Novo animal
        </button>
      </header>

      {erro && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{erro}</span>
          <button
            type="button"
            onClick={() => setErro('')}
            aria-label="Fechar mensagem"
            className="shrink-0 rounded p-0.5 hover:bg-red-100"
          >
            <Icone nome="close" tamanho={16} />
          </button>
        </div>
      )}

      {sucesso && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>{sucesso}</span>
          <button
            type="button"
            onClick={() => setSucesso('')}
            aria-label="Fechar mensagem"
            className="rounded p-0.5 hover:bg-green-100"
          >
            <Icone nome="close" tamanho={16} />
          </button>
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#EAE8E3] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7A807E]">Total de pacientes</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF2E9] text-[#0C4A45]">
              <Icone nome="paw" tamanho={20} />
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold text-[#15312E]">
            {carregando ? '—' : animais.length}
          </p>
          <p className="mt-1 text-xs text-[#858C88]">
            Animais cadastrados no estabelecimento
          </p>
        </div>

        <div className="rounded-2xl border border-[#EAE8E3] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7A807E]">Cães</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0E6] text-xl">
              🐕
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold text-[#15312E]">
            {carregando ? '—' : quantidadeCaes}
          </p>
          <p className="mt-1 text-xs text-[#858C88]">
            Pacientes da espécie canina
          </p>
        </div>

        <div className="rounded-2xl border border-[#EAE8E3] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#7A807E]">Gatos e outros</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0ECFA] text-xl">
              🐈
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold text-[#15312E]">
            {carregando ? '—' : quantidadeGatos + quantidadeOutros}
          </p>
          <p className="mt-1 text-xs text-[#858C88]">
            Felinos e demais espécies
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#EAE8E3] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#EAE8E3] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-semibold text-[#15312E]">
              Pacientes cadastrados
            </h2>
            <p className="mt-1 text-xs text-[#858C88]">
              {carregando
                ? 'Carregando registros...'
                : `${animaisFiltrados.length} ${
                    animaisFiltrados.length === 1
                      ? 'paciente encontrado'
                      : 'pacientes encontrados'
                  }`}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Icone
                nome="search"
                tamanho={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929994]"
              />
              <input
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar animal ou tutor..."
                aria-label="Buscar animal ou tutor"
                className="w-full rounded-xl border border-[#E4E7E2] py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#0C4A45] sm:w-64"
              />
            </div>

            <select
              value={filtroEspecie}
              onChange={(event) => setFiltroEspecie(event.target.value)}
              aria-label="Filtrar por espécie"
              className="rounded-xl border border-[#E4E7E2] bg-white px-3 py-2.5 text-sm text-[#46524F] outline-none focus:border-[#0C4A45]"
            >
              <option value="Todos">Todas as espécies</option>
              {ESPECIES.map((especie) => (
                <option key={especie} value={especie}>
                  {especie}
                </option>
              ))}
            </select>
          </div>
        </div>

        {carregando ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-[#F3F3EE]"
              />
            ))}
          </div>
        ) : animaisFiltrados.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2E9] text-3xl">
              🐾
            </div>
            <h3 className="mt-4 font-semibold text-[#15312E]">
              {animais.length === 0
                ? 'Nenhum animal cadastrado'
                : 'Nenhum resultado encontrado'}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#858C88]">
              {animais.length === 0
                ? 'Cadastre o primeiro paciente para começar a organizar as informações no UniVet.'
                : 'Tente mudar a pesquisa ou selecionar outra espécie.'}
            </p>
            {animais.length === 0 && (
              <button
                type="button"
                onClick={() => setModalAberto(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0C4A45] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#093B37]"
              >
                <Icone nome="plus" tamanho={16} />
                Cadastrar primeiro animal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {animaisFiltrados.map((animal) => (
              <button
                type="button"
                key={animal.id}
                onClick={() => setAnimalSelecionado(animal)}
                className="group rounded-2xl border border-[#EAE8E3] bg-white p-4 text-left transition hover:border-[#B7CDC3] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/20"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EAF2E9] text-3xl">
                    {ESPECIE_ICON[animal.especie] || '🐾'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-semibold text-[#15312E]">
                        {animal.nome}
                      </h3>
                      <Icone
                        nome="chevron"
                        tamanho={17}
                        className="shrink-0 text-[#A0A7A2] transition group-hover:translate-x-0.5 group-hover:text-[#0C4A45]"
                      />
                    </div>
                    <p className="mt-1 truncate text-sm text-[#737D78]">
                      {animal.raca || animal.especie || 'Raça não informada'}
                    </p>
                    <p className="mt-1 text-xs text-[#858C88]">
                      {animal.especie}
                      {animal.sexo ? ` · ${animal.sexo}` : ''}
                    </p>
                  </div>
                </div>

                <div className="my-4 border-t border-[#F0EFEA]" />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2 text-sm text-[#65716E]">
                    <Icone nome="user" tamanho={15} />
                    <span className="truncate">{animal.tutorNome}</span>
                  </div>
                  <span className="shrink-0 text-xs text-[#858C88]">
                    {animal.peso !== '' && animal.peso !== null
                      ? `${animal.peso} kg`
                      : 'Sem peso'}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-[#858C88]">
                  <Icone nome="calendar" tamanho={14} />
                  <span>
                    {animal.nascimento
                      ? `Nascimento: ${formatarData(animal.nascimento)}`
                      : 'Nascimento não informado'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {modalAberto && (
        <NovoAnimalModal
          onClose={() => {
            if (!salvando) {
              setModalAberto(false)
              setAnimalEditando(null)
            }
          }}
          onSalvar={salvarAnimal}
          tutores={tutores}
          salvando={salvando}
          animalInicial={animalEditando}
        />
      )}

      {animalSelecionado && (
        <AnimalDetail
          animal={animalSelecionado}
          onClose={() => setAnimalSelecionado(null)}
          onEditar={abrirEdicao}
          onExcluir={inativarAnimal}
          excluindo={excluindo}
        />
      )}
    </main>
  )
}
