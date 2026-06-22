// Client-side mirror of the server handicap math, used only to PREVIEW the
// likely handicap change before a match is submitted. The authoritative
// calculation lives in the Postgres record_match() function.

export const DEFAULT_HANDICAP = 25
export const SCALE = 10 // handicap points per 10x odds shift

// Expected share of games for team A. Lower handicap = stronger.
export function expectedShareA(teamAHandicap, teamBHandicap) {
  return 1 / (1 + Math.pow(10, -((teamBHandicap - teamAHandicap) / SCALE)))
}

// Preview the delta a registered player would get.
export function previewDelta({ isTeamA, teamAHandicap, teamBHandicap, gamesA, gamesB, matchesPlayed }) {
  const total = gamesA + gamesB
  if (total === 0) return 0
  const expA = expectedShareA(teamAHandicap, teamBHandicap)
  const actualA = gamesA / total
  const actual = isTeamA ? actualA : 1 - actualA
  const expected = isTeamA ? expA : 1 - expA
  const k = matchesPlayed < 10 ? 8 : 4
  return -k * (actual - expected)
}

export function formatHandicap(h) {
  return Number(h).toFixed(1)
}

export function formatDelta(d) {
  const v = Number(d)
  const s = v.toFixed(1)
  return v > 0 ? `+${s}` : s
}
