import { formatDelta } from '../lib/handicap'

function playerName(p) {
  return p.profile?.display_name || p.guest_name || 'Unknown'
}

export default function MatchCard({ match, highlightProfileId }) {
  const players = match.match_players || []
  const teamA = players.filter((p) => p.team === 'A')
  const teamB = players.filter((p) => p.team === 'B')
  const date = new Date(match.played_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  const sets = Array.isArray(match.sets) ? match.sets : []

  // Render this team's actual per-set score.
  function setScore(p, idx) {
    const s = sets[idx]
    if (!s) return ''
    return p === 'A' ? s.a : s.b
  }

  function Team({ side, list }) {
    const won = match.winner === side
    return (
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {won && <span>🏆</span>}
          {list.map((p, i) => {
            const mine = highlightProfileId && p.profile_id === highlightProfileId
            return (
              <span
                key={i}
                className={`truncate text-sm ${mine ? 'font-bold text-court-700' : 'font-medium text-gray-700'}`}
              >
                {playerName(p)}
                {i < list.length - 1 ? ', ' : ''}
              </span>
            )
          })}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {sets.map((s, i) => (
            <span key={i} className="w-4 text-center text-sm font-bold tabular-nums text-gray-900">
              {setScore(side, i)}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // Show the current user's handicap change for this match, if present.
  const mine = players.find((p) => highlightProfileId && p.profile_id === highlightProfileId)

  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">{date}</span>
        {mine && mine.handicap_delta != null && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              Number(mine.handicap_delta) < 0
                ? 'bg-court-100 text-court-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            hcp {formatDelta(mine.handicap_delta)}
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        <Team side="A" list={teamA} />
        <div className="h-px bg-gray-100" />
        <Team side="B" list={teamB} />
      </div>
    </div>
  )
}
