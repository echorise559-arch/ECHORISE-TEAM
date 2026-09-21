import useSEO from '../hooks/useSEO'
import { useState } from 'react'
import PageHero from '../components/PageHero'
import PricingCard from '../components/PricingCard'
import SpotifyCustomModal from '../components/SpotifyCustomModal'
import OrderModal from '../components/OrderModal'
import FAQSection from '../components/FAQSection'
import { SPOTIFY_PACKAGES } from '../data'

/* ── Feature SVG Icons ───────────────────────────────────────────── */
const TargetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
)

const NetworkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
    <circle cx="12" cy="5" r="2"/>
    <circle cx="5" cy="19" r="2"/>
    <circle cx="19" cy="19" r="2"/>
    <path d="M12 7v4M8.5 17.5l3-4.5M15.5 17.5l-3-4.5"/>
  </svg>
)

const AlgorithmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

/* ── Data ────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: <TargetIcon />,    color: '#1DB954', title: 'Genre-Matched Targeting',   desc: 'We place your track with listeners who actively seek out your specific genre and sub-genre — not generic music fans.' },
  { icon: <NetworkIcon />,   color: '#1DB954', title: 'Targeted Channel Network',  desc: 'Access to 500+ active music channels across all major genres. Real placements, real visibility.' },
  { icon: <AlgorithmIcon />, color: '#1DB954', title: 'Algorithm Amplification',   desc: "Engineered stream patterns that signal genuine engagement to Spotify's algorithm, triggering organic recommendations." },
  { icon: <GlobeIcon />,     color: '#1DB954', title: 'Geographic Targeting',      desc: 'Drive listeners from specific markets — UK, USA, Nigeria, Germany, or wherever your target audience lives.' },
  { icon: <TrendingUpIcon />,color: '#1DB954', title: 'Detailed Analytics',        desc: 'Campaign-end report with real Spotify for Artists data showing listener growth, save rates, and audience engagement.' },
  { icon: <ShieldIcon />,    color: '#1DB954', title: 'Safe & Compliant',          desc: "Fully compliant with Spotify's Terms of Service. We never use bots, VPNs, or anything that puts your account at risk." },
]

export default function SpotifyPage() {
  useSEO({ title: 'Spotify Promotion | Echorise Media — Real Listeners, No Bots', description: 'Get real Spotify listeners with Echorise Media. Targeted campaigns, genre-matched audiences and algorithm-boosting strategies. Safe, compliant and effective. From $50.', canonical: 'https://echorisemedia.com/spotify' })
  const [orderOpen, setOrderOpen] = useState(false)
  const [orderPkg, setOrderPkg] = useState('')
  const [spotifyOpen, setSpotifyOpen] = useState(false)

  const openOrder = (pkg) => { setOrderPkg(pkg?.id || ''); setOrderOpen(true) }

  return (
    <>
      <PageHero
        label="Spotify Promotion"
        title={<>Grow Your Spotify<br /><span className="grad-text-spotify">The Right Way</span></>}
        subtitle="Targeted listener campaigns, organic channel placements, and algorithm-boosting strategies. No bots. No risk. Just real listeners who actually engage."
        accent="#1DB954"
        image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=700&fit=crop&crop=center"
      >
        <div className="flex gap-4 flex-wrap">
          <button onClick={() => openOrder()} className="btn-spotify">Start a Campaign →</button>
          <button onClick={() => { setSpotifyOpen(true) }} className="btn-ghost">Custom Request</button>
        </div>
      </PageHero>

      {/* How it works */}
      <section className="py-20 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label" style={{ color: '#1DB954' }}>How It Works</span>
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Simple Process. <span className="grad-text">Real Results.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[['01','Submit Your Track','Send us your Spotify link and campaign details via the order form.'],['02','Strategy Planning','Our team maps out the optimal targeting strategy and listener demographics for your sound.'],['03','Campaign Launch','We begin targeted promotion and driving real listeners to your track.'],['04','Report & Grow','Receive a detailed analytics report and watch your Spotify for Artists stats climb.']].map(([num, title, desc]) => (
              <div key={num} className="glass-card p-6 relative">
                <div className="font-display font-black text-5xl mb-3 grad-text" style={{ opacity: 0.25 }}>{num}</div>
                <h3 className="font-display font-bold mb-2" style={{ color: '#1A1A1A' }}>{title}</h3>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <span className="section-label" style={{ color: '#1DB954' }}>What's Included</span>
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Everything You Need to <span className="grad-text">Break Through</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="glass-card p-7">
                <div className="mb-4 flex items-center justify-center rounded-2xl"
                  style={{ width: 52, height: 52, background: 'rgba(29,185,84,0.10)', border: '1.5px solid rgba(29,185,84,0.25)', color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="font-display font-bold mb-2" style={{ color: '#1A1A1A' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Pricing</span>
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Transparent <span className="grad-text">Pricing</span></h2>
            <p style={{ color: '#6B6B6B' }}>No hidden fees. No fake numbers. Pick the package that fits your goals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {SPOTIFY_PACKAGES.map(pkg => <PricingCard key={pkg.id} pkg={pkg} onOrder={openOrder} />)}
          </div>
          <div className="text-center">
            <button onClick={() => { setSpotifyOpen(true) }} className="btn-outline">Request Custom Offer →</button>
          </div>
        </div>
      </section>

      {/* Image banner CTA */}
      <section className="py-8 px-6" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative h-72">
          <img src="https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1200&h=500&fit=crop&crop=center" alt="Music studio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-8" style={{ background: 'linear-gradient(135deg,rgba(29,185,84,0.85),rgba(0,168,70,0.8))' }}>
            <h3 className="font-display font-bold text-3xl text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Ready to grow your Spotify?</h3>
            <p className="text-white/80 mb-6 max-w-md">Join 1,400+ artists who've amplified their music with Echorise.</p>
            <button onClick={() => openOrder()} className="px-8 py-3.5 rounded-full font-display font-bold text-sm cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg" style={{ background: '#1DB954', color: '#1A1A1A' }}>Start Now →</button>
          </div>
        </div>
      </section>

      <FAQSection />

      <OrderModal isOpen={orderOpen} onClose={() => { setOrderOpen(false) }} preselect={orderPkg} />
      <SpotifyCustomModal isOpen={spotifyOpen} onClose={() => { setSpotifyOpen(false) }} />
    </>
  )
}
