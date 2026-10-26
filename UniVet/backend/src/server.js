const path = require('path')

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
})

const express = require('express')
const cors = require('cors')

const tutoresRoutes = require('./routes/tutoresRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const agendaRoutes = require('./routes/agendaRoutes')
const animaisRoutes = require('./routes/animaisRoutes')
const consultasRoutes = require('./routes/consultasRoutes')
const cadastroRoutes = require('./routes/cadastroRoutes')
const funcionariosRoutes = require('./routes/funcionariosRoutes')
const vacinacaoRoutes = require('./routes/vacinacaoRoutes')
const perfilRoutes = require('./routes/perfilRoutes')
const rastreabilidadeRoutes = require('./routes/rastreabilidadeRoutes');


const app = express()


const corsOptions = {
  origin: [
    'https://veterinary-management-platform-f0eq9zj6f.vercel.app',
    'https://musical-pancake-7g9vpx44rq72x545-5173.app.github.dev',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}

app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))


app.use(express.json())

app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'API do UniVet funcionando!' })
})

app.use('/api/cadastro', cadastroRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/tutores', tutoresRoutes)
app.use('/api/agenda', agendaRoutes)
app.use('/api/animais', animaisRoutes)
app.use('/api/consultas', consultasRoutes)
app.use('/api/funcionarios', funcionariosRoutes)
app.use('/api/vacinacao', vacinacaoRoutes)
app.use('/api/perfil', perfilRoutes)
app.use('/api/rastreabilidade', rastreabilidadeRoutes);

app.use((err, req, res, next) => {
  console.error('Erro na API:', err)
  res.status(500).json({ mensagem: 'Erro interno no servidor.' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})