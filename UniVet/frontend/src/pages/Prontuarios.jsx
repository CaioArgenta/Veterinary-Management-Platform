import { useState } from 'react'

const ANIMAIS = [
  {
    id: '1',
    nome: 'Rex',
    especie: 'Cão',
    tutorNome: 'João Silva',
    alergias: ''
  },
  {
    id: '2',
    nome: 'Luna',
    especie: 'Gato',
    tutorNome: 'Maria Oliveira',
    alergias: 'Penicilina'
  },
  {
    id: '3',
    nome: 'Thor',
    especie: 'Cão',
    tutorNome: 'Carlos Souza',
    alergias: ''
  }
]

const PRONTUARIOS = [
  {
    id: '1',
    animalId: '1',
    animalNome: 'Rex',
    tutorNome: 'João Silva',
    tipo: 'Consulta geral',
    data: '2026-09-20',
    hora: '09:00',
    veterinario: 'Dra. Ana Souza',
    status: 'Concluído',
    queixa: 'Animal apresentando falta de apetite há dois dias.',
    anamnese: 'Tutor relata que o animal está mais quieto que o normal.',
    exame: 'Temperatura normal, mucosas hidratadas.',
    diagnostico: 'Gastrite leve',
    procedimentos: 'Exame físico completo.',
    conduta: 'Acompanhamento e alimentação leve.',
    prescricao: 'Medicação conforme orientação veterinária.',
    peso: 12.5,
    temperatura: 38.5
  },
  {
    id: '2',
    animalId: '2',
    animalNome: 'Luna',
    tutorNome: 'Maria Oliveira',
    tipo: 'Retorno',
    data: '2026-09-18',
    hora: '14:30',
    veterinario: 'Dra. Ana Souza',
    status: 'Concluído',
    queixa: 'Retorno para acompanhamento do tratamento.',
    anamnese: 'Tutor relata melhora nos sintomas.',
    exame: 'Animal ativo e hidratado.',
    diagnostico: 'Evolução positiva',
    procedimentos: 'Avaliação clínica.',
    conduta: 'Manter tratamento atual.',
    prescricao: '',
    peso: 4.2,
    temperatura: 38.2
  },
  {
    id: '3',
    animalId: '3',
    animalNome: 'Thor',
    tutorNome: 'Carlos Souza',
    tipo: 'Consulta geral',
    data: '2026-09-15',
    hora: '10:00',
    veterinario: 'Dr. Pedro Lima',
    status: 'Rascunho',
    queixa: 'Avaliação de rotina.',
    anamnese: '',
    exame: '',
    diagnostico: '',
    procedimentos: '',
    conduta: '',
    prescricao: '',
    peso: 18.7,
    temperatura: 38.4
  }
]

const ESPECIE_ICON = {
  'Cão': '🐕',
  'Gato': '🐈',
  'Ave': '🦜',
  'Réptil': '🦎',
  'Outro': '🐾'
}

const TIPOS = [
  'Consulta geral',
  'Retorno',
  'Vacinação',
  'Cirurgia',
  'Exame',
  'Acompanhamento',
  'Emergência'
]

