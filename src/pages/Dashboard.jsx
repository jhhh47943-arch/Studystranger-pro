import { Link } from 'react-router-dom'
import { SYLLABUS, TOOLS, USER } from '../data.js'

export default function Dashboard() {
  const done = SYLLABUS.flatMap((s) => s.chapters).filter((c) => c.done).length
  const total = SYLLABUS.flatMap((s) => s.chapters).length
  const pct = Math.round((done / total) * 100)

  return (
    <div>
      <div className="top-row">
        <div className="greet">
          <p className="kicker">Good study session</p>
          <h1>Welcome back, {USER.name}.</h1>
          <p>{USER.classLabel} · every original tool, new studio UI</p>
        </div>
        <Link className="btn btn-dark" to="/app/mock">Start mock test</Link>
      </div>

      <div className="panel" style={{ marginBottom: 18, background: 'var(--yellow)' }}>
        <div className="mini-row">
          <div>
            <p className="kicker">Study Plan</p>
            <h2 style={{ marginBottom: 4 }}>Know exactly what comes next</h2>
            <p className="muted">Human Reproduction review, then Adarini long answers tonight.</p>
          </div>
          <b style={{ fontFamily: 'var(--font-serif)', fontSize: 40 }}>{pct}%</b>
        </div>
        <div className="progress-ring" style={{ marginTop: 12 }}><span style={{ width: `${pct}%` }} /></div>
      </div>

      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500, margin: '8px 0 14px' }}>Personalized tutoring, totally redefined</h3>
      <div className="tool-grid">
        {TOOLS.map((t) => (
          <Link key={t.id} to={t.to} className="tool-card">
            <div>
              <div className="ico" style={{ background: t.color }}>✦</div>
              <div className="tag" style={{ marginTop: 12 }}>{t.tag}</div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
