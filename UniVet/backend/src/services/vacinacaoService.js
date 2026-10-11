const supabase = require('./supabase')

async function listar(estabelecimentoId) {
  const { data, error } = await supabase
    .from('vacinacoes')
    .select(`
      id,
      estabelecimento_id,
      animal_id,
      veterinario_id,
      nome_vacina,
      data_aplicacao,
      proxima_dose,
      observacoes,
      criado_em,
      animais (
        id,
        nome,
        especie
      )
    `)
    .eq('estabelecimento_id', estabelecimentoId)
    .order('data_aplicacao', { ascending: false })

  if (error) {
    console.error('Erro ao listar vacinações:', error)
    throw error
  }

  return data || []
}

async function buscarPorId(id, estabelecimentoId) {
  const { data, error } = await supabase
    .from('vacinacoes')
    .select(`
      id,
      estabelecimento_id,
      animal_id,
      veterinario_id,
      nome_vacina,
      data_aplicacao,
      proxima_dose,
      observacoes,
      criado_em,
      animais (
        id,
        nome,
        especie
      )
    `)
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .maybeSingle()

  if (error) {
    console.error('Erro ao buscar vacinação:', error)
    throw error
  }

  return data
}

async function cadastrar(dados, estabelecimentoId) {
  const {
    animal_id,
    nome_vacina,
    data_aplicacao,
    proxima_dose,
    observacoes
  } = dados

  if (!animal_id || !nome_vacina?.trim() || !data_aplicacao) {
    const error = new Error(
      'Informe o animal, a vacina e a data de aplicação.'
    )
    error.status = 400
    throw error
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(data_aplicacao) ||
    (proxima_dose && !/^\d{4}-\d{2}-\d{2}$/.test(proxima_dose))
  ) {
    const error = new Error('Informe datas válidas.')
    error.status = 400
    throw error
  }

  if (proxima_dose && proxima_dose < data_aplicacao) {
    const error = new Error(
      'A próxima dose não pode ser anterior à aplicação.'
    )
    error.status = 400
    throw error
  }

  const { data: animal, error: erroAnimal } = await supabase
    .from('animais')
    .select('id')
    .eq('id', animal_id)
    .eq('estabelecimento_id', estabelecimentoId)
    .maybeSingle()

  if (erroAnimal) {
    console.error('Erro ao validar animal:', erroAnimal)
    throw erroAnimal
  }

  if (!animal) {
    const error = new Error(
      'Animal não encontrado neste estabelecimento.'
    )
    error.status = 404
    throw error
  }

  const registro = {
    estabelecimento_id: estabelecimentoId,
    animal_id,
    nome_vacina: nome_vacina.trim(),
    data_aplicacao,
    proxima_dose: proxima_dose || null,
    observacoes: observacoes?.trim() || null
  }

  const { data, error } = await supabase
    .from('vacinacoes')
    .insert(registro)
    .select()
    .single()

  if (error) {
    console.error('Erro ao cadastrar vacinação:', error)
    throw error
  }

  return data
}

module.exports = {
  listar,
  buscarPorId,
  cadastrar
}