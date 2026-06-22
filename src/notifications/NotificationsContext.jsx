import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthContext'

const NotificationsContext = createContext(null)

// Tracks how many things are waiting on the current user:
// match confirmations they need to answer + incoming friend requests.
export function NotificationsProvider({ children }) {
  const { profile } = useAuth()
  const [matchCount, setMatchCount] = useState(0)
  const [friendCount, setFriendCount] = useState(0)

  const refresh = useCallback(async () => {
    if (!profile?.id) {
      setMatchCount(0)
      setFriendCount(0)
      return
    }
    const [matches, friends] = await Promise.all([
      supabase
        .from('match_players')
        .select('id, matches!inner(status)', { count: 'exact', head: true })
        .eq('profile_id', profile.id)
        .eq('confirmation', 'pending')
        .eq('matches.status', 'pending'),
      supabase
        .from('friendships')
        .select('id', { count: 'exact', head: true })
        .eq('addressee_id', profile.id)
        .eq('status', 'pending'),
    ])
    setMatchCount(matches.count || 0)
    setFriendCount(friends.count || 0)
  }, [profile?.id])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <NotificationsContext.Provider value={{ matchCount, friendCount, refresh }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}
