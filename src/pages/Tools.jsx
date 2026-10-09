import { useEffect, useMemo, useState } from 'react'
import { BANK, FLASHCARDS, FORMULAS, loadStore, MENTORS, NOTES, NOTICES, saveStore, SYLLABUS, USER } from '../data.js'

function Head({ kicker, title, lede }) {
  return (
    <div className="top-row">
      <div className="greet">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {lede ? <p>{lede}</p> : null}
      </div>
    </div>
  )
}

function rememberMistake(q) {
  const store = loadStore()
  const bank = store.mistakes || []
  if (!bank.find((m) => m.id === q.id)) saveStore({ mistakes: [...bank, q] })
}

export function MockTest() {
  const [subject, setSubject] = useState('Biology')
  const [started, setStarted] = useState(false)
  const [i, setI] = useState(0)
  const [pick, setPick] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [sec, setSec] = useState(12 * 60)
  const qs = useMemo(() => BANK.filter((q) => q.subject === subject), [subject])

  useEffect(() => {
    if (!started || done) return
    const t = setInterval(() => setSec((s) => (s <= 0 ? 0 : s - 1)), 1000)
    return () => clearInterval(t)
  }, [started, done])

  useEffect(() => { if (sec === 0 && started) setDone(true) }, [sec, started])

  const q = qs[i]
  function next() {
    if (pick === q.ans) setScore((s) => s + 1)
    else rememberMistake(q)
    if (i + 1 >= qs.length) setDone(true)
    else { setI(i + 1); setPick(null) }
  }

  if (!started) {
    return (
      <div>
        <Head kicker="Exam Sim" title="Mock Test AI" lede="Prepare with precision. Master your WBCHSE Sem 3 exams." />
        <div className="panel">
          <p className="muted" style={{ marginBottom: 12 }}>02. WBCHSE Sem 3 topic shortcuts</p>
          <div className="row">
            {['Biology', 'Bengali A', 'English B'].map((s) => (
              <button key={s} className={`btn ${subject === s ? 'btn-dark' : 'btn-ghost'}`} onClick={() => setSubject(s === 'Bengali A' ? 'Bengali A' : s)}>{s}</button>
            ))}
          </div>
          <p style={{ margin: '18px 0 8px' }}>Paper: {subject === 'Bengali A' ? 'Bengali A' : subject} · {qs.length} questions · 12 minutes</p>
          <button className="btn btn-dark" onClick={() => { setStarted(true); setSubject(subject === 'Bengali A' ? 'Bengali A' : subject) }}>Start mock test now</button>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div>
        <Head kicker="Result" title="Mock Test Complete!" />
        <div className="panel" style={{ background: 'var(--lime)' }}>
          <h2>{score} / {qs.length}</h2>
          <p className="muted">Tip: read the Bengali translations in Mistake Bank for conceptual clarity.</p>
          <button className="btn btn-dark" style={{ marginTop: 16 }} onClick={() => { setStarted(false); setDone(false); setI(0); setScore(0); setPick(null); setSec(12 * 60) }}>Back to dashboard setup</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head kicker="Full Exam Mode" title={`${subject} paper`} lede={`${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} remaining · Q ${i + 1}/${qs.length}`} />
      <div className="q-card">
        <b>{q.q}</b>
        {q.options.map((o, idx) => (
          <button key={o} className={`opt ${pick === idx ? 'picked' : ''}`} onClick={() => setPick(idx)}>{String.fromCharCode(65 + idx)}. {o}</button>
        ))}
        <button className="btn btn-dark" style={{ marginTop: 16 }} disabled={pick === null} onClick={next}>{i + 1 === qs.length ? 'Submit WBCHSE exam' : 'Next'}</button>
      </div>
    </div>
  )
}

export function Doubt() {
  const [text, setText] = useState('')
  const [msgs, setMsgs] = useState([{ role: 'ai', text: `Namaskar ${USER.name}. Stranger here. Drop a Sem 3 doubt in Bangla or English — Genetics, Adarini, Deoli, formulas.` }])

  function reply(q) {
    const low = q.toLowerCase()
    let a = 'Let’s ground this in the WBCHSE Sem 3 syllabus. Break the stem, name the chapter, then write the 3-mark point list. Ask a follow-up if you want the Bangla version.'
    if (low.includes('zp3') || low.includes('sperm')) a = 'ZP3 is the primary sperm receptor on zona pellucida. Binding triggers the acrosome reaction so the sperm can penetrate. Board line: ZP3 = primary receptor.'
    else if (low.includes('geiton')) a = 'Geitonogamy: pollen of one flower to another flower of the SAME plant. Genetically autogamy, ecologically xenogamy because an agent is needed.'
    else if (low.includes('deoli')) a = 'Night Train at Deoli (Ruskin Bond): a brief station meeting, baskets, and a narrator who never repeats the moment. Theme = unfinished longing, not romance fulfilled.'
    else if (low.includes('adarini') || low.includes('আদর')) a = 'আদরিণী: চরিত্রের নীরব শক্তি ও সামাজিক প্রত্যাশা। উত্তরে intro → character → conflict → insight — একটি উক্তি উদ্ধৃত করে নিজের ভাষায় অর্থ লিখো।'
    else if (low.includes('lh')) a = 'LH surge around day 14 of a 28-day cycle ruptures the Graafian follicle (ovulation). FSH grows the follicle; LH finishes the job.'
    setMsgs((m) => [...m, { role: 'me', text: q }, { role: 'ai', text: a }])
    const mem = loadStore().memory || []
    saveStore({ memory: [{ q, a, at: Date.now() }, ...mem].slice(0, 20) })
  }

  return (
    <div>
      <Head kicker="AI Mentor" title="AI Doubt Solver" lede="Instant step-by-step solutions, grounded in your syllabus." />
      <div className="panel">
        <div className="chat">
          {msgs.map((m, i) => <div key={i} className={`bubble ${m.role}`}>{m.text}</div>)}
        </div>
        <form style={{ display: 'flex', gap: 8, marginTop: 14 }} onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; reply(text.trim()); setText('') }}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a doubt…" style={{ flex: 1, height: 48, borderRadius: 14, border: '1px solid var(--line)', padding: '0 14px' }} />
          <button className="btn btn-dark" type="submit">Ask</button>
        </form>
      </div>
    </div>
  )
}

export function Voice() {
  const [mentor, setMentor] = useState(MENTORS[0])
  const [live, setLive] = useState(false)
  const [log, setLog] = useState([])

  function speak() {
    setLive(true)
    const line = `${mentor.name}: Breathe. We stay inside ${mentor.role}. Tell me the chapter and I’ll drill one board question, then wait for your answer.`
    setLog((l) => [...l, line])
    if (window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(line)
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
  }

  return (
    <div>
      <Head kicker="Voice AI" title="Voice Tutor" lede="Real-time voice discussions for Class 12." />
      <div className="mentor-grid" style={{ marginBottom: 16 }}>
        {MENTORS.map((m) => (
          <button key={m.id} className={`mentor ${mentor.id === m.id ? 'selected' : ''}`} style={{ background: m.color }} onClick={() => setMentor(m)}>
            <b>{m.name}</b>
            <div className="bn">{m.bn}</div>
            <small className="muted">{m.tone}</small>
          </button>
        ))}
      </div>
      <div className="panel">
        <p>{live ? 'Session live — speak or read the prompt aloud.' : 'Pick a mentor and start a voice loop.'}</p>
        <button className="btn btn-dark" style={{ marginTop: 12 }} onClick={speak}>{live ? 'Ask again' : 'Begin sync'}</button>
        <div style={{ marginTop: 16 }}>
          {log.map((l, i) => <p key={i} style={{ marginTop: 8 }}>{l}</p>)}
        </div>
      </div>
    </div>
  )
}

export function Flash() {
  const [i, setI] = useState(0)
  const [flip, setFlip] = useState(false)
  const c = FLASHCARDS[i]
  return (
    <div>
      <Head kicker="Flashcards" title="3D Flashcards" lede={`${i + 1} / ${FLASHCARDS.length} · ${c.subject}`} />
      <div className="flash" style={{ background: flip ? 'var(--lime)' : 'var(--pink)' }} onClick={() => setFlip(!flip)}>
        <div>
          <p className="kicker">{flip ? 'Answer' : 'Prompt'}</p>
          <h2>{flip ? c.a : c.q}</h2>
          <p className="muted">Click to flip</p>
        </div>
      </div>
      <div className="row" style={{ marginTop: 18 }}>
        <button className="btn btn-ghost" onClick={() => { setI((i - 1 + FLASHCARDS.length) % FLASHCARDS.length); setFlip(false) }}>Prev</button>
        <button className="btn btn-dark" onClick={() => { setI((i + 1) % FLASHCARDS.length); setFlip(false) }}>Next card</button>
      </div>
    </div>
  )
}

export function Notes() {
  const [id, setId] = useState(NOTES[0].id)
  const n = NOTES.find((x) => x.id === id)
  return (
    <div>
      <Head kicker="Notes Hub" title="Revision Notes" lede="Bengali & English chapter notes for Sem 3." />
      <div className="row" style={{ marginBottom: 14 }}>
        {NOTES.map((x) => <button key={x.id} className={`btn ${id === x.id ? 'btn-dark' : 'btn-ghost'}`} onClick={() => setId(x.id)}>{x.subject}</button>)}
      </div>
      <div className="panel">
        <p className="kicker">{n.subject}</p>
        <h2>{n.title}</h2>
        <p className="bn muted">{n.bn}</p>
        <ul style={{ marginTop: 16, paddingLeft: 18 }}>
          {n.points.map((p) => <li key={p} style={{ marginBottom: 8 }}>{p}</li>)}
        </ul>
      </div>
    </div>
  )
}

export function Mind() {
  return (
    <div>
      <Head kicker="Visualizer" title="Concept Mind Maps" lede="Interactive visual knowledge trees." />
      <div className="panel" style={{ background: 'var(--blue)' }}>
        <svg viewBox="0 0 760 360" width="100%" height="320">
          <line x1="380" y1="180" x2="140" y2="80" stroke="#191919" />
          <line x1="380" y1="180" x2="140" y2="280" stroke="#191919" />
          <line x1="380" y1="180" x2="620" y2="80" stroke="#191919" />
          <line x1="380" y1="180" x2="620" y2="280" stroke="#191919" />
          <rect x="300" y="150" width="160" height="60" rx="16" fill="#f5d5ff" stroke="#191919" />
          <text x="380" y="186" textAnchor="middle" fontFamily="Bitter" fontSize="16">Sem 3 Core</text>
          <rect x="40" y="50" width="180" height="54" rx="14" fill="#bcf887" stroke="#191919" />
          <text x="130" y="82" textAnchor="middle" fontSize="13">Reproduction</text>
          <rect x="40" y="250" width="180" height="54" rx="14" fill="#f9f284" stroke="#191919" />
          <text x="130" y="282" textAnchor="middle" fontSize="13">Genetics</text>
          <rect x="540" y="50" width="180" height="54" rx="14" fill="#ffca98" stroke="#191919" />
          <text x="630" y="82" textAnchor="middle" fontSize="13">Bengali A</text>
          <rect x="540" y="250" width="180" height="54" rx="14" fill="#bbeef0" stroke="#191919" />
          <text x="630" y="282" textAnchor="middle" fontSize="13">English B</text>
        </svg>
      </div>
    </div>
  )
}

export function McqBank() {
  const [filter, setFilter] = useState('All')
  const [revealed, setRevealed] = useState({})
  const list = BANK.filter((q) => filter === 'All' || q.subject === filter)
  return (
    <div>
      <Head kicker="MCQ Bank" title="WBCHSE MCQ Bank" lede="Sem 3 MCQs with Bengali explanations." />
      <div className="row" style={{ marginBottom: 12 }}>
        {['All', 'Biology', 'English B', 'Bengali A'].map((s) => (
          <button key={s} className={`btn ${filter === s ? 'btn-dark' : 'btn-ghost'}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>
      {list.map((q) => (
        <div className="q-card" key={q.id}>
          <b>{q.q}</b>
          {q.options.map((o, idx) => (
            <button key={o} className={`opt ${revealed[q.id] ? (idx === q.ans ? 'good' : '') : ''}`} onClick={() => setRevealed({ ...revealed, [q.id]: true })}>{o}</button>
          ))}
          {revealed[q.id] ? <p style={{ marginTop: 10 }}>{q.why} <span className="bn muted">{q.bn}</span></p> : null}
        </div>
      ))}
    </div>
  )
}

export function Blitz() {
  const [i, setI] = useState(0)
  const [left, setLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [go, setGo] = useState(false)
  const [over, setOver] = useState(false)

  useEffect(() => {
    if (!go || over) return
    const t = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [go, over])
  useEffect(() => { if (left <= 0) setOver(true) }, [left])

  const q = BANK[i % BANK.length]
  function hit(idx) {
    if (idx === q.ans) setScore((s) => s + 1)
    else rememberMistake(q)
    setI(i + 1)
  }

  return (
    <div>
      <Head kicker="Fast Quiz" title="Speed Blitz" lede="60-second rapid fire MCQ sprints." />
      {!go ? <button className="btn btn-dark" onClick={() => setGo(true)}>Start 60s</button> : over ? (
        <div className="panel" style={{ background: 'var(--peach)' }}><h2>Score {score}</h2></div>
      ) : (
        <div className="panel">
          <p>{left}s · {score} hits</p>
          <h2 style={{ fontSize: 22, margin: '12px 0' }}>{q.q}</h2>
          {q.options.map((o, idx) => <button key={o} className="opt" onClick={() => hit(idx)}>{o}</button>)}
        </div>
      )}
    </div>
  )
}

export function Focus() {
  const [sec, setSec] = useState(25 * 60)
  const [run, setRun] = useState(false)
  useEffect(() => {
    if (!run) return
    const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [run])
  const m = Math.floor(sec / 60)
  const s = String(sec % 60).padStart(2, '0')
  return (
    <div>
      <Head kicker="Focus" title="Focus Study Room" lede="Pomodoro timer + quiet study pulse." />
      <div className="panel" style={{ textAlign: 'center', background: 'var(--yellow)' }}>
        <h2 style={{ fontSize: 72 }}>{m}:{s}</h2>
        <div className="row" style={{ justifyContent: 'center', marginTop: 12 }}>
          <button className="btn btn-dark" onClick={() => setRun(!run)}>{run ? 'Pause' : 'Start'}</button>
          <button className="btn btn-ghost" onClick={() => { setRun(false); setSec(25 * 60) }}>Reset</button>
        </div>
      </div>
    </div>
  )
}

export function Notices() {
  return (
    <div>
      <Head kicker="PDF Board" title="Notice Board PDFs" lede="WBCHSE official notices and routine PDFs." />
      {NOTICES.map((n) => (
        <div className="q-card" key={n.title}>
          <div className="mini-row"><b>{n.title}</b><span className="chip">{n.type}</span></div>
          <p className="muted">{n.date}</p>
        </div>
      ))}
    </div>
  )
}

export function Scanner() {
  const [out, setOut] = useState('')
  return (
    <div>
      <Head kicker="OCR AI" title="Question Scanner" lede="Drop a textbook photo or paste the printed question." />
      <div className="panel">
        <textarea rows={5} placeholder="Paste scanned text…" onChange={(e) => {
          const v = e.target.value
          setOut(v ? `Detected question. Likely chapter: ${v.toLowerCase().includes('pollen') ? 'Sexual Reproduction in Flowering Plants' : 'General Sem 3'}. Open Doubt Solver to finish the working.` : '')
        }} style={{ width: '100%', borderRadius: 14, border: '1px solid var(--line)', padding: 12 }} />
        {out ? <p style={{ marginTop: 12 }}>{out}</p> : null}
      </div>
    </div>
  )
}

export function Formulas() {
  return (
    <div>
      <Head kicker="Formulas" title="Formula Cheat Sheet" lede="Maths, Physics & Chemistry equation solver." />
      <div className="tool-grid">
        {FORMULAS.map((f) => (
          <article key={f.name} className="tool-card">
            <div className="tag">{f.sub}</div>
            <h3>{f.name}</h3>
            <p style={{ fontFamily: 'Bitter, serif', fontSize: 18, color: 'var(--ink)' }}>{f.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function Mistakes() {
  const bank = loadStore().mistakes || []
  return (
    <div>
      <Head kicker="Fix Errors" title="Mistake Bank" lede="Review incorrect answers and lock the concept." />
      {bank.length === 0 ? <div className="panel">No mistakes yet. Sit a mock or blitz first.</div> : bank.map((q) => (
        <div className="q-card" key={q.id}>
          <b>{q.q}</b>
          <p>Correct: {q.options[q.ans]}</p>
          <p className="muted">{q.why}</p>
        </div>
      ))}
    </div>
  )
}

export function Syllabus() {
  const [map, setMap] = useState(() => {
    const saved = loadStore().syllabus
    if (saved) return saved
    const init = {}
    SYLLABUS.forEach((s) => s.chapters.forEach((c) => { init[`${s.subject}:${c.name}`] = c.done }))
    return init
  })
  function toggle(key) {
    const next = { ...map, [key]: !map[key] }
    setMap(next)
    saveStore({ syllabus: next })
  }
  return (
    <div>
      <Head kicker="Syllabus" title="Class 12 Roadmap" lede="Semester 3 tracker checklist." />
      {SYLLABUS.map((s) => (
        <div className="panel" key={s.subject} style={{ marginBottom: 12, background: s.color }}>
          <h2>{s.subject}</h2>
          {s.chapters.map((c) => {
            const key = `${s.subject}:${c.name}`
            return (
              <label key={key} style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <input type="checkbox" checked={!!map[key]} onChange={() => toggle(key)} />
                <span>{c.name} <small className="bn muted">· {c.bn}</small></span>
              </label>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function Memory() {
  const mem = loadStore().memory || []
  return (
    <div>
      <Head kicker="Vault" title="AI Memory Vault" lede="Logged out বা নতুন login করলেও এই account-এর AI memories এখানেই থাকে।" />
      {mem.length === 0 ? <div className="panel">Ask the doubt solver once — memories collect here.</div> : mem.map((m, i) => (
        <div className="q-card" key={i}><b>{m.q}</b><p>{m.a}</p></div>
      ))}
    </div>
  )
}

export function Lab() {
  const rooms = [
    ['Biology 3D Lab', 'Genetics, evolution & reproduction models', 'var(--lime)'],
    ['Physics studio', 'EM waves & Lorentz force space', 'var(--teal)'],
    ['Chemistry bench', 'Organic aromaticity sketches', 'var(--peach)'],
    ['Math room', '3D vectors, matrices, integration', 'var(--yellow)']
  ]
  return (
    <div>
      <Head kicker="3D Studio" title="3D Science Lab" lede="Interactive Chemistry, Physics, Math in 3D." />
      <div className="tool-grid">
        {rooms.map(([t, d, c]) => (
          <article key={t} className="tool-card" style={{ background: c }}>
            <h3>{t}</h3><p>{d}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function Autopsy() {
  const n = (loadStore().mistakes || []).length
  return (
    <div>
      <Head kicker="Diagnostic" title="AI Weak Area Autopsy" lede="Diagnostic mistake analysis and a 5-minute fix." />
      <div className="panel">
        <h2>{n} weak items in the bank</h2>
        <p className="muted">Pattern: reproduction MCQs and English B SAQ stems. Fix: 5 flashcards + 1 blitz on Biology only.</p>
      </div>
    </div>
  )
}

export function VoiceQuiz() {
  const [i, setI] = useState(0)
  const q = BANK[i]
  function speak(text) {
    if (!window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }
  return (
    <div>
      <Head kicker="Voice AI" title="Voice MCQ Challenge" lede="Hear the stem, speak the option." />
      <div className="panel">
        <h2>{q.q}</h2>
        <button className="btn btn-ghost" onClick={() => speak(q.q + '. Options. ' + q.options.join('. '))} style={{ margin: '12px 0' }}>Read aloud</button>
        {q.options.map((o, idx) => <button key={o} className="opt" onClick={() => { speak(idx === q.ans ? 'Correct' : 'Try again'); if (idx === q.ans) setI((i + 1) % BANK.length) }}>{o}</button>)}
      </div>
    </div>
  )
}

export function Duel() {
  const [you, setYou] = useState(0)
  const [foe, setFoe] = useState(0)
  const [i, setI] = useState(0)
  const q = BANK[i]
  function play(idx) {
    const good = idx === q.ans
    const foeGood = Math.random() > 0.45
    setYou((y) => y + (good ? 1 : 0))
    setFoe((f) => f + (foeGood ? 1 : 0))
    setI((i + 1) % BANK.length)
  }
  return (
    <div>
      <Head kicker="1v1 Arena" title="Friend Quiz Duel" lede={`You ${you} — Rival ${foe}`} />
      <div className="panel">
        <h2>{q.q}</h2>
        {q.options.map((o, idx) => <button key={o} className="opt" onClick={() => play(idx)}>{o}</button>)}
      </div>
    </div>
  )
}

export function ModelPaper() {
  return (
    <div>
      <Head kicker="Printable" title="Model Paper + OMR" lede="1-click printable question and OMR sheet." />
      <div className="panel">
        <button className="btn btn-dark" onClick={() => window.print()}>Print this paper</button>
        <ol style={{ marginTop: 18, paddingLeft: 18 }}>
          {BANK.map((q) => <li key={q.id} style={{ marginBottom: 10 }}>{q.q}</li>)}
        </ol>
        <p className="muted">OMR: A B C D · mark only one bubble per question.</p>
      </div>
    </div>
  )
}

export function Diary() {
  const [items, setItems] = useState(() => loadStore().diary || [
    { t: 'F = q(E + v × B)', n: 'Physics' },
    { t: '“The girl I had seen only once.”', n: 'Deoli' }
  ])
  const [t, setT] = useState('')
  function add(e) {
    e.preventDefault()
    if (!t.trim()) return
    const next = [{ t: t.trim(), n: 'Note' }, ...items]
    setItems(next)
    saveStore({ diary: next })
    setT('')
  }
  return (
    <div>
      <Head kicker="Bookmarks" title="Formula Quote Diary" lede="Sticky equations and literary lines." />
      <form className="row" onSubmit={add} style={{ marginBottom: 12 }}>
        <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Add a formula or quote" style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid var(--line)', padding: '0 12px' }} />
        <button className="btn btn-dark">Save</button>
      </form>
      {items.map((x, i) => (
        <div className="q-card" key={i}><b>{x.t}</b><p className="muted">{x.n}</p></div>
      ))}
    </div>
  )
}

export function Telegram() {
  return (
    <div>
      <Head kicker="Bot Hub" title="Telegram AI Bot" lede="Study reminders and quizzes on Telegram." />
      <div className="panel" style={{ background: 'var(--teal)' }}>
        <p>Link token stays on-device. Daily 7:00 AM Biology blitz + 9:00 PM Adarini recap.</p>
        <p style={{ marginTop: 8 }} className="muted">Open Telegram, search Study Stranger Bot, send /start then your username.</p>
      </div>
    </div>
  )
}

export function Vigilance() {
  const slots = ['6:30 AM check-in', '4:00 PM proof photo', '9:30 PM parent summary']
  return (
    <div>
      <Head kicker="Vigilance" title="Daily Calls & Parent Vigilance" lede="Morning / night accountability and study-proof reports." />
      {slots.map((s) => <div className="q-card" key={s}><b>{s}</b><p className="muted">WhatsApp report queued for guardian after you close Focus Room.</p></div>)}
    </div>
  )
}

export function Mentors() {
  return (
    <div>
      <Head kicker="Companions" title="AI Mentors" lede="Stranger, Mahi, Anjali and Zoya — same voices, new studio." />
      <div className="mentor-grid">
        {MENTORS.map((m) => (
          <article key={m.id} className="mentor" style={{ background: m.color }}>
            <b>{m.name}</b>
            <div className="bn">{m.bn}</div>
            <p>{m.role}</p>
            <small>{m.tone}</small>
          </article>
        ))}
      </div>
    </div>
  )
}
