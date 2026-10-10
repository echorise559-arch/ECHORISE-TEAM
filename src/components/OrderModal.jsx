import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { COUNTRIES, PLATFORMS, SPOTIFY_PACKAGES, SOUNDCLOUD_PACKAGES, DANCE_PACKAGES } from '../data'
import ModalPortal from './ModalPortal'
import Honeypot from './Honeypot'
import { submitForm } from '../utils/submitForm'

const ALL_PACKAGES = [
  ...SPOTIFY_PACKAGES.map(p => ({ ...p, label: `Spotify – ${p.name} ($${p.price})`, paymentLink: p.paymentLink || '' })),
  ...SOUNDCLOUD_PACKAGES.map(p => ({ ...p, label: `SoundCloud – ${p.name} ($${p.price})`, paymentLink: p.paymentLink || '' })),
  ...DANCE_PACKAGES.map(p => ({ ...p, label: `Dance – ${p.name} ($${p.price})`, paymentLink: p.paymentLink || '' })),
  { id: 'custom', name: 'Custom', price: 0, label: 'Custom Campaign (Quote)', paymentLink: '' },
]

const INIT = { artistName: '', email: '', trackLink: '', platform: '', package: '', country: '', notes: '', agreeTerms: false, hp: '' }

export default function OrderModal({ isOpen, onClose, preselect, preselectPkg }) {
  const [form, setForm] = useState({ ...INIT, package: preselect || '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [notice, setNotice] = useState('')
  const overlayRef = useRef(null)

  // Scroll overlay to top when modal opens
  useEffect(() => {
    if (isOpen && overlayRef.current) overlayRef.current.scrollTop = 0
  }, [isOpen])

  // When preselectPkg changes (user clicked a specific package button), prefill package
  useEffect(() => {
    if (preselect) setForm(f => ({ ...f, package: preselect }))
  }, [preselect])

  if (!isOpen) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.artistName.trim()) e.artistName = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.trackLink.trim()) e.trackLink = 'Required'
    if (!form.platform) e.platform = 'Required'
    if (!form.package) e.package = 'Required'
    if (!form.country) e.country = 'Required'
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to continue'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSendError('')
    setNotice('')
    if (sending || !validate()) return
    const pkg = ALL_PACKAGES.find(p => p.id === form.package || p.label === form.package)
    const link = pkg?.paymentLink || ''

    // Open the payment tab right now (inside the click) so phones do not block it
    // after the network request. It is pointed at the payment page once the order is saved.
    const payWin = link ? window.open('', '_blank') : null
    if (payWin) payWin.opener = null

    setSending(true)
    try {
      await submitForm('order', {
        artistName: form.artistName,
        email: form.email,
        trackLink: form.trackLink,
        platform: form.platform,
        package: pkg ? pkg.label : form.package,
        country: form.country,
        notes: form.notes,
        agreeTerms: form.agreeTerms,
        paymentLink: link,
        hp: form.hp,
      })
      if (link) {
        if (payWin) payWin.location.href = link
        else window.location.assign(link)
        setNotice('Your order details were sent to our team. Complete your payment in the new tab.')
      } else {
        setNotice(`Your request was sent to our team. We will email a quote and payment link to ${form.email} within 24 hours.`)
      }
    } catch (err) {
      if (link) {
        // The notification email failed, but the buyer must always be able to pay.
        if (payWin) payWin.location.href = link
        else window.location.assign(link)
        setNotice('Complete your payment in the new tab.')
      } else {
        if (payWin) payWin.close()
        setSendError(err.message)
      }
    } finally {
      setSending(false)
    }
  }

  const inputClass = k => `form-input ${errors[k] ? 'border-red-500' : ''}`

  // Determine selected package name for display
  const selectedPkg = ALL_PACKAGES.find(p => p.id === form.package)

  return (
    <ModalPortal>
    <div ref={overlayRef} className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 700 }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-pink transition-colors text-lg" style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(26,26,26,0.12)' }}>✕</button>

        <div className="mb-7">
          <span className="section-label">Get Started</span>
          <h2 className="font-display font-bold text-3xl mb-2">Place Your <span className="grad-text">Order</span></h2>
          <p className="text-gray-500 text-sm">Fill in the details below and we'll set up your campaign within 24 to 72 hours, depending on your package.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Honeypot value={form.hp} onChange={v => set('hp', v)} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-display font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Artist Name *</label>
              <input name="artistName" className={inputClass('artistName')} placeholder="Your artist / stage name" value={form.artistName} onChange={e => set('artistName', e.target.value)} />
              {errors.artistName && <p className="text-red-400 text-xs mt-1">{errors.artistName}</p>}
            </div>
            <div>
              <label className="block text-xs font-display font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email Address *</label>
              <input name="email" type="email" className={inputClass('email')} placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-display font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Track Link *</label>
              <input name="trackLink" type="url" className={inputClass('trackLink')} placeholder="https://open.spotify.com/track/..." value={form.trackLink} onChange={e => set('trackLink', e.target.value)} />
              {errors.trackLink && <p className="text-red-400 text-xs mt-1">{errors.trackLink}</p>}
            </div>
            <div>
              <label className="block text-xs font-display font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Platform *</label>
              <select name="platform" className={inputClass('platform')} value={form.platform} onChange={e => set('platform', e.target.value)}>
                <option value="">Select platform</option>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.platform && <p className="text-red-400 text-xs mt-1">{errors.platform}</p>}
            </div>
            <div>
              <label className="block text-xs font-display font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Package *</label>
              {selectedPkg ? (
                <div className="form-input flex items-center justify-between" style={{ background: 'rgba(255,106,0,0.06)', border: '1.5px solid rgba(255,106,0,0.35)', color: '#FF6A00', fontWeight: 600, cursor: 'default' }}>
                  <span>{selectedPkg.label}</span>
                  <span style={{ fontSize: 12, opacity: 0.7, fontWeight: 400, color: '#1A1A1A' }}>Selected</span>
                </div>
              ) : (
                <>
                  <select name="package" className={inputClass('package')} value={form.package} onChange={e => set('package', e.target.value)}>
                    <option value="">Select package</option>
                    {ALL_PACKAGES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                  {errors.package && <p className="text-red-400 text-xs mt-1">{errors.package}</p>}
                </>
              )}
            </div>
            <div>
              <label className="block text-xs font-display font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Country *</label>
              <select name="country" className={inputClass('country')} value={form.country} onChange={e => set('country', e.target.value)}>
                <option value="">Select your country</option>
                {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
              </select>
              {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-display font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Notes / Special Requests</label>
              <textarea name="notes" className="form-input resize-none" rows={3} placeholder="Target genre, specific markets, campaign goals, release date…" value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </div>

          <div className="mt-5">
            <label className="flex items-start gap-2.5 text-sm cursor-pointer text-gray-500">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={e => set('agreeTerms', e.target.checked)}
                className="mt-0.5 flex-shrink-0"
                style={{ width: 16, height: 16, accentColor: '#FF6A00' }}
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#FF6A00' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/refund-policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#FF6A00' }}>Refund Policy</Link>
              </span>
            </label>
            {errors.agreeTerms && <p className="text-red-400 text-xs mt-1">{errors.agreeTerms}</p>}
          </div>

          <button type="submit" disabled={sending} className="btn-primary w-full justify-center mt-6 py-4 text-base" style={sending ? { opacity: 0.7, cursor: 'wait' } : undefined}>
            {sending ? 'Sending your order...' : 'Proceed to Payment →'}
          </button>
          {sendError && (
            <p role="alert" className="text-red-500 text-sm text-center mt-3">{sendError}</p>
          )}
          {notice && (
            <p role="status" className="text-sm text-center mt-3" style={{ color: '#1A1A1A' }}>{notice}</p>
          )}
          <p className="text-center text-gray-500 text-xs mt-3">Secure payment · Response within 24 hours</p>
        </form>
      </div>
    </div>
    </ModalPortal>
  )
}
