// Hidden dashboard for the Artist of the Week / Month / Year spotlight (/admin/artists).
// Not linked anywhere on the public site. The password is checked on the server.

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, ImagePlus, LogOut, Send, Loader2 } from 'lucide-react'
import { login, hasValidSession, clearToken, adminFetch } from '../utils/adminAuth'

const API = '/.netlify/functions/admin-artists'
const SLOT_LABEL = { week: 'Artist of the Week', month: 'Artist of the Month', year: 'Artist of the Year' }
const LABEL_PLACEHOLDER = { week: 'Week of 5 October', month: 'October 2026', year: '2026' }
const EMPTY = { name: '', tagline: '', label: '', description: '', socials: [], streaming: [] }
const MAX_SOURCE_BYTES = 15 * 1024 * 1024
const MAX_UPLOAD_BYTES = 1_400_000

function formFrom(record) {
  if (!record) return { ...EMPTY, socials: [], streaming: [] }
  return {
    name: record.name || '',
    tagline: record.tagline || '',
    label: record.label || '',
    description: record.description || '',
    socials: (record.socials || []).map(l => ({ ...l })),
    streaming: (record.streaming || []).map(l => ({ ...l })),
  }
}

// Centre-crops to a square, shrinks to at most 1000px and returns a JPEG data URL.
function processImage(file) {
  return new Promise((resolve, reject) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      reject(new Error('Please choose a JPG, PNG or WebP image.'))
      return
    }
    if (file.size > MAX_SOURCE_BYTES) {
      reject(new Error('That image is larger than 15 MB. Choose a smaller one.'))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const side = Math.min(img.naturalWidth, img.naturalHeight)
        const out = Math.min(side, 1000)
        const canvas = document.createElement('canvas')
        canvas.width = out
        canvas.height = out
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, out, out)
        const sx = (img.naturalWidth - side) / 2
        const sy = (img.naturalHeight - side) / 2
        ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out)
        let quality = 0.86
        let dataUrl = canvas.toDataURL('image/jpeg', quality)
        while (dataUrl.length * 0.75 > MAX_UPLOAD_BYTES && quality > 0.5) {
          quality -= 0.1
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }
        resolve(dataUrl)
      } catch {
        reject(new Error('That image could not be processed. Try another file.'))
      } finally {
        URL.revokeObjectURL(url)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('That file could not be read as an image.'))
    }
    img.src = url
  })
}

