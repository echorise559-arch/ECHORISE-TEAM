import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ModalPortal from './ModalPortal'
import Honeypot from './Honeypot'
import { submitForm } from '../utils/submitForm'
import { getPaymentLink, TIERS } from '../data/artistServices'

const SUPPORT_EMAIL = 'support@echorisemedia.com'
const INIT = { artistName: '', email: '', link: '', notes: '', agreeTerms: false, hp: '' }

const labelClass = 'block text-xs font-display font-semibold text-gray-500 mb-1.5 uppercase tracking-wider'

/**
 * Order window for the Artist Services.
 * Step 1: the customer gives us the details we need to start the work.
 * Step 2: the details are emailed to the team, then the payment page opens.
 *
 * The payment page is ALWAYS reachable: if the email step fails, the customer is
 * still sent to pay and is told how to send the details afterwards. A payment is
 * never blocked by a notification problem.
 */
export default function ServiceOrderModal({ isOpen, onClose, service, price: initialPrice }) {
  const [form, setForm] = useState(INIT)
  const [price, setPrice] = useState(initialPrice)
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [done, setDone] = useState(null) // { emailed, popupOpened } once the order step is finished
  const overlayRef = useRef(null)

  // Each time the window opens, start clean on the service and price that was clicked.
  useEffect(() => {
    if (!isOpen) return
    setForm(INIT)
    setPrice(initialPrice)
    setErrors({})
    setSendError('')
    setDone(null)
    setSending(false)
    if (overlayRef.current) overlayRef.current.scrollTop = 0
  }, [isOpen, service?.id, initialPrice])

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen || !service) return null

  const link = getPaymentLink(price)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inputClass = k => `form-input ${errors[k] ? 'border-red-500' : ''}`
  const variable = service.prices.length > 1

  const validate = () => {
    const e = {}
    if (!form.artistName.trim()) e.artistName = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Valid email required'
    if (service.linkRequired && !form.link.trim()) e.link = 'Required'
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to continue'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (sending || done) return
    setSendError('')
    if (!link) {
      setSendError('This price is not available right now. Please close this window and try again.')
      return
    }
    if (!validate()) return

    // Open the payment tab inside the click so phones do not block it after the
    // network request. It is pointed at the payment page once the order is saved.
    let payWin = null
    try {
      payWin = window.open('', '_blank')
      if (payWin) payWin.opener = null
    } catch { payWin = null }

    setSending(true)
    let emailed = true
    try {
      const tierText = variable ? ` (${TIERS[price].label})` : ''
      await submitForm('order', {
        artistName: form.artistName.trim(),
        email: form.email.trim(),
        trackLink: form.link.trim() || 'Not provided',
        platform: 'Artist Services',
        package: `Artist Services – ${service.name}${tierText} ($${price})`,
        country: 'Not asked',
        notes: form.notes,
        agreeTerms: form.agreeTerms,
        paymentLink: link,
        hp: form.hp,
      })
    } catch {
      emailed = false
    }

    // Whatever happened with the email, the customer must always be able to pay.
    let popupOpened = false
    if (payWin) {
      try { payWin.location.href = link; popupOpened = true } catch { popupOpened = false }
    }
    setDone({ emailed, popupOpened })
    setSending(false)
  }

  // ── Step 2: confirmation + payment ─────────────────────────────────────────
  if (done) {
    return (
      <ModalPortal>
        <div ref={overlayRef} className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
          <div className="modal-box text-center" style={{ maxWidth: 480 }}>
            <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-pink transition-colors text-lg" style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(26,26,26,0.12)' }}>✕</button>
            <span className="section-label">{done.emailed ? 'Details received' : 'One more step'}</span>
            <h2 className="font-display font-bold text-2xl mb-3">Complete Your <span className="grad-text">Payment</span></h2>
            <p className="text-sm mb-1" style={{ color: '#1A1A1A', fontWeight: 600 }}>{service.name}{variable ? ` · ${TIERS[price].label}` : ''}</p>
            <p className="font-display font-bold text-4xl mb-4" style={{ color: '#FF6A00' }}>${price}</p>

            {done.emailed ? (
              <p className="text-gray-500 text-sm mb-5">
                Your details were sent to our team. {done.popupOpened ? 'The payment page opened in a new tab. ' : ''}Your order starts once your payment is confirmed, and we will email <strong className="text-gray-900">{form.email}</strong> with the next steps.
              </p>
            ) : (
              <p className="text-gray-500 text-sm mb-5">
                We could not send your details automatically, but you can still pay now. After paying, please email your brief to{' '}
                <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${service.name} order: ${form.artistName.trim()}`)}`} className="underline" style={{ color: '#FF6A00' }}>{SUPPORT_EMAIL}</a>{' '}
                so we can start.
              </p>
            )}

            <a href={link} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center py-4 text-base">
              {done.popupOpened ? `Open the $${price} payment page again →` : `Pay $${price} Now →`}
            </a>
            <button onClick={onClose} className="mt-4 text-sm underline text-gray-500">Close</button>
          </div>
        </div>
      </ModalPortal>
    )
  }

  // ── Step 1: details ────────────────────────────────────────────────────────
  return (
    <ModalPortal>
      <div ref={overlayRef} className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box" style={{ maxWidth: 620 }}>
          <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-pink transition-colors text-lg" style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(26,26,26,0.12)' }}>✕</button>

          <div className="mb-6">
            <span className="section-label">Artist Services</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">{service.name}</h2>
            <p className="text-gray-500 text-sm">Tell us what we need to get started. You will go to the secure payment page right after.</p>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl px-5 py-4 mb-6" style={{ background: 'rgba(255,106,0,0.06)', border: '1.5px solid rgba(255,106,0,0.30)' }}>
            <span className="text-sm font-display font-semibold" style={{ color: '#1A1A1A' }}>{variable ? `${TIERS[price].label} option` : 'Price'}</span>
            <span className="font-display font-bold text-2xl" style={{ color: '#FF6A00' }}>${price}</span>
          </div>

          {variable && (
            <div className="mb-6">
              <span className={labelClass}>Choose your option</span>
              <div role="radiogroup" aria-label="Choose your option" className="grid grid-cols-2 gap-3">
                {service.prices.map(p => (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={price === p}
                    onClick={() => setPrice(p)}
                    className="rounded-xl px-4 py-3 text-left transition-all"
                    style={{
                      background: price === p ? 'rgba(255,106,0,0.10)' : 'rgba(0,0,0,0.03)',
                      border: price === p ? '1.5px solid rgba(255,106,0,0.60)' : '1.5px solid rgba(26,26,26,0.12)',
                      minHeight: 48,
                    }}
                  >
                    <span className="block font-display font-bold text-lg" style={{ color: price === p ? '#FF6A00' : '#1A1A1A' }}>${p}</span>
                    <span className="block text-xs" style={{ color: '#6B6B6B' }}>{TIERS[p].label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: '#6B6B6B' }}>{TIERS[price].note}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Honeypot value={form.hp} onChange={v => set('hp', v)} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="svc-artist">Artist Name *</label>
                <input id="svc-artist" name="artistName" autoComplete="name" className={inputClass('artistName')} placeholder="Your artist / stage name" value={form.artistName} onChange={e => set('artistName', e.target.value)} />
                {errors.artistName && <p className="text-red-400 text-xs mt-1">{errors.artistName}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="svc-email">Email Address *</label>
                <input id="svc-email" name="email" type="email" autoComplete="email" className={inputClass('email')} placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="svc-link">{service.linkLabel}{service.linkRequired ? ' *' : ' (optional)'}</label>
                <input id="svc-link" name="link" inputMode="url" autoCapitalize="none" className={inputClass('link')} placeholder="https://" value={form.link} onChange={e => set('link', e.target.value)} />
                {errors.link && <p className="text-red-400 text-xs mt-1">{errors.link}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="svc-notes">{service.notesLabel} (optional)</label>
                <textarea id="svc-notes" name="notes" className="form-input resize-none" rows={4} placeholder={service.notesPlaceholder} value={form.notes} onChange={e => set('notes', e.target.value)} />
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
              {sending ? 'Please wait...' : `Continue to Payment · $${price} →`}
            </button>
            {sendError && <p role="alert" className="text-red-500 text-sm text-center mt-3">{sendError}</p>}
            <p className="text-center text-gray-500 text-xs mt-3">Secure payment on the next step · No account needed</p>
          </form>
        </div>
      </div>
    </ModalPortal>
  )
}
