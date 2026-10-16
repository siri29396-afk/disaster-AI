import { useEffect, useState, type FormEvent } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  Activity, AlertTriangle, ArrowUpRight, BookOpen, Check, CheckCircle2,
  ChevronRight, CloudOff, FileText, HeartPulse, House, Languages,
  ListChecks, Menu, MessageSquareText, PackageCheck, Phone, Plus,
  Radio, ShieldAlert, Trash2, Wifi, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { assessmentQuestions, checklistDefaults, disasters, guides, translatedGuides, type DisasterType, type Language } from './data'
import { translate } from './i18n'
import { deleteContact, deletePlan, getContacts, getPlans, getSetting, saveContact, savePlan, saveSetting, type SavedContact, type SavedPlan } from './storage'

type NavItem = { to: string; key: string; icon: LucideIcon }
const navigation: NavItem[] = [
  { to: '/', key: 'dashboard', icon: House },
  { to: '/assistant', key: 'assistant', icon: MessageSquareText },
  { to: '/guides', key: 'guides', icon: BookOpen },
  { to: '/planner', key: 'planner', icon: ListChecks },
  { to: '/checklist', key: 'checklist', icon: PackageCheck },
  { to: '/readiness', key: 'readiness', icon: Activity },
  { to: '/alerts', key: 'alerts', icon: Radio },
  { to: '/contacts', key: 'contacts', icon: Phone },
  { to: '/documents', key: 'documents', icon: FileText },
  { to: '/plans', key: 'savedPlans', icon: CheckCircle2 },
]

function App() {
  return <BrowserRouter><DisasterApp /></BrowserRouter>
}