// ── Sign in ───────────────────────────────────────────────────────────────────
function SignIn({ onDone, notice }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(notice || '')

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await login(password)
      setPassword('')
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="ad-center">
      <div className="ad-brand">
        <span className="ad-logo">echorise<span>.</span></span>
        <span className="ad-chip">Admin Access</span>
      </div>
      <form className="ad-login" onSubmit={submit}>
        <h1 className="ad-h1">Sign In</h1>
        <p className="ad-sub">Enter your password to manage the artist spotlight.</p>
        <label className="ad-label" htmlFor="ad-pass">Password</label>
        <input
          id="ad-pass"
          type="password"
          className="ad-input"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          autoComplete="current-password"
          autoFocus
        />
        {error && <p className="ad-error" role="alert">{error}</p>}
        <button type="submit" className="ad-btn ad-btn--primary ad-btn--block" disabled={busy || !password}>
          {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

// ── Link rows (social / streaming) ───────────────────────────────────────────
function LinkEditor({ title, hint, rows, platforms, max, onChange }) {
  const update = (i, patch) => onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  const remove = i => onChange(rows.filter((_, idx) => idx !== i))
  const add = () => onChange([...rows, { platform: platforms[0], url: '' }])
  return (
    <fieldset className="ad-field">
      <legend className="ad-label">{title} <span className="ad-count">{rows.length}/{max}</span></legend>
      {hint && <p className="ad-hint">{hint}</p>}
      <div className="ad-rows">
        {rows.map((row, i) => (
          <div className="ad-row" key={i}>
            <select
              className="ad-input ad-select"
              value={row.platform}
              onChange={e => update(i, { platform: e.target.value })}
              aria-label={`${title} platform ${i + 1}`}
            >
              {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input
              className="ad-input"
              type="url"
              inputMode="url"
              placeholder="https://"
              value={row.url}
              onChange={e => update(i, { url: e.target.value })}
              aria-label={`${title} link ${i + 1}`}
            />
            <button type="button" className="ad-icon-btn" onClick={() => remove(i)} aria-label={`Remove ${title} link ${i + 1}`}>
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="ad-btn ad-btn--line ad-btn--sm" onClick={add} disabled={rows.length >= max}>
        <Plus size={15} aria-hidden="true" /> Add link
      </button>
    </fieldset>
  )
}

// ── One slot editor ──────────────────────────────────────────────────────────
function SlotEditor({ slot, record, options, onSaved, onCleared, onExpired }) {
  const [form, setForm] = useState(() => formFrom(record))
  // undefined = keep current image, null = remove it, string = new image (data URL)
  const [imageChange, setImageChange] = useState(undefined)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const fileRef = useRef(null)
  const limits = options.limits

  const preview = imageChange === undefined ? (record?.imageUrl || '') : (imageChange || '')
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setMsg(null) }

  const fail = (err) => {
    if (err.code === 'UNAUTHORIZED') { onExpired(); return }
    setMsg({ type: 'error', text: err.message })
  }

  const pickImage = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setMsg(null)
    try {
      setImageChange(await processImage(file))
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    }
  }

  const save = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!form.name.trim()) { setMsg({ type: 'error', text: 'Artist name is required.' }); return }
    setBusy(true)
    setMsg(null)
    try {
      const data = {
        ...form,
        socials: form.socials.filter(l => l.url.trim()),
        streaming: form.streaming.filter(l => l.url.trim()),
      }
      const payload = { slot, data }
      if (imageChange !== undefined) payload.image = imageChange
      const res = await adminFetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'Could not save. Please try again.')
      setImageChange(undefined)
      setForm(formFrom(body[slot]))
      onSaved(slot, body[slot])
      setMsg({ type: 'ok', text: 'Saved. The change is live on the website.' })
    } catch (err) {
      fail(err)
    } finally {
      setBusy(false)
    }
  }

  const clear = async () => {
    if (busy) return
    setBusy(true)
    setMsg(null)
    try {
      const res = await adminFetch(`${API}?slot=${slot}`, { method: 'DELETE' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'Could not clear. Please try again.')
      setForm(formFrom(null))
      setImageChange(undefined)
      setConfirmClear(false)
      onCleared(slot)
      setMsg({ type: 'ok', text: 'Cleared. This slot is no longer shown on the website.' })
    } catch (err) {
      fail(err)
    } finally {
      setBusy(false)
    }
  }

  const live = !!record

  return (
    <form className="ad-card" onSubmit={save} noValidate>
      <div className="ad-card-head">
        <h2 className="ad-h2">{SLOT_LABEL[slot]}</h2>
        <span className={`ad-status ${live ? 'is-live' : ''}`}>{live ? 'Live on the website' : 'Empty, hidden from the website'}</span>
      </div>

      <div className="ad-field">
        <span className="ad-label">Artist image</span>
        <div className="ad-image-row">
          <div className="ad-image-box">
            {preview ? <img src={preview} alt="Artist preview" /> : <span>No image</span>}
          </div>
          <div className="ad-image-actions">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} hidden />
            <button type="button" className="ad-btn ad-btn--line ad-btn--sm" onClick={() => fileRef.current?.click()}>
              <ImagePlus size={15} aria-hidden="true" /> {preview ? 'Replace image' : 'Upload image'}
            </button>
            {preview && (
              <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => { setImageChange(null); setMsg(null) }}>
                Remove image
              </button>
            )}
            <p className="ad-hint">JPG, PNG or WebP. It is cropped to a square and resized automatically.</p>
          </div>
        </div>
      </div>

      <div className="ad-grid2">
        <div className="ad-field">
          <label className="ad-label" htmlFor={`${slot}-name`}>Artist name *</label>
          <input id={`${slot}-name`} className="ad-input" value={form.name} maxLength={limits.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="ad-field">
          <label className="ad-label" htmlFor={`${slot}-label`}>Period label</label>
          <input id={`${slot}-label`} className="ad-input" value={form.label} maxLength={limits.label} placeholder={LABEL_PLACEHOLDER[slot]} onChange={e => set('label', e.target.value)} />
        </div>
      </div>

      <div className="ad-field">
        <label className="ad-label" htmlFor={`${slot}-tag`}>Genre or location line</label>
        <input id={`${slot}-tag`} className="ad-input" value={form.tagline} maxLength={limits.tagline} placeholder="Afrobeats, Lagos" onChange={e => set('tagline', e.target.value)} />
      </div>

      <div className="ad-field">
        <label className="ad-label" htmlFor={`${slot}-desc`}>Description <span className="ad-count">{form.description.length}/{limits.description}</span></label>
        <textarea id={`${slot}-desc`} className="ad-input ad-textarea" rows={6} value={form.description} maxLength={limits.description} onChange={e => set('description', e.target.value)} />
      </div>

      <LinkEditor
        title="Streaming links"
        hint="Shown under the description as Listen buttons."
        rows={form.streaming}
        platforms={options.streamingPlatforms}
        max={limits.maxStreaming}
        onChange={rows => set('streaming', rows)}
      />
      <LinkEditor
        title="Social links"
        hint="Shown under the streaming links as Follow buttons."
        rows={form.socials}
        platforms={options.socialPlatforms}
        max={limits.maxSocials}
        onChange={rows => set('socials', rows)}
      />

      {msg && <p className={msg.type === 'ok' ? 'ad-ok' : 'ad-error'} role={msg.type === 'ok' ? 'status' : 'alert'}>{msg.text}</p>}

      <div className="ad-actions">
        <button type="submit" className="ad-btn ad-btn--primary" disabled={busy}>
          {busy ? <><Loader2 size={16} className="ad-spin" aria-hidden="true" /> Saving...</> : 'Save and publish'}
        </button>
        {live && !confirmClear && (
          <button type="button" className="ad-btn ad-btn--danger" onClick={() => setConfirmClear(true)} disabled={busy}>
            Clear this slot
          </button>
        )}
        {live && confirmClear && (
          <span className="ad-confirm">
            <span>Remove the artist, image and links?</span>
            <button type="button" className="ad-btn ad-btn--danger ad-btn--sm" onClick={clear} disabled={busy}>Yes, clear</button>
            <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => setConfirmClear(false)} disabled={busy}>Cancel</button>
          </span>
        )}
      </div>
    </form>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminArtistsPage() {
  const [phase, setPhase] = useState('checking') // checking | signin | ready
  const [notice, setNotice] = useState('')
  const [data, setData] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [tab, setTab] = useState('week')
  const [mail, setMail] = useState({ busy: false, msg: null })

  // Keep this page out of search results and set a clear tab title.
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Artist Spotlight Admin | Echorise Media'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => { document.title = prevTitle; document.head.removeChild(meta) }
  }, [])

  const expire = () => {
    clearToken()
    setData(null)
    setNotice('Session expired. Please sign in again.')
    setPhase('signin')
  }

  const load = async () => {
    setLoadError('')
    try {
      const res = await adminFetch(API)
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'Could not load the dashboard.')
      setData(body)
      setPhase('ready')
    } catch (err) {
      if (err.code === 'UNAUTHORIZED') { expire(); return }
      setLoadError(err.message)
      setPhase('ready')
    }
  }

  useEffect(() => {
    let alive = true
    hasValidSession().then(ok => {
      if (!alive) return
      if (ok) { setPhase('ready'); load() } else setPhase('signin')
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signedIn = () => { setNotice(''); setPhase('ready'); load() }
  const signOut = () => { clearToken(); setData(null); setNotice(''); setPhase('signin') }

  const onSaved = (slot, record) => setData(d => ({ ...d, [slot]: record }))
  const onCleared = slot => setData(d => ({ ...d, [slot]: null }))

  const sendTest = async () => {
    if (mail.busy) return
    setMail({ busy: true, msg: null })
    try {
      const res = await adminFetch('/.netlify/functions/admin-test-email', { method: 'POST' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'The test email could not be sent.')
      setMail({ busy: false, msg: { type: 'ok', text: `Test email sent to ${body.recipients.join(', ')}. Check the inbox and the spam folder.` } })
    } catch (err) {
      if (err.code === 'UNAUTHORIZED') { expire(); return }
      setMail({ busy: false, msg: { type: 'error', text: err.message } })
    }
  }

  const tabs = useMemo(() => [['week', SLOT_LABEL.week], ['month', SLOT_LABEL.month], ['year', SLOT_LABEL.year]], [])

  if (phase === 'checking') return <div className="ad-page" />
  if (phase === 'signin') return <div className="ad-page"><SignIn onDone={signedIn} notice={notice} /></div>

  return (
    <div className="ad-page">
      <header className="ad-top">
        <div className="ad-top-inner">
          <div className="ad-brand ad-brand--row">
            <span className="ad-logo">echorise<span>.</span></span>
            <span className="ad-chip">Artist Spotlight</span>
          </div>
          <nav className="ad-nav" aria-label="Admin">
            <Link to="/admin/invoice" className="ad-link">Invoices</Link>
            <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={signOut}>
              <LogOut size={15} aria-hidden="true" /> Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="ad-main">
        <p className="ad-intro">
          Add or change the featured artists shown on the home page. A slot with no artist stays hidden, and
          clearing a slot removes its text, image and links.
        </p>

        {loadError && (
          <div className="ad-card">
            <p className="ad-error" role="alert">{loadError}</p>
            <button type="button" className="ad-btn ad-btn--primary" onClick={load}>Try again</button>
          </div>
        )}

        {data && (
          <>
            <div className="ad-tabs" role="tablist" aria-label="Spotlight slot">
              {tabs.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  className={`ad-tab${tab === id ? ' is-active' : ''}`}
                  onClick={() => setTab(id)}
                >
                  {label}
                  {data[id] && <span className="ad-dot" aria-label="live" />}
                </button>
              ))}
            </div>

            {/* key remounts the editor when switching between Week, Month and Year */}
            <SlotEditor
              key={tab}
              slot={tab}
              record={data[tab]}
              options={data.options}
              onSaved={onSaved}
              onCleared={onCleared}
              onExpired={expire}
            />

            <section className="ad-card">
              <h2 className="ad-h2">Email check</h2>
              <p className="ad-hint">Sends a test message to the inboxes that receive website forms, so you can confirm email works after deploying.</p>
              {mail.msg && <p className={mail.msg.type === 'ok' ? 'ad-ok' : 'ad-error'} role={mail.msg.type === 'ok' ? 'status' : 'alert'}>{mail.msg.text}</p>}
              <div className="ad-actions">
                <button type="button" className="ad-btn ad-btn--line" onClick={sendTest} disabled={mail.busy}>
                  {mail.busy ? <><Loader2 size={16} className="ad-spin" aria-hidden="true" /> Sending...</> : <><Send size={15} aria-hidden="true" /> Send test email</>}
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
