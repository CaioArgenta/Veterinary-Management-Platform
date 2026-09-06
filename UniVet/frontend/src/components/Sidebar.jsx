import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside>
      <h2>🐾 UniVet</h2>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/agenda">Agenda</Link>
        <Link to="/animais">Animais</Link>
        <Link to="/tutores">Tutores</Link>
        <Link to="/prontuarios">Prontuários</Link>
        <Link to="/vacinacao">Vacinação</Link>
      </nav>
    </aside>
  )
}

export default Sidebar