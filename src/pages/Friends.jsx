import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'
import { useNotifications } from '../notifications/NotificationsContext'
import Spinner from '../components/Spinner'

const FRIENDSHIP_SELECT =
  '*, requester:profiles!friendships_requester_id_fkey(id, display_name, handicap), ' +
  'addressee:profiles!friendships_addressee_id_fkey(id, display_name, handicap)'

function Avatar({ name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-court-100 font-bold text-court-700">
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  )
}

export default function Friends() {
  const { profile } = useAuth()
  const { refresh: refreshNotifs } = useNotifications()
  const [friendships, setFriendships] = useState([])
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(null)

  const load = useCallback(async () => {
    if (!profile?.id) return
    const [fRes, pRes] = await Promise.all([
      supabase.from('friendships').select(FRIENDSHIP_SELECT),
      supabase.from('profiles').select('id, display_name, handicap').neq('id', profile.id),
    ])
    setFriendships(fRes.data || [])
    setPlayers(pRes.data || [])
    setLoading(false)
  }, [profile?.id])

  useEffect(() => {
    load()
  }, [load])

  const me = profile?.id
  const incoming = friendships.filter((f) => f.status === 'pending' && f.addressee_id === me)
  const outgoing = friendships.filter((f) => f.status === 'pending' && f.requester_id === me)
  const friends = friendships.filter((f) => f.status === 'accepted')

  // ids already involved in any friendship (to hide from search)
  const involved = useMemo(() => {
    const s = new Set()
    friendships.forEach((f) => {
      s.add(f.requester_id === me ? f.addressee_id : f.requester_id)
    })
    return s
  }, [friendships, me])

  const searchResults = players.filter(
    (p) =>
      !involved.has(p.id) &&
      p.display_name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  function other(f) {
    return f.requester_id === me ? f.addressee : f.requester
  }

  async function sendRequest(id) {
    setBusy(id)
    const { error } = await supabase.rpc('send_friend_request', { p_addressee: id })
    if (error) alert(error.message)
    await Promise.all([load(), refreshNotifs()])
    setBusy(null)
  }

  async function respondRequest(id, accept) {
    setBusy(id)
    const { error } = await supabase.rpc('respond_friend_request', { p_id: id, p_accept: accept })
    if (error) alert(error.message)
    await Promise.all([load(), refreshNotifs()])
    setBusy(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Friends</h1>
        <p className="text-sm text-ink-400">Build your circle and challenge them.</p>
      </div>

      {/* Incoming requests */}
      {incoming.length > 0 && (
        <section>
          <h2 className="section-title !text-court-700">● Friend requests</h2>
          <div className="card divide-y divide-gray-100">
            {incoming.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-3">
                <Avatar name={other(f).display_name} />
                <span className="flex-1 truncate font-semibold text-gray-800">
                  {other(f).display_name}
                </span>
                <button
                  className="btn-primary px-3 py-1.5 text-sm"
                  disabled={busy === f.id}
                  onClick={() => respondRequest(f.id, true)}
                >
                  Accept
                </button>
                <button
                  className="btn-ghost px-3 py-1.5 text-sm !text-red-600 !border-red-200"
                  disabled={busy === f.id}
                  onClick={() => respondRequest(f.id, false)}
                >
                  Decline
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Add friends */}
      <section>
        <h2 className="section-title">Add a friend</h2>
        <input
          className="input"
          placeholder="Search players by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search.trim() && (
          <div className="card mt-2 divide-y divide-gray-100">
            {searchResults.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-400">No players found.</p>
            ) : (
              searchResults.slice(0, 12).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3">
                  <Avatar name={p.display_name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-800">{p.display_name}</p>
                    <p className="text-xs text-gray-400">hcp {Number(p.handicap).toFixed(1)}</p>
                  </div>
                  <button
                    className="btn-primary px-3 py-1.5 text-sm"
                    disabled={busy === p.id}
                    onClick={() => sendRequest(p.id)}
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Your friends */}
      <section>
        <h2 className="section-title">Your friends ({friends.length})</h2>
        {friends.length === 0 ? (
          <p className="card p-6 text-center text-gray-500">
            No friends yet — search above to add some.
          </p>
        ) : (
          <div className="card divide-y divide-gray-100">
            {friends.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-3">
                <Avatar name={other(f).display_name} />
                <span className="flex-1 truncate font-semibold text-gray-800">
                  {other(f).display_name}
                </span>
                <span className="text-sm font-bold text-court-700">
                  {Number(other(f).handicap).toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sent requests */}
      {outgoing.length > 0 && (
        <section>
          <h2 className="section-title">Sent requests</h2>
          <div className="card divide-y divide-gray-100">
            {outgoing.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-3">
                <Avatar name={other(f).display_name} />
                <span className="flex-1 truncate font-semibold text-gray-800">
                  {other(f).display_name}
                </span>
                <span className="text-xs font-medium text-gray-400">Pending</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
