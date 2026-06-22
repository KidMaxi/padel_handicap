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
      {/* Profile hero with integrated stats */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-ink shadow-lift">
        <div className="absolute inset-0 bg-gradient-to-br from-court-800 via-court-900 to-ink" />
        <div className="absolute inset-0 court-lines opacity-40" />
        <div className="absolute -right-8 top-4 h-32 w-32 rounded-full bg-ball/15 blur-3xl" />
        <div className="relative p-6">
          <div className="flex items-center gap-4">
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

          <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <Stat label="Handicap" value={Number(profile?.handicap ?? 0).toFixed(1)} accent />
            <Stat label="Played" value={profile?.matches_played ?? 0} />
            <Stat label="Wins" value={loading ? '—' : wins} />
          </div>
        </div>
      </div>

      {/* Edit name */}
      <div className="card p-5">
        <label className="label">Display name</label>
        <div className="flex gap-2">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn-primary px-5" onClick={saveName} disabled={saving}>
            {saving ? '…' : 'Save'}
          </button>
        </div>
      </div>

      <div>
        <h2 className="section-title">Your match history</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : matches.length === 0 ? (
          <p className="card p-6 text-center text-ink-400">No matches yet.</p>
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

function Stat({ label, value, accent }) {
  return (
    <div className="px-2 py-3.5 text-center">
      <p
        className={`font-display text-2xl font-extrabold tabular-nums ${
          accent ? 'text-ball' : 'text-white'
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-court-100/60">
        {label}
      </p>
    </div>
  )
}
