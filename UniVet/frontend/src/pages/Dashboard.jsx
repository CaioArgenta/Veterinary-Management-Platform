import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const STATUS_LABEL = {
  AGENDADO: 'Agendado',
  CONFIRMADO: 'Confirmado',
  EM_ATENDIMENTO: 'Em atendimento',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
  NAO_COMPARECEU: 'Não compareceu',
}

const STATUS_COLOR = {
  AGENDADO: 'bg-blue-50 text-blue-700',
  CONFIRMADO: 'bg-emerald-50 text-emerald-700',
  EM_ATENDIMENTO: 'bg-amber-50 text-amber-700',
  CONCLUIDO: 'bg-slate-100 text-slate-600',
  CANCELADO: 'bg-red-50 text-red-600',
  NAO_COMPARECEU: 'bg-rose-50 text-rose-600',
}

const ESPECIE_ICON = {
  CACHORRO: '🐶',
  GATO: '🐱',
  AVE: '🐦',
  ROEDOR: '🐹',
  REPTIL: '🦎',
  OUTRO: '🐾',
}

function formatarData(data) {
  if (!data) return '-'

  return new Date(`${data}T00:00:00`).toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }
  )
}

function formatarHorario(horario) {
  if (!horario) return '-'

  return horario.substring(0, 5)
}

function formatarDataCurta(data) {
  if (!data) return '-'

  return new Date(`${data}T00:00:00`).toLocaleDateString(
    'pt-BR',
    {
      day: '2-digit',
      month: '2-digit',
    }
  )
}

