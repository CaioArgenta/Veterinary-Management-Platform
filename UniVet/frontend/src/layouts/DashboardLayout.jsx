import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />

      <div>
        <Header />

        <main>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout