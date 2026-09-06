import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import logo from '../assets/gps.png'

const NAV = [
  {
    to: '/app/dashboard',
    label: 'Dashboard',
    icon: (
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    ),
  },
  {
    to: '/app/tutores',
    label: 'Tutores',
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    to: '/app/animais',
    label: 'Animais',
    icon: (
      <path d="M10 5.172C10 3.443 8.557 2 6.828 2c-1.81 0-2.828 1.51-2.828 3.172 0 1.112.5 2.16 1.328 2.828M14 5.172C14 3.443 15.443 2 17.172 2c1.81 0 2.828 1.51 2.828 3.172 0 1.112-.5 2.16-1.328 2.828M12 19c-3.866 0-7-2.686-7-6 0-1.724.671-3.289 1.757-4.457C7.703 7.44 9.774 7 12 7s4.297.44 5.243 1.543C18.329 9.71 19 11.276 19 13c0 3.314-3.134 6-7 6zm-2-6h4m-2-2v4" />
    ),
  },
  {
    to: '/app/agenda',
    label: 'Agenda',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    to: '/app/prontuario',
    label: 'Prontuário',
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    ),
  },
  {
    to: '/app/vacinacao',
    label: 'Vacinação',
    icon: (
      <>
        <path d="M14.5 2.5c0 1.5-1.5 3-1.5 3H9s-1.5-1.5-1.5-3a3 3 0 0 1 6 0z" />
        <path d="M9 5v14" />
        <path d="M15 5v14" />
        <line x1="6" y1="12" x2="18" y2="12" />
      </>
    ),
  },
]

function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-5">
      <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 overflow-hidden">
        <img
          src={logo}
          alt="Logo UniVet"
          className="w-5 h-5 object-contain"
        />
      </div>

      <span className="text-white font-semibold text-base">
        UniVet
      </span>
    </div>
  )
}

function DashboardLayout() {
  const navigate = useNavigate()

  return (
    <div
      className="flex h-screen bg-[#F7F5F0] overflow-hidden"
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      {/* Sidebar */}
      <aside className="w-56 bg-[#0C4A45] flex flex-col shrink-0">

        <Logo />

        <div className="px-3 mb-2">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2 mb-1">
            Menu
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="w-5 h-5 shrink-0"
                  >
                    {item.icon}
                  </svg>

                  {item.label}

                  {item.label === 'Vacinação' && (
                    <span
                      className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      3
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Usuário */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors">
            
            <div className="w-8 h-8 rounded-full bg-[#7DD3C8] flex items-center justify-center text-[#0C4A45] font-bold text-sm shrink-0">
              A
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">
                Dra. Ana Souza
              </p>

              <p className="text-white/40 text-[10px] truncate">
                CRMV-SP 12345
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              title="Sair"
              className="text-white/40 hover:text-white transition-colors"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-4 h-4"
              >
                <path
                  d="M13 10H3m0 0l3-3m-3 3l3 3M8 5V4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <header className="h-14 bg-white border-b border-[#EAE8E3] flex items-center px-6 shrink-0">
          <span className="font-semibold text-[#0C1A1A]">
            UniVet
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default DashboardLayout