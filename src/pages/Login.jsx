import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Spinner from '../components/Spinner'

export default function Login() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setBusy(true)
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName.trim() || email.split('@')[0] } },
        })
        if (error) throw error
        // If email confirmation is enabled, there is no session yet.
        if (!data.session) {
          setInfo('Account created. Check your email to confirm, then sign in.')
          setMode('signin')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-court-600 text-3xl">
          🎾
        </div>
        <h1 className="text-2xl font-extrabold text-court-800">Padel Handicap</h1>
        <p className="mt-1 text-gray-500">Track matches. Watch your handicap drop.</p>
      </div>

      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4 p-6">
        <div className="flex rounded-xl bg-gray-100 p-1 text-sm font-semibold">
          {['signin', 'signup'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setError('')
                setInfo('')
              }}
              className={`flex-1 rounded-lg py-2 transition ${
                mode === m ? 'bg-white text-court-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              {m === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {mode === 'signup' && (
          <div>
            <label className="label">Display name</label>
            <input
              className="input mt-1"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How friends will see you"
              autoComplete="name"
            />
          </div>
        )}

        <div>
          <label className="label">Email</label>
          <input
            className="input mt-1"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            className="input mt-1"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        {info && <p className="text-sm font-medium text-court-700">{info}</p>}

        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? <Spinner className="h-5 w-5 border-white/40 border-t-white" /> : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>
    </div>
  )
}
