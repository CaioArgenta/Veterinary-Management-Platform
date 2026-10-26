import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import Tutores from './pages/Tutores'
import Animais from './pages/Animais'
import Agenda from './pages/Agenda'
import Consultas from './pages/Consultas'
import Vacinacao from './pages/Vacinacao'
import Funcionarios from './pages/Funcionarios'
import Privacidade from './pages/Privacidade'
import Termos from './pages/Termos'
import Contato from './pages/Contato'
import Perfil from './pages/Perfil'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/contato" element={<Contato />} />

        <Route path="/app" element={<DashboardLayout />}>
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="tutores"
            element={<Tutores />}
          />

          <Route
            path="animais"
            element={<Animais />}
          />

          <Route
            path="agenda"
            element={<Agenda />}
          />

          <Route
            path="consultas"
            element={<Consultas />}
          />

          <Route
            path="vacinacao"
            element={<Vacinacao />}
          />

          <Route
            path="funcionarios"
            element={<Funcionarios />}
          />

          <Route 
            path="perfil" 
            element={<Perfil />} 
          />
        </Route>
                

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App