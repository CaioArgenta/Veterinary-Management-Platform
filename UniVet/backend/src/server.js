require('dotenv').config()

const express = require('express')
const cors = require('cors')

const supabase = require('./services/supabase')
const tutoresRoutes = require('./routes/tutores')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/tutores', tutoresRoutes)

app.get('/api/teste', (req, res) => {
  res.json({
    mensagem: 'API do UniVet funcionando!'
  })
})

app.get('/api/teste-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tutores')
      .select('id')
      .limit(1)

    if (error) {
      throw error
    }

    res.json({
      mensagem: 'Backend conectado ao Supabase!',
      conectado: true,
      registros: data?.length || 0
    })
  } catch (error) {
    console.error('Erro ao conectar ao Supabase:', error)

    res.status(500).json({
      mensagem: 'Erro ao conectar ao Supabase.',
      conectado: false
    })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})