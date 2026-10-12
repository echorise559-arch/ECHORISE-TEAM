import { useState } from 'react'
import { Check, PenLine, Image, ClipboardCheck, SearchCheck, Megaphone, Youtube } from 'lucide-react'
import ServiceOrderModal from './ServiceOrderModal'
import { ARTIST_SERVICES, TIERS } from '../data/artistServices'

const ICONS = {
  bio: PenLine,
  cover: Image,
  check: ClipboardCheck,
  audit: SearchCheck,
  announce: Megaphone,
  thumbnail: Youtube,
}

function ServiceCard({ service, price, onPrice, onOrder }) {
  const Icon = ICONS[service.icon] || PenLine
  const variable = service.prices.length > 1
  const priceRange = service.prices.map(p => `$${p}`).join(' – ')

  return (
    <div className="glass-card p-7 flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,106,0,0.10)', width: 52, height: 52, border: '1.5px solid rgba(255,106,0,0.25)', color: '#FF6A00' }}>
          <Icon size={24} strokeWidth={2} aria-hidden="true" />
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-3xl leading-none" style={{ color: '#1A1A1A' }}>${price}</div>
          {variable && <div className="text-xs mt-1" style={{ color: '#6B6B6B' }}>{priceRange}</div>}
        </div>
      </div>

      <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>{service.name}</h3>
      <p className="text-sm leading-relaxed mb-5" style={{ color: '#6B6B6B' }}>{service.description}</p>

      {variable && (
        <div className="mb-5">
          <div role="radiogroup" aria-label={`Choose a price for ${service.name}`} className="grid grid-cols-2 gap-2">
            {service.prices.map(p => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={price === p}
                onClick={() => onPrice(p)}
                className="rounded-xl px-3 py-2.5 text-left transition-all"
                style={{
                  background: price === p ? 'rgba(255,106,0,0.10)' : 'rgba(0,0,0,0.03)',
                  border: price === p ? '1.5px solid rgba(255,106,0,0.60)' : '1.5px solid rgba(26,26,26,0.12)',
                  minHeight: 48,
                }}
              >
                <span className="block font-display font-bold" style={{ color: price === p ? '#FF6A00' : '#1A1A1A' }}>${p}</span>
                <span className="block text-xs" style={{ color: '#6B6B6B' }}>{TIERS[p].label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: '#6B6B6B' }}>{TIERS[price].note}</p>
        </div>
      )}

      <div className="text-xs font-display font-bold uppercase tracking-wider mb-3" style={{ color: '#1A1A1A' }}>What's included</div>
      <ul className="flex flex-col gap-2.5 mb-5 flex-1">
        {service.includes.map(item => (
          <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: '#3A3A3A' }}>
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,106,0,0.12)', color: '#FF6A00' }}>
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {service.note && <p className="text-xs leading-relaxed mb-5" style={{ color: '#6B6B6B' }}>{service.note}</p>}

      <button type="button" onClick={() => onOrder(service, price)} className="btn-primary justify-center w-full" style={{ minHeight: 48 }}>
        Order Now · ${price} →
      </button>
    </div>
  )
}

export default function ArtistServicesSection() {
  // The price chosen on each card (defaults to the lowest). The order window and
  // its payment link are always driven by this single price value.
  const [prices, setPrices] = useState(() => Object.fromEntries(ARTIST_SERVICES.map(s => [s.id, s.prices[0]])))
  const [order, setOrder] = useState({ open: false, service: null, price: 0 })

  const openOrder = (service, price) => setOrder({ open: true, service, price })
  const closeOrder = () => setOrder(o => ({ ...o, open: false }))

  return (
    <section className="py-24 px-6" id="artist-services" style={{ background: '#FAF7F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="section-label">Artist Services</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4" style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}>
            Affordable Services for <span className="grad-text">Independent Artists</span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: '#6B6B6B' }}>
            Professional help with your bio, artwork, release and profile, starting at just $5. Pick a service, tell us what you need, and pay securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTIST_SERVICES.map(s => (
            <ServiceCard
              key={s.id}
              service={s}
              price={prices[s.id]}
              onPrice={p => setPrices(prev => ({ ...prev, [s.id]: p }))}
              onOrder={openOrder}
            />
          ))}
        </div>
      </div>

      <ServiceOrderModal isOpen={order.open} onClose={closeOrder} service={order.service} price={order.price} />
    </section>
  )
}