function DisasterApp() {
  const [language, setLanguage] = useState<Language>('English')
  const [online, setOnline] = useState(navigator.onLine)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const t = (key: string) => translate(language, key)
  const activeKey = navigation.find((item) => item.to === location.pathname)?.key ?? 'dashboard'

  useEffect(() => {
    void getSetting<Language>('language', 'English').then(setLanguage)
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === 'English' ? 'en' : language === 'Telugu' ? 'te' : 'hi'
  }, [language])

  async function changeLanguage(value: Language) {
    setLanguage(value)
    await saveSetting('language', value)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><ShieldAlert size={22} /></span>
          <span><strong>DisasterAI</strong><small>Prepared Today. Protected Tomorrow.</small></span>
        </Link>
        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ to, key, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
              <Icon size={17} strokeWidth={1.8} /><span>{t(key)}</span>{key === 'alerts' && <span className="nav-dot" aria-label="Live alerts not configured" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="offline-note"><CheckCircle2 size={16} /><span>{t('availableOffline')}</span></div>
          <p>{t('safety')}</p>
          <a className="source-link" href="https://www.ready.gov/" target="_blank" rel="noreferrer">Ready.gov <ArrowUpRight size={13} /></a>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button className="icon-button mobile-menu" type="button" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
          <div className="breadcrumb">DISASTERAI <ChevronRight size={13} /> <strong>{t(activeKey).toUpperCase()}</strong></div>
          <div className="topbar-actions">
            <span className={`connection ${online ? 'is-online' : 'is-offline'}`}>{online ? <Wifi size={14} /> : <CloudOff size={14} />}{online ? t('online') : t('offline')}</span>
            <label className="language-control"><Languages size={15} /><select aria-label={t('language')} value={language} onChange={(event) => void changeLanguage(event.target.value as Language)}><option>English</option><option>Telugu</option><option>Hindi</option></select></label>
          </div>
        </header>

        <div className="emergency-strip"><AlertTriangle size={17} /><span>{t('emergency')}</span></div>
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard t={t} />} />
            <Route path="/assistant" element={<Assistant t={t} language={language} />} />
            <Route path="/guides" element={<Guides t={t} language={language} />} />
            <Route path="/planner" element={<Planner t={t} language={language} />} />
            <Route path="/checklist" element={<Checklist t={t} />} />
            <Route path="/readiness" element={<Readiness t={t} />} />
            <Route path="/alerts" element={<Alerts t={t} />} />
            <Route path="/contacts" element={<Contacts t={t} />} />
            <Route path="/documents" element={<Documents t={t} />} />
            <Route path="/plans" element={<Plans t={t} />} />
            <Route path="/settings" element={<Settings t={t} language={language} onChange={changeLanguage} />} />
            <Route path="/about" element={<About t={t} />} />
          </Routes>
        </main>
        <footer className="site-footer"><span>DISASTERAI · Preparedness information, not emergency dispatch</span><div><Link to="/about">{t('about')}</Link><Link to="/settings">{t('settings')}</Link></div></footer>
      </div>
    </div>
  )
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

function Dashboard({ t }: { t: (key: string) => string }) {
  const [plans, setPlans] = useState<SavedPlan[]>([])
  const [progress, setProgress] = useState({ checked: 0, total: checklistDefaults.length })
  const [readiness, setReadiness] = useState<number | null>(null)
  useEffect(() => {
    void getPlans().then(setPlans)
    void getSetting<KitItem[]>('kit-items', checklistDefaults.map((item) => ({ ...item, checked: false }))).then((items) => setProgress({ checked: items.filter((item) => item.checked).length, total: items.length }))
    void getSetting<{ score?: number } | null>('assessment', null).then((value) => setReadiness(value?.score ?? null))
  }, [])
  return <>
    <PageHeading eyebrow="HOUSEHOLD READINESS" title={t('dashboardTitle')} description={t('dashboardSub')} />
    <section className="dashboard-hero">
      <div className="hero-copy"><span className="hero-kicker"><span className="status-pip" /> YOUR PREPAREDNESS, IN ONE PLACE</span><h2>Confidence starts<br />before the emergency.</h2><p>Build a practical household plan and keep the essentials available when networks are not.</p><Link className="button button-light" to="/planner">{t('buildPlan')} <ChevronRight size={16} /></Link></div>
      <div className="hero-mark" aria-hidden="true"><div className="hero-ring ring-one" /><div className="hero-ring ring-two" /><ShieldAlert size={73} strokeWidth={1.1} /></div>
      <div className="hero-index"><span>01</span><span>PREPARE · PROTECT · RECOVER</span></div>
    </section>
    <div className="metric-grid">
      <Link to="/checklist" className="metric-card"><div className="metric-top"><span>{t('kitProgress')}</span><PackageCheck size={17} /></div><strong>{progress.checked}<small> / {progress.total}</small></strong><div className="progress-track"><span style={{ width: `${Math.round(progress.checked / progress.total * 100)}%` }} /></div><em>{Math.round(progress.checked / progress.total * 100)}% complete</em></Link>
      <Link to="/readiness" className="metric-card"><div className="metric-top"><span>{t('readinessScore')}</span><Activity size={17} /></div><strong>{readiness === null ? '—' : `${readiness}`}<small>{readiness === null ? ' Not assessed' : ' / 100'}</small></strong><em>{t('scoreNote')}</em></Link>
      <Link to="/plans" className="metric-card"><div className="metric-top"><span>{t('savedPlans')}</span><CheckCircle2 size={17} /></div><strong>{plans.length}<small> saved</small></strong><em>Stored on this device</em></Link>
    </div>
    <section className="section-block"><div className="section-heading"><div><div className="eyebrow">START HERE</div><h2>{t('quickAccess')}</h2></div><span className="section-caption">OFFLINE RESOURCES INCLUDED</span></div><div className="quick-grid">
      <QuickLink to="/assistant" icon={MessageSquareText} title={t('openAssistant')} subtitle="Online AI guidance · English, Telugu, Hindi" />
      <QuickLink to="/guides" icon={BookOpen} title={t('browseGuides')} subtitle="Nine preloaded hazard guides" />
      <QuickLink to="/checklist" icon={ListChecks} title={t('checklist')} subtitle="Track household essentials locally" />
      <QuickLink to="/readiness" icon={HeartPulse} title={t('readiness')} subtitle="Find practical preparedness gaps" />
    </div></section>
    <section className="section-block guide-shortcuts"><div className="section-heading"><div><div className="eyebrow">OFFLINE LIBRARY</div><h2>{t('resources')}</h2></div><Link className="text-link" to="/guides">All guides <ArrowUpRight size={14} /></Link></div><div className="hazard-chips">{disasters.slice(0, 8).map((type, index) => <Link key={type} to={`/guides?type=${type}`} className="hazard-chip"><span>{String(index + 1).padStart(2, '0')}</span>{guides[type].title}<ChevronRight size={15} /></Link>)}</div></section>
  </>
}

function QuickLink({ to, icon: Icon, title, subtitle }: { to: string; icon: LucideIcon; title: string; subtitle: string }) {
  return <Link to={to} className="quick-link"><span className="quick-icon"><Icon size={19} /></span><span><strong>{title}</strong><small>{subtitle}</small></span><ChevronRight size={16} className="quick-arrow" /></Link>
}

function Assistant({ t, language }: { t: (key: string) => string; language: Language }) {
  const [hazard, setHazard] = useState<DisasterType>('flood')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent) {
    event.preventDefault()
    const message = question.trim()
    if (!message || busy) return
    setMessages((items) => [...items, { role: 'user', text: message }])
    setQuestion('')
    setError('')
    setBusy(true)
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, language, disaster_type: hazard, history: messages.map(({ role, text }) => ({ role, content: text })) }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'AI service unavailable')
      setMessages((items) => [...items, { role: 'assistant', text: data.response }])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('offlineAi'))
    } finally {
      setBusy(false)
    }
  }
  return <>
    <PageHeading eyebrow="OPENAI · ONLINE ASSISTANCE" title={t('assistantTitle')} description="Practical preparedness advice, clearly distinguished from official instructions." action={<span className="ai-label">OPENAI POWERED</span>} />
    <div className="assistant-layout"><section className="panel chat-panel"><div className="chat-top"><div><span className="eyebrow">PREPAREDNESS CHAT</span><h2>Ask a safety question</h2></div><button className="button button-outline button-small" type="button" onClick={() => { setMessages([]); setError('') }}>{t('clear')}</button></div>
      <div className="chat-messages" aria-live="polite">{messages.length === 0 && <div className="chat-empty"><span className="empty-icon"><MessageSquareText size={23} /></span><strong>Start with a question</strong><p>For example: “What should my family prepare before a flood?”</p></div>}{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === 'user' ? 'YOU' : 'DISASTERAI · GENERAL GUIDANCE'}</span><p>{message.text}</p></div>)}{busy && <div className="chat-message assistant"><span>DISASTERAI</span><p>{t('generating')}</p></div>}</div>
      {error && <div className="inline-alert" role="alert"><CloudOff size={17} /><span>{error} {t('offlineAi')}</span><Link to="/guides">Open guides</Link></div>}
      <form className="chat-form" onSubmit={(event) => void submit(event)}><div className="form-row"><label>{t('selectHazard')}<select value={hazard} onChange={(event) => setHazard(event.target.value as DisasterType)}>{disasters.map((type) => <option key={type} value={type}>{guides[type].title}</option>)}</select></label></div><label className="sr-only" htmlFor="chat-question">{t('question')}</label><textarea id="chat-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={t('question')} rows={3} maxLength={2000} required /><div className="chat-submit"><small>{question.length} / 2000</small><button className="button button-primary" type="submit" disabled={busy || !question.trim()}>{busy ? t('generating') : t('send')} <ArrowUpRight size={15} /></button></div></form>
    </section><aside className="panel safety-panel"><div className="eyebrow">SAFETY BOUNDARIES</div><h2>Guidance, not an alert service.</h2><ul><li>AI responses are general preparedness advice.</li><li>Live warnings and evacuation instructions must come from local authorities.</li><li>OpenAI requires internet access; saved guides work offline.</li></ul><a href="https://www.ready.gov/" target="_blank" rel="noreferrer">Visit Ready.gov <ArrowUpRight size={14} /></a></aside></div>
  </>
}

