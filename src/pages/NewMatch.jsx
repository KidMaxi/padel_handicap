import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import Spinner from '../components/Spinner'
import {
  DEFAULT_HANDICAP,
  expectedShareA,
  previewDelta,
  formatDelta,
  formatHandicap,
} from '../lib/handicap'

const GUEST = '__guest__'
const newSlot = () => ({ key: Math.random().toString(36).slice(2), profileId: '', guestName: '' })

export default function NewMatch() {
  const navigate = useNavigate()
  const { profile, refreshProfile } = useAuth()

  const [allPlayers, setAllPlayers] = useState([])
  const [teamA, setTeamA] = useState([{ ...newSlot(), profileId: profile?.id || '' }])
  const [teamB, setTeamB] = useState([newSlot()])
  const [sets, setSets] = useState([{ a: '', b: '' }])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, display_name, handicap')
      .order('display_name')
      .then(({ data }) => setAllPlayers(data || []))
  }, [])

  const playerById = useMemo(() => {
    const m = {}
    allPlayers.forEach((p) => (m[p.id] = p))
    return m
  }, [allPlayers])

  function slotHandicap(slot) {
    if (slot.profileId && playerById[slot.profileId]) return Number(playerById[slot.profileId].handicap)
    return DEFAULT_HANDICAP // guests / unrated
  }

  function teamHandicap(team) {
    const filled = team.filter((s) => s.profileId || s.guestName.trim())
    if (filled.length === 0) return DEFAULT_HANDICAP
    return filled.reduce((sum, s) => sum + slotHandicap(s), 0) / filled.length
  }

  const teamAHcp = teamHandicap(teamA)
  const teamBHcp = teamHandicap(teamB)

  const gamesA = sets.reduce((n, s) => n + (parseInt(s.a, 10) || 0), 0)
  const gamesB = sets.reduce((n, s) => n + (parseInt(s.b, 10) || 0), 0)

  // Live preview for the signed-in user (if they're playing).
  const myTeam = teamA.some((s) => s.profileId === profile?.id)
    ? 'A'
    : teamB.some((s) => s.profileId === profile?.id)
      ? 'B'
      : null

  const preview =
    myTeam && gamesA + gamesB > 0
      ? previewDelta({
          isTeamA: myTeam === 'A',
          teamAHandicap: teamAHcp,
          teamBHandicap: teamBHcp,
          gamesA,
          gamesB,
          matchesPlayed: profile?.matches_played ?? 0,
        })
      : null

  const winChanceA = Math.round(expectedShareA(teamAHcp, teamBHcp) * 100)

  function updateTeam(team, setTeam, idx, patch) {
    setTeam(team.map((s, i) => (i === idx ? { ...s, ...patch } : s)))
  }

  function PlayerPicker({ team, setTeam, slot, idx, canRemove }) {
    const mode = slot.profileId === GUEST || (!slot.profileId && slot.guestName) ? GUEST : 'profile'
    // chosen profile ids elsewhere, to avoid picking the same person twice
    const taken = new Set(
      [...teamA, ...teamB]
        .filter((s) => s !== slot && s.profileId && s.profileId !== GUEST)
        .map((s) => s.profileId),
    )
    return (
      <div className="flex items-center gap-2">
        <select
          className="input"
          value={slot.profileId === GUEST ? GUEST : slot.profileId}
          onChange={(e) => {
            const v = e.target.value
            if (v === GUEST) updateTeam(team, setTeam, idx, { profileId: GUEST, guestName: '' })
            else updateTeam(team, setTeam, idx, { profileId: v, guestName: '' })
          }}
        >
          <option value="">— select player —</option>
          {allPlayers.map((p) => (
            <option key={p.id} value={p.id} disabled={taken.has(p.id)}>
              {p.display_name} ({formatHandicap(p.handicap)})
            </option>
          ))}
          <option value={GUEST}>+ Guest (not registered)</option>
        </select>
        {canRemove && (
          <button
            type="button"
            className="shrink-0 rounded-lg px-2 py-2 text-gray-400 hover:bg-gray-100"
            onClick={() => setTeam(team.filter((_, i) => i !== idx))}
            aria-label="Remove player"
          >
            ✕
          </button>
        )}
        {mode === GUEST && (
          <input
            className="input"
            placeholder="Guest name"
            value={slot.guestName}
            onChange={(e) => updateTeam(team, setTeam, idx, { guestName: e.target.value })}
          />
        )}
      </div>
    )
  }

  function TeamEditor({ title, team, setTeam, hcp, color }) {
    return (
      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`font-bold ${color}`}>{title}</h3>
          <span className="text-xs font-medium text-gray-400">team hcp {formatHandicap(hcp)}</span>
        </div>
        <div className="space-y-2">
          {team.map((slot, idx) => (
            <PlayerPicker
              key={slot.key}
              team={team}
              setTeam={setTeam}
              slot={slot}
              idx={idx}
              canRemove={team.length > 1}
            />
          ))}
          {team.length < 2 && (
            <button
              type="button"
              className="text-sm font-semibold text-court-600"
              onClick={() => setTeam([...team, newSlot()])}
            >
              + Add partner
            </button>
          )}
        </div>
      </div>
    )
  }

  async function submit() {
    setError('')

    const collect = (team, label) =>
      team
        .filter((s) => (s.profileId && s.profileId !== GUEST) || s.guestName.trim())
        .map((s) =>
          s.profileId && s.profileId !== GUEST
            ? { profile_id: s.profileId, team: label }
            : { guest_name: s.guestName.trim(), team: label },
        )

    const players = [...collect(teamA, 'A'), ...collect(teamB, 'B')]
    const aCount = players.filter((p) => p.team === 'A').length
    const bCount = players.filter((p) => p.team === 'B').length

    if (aCount === 0 || bCount === 0) {
      setError('Each team needs at least one player.')
      return
    }
    if (aCount !== bCount) {
      setError('Teams must be the same size (1v1 or 2v2).')
      return
    }

    const cleanSets = sets
      .map((s) => ({ a: parseInt(s.a, 10), b: parseInt(s.b, 10) }))
      .filter((s) => Number.isFinite(s.a) && Number.isFinite(s.b))

    if (cleanSets.length === 0) {
      setError('Enter at least one set score.')
      return
    }
    if (gamesA === gamesB) {
      setError('Total games can’t be tied — there must be a winner.')
      return
    }

    setBusy(true)
    const { error: rpcError } = await supabase.rpc('record_match', {
      p_sets: cleanSets,
      p_players: players,
    })
    if (rpcError) {
      setError(rpcError.message)
      setBusy(false)
      return
    }
    await refreshProfile()
    navigate('/')
  }

  return (
    <div className="space-y-4">
      <h1 className="px-1 text-xl font-extrabold text-court-800">New match</h1>

      <TeamEditor title="Team A" team={teamA} setTeam={setTeamA} hcp={teamAHcp} color="text-court-700" />

      <div className="text-center text-sm font-semibold text-gray-400">
        win chance {winChanceA}% · {100 - winChanceA}%
      </div>

      <TeamEditor title="Team B" team={teamB} setTeam={setTeamB} hcp={teamBHcp} color="text-blue-700" />

      <div className="card p-4">
        <h3 className="mb-3 font-bold text-gray-700">Scores</h3>
        <div className="space-y-2">
          {sets.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-12 text-sm font-medium text-gray-400">Set {i + 1}</span>
              <input
                className="input text-center"
                inputMode="numeric"
                placeholder="A"
                value={s.a}
                onChange={(e) =>
                  setSets(sets.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))
                }
              />
              <span className="text-gray-300">–</span>
              <input
                className="input text-center"
                inputMode="numeric"
                placeholder="B"
                value={s.b}
                onChange={(e) =>
                  setSets(sets.map((x, j) => (j === i ? { ...x, b: e.target.value } : x)))
                }
              />
              {sets.length > 1 && (
                <button
                  type="button"
                  className="rounded-lg px-2 py-2 text-gray-400 hover:bg-gray-100"
                  onClick={() => setSets(sets.filter((_, j) => j !== i))}
                  aria-label="Remove set"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {sets.length < 5 && (
            <button
              type="button"
              className="text-sm font-semibold text-court-600"
              onClick={() => setSets([...sets, { a: '', b: '' }])}
            >
              + Add set
            </button>
          )}
        </div>
      </div>

      {preview != null && (
        <div className="card flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-gray-500">Your handicap after this match</p>
            <p className="text-lg font-extrabold text-court-800">
              {formatHandicap(profile.handicap)} →{' '}
              {formatHandicap(Math.max(0, Math.min(50, Number(profile.handicap) + preview)))}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              preview < 0 ? 'bg-court-100 text-court-700' : 'bg-red-100 text-red-600'
            }`}
          >
            {formatDelta(preview)}
          </span>
        </div>
      )}

      {error && <p className="px-1 text-sm font-medium text-red-600">{error}</p>}

      <button className="btn-primary w-full text-base" onClick={submit} disabled={busy}>
        {busy ? <Spinner className="h-5 w-5 border-white/40 border-t-white" /> : 'Save match'}
      </button>
    </div>
  )
}
