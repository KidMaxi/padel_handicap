import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import Spinner from '../components/Spinner'

const RANK_STYLES = {
  0: 'bg-gradient-to-br from-ball-bright to-ball-deep text-ink shadow-ball',
  1: 'bg-gradient-to-br from-slate-200 to-slate-400 text-ink',
  2: 'bg-gradient-to-br from-amber-300 to-amber-600 text-white',
}

export default function Players() {
  const { profile } = useAuth()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase
      .from('profiles')
      .select('*')
      .order('handicap', { ascending: true })
      .then(({ data }) => {
        if (active) {
          setPlayers(data || [])
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Leaderboard</h1>
        <p className="text-sm text-ink-400">Ranked by handicap — lowest is sharpest.</p>
      </div>

      <div className="card divide-y divide-black/[0.04] p-1.5">
        {players.map((p, i) => {
          const me = p.id === profile?.id
          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 ${
                me ? 'bg-court-50' : ''
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                  RANK_STYLES[i] || 'bg-gray-100 text-ink-400'
                }`}
              >
                {i + 1}
              </span>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-court-100 font-display font-bold text-court-700">
                {(p.display_name || '?').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">
                  {p.display_name}
                  {me && <span className="ml-1 text-court-600">· you</span>}
                </p>
                <p className="text-xs text-ink-400">{p.matches_played} matches</p>
              </div>
              <span className="font-display text-xl font-extrabold tabular-nums text-court-700">
                {Number(p.handicap).toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