function Guides({ t, language }: { t: (key: string) => string; language: Language }) {
  const [selected, setSelected] = useState<DisasterType>('flood')
  const guide = language === 'English' ? guides[selected] : translatedGuides[language][selected]
  const sections = [{ key: 'before', items: guide.before }, { key: 'during', items: guide.during }, { key: 'after', items: guide.after }]
  return <><PageHeading eyebrow="PRELOADED · AVAILABLE OFFLINE" title={t('guides')} description="General safety guidance stored in the application. Always follow local official instructions." /><div className="guide-layout"><aside className="guide-list">{disasters.map((type) => <button type="button" key={type} onClick={() => setSelected(type)} className={`guide-select ${selected === type ? 'selected' : ''}`}><span>{language === 'English' ? guides[type].title : translatedGuides[language][type].title}</span><ChevronRight size={15} /></button>)}</aside><article className="panel guide-detail"><div className="guide-detail-head"><div><div className="eyebrow">PREPAREDNESS GUIDE</div><h2>{guide.title}</h2></div><span className="offline-tag"><Check size={13} /> SAVED LOCALLY</span></div><div className="guide-content-grid">{sections.map(({ key, items }, index) => <section className="guide-phase" key={key}><div className="phase-index">0{index + 1}</div><h3>{t(key)}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div><div className="guide-source"><span>{t('source')} · Review your local authority's current instructions</span><a href={guides[selected].source} target="_blank" rel="noreferrer">Ready.gov <ArrowUpRight size={14} /></a></div><p className="guide-disclaimer">This general reference may not reflect local hazards, laws, or current conditions.</p></article></div></>
}

function Planner({ t, language }: { t: (key: string) => string; language: Language }) {
  const [hazard, setHazard] = useState<DisasterType>('flood')
  const [members, setMembers] = useState(4)
  const [pets, setPets] = useState(false)
  const [needs, setNeeds] = useState('')
  const [planText, setPlanText] = useState('')
  const [mode, setMode] = useState<'online' | 'offline-template'>('offline-template')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function generate(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const response = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ disaster_type: hazard, family_members: members, language, pets, additional_needs: needs }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'AI service unavailable')
      setPlanText(data.plan)
      setMode('online')
    } catch {
      const guide = guides[hazard]
      setPlanText(`LOCAL TEMPLATE · NOT AI-GENERATED\n\nHousehold: ${members} people${pets ? ' and pets' : ''}${needs ? `\nAdditional needs: ${needs}` : ''}\n\nPREPARE\n${guide.before.map((item) => `• ${item}`).join('\n')}\n\nDURING\n${guide.during.map((item) => `• ${item}`).join('\n')}\n\nAFTER\n${guide.after.map((item) => `• ${item}`).join('\n')}\n\nConfirm all location-specific arrangements with local authorities. This template does not identify routes, shelters, or current alerts.`)
      setMode('offline-template')
      setMessage('AI planning is unavailable. A locally generated template is shown instead.')
    } finally {
      setBusy(false)
    }
  }
  async function persistPlan() {
    if (!planText) return
    await savePlan({ id: crypto.randomUUID(), title: `${guides[hazard].title} household plan`, disasterType: hazard, body: planText, createdAt: new Date().toISOString(), mode })
    setMessage('Plan saved on this device for offline access.')
  }
  return <><PageHeading eyebrow="PERSONALIZED · STORED ON THIS DEVICE" title={t('planner')} description="Share only the household details you choose. Plans are saved locally in this browser." /><div className="planner-layout"><form className="panel planner-form" onSubmit={(event) => void generate(event)}><div className="form-section-title"><span>01</span><div><strong>Household profile</strong><small>Optional details help tailor the plan.</small></div></div><label>{t('selectHazard')}<select value={hazard} onChange={(event) => setHazard(event.target.value as DisasterType)}>{disasters.map((type) => <option value={type} key={type}>{guides[type].title}</option>)}</select></label><label>{t('household')}<input type="number" min={1} max={30} value={members} onChange={(event) => setMembers(Number(event.target.value))} required /></label><label className="check-field"><input type="checkbox" checked={pets} onChange={(event) => setPets(event.target.checked)} />{t('pets')}</label><label>Accessibility, medication, or other needs <textarea value={needs} onChange={(event) => setNeeds(event.target.value)} rows={3} maxLength={500} placeholder="Optional. Avoid sharing details you do not need in this plan." /></label><button className="button button-primary" type="submit" disabled={busy}>{busy ? t('generating') : t('generate')} <ArrowUpRight size={15} /></button><p className="privacy-note">Personal details are sent to the backend only when requesting online AI generation. Saved plans remain in local browser storage.</p></form><section className="panel plan-preview"><div className="panel-topline"><span className="eyebrow">PLAN PREVIEW</span>{planText && <span className={`mode-tag ${mode}`}>{mode === 'online' ? 'OPENAI GENERATED' : t('offlineTemplate')}</span>}</div>{planText ? <><pre className="plan-output">{planText}</pre><button className="button button-outline" type="button" onClick={() => void persistPlan()}>{t('save')} <Check size={15} /></button></> : <div className="preview-empty"><ListChecks size={26} /><strong>Your plan will appear here</strong><span>Start with a hazard and household size.</span></div>}{message && <p className="form-feedback" role="status">{message}</p>}</section></div></>
}

