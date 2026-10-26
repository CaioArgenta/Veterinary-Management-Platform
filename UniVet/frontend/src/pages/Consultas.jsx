
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

const ESPECIE_ICON = {
  CANINO: '🐕',
  FELINO: '🐈',
  AVE: '🦜',
  ROEDOR: '🐹',
  REPTIL: '🦎',
  OUTRO: '🐾',
  Cão: '🐕',
  Gato: '🐈',
  Ave: '🦜',
  Roedor: '🐹',
  Réptil: '🦎',
  Outro: '🐾'
}

function formatarDataHora(dataHora) {
  if (!dataHora) return { data: '', hora: '' }

  const data = new Date(dataHora)

  return {
    data: data.toLocaleDateString('pt-BR'),
    hora: data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

function dataHoraParaInput(dataHora) {
  if (!dataHora) return { data: '', hora: '' }

  const data = new Date(dataHora)

  return {
    data: [
      data.getFullYear(),
      String(data.getMonth() + 1).padStart(2, '0'),
      String(data.getDate()).padStart(2, '0')
    ].join('-'),
    hora: [
      String(data.getHours()).padStart(2, '0'),
      String(data.getMinutes()).padStart(2, '0')
    ].join(':')
  }
}

function nomeEspecie(especie) {
  const especies = {
    CANINO: 'Cão',
    FELINO: 'Gato',
    AVE: 'Ave',
    ROEDOR: 'Roedor',
    REPTIL: 'Réptil',
    OUTRO: 'Outro'
  }

  return especies[especie] || especie || 'Não informada'
}

function normalizarConsulta(consulta, animais = [], veterinarios = []) {
  const animal = consulta.animais || {}
  const animalLista = animais.find(item => item.id === consulta.animal_id)
  const veterinario = veterinarios.find(
    item => item.id === consulta.veterinario_id
  )
  const dataHora = formatarDataHora(consulta.data_hora)

  return {
    id: consulta.id,
    animalId: consulta.animal_id,
    animalNome: animal.nome || animalLista?.nome || 'Animal',
    especie: nomeEspecie(animal.especie || animalLista?.especie),
    tutorNome:
      animal.tutor?.nome_completo ||
      animalLista?.tutor?.nome_completo ||
      'Tutor não informado',
    veterinarioId: consulta.veterinario_id || '',
    veterinarioNome: veterinario
      ? nomeVeterinario(veterinario)
      : 'Veterinário não informado',
    data: dataHora.data,
    hora: dataHora.hora,
    data_hora: consulta.data_hora,
    queixa: consulta.queixa || '',
    diagnostico: consulta.diagnostico || '',
    tratamento: consulta.tratamento || '',
    observacoes: consulta.observacoes || '',
    agendamentoId: consulta.agendamento_id
  }
}

function nomeVeterinario(veterinario) {
  if (veterinario.nome_completo) return veterinario.nome_completo
  if (veterinario.nome) return veterinario.nome
  if (veterinario.crmv) return `CRMV ${veterinario.crmv}`

  return `Veterinário ${veterinario.id.slice(0, 8)}`
}

async function requisicaoAPI(caminho, opcoes = {}) {
  const { data: sessaoData, error: sessaoErro } =
    await supabase.auth.getSession()

  if (sessaoErro) throw sessaoErro

  const token = sessaoData.session?.access_token

  if (!token) {
    throw new Error('Sua sessão expirou. Entre novamente no UniVet.')
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...opcoes.headers
    }
  })

  const texto = await resposta.text()
  let resultado = null

  if (texto) {
    try {
      resultado = JSON.parse(texto)
    } catch {
      throw new Error('O servidor retornou uma resposta inválida.')
    }
  }

  if (!resposta.ok) {
    throw new Error(
      resultado?.mensagem || 'Não foi possível concluir a operação.'
    )
  }

  return resultado
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#4A5568] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-2.5 text-sm text-[#0C1A1A] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30'

function ProntuarioModal({
  animais,
  veterinarios,
  consulta,
  salvando,
  onClose,
  onSalvar
}) {
  const [form, setForm] = useState({
    animal_id: '',
    veterinario_id: '',
    data: '',
    hora: '',
    queixa: '',
    diagnostico: '',
    tratamento: '',
    observacoes: ''
  })

  const [erroForm, setErroForm] = useState('')

  useEffect(() => {
    if (!consulta) return

    const dataHora = dataHoraParaInput(consulta.data_hora)

    setForm({
      animal_id: consulta.animalId || '',
      veterinario_id: consulta.veterinarioId || '',
      data: dataHora.data,
      hora: dataHora.hora,
      queixa: consulta.queixa || '',
      diagnostico: consulta.diagnostico || '',
      tratamento: consulta.tratamento || '',
      observacoes: consulta.observacoes || ''
    })
  }, [consulta])

  function alterar(campo, valor) {
    setForm(atual => ({
      ...atual,
      [campo]: valor
    }))
  }

  async function enviar(e) {
    e.preventDefault()
    setErroForm('')

    if (
      !form.animal_id ||
      !form.veterinario_id ||
      !form.data ||
      !form.hora ||
      !form.queixa.trim()
    ) {
      setErroForm(
        'Preencha o animal, o veterinário, a data, o horário e a queixa principal.'
      )
      return
    }

    try {
      await onSalvar({
        animal_id: form.animal_id,
        veterinario_id: form.veterinario_id,
        data_hora: new Date(
          `${form.data}T${form.hora}:00`
        ).toISOString(),
        queixa: form.queixa.trim(),
        diagnostico: form.diagnostico.trim(),
        tratamento: form.tratamento.trim(),
        observacoes: form.observacoes.trim(),
        ...(consulta?.agendamentoId
          ? { agendamento_id: consulta.agendamentoId }
          : {})
      })
    } catch (error) {
      setErroForm(error.message || 'Não foi possível salvar o prontuário.')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end p-4"
      onClick={onClose}
    >
      <form
        onSubmit={enviar}
        className="bg-white rounded-2xl w-full max-w-xl h-full max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-[#EAE8E3] sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-semibold text-[#0C1A1A]">
              {consulta ? 'Editar prontuário' : 'Novo prontuário'}
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Registro do atendimento clínico
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#0C1A1A]"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Campo label="Animal *">
            <select
              required
              className={inputCls}
              value={form.animal_id}
              onChange={e => alterar('animal_id', e.target.value)}
            >
              <option value="">Selecionar animal</option>

              {animais.map(animal => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome} ({nomeEspecie(animal.especie)})
                  {animal.tutor?.nome_completo
                    ? ` · ${animal.tutor.nome_completo}`
                    : ''}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Veterinário responsável *">
            <select
              required
              className={inputCls}
              value={form.veterinario_id}
              onChange={e => alterar('veterinario_id', e.target.value)}
            >
              <option value="">Selecionar veterinário</option>

              {veterinarios.map(veterinario => (
                <option key={veterinario.id} value={veterinario.id}>
                  {nomeVeterinario(veterinario)}
                </option>
              ))}
            </select>

            {veterinarios.length === 0 && (
              <p className="text-xs text-amber-700 mt-1.5">
                Nenhum veterinário ativo encontrado neste estabelecimento.
                Cadastre um perfil de veterinário para continuar.
              </p>
            )}
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Data *">
              <input
                required
                type="date"
                className={inputCls}
                value={form.data}
                onChange={e => alterar('data', e.target.value)}
              />
            </Campo>

            <Campo label="Horário *">
              <input
                required
                type="time"
                className={inputCls}
                value={form.hora}
                onChange={e => alterar('hora', e.target.value)}
              />
            </Campo>
          </div>

          <Campo label="Queixa principal *">
            <textarea
              required
              rows={3}
              className={inputCls}
              value={form.queixa}
              onChange={e => alterar('queixa', e.target.value)}
              placeholder="Motivo da consulta e sintomas relatados..."
            />
          </Campo>

          <Campo label="Diagnóstico">
            <textarea
              rows={3}
              className={inputCls}
              value={form.diagnostico}
              onChange={e => alterar('diagnostico', e.target.value)}
              placeholder="Diagnóstico clínico..."
            />
          </Campo>

          <Campo label="Tratamento">
            <textarea
              rows={3}
              className={inputCls}
              value={form.tratamento}
              onChange={e => alterar('tratamento', e.target.value)}
              placeholder="Tratamento e orientações..."
            />
          </Campo>

          <Campo label="Observações">
            <textarea
              rows={3}
              className={inputCls}
              value={form.observacoes}
              onChange={e => alterar('observacoes', e.target.value)}
              placeholder="Informações adicionais..."
            />
          </Campo>

          {erroForm && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
              {erroForm}
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-[#EAE8E3] sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="flex-1 border border-[#D8D5CE] text-[#6B7280] py-2.5 rounded-[10px] text-sm"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={salvando || veterinarios.length === 0}
            className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] text-sm disabled:opacity-60"
          >
            {salvando ? 'Salvando...' : 'Salvar prontuário'}
          </button>
        </div>
      </form>
    </div>
  )
}

function ProntuarioDetalhe({ consulta, onClose, onEditar }) {
  const secoes = [
    { label: 'Queixa principal', valor: consulta.queixa },
    { label: 'Diagnóstico', valor: consulta.diagnostico },
    { label: 'Tratamento', valor: consulta.tratamento },
    { label: 'Observações', valor: consulta.observacoes }
  ]

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-xl h-full max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-[#EAE8E3] px-6 py-5 z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">
                  {ESPECIE_ICON[consulta.especie] || '🐾'}
                </span>

                <h2 className="font-semibold text-[#0C1A1A] text-lg">
                  {consulta.animalNome}
                </h2>
              </div>

              <p className="text-sm text-[#6B7280]">
                Consulta clínica · {consulta.data} às {consulta.hora}
              </p>

              <p className="text-xs text-[#9CA3AF] mt-1">
                Tutor: {consulta.tutorNome}
              </p>

              <p className="text-xs text-[#9CA3AF] mt-1">
                Veterinário: {consulta.veterinarioNome}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-[#9CA3AF] hover:text-[#0C1A1A]"
            >
              ✕
            </button>
          </div>

          <span className="inline-block mt-3 text-[10px] font-bold px-2 py-1 rounded-full bg-[#E8F4F0] text-[#0C4A45]">
            Registrado
          </span>
        </div>

        <div className="p-6 space-y-5">
          {secoes.filter(secao => secao.valor).map(secao => (
            <div key={secao.label}>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase mb-2">
                {secao.label}
              </p>

              <p className="text-sm text-[#0C1A1A] leading-relaxed bg-[#F7F5F0] rounded-xl px-4 py-3 whitespace-pre-wrap">
                {secao.valor}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 p-6 border-t border-[#EAE8E3]">
          <button
            onClick={onClose}
            className="flex-1 border border-[#D8D5CE] text-[#6B7280] py-2.5 rounded-[10px] text-sm"
          >
            Fechar
          </button>

          <button
            onClick={onEditar}
            className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] text-sm"
          >
            Editar prontuário
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Prontuario() {
  const [consultas, setConsultas] = useState([])
  const [animais, setAnimais] = useState([])
  const [veterinarios, setVeterinarios] = useState([])
  const [busca, setBusca] = useState('')
  const [detalhe, setDetalhe] = useState(null)
  const [formAberto, setFormAberto] = useState(false)
  const [consultaEditando, setConsultaEditando] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const carregarDados = useCallback(async () => {
    setCarregando(true)
    setErro('')

    try {
      const [listaConsultas, listaAnimais, listaVeterinarios] =
        await Promise.all([
          requisicaoAPI('/api/consultas'),
          requisicaoAPI('/api/animais'),
          requisicaoAPI('/api/consultas/veterinarios')
        ])

      const animaisLista = Array.isArray(listaAnimais)
        ? listaAnimais
        : []

      const veterinariosLista = Array.isArray(listaVeterinarios)
        ? listaVeterinarios
        : []

      setAnimais(animaisLista)
      setVeterinarios(veterinariosLista)

      const consultasNormalizadas = (
        Array.isArray(listaConsultas) ? listaConsultas : []
      ).map(consulta => {
        const animalLista = animaisLista.find(
          animal => animal.id === consulta.animal_id
        )

        return normalizarConsulta(
          {
            ...consulta,
            animais: consulta.animais
              ? {
                  ...consulta.animais,
                  tutor: animalLista?.tutor || null
                }
              : {
                  nome: animalLista?.nome,
                  especie: animalLista?.especie,
                  tutor: animalLista?.tutor
                }
          },
          animaisLista,
          veterinariosLista
        )
      })

      setConsultas(consultasNormalizadas)
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar os prontuários.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  async function salvarConsulta(dados) {
    setSalvando(true)
    setErro('')
    setSucesso('')

    try {
      if (consultaEditando) {
        await requisicaoAPI(`/api/consultas/${consultaEditando.id}`, {
          method: 'PUT',
          body: JSON.stringify(dados)
        })
      } else {
        await requisicaoAPI('/api/consultas', {
          method: 'POST',
          body: JSON.stringify(dados)
        })
      }

      setFormAberto(false)
      setConsultaEditando(null)
      setDetalhe(null)

      setSucesso(
        consultaEditando
          ? 'Prontuário atualizado com sucesso.'
          : 'Prontuário cadastrado com sucesso.'
      )

      await carregarDados()
    } finally {
      setSalvando(false)
    }
  }

  function abrirNovo() {
    setDetalhe(null)
    setConsultaEditando(null)
    setFormAberto(true)
  }

  function abrirEdicao() {
    setConsultaEditando(detalhe)
    setDetalhe(null)
    setFormAberto(true)
  }

  const filtrados = consultas.filter(consulta => {
    const texto = busca.toLowerCase()

    return (
      consulta.animalNome.toLowerCase().includes(texto) ||
      consulta.tutorNome.toLowerCase().includes(texto) ||
      consulta.veterinarioNome.toLowerCase().includes(texto) ||
      consulta.queixa.toLowerCase().includes(texto) ||
      consulta.diagnostico.toLowerCase().includes(texto)
    )
  })

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      {formAberto && (
        <ProntuarioModal
          animais={animais}
          veterinarios={veterinarios}
          consulta={consultaEditando}
          salvando={salvando}
          onClose={() => {
            setFormAberto(false)
            setConsultaEditando(null)
          }}
          onSalvar={salvarConsulta}
        />
      )}

      {detalhe && (
        <ProntuarioDetalhe
          consulta={detalhe}
          onClose={() => setDetalhe(null)}
          onEditar={abrirEdicao}
        />
      )}

      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[#0C1A1A]">
            Prontuário eletrônico
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            Histórico clínico dos pacientes
          </p>
        </div>

        <button
          onClick={abrirNovo}
          className="bg-[#0C4A45] text-white font-semibold px-4 py-2.5 rounded-[10px] text-sm"
        >
          + Novo atendimento
        </button>
      </div>

      {erro && (
        <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-700">
          {erro}
          <button
            onClick={carregarDados}
            className="ml-2 underline font-semibold"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {sucesso && (
        <div className="mb-4 bg-[#E8F4F0] rounded-xl p-3 text-sm text-[#0C4A45]">
          {sucesso}
        </div>
      )}

      <div className="mb-5">
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por animal, tutor, veterinário, queixa ou diagnóstico..."
          className="w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-2.5 text-sm"
        />
      </div>

      {carregando ? (
        <div className="py-16 text-center text-[#9CA3AF]">
          Carregando prontuários...
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map(consulta => (
            <button
              key={consulta.id}
              onClick={() => setDetalhe(consulta)}
              className="w-full text-left bg-white rounded-2xl border border-[#EAE8E3] p-5 hover:border-[#0C4A45]/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">
                  {ESPECIE_ICON[consulta.especie] || '🐾'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#0C1A1A]">
                          {consulta.animalNome}
                        </p>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F4F0] text-[#0C4A45]">
                          Registrado
                        </span>
                      </div>

                      <p className="text-xs text-[#9CA3AF] mt-1">
                        Tutor: {consulta.tutorNome}
                      </p>

                      <p className="text-xs text-[#9CA3AF] mt-1">
                        Veterinário: {consulta.veterinarioNome}
                      </p>
                    </div>

                    <p className="text-xs text-[#9CA3AF]">
                      {consulta.data} às {consulta.hora}
                    </p>
                  </div>

                  <p className="text-sm text-[#4A5568] mt-2 line-clamp-2">
                    {consulta.queixa}
                  </p>

                  {consulta.diagnostico && (
                    <div className="mt-2 inline-flex text-xs bg-[#F7F5F0] text-[#6B7280] px-3 py-1 rounded-full">
                      <strong>Diagnóstico:</strong>&nbsp;
                      {consulta.diagnostico}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}

          {filtrados.length === 0 && (
            <div className="py-16 text-center text-[#9CA3AF] bg-white rounded-2xl border border-[#EAE8E3]">
              <p className="text-4xl mb-3">📋</p>

              <p className="font-medium text-[#4A5568]">
                {busca
                  ? 'Nenhum prontuário encontrado'
                  : 'Nenhum prontuário cadastrado'}
              </p>

              <p className="text-sm mt-1">
                Cadastre um atendimento para começar o histórico clínico.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
