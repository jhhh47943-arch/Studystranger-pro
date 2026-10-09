import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { USER } from '../data.js'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const loc = useLocation()

  function submit(e) {
    e.preventDefault()
    if (username.trim() === USER.username && password === USER.password) {
      sessionStorage.setItem('ss-auth', USER.username)
      nav(loc.state?.from || '/app', { replace: true })
    } else {
      setErr('Username or password does not match this Study Stranger account.')
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-visual">
        <Link to="/" className="brand">
          <img src="/logo.svg" alt="" />
          Study Stranger
        </Link>
        <div>
          <p className="kicker">Welcome back</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 500, lineHeight: 1.05 }}>
            Learning that <em>adapts to you</em>
          </h2>
          <p className="lede" style={{ color: 'var(--ink-soft)' }}>
            Same tools you already use — mock tests, voice mentors, flashcards, notes — in a calmer StudyFetch-like studio.
          </p>
        </div>
        <div className="badge-pill">WBCHSE · Sem 3 · 4 mentors online</div>
      </aside>
      <main className="auth-form">
        <form className="form-card" onSubmit={submit}>
          <p className="kicker">Log in</p>
          <h1>Open your study hub</h1>
          <p className="muted">Use your Study Stranger username to enter the tools.</p>
          <label className="field">
            Username
            <input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" />
          </label>
          <label className="field">
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
          </label>
          {err ? <div className="err">{err}</div> : null}
          <button className="btn btn-dark" style={{ width: '100%', marginTop: 16 }} type="submit">Continue</button>
          <p className="muted" style={{ marginTop: 16, fontSize: 13 }}>
            <Link to="/">Back to the landing page</Link>
          </p>
        </form>
      </main>
    </div>
  )
}