type KitItem = { id: string; label: string; category: string; quantity: string; checked: boolean }
function Checklist({ t }: { t: (key: string) => string }) {
  const [items, setItems] = useState<KitItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [filter, setFilter] = useState('All')
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { void getSetting<KitItem[]>('kit-items', checklistDefaults.map((item) => ({ ...item, checked: false }))).then((saved) => { setItems(saved); setLoaded(true) }) }, [])
  useEffect(() => { if (loaded) void saveSetting('kit-items', items) }, [items, loaded])
  const categories = ['All', ...new Set(items.map((item) => item.category))]
  const completed = items.filter((item) => item.checked).length
  const shown = items.filter((item) => filter === 'All' || item.category === filter)
  function addItem(event: FormEvent) {
    event.preventDefault()
    const label = newItem.trim()
    if (!label) return
    setItems((current) => [...current, { id: crypto.randomUUID(), label, category: 'Custom', quantity: '1', checked: false }])
    setNewItem('')
  }
  return <><PageHeading eyebrow="LOCAL · PERSISTENT · EDITABLE" title={t('checklist')} description={t('checklistNote')} action={<button type="button" className="button button-outline" onClick={() => { if (window.confirm('Reset all checklist progress?')) setItems((current) => current.map((item) => ({ ...item, checked: false }))) }}>{t('reset')}</button>} /><section className="panel checklist-panel"><div className="checklist-summary"><div><strong>{completed}<small> / {items.length}</small></strong><span>{t('kitProgress')}</span></div><div className="large-progress"><span style={{ width: `${items.length ? completed / items.length * 100 : 0}%` }} /></div><b>{items.length ? Math.round(completed / items.length * 100) : 0}%</b></div><div className="filter-row">{categories.map((category) => <button type="button" key={category} className={`filter-button ${filter === category ? 'active' : ''}`} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="kit-list">{shown.map((item) => <div className={`kit-row ${item.checked ? 'kit-checked' : ''}`} key={item.id}><label><input type="checkbox" checked={item.checked} onChange={(event) => setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, checked: event.target.checked } : candidate))} /><span className="kit-label">{item.label}<small>{item.category}</small></span></label><span className="kit-quantity">{item.quantity}</span>{item.category === 'Custom' && <button type="button" className="icon-button danger-icon" aria-label={`Delete ${item.label}`} onClick={() => setItems((current) => current.filter((candidate) => candidate.id !== item.id))}><Trash2 size={15} /></button>}</div>)}</div><form className="add-item-form" onSubmit={addItem}><label className="sr-only" htmlFor="custom-kit-item">Custom supply</label><input id="custom-kit-item" value={newItem} onChange={(event) => setNewItem(event.target.value)} placeholder="Add a household-specific supply" /><button className="button button-primary" type="submit" disabled={!newItem.trim()}><Plus size={16} /> {t('addItem')}</button></form><p className="privacy-note">Checklist changes are stored in IndexedDB on this device. Tailor supplies to your household and official local guidance.</p></section></>
}