function getHoje() {
  const agora = new Date()

  const ano = agora.getFullYear()
  const mes = String(agora.getMonth() + 1).padStart(2, '0')
  const dia = String(agora.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function StatCard({
  titulo,
  valor,
  descricao,
  icon,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-[#EAE8E3] rounded-2xl p-5 text-left hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#7A807E]">
            {titulo}
          </p>

          <p className="mt-2 text-2xl font-semibold text-[#0C1A1A]">
            {valor}
          </p>

          <p className="mt-1 text-[11px] text-[#9A9F9D]">
            {descricao}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-[#EAF5F2] flex items-center justify-center text-[#0C4A45]">
          {icon}
        </div>
      </div>
    </button>
  )
}

function Icon({ children, className = 'w-5 h-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  )
}

function Dashboard() {
  const navigate = useNavigate()

  const [perfil, setPerfil] = useState(null)
  const [consultasHoje, setConsultasHoje] = useState([])
  const [proximosRetornos, setProximosRetornos] = useState([])
  const [vacinasPendentes, setVacinasPendentes] = useState([])
  const [animaisCount, setAnimaisCount] = useState(0)
  const [tutoresCount, setTutoresCount] = useState(0)

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarDashboard()
  }, [])

  async function carregarDashboard() {
    try {
      setCarregando(true)
      setErro('')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      if (!user) {
        navigate('/login', { replace: true })
        return
      }

      const { data: perfilData, error: perfilError } =
        await supabase
          .from('perfis')
          .select(
            `
            id,
            nome_completo,
            tipo,
            crmv,
            estabelecimento_id
          `
          )
          .eq('id', user.id)
          .single()

      if (perfilError) {
        throw perfilError
      }

      setPerfil(perfilData)

      const estabelecimentoId =
        perfilData.estabelecimento_id

      const hoje = getHoje()

      const [
        animaisResult,
        tutoresResult,
        consultasResult,
        retornosResult,
        vacinasResult,
      ] = await Promise.all([
        supabase
          .from('animais')
          .select('id', {
            count: 'exact',
            head: true,
          })
          .eq(
            'estabelecimento_id',
            estabelecimentoId
          )
          .eq('ativo', true),

        supabase
          .from('tutores')
          .select('id', {
            count: 'exact',
            head: true,
          })
          .eq(
            'estabelecimento_id',
            estabelecimentoId
          )
          .eq('ativo', true),

        supabase
          .from('agendamentos')
          .select(
            `
            id,
            tipo,
            data,
            horario_inicio,
            horario_fim,
            status,
            motivo,
            veterinario_id,
            animais (
              id,
              nome,
              especie
            )
            `
          )
          .eq(
            'estabelecimento_id',
            estabelecimentoId
          )
          .eq('data', hoje)
          .order('horario_inicio', {
            ascending: true,
          }),

        supabase
          .from('agendamentos')
          .select(
            `
            id,
            tipo,
            data,
            horario_inicio,
            status,
            motivo,
            animais (
              id,
              nome,
              especie
            )
            `
          )
          .eq(
            'estabelecimento_id',
            estabelecimentoId
          )
          .eq('tipo', 'RETORNO')
          .neq('status', 'CANCELADO')
          .gte('data', hoje)
          .order('data', {
            ascending: true,
          })
          .order('horario_inicio', {
            ascending: true,
          })
          .limit(4),

        supabase
          .from('vacinacoes')
          .select(
            `
            id,
            nome_vacina,
            data_aplicacao,
            proxima_dose,
            observacoes,
            animais (
              id,
              nome,
              especie
            )
            `
          )
          .eq(
            'estabelecimento_id',
            estabelecimentoId
          )
          .not('proxima_dose', 'is', null)
          .lte('proxima_dose', hoje)
          .order('proxima_dose', {
            ascending: true,
          })
          .limit(5),
      ])

      if (animaisResult.error) {
        throw animaisResult.error
      }

      if (tutoresResult.error) {
        throw tutoresResult.error
      }

      if (consultasResult.error) {
        throw consultasResult.error
      }

      if (retornosResult.error) {
        throw retornosResult.error
      }

      if (vacinasResult.error) {
        throw vacinasResult.error
      }

      setAnimaisCount(animaisResult.count || 0)
      setTutoresCount(tutoresResult.count || 0)
      setConsultasHoje(consultasResult.data || [])
      setProximosRetornos(retornosResult.data || [])
      setVacinasPendentes(vacinasResult.data || [])
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)

      setErro(
        'Não foi possível carregar as informações do dashboard.'
      )
    } finally {
      setCarregando(false)
    }
  }

  const nomeCompleto =
    perfil?.nome_completo || 'Usuário'

  const primeiroNome =
    nomeCompleto.trim().split(' ')[0]

  const consultasAtrasadas = consultasHoje.filter(
    (consulta) =>
      consulta.status === 'AGENDADO' &&
      consulta.horario_inicio &&
      consulta.horario_inicio <
        new Date().toTimeString().slice(0, 8)
  )

  const emAtendimento = consultasHoje.filter(
    (consulta) =>
      consulta.status === 'EM_ATENDIMENTO'
  )

  const naoCompareceram = consultasHoje.filter(
    (consulta) =>
      consulta.status === 'NAO_COMPARECEU'
  )

  const vacinasVencidas = vacinasPendentes.filter(
    (vacina) => {
      if (!vacina.proxima_dose) return false

      return vacina.proxima_dose < getHoje()
    }
  )

  const vacinasHoje = vacinasPendentes.filter(
    (vacina) =>
      vacina.proxima_dose === getHoje()
  )

  const totalAtencoes =
    consultasAtrasadas.length +
    naoCompareceram.length +
    vacinasVencidas.length

  function renderIconeEspecie(especie) {
    return (
      <div className="w-9 h-9 rounded-xl bg-[#F5F3EE] flex items-center justify-center text-lg shrink-0">
        {ESPECIE_ICON[especie] || '🐾'}
      </div>
    )
  }

  if (carregando) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-white rounded-lg" />

          <div className="grid grid-cols-4 gap-4">
            <div className="h-32 bg-white rounded-2xl" />
            <div className="h-32 bg-white rounded-2xl" />
            <div className="h-32 bg-white rounded-2xl" />
            <div className="h-32 bg-white rounded-2xl" />
          </div>

          <div className="h-80 bg-white rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-[1500px] mx-auto">

      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-[#7A807E]">
            Bem-vindo de volta
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-[#0C1A1A]">
            Olá, {primeiroNome} 👋
          </h1>

          <p className="mt-1 text-sm text-[#8B918F]">
            Aqui está o resumo do seu estabelecimento.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/app/tutores')}
            className="px-4 py-2.5 bg-white border border-[#EAE8E3] rounded-xl text-sm font-medium text-[#0C4A45] hover:bg-[#F8F7F3] transition-colors"
          >
            + Novo tutor
          </button>

          <button
            onClick={() => navigate('/app/animais')}
            className="px-4 py-2.5 bg-white border border-[#EAE8E3] rounded-xl text-sm font-medium text-[#0C4A45] hover:bg-[#F8F7F3] transition-colors"
          >
            + Novo animal
          </button>

          <button
            onClick={() => navigate('/app/agenda')}
            className="px-4 py-2.5 bg-[#0C4A45] rounded-xl text-sm font-medium text-white hover:bg-[#0A3F3B] transition-colors"
          >
            + Nova consulta
          </button>
        </div>
      </div>

      {/* Erro */}
      {erro && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <StatCard
          titulo="Consultas hoje"
          valor={consultasHoje.length}
          descricao={
            consultasHoje.length === 1
              ? '1 atendimento agendado'
              : `${consultasHoje.length} atendimentos agendados`
          }
          onClick={() => navigate('/app/agenda')}
          icon={
            <Icon>
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
              />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </Icon>
          }
        />

        <StatCard
          titulo="Animais cadastrados"
          valor={animaisCount}
          descricao="Pacientes ativos"
          onClick={() => navigate('/app/animais')}
          icon={
            <Icon>
              <path d="M10 5.172C10 3.443 8.557 2 6.828 2c-1.81 0-2.828 1.51-2.828 3.172 0 1.112.5 2.16 1.328 2.828" />
              <path d="M14 5.172C14 3.443 15.443 2 17.172 2c1.81 0 2.828 1.51 2.828 3.172 0 1.112-.5 2.16-1.328 2.828" />
              <path d="M12 19c-3.866 0-7-2.686-7-6 0-1.724.671-3.289 1.757-4.457C7.703 7.44 9.774 7 12 7s4.297.44 5.243 1.543C18.329 9.71 19 11.276 19 13c0 3.314-3.134 6-7 6z" />
            </Icon>
          }
        />

        <StatCard
          titulo="Tutores cadastrados"
          valor={tutoresCount}
          descricao="Tutores ativos"
          onClick={() => navigate('/app/tutores')}
          icon={
            <Icon>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </Icon>
          }
        />

        <StatCard
          titulo="Vacinas pendentes"
          valor={vacinasPendentes.length}
          descricao={
            vacinasVencidas.length > 0
              ? `${vacinasVencidas.length} vencida(s)`
              : 'Nenhuma vencida'
          }
          onClick={() => navigate('/app/vacinacao')}
          icon={
            <Icon>
              <path d="M14.5 2.5c0 1.5-1.5 3-1.5 3H9s-1.5-1.5-1.5-3a3 3 0 0 1 6 0z" />
              <path d="M9 5v14" />
              <path d="M15 5v14" />
              <line x1="6" y1="12" x2="18" y2="12" />
            </Icon>
          }
        />

      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)] gap-5">

        {/* Coluna principal */}
        <div className="space-y-5">

          {/* Consultas de hoje */}
          <section className="bg-white border border-[#EAE8E3] rounded-2xl overflow-hidden">

            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEECE8]">
              <div>
                <h2 className="text-sm font-semibold text-[#0C1A1A]">
                  Consultas de hoje
                </h2>

                <p className="text-xs text-[#929795] mt-0.5">
                  {formatarData(getHoje())}
                </p>
              </div>

              <button
                onClick={() => navigate('/app/agenda')}
                className="text-xs font-medium text-[#0C4A45] hover:underline"
              >
                Ver agenda
              </button>
            </div>

            {consultasHoje.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="text-3xl mb-3">
                  📅
                </div>

                <p className="text-sm font-medium text-[#3F4745]">
                  Nenhuma consulta hoje
                </p>

                <p className="text-xs text-[#969C9A] mt-1">
                  Sua agenda está livre por enquanto.
                </p>
              </div>
            ) : (
              <div>
                {consultasHoje.map((consulta) => (
                  <div
                    key={consulta.id}
                    className="flex items-center gap-4 px-5 py-4 border-b border-[#F0EEEA] last:border-b-0 hover:bg-[#FCFBF8] transition-colors"
                  >
                    <div className="w-14 text-center shrink-0">
                      <p className="text-sm font-semibold text-[#0C1A1A]">
                        {formatarHorario(
                          consulta.horario_inicio
                        )}
                      </p>

                      {consulta.horario_fim && (
                        <p className="text-[10px] text-[#9A9F9D] mt-0.5">
                          até{' '}
                          {formatarHorario(
                            consulta.horario_fim
                          )}
                        </p>
                      )}
                    </div>

                    {renderIconeEspecie(
                      consulta.animais?.especie
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#202826] truncate">
                        {consulta.animais?.nome ||
                          'Animal não informado'}
                      </p>

                      <p className="text-xs text-[#919795] truncate mt-0.5">
                        {consulta.motivo ||
                          consulta.tipo ||
                          'Consulta'}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                        STATUS_COLOR[
                          consulta.status
                        ] ||
                        'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {STATUS_LABEL[
                        consulta.status
                      ] ||
                        consulta.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </section>

          {/* Próximos retornos */}
          <section className="bg-white border border-[#EAE8E3] rounded-2xl overflow-hidden">

            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEECE8]">
              <div>
                <h2 className="text-sm font-semibold text-[#0C1A1A]">
                  Próximos retornos
                </h2>

                <p className="text-xs text-[#929795] mt-0.5">
                  Acompanhamentos agendados
                </p>
              </div>

              <button
                onClick={() => navigate('/app/agenda')}
                className="text-xs font-medium text-[#0C4A45] hover:underline"
              >
                Ver agenda
              </button>
            </div>

            {proximosRetornos.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-[#777E7C]">
                  Nenhum retorno agendado.
                </p>
              </div>
            ) : (
              <div>
                {proximosRetornos.map((retorno) => (
                  <div
                    key={retorno.id}
                    className="flex items-center gap-4 px-5 py-3.5 border-b border-[#F0EEEA] last:border-b-0"
                  >
                    {renderIconeEspecie(
                      retorno.animais?.especie
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#202826] truncate">
                        {retorno.animais?.nome ||
                          'Animal não informado'}
                      </p>

                      <p className="text-xs text-[#919795] mt-0.5">
                        {retorno.motivo ||
                          'Retorno'}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-[#0C1A1A]">
                        {formatarDataCurta(
                          retorno.data
                        )}
                      </p>

                      <p className="text-[10px] text-[#929795] mt-0.5">
                        {formatarHorario(
                          retorno.horario_inicio
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>

        </div>

        {/* Coluna lateral */}
        <div className="space-y-5">

          {/* Atenção */}
          <section className="bg-white border border-[#EAE8E3] rounded-2xl overflow-hidden">

            <div className="px-5 py-4 border-b border-[#EEECE8]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[#0C1A1A]">
                    Atenção
                  </h2>

                  <p className="text-xs text-[#929795] mt-0.5">
                    Informações que precisam de atenção
                  </p>
                </div>

                {totalAtencoes > 0 && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-rose-50 text-rose-600">
                    {totalAtencoes}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3">

              {consultasAtrasadas.length > 0 && (
                <button
                  onClick={() => navigate('/app/agenda')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAF9F6] text-left transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4">
                      <circle cx="12" cy="12" r="9" />
                      <polyline points="12 7 12 12 15 14" />
                    </Icon>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#303735]">
                      Consultas atrasadas
                    </p>

                    <p className="text-[11px] text-[#919795] mt-0.5">
                      {consultasAtrasadas.length}{' '}
                      aguardando atendimento
                    </p>
                  </div>
                </button>
              )}

              {naoCompareceram.length > 0 && (
                <button
                  onClick={() => navigate('/app/agenda')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAF9F6] text-left transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4">
                      <circle cx="12" cy="12" r="9" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                    </Icon>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#303735]">
                      Não compareceu
                    </p>

                    <p className="text-[11px] text-[#919795] mt-0.5">
                      {naoCompareceram.length}{' '}
                      consulta(s) hoje
                    </p>
                  </div>
                </button>
              )}

              {vacinasVencidas.length > 0 && (
                <button
                  onClick={() =>
                    navigate('/app/vacinacao')
                  }
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#FAF9F6] text-left transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4">
                      <path d="M14.5 2.5c0 1.5-1.5 3-1.5 3H9s-1.5-1.5-1.5-3a3 3 0 0 1 6 0z" />
                      <path d="M9 5v14" />
                      <path d="M15 5v14" />
                      <line x1="6" y1="12" x2="18" y2="12" />
                    </Icon>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#303735]">
                      Vacinas vencidas
                    </p>

                    <p className="text-[11px] text-[#919795] mt-0.5">
                      {vacinasVencidas.length}{' '}
                      vacina(s) pendente(s)
                    </p>
                  </div>
                </button>
              )}

              {totalAtencoes === 0 && (
                <div className="py-7 text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5">
                      <polyline points="20 6 9 17 4 12" />
                    </Icon>
                  </div>

                  <p className="text-sm font-medium text-[#3D4643]">
                    Tudo em dia
                  </p>

                  <p className="text-xs text-[#9A9F9D] mt-1">
                    Nenhuma pendência no momento.
                  </p>
                </div>
              )}

            </div>

          </section>

          {/* Vacinas pendentes */}
          <section className="bg-white border border-[#EAE8E3] rounded-2xl overflow-hidden">

            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEECE8]">
              <div>
                <h2 className="text-sm font-semibold text-[#0C1A1A]">
                  Vacinas pendentes
                </h2>

                <p className="text-xs text-[#929795] mt-0.5">
                  Próximas doses e atrasos
                </p>
              </div>

              <button
                onClick={() =>
                  navigate('/app/vacinacao')
                }
                className="text-xs font-medium text-[#0C4A45] hover:underline"
              >
                Ver todas
              </button>
            </div>

            {vacinasPendentes.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <div className="text-2xl mb-2">
                  💉
                </div>

                <p className="text-sm text-[#777E7C]">
                  Nenhuma vacina pendente.
                </p>
              </div>
            ) : (
              <div>
                {vacinasPendentes.map((vacina) => {
                  const vencida =
                    vacina.proxima_dose <
                    getHoje()

                  const hoje =
                    vacina.proxima_dose ===
                    getHoje()

                  return (
                    <div
                      key={vacina.id}
                      className="px-5 py-3.5 border-b border-[#F0EEEA] last:border-b-0"
                    >
                      <div className="flex items-center gap-3">

                        {renderIconeEspecie(
                          vacina.animais?.especie
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#303735] truncate">
                            {vacina.animais?.nome ||
                              'Animal não informado'}
                          </p>

                          <p className="text-[11px] text-[#919795] truncate mt-0.5">
                            {vacina.nome_vacina}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p
                            className={`text-[10px] font-semibold ${
                              vencida
                                ? 'text-red-600'
                                : hoje
                                  ? 'text-amber-600'
                                  : 'text-[#5E6865]'
                            }`}
                          >
                            {vencida
                              ? 'Vencida'
                              : hoje
                                ? 'Hoje'
                                : formatarDataCurta(
                                    vacina.proxima_dose
                                  )}
                          </p>

                          {vencida && (
                            <p className="text-[9px] text-[#9A9F9D] mt-0.5">
                              {formatarData(
                                vacina.proxima_dose
                              )}
                            </p>
                          )}
                        </div>

                      </div>
                    </div>
                  )
                })}
              </div>
            )}

          </section>

          {/* Resumo */}
          <section className="bg-[#0C4A45] rounded-2xl p-5 text-white">

            <h2 className="text-sm font-semibold">
              Resumo de hoje
            </h2>

            <div className="grid grid-cols-2 gap-3 mt-4">

              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-white/50">
                  Em atendimento
                </p>

                <p className="text-xl font-semibold mt-1">
                  {emAtendimento.length}
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-white/50">
                  Não compareceu
                </p>

                <p className="text-xl font-semibold mt-1">
                  {naoCompareceram.length}
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-white/50">
                  Atrasadas
                </p>

                <p className="text-xl font-semibold mt-1">
                  {consultasAtrasadas.length}
                </p>
              </div>

              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-[10px] text-white/50">
                  Vacinas vencidas
                </p>

                <p className="text-xl font-semibold mt-1">
                  {vacinasVencidas.length}
                </p>
              </div>

            </div>

          </section>

        </div>

      </div>

    </div>
  )
}

export default Dashboard