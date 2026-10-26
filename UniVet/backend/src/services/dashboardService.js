const supabase = require('./supabase')

async function buscarDashboard(estabelecimentoId) {
  const hoje = new Date()
    .toISOString()
    .split('T')[0]

  const agora = new Date()
    .toTimeString()
    .slice(0, 5)

  const [
    consultasHojeResult,
    animaisResult,
    tutoresResult,
    vacinasVencidasResult,
    vacinasHojeResult,
    consultasAtrasadasResult,
    naoCompareceramResult,
    proximosRetornosResult
  ] = await Promise.all([
    supabase
      .from('agendamentos')
      .select(`
        id,
        data,
        horario_inicio,
        horario_fim,
        status,
        tipo,
        motivo,
        animais (
          id,
          nome,
          especie
        )
      `)
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('data', hoje)
      .order('horario_inicio', {
        ascending: true
      }),

    supabase
      .from('animais')
      .select('id', {
        count: 'exact',
        head: true
      })
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('ativo', true),

    supabase
      .from('tutores')
      .select('id', {
        count: 'exact',
        head: true
      })
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('ativo', true),

    supabase
      .from('vacinacoes')
      .select('id', {
        count: 'exact',
        head: true
      })
      .eq('estabelecimento_id', estabelecimentoId)
      .not('proxima_dose', 'is', null)
      .lt('proxima_dose', hoje),

    supabase
      .from('vacinacoes')
      .select('id', {
        count: 'exact',
        head: true
      })
      .eq('estabelecimento_id', estabelecimentoId)
      .not('proxima_dose', 'is', null)
      .eq('proxima_dose', hoje),

    supabase
      .from('agendamentos')
      .select(`
        id,
        data,
        horario_inicio,
        horario_fim,
        status,
        tipo,
        motivo,
        animais (
          id,
          nome,
          especie
        )
      `)
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('data', hoje)
      .eq('status', 'AGENDADO')
      .lt('horario_inicio', agora)
      .order('horario_inicio', {
        ascending: true
      }),

    supabase
      .from('agendamentos')
      .select(`
        id,
        data,
        horario_inicio,
        horario_fim,
        status,
        tipo,
        motivo,
        animais (
          id,
          nome,
          especie
        )
      `)
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('data', hoje)
      .eq('status', 'NAO_COMPARECEU')
      .order('horario_inicio', {
        ascending: true
      }),

    supabase
      .from('agendamentos')
      .select(`
        id,
        data,
        horario_inicio,
        horario_fim,
        status,
        tipo,
        motivo,
        animais (
          id,
          nome,
          especie
        )
      `)
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('tipo', 'RETORNO')
      .neq('status', 'CANCELADO')
      .gte('data', hoje)
      .order('data', {
        ascending: true
      })
      .order('horario_inicio', {
        ascending: true
      })
      .limit(4)
  ])

  const resultados = [
    consultasHojeResult,
    animaisResult,
    tutoresResult,
    vacinasVencidasResult,
    vacinasHojeResult,
    consultasAtrasadasResult,
    naoCompareceramResult,
    proximosRetornosResult
  ]

  const erro = resultados.find(
    resultado => resultado.error
  )

  if (erro) {
    throw erro.error
  }

  const consultasHoje =
    consultasHojeResult.data || []

  const consultasAtrasadas =
    consultasAtrasadasResult.data || []

  const naoCompareceram =
    naoCompareceramResult.data || []

  const emAtendimento =
    consultasHoje.filter(
      consulta =>
        consulta.status === 'EM_ATENDIMENTO'
    )

  const agendadas =
    consultasHoje.filter(
      consulta =>
        consulta.status === 'AGENDADO'
    )

  const consultasRealizadas =
    consultasHoje.filter(
      consulta =>
        consulta.status === 'REALIZADO'
    )

  return {
    indicadores: {
      consultasHoje: consultasHoje.length,
      animais: animaisResult.count || 0,
      tutores: tutoresResult.count || 0,
      vacinasPendentes:
        (vacinasVencidasResult.count || 0) +
        (vacinasHojeResult.count || 0)
    },

    consultasHoje,

    proximosRetornos:
      proximosRetornosResult.data || [],

    consultasAtrasadas,

    naoCompareceram,

    vacinas: {
      vencidas:
        vacinasVencidasResult.count || 0,
      hoje:
        vacinasHojeResult.count || 0,
      total:
        (vacinasVencidasResult.count || 0) +
        (vacinasHojeResult.count || 0)
    },

    resumo: {
      emAtendimento: emAtendimento.length,
      agendadas: agendadas.length,
      realizadas: consultasRealizadas.length,
      naoCompareceram: naoCompareceram.length,
      atrasadas: consultasAtrasadas.length
    }
  }
}

module.exports = {
  buscarDashboard
}