function Readiness({ t }: { t: (key: string) => string }) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [result, setResult] = useState<{ score: number; missing: string[] } | null>(null)
  useEffect(() => { void getSetting<{ score: number; missing: string[] } | null>('assessment', null).then(setResult) }, [])
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (Object.keys(answers).length !== assessmentQuestions.length) return
    try {
      const response = await fetch('/api/assessment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }) })
      const data = await response.json()
      if (!response.ok) throw new Error()
      const saved = { score: data.score, missing: data.missing_preparations.map((item: { recommendation: string }) => item.recommendation) }
      setResult(saved)
      await saveSetting('assessment', saved)
    } catch {
      const correct = Object.values(answers).filter(Boolean).length
      const saved = { score: Math.round(correct / assessmentQuestions.length * 100), missing: assessmentQuestions.filter((item) => !answers[item.id]).map((item) => item.label) }
      setResult(saved)
      await saveSetting('assessment', saved)
    }
  }
  return <><PageHeading eyebrow="INDICATIVE SELF-ASSESSMENT" title={t('readiness')} description={t('assessmentNote')} />{result && <div className="result-banner"><div className="score-dial"><strong>{result.score}</strong><span>/ 100</span></div><div><div className="eyebrow">INDICATIVE READINESS SCORE</div><strong>Your result is saved on this device.</strong><p>{result.missing.length ? `${result.missing.length} preparation areas need attention.` : 'You marked all preparations as complete. Review local guidance regularly.'}</p></div></div>}<form className="panel assessment-form" onSubmit={(event) => void submit(event)}><div className="question-list">{assessmentQuestions.map((item, index) => <fieldset className="question-row" key={item.id}><legend><span>{String(index + 1).padStart(2, '0')}</span>{item.label}</legend><div className="segmented"><label className={answers[item.id] === true ? 'selected' : ''}><input type="radio" name={item.id} checked={answers[item.id] === true} onChange={() => setAnswers((current) => ({ ...current, [item.id]: true }))} />Yes</label><label className={answers[item.id] === false ? 'selected' : ''}><input type="radio" name={item.id} checked={answers[item.id] === false} onChange={() => setAnswers((current) => ({ ...current, [item.id]: false }))} />Not yet</label></div></fieldset>)}</div><div className="assessment-submit"><span>{Object.keys(answers).length} / {assessmentQuestions.length} answered</span><button type="submit" className="button button-primary" disabled={Object.keys(answers).length !== assessmentQuestions.length}>{t('submitAssessment')} <ArrowUpRight size={15} /></button></div></form></>
}

