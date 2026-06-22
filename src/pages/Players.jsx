import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import Spinner from '../components/Spinner'

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
    <div>
      <h1 className="mb-3 px-1 text-xl font-extrabold text-court-800">Leaderboard</h1>
      <div className="card divide-y divide-gray-100">
        {players.map((p, i) => {
          const me = p.id === profile?.id
          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-4 py-3 ${me ? 'bg-court-50' : ''}`}
            >
              <span className="w-6 text-center text-sm font-bold text-gray-400">{i + 1}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-court-100 font-bold text-court-700">
                {(p.display_name || '?').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-800">
                  {p.display_name} {me && <span className="text-court-600">(you)</span>}
                </p>
                <p className="text-xs text-gray-400">{p.matches_played} matches</p>
              </div>
              <span className="text-lg font-extrabold tabular-nums text-court-700">
                {Number(p.handicap).toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
