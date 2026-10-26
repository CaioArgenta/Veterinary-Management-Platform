
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

const ESPECIE_ICON = {
  Cão: '🐕',
  Cachorro: '🐕',
  Gato: '🐈',
  Ave: '🦜',
  Réptil: '🦎',
  Outro: '🐾',
}

const STATUS_COLOR = {
  Agendada: 'bg-blue-100 text-blue-700 border-blue-200',
  Confirmada: 'bg-green-100 text-green-700 border-green-200',
  'Em atendimento': 'bg-amber-100 text-amber-700 border-amber-200',
  Concluída: 'bg-[#E8F4F0] text-[#0C4A45] border-[#0C4A45]/20',
  Cancelada: 'bg-gray-100 text-gray-500 border-gray-200',
  'Não compareceu': 'bg-rose-100 text-rose-600 border-rose-200',
}

const STATUS_BANCO = {
  Agendada: 'AGENDADO',
  Confirmada: 'CONFIRMADO',
  'Em atendimento': 'EM_ATENDIMENTO',
  Concluída: 'CONCLUIDO',
  Cancelada: 'CANCELADO',
  'Não compareceu': 'NAO_COMPARECEU',
}

const STATUS_INTERFACE = Object.fromEntries(
  Object.entries(STATUS_BANCO).map(([interfaceStatus, bancoStatus]) => [
    bancoStatus,
    interfaceStatus,
  ])
)

const TIPOS = [
  'Consulta geral',
  'Retorno',
  'Vacinação',
  'Cirurgia',
  'Exame',
  'Acompanhamento',
  'Emergência',
]

const TIPO_BANCO = {
  'Consulta geral': 'CONSULTA',
  Retorno: 'RETORNO',
  Vacinação: 'VACINACAO',
  Cirurgia: 'PROCEDIMENTO',
  Exame: 'PROCEDIMENTO',
  Acompanhamento: 'OUTRO',
  Emergência: 'OUTRO',
}

const TIPO_INTERFACE = {
  CONSULTA: 'Consulta geral',
  RETORNO: 'Retorno',
  VACINACAO: 'Vacinação',
  PROCEDIMENTO: 'Procedimento',
  OUTRO: 'Outro',
}

const HORAS = [
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00',
  '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00',
]