function Alerts({ t }: { t: (key: string) => string }) {
  return <><PageHeading eyebrow="LIVE SOURCE NOT CONFIGURED" title={t('alerts')} description="DisasterAI is not an official warning service." /><section className="alert-unavailable"><div className="alert-symbol"><Radio size={24} /></div><div><div className="eyebrow">NO LIVE FEED CONNECTED</div><h2>{t('alertsUnavailable')}</h2><p>{t('alertsNote')}</p></div></section><section className="section-block"><div className="section-heading"><div><div className="eyebrow">OFFICIAL INFORMATION</div><h2>Choose your local authority</h2></div></div><div className="official-links"><a href="https://www.ready.gov/" target="_blank" rel="noreferrer">Ready.gov <ArrowUpRight size={14} /></a><a href="https://www.weather.gov/" target="_blank" rel="noreferrer">U.S. National Weather Service <ArrowUpRight size={14} /></a><a href="https://www.gov.in/" target="_blank" rel="noreferrer">India national portal <ArrowUpRight size={14} /></a></div><p className="privacy-note">These links are examples of official portals, not a configured alert feed. Select the authority responsible for your region.</p></section></>
}

function Contacts({ t }: { t: (key: string) => string }) {
  const [contacts, setContacts] = useState<SavedContact[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  useEffect(() => { void getContacts().then(setContacts) }, [])
  async function add(event: FormEvent) {
    event.preventDefault()
    const contact = { id: crypto.randomUUID(), name: name.trim(), phone: phone.trim(), note: note.trim() }
    await saveContact(contact)
    setContacts((current) => [...current, contact])
    setName(''); setPhone(''); setNote('')
  }
  async function remove(id: string) { await deleteContact(id); setContacts((current) => current.filter((contact) => contact.id !== id)) }
  return <><PageHeading eyebrow="USER-SAVED · OFFLINE AVAILABLE" title={t('contacts')} description={t('contactNote')} /><div className="contacts-layout"><form className="panel contact-form" onSubmit={(event) => void add(event)}><div className="eyebrow">PERSONAL CONTACT</div><h2>{t('addContact')}</h2><label>{t('name')}<input value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} /></label><label>{t('phone')}<input value={phone} onChange={(event) => setPhone(event.target.value)} type="tel" required maxLength={40} /></label><label>{t('note')}<input value={note} onChange={(event) => setNote(event.target.value)} maxLength={120} /></label><button type="submit" className="button button-primary"><Plus size={15} /> {t('addContact')}</button><p className="privacy-note">Contacts are saved only in this browser. DisasterAI does not verify user-added numbers.</p></form><section className="contact-list">{contacts.length === 0 ? <div className="panel empty-state"><Phone size={22} /><strong>No personal contacts saved</strong><span>Add contacts you trust for offline access.</span></div> : contacts.map((contact) => <article className="panel contact-card" key={contact.id}><div><strong>{contact.name}</strong><span>{contact.note || 'Personal contact · user supplied'}</span></div><a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="phone-link">{contact.phone}</a><button className="icon-button danger-icon" type="button" aria-label={`Delete ${contact.name}`} onClick={() => void remove(contact.id)}><Trash2 size={15} /></button></article>)}</section></div></>
}

