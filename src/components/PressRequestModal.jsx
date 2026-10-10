import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { COUNTRIES } from '../data'
import ModalPortal from './ModalPortal'
import Honeypot from './Honeypot'
import { submitForm } from '../utils/submitForm'

export const PRESS_OUTLETS = [
  'Rapper Journal',
  'US Times Now',
  'Rapper Hype',
  'Music Star News',
  'Rapper Daily',
]

export const PRESS_PACKAGES = [
  { id: 'starter', name: 'Starter', outlets: 1 },
  { id: 'pro', name: 'Pro', outlets: 2 },
  { id: 'elite', name: 'Elite', outlets: PRESS_OUTLETS.length },
]

const INIT = { artistName: '', email: '', musicLink: '', country: '', notes: '', hp: '' }

const outletsFor = (pkgId, current) => {
  const pkg = PRESS_PACKAGES.find(p => p.id === pkgId)
  if (!pkg) return []
  if (pkg.id === 'elite') return [...PRESS_OUTLETS]
  return current.filter(o => PRESS_OUTLETS.includes(o)).slice(0, pkg.outlets)
}

export default function PressRequestModal({ isOpen, onClose, preselect }) {
  const [form, setForm] = useState(INIT)
  const [pkgId, setPkgId] = useState(preselect || '')
  const [outlets, setOutlets] = useState(() => outletsFor(preselect || '', []))
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const overlayRef = useRef(null)

  // Each time the window opens, start from the package the visitor clicked (if any).
  useEffect(() => {
    if (!isOpen) return
    const id = PRESS_PACKAGES.some(p => p.id === preselect) ? preselect : ''
    setPkgId(id)
    setOutlets(outletsFor(id, []))
    setErrors({})
    setSendError('')
    if (overlayRef.current) overlayRef.current.scrollTop = 0
  }, [isOpen, preselect])

  if (!isOpen) return null

  const pkg = PRESS_PACKAGES.find(p => p.id === pkgId)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const choosePackage = (id) => {
    setPkgId(id)
    setOutlets(prev => outletsFor(id, prev))
  }

  const toggleOutlet = (name) => {
    if (!pkg || pkg.id === 'elite') return
    setOutlets(prev => {
      if (prev.includes(name)) return prev.filter(o => o !== name)
      if (pkg.outlets === 1) return [name]
      if (prev.length >= pkg.outlets) return prev
      return [...prev, name]
    })
  }

  const validate = () => {
    const e = {}
    if (!form.artistName.trim()) e.artistName = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.musicLink.trim()) e.musicLink = 'Required'
    if (!form.country) e.country = 'Required'
    if (!pkg) e.package = 'Please choose a package'
    else if (outlets.length !== pkg.outlets) {
      e.outlets = pkg.outlets === 1 ? 'Please choose 1 outlet' : `Please choose ${pkg.outlets} outlets`
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (sending || !validate()) return
    setSendError('')
    setSending(true)
    try {
      const summary = `Package: ${pkg.name}\nOutlets: ${outlets.join(', ')}`
      const extra = form.notes.trim()
      await submitForm('custom_request', {
        platform: 'Press Features',
        artistName: form.artistName,
        email: form.email,
        trackLink: form.musicLink,
        country: form.country,
        notes: extra ? `${summary}\n\n${extra}` : summary,
        hp: form.hp,
      })
      setSubmitted(true)
    } catch (err) {
      setSendError(err.message)
    } finally {
      setSending(false)
    }
  }

  const resetAll = () => {
    setSubmitted(false)
    setSendError('')
    setErrors({})
    setForm(INIT)
    setPkgId('')
    setOutlets([])
    onClose()
  }

  const inputClass = k => `form-input ${errors[k] ? 'border-red-500' : ''}`
  const labelClass = 'block text-xs font-display font-semibold text-gray-500 mb-1.5 uppercase tracking-wider'

  if (submitted) {
    return (
      <ModalPortal>
        <div ref={overlayRef} className="modal-overlay" onClick={e => e.target === e.currentTarget && resetAll()}>
          <div className="modal-box text-center" style={{ maxWidth: 440 }}>
            <h2 className="font-display font-bold text-2xl mb-3" style={{ color: '#FF6A00' }}>Request Received</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Thank you. We will email the next steps for your <strong>{pkg ? pkg.name : 'press'}</strong> feature to <strong className="text-gray-900">{form.email}</strong> within 24 hours.
            </p>
            <button onClick={resetAll} className="btn-primary justify-center w-full">Done →</button>
          </div>
        </div>
      </ModalPortal>
    )
  }

  return (
    <ModalPortal>
      <div ref={overlayRef} className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box" style={{ maxWidth: 700 }}>
          <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-pink transition-colors text-lg" style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(26,26,26,0.12)' }}>✕</button>

          <div className="mb-7">
            <span className="section-label">Press Features</span>
            <h2 className="font-display font-bold text-3xl mb-2">Request Your <span className="grad-text">Feature</span></h2>
            <p className="text-gray-500 text-sm">Tell us about your music and choose where you would like to be featured. We will reply with the next steps.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Honeypot value={form.hp} onChange={v => set('hp', v)} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Artist Name *</label>
                <input name="artistName" className={inputClass('artistName')} placeholder="Your artist / stage name" value={form.artistName} onChange={e => set('artistName', e.target.value)} />
                {errors.artistName && <p className="text-red-400 text-xs mt-1">{errors.artistName}</p>}
              </div>
              <div>
                <label className={labelClass}>Email Address *</label>
                <input name="email" type="email" className={inputClass('email')} placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Music Link *</label>
                <input name="musicLink" type="url" className={inputClass('musicLink')} placeholder="Spotify, YouTube or any music page link" value={form.musicLink} onChange={e => set('musicLink', e.target.value)} />
                {errors.musicLink && <p className="text-red-400 text-xs mt-1">{errors.musicLink}</p>}
              </div>
              <div>
                <label className={labelClass}>Package *</label>
                <select name="package" className={inputClass('package')} value={pkgId} onChange={e => choosePackage(e.target.value)}>
                  <option value="">Select package</option>
                  {PRESS_PACKAGES.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.outlets === 1 ? '1 outlet' : `${p.outlets} outlets`})</option>
                  ))}
                </select>
                {errors.package && <p className="text-red-400 text-xs mt-1">{errors.package}</p>}
              </div>
              <div>
                <label className={labelClass}>Country *</label>
                <select name="country" className={inputClass('country')} value={form.country} onChange={e => set('country', e.target.value)}>
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                </select>
                {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Outlets {pkg ? (pkg.id === 'elite' ? '(all included)' : `(choose ${pkg.outlets})`) : ''}
                </label>
                {!pkg && <p className="text-gray-400 text-sm">Choose a package first to select your outlets.</p>}
                {pkg && (
                  <div className="flex flex-wrap gap-2">
                    {PRESS_OUTLETS.map(name => {
                      const on = outlets.includes(name)
                      const locked = pkg.id === 'elite'
                      const full = !on && pkg.outlets > 1 && outlets.length >= pkg.outlets
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => toggleOutlet(name)}
                          disabled={locked || full}
                          aria-pressed={on}
                          className="px-4 py-2 rounded-full text-sm font-display font-semibold transition-all"
                          style={{
                            background: on ? 'rgba(255,106,0,0.10)' : 'rgba(0,0,0,0.03)',
                            border: on ? '1.5px solid rgba(255,106,0,0.55)' : '1.5px solid rgba(26,26,26,0.12)',
                            color: on ? '#FF6A00' : '#1A1A1A',
                            opacity: full ? 0.45 : 1,
                            cursor: locked || full ? 'default' : 'pointer',
                          }}
                        >
                          {name}
                        </button>
                      )
                    })}
                  </div>
                )}
                {errors.outlets && <p className="text-red-400 text-xs mt-1">{errors.outlets}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Your Story / Notes</label>
                <textarea name="notes" className="form-input resize-none" rows={4} placeholder="Tell us about your music, recent releases, achievements and anything you want the article to highlight…" value={form.notes} onChange={e => set('notes', e.target.value)} />
              </div>
            </div>

            <button type="submit" disabled={sending} className="btn-primary w-full justify-center mt-6 py-4 text-base" style={sending ? { opacity: 0.7, cursor: 'wait' } : undefined}>
              {sending ? 'Sending your request...' : 'Send Request →'}
            </button>
            {sendError && (
              <p role="alert" className="text-red-500 text-sm text-center mt-3">{sendError}</p>
            )}
            <p className="text-center text-gray-500 text-xs mt-3">
              By sending this request you agree to our{' '}
              <Link to="/terms" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#FF6A00' }}>Terms of Service</Link>
              {' '}and{' '}
              <Link to="/refund-policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#FF6A00' }}>Refund Policy</Link>
              . Response within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </ModalPortal>
  )
}
