import { useState } from 'react'

const ANIMAIS = [
  {
    id: '1',
    nome: 'Rex',
    especie: 'Cão',
    tutorNome: 'João Silva'
  },
  {
    id: '2',
    nome: 'Luna',
    especie: 'Gato',
    tutorNome: 'Maria Oliveira'
  },
  {
    id: '3',
    nome: 'Thor',
    especie: 'Cão',
    tutorNome: 'Carlos Souza'
  }
]

const VACINAS = [
  {
    id: '1',
    animalId: '1',
    animalNome: 'Rex',
    tutorNome: 'João Silva',
    especie: 'Cão',
    vacina: 'V10 (Decavalente)',
    dataAplicacao: '15/08/2026',
    proximaDose: '15/08/2027',
    status: 'Em dia',
    fabricante: 'Zoetis',
    lote: 'V102401'
  },
  {
    id: '2',
    animalId: '2',
    animalNome: 'Luna',
    tutorNome: 'Maria Oliveira',
    especie: 'Gato',
    vacina: 'Antirrábica',
    dataAplicacao: '10/03/2026',
    proximaDose: '10/03/2027',
    status: 'Em dia',
    fabricante: 'Boehringer',
    lote: 'AR2402'
  },
  {
    id: '3',
    animalId: '3',
    animalNome: 'Thor',
    tutorNome: 'Carlos Souza',
    especie: 'Cão',
    vacina: 'Antirrábica',
    dataAplicacao: '10/09/2025',
    proximaDose: '10/09/2026',
    status: 'Atrasada',
    fabricante: 'Zoetis',
    lote: 'AR2309'
  },
  {
    id: '4',
    animalId: '1',
    animalNome: 'Rex',
    tutorNome: 'João Silva',
    especie: 'Cão',
    vacina: 'Giardia',
    dataAplicacao: '20/09/2025',
    proximaDose: '20/10/2026',
    status: 'Próxima',
    fabricante: 'MSD',
    lote: 'GD2510'
  }
]

const ESPECIE_ICON = {
  'Cão': '🐕',
  'Gato': '🐈',
  'Ave': '🦜',
  'Réptil': '🦎',
  'Outro': '🐾'
}

const STATUS_COLOR = {
  'Em dia': 'bg-[#E8F4F0] text-[#0C4A45]',
  'Próxima': 'bg-amber-100 text-amber-700',
  'Atrasada': 'bg-rose-100 text-rose-600'
}

const VACINAS_LISTA = [
  'V10 (Decavalente)',
  'V8 (Octavalente)',
  'V3 (Trivalente)',
  'V4 (Quadrivalente)',
  'Antirrábica',
  'Giardia',
  'Bordetella',
  'Gripe felina'
]

