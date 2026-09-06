import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import Agenda from './pages/Agenda'
import Animais from './pages/Animais'
import Tutores from './pages/Tutores'
import Prontuarios from './pages/Prontuarios'
import Vacinacao from './pages/Vacinacao'
import DashboardLayout from './layouts/DashboardLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
  path="/agenda"
  element={
    <DashboardLayout>
      <Agenda />
    </DashboardLayout>
  }
/>

<Route
  path="/animais"
  element={
    <DashboardLayout>
      <Animais />
    </DashboardLayout>
  }
/>

<Route
  path="/tutores"
  element={
    <DashboardLayout>
      <Tutores />
    </DashboardLayout>
  }
/>

<Route
  path="/prontuarios"
  element={
    <DashboardLayout>
      <Prontuarios />
    </DashboardLayout>
  }
/>

<Route
  path="/vacinacao"
  element={
    <DashboardLayout>
      <Vacinacao />
    </DashboardLayout>
  }
/>
      </Routes>
    </BrowserRouter>
  )
}

export default App