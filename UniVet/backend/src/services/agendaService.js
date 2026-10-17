const supabase = require('./supabase')

const STATUS_VALIDOS = [
  'AGENDADO',
  'CONFIRMADO',
  'EM_ATENDIMENTO',
  'CONCLUIDO',
  'CANCELADO',
  'NAO_COMPARECEU'
]

const TIPOS_VALIDOS = [
  'CONSULTA',
  'RETORNO',
  'VACINACAO',
  'PROCEDIMENTO',
  'OUTRO'
]

const CAMPOS = [
  'animal_id',
  'veterinario_id',
  'tipo',
  'data',
  'horario_inicio',
  'horario_fim',
  'status',
  'motivo'
]

function erro(mensagem, status = 400) {
  const error = new Error(mensagem)
  error.status = status
  return error
}

function validarDados(dados, atualizacao = false) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    throw erro('Dados do agendamento inválidos.')
  }

  if (!atualizacao || dados.tipo !== undefined) {
    if (!TIPOS_VALIDOS.includes(dados.tipo)) {
      throw erro('Tipo de atendimento inválido.')
    }
  }

  if (!atualizacao || dados.status !== undefined) {
    if (!STATUS_VALIDOS.includes(dados.status || 'AGENDADO')) {
      throw erro('Status do agendamento inválido.')
    }
  }

  if (!atualizacao || dados.animal_id !== undefined) {
    if (!dados.animal_id) {
      throw erro('Selecione um animal.')
    }
  }

  if (!atualizacao || dados.data !== undefined) {
    if (!dados.data) {
      throw erro('Informe a data do agendamento.')
    }
  }

  if (!atualizacao || dados.horario_inicio !== undefined) {
    if (!dados.horario_inicio) {
      throw erro('Informe o horário de início.')
    }
  }

  if (!atualizacao || dados.horario_fim !== undefined) {
    if (!dados.horario_fim) {
      throw erro('Informe o horário de término.')
    }
  }

  const inicio = dados.horario_inicio
  const fim = dados.horario_fim

  if (inicio && fim && fim <= inicio) {
    throw erro('O horário final deve ser posterior ao inicial.')
  }
}

function prepararDados(dados, atualizacao = false) {
  const resultado = {}

  for (const campo of CAMPOS) {
    if (dados[campo] !== undefined) {
      resultado[campo] = dados[campo]
    }
  }

  if (!atualizacao && !resultado.status) {
    resultado.status = 'AGENDADO'
  }

  if (resultado.veterinario_id === '') {
    resultado.veterinario_id = null
  }

  if (resultado.motivo === '') {
    resultado.motivo = null
  }

  return resultado
}

async function validarVeterinario(veterinarioId, estabelecimentoId) {
  if (!veterinarioId) return null

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
    throw erro(
      'O responsável selecionado não é um veterinário ou administrador ativo deste estabelecimento.',
      400
    )
  }

  return data.id
}

async function listar(estabelecimentoId, filtros = {}) {
  let consulta = supabase
    .from('agendamentos')
    .select(`
      id,
      estabelecimento_id,
      animal_id,
      veterinario_id,
      tipo,
      data,
      horario_inicio,
      horario_fim,
      status,
      motivo,
      animais (
        id,
        nome,
        especie,
        animal_tutores (
          tutores (
            id,
            nome_completo
          )
        )
      )
    `)
    .eq('estabelecimento_id', estabelecimentoId)
    .order('data', { ascending: true })
    .order('horario_inicio', { ascending: true })

  if (filtros.data) {
    consulta = consulta.eq('data', filtros.data)
  }

  if (filtros.data_inicio) {
    consulta = consulta.gte('data', filtros.data_inicio)
  }

  if (filtros.data_fim) {
    consulta = consulta.lte('data', filtros.data_fim)
  }

  if (filtros.status && STATUS_VALIDOS.includes(filtros.status)) {
    consulta = consulta.eq('status', filtros.status)
  }

  const { data, error } = await consulta

  if (error) throw error

  const agendamentos = data || []

  const veterinarioIds = [
    ...new Set(
      agendamentos
        .map((item) => item.veterinario_id)
        .filter(Boolean)
    )
  ]

  let veterinarios = []

  if (veterinarioIds.length > 0) {
    const { data: perfis, error: perfisError } = await supabase
      .from('perfis')
      .select('id, nome_completo')
      .eq('estabelecimento_id', estabelecimentoId)
      .in('id', veterinarioIds)

    if (perfisError) throw perfisError

    veterinarios = perfis || []
  }

  return agendamentos.map((item) => {
    const animal = Array.isArray(item.animais)
      ? item.animais[0]
      : item.animais

    const relacoesTutor = animal?.animal_tutores || []

    const tutor = relacoesTutor
      .map((relacao) => {
        const tutores = relacao.tutores

        return Array.isArray(tutores) ? tutores[0] : tutores
      })
      .find(Boolean)

    const veterinario = veterinarios.find(
      (perfil) => perfil.id === item.veterinario_id
    )

    return {
      ...item,
      animais: animal
        ? {
            ...animal,
            tutorNome: tutor?.nome_completo || 'Tutor não informado'
          }
        : null,
      veterinario: veterinario?.nome_completo || null
    }
  })
}

