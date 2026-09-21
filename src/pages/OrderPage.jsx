import useSEO from '../hooks/useSEO'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COUNTRIES, PLATFORMS, SPOTIFY_PACKAGES, SOUNDCLOUD_PACKAGES, CHART_PACKAGES, DANCE_PACKAGES } from '../data'
import PageHero from '../components/PageHero'

const ALL_PACKAGES = [
  ...SPOTIFY_PACKAGES.map(p => ({ ...p, label: `Spotify – ${p.name}`, category: 'Spotify', paymentLink: p.paymentLink || '' })),
  ...SOUNDCLOUD_PACKAGES.map(p => ({ ...p, label: `SoundCloud – ${p.name}`, category: 'SoundCloud', paymentLink: p.paymentLink || '' })),
  ...CHART_PACKAGES.map(p => ({ ...p, label: `Chart – ${p.name}`, category: 'Chart', paymentLink: p.paymentLink || '' })),
  ...DANCE_PACKAGES.map(p => ({ ...p, label: `Dance – ${p.name}`, category: 'Dance', paymentLink: p.paymentLink || '' })),
  { id: 'custom', name: 'Custom', price: 0, label: 'Custom Campaign', category: 'Custom', features: [], paymentLink: '' },
]

const INIT = { artistName: '', email: '', trackLink: '', platform: '', package: '', country: '', notes: '', agreeTerms: false }

// ── Main Order Page ───────────────────────────────────────────────────────────
export default function OrderPage() {
  useSEO({ title: 'Order Music Promotion | Echorise Media', description: 'Start your music promotion campaign today. Choose a Spotify, SoundCloud, YouTube, Apple Music, chart or TikTok package and get real results within 24-48 hours.', canonical: 'https://echorisemedia.com/order' })

  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})
  const [linkError, setLinkError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const selectedPkg = ALL_PACKAGES.find(p => p.id === form.package)

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

  const handleOrder = (e) => {
    e.preventDefault()
    setLinkError('')
    if (!validate()) return
    const pkg = ALL_PACKAGES.find(p => p.id === form.package)
    if (!pkg?.paymentLink) {
      setLinkError('Payment link not available. Please contact us.')
      return
    }
    window.open(pkg.paymentLink, '_blank')
  }

  return (
    <>
      <PageHero
        label="Place Your Order"
        title={<>Start Your <span className="grad-text">Campaign</span></>}
        subtitle="Complete the form below to launch your music promotion campaign. We'll begin within 24 hours of your order."
        image="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=900&h=700&fit=crop&crop=center"
      />

      <section className="py-10 px-6 pb-28" style={{ background: '#FFFFFF' }}>
        <div className="max-w-3xl mx-auto">

          <div className="glass-card p-8">
            <h3 className="font-display font-bold text-xl text-gray-900 mb-6">Campaign Details</h3>
            <form onSubmit={handleOrder}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['artistName','Artist Name','Your artist / stage name','text'],['email','Email Address','your@email.com','email']].map(([k,label,ph,type]) => (
                  <div key={k}>
                    <label className="block text-xs font-display font-semibold text-muted mb-1.5 uppercase tracking-wider">{label} *</label>
                    <input name={k} type={type} className={`form-input ${errors[k] ? 'border-red-500' : ''}`} placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)} />
                    {errors[k] && <p className="text-red-400 text-xs mt-1">{errors[k]}</p>}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-display font-semibold text-muted mb-1.5 uppercase tracking-wider">Track Link *</label>
                  <input name="trackLink" type="url" className={`form-input ${errors.trackLink ? 'border-red-500' : ''}`} placeholder="https://open.spotify.com/track/..." value={form.trackLink} onChange={e => set('trackLink', e.target.value)} />
                  {errors.trackLink && <p className="text-red-400 text-xs mt-1">{errors.trackLink}</p>}
                </div>
                <div>
                  <label className="block text-xs font-display font-semibold text-muted mb-1.5 uppercase tracking-wider">Platform *</label>
                  <select name="platform" className={`form-input ${errors.platform ? 'border-red-500' : ''}`} value={form.platform} onChange={e => set('platform', e.target.value)}>
                    <option value="">Select platform</option>
                    {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                  </select>
                  {errors.platform && <p className="text-red-400 text-xs mt-1">{errors.platform}</p>}
                </div>
                <div>
                  <label className="block text-xs font-display font-semibold text-muted mb-1.5 uppercase tracking-wider">Package *</label>
                  <select name="package" className={`form-input ${errors.package ? 'border-red-500' : ''}`} value={form.package} onChange={e => set('package', e.target.value)}>
                    <option value="">Select package</option>
                    {['Spotify','SoundCloud','Chart','Dance','Custom'].map(cat => (
                      <optgroup key={cat} label={`── ${cat} ──`}>
                        {ALL_PACKAGES.filter(p => p.category === cat).map(p => (
                          <option key={p.id} value={p.id}>{p.label} {p.price > 0 ? `($${p.price})` : ''}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {errors.package && <p className="text-red-400 text-xs mt-1">{errors.package}</p>}
                </div>
                <div>
                  <label className="block text-xs font-display font-semibold text-muted mb-1.5 uppercase tracking-wider">Country *</label>
                  <select name="country" className={`form-input ${errors.country ? 'border-red-500' : ''}`} value={form.country} onChange={e => set('country', e.target.value)}>
                    <option value="">Select your country</option>
                    {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                  </select>
                  {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-display font-semibold text-muted mb-1.5 uppercase tracking-wider">Notes / Special Requests</label>
                  <textarea name="notes" className="form-input resize-none" rows={3} placeholder="Target genre, specific markets, campaign goals, release date…" value={form.notes} onChange={e => set('notes', e.target.value)} />
                </div>
              </div>

              <div className="mt-5">
                <label className="flex items-start gap-2.5 text-sm cursor-pointer" style={{ color: '#6B6B6B' }}>
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

              <button type="submit" className="btn-primary w-full justify-center mt-6 py-4 text-base">Proceed to Payment →</button>
              {linkError && (
                <p className="text-red-400 text-xs text-center mt-3">{linkError}</p>
              )}
              <p className="text-center text-muted text-xs mt-3">Secure payment · Response within 24 hours</p>
            </form>
          </div>

        </div>
      </section>
    </>
  )
}
