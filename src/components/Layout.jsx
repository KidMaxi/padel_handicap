import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useNotifications } from '../notifications/NotificationsContext'
import { IconHome, IconTrophy, IconUsers, IconUser, IconPlus } from './icons'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { matchCount, friendCount } = useNotifications()

  const left = [
    { to: '/', label: 'Home', Icon: IconHome, badge: matchCount },
    { to: '/players', label: 'Ranks', Icon: IconTrophy, badge: 0 },
  ]
  const right = [
    { to: '/friends', label: 'Friends', Icon: IconUsers, badge: friendCount },
    { to: '/me', label: 'Profile', Icon: IconUser, badge: 0 },
  ]

  function Tab({ to, label, Icon, badge }) {
    return (
      <NavLink
        to={to}
        end={to === '/'}
        className={({ isActive }) =>
          `relative flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-semibold transition-colors ${
            isActive ? 'text-court-700' : 'text-ink-400 hover:text-ink-600'
          }`
        }
      >
        <Icon className="h-6 w-6" />
        {label}
        {badge > 0 && (
          <span className="absolute right-1/2 top-0 flex h-4 min-w-4 translate-x-3.5 items-center justify-center rounded-full bg-ball px-1 text-[10px] font-bold leading-none text-ink shadow-ball">
            {badge}
          </span>
        )}
      </NavLink>
    )
  }

  return (
    <div className="app-surface mx-auto flex min-h-full max-w-lg flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ball text-sm shadow-ball">
              🎾
            </span>
            <span className="font-display text-base font-bold tracking-tight text-ink">
              Padel Club
            </span>
          </button>
          {profile && (
            <div className="flex items-center gap-2 rounded-full border border-court-100 bg-court-50 py-1 pl-3 pr-1.5">
              <span className="text-xs font-semibold text-court-700">Handicap</span>
              <span className="flex h-7 items-center rounded-full bg-court-700 px-2.5 font-display text-sm font-bold text-white tabular-nums">
                {Number(profile.handicap).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-5">{children}</main>

      {/* Floating glass bottom nav with raised center action */}
      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-lg px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <div className="glass relative flex items-end justify-around gap-1 rounded-[1.75rem] border-white/70 bg-white/85 px-2 py-2.5">
          {left.map((t) => (
            <Tab key={t.to} {...t} />
          ))}

          <div className="flex flex-1 justify-center">
            <button
              onClick={() => navigate('/new')}
              aria-label="New match"
              className="-mt-7 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lift transition-transform active:scale-95"
              style={{ backgroundImage: 'linear-gradient(135deg,#18935d 0%,#0e4733 100%)' }}
            >
              <IconPlus className="h-7 w-7" />
            </button>
          </div>

          {right.map((t) => (
            <Tab key={t.to} {...t} />
          ))}
        </div>
      </nav>
    </div>
  )
}
