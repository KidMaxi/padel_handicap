import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Spinner from '../components/Spinner'
import CourtBackdrop from '../components/CourtBackdrop'

function Ball({ className = '' }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-ball/30 blur-2xl" />
      <div className="relative h-full w-full rounded-full bg-gradient-to-br from-ball-bright to-ball-deep shadow-ball">
        <div className="absolute left-[18%] top-[20%] h-1/2 w-1/3 rounded-full bg-white/30 blur-md" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-ink/20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M50 2 C20 25 20 75 50 98" />
          <path d="M50 2 C80 25 80 75 50 98" />
        </svg>
      </div>
    </div>
  )
}

export default function Login() {
  const [mode, setMode] = useState('signin')
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
    <div className="relative min-h-full overflow-hidden bg-ink text-white">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-court-950 via-ink to-ink" />
      <div className="absolute inset-0 court-lines opacity-40" />
      <div className="absolute -left-24 top-1/4 h-[32rem] w-[32rem] rounded-full bg-court-500/20 blur-3xl animate-glow-pulse" />
      <CourtBackdrop className="absolute -right-16 -top-10 h-[42rem] w-auto text-court-300/10 rotate-6" />
      <Ball className="absolute right-8 top-24 h-20 w-20 animate-float sm:right-20 lg:right-1/4" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ball text-ink shadow-ball">
            <span className="text-lg">🎾</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Padel Club</span>
        </div>
        <span className="hidden text-sm font-medium text-white/60 sm:block">
          Members &amp; clubs · invite only
        </span>
      </header>

      {/* Hero + auth */}
      <main className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-6 lg:grid-cols-2 lg:gap-12 lg:pt-12">
        <section className="animate-fade-up">
          <span className="chip mb-5">
            <span className="h-2 w-2 rounded-full bg-ball" /> Premium padel platform
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Your padel game,
            <br />
            <span className="text-gradient">measured.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
            Track every match, settle scores with friends, and earn a golf-style handicap that
            rises and falls with how you play. No bragging — just verified results.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            <span className="chip">⛳ Golf-style handicap</span>
            <span className="chip">✓ Verified results</span>
            <span className="chip">👥 Play your friends</span>
          </div>

          <dl className="mt-9 grid max-w-sm grid-cols-3 gap-3 border-t border-white/10 pt-6">
            <div>
              <dt className="text-2xl font-bold text-ball">0–50</dt>
              <dd className="text-xs text-white/50">handicap scale</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-ball">2v2</dt>
              <dd className="text-xs text-white/50">&amp; 1v1 ready</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-ball">live</dt>
              <dd className="text-xs text-white/50">leaderboard</dd>
            </div>
          </dl>
        </section>

        {/* Auth glass card */}
        <section className="animate-fade-up [animation-delay:120ms]">
          <div className="glass-dark mx-auto w-full max-w-md p-7 sm:p-8">
            <div className="mb-6 flex rounded-2xl bg-white/5 p-1 text-sm font-semibold backdrop-blur">
              {[
                ['signin', 'Sign in'],
                ['signup', 'Create account'],
              ].map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m)
                    setError('')
                    setInfo('')
                  }}
                  className={`flex-1 rounded-xl py-2.5 transition ${
                    mode === m ? 'bg-ball text-ink shadow-ball' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="label !text-white/60">Display name</label>
                  <input
                    className="input-dark"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How friends will see you"
                    autoComplete="name"
                  />
                </div>
              )}
              <div>
                <label className="label !text-white/60">Email</label>
                <input
                  className="input-dark"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="label !text-white/60">Password</label>
                <input
                  className="input-dark"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
              </div>

              {error && <p className="text-sm font-medium text-red-300">{error}</p>}
              {info && <p className="text-sm font-medium text-ball">{info}</p>}

              <button type="submit" className="btn-ball w-full text-base" disabled={busy}>
                {busy ? (
                  <Spinner className="h-5 w-5 border-ink/30 border-t-ink" />
                ) : mode === 'signin' ? (
                  'Sign in'
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs text-white/40">
              By continuing you agree to play fair and confirm real scores.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
