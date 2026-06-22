import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { useNotifications } from '../notifications/NotificationsContext'
import { MATCH_SELECT } from '../lib/queries'
import MatchCard from '../components/MatchCard'
import Spinner from '../components/Spinner'
import { formatDelta } from '../lib/handicap'

function pendingNames(match, meId) {
  return (match.match_players || [])
    .filter((p) => p.profile_id && p.confirmation === 'pending')
    .map((p) => (p.profile_id === meId ? 'you' : p.profile?.display_name || 'someone'))
}

export default function Dashboard() {
  const { profile, refreshProfile } = useAuth()
  const { refresh: refreshNotifs } = useNotifications()
  const [confirmed, setConfirmed] = useState([])
  const [incoming, setIncoming] = useState([])
  const [waiting, setWaiting] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    if (!profile?.id) return
    const me = profile.id
    const [confRes, inRes, waitRes] = await Promise.all([
      supabase
        .from('matches')
        .select(MATCH_SELECT)
        .eq('status', 'confirmed')
        .order('played_at', { ascending: false })
        .limit(25),
      supabase
        .from('match_players')
        .select(`confirmation, matches!inner(${MATCH_SELECT})`)
        .eq('profile_id', me)
        .eq('confirmation', 'pending')
        .eq('matches.status', 'pending'),
      supabase
        .from('match_players')
        .select(`confirmation, matches!inner(${MATCH_SELECT})`)
        .eq('profile_id', me)
        .eq('confirmation', 'accepted')
        .eq('matches.status', 'pending'),
    ])
    setConfirmed(confRes.data || [])
    setIncoming((inRes.data || []).map((r) => r.matches).filter(Boolean))
    setWaiting((waitRes.data || []).map((r) => r.matches).filter(Boolean))
    setLoading(false)
  }, [profile?.id])

  useEffect(() => {
    load()
  }, [load])

  async function respond(matchId, accept) {
    setBusyId(matchId)
    const { error } = await supabase.rpc('respond_to_match', {
      p_match_id: matchId,
      p_accept: accept,
    })
    if (error) {
      alert(error.message)
    } else {
      await Promise.all([load(), refreshProfile(), refreshNotifs()])
    }
    setBusyId(null)
  }

  const lastDelta = (() => {
    const m = confirmed.find((x) =>
      (x.match_players || []).some((p) => p.profile_id === profile?.id),
    )
    const me = m?.match_players.find((p) => p.profile_id === profile?.id)
    return me?.handicap_delta ?? null
  })()

  return (
    <div className="space-y-5">
      {/* Handicap card */}
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

      {/* Needs your confirmation */}
      {incoming.length > 0 && (
        <div>
          <h2 className="mb-2 px-1 text-sm font-bold uppercase tracking-wide text-amber-600">
            Needs your confirmation
          </h2>
          <div className="space-y-3">
            {incoming.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                highlightProfileId={profile?.id}
                statusLabel="Confirm this result?"
                statusTone="warn"
                footer={
                  <div className="flex gap-2">
                    <button
                      className="btn-primary flex-1"
                      disabled={busyId === m.id}
                      onClick={() => respond(m.id, true)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-ghost flex-1 !text-red-600 !border-red-200 hover:!bg-red-50"
                      disabled={busyId === m.id}
                      onClick={() => respond(m.id, false)}
                    >
                      Decline
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Waiting on others */}
      {waiting.length > 0 && (
        <div>
          <h2 className="mb-2 px-1 text-sm font-bold uppercase tracking-wide text-gray-400">
            Waiting for confirmation
          </h2>
          <div className="space-y-3">
            {waiting.map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                highlightProfileId={profile?.id}
                statusLabel={`Waiting on ${pendingNames(m, profile?.id).join(', ')}`}
                statusTone="muted"
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent confirmed matches */}
      <div>
        <h2 className="mb-2 px-1 text-sm font-bold uppercase tracking-wide text-gray-400">
          Recent matches
        </h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : confirmed.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">
            <p className="text-3xl">🎾</p>
            <p className="mt-2 font-medium">No matches yet</p>
            <p className="text-sm">Tap “New match” to record your first game.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {confirmed.map((m) => (
              <MatchCard key={m.id} match={m} highlightProfileId={profile?.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
