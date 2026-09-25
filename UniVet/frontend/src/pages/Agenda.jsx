import { useState } from 'react'
import { CONSULTAS, ANIMAIS } from '../data/mock'

const ESPECIE_ICON = {
  'Cão': '🐕',
  'Gato': '🐈',
  'Ave': '🦜',
  'Réptil': '🦎',
  'Outro': '🐾',
}

const STATUS_COLOR = {
  'Agendada': 'bg-blue-100 text-blue-700 border-blue-200',
  'Confirmada': 'bg-green-100 text-green-700 border-green-200',
  'Em atendimento': 'bg-amber-100 text-amber-700 border-amber-200',
  'Concluída': 'bg-[#E8F4F0] text-[#0C4A45] border-[#0C4A45]/20',
  'Cancelada': 'bg-gray-100 text-gray-500 border-gray-200',
  'Não compareceu': 'bg-rose-100 text-rose-600 border-rose-200',
}

const STATUS_LIST = [
  'Agendada',
  'Confirmada',
  'Em atendimento',
  'Concluída',
  'Cancelada',
  'Não compareceu',
]

const TIPOS = [
  'Consulta geral',
  'Retorno',
  'Vacinação',
  'Cirurgia',
  'Exame',
  'Acompanhamento',
  'Emergência',
]

const HORAS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
]

function NovaConsultaModal({ onClose }) {
  const [form, setForm] = useState({
    animalId: '',
    veterinario: 'Dra. Ana Souza',
    data: '2025-03-14',
    hora: '09:00',
    duracao: '30',
    tipo: '',
    observacao: '',
  })

  function set(campo, valor) {
    setForm((f) => ({
      ...f,
      [campo]: valor,
    }))
  }

  const inputCls =
    'w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-2.5 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45] transition-all'

  const animalSel = ANIMAIS.find(
    (animal) => String(animal.id) === String(form.animalId)
  )

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
            <h2 className="font-semibold text-[#0C1A1A]">
              Nova consulta
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Agende um novo atendimento
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#0C1A1A]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
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

              {ANIMAIS.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome} ({animal.especie} · {animal.tutorNome})
                </option>
              ))}
            </select>
          </div>

          {animalSel?.alerta && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-800">
              <span>⚠</span>
              <span>{animalSel.alerta}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
              Veterinário
            </label>

            <input
              className={inputCls}
              value={form.veterinario}
              onChange={(e) => set('veterinario', e.target.value)}
              placeholder="Nome do veterinário"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Data *
              </label>

              <input
                type="date"
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
                <option value="">Selecionar</option>

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
            className="flex-1 border border-[#D8D5CE] text-[#6B7280] font-medium py-2.5 rounded-[10px] text-sm hover:bg-[#F7F5F0]"
          >
            Cancelar
          </button>

          <button className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] text-sm hover:bg-[#0a3d38]">
            Agendar consulta
          </button>
        </div>
      </div>
    </div>
  )
}

