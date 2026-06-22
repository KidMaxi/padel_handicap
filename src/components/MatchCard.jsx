import { formatDelta } from '../lib/handicap'

function playerName(p) {
  return p.profile?.display_name || p.guest_name || 'Unknown'
}

export default function MatchCard({ match, highlightProfileId, statusLabel, statusTone, footer }) {
  const players = match.match_players || []
  const teamA = players.filter((p) => p.team === 'A')
  const teamB = players.filter((p) => p.team === 'B')
  const date = new Date(match.played_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  const sets = Array.isArray(match.sets) ? match.sets : []

  function setScore(side, idx) {
    const s = sets[idx]
    if (!s) return ''
    return side === 'A' ? s.a : s.b
  }

  function Team({ side, list }) {
    const won = match.winner === side
    return (
      <div
        className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-2 ${
          won ? 'bg-court-50' : ''
        }`}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className={`text-base ${won ? '' : 'opacity-0'}`}>🏆</span>
          {list.map((p, i) => {
            const mine = highlightProfileId && p.profile_id === highlightProfileId
            return (
              <span
                key={i}
                className={`truncate text-sm ${
                  mine ? 'font-bold text-court-700' : 'font-semibold text-ink-700'
                }`}
              >
                {playerName(p)}
                {i < list.length - 1 ? ', ' : ''}
              </span>
            )
          })}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {sets.map((s, i) => (
            <span
              key={i}
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold tabular-nums ${
                won ? 'bg-court-700 text-white' : 'bg-gray-100 text-ink-600'
              }`}
            >
              {setScore(side, i)}
            </span>
          ))}
        </div>
      </div>
    )
  }

  const mine = players.find((p) => highlightProfileId && p.profile_id === highlightProfileId)

  const toneClass =
    statusTone === 'warn'
      ? 'bg-amber-100 text-amber-700'
      : statusTone === 'muted'
        ? 'bg-gray-100 text-ink-400'
        : 'bg-court-100 text-court-700'

  return (
    <div className="card p-3.5 transition-shadow hover:shadow-lift">
      <div className="mb-1.5 flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{date}</span>
        {statusLabel ? (
          <span className={`pill ${toneClass}`}>{statusLabel}</span>
        ) : (
          mine &&
          mine.handicap_delta != null && (
            <span
              className={`pill ${
                Number(mine.handicap_delta) < 0
                  ? 'bg-court-100 text-court-700'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              hcp {formatDelta(mine.handicap_delta)}
            </span>
          )
        )}
      </div>
      <div className="space-y-0.5">
        <Team side="A" list={teamA} />
        <Team side="B" list={teamB} />
      </div>
      {footer && <div className="mt-3 border-t border-black/5 pt-3">{footer}</div>}
    </div>
  )
}
