import { useNavigate } from 'react-router'
import { CONSULTAS, VACINAS, ANIMAIS } from '../data/mock'

const STATUS_COLOR = {
  'Agendada': 'bg-blue-100 text-blue-700',
  'Confirmada': 'bg-green-100 text-green-700',
  'Em atendimento': 'bg-amber-100 text-amber-700',
  'Concluída': 'bg-[#E8F4F0] text-[#0C4A45]',
  'Cancelada': 'bg-gray-100 text-gray-500',
  'Não compareceu': 'bg-rose-100 text-rose-600',
}

const ESPECIE_ICON = {
  'Cão': '🐕',
  'Gato': '🐈',
  'Ave': '🦜',
  'Réptil': '🦎',
  'Outro': '🐾',
}

const hoje = CONSULTAS.filter(c => c.data === '2025-03-14')
const atrasadas = hoje.filter(c => c.hora < '10:30' && c.status === 'Agendada')
const emAtendimento = hoje.filter(c => c.status === 'Em atendimento')
const vacAtrasadas = VACINAS.filter(v => v.status === 'Atrasada')
const vacProximas = VACINAS.filter(v => v.status === 'Próxima')
const retornos = CONSULTAS.filter(
  c => c.data > '2025-03-14' && c.tipo === 'Retorno'
)
const animaisAlerta = ANIMAIS.filter(a => a.alerta)