async function buscarPorId(id, estabelecimentoId) {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      id,
      estabelecimento_id,
      animal_id,
      veterinario_id,
      tipo,
      data,
      horario_inicio,
      horario_fim,
      status,
      motivo,
      animais (
        id,
        nome,
        especie,
        animal_tutores (
          tutores (
            id,
            nome_completo
          )
        )
      )
    `)
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .maybeSingle()

  if (error) throw error

  if (!data) return null

  const animal = Array.isArray(data.animais)
    ? data.animais[0]
    : data.animais

  const relacoesTutor = animal?.animal_tutores || []

  const tutor = relacoesTutor
    .map((relacao) => {
      const tutores = relacao.tutores

      return Array.isArray(tutores) ? tutores[0] : tutores
    })
    .find(Boolean)

  let veterinario = null

  if (data.veterinario_id) {
    const { data: perfil, error: perfilError } = await supabase
      .from('perfis')
      .select('id, nome_completo')
      .eq('id', data.veterinario_id)
      .eq('estabelecimento_id', estabelecimentoId)
      .maybeSingle()

    if (perfilError) throw perfilError

    veterinario = perfil?.nome_completo || null
  }

  return {
    ...data,
    animais: animal
      ? {
          ...animal,
          tutorNome: tutor?.nome_completo || 'Tutor não informado'
        }
      : null,
    veterinario
  }
}

async function criar(dados, estabelecimentoId) {
  validarDados(dados)

  const novoAgendamento = prepararDados(dados)

  const { data: animal, error: animalError } = await supabase
    .from('animais')
    .select('id')
    .eq('id', novoAgendamento.animal_id)
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('ativo', true)
    .maybeSingle()

  if (animalError) throw animalError

  if (!animal) {
    throw erro('Animal não encontrado ou inativo.', 404)
  }

  novoAgendamento.veterinario_id = await validarVeterinario(
    novoAgendamento.veterinario_id,
    estabelecimentoId
  )

  novoAgendamento.estabelecimento_id = estabelecimentoId

  const { data, error } = await supabase
    .from('agendamentos')
    .insert(novoAgendamento)
    .select()
    .single()

  if (error) throw error

  return data
}

async function atualizar(id, dados, estabelecimentoId) {
  validarDados(dados, true)

  const atualizacao = prepararDados(dados, true)

  if (!Object.keys(atualizacao).length) {
    throw erro('Nenhum dado informado para atualização.')
  }

  if (atualizacao.animal_id) {
    const { data: animal, error: animalError } = await supabase
      .from('animais')
      .select('id')
      .eq('id', atualizacao.animal_id)
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('ativo', true)
      .maybeSingle()

    if (animalError) throw animalError

    if (!animal) {
      throw erro('Animal não encontrado ou inativo.', 404)
    }
  }

  if (atualizacao.veterinario_id !== undefined) {
    atualizacao.veterinario_id = await validarVeterinario(
      atualizacao.veterinario_id,
      estabelecimentoId
    )
  }

  const { data, error } = await supabase
    .from('agendamentos')
    .update(atualizacao)
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .select()
    .maybeSingle()

  if (error) throw error

  return data
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar
}