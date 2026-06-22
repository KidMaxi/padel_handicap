import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import MatchCard from '../components/MatchCard'
import Spinner from '../components/Spinner'
import { formatDelta } from '../lib/handicap'

const MATCH_SELECT =
  '*, match_players(*, profile:profiles(id, display_name, handicap))'

export default function Dashboard() {
  const { profile } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase
      .from('matches')
      .select(MATCH_SELECT)
      .order('played_at', { ascending: false })
      .limit(25)
      .then(({ data }) => {
        if (active) {
          setMatches(data || [])
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const myMatches = matches.filter((m) =>
    (m.match_players || []).some((p) => p.profile_id === profile?.id),
  )
  const lastDelta = (() => {
    const m = myMatches[0]
    if (!m) return null
    const me = m.match_players.find((p) => p.profile_id === profile?.id)
    return me?.handicap_delta ?? null
  })()

  return (
    <div className="space-y-5">
      <div className="card overflow-hidden">
        <div className="bg-court-700 px-5 py-6 text-white">
          <p className="text-sm text-court-100">Your handicap</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-extrabold tabular-nums">
              {profile ? Number(profile.handicap).toFixed(1) : '—'}
            </span>
            {lastDelta != null && (
              <span
                className={`mb-2 rounded-full px-2 py-0.5 text-sm font-bold ${
                  Number(lastDelta) < 0 ? 'bg-white/20' : 'bg-red-500/40'
                }`}
              >
                {formatDelta(lastDelta)} last match
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-court-100">
            {profile?.matches_played || 0} matches played · lower is better
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-2 px-1 text-sm font-bold uppercase tracking-wide text-gray-400">
          Recent matches
        </h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : matches.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">
            <p className="text-3xl">🎾</p>
            <p className="mt-2 font-medium">No matches yet</p>
            <p className="text-sm">Tap “New match” to record your first game.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} highlightProfileId={profile?.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
