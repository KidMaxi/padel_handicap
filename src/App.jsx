import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { NotificationsProvider } from './notifications/NotificationsContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewMatch from './pages/NewMatch'
import Players from './pages/Players'
import Friends from './pages/Friends'
import Profile from './pages/Profile'
import Spinner from './components/Spinner'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!session) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <NotificationsProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewMatch />} />
          <Route path="/players" element={<Players />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/me" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </NotificationsProvider>
  )
}