function ConsultaModal({ consulta, onClose }) {
  const [status, setStatus] = useState(consulta.status)

  const atrasada =
    consulta.hora < '10:30' &&
    consulta.status === 'Agendada' &&
    consulta.data === '2025-03-14'

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
              {ESPECIE_ICON[consulta.especie]}
            </span>

            <div>
              <h2 className="font-semibold text-[#0C1A1A]">
                {consulta.animalNome}
              </h2>

              <p className="text-xs text-[#9CA3AF]">
                {consulta.tipo}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#0C1A1A]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {atrasada && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 text-xs text-rose-700">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z"
                />
              </svg>

              Horário passou — consulta pendente
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoItem label="Tutor" value={consulta.tutorNome} />
            <InfoItem label="Veterinário" value={consulta.veterinario} />
            <InfoItem label="Data" value={consulta.data} />
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
              {STATUS_LIST.map((statusItem) => (
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
            className="flex-1 border border-[#D8D5CE] text-[#6B7280] font-medium py-2.5 rounded-[10px] text-sm hover:bg-[#F7F5F0]"
          >
            Fechar
          </button>

          <button className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] text-sm hover:bg-[#0a3d38]">
            Salvar status
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

      <p className="text-sm font-medium text-[#0C1A1A]">
        {value}
      </p>
    </div>
  )
}

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const WEEK_DATES = [
  '2025-03-09',
  '2025-03-10',
  '2025-03-11',
  '2025-03-12',
  '2025-03-13',
  '2025-03-14',
  '2025-03-15',
]

const WEEK_LABELS = ['09', '10', '11', '12', '13', '14', '15']

export default function Agenda() {
  const [view, setView] = useState('semana')
  const [novaOpen, setNovaOpen] = useState(false)
  const [consultaSel, setConsultaSel] = useState(null)
  const [dataAtual] = useState('2025-03-14')

  const consultasDia = CONSULTAS
    .filter((consulta) => consulta.data === dataAtual)
    .sort((a, b) => a.hora.localeCompare(b.hora))

  return (
    <div className="p-6 max-w-[1100px] mx-auto">
      {novaOpen && (
        <NovaConsultaModal
          onClose={() => setNovaOpen(false)}
        />
      )}

      {consultaSel && (
        <ConsultaModal
          consulta={consultaSel}
          onClose={() => setConsultaSel(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[#0C1A1A]">
            Agenda
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            Semana de 09 a 15 de março de 2025
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
                {v === 'semana'
                  ? 'Semana'
                  : v === 'dia'
                    ? 'Dia'
                    : 'Lista'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setNovaOpen(true)}
            className="flex items-center gap-2 bg-[#E05C2A] text-white font-semibold px-4 py-2.5 rounded-[10px] hover:bg-[#C4501F] text-sm transition-colors"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
            </svg>

            Nova consulta
          </button>
        </div>
      </div>

      {view === 'semana' && (
        <div className="bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden">
          <div className="grid grid-cols-8 border-b border-[#EAE8E3]">
            <div className="border-r border-[#EAE8E3]" />

            {WEEK_DAYS.map((dia, index) => (
              <div
                key={dia}
                className={`px-2 py-3 text-center border-r border-[#EAE8E3] last:border-0 ${
                  WEEK_DATES[index] === dataAtual
                    ? 'bg-[#E8F4F0]'
                    : ''
                }`}
              >
                <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">
                  {dia}
                </p>

                <p
                  className={`text-lg font-semibold mt-0.5 ${
                    WEEK_DATES[index] === dataAtual
                      ? 'text-[#0C4A45]'
                      : 'text-[#0C1A1A]'
                  }`}
                >
                  {WEEK_LABELS[index]}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[520px]">
            {HORAS.slice(0, 10).map((hora) => (
              <div
                key={hora}
                className="grid grid-cols-8 border-b border-[#F3F1EC] min-h-[56px]"
              >
                <div className="px-3 py-2 border-r border-[#EAE8E3] flex items-start">
                  <span className="text-xs font-mono text-[#9CA3AF]">
                    {hora}
                  </span>
                </div>

                {WEEK_DATES.map((date) => {
                  const consultas = CONSULTAS.filter(
                    (consulta) =>
                      consulta.data === date &&
                      consulta.hora === hora
                  )

                  return (
                    <div
                      key={date}
                      className={`px-1 py-1 border-r border-[#F3F1EC] last:border-0 ${
                        date === dataAtual
                          ? 'bg-[#E8F4F0]/30'
                          : ''
                      }`}
                    >
                      {consultas.map((consulta) => {
                        const atrasada =
                          consulta.hora < '10:30' &&
                          consulta.status === 'Agendada' &&
                          consulta.data === '2025-03-14'

                        return (
                          <button
                            key={consulta.id}
                            onClick={() =>
                              setConsultaSel(consulta)
                            }
                            className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] font-medium border transition-all hover:shadow-sm ${
                              atrasada
                                ? 'bg-rose-100 text-rose-700 border-rose-200'
                                : STATUS_COLOR[consulta.status]
                            }`}
                          >
                            <p className="truncate">
                              {ESPECIE_ICON[consulta.especie]}{' '}
                              {consulta.animalNome}
                            </p>
                          </button>
                        )
                      })}
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
          <div className="px-6 py-4 border-b border-[#EAE8E3] flex items-center justify-between">
            <h3 className="font-semibold text-[#0C1A1A]">
              Sexta-feira, 14 de março
            </h3>

            <span className="text-sm text-[#6B7280]">
              {consultasDia.length} consultas
            </span>
          </div>

          <div className="divide-y divide-[#F3F1EC]">
            {HORAS.slice(0, 12).map((hora) => {
              const consultas = consultasDia.filter(
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
                    {consultas.map((consulta) => {
                      const atrasada =
                        consulta.hora < '10:30' &&
                        consulta.status === 'Agendada'

                      return (
                        <button
                          key={consulta.id}
                          onClick={() =>
                            setConsultaSel(consulta)
                          }
                          className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all hover:shadow-sm ${
                            atrasada
                              ? 'bg-rose-50 border-rose-200'
                              : STATUS_COLOR[consulta.status]
                          }`}
                        >
                          <span className="text-base">
                            {ESPECIE_ICON[consulta.especie]}
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
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {view === 'lista' && (
        <div className="space-y-3">
          {[
            '2025-03-12',
            '2025-03-13',
            '2025-03-14',
            '2025-03-21',
          ].map((data) => {
            const consultas = CONSULTAS
              .filter((consulta) => consulta.data === data)
              .sort((a, b) => a.hora.localeCompare(b.hora))

            if (!consultas.length) return null

            const label =
              data === '2025-03-14'
                ? 'Hoje, 14/03'
                : data === '2025-03-12'
                  ? 'Qua, 12/03'
                  : data === '2025-03-13'
                    ? 'Qui, 13/03'
                    : 'Sex, 21/03'

            return (
              <div
                key={data}
                className="bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden"
              >
                <div
                  className={`px-5 py-3 border-b border-[#EAE8E3] ${
                    data === dataAtual
                      ? 'bg-[#E8F4F0]'
                      : 'bg-[#FAFAF8]'
                  }`}
                >
                  <h3
                    className={`text-sm font-semibold ${
                      data === dataAtual
                        ? 'text-[#0C4A45]'
                        : 'text-[#6B7280]'
                    }`}
                  >
                    {label}
                  </h3>
                </div>

                <div className="divide-y divide-[#F3F1EC]">
                  {consultas.map((consulta) => {
                    const atrasada =
                      consulta.hora < '10:30' &&
                      consulta.status === 'Agendada' &&
                      consulta.data === '2025-03-14'

                    return (
                      <button
                        key={consulta.id}
                        onClick={() =>
                          setConsultaSel(consulta)
                        }
                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors text-left"
                      >
                        <span className="text-sm font-mono text-[#9CA3AF] w-10 shrink-0">
                          {consulta.hora}
                        </span>

                        <span className="text-lg">
                          {ESPECIE_ICON[consulta.especie]}
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
                          className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                            atrasada
                              ? 'bg-rose-100 text-rose-600'
                              : STATUS_COLOR[consulta.status]
                          }`}
                        >
                          {atrasada ? 'Atrasada' : consulta.status}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}