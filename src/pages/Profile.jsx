import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import MatchCard from '../components/MatchCard'
import Spinner from '../components/Spinner'
import { MATCH_SELECT } from '../lib/queries'

export default function Profile() {
  const { profile, user, signOut, refreshProfile } = useAuth()
  const [name, setName] = useState(profile?.display_name || '')
  const [saving, setSaving] = useState(false)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setName(profile?.display_name || '')
  }, [profile?.display_name])

  useEffect(() => {
    if (!profile?.id) return
    let active = true
    supabase
      .from('match_players')
      .select(`match_id, matches!inner(${MATCH_SELECT})`)
      .eq('profile_id', profile.id)
      .eq('matches.status', 'confirmed')
      .order('played_at', { foreignTable: 'matches', ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (!active) return
        setMatches((data || []).map((row) => row.matches).filter(Boolean))
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [profile?.id])

  async function saveName() {
    if (!name.trim() || name.trim() === profile?.display_name) return
    setSaving(true)
    await supabase.from('profiles').update({ display_name: name.trim() }).eq('id', profile.id)
    await refreshProfile()
    setSaving(false)
  }

  const wins = matches.filter((m) => {
    const me = m.match_players.find((p) => p.profile_id === profile?.id)
    return me && m.winner === me.team
  }).length

  return (
    <div className="space-y-5">
      <div className="card overflow-hidden">
        <div className="relative bg-gradient-to-br from-court-800 to-court-950 px-5 pb-12 pt-6">
          <div className="absolute inset-0 court-lines opacity-40" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ball font-display text-2xl font-bold text-ink shadow-ball">
              {(profile?.display_name || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-extrabold text-white">
                {profile?.display_name}
              </p>
              <p className="truncate text-sm text-court-100/70">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="-mt-8 grid grid-cols-3 gap-2 px-4 text-center">
          <Stat label="Handicap" value={Number(profile?.handicap ?? 0).toFixed(1)} />
          <Stat label="Played" value={profile?.matches_played ?? 0} />
          <Stat label="Wins" value={loading ? '—' : wins} />
        </div>

        <div className="p-5 pt-4">
          <label className="label">Display name</label>
          <div className="flex gap-2">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn-primary px-5" onClick={saveName} disabled={saving}>
              {saving ? '…' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="section-title">Your match history</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : matches.length === 0 ? (
          <p className="card p-6 text-center text-gray-500">No matches yet.</p>
        ) : (
          <div className="space-y-3">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} highlightProfileId={profile?.id} />
            ))}
          </div>
        )}
      </div>

      <button className="btn-ghost w-full" onClick={signOut}>
        Sign out
      </button>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white py-3 shadow-soft">
      <p className="stat-num text-court-700">{value}</p>
      <p className="text-xs font-medium text-ink-400">{label}</p>
    </div>
  )
}