function dataLocal(data = new Date()) {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function inicioSemana(data) {
  const resultado = new Date(`${data}T12:00:00`)
  resultado.setDate(resultado.getDate() - resultado.getDay())
  return dataLocal(resultado)
}

function adicionarDias(data, quantidade) {
  const resultado = new Date(`${data}T12:00:00`)
  resultado.setDate(resultado.getDate() + quantidade)
  return dataLocal(resultado)
}

function formatarData(data) {
  if (!data) return '-'

  return new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR')
}

function formatarDataExtenso(data) {
  return new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function calcularFim(hora, duracao) {
  const [horas, minutos] = hora.split(':').map(Number)
  const total = horas * 60 + minutos + Number(duracao)

  if (total >= 24 * 60) {
    throw new Error('A consulta precisa terminar no mesmo dia.')
  }

  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}:00`
}

function calcularDuracao(inicio, fim) {
  if (!inicio || !fim) return 30

  const [h1, m1] = inicio.slice(0, 5).split(':').map(Number)
  const [h2, m2] = fim.slice(0, 5).split(':').map(Number)

  return Math.max(0, h2 * 60 + m2 - (h1 * 60 + m1))
}

async function obterToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) throw error

  if (!session?.access_token) {
    throw new Error('Sua sessão expirou. Entre novamente.')
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

  const texto = await resposta.text()
  let dados = {}

  if (texto) {
    try {
      dados = JSON.parse(texto)
    } catch {
      throw new Error('O servidor retornou uma resposta inválida.')
    }
  }

  if (!resposta.ok) {
    throw new Error(dados.mensagem || 'Erro ao realizar a operação.')
  }

  return dados
}


function converterConsulta(item) {
  const animal = Array.isArray(item.animais)
    ? item.animais[0]
    : item.animais

  const veterinario = Array.isArray(item.veterinario)
    ? item.veterinario[0]
    : item.veterinario

  return {
    id: item.id,
    animalId: item.animal_id,
    animalNome: animal?.nome || 'Animal não identificado',
    especie: animal?.especie || 'Outro',
    tutorNome: animal?.tutorNome || 'Tutor não informado',
    veterinarioId: item.veterinario_id || '',
    veterinario:
      typeof veterinario === 'string'
        ? veterinario
        : veterinario?.nome_completo ||
          veterinario?.nome ||
          item.veterinario_nome ||
          'Não informado',
    data: item.data,
    hora: item.horario_inicio?.slice(0, 5) || '08:00',
    duracao: calcularDuracao(item.horario_inicio, item.horario_fim),
    tipo: TIPO_INTERFACE[item.tipo] || item.tipo,
    status: STATUS_INTERFACE[item.status] || item.status,
    observacao: item.motivo || '',
  }
}

function converterAnimal(item) {
  return {
    id: item.id,
    nome: item.nome,
    especie: item.especie || 'Outro',
    tutorNome: item.tutorNome || item.tutor_nome || '',
    alerta: item.alerta || '',
  }
}

function NovaConsultaModal({ animais, onClose, onSalvar, salvando }) {
  const [form, setForm] = useState({
    animalId: '',
    veterinario: '',
    data: dataLocal(),
    hora: '09:00',
    duracao: '30',
    tipo: 'Consulta geral',
    observacao: '',
  })

  const [veterinarios, setVeterinarios] = useState([])
  const [carregandoVeterinarios, setCarregandoVeterinarios] = useState(true)
  const [erro, setErro] = useState('')

  function set(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  const inputCls =
    'w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-2.5 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45] transition-all'

  const animalSel = animais.find(
    (animal) => String(animal.id) === String(form.animalId)
  )

  useEffect(() => {
    let ativo = true

    async function carregarVeterinarios() {
      try {
        setCarregandoVeterinarios(true)

        const dados = await requisicaoAPI('/api/consultas/veterinarios')

        if (ativo) {
          setVeterinarios(
            Array.isArray(dados)
              ? dados
              : Array.isArray(dados?.veterinarios)
                ? dados.veterinarios
                : []
          )
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error.message || 'Não foi possível carregar os responsáveis.'
          )
        }
      } finally {
        if (ativo) setCarregandoVeterinarios(false)
      }
    }

    carregarVeterinarios()

    return () => {
      ativo = false
    }
  }, [])

  async function enviar() {
    setErro('')

    if (!form.animalId || !form.data || !form.hora) {
      setErro('Preencha o animal, a data e o horário.')
      return
    }

    try {
      await onSalvar({
        animal_id: form.animalId,
        veterinario_id: form.veterinario || null,
        data: form.data,
        horario_inicio: `${form.hora}:00`,
        horario_fim: calcularFim(form.hora, form.duracao),
        tipo: TIPO_BANCO[form.tipo] || 'CONSULTA',
        status: 'AGENDADO',
        motivo: form.observacao.trim() || null,
      })
    } catch (error) {
      setErro(error.message || 'Não foi possível agendar a consulta.')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md h-full max-h-[88vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#EAE8E3] sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-semibold text-[#0C1A1A]">Nova consulta</h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Agende um novo atendimento
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#0C1A1A]"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {erro && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-sm">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
              Animal *
            </label>
            <select
              className={inputCls}
              value={form.animalId}
              onChange={(e) => set('animalId', e.target.value)}
            >
              <option value="">Selecionar animal</option>
              {animais.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome} ({animal.especie}
                  {animal.tutorNome ? ` · ${animal.tutorNome}` : ''})
                </option>
              ))}
            </select>

            {!animais.length && (
              <p className="text-xs text-amber-700 mt-1">
                Nenhum animal disponível. Cadastre um animal antes de agendar.
              </p>
            )}
          </div>

          {animalSel?.alerta && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800">
              <span>⚠</span>
              <span>{animalSel.alerta}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
              Veterinário responsável
            </label>

            <select
              className={inputCls}
              value={form.veterinario}
              onChange={(e) => set('veterinario', e.target.value)}
              disabled={carregandoVeterinarios}
            >
              <option value="">
                {carregandoVeterinarios
                  ? 'Carregando responsáveis...'
                  : 'Sem veterinário vinculado'}
              </option>

              {veterinarios.map((veterinario) => (
                <option key={veterinario.id} value={veterinario.id}>
                  {veterinario.nome_completo ||
                    veterinario.nome ||
                    'Responsável sem nome'}
                  {veterinario.tipo === 'ADMINISTRADOR'
                    ? ' (Administrador)'
                    : veterinario.crmv
                      ? ` · CRMV ${veterinario.crmv}`
                      : ''}
                </option>
              ))}
            </select>

            {!carregandoVeterinarios && veterinarios.length === 0 && (
              <p className="text-xs text-amber-700 mt-1">
                Nenhum responsável encontrado. Você ainda pode agendar sem
                vincular um veterinário.
              </p>
            )}

            {carregandoVeterinarios && (
              <p className="text-xs text-[#9CA3AF] mt-1">
                Buscando os responsáveis cadastrados...
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Data *
              </label>
              <input
                type="date"
                min={dataLocal()}
                className={inputCls}
                value={form.data}
                onChange={(e) => set('data', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Horário *
              </label>
              <select
                className={inputCls}
                value={form.hora}
                onChange={(e) => set('hora', e.target.value)}
              >
                {HORAS.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Duração (min)
              </label>
              <select
                className={inputCls}
                value={form.duracao}
                onChange={(e) => set('duracao', e.target.value)}
              >
                {['15', '30', '45', '60', '90', '120'].map((duracao) => (
                  <option key={duracao} value={duracao}>
                    {duracao} min
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Tipo de atendimento
              </label>
              <select
                className={inputCls}
                value={form.tipo}
                onChange={(e) => set('tipo', e.target.value)}
              >
                {TIPOS.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
              Observação
            </label>
            <textarea
              className={inputCls + ' resize-none'}
              rows={3}
              placeholder="Ex: Animal apresentou falta de apetite nos últimos dias…"
              value={form.observacao}
              onChange={(e) => set('observacao', e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-[#EAE8E3] sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            disabled={salvando}
            className="flex-1 border border-[#D8D5CE] text-[#6B7280] font-medium py-2.5 rounded-[10px] text-sm hover:bg-[#F7F5F0]"
          >
            Cancelar
          </button>

          <button
            onClick={enviar}
            disabled={salvando || !animais.length || carregandoVeterinarios}
            className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] text-sm hover:bg-[#0a3d38] disabled:opacity-50"
          >
            {salvando ? 'Agendando...' : 'Agendar consulta'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ConsultaModal({ consulta, onClose, onSalvarStatus, salvando }) {
  const [status, setStatus] = useState(consulta.status)
  const [erro, setErro] = useState('')

  async function salvar() {
    setErro('')

    try {
      await onSalvarStatus(consulta.id, STATUS_BANCO[status])
    } catch (error) {
      setErro(error.message || 'Não foi possível atualizar o status.')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#EAE8E3]">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {ESPECIE_ICON[consulta.especie] || '🐾'}
            </span>
            <div>
              <h2 className="font-semibold text-[#0C1A1A]">
                {consulta.animalNome}
              </h2>
              <p className="text-xs text-[#9CA3AF]">{consulta.tipo}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#0C1A1A]"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {erro && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-sm">
              {erro}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoItem label="Tutor" value={consulta.tutorNome} />
            <InfoItem label="Veterinário" value={consulta.veterinario} />
            <InfoItem label="Data" value={formatarData(consulta.data)} />
            <InfoItem
              label="Horário"
              value={`${consulta.hora} · ${consulta.duracao}min`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0C1A1A] mb-2">
              Status da consulta
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(STATUS_BANCO).map((statusItem) => (
                <button
                  key={statusItem}
                  onClick={() => setStatus(statusItem)}
                  className={`text-xs font-medium px-3 py-2 rounded-xl border transition-all ${
                    status === statusItem
                      ? STATUS_COLOR[statusItem]
                      : 'bg-white border-[#D8D5CE] text-[#6B7280] hover:border-[#0C4A45]/30'
                  }`}
                >
                  {statusItem}
                </button>
              ))}
            </div>
          </div>

          {consulta.observacao && (
            <div className="bg-[#F7F5F0] rounded-xl px-4 py-3 text-sm text-[#6B7280]">
              {consulta.observacao}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-[#EAE8E3]">
          <button
            onClick={onClose}
            disabled={salvando}
            className="flex-1 border border-[#D8D5CE] text-[#6B7280] font-medium py-2.5 rounded-[10px] text-sm hover:bg-[#F7F5F0]"
          >
            Fechar
          </button>
          <button
            onClick={salvar}
            disabled={salvando}
            className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] text-sm hover:bg-[#0a3d38] disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar status'}
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-[#0C1A1A]">{value || '-'}</p>
    </div>
  )
}

export default function Agenda() {
  const navigate = useNavigate()

  const [view, setView] = useState('semana')
  const [novaOpen, setNovaOpen] = useState(false)
  const [consultaSel, setConsultaSel] = useState(null)
  const [dataAtual, setDataAtual] = useState(dataLocal())
  const [consultas, setConsultas] = useState([])
  const [animais, setAnimais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const semanaInicio = inicioSemana(dataAtual)
  const semanaDatas = Array.from(
    { length: 7 },
    (_, indice) => adicionarDias(semanaInicio, indice)
  )

  const consultasDia = consultas
    .filter((consulta) => consulta.data === dataAtual)
    .sort((a, b) => a.hora.localeCompare(b.hora))

  useEffect(() => {
    carregarDados()
  }, [dataAtual])

  async function carregarDados() {
    try {
      setCarregando(true)
      setErro('')

      const [dadosConsultas, dadosAnimais] = await Promise.all([
        requisicaoAPI(
          `/api/agenda?data_inicio=${semanaInicio}&data_fim=${adicionarDias(semanaInicio, 6)}`
        ),
        requisicaoAPI('/api/animais'),
      ])

      setConsultas(
        Array.isArray(dadosConsultas)
          ? dadosConsultas.map(converterConsulta)
          : []
      )

      setAnimais(
        Array.isArray(dadosAnimais)
          ? dadosAnimais.map(converterAnimal)
          : []
      )
    } catch (error) {
      console.error('Erro ao carregar agenda:', error)

      if (
        error.message?.includes('sessão') ||
        error.message?.includes('autenticado')
      ) {
        navigate('/login')
        return
      }

      setErro(error.message || 'Não foi possível carregar a agenda.')
    } finally {
      setCarregando(false)
    }
  }

  async function criarConsulta(dados) {
    setSalvando(true)

    try {
      await requisicaoAPI('/api/agenda', {
        method: 'POST',
        body: JSON.stringify(dados),
      })

      setNovaOpen(false)
      setSucesso('Consulta agendada com sucesso.')
      await carregarDados()
      setTimeout(() => setSucesso(''), 3500)
    } finally {
      setSalvando(false)
    }
  }

  async function atualizarStatus(id, status) {
    setSalvando(true)

    try {
      await requisicaoAPI(`/api/agenda/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })

      setConsultaSel(null)
      setSucesso('Status atualizado com sucesso.')
      await carregarDados()
      setTimeout(() => setSucesso(''), 3500)
    } finally {
      setSalvando(false)
    }
  }

  function mudarSemana(direcao) {
    setDataAtual(adicionarDias(dataAtual, direcao * 7))
  }

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      {novaOpen && (
        <NovaConsultaModal
          animais={animais}
          onClose={() => setNovaOpen(false)}
          onSalvar={criarConsulta}
          salvando={salvando}
        />
      )}

      {consultaSel && (
        <ConsultaModal
          key={consultaSel.id}
          consulta={consultaSel}
          onClose={() => setConsultaSel(null)}
          onSalvarStatus={atualizarStatus}
          salvando={salvando}
        />
      )}

      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[#0C1A1A]">Agenda</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            Semana de {formatarData(semanaInicio)} a{' '}
            {formatarData(adicionarDias(semanaInicio, 6))}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-white border border-[#D8D5CE] rounded-[10px] p-0.5">
            {['semana', 'dia', 'lista'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  view === v
                    ? 'bg-[#0C4A45] text-white'
                    : 'text-[#6B7280] hover:text-[#0C1A1A]'
                }`}
              >
                {v === 'semana' ? 'Semana' : v === 'dia' ? 'Dia' : 'Lista'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setNovaOpen(true)}
            className="flex items-center gap-2 bg-[#E05C2A] text-white font-semibold px-4 py-2.5 rounded-[10px] hover:bg-[#C4501F] text-sm transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
            </svg>
            Nova consulta
          </button>
        </div>
      </div>

      {erro && (
        <div className="mb-4 flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-sm">
          <span>{erro}</span>
          <button onClick={carregarDados} className="font-semibold underline">
            Tentar novamente
          </button>
        </div>
      )}

      {sucesso && (
        <div className="mb-4 bg-[#E8F4F0] border border-[#0C4A45]/20 text-[#0C4A45] rounded-xl p-3 text-sm">
          {sucesso}
        </div>
      )}

      {carregando ? (
        <div className="bg-white rounded-2xl border border-[#EAE8E3] p-10 text-center text-sm text-[#6B7280]">
          Carregando agenda...
        </div>
      ) : (
        <>
          {view === 'semana' && (
            <div className="bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden">
              <div className="grid grid-cols-8 border-b border-[#EAE8E3]">
                <div className="border-r border-[#EAE8E3]" />

                {semanaDatas.map((data, indice) => (
                  <button
                    key={data}
                    onClick={() => {
                      setDataAtual(data)
                      setView('dia')
                    }}
                    className={`px-2 py-3 text-center border-r border-[#EAE8E3] last:border-0 ${
                      data === dataAtual ? 'bg-[#E8F4F0]' : ''
                    }`}
                  >
                    <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][indice]}
                    </p>
                    <p
                      className={`text-lg font-semibold mt-0.5 ${
                        data === dataAtual
                          ? 'text-[#0C4A45]'
                          : 'text-[#0C1A1A]'
                      }`}
                    >
                      {data.slice(8, 10)}
                    </p>
                  </button>
                ))}
              </div>

              <div className="overflow-y-auto max-h-[520px]">
                {HORAS.map((hora) => (
                  <div
                    key={hora}
                    className="grid grid-cols-8 border-b border-[#F3F1EC] min-h-[56px]"
                  >
                    <div className="px-3 py-2 border-r border-[#EAE8E3] flex items-start">
                      <span className="text-xs font-mono text-[#9CA3AF]">
                        {hora}
                      </span>
                    </div>

                    {semanaDatas.map((data) => {
                      const itens = consultas.filter(
                        (consulta) =>
                          consulta.data === data && consulta.hora === hora
                      )

                      return (
                        <div
                          key={data}
                          className={`px-1 py-1 border-r border-[#F3F1EC] last:border-0 ${
                            data === dataAtual ? 'bg-[#E8F4F0]/30' : ''
                          }`}
                        >
                          {itens.map((consulta) => (
                            <button
                              key={consulta.id}
                              onClick={() => setConsultaSel(consulta)}
                              className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] font-medium border transition-all hover:shadow-sm ${
                                STATUS_COLOR[consulta.status] ||
                                STATUS_COLOR.Agendada
                              }`}
                            >
                              <p className="truncate">
                                {ESPECIE_ICON[consulta.especie] || '🐾'}{' '}
                                {consulta.animalNome}
                              </p>
                            </button>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'dia' && (
            <div className="bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#EAE8E3] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setDataAtual(adicionarDias(dataAtual, -1))
                    }
                    className="border border-[#D8D5CE] rounded-lg px-2 py-1 text-sm"
                  >
                    ‹
                  </button>

                  <h3 className="font-semibold text-[#0C1A1A] capitalize">
                    {formatarDataExtenso(dataAtual)}
                  </h3>

                  <button
                    onClick={() =>
                      setDataAtual(adicionarDias(dataAtual, 1))
                    }
                    className="border border-[#D8D5CE] rounded-lg px-2 py-1 text-sm"
                  >
                    ›
                  </button>
                </div>

                <span className="text-sm text-[#6B7280]">
                  {consultasDia.length} consultas
                </span>
              </div>

              <div className="divide-y divide-[#F3F1EC]">
                {HORAS.map((hora) => {
                  const itens = consultasDia.filter(
                    (consulta) => consulta.hora === hora
                  )

                  return (
                    <div
                      key={hora}
                      className="flex gap-4 px-6 py-3 min-h-[60px]"
                    >
                      <span className="text-xs font-mono text-[#9CA3AF] w-10 shrink-0 pt-1">
                        {hora}
                      </span>

                      <div className="flex-1 space-y-1.5">
                        {itens.map((consulta) => (
                          <button
                            key={consulta.id}
                            onClick={() => setConsultaSel(consulta)}
                            className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all hover:shadow-sm ${
                              STATUS_COLOR[consulta.status] ||
                              STATUS_COLOR.Agendada
                            }`}
                          >
                            <span className="text-base">
                              {ESPECIE_ICON[consulta.especie] || '🐾'}
                            </span>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {consulta.animalNome}
                              </p>
                              <p className="text-xs opacity-70 truncate">
                                {consulta.tipo} · {consulta.tutorNome}
                              </p>
                            </div>

                            <span className="text-[10px] font-bold opacity-70">
                              {consulta.duracao}min
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {view === 'lista' && (
            <div className="space-y-3">
              {semanaDatas.map((data) => {
                const itens = consultas
                  .filter((consulta) => consulta.data === data)
                  .sort((a, b) => a.hora.localeCompare(b.hora))

                return (
                  <div
                    key={data}
                    className="bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden"
                  >
                    <div
                      className={`px-5 py-3 border-b border-[#EAE8E3] ${
                        data === dataAtual ? 'bg-[#E8F4F0]' : 'bg-[#FAFAF8]'
                      }`}
                    >
                      <h3
                        className={`text-sm font-semibold capitalize ${
                          data === dataAtual
                            ? 'text-[#0C4A45]'
                            : 'text-[#6B7280]'
                        }`}
                      >
                        {formatarDataExtenso(data)}
                      </h3>
                    </div>

                    {itens.length ? (
                      <div className="divide-y divide-[#F3F1EC]">
                        {itens.map((consulta) => (
                          <button
                            key={consulta.id}
                            onClick={() => setConsultaSel(consulta)}
                            className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors text-left"
                          >
                            <span className="text-sm font-mono text-[#9CA3AF] w-10 shrink-0">
                              {consulta.hora}
                            </span>

                            <span className="text-lg">
                              {ESPECIE_ICON[consulta.especie] || '🐾'}
                            </span>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#0C1A1A]">
                                {consulta.animalNome}
                              </p>
                              <p className="text-xs text-[#9CA3AF]">
                                {consulta.tipo} · {consulta.tutorNome}
                              </p>
                            </div>

                            <span
                              className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 border ${
                                STATUS_COLOR[consulta.status] ||
                                STATUS_COLOR.Agendada
                              }`}
                            >
                              {consulta.status}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="px-5 py-4 text-sm text-[#9CA3AF]">
                        Nenhuma consulta neste dia.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => mudarSemana(-1)}
          className="text-sm text-[#0C4A45] hover:underline"
        >
          ← Semana anterior
        </button>

        <button
          onClick={() => setDataAtual(dataLocal())}
          className="text-sm text-[#0C4A45] hover:underline"
        >
          Hoje
        </button>

        <button
          onClick={() => mudarSemana(1)}
          className="text-sm text-[#0C4A45] hover:underline"
        >
          Próxima semana →
        </button>
      </div>
    </div>
  )
}
