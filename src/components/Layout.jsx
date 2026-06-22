import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/players', label: 'Players', icon: '🏆' },
  { to: '/me', label: 'Me', icon: '👤' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { profile } = useAuth()

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-court-700 px-4 py-3 text-white shadow">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎾</span>
          <span className="font-bold tracking-tight">Padel Handicap</span>
        </div>
        {profile && (
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-sm font-semibold">
            hcp {Number(profile.handicap).toFixed(1)}
          </span>
        )}
      </header>

      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>

      <button
        onClick={() => navigate('/new')}
        className="fixed bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-full bg-court-600 px-6 py-3 font-bold text-white shadow-lg shadow-court-600/30 active:scale-95"
      >
        + New match
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-lg justify-around border-t border-black/5 bg-white/95 backdrop-blur">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                isActive ? 'text-court-700' : 'text-gray-400'
              }`
            }
          >
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
