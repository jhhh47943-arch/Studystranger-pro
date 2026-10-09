import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { TOOLS, USER } from '../data.js'
import Dashboard from './Dashboard.jsx'
import * as T from './Tools.jsx'

const LINKS = [
  { to: '/app', label: 'Home', end: true },
  { to: '/app/mock', label: 'Mock Test' },
  { to: '/app/doubt', label: 'Doubt Solver' },
  { to: '/app/flashcards', label: 'Flashcards' },
  { to: '/app/notes', label: 'Notes' },
  { to: '/app/mentors', label: 'Mentors' },
  { to: '/app/syllabus', label: 'Roadmap' }
]

export default function AppShell() {
  const [open, setOpen] = useState(false)
  const nav = useNavigate()

  function logout() {
    sessionStorage.removeItem('ss-auth')
    nav('/')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand" style={{ marginBottom: 22 }}>
          <img src="/logo.svg" alt="" />
          Study Stranger
        </div>
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
        <div style={{ height: 12 }} />
        <p className="muted" style={{ fontSize: 12, padding: '8px 12px' }}>ALL TOOLS</p>
        {TOOLS.filter((t) => !['/app/mock', '/app/doubt', '/app/flashcards', '/app/notes', '/app/mentors', '/app/syllabus'].includes(t.to)).map((t) => (
          <NavLink key={t.id} to={t.to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`} onClick={() => setOpen(false)}>
            {t.title}
          </NavLink>
        ))}
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 18, width: '100%' }} onClick={logout}>Log out</button>
      </aside>
      <div>
        <div className="mobile-bar" style={{ padding: '14px 16px', display: 'none', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="hamburger" onClick={() => setOpen((v) => !v)}>Menu</button>
          <b>{USER.name}</b>
        </div>
        <main className="main">
          <button className="hamburger" onClick={() => setOpen((v) => !v)} style={{ marginBottom: 12 }}>Menu</button>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="mock" element={<T.MockTest />} />
            <Route path="doubt" element={<T.Doubt />} />
            <Route path="voice" element={<T.Voice />} />
            <Route path="flashcards" element={<T.Flash />} />
            <Route path="notes" element={<T.Notes />} />
            <Route path="mindmap" element={<T.Mind />} />
            <Route path="mcq" element={<T.McqBank />} />
            <Route path="blitz" element={<T.Blitz />} />
            <Route path="focus" element={<T.Focus />} />
            <Route path="notices" element={<T.Notices />} />
            <Route path="scanner" element={<T.Scanner />} />
            <Route path="formulas" element={<T.Formulas />} />
            <Route path="mistakes" element={<T.Mistakes />} />
            <Route path="syllabus" element={<T.Syllabus />} />
            <Route path="memory" element={<T.Memory />} />
            <Route path="lab" element={<T.Lab />} />
            <Route path="autopsy" element={<T.Autopsy />} />
            <Route path="voice-quiz" element={<T.VoiceQuiz />} />
            <Route path="duel" element={<T.Duel />} />
            <Route path="model-paper" element={<T.ModelPaper />} />
            <Route path="diary" element={<T.Diary />} />
            <Route path="telegram" element={<T.Telegram />} />
            <Route path="vigilance" element={<T.Vigilance />} />
            <Route path="mentors" element={<T.Mentors />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