function NovaVacinaModal({ onClose }) {
  const [form, setForm] = useState({
    animalId: '',
    vacina: '',
    dataAplicacao: '',
    proximaDose: '',
    lote: '',
    fabricante: '',
    veterinario: 'Dra. Ana Souza',
    observacoes: ''
  })

  const set = (key, value) => {
    setForm(current => ({
      ...current,
      [key]: value
    }))
  }

  const inputCls =
    'w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-2.5 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45] transition-all'

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md h-full max-h-[88vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#EAE8E3] sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-[#0C1A1A]">
            Registrar vacinação
          </h2>

          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#0C1A1A]"
          >
            ✕
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
              onChange={e => set('animalId', e.target.value)}
            >
              <option value="">Selecionar animal</option>

              {ANIMAIS.map(animal => (
                <option key={animal.id} value={animal.id}>
                  {animal.nome} ({animal.especie} · {animal.tutorNome})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
              Vacina *
            </label>

            <select
              className={inputCls}
              value={form.vacina}
              onChange={e => set('vacina', e.target.value)}
            >
              <option value="">Selecionar vacina</option>

              {VACINAS_LISTA.map(vacina => (
                <option key={vacina} value={vacina}>
                  {vacina}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Data de aplicação *
              </label>

              <input
                type="date"
                className={inputCls}
                value={form.dataAplicacao}
                onChange={e =>
                  set('dataAplicacao', e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Próxima dose
              </label>

              <input
                type="date"
                className={inputCls}
                value={form.proximaDose}
                onChange={e =>
                  set('proximaDose', e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Lote
              </label>

              <input
                className={inputCls}
                placeholder="BV2401"
                value={form.lote}
                onChange={e => set('lote', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
                Fabricante
              </label>

              <input
                className={inputCls}
                placeholder="Zoetis, Boehringer..."
                value={form.fabricante}
                onChange={e =>
                  set('fabricante', e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
              Veterinário responsável
            </label>

            <input
              className={inputCls}
              value={form.veterinario}
              onChange={e =>
                set('veterinario', e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#0C1A1A] mb-1.5">
              Observações
            </label>

            <textarea
              className={inputCls + ' resize-none'}
              rows="3"
              value={form.observacoes}
              onChange={e =>
                set('observacoes', e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-[#EAE8E3] sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 border border-[#D8D5CE] text-[#6B7280] font-medium py-2.5 rounded-[10px] text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-[#0C4A45] text-white font-semibold py-2.5 rounded-[10px] text-sm"
          >
            Registrar vacina
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Vacinacao() {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [novoOpen, setNovoOpen] = useState(false)

  const filtrados = VACINAS.filter(vacina => {
    const texto = busca.toLowerCase()

    const match =
      vacina.animalNome.toLowerCase().includes(texto) ||
      vacina.tutorNome.toLowerCase().includes(texto) ||
      vacina.vacina.toLowerCase().includes(texto)

    const statusOk =
      filtroStatus === '' ||
      vacina.status === filtroStatus

    return match && statusOk
  })

  const stats = {
    emDia: VACINAS.filter(
      vacina => vacina.status === 'Em dia'
    ).length,

    proximas: VACINAS.filter(
      vacina => vacina.status === 'Próxima'
    ).length,

    atrasadas: VACINAS.filter(
      vacina => vacina.status === 'Atrasada'
    ).length
  }

  return (
    <div className="p-6 max-w-[900px] mx-auto">

      {novoOpen && (
        <NovaVacinaModal
          onClose={() => setNovoOpen(false)}
        />
      )}

      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[#0C1A1A]">
            Vacinação
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            Controle de vacinas aplicadas e pendentes
          </p>
        </div>

        <button
          onClick={() => setNovoOpen(true)}
          className="flex items-center gap-2 bg-[#0C4A45] text-white font-semibold px-4 py-2.5 rounded-[10px] hover:bg-[#0a3d38] text-sm transition-colors"
        >
          <span className="text-lg">+</span>
          Registrar vacina
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            n: stats.emDia,
            label: 'Em dia',
            color: 'bg-[#E8F4F0] text-[#0C4A45]',
            dot: 'bg-[#0C4A45]'
          },
          {
            n: stats.proximas,
            label: 'Próximas (≤30 dias)',
            color: 'bg-amber-50 text-amber-700',
            dot: 'bg-amber-400'
          },
          {
            n: stats.atrasadas,
            label: 'Atrasadas',
            color: 'bg-rose-50 text-rose-700',
            dot: 'bg-rose-500'
          }
        ].map(stat => (
          <div
            key={stat.label}
            className={`${stat.color} rounded-2xl p-4 flex items-center gap-3`}
          >
            <div
              className={`w-3 h-3 rounded-full ${stat.dot} shrink-0`}
            />

            <div>
              <p className="text-2xl font-bold leading-none">
                {stat.n}
              </p>

              <p className="text-xs mt-0.5 opacity-80">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por animal, tutor ou vacina..."
            className="w-full bg-white border border-[#D8D5CE] rounded-[10px] px-4 py-2.5 text-sm text-[#0C1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0C4A45]/30 focus:border-[#0C4A45]"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {['', 'Atrasada', 'Próxima', 'Em dia'].map(status => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={`px-3 py-2.5 rounded-[10px] text-sm font-medium border transition-all ${
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

      <div className="bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EAE8E3] bg-[#FAFAF8]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase">
                  Paciente
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase">
                  Vacina
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase hidden sm:table-cell">
                  Aplicação
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase hidden md:table-cell">
                  Próxima dose
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-[#9CA3AF] uppercase">
                  Status
                </th>

                <th className="px-5 py-3" />
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F3F1EC]">
              {filtrados.map(vacina => (
                <tr
                  key={vacina.id}
                  className={`hover:bg-[#FAFAF8] transition-colors ${
                    vacina.status === 'Atrasada'
                      ? 'bg-rose-50/30'
                      : ''
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {ESPECIE_ICON[vacina.especie] || '🐾'}
                      </span>

                      <div>
                        <p className="font-medium text-[#0C1A1A]">
                          {vacina.animalNome}
                        </p>

                        <p className="text-xs text-[#9CA3AF]">
                          {vacina.tutorNome}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <p className="text-[#0C1A1A] font-medium">
                      {vacina.vacina}
                    </p>

                    {vacina.fabricante && (
                      <p className="text-xs text-[#9CA3AF]">
                        {vacina.fabricante} · {vacina.lote}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-[#6B7280] hidden sm:table-cell">
                    {vacina.dataAplicacao}
                  </td>

                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span
                      className={`font-medium ${
                        vacina.status === 'Atrasada'
                          ? 'text-rose-600'
                          : vacina.status === 'Próxima'
                            ? 'text-amber-600'
                            : 'text-[#6B7280]'
                      }`}
                    >
                      {vacina.proximaDose}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        STATUS_COLOR[vacina.status]
                      }`}
                    >
                      {vacina.status}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <button className="text-xs text-[#0C4A45] font-medium hover:underline">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtrados.length === 0 && (
          <div className="py-16 text-center text-[#9CA3AF]">
            <p className="text-4xl mb-3">💉</p>

            <p className="font-medium">
              Nenhuma vacina encontrada
            </p>
          </div>
        )}
      </div>
    </div>
  )
}