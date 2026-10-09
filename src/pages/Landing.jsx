import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FAQ, FEATURES, QUOTES } from '../data.js'

function Nav() {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link to="/" className="brand">
          <img src="/logo.svg" alt="" />
          Study Stranger
        </Link>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#research">Research</a>
          <a href="#faq">FAQ</a>
          <Link to="/login">Tools</Link>
        </nav>
        <div className="nav-cta">
          <Link className="btn btn-ghost btn-sm" to="/login">Log in</Link>
          <Link className="btn btn-dark btn-sm" to="/login">Try for free</Link>
        </div>
      </div>
    </header>
  )
}

function HeroScene() {
  return (
    <div className="hero-stage">
      <div className="scene">
        <svg viewBox="0 0 920 360" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <ellipse cx="460" cy="300" rx="280" ry="28" fill="#191919" opacity="0.08" />
          <path d="M250 250c40-90 120-140 230-120 70 12 120 70 150 120" fill="none" stroke="#191919" strokeWidth="2.4" />
          <circle cx="430" cy="168" r="54" fill="#f5d5ff" stroke="#191919" strokeWidth="2.4" />
          <circle cx="414" cy="160" r="5" fill="#191919" />
          <circle cx="444" cy="160" r="5" fill="#191919" />
          <path d="M418 180c10 10 22 10 32 0" fill="none" stroke="#191919" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M390 140c18-28 70-32 92-8" fill="none" stroke="#191919" strokeWidth="2.2" />
          <path d="M360 250c20 40 160 48 220 8" fill="none" stroke="#191919" strokeWidth="2.4" />
          <circle cx="190" cy="210" r="10" fill="#f9f284" stroke="#191919" strokeWidth="2" />
          <circle cx="720" cy="120" r="8" fill="#bcf887" stroke="#191919" strokeWidth="2" />
        </svg>
        <div className="float-card" style={{ left: '7%', top: '18%', background: 'var(--yellow)' }}>
          <b>Flashcards</b>
          <div className="muted">ZP3 · sperm receptor</div>
        </div>
        <div className="float-card" style={{ right: '8%', top: '22%', background: 'var(--teal)' }}>
          <b>Slides</b>
          <div className="muted">Adarini · 4-point answer</div>
        </div>
        <div className="float-card" style={{ left: '14%', bottom: '16%', background: '#fff' }}>
          <b>Video</b>
          <div className="muted">Voice tutor · Mahi Didi</div>
        </div>
        <div className="badge-pill" style={{ position: 'absolute', right: '18%', bottom: '22%' }}>4.9 board prep</div>
      </div>
    </div>
  )
}

export default function Landing() {
  const [feat, setFeat] = useState(0)
  const f = FEATURES[feat]

  return (
    <div>
      <Nav />
      <section className="hero wrap">
        <h1>Learning that <em>adapts to you</em></h1>
        <div className="hero-actions">
          <Link className="btn btn-dark" to="/login">Try for free</Link>
          <a className="btn btn-ghost" href="#features">See how it works</a>
        </div>
        <HeroScene />
      </section>

      <section className="wrap">
        <p className="kicker" style={{ textAlign: 'center' }}>The trusted AI learning platform for HS students</p>
        <div className="stats">
          {[
            ['8k+', 'WBCHSE learners on the Sem 3 track', 'var(--peach)'],
            ['92%', 'of regularly active users reported grade improvements', 'var(--lime)'],
            ['4.9', 'Mentor rating from mock-test reviews', 'var(--pink)']
          ].map(([n, t, bg]) => (
            <article className="stat" key={n} style={{ background: bg, minHeight: 210 }}>
              <div className="stat-copy" style={{ color: 'var(--ink)', textShadow: 'none' }}>
                <strong>{n}</strong>
                <span>{t}</span>
              </div>
              <div style={{ display: 'none' }} />
            </article>
          ))}
        </div>
      </section>

      <section className="section wrap" id="features">
        <p className="kicker">Start really learning in seconds</p>
        <h2>Stop fighting your notes. <em>Understand them.</em></h2>
        <p className="lede">See how Study Stranger turns Biology, Bengali A and English B into tools you will actually study from.</p>
        <div className="feature-tabs">
          {FEATURES.map((item, i) => (
            <button key={item.kicker} className={i === feat ? 'active' : ''} onClick={() => setFeat(i)}>
              {item.kicker}
            </button>
          ))}
        </div>
        <div className="feature-panel" style={{ background: f.color }}>
          <div className="feature-copy">
            <div>
              <p className="kicker">{f.kicker}</p>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
            <div className="row">
              <Link className="btn btn-dark" to="/login">Get started</Link>
              <a className="btn btn-ghost" href="#faq">Learn more</a>
            </div>
          </div>
          <div className="feature-visual">
            <div className="mini-ui">
              <div className="mini-row">
                <b>Semester 3 path</b>
                <span className="chip">Today</span>
              </div>
              {['Human Reproduction', 'Adarini long answer', 'The Bet SAQ set'].map((x, i) => (
                <div key={x} style={{ margin: '14px 0' }}>
                  <div className="mini-row"><span>{x}</span><span>{[80, 45, 20][i]}%</span></div>
                  <div className="bar"><span style={{ width: `${[80, 45, 20][i]}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap" id="research">
        <div className="research">
          <div>
            <p className="kicker">And we can prove it</p>
            <h2>Finals season put us to the test. We <em>passed</em>.</h2>
            <div className="research-stats">
              {[
                ['92%', 'of regular active users reported grade improvements'],
                ['85%', 'of total users reported grade improvements'],
                ['30%', 'reduction in average study time reported']
              ].map(([n, t]) => (
                <div className="rs" key={n}>
                  <b>{n}</b>
                  <span className="muted">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="photo-stack">
            <div className="photo-card" style={{ background: 'var(--teal)', minHeight: 180, display: 'grid', placeItems: 'center', padding: 28 }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 28 }}>AI workforce-ready notes for every HS classroom.</p>
            </div>
            <div className="photo-card" style={{ background: 'var(--yellow)', minHeight: 160, display: 'grid', placeItems: 'center', padding: 28 }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 24 }}>The Learn Engine sequences your Sem 3 path, then drills the weak spots.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section wrap" id="faq">
        <div className="faq">
          <div>
            <p className="kicker">Got questions?</p>
            <h2>Frequently asked questions</h2>
            <p className="lede">Every question has a good answer. Here’s what to know about the platform, Stranger, and how we use AI.</p>
          </div>
          <div>
            {FAQ.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section wrap">
        <p className="kicker">Testimonials</p>
        <h2>Helping students achieve more.</h2>
        <div className="quotes">
          {QUOTES.map((q) => (
            <article className="quote" key={q.name}>
              <p>“ {q.text} ”</p>
              <small>{q.name}</small>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap foot-grid">
          <div className="brand"><img src="/logo.svg" alt="" /> Study Stranger</div>
          <div>WBCHSE Class 12 Semester 3 AI study hub · Biology · Bengali A · English B</div>
          <Link to="/login">Open the tools</Link>
        </div>
      </footer>
    </div>
  )
}
