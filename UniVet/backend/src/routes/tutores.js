const express = require('express')
const supabase = require('../services/supabase')
const auth = require('../middlewares/auth')

const router = express.Router()

router.use(auth)

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tutores')
      .select(`
        id,
        nome_completo,
        cpf,
        telefone,
        email,
        endereco,
        ativo,
        criado_em,
        atualizado_em,
        animal_tutores (
          id,
          principal,
          animais (
            id,
            nome,
            especie,
            raca,
            sexo
          )
        )
      `)
      .eq('estabelecimento_id', req.estabelecimentoId)
      .eq('ativo', true)
      .order('nome_completo')

    if (error) {
      console.error(error)

      return res.status(500).json({
        mensagem: 'Erro ao buscar tutores.'
      })
    }

    res.json(data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      mensagem: 'Erro interno do servidor.'
    })
  }
})


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('tutores')
      .select(`
        id,
        nome_completo,
        cpf,
        telefone,
        email,
        endereco,
        ativo,
        criado_em,
        atualizado_em,
        animal_tutores (
          id,
          principal,
          animais (
            id,
            nome,
            especie,
            raca,
            sexo
          )
        )
      `)
      .eq('id', id)
      .eq('estabelecimento_id', req.estabelecimentoId)
      .maybeSingle()

    if (error) {
      console.error(error)

      return res.status(500).json({
        mensagem: 'Erro ao buscar tutor.'
      })
    }

    if (!data) {
      return res.status(404).json({
        mensagem: 'Tutor não encontrado.'
      })
    }

    res.json(data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      mensagem: 'Erro interno do servidor.'
    })
  }
})


router.post('/', async (req, res) => {
  try {
    const {
      nome_completo,
      cpf,
      telefone,
      email,
      endereco
    } = req.body

    if (!nome_completo || nome_completo.trim().length < 3) {
      return res.status(400).json({
        mensagem: 'Nome completo é obrigatório.'
      })
    }

    if (!telefone || telefone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({
        mensagem: 'Telefone inválido.'
      })
    }

    if (email) {
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

      if (!emailValido) {
        return res.status(400).json({
          mensagem: 'E-mail inválido.'
        })
      }
    }

    if (cpf && cpf.replace(/\D/g, '').length !== 11) {
      return res.status(400).json({
        mensagem: 'CPF deve possuir 11 números.'
      })
    }

    if (cpf) {
      const cpfLimpo = cpf.replace(/\D/g, '')

      const { data: tutorExistente } = await supabase
        .from('tutores')
        .select('id')
        .eq('estabelecimento_id', req.estabelecimentoId)
        .eq('cpf', cpfLimpo)
        .eq('ativo', true)
        .maybeSingle()

      if (tutorExistente) {
        return res.status(409).json({
          mensagem: 'Já existe um tutor cadastrado com este CPF.'
        })
      }
    }

    if (email) {
      const { data: tutorExistente } = await supabase
        .from('tutores')
        .select('id')
        .eq('estabelecimento_id', req.estabelecimentoId)
        .eq('email', email.trim().toLowerCase())
        .eq('ativo', true)
        .maybeSingle()

      if (tutorExistente) {
        return res.status(409).json({
          mensagem: 'Já existe um tutor cadastrado com este e-mail.'
        })
      }
    }

    const { data, error } = await supabase
      .from('tutores')
      .insert({
        estabelecimento_id: req.estabelecimentoId,
        nome_completo: nome_completo.trim(),
        cpf: cpf ? cpf.replace(/\D/g, '') : null,
        telefone: telefone.replace(/\D/g, ''),
        email: email ? email.trim().toLowerCase() : null,
        endereco: endereco?.trim() || null
      })
      .select()
      .single()

    if (error) {
      console.error(error)

      return res.status(500).json({
        mensagem: 'Erro ao criar tutor.'
      })
    }

    res.status(201).json(data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      mensagem: 'Erro interno do servidor.'
    })
  }
})


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const {
      nome_completo,
      cpf,
      telefone,
      email,
      endereco
    } = req.body

    if (!nome_completo || nome_completo.trim().length < 3) {
      return res.status(400).json({
        mensagem: 'Nome completo é obrigatório.'
      })
    }

    if (!telefone || telefone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({
        mensagem: 'Telefone inválido.'
      })
    }

    if (email) {
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

      if (!emailValido) {
        return res.status(400).json({
          mensagem: 'E-mail inválido.'
        })
      }
    }

    if (cpf && cpf.replace(/\D/g, '').length !== 11) {
      return res.status(400).json({
        mensagem: 'CPF deve possuir 11 números.'
      })
    }

    const { data: tutorAtual, error: tutorError } = await supabase
      .from('tutores')
      .select('id')
      .eq('id', id)
      .eq('estabelecimento_id', req.estabelecimentoId)
      .eq('ativo', true)
      .maybeSingle()

    if (tutorError) {
      console.error(tutorError)

      return res.status(500).json({
        mensagem: 'Erro ao verificar tutor.'
      })
    }

    if (!tutorAtual) {
      return res.status(404).json({
        mensagem: 'Tutor não encontrado.'
      })
    }

    const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : null

    if (cpfLimpo) {
      const { data: outroTutor } = await supabase
        .from('tutores')
        .select('id')
        .eq('estabelecimento_id', req.estabelecimentoId)
        .eq('cpf', cpfLimpo)
        .eq('ativo', true)
        .neq('id', id)
        .maybeSingle()

      if (outroTutor) {
        return res.status(409).json({
          mensagem: 'Já existe outro tutor com este CPF.'
        })
      }
    }

    const emailLimpo = email ? email.trim().toLowerCase() : null

    if (emailLimpo) {
      const { data: outroTutor } = await supabase
        .from('tutores')
        .select('id')
        .eq('estabelecimento_id', req.estabelecimentoId)
        .eq('email', emailLimpo)
        .eq('ativo', true)
        .neq('id', id)
        .maybeSingle()

      if (outroTutor) {
        return res.status(409).json({
          mensagem: 'Já existe outro tutor com este e-mail.'
        })
      }
    }

    const { data, error } = await supabase
      .from('tutores')
      .update({
        nome_completo: nome_completo.trim(),
        cpf: cpfLimpo,
        telefone: telefone.replace(/\D/g, ''),
        email: emailLimpo,
        endereco: endereco?.trim() || null
      })
      .eq('id', id)
      .eq('estabelecimento_id', req.estabelecimentoId)
      .select()
      .single()

    if (error) {
      console.error(error)

      return res.status(500).json({
        mensagem: 'Erro ao atualizar tutor.'
      })
    }

    res.json(data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      mensagem: 'Erro interno do servidor.'
    })
  }
})


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('tutores')
      .update({
        ativo: false
      })
      .eq('id', id)
      .eq('estabelecimento_id', req.estabelecimentoId)
      .eq('ativo', true)
      .select()
      .maybeSingle()

    if (error) {
      console.error(error)

      return res.status(500).json({
        mensagem: 'Erro ao excluir tutor.'
      })
    }

    if (!data) {
      return res.status(404).json({
        mensagem: 'Tutor não encontrado.'
      })
    }

    res.json({
      mensagem: 'Tutor excluído com sucesso.'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      mensagem: 'Erro interno do servidor.'
    })
  }
})


module.exports = router