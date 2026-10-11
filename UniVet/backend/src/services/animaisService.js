
const supabase = require('./supabase')

function erro(mensagem, status = 400) {
  const error = new Error(mensagem)
  error.status = status
  return error
}

async function listarAnimais(estabelecimentoId) {
  const { data, error } = await supabase
    .from('animais')
    .select(`
      id,
      nome,
      especie,
      raca,
      sexo,
      data_nascimento,
      peso,
      microchip,
      observacoes,
      ativo,
      criado_em,
      atualizado_em,
      animal_tutores (
        id,
        principal,
        tutor_id,
        tutores (
          id,
          nome_completo
        )
      )
    `)
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('ativo', true)
    .order('nome')

  if (error) throw error

  return (data || []).map(animal => ({
    ...animal,
    tutor: animal.animal_tutores?.find(relacao => relacao.principal)
      ?.tutores || animal.animal_tutores?.[0]?.tutores || null
  }))
}

async function buscarAnimal(id, estabelecimentoId) {
  const { data, error } = await supabase
    .from('animais')
    .select(`
      id,
      nome,
      especie,
      raca,
      sexo,
      data_nascimento,
      peso,
      microchip,
      observacoes,
      ativo,
      criado_em,
      atualizado_em,
      animal_tutores (
        id,
        principal,
        tutor_id,
        tutores (
          id,
          nome_completo
        )
      )
    `)
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('ativo', true)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    ...data,
    tutor: data.animal_tutores?.find(relacao => relacao.principal)
      ?.tutores || data.animal_tutores?.[0]?.tutores || null
  }
}

async function validarTutor(tutorId, estabelecimentoId) {
  if (!tutorId) return null

  const { data, error } = await supabase
    .from('tutores')
    .select('id')
    .eq('id', tutorId)
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('ativo', true)
    .maybeSingle()

  if (error) throw error

  if (!data) {
    throw erro('Tutor não encontrado neste estabelecimento.', 404)
  }

  return data.id
}

function validarDados(dados) {
  const nome = dados.nome?.trim()
  const especie = dados.especie?.trim()

  if (!nome) throw erro('Nome do animal é obrigatório.')
  if (!especie) throw erro('Espécie é obrigatória.')

  let peso = null

  if (dados.peso !== undefined && dados.peso !== null && dados.peso !== '') {
    peso = Number(dados.peso)

    if (!Number.isFinite(peso) || peso <= 0) {
      throw erro('O peso deve ser maior que zero.')
    }
  }

  return {
    nome,
    especie,
    raca: dados.raca?.trim() || null,
    sexo: dados.sexo?.trim() || null,
    data_nascimento: dados.data_nascimento || null,
    peso,
    microchip: dados.microchip?.trim() || null,
    observacoes: dados.observacoes?.trim() || null
  }
}

async function relacionarTutor(animalId, tutorId, estabelecimentoId) {
  if (!tutorId) return

  const { error: erroRelacao } = await supabase
    .from('animal_tutores')
    .insert({
      estabelecimento_id: estabelecimentoId,
      animal_id: animalId,
      tutor_id: tutorId,
      principal: true
    })

  if (erroRelacao) {
    await supabase
      .from('animais')
      .update({ ativo: false })
      .eq('id', animalId)
      .eq('estabelecimento_id', estabelecimentoId)

    throw erroRelacao
  }
}

async function criarAnimal(dados, estabelecimentoId) {
  const animal = validarDados(dados)
  const tutorId = await validarTutor(dados.tutor_id, estabelecimentoId)

  const { data, error } = await supabase
    .from('animais')
    .insert({
      ...animal,
      estabelecimento_id: estabelecimentoId,
      ativo: true
    })
    .select('id')
    .single()

  if (error) throw error

  await relacionarTutor(data.id, tutorId, estabelecimentoId)

  return buscarAnimal(data.id, estabelecimentoId)
}

async function atualizarAnimal(id, dados, estabelecimentoId) {
  const atual = await buscarAnimal(id, estabelecimentoId)

  if (!atual) return null

  const animal = validarDados({
    ...atual,
    ...dados
  })

  const { data, error } = await supabase
    .from('animais')
    .update({
      ...animal,
      atualizado_em: new Date().toISOString()
    })
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('ativo', true)
    .select('id')
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  if (dados.tutor_id !== undefined) {
    const tutorId = await validarTutor(dados.tutor_id, estabelecimentoId)

    const { error: erroRelacao } = await supabase
      .from('animal_tutores')
      .delete()
      .eq('animal_id', id)
      .eq('estabelecimento_id', estabelecimentoId)

    if (erroRelacao) throw erroRelacao

    await relacionarTutor(id, tutorId, estabelecimentoId)
  }

  return buscarAnimal(id, estabelecimentoId)
}

async function excluirAnimal(id, estabelecimentoId) {
  const { data, error } = await supabase
    .from('animais')
    .update({
      ativo: false,
      atualizado_em: new Date().toISOString()
    })
    .eq('id', id)
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('ativo', true)
    .select('id')
    .maybeSingle()

  if (error) throw error

  return data
}

module.exports = {
  listarAnimais,
  buscarAnimal,
  criarAnimal,
  atualizarAnimal,
  excluirAnimal
}
