const express = require('express')

const tutoresRoutes = require('./routes/tutoresRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const agendaRoutes = require('./routes/agendaRoutes')
const consultasRoutes = require('./routes/consultasRoutes')
const cadastroRoutes = require('./routes/cadastroRoutes')
const vacinacaoRoutes = require('./routes/vacinacaoRoutes')
const perfilRoutes = require('./routes/perfilRoutes')
const rastreabilidadeRoutes = require('./routes/rastreabilidadeRoutes');

const app = express()

app.use(express.json())

app.use('/api/cadastro', cadastroRoutes)
app.use('/api/consultas', consultasRoutes)
app.use('/api/agenda', agendaRoutes)
app.use('/api/tutores', tutoresRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/vacinacao', vacinacaoRoutes)
app.use('/api/perfil', perfilRoutes)
app.use('/api/rastreabilidade', rastreabilidadeRoutes);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})

module.exports = app