function StatCard({ n, label, color, icon }) {
  return (
    <div className={`${color} rounded-2xl p-5 flex items-start justify-between`}>
      <div>
        <p className="text-3xl font-bold leading-none mb-1">{n}</p>
        <p className="text-sm opacity-80">{label}</p>
      </div>

      <div className="opacity-60">
        {icon}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-[1100px] mx-auto">

      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <p className="text-xs text-[#9CA3AF] uppercase tracking-widest mb-1">
            Sexta-feira, 14 de março de 2025
          </p>

          <h1 className="text-2xl font-semibold text-[#0C1A1A]">
            Bom dia, Dra. Ana 👋
          </h1>

          <p className="text-sm text-[#6B7280] mt-0.5">
            Veja o que precisa da sua atenção hoje.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate('/app/tutores')}
            className="text-sm font-medium bg-white border border-[#D8D5CE] text-[#0C4A45] px-4 py-2 rounded-[10px] hover:border-[#0C4A45] hover:shadow-sm transition-all"
          >
            + Tutor
          </button>

          <button
            onClick={() => navigate('/app/animais')}
            className="text-sm font-medium bg-white border border-[#D8D5CE] text-[#0C4A45] px-4 py-2 rounded-[10px] hover:border-[#0C4A45] hover:shadow-sm transition-all"
          >
            + Animal
          </button>

          <button
            onClick={() => navigate('/app/agenda')}
            className="text-sm font-medium bg-white border border-[#D8D5CE] text-[#0C4A45] px-4 py-2 rounded-[10px] hover:border-[#0C4A45] hover:shadow-sm transition-all"
          >
            + Consulta
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <StatCard
          n={hoje.length}
          label="Consultas hoje"
          color="bg-[#0C4A45] text-white"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />

        <StatCard
          n={emAtendimento.length}
          label="Em atendimento"
          color="bg-amber-50 text-amber-800"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />

        <StatCard
          n={atrasadas.length}
          label="Atrasadas / pendentes"
          color="bg-rose-50 text-rose-700"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
        />

        <StatCard
          n={vacAtrasadas.length + vacProximas.length}
          label="Vacinas pendentes"
          color="bg-purple-50 text-purple-700"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-6 h-6"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          }
        />

      </div>

      {/* Conteúdo */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Consultas */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden">

          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE8E3]">
            <h2 className="font-semibold text-[#0C1A1A]">
              Consultas de hoje
            </h2>

            <button
              onClick={() => navigate('/app/agenda')}
              className="text-xs text-[#0C4A45] font-medium hover:underline"
            >
              Ver agenda →
            </button>
          </div>

          <div className="divide-y divide-[#F3F1EC]">

            {hoje.map(c => {
              const atrasada =
                c.hora < '10:30' && c.status === 'Agendada'

              return (
                <div
                  key={c.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors"
                >

                  <div className="text-center shrink-0 w-12">
                    <p className="text-sm font-mono font-semibold text-[#0C1A1A]">
                      {c.hora}
                    </p>

                    <p className="text-[10px] text-[#9CA3AF]">
                      {c.duracao}min
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#F7F5F0] flex items-center justify-center text-base shrink-0">
                    {ESPECIE_ICON[c.especie] ?? '🐾'}
                  </div>

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2 flex-wrap">

                      <p className="font-semibold text-sm text-[#0C1A1A]">
                        {c.animalNome}
                      </p>

                      {atrasada && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">
                          Atrasada
                        </span>
                      )}

                    </div>

                    <p className="text-xs text-[#6B7280] truncate">
                      {c.tipo} · {c.tutorNome}
                    </p>

                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${STATUS_COLOR[c.status]}`}
                  >
                    {c.status}
                  </span>

                </div>
              )
            })}

          </div>
        </div>

        {/* Lateral */}
        <div className="space-y-4">

          {/* Vacinas */}
          <div className="bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden">

            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAE8E3]">

              <h2 className="font-semibold text-[#0C1A1A] text-sm">
                Vacinas pendentes
              </h2>

              <button
                onClick={() => navigate('/app/vacinacao')}
                className="text-xs text-[#0C4A45] font-medium hover:underline"
              >
                Ver →
              </button>

            </div>

            <div className="divide-y divide-[#F3F1EC]">

              {[...vacAtrasadas, ...vacProximas]
                .slice(0, 4)
                .map(v => (

                  <div
                    key={v.id}
                    className="flex items-center gap-3 px-5 py-3"
                  >

                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        v.status === 'Atrasada'
                          ? 'bg-rose-500'
                          : 'bg-amber-400'
                      }`}
                    />

                    <div className="flex-1 min-w-0">

                      <p className="text-xs font-semibold text-[#0C1A1A] truncate">
                        {v.animalNome}
                      </p>

                      <p className="text-[10px] text-[#9CA3AF] truncate">
                        {v.vacina}
                      </p>

                    </div>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        v.status === 'Atrasada'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {v.status}
                    </span>

                  </div>

                ))}

            </div>
          </div>

          {/* Alertas */}
          {animaisAlerta.length > 0 && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 overflow-hidden">

              <div className="px-5 py-4 border-b border-amber-200">

                <h2 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
                  ⚠️ Atenção especial
                </h2>

              </div>

              <div className="divide-y divide-amber-200">

                {animaisAlerta.map(a => (

                  <div key={a.id} className="px-5 py-3">

                    <p className="text-xs font-semibold text-amber-800">
                      {a.nome} — {a.tutorNome}
                    </p>

                    <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
                      {a.alerta}
                    </p>

                  </div>

                ))}

              </div>
            </div>
          )}

          {/* Retornos */}
          <div className="bg-white rounded-2xl border border-[#EAE8E3] overflow-hidden">

            <div className="px-5 py-4 border-b border-[#EAE8E3]">

              <h2 className="font-semibold text-[#0C1A1A] text-sm">
                Próximos retornos
              </h2>

            </div>

            <div className="divide-y divide-[#F3F1EC]">

              {retornos.slice(0, 3).map(c => (

                <div
                  key={c.id}
                  className="flex items-center gap-3 px-5 py-3"
                >

                  <div className="text-lg">
                    {ESPECIE_ICON[c.especie] ?? '🐾'}
                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-xs font-semibold text-[#0C1A1A]">
                      {c.animalNome}
                    </p>

                    <p className="text-[10px] text-[#9CA3AF]">
                      {c.data} às {c.hora}
                    </p>

                  </div>

                </div>

              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

