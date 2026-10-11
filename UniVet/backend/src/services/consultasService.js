const supabase = require('./supabase')

function erro(mensagem, status = 400) {
  const error = new Error(mensagem)
  error.status = status
  return error
}

async function listarVeterinarios(estabelecimentoId) {
  const { data, error } = await supabase
    .from('perfis')
    .select('id, nome_completo, crmv, tipo')
    .eq('estabelecimento_id', estabelecimentoId)
    .in('tipo', ['VETERINARIO', 'ADMINISTRADOR'])
    .eq('ativo', true)
    .order('nome_completo')

  if (error) throw error

  return data || []
}

async function validarVeterinario(veterinarioId, estabelecimentoId) {
  if (!veterinarioId) {
    throw erro('Selecione um veterinário responsável.')
  }

  const { data, error } = await supabase
    .from('perfis')
    .select('id')
    .eq('id', veterinarioId)
    .eq('estabelecimento_id', estabelecimentoId)
    .in('tipo', ['VETERINARIO', 'ADMINISTRADOR'])
    .eq('ativo', true)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    throw erro('Veterinário responsável não encontrado neste estabelecimento.', 404)
  }

  return data.id
}

async function listarConsultas(estabelecimentoId) {
  const { data, error } = await supabase
    .from('consultas')
    .select(`
      *,
      animais (
        id,
        nome,
        especie
      )
    `)
    .eq('estabelecimento_id', estabelecimentoId)
    .order('data_hora', { ascending: false })

  if (error) throw error

  return data || []
}

async function buscarConsulta(id, estabelecimentoId) {
  const { data, error } = await supabase
    .from('consultas')
    .select(`
      *,
      animais (
        id,
        nome,
        especie
      )
    `)
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .maybeSingle()

  if (error) throw error

  return data
}

async function validarAnimal(animalId, estabelecimentoId) {
  const { data, error } = await supabase
    .from('animais')
    .select('id')
    .eq('id', animalId)
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('ativo', true)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    throw erro('Animal não encontrado neste estabelecimento.', 404)
  }
}

async function criarConsulta(dados, estabelecimentoId) {
  if (!dados.animal_id) {
    throw erro('Selecione um animal.')
  }

  if (!dados.data_hora) {
    throw erro('Data e horário são obrigatórios.')
  }

  if (!dados.queixa?.trim()) {
    throw erro('A queixa principal é obrigatória.')
  }

  const dataHora = new Date(dados.data_hora)

  if (Number.isNaN(dataHora.getTime())) {
    throw erro('Data e horário inválidos.')
  }

  await validarAnimal(dados.animal_id, estabelecimentoId)

  const veterinarioId = await validarVeterinario(
    dados.veterinario_id,
    estabelecimentoId
  )

  const consulta = {
    estabelecimento_id: estabelecimentoId,
    animal_id: dados.animal_id,
    veterinario_id: veterinarioId,
    data_hora: dataHora.toISOString(),
    queixa: dados.queixa.trim(),
    diagnostico: dados.diagnostico?.trim() || null,
    tratamento: dados.tratamento?.trim() || null,
    observacoes: dados.observacoes?.trim() || null
  }

  if (dados.agendamento_id) {
    const { data: agendamento, error } = await supabase
      .from('agendamentos')
      .select('id')
      .eq('id', dados.agendamento_id)
      .eq('animal_id', dados.animal_id)
      .eq('estabelecimento_id', estabelecimentoId)
      .maybeSingle()

    if (error) throw error

    if (!agendamento) {
      throw erro('Agendamento não encontrado para este animal.', 404)
    }

    consulta.agendamento_id = agendamento.id
  }

  const { data, error } = await supabase
    .from('consultas')
    .insert(consulta)
    .select()
    .single()

  if (error) throw error

  return buscarConsulta(data.id, estabelecimentoId)
}

async function atualizarConsulta(id, dados, estabelecimentoId) {
  const atual = await buscarConsulta(id, estabelecimentoId)

  if (!atual) return null

  const atualizacao = {}

  if (dados.animal_id !== undefined) {
    await validarAnimal(dados.animal_id, estabelecimentoId)
    atualizacao.animal_id = dados.animal_id
  }

  if (dados.veterinario_id !== undefined) {
    atualizacao.veterinario_id = await validarVeterinario(
      dados.veterinario_id,
      estabelecimentoId
    )
  }

  if (dados.data_hora !== undefined) {
    const dataHora = new Date(dados.data_hora)

    if (Number.isNaN(dataHora.getTime())) {
      throw erro('Data e horário inválidos.')
    }

    atualizacao.data_hora = dataHora.toISOString()
  }

  for (const campo of [
    'queixa',
    'diagnostico',
    'tratamento',
    'observacoes'
  ]) {
    if (dados[campo] !== undefined) {
      atualizacao[campo] = dados[campo]?.trim() || null
    }
  }

  if (dados.agendamento_id !== undefined) {
    if (dados.agendamento_id) {
      const { data: agendamento, error } = await supabase
        .from('agendamentos')
        .select('id')
        .eq('id', dados.agendamento_id)
        .eq(
          'animal_id',
          atualizacao.animal_id || atual.animal_id
        )
        .eq('estabelecimento_id', estabelecimentoId)
        .maybeSingle()

      if (error) throw error

      if (!agendamento) {
        throw erro('Agendamento não encontrado para este animal.', 404)
      }

      atualizacao.agendamento_id = agendamento.id
    } else {
      atualizacao.agendamento_id = null
    }
  }

  if (Object.keys(atualizacao).length === 0) {
    return atual
  }

  atualizacao.atualizado_em = new Date().toISOString()

  const { data, error } = await supabase
    .from('consultas')
    .update(atualizacao)
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .select('id')
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return buscarConsulta(id, estabelecimentoId)
}

module.exports = {
  listarVeterinarios,
  listarConsultas,
  buscarConsulta,
  criarConsulta,
  atualizarConsulta
}