function Documents({ t }: { t: (key: string) => string }) {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submitDocument(event: FormEvent, task: 'summarize' | 'ask') {
    event.preventDefault()
    if (!file) return
    setBusy(true); setError(''); setSummary('')
    const body = new FormData(); body.append('file', file)
    const endpoint = task === 'summarize' ? '/api/documents/summarize' : '/api/documents/ask'
    if (task === 'ask') body.append('question', question)
    try {
      const response = await fetch(endpoint, { method: 'POST', body })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || t('unavailable'))
      if (task === 'summarize') setSummary(data.summary)
      else setAnswer(data.answer)
    } catch (cause) { setError(cause instanceof Error ? cause.message : t('unavailable')) } finally { setBusy(false) }
  }
  return <><PageHeading eyebrow="ONLINE · OPENAI DOCUMENT ASSISTANCE" title={t('documents')} description={t('documentNote')} /><div className="documents-layout"><section className="panel document-drop"><FileText size={26} /><h2>{t('uploadDocument')}</h2><p>Supported formats: PDF and plain text. Maximum upload size: 5 MB.</p><input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setSummary(''); setAnswer('') }} /><form onSubmit={(event) => void submitDocument(event, 'summarize')}><button type="submit" className="button button-primary" disabled={!file || busy}>{busy ? t('generating') : t('summarize')} <ArrowUpRight size={15} /></button></form><form className="document-question" onSubmit={(event) => void submitDocument(event, 'ask')}><label htmlFor="document-question">Ask about this document</label><textarea id="document-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1000} rows={3} required /><button type="submit" className="button button-outline" disabled={!file || !question.trim() || busy}>Ask question <ArrowUpRight size={15} /></button></form><p className="privacy-note">The document is processed on request and not retained by this app. Do not upload sensitive personal records. Processing requires internet access.</p>{error && <div className="inline-alert" role="alert">{error}</div>}</section><section className="panel document-result"><div className="eyebrow">DOCUMENT RESPONSE</div>{summary || answer ? <pre className="plan-output">{summary || answer}</pre> : <div className="preview-empty"><FileText size={24} /><strong>No response yet</strong><span>Summaries and answers use the selected document as reference material.</span></div>}</section></div></>
}

