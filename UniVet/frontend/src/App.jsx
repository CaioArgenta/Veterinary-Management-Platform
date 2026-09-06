import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import Tutores from './pages/Tutores'
import Animais from './pages/Animais'
import Agenda from './pages/Agenda'
import Prontuarios from './pages/Prontuarios'
import Vacinacao from './pages/Vacinacao'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/app" element={<DashboardLayout />}>

          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tutores" element={<Tutores />} />
          <Route path="animais" element={<Animais />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="prontuario" element={<Prontuarios />} />
          <Route path="vacinacao" element={<Vacinacao />} />

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