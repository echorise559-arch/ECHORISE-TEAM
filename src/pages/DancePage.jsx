import useSEO from '../hooks/useSEO'
import { useState } from 'react'
import PageHero from '../components/PageHero'
import PricingCard from '../components/PricingCard'
import OrderModal from '../components/OrderModal'
import SpotifyCustomModal from '../components/SpotifyCustomModal'
import { DANCE_PACKAGES } from '../data'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.72a4.85 4.85 0 0 1-1.01-.03z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const PLATFORMS = [
  { icon: <TikTokIcon />, label: 'TikTok', desc: 'The #1 music discovery platform. One viral dance challenge can reach millions.' },
  { icon: <InstagramIcon />, label: 'Instagram Reels', desc: 'High-retention vertical content that drives follows, saves, and streams.' },
  { icon: <PlayIcon />, label: 'YouTube Shorts', desc: 'Growing rapidly with high monetisation potential for your music.' },
  { icon: <StarIcon />, label: 'Real Creators', desc: "Every dancer is vetted, skilled, and chosen to match your track's energy." },
]

export default function DancePage() {
  useSEO({ title: 'TikTok & Dance Promotion | Echorise Media — Real Creators, Viral Moments', description: 'Real TikTok and Instagram Reels creators making authentic content around your track. Echorise Media dance campaigns spark genuine viral moments for independent artists.', canonical: 'https://echorisemedia.com/dance' })
  const [orderOpen, setOrderOpen] = useState(false)
  const [orderPkg, setOrderPkg] = useState('')
  const [customOpen, setCustomOpen] = useState(false)
  const openOrder = (pkg) => { setOrderPkg(pkg?.id || ''); setOrderOpen(true) }

  return (
    <>
      <PageHero
        label="Dance Video Promotion"
        title={<>Make Your Track<br /><span style={{ background: 'linear-gradient(135deg,#FF6A00,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Go Viral</span></>}
        subtitle="We deploy real dancers on TikTok and Instagram Reels to create the kind of authentic content that sparks viral moments. Virality isn't luck — it's choreography."
        accent="#FF6A00"
        image="https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=900&h=700&fit=crop&crop=center"
      >
        <button onClick={() => openOrder()} className="btn-primary">Launch Dance Campaign →</button>
      </PageHero>

      {/* Platforms */}
      <section className="py-20 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="rounded-3xl overflow-hidden shadow-xl" style={{ height: 380 }}>
              <img src="https://images.unsplash.com/photo-1545959570-a94084071b5d?w=700&h=600&fit=crop&crop=center" alt="Dancers performing" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="section-label" style={{ color: '#FF6A00' }}>Platform Coverage</span>
              <h2 className="font-display font-bold text-3xl mb-5" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Every Major <span className="grad-text">Short-Form Platform</span></h2>
              <div className="flex flex-col gap-4">
                {PLATFORMS.map(({ icon, label, desc }) => (
                  <div key={label} className="glass-card p-4 flex gap-4 items-start">
                    <div className="font-display font-bold text-sm w-36 flex-shrink-0 flex items-center gap-2" style={{ color: '#1A1A1A' }}>
                      <span style={{ color: '#FF6A00', flexShrink: 0 }}>{icon}</span>
                      {label}
                    </div>
                    <p className="text-sm" style={{ color: '#6B6B6B' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mb-14">
            <span className="section-label">Packages</span>
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Dance Video <span className="grad-text">Campaign Plans</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DANCE_PACKAGES.map(pkg => <PricingCard key={pkg.id} pkg={pkg} onOrder={openOrder} />)}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => { setCustomOpen(true) }} className="btn-outline">Request Custom Offer →</button>
          </div>
        </div>
      </section>

      <section className="py-8 px-6" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative h-64">
          <img src="https://images.unsplash.com/photo-1574027542338-98e75acfd385?w=1200&h=500&fit=crop&crop=center" alt="Concert crowd" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,rgba(255,106,0,0.88),rgba(168,85,247,0.82))' }}>
            <div className="text-center">
              <h3 className="font-display font-bold text-2xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Your track deserves to go viral.</h3>
              <button onClick={() => openOrder()} className="px-8 py-3.5 rounded-full font-display font-bold text-sm cursor-pointer transition-all hover:-translate-y-1" style={{ background: '#FF6A00', color: '#FAF7F2' }}>Get Started →</button>
            </div>
          </div>
        </div>
      </section>

      <OrderModal isOpen={orderOpen} onClose={() => { setOrderOpen(false) }} preselect={orderPkg} />
      <SpotifyCustomModal isOpen={customOpen} onClose={() => { setCustomOpen(false) }} />
    </>
  )
}