function ProntuarioDetalhe({ p, onClose }) {
  const animal = ANIMAIS.find(a => a.id === p.animalId)

  const sections = [
    { label: 'Queixa principal', value: p.queixa },
    { label: 'Anamnese', value: p.anamnese },
    { label: 'Exame físico', value: p.exame },
    { label: 'Diagnóstico', value: p.diagnostico },
    { label: 'Procedimentos', value: p.procedimentos },
    { label: 'Conduta', value: p.conduta },
    { label: 'Prescrição', value: p.prescricao }
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
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">
                  {animal ? ESPECIE_ICON[animal.especie] : '🐾'}
                </span>

                <h2 className="font-semibold text-[#0C1A1A] text-lg">
                  {p.animalNome}
                </h2>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    p.status === 'Concluído'
                      ? 'bg-[#E8F4F0] text-[#0C4A45]'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <p className="text-sm text-[#6B7280]">
                {p.tipo} · {p.data} às {p.hora} · {p.veterinario}
              </p>

              <p className="text-xs text-[#9CA3AF]">
                Tutor: {p.tutorNome}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-[#9CA3AF] hover:text-[#0C1A1A]"
            >
              ✕
            </button>
          </div>

          {(p.peso > 0 || p.temperatura > 0) && (
            <div className="flex gap-3 mt-3">
              {p.peso > 0 && (
                <div className="bg-[#F7F5F0] px-3 py-1.5 rounded-lg text-xs">
                  <span className="text-[#9CA3AF]">Peso </span>
                  <strong>{p.peso} kg</strong>
                </div>
              )}

              {p.temperatura > 0 && (
                <div className="bg-[#F7F5F0] px-3 py-1.5 rounded-lg text-xs">
                  <span className="text-[#9CA3AF]">Temp. </span>
                  <strong>{p.temperatura}°C</strong>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 space-y-5">
          {sections
            .filter(section => section.value)
            .map(section => (
              <div key={section.label}>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase mb-2">
                  {section.label}
                </p>

                <p className="text-sm text-[#0C1A1A] leading-relaxed bg-[#F7F5F0] rounded-xl px-4 py-3">
                  {section.value}
                </p>
              </div>
            ))}
        </div>

        {p.status === 'Concluído' && (
          <div className="mx-6 mb-6 bg-[#E8F4F0] rounded-xl px-4 py-3 text-xs text-[#0C4A45]">
            🔒 Prontuário concluído — proteção contra exclusão ativa.
          </div>
        )}

        <div className="flex gap-3 p-6 border-t border-[#EAE8E3]">
          <button
            onClick={onClose}
            className="flex-1 border border-[#D8D5CE] text-[#6B7280] font-medium py-2.5 rounded-[10px] text-sm"
          >
            Fechar
          </button>

          {p.status !== 'Concluído' && (
            <button className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] text-sm">
              Editar rascunho
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function NovoProntuarioModal({ onClose }) {
  const [form, setForm] = useState({
    animalId: '',
    data: '',
    hora: '',
    tipo: '',
    queixa: '',
    anamnese: '',
    exame: '',
    peso: '',
    temperatura: '',
    diagnostico: '',
    procedimentos: '',
    conduta: '',
    prescricao: ''
  })

  const set = (key, value) => {
    setForm(current => ({
      ...current,
      [key]: value
    }))
  }

  const inputCls =
    'w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-2.5 text-sm text-[#0C1A1A] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30'

  const animal = ANIMAIS.find(a => a.id === form.animalId)

  const campos = [
    ['anamnese', 'Anamnese'],
    ['exame', 'Exame físico'],
    ['diagnostico', 'Diagnóstico'],
    ['procedimentos', 'Procedimentos realizados'],
    ['conduta', 'Conduta'],
    ['prescricao', 'Prescrição']
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
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="font-semibold text-[#0C1A1A]">
            Novo prontuário
          </h2>

          <button
            onClick={onClose}
            className="text-[#9CA3AF]"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">
              Animal *
            </label>

            <select
              className={inputCls}
              value={form.animalId}
              onChange={e => set('animalId', e.target.value)}
            >
              <option value="">Selecionar animal</option>

              {ANIMAIS.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nome} ({a.especie} · {a.tutorNome})
                </option>
              ))}
            </select>
          </div>

          {animal?.alergias && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs text-rose-700">
              ⚠️ <strong>Alergia:</strong> {animal.alergias}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Data *
              </label>

              <input
                type="date"
                className={inputCls}
                value={form.data}
                onChange={e => set('data', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5">
                Horário *
              </label>

              <input
                type="time"
                className={inputCls}
                value={form.hora}
                onChange={e => set('hora', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">
              Tipo de atendimento *
            </label>

            <select
              className={inputCls}
              value={form.tipo}
              onChange={e => set('tipo', e.target.value)}
            >
              <option value="">Selecionar</option>

              {TIPOS.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">
              Queixa principal *
            </label>

            <textarea
              className={inputCls}
              rows="2"
              value={form.queixa}
              onChange={e => set('queixa', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">
                Peso (kg)
              </label>

              <input
                type="number"
                step="0.1"
                className={inputCls}
                value={form.peso}
                onChange={e => set('peso', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5">
                Temperatura
              </label>

              <input
                type="number"
                step="0.1"
                className={inputCls}
                value={form.temperatura}
                onChange={e => set('temperatura', e.target.value)}
              />
            </div>
          </div>

          {campos.map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1.5">
                {label}
              </label>

              <textarea
                className={inputCls}
                rows="3"
                value={form[key]}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 border border-[#D8D5CE] py-2.5 rounded-[10px] text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] text-sm"
          >
            Concluir atendimento
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Prontuario() {
  const [busca, setBusca] = useState('')
  const [detalhe, setDetalhe] = useState(null)
  const [novoOpen, setNovoOpen] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('')

  const filtrados = PRONTUARIOS
    .filter(p => {
      const texto = busca.toLowerCase()

      const buscaOk =
        p.animalNome.toLowerCase().includes(texto) ||
        p.tutorNome.toLowerCase().includes(texto) ||
        p.tipo.toLowerCase().includes(texto)

      const statusOk =
        filtroStatus === '' || p.status === filtroStatus

      return buscaOk && statusOk
    })
    .sort((a, b) => b.data.localeCompare(a.data))

  return (
    <div className="p-6 max-w-[900px] mx-auto">

      {detalhe && (
        <ProntuarioDetalhe
          p={detalhe}
          onClose={() => setDetalhe(null)}
        />
      )}

      {novoOpen && (
        <NovoProntuarioModal
          onClose={() => setNovoOpen(false)}
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
          onClick={() => setNovoOpen(true)}
          className="bg-[#0C4A45] text-white font-semibold px-4 py-2.5 rounded-[10px] text-sm"
        >
          + Novo atendimento
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por animal, tutor ou tipo..."
          className="flex-1 min-w-48 bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-2.5 text-sm"
        />

        <div className="flex gap-2">
          {['', 'Concluído', 'Rascunho'].map(status => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-3 py-2.5 rounded-[10px] text-sm font-medium border ${
                filtroStatus === status
                  ? 'bg-[#0C4A45] text-white border-[#0C4A45]'
                  : 'bg-white border-[#D8D5CE] text-[#6B7280]'
              }`}
            >
              {status || 'Todos'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtrados.map(p => {
          const animal = ANIMAIS.find(
            a => a.id === p.animalId
          )

          return (
            <button
              key={p.id}
              onClick={() => setDetalhe(p)}
              className="w-full text-left bg-white rounded-2xl border border-[#EAE8E3] p-5 hover:border-[#0C4A45]/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">
                  {animal ? ESPECIE_ICON[animal.especie] : '🐾'}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#0C1A1A]">
                          {p.animalNome}
                        </p>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.status === 'Concluído'
                              ? 'bg-[#E8F4F0] text-[#0C4A45]'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#9CA3AF]">
                        {p.tipo} · {p.veterinario}
                      </p>
                    </div>

                    <p className="text-xs text-[#9CA3AF]">
                      {p.data} às {p.hora}
                    </p>
                  </div>

                  <p className="text-sm text-[#4A5568] mt-2">
                    {p.queixa}
                  </p>

                  {p.diagnostico && (
                    <div className="mt-2 inline-flex text-xs bg-[#F7F5F0] text-[#6B7280] px-3 py-1 rounded-full">
                      <strong>Dx:</strong>&nbsp;{p.diagnostico}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {filtrados.length === 0 && (
        <div className="py-16 text-center text-[#9CA3AF] bg-white rounded-2xl border">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">
            Nenhum prontuário encontrado
          </p>
        </div>
      )}
    </div>
  )
}