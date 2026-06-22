// Columns to pull for a match plus its full player roster (with profiles).
export const MATCH_SELECT =
  'id, played_at, sets, team_a_games, team_b_games, winner, status, created_by, notes, ' +
  'match_players(*, profile:profiles(id, display_name, handicap))'