function Plans({ t }: { t: (key: string) => string }) {
  const [plans, setPlans] = useState<SavedPlan[]>([])
  useEffect(() => { void getPlans().then(setPlans) }, [])
  async function remove(id: string) { await deletePlan(id); setPlans((current) => current.filter((plan) => plan.id !== id)) }
  return <><PageHeading eyebrow="INDEXEDDB · THIS DEVICE" title={t('savedPlans')} description="Plans remain in this browser and are available offline on this device." />{plans.length === 0 ? <div className="panel empty-state"><CheckCircle2 size={23} /><strong>{t('noSavedPlans')}</strong><Link to="/planner" className="text-link">{t('buildPlan')} <ArrowUpRight size={14} /></Link></div> : <div className="saved-plan-list">{plans.map((plan) => <details className="panel saved-plan" key={plan.id}><summary><span><strong>{plan.title}</strong><small>{new Date(plan.createdAt).toLocaleDateString()} · {plan.mode === 'online' ? 'AI generated' : 'Local template'}</small></span><span className="mode-tag">{guides[plan.disasterType as DisasterType]?.title ?? plan.disasterType}</span></summary><pre className="plan-output">{plan.body}</pre><button className="button button-outline button-small" type="button" onClick={() => void remove(plan.id)}><Trash2 size={14} /> {t('delete')}</button></details>)}</div>}</>
}

function Settings({ t, language, onChange }: { t: (key: string) => string; language: Language; onChange: (value: Language) => void }) {
  return <><PageHeading eyebrow="PREFERENCES" title={t('settings')} description="Choose the language used by the interface and online AI requests." /><section className="panel settings-panel"><label>{t('language')}<select value={language} onChange={(event) => void onChange(event.target.value as Language)}><option>English</option><option>Telugu</option><option>Hindi</option></select></label><div className="settings-safety"><ShieldAlert size={20} /><p>{t('safety')} DisasterAI does not replace local emergency services or official authorities.</p></div></section></>
}

function About({ t }: { t: (key: string) => string }) {
  return <><PageHeading eyebrow="ABOUT DISASTERAI" title={t('about')} description="Prepared Today. Protected Tomorrow." /><section className="panel safety-panel about-panel"><div className="eyebrow">IMPORTANT SAFETY INFORMATION</div><h2>Preparedness support, not emergency dispatch.</h2><ul><li>Use official local authorities for active warnings, evacuation instructions, and current conditions.</li><li>AI-generated guidance is general information and may be incomplete or out of date.</li><li>OpenAI-powered features require an internet connection. Bundled guides and locally saved plans remain available offline after the app has loaded.</li><li>DisasterAI does not provide verified live alerts or a regional emergency number directory in this deployment.</li></ul><div className="official-links"><a href="https://www.ready.gov/" target="_blank" rel="noreferrer">Ready.gov <ArrowUpRight size={14} /></a><a href="https://www.gov.in/" target="_blank" rel="noreferrer">India national portal <ArrowUpRight size={14} /></a></div></section></>
}

export default App
