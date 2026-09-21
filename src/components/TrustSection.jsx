import { Link } from 'react-router-dom'
import { ShieldCheck, RefreshCcw, BarChart3, Lock, Clock, MessageCircle } from 'lucide-react'

/* Every line below restates something the site already promises elsewhere
   (FAQ, footer, contact page) — nothing new is being claimed here.
   Edit the wording freely, but only keep what you can stand behind. */
const COMMITMENTS = [
  {
    Icon: ShieldCheck,
    title: 'Real listeners only',
    text: 'Every listener is a real person with a genuine account. No bots, no fake accounts, no artificial plays.',
  },
  {
    Icon: RefreshCcw,
    title: 'Top-up or refund',
    text: 'If we miss the promised numbers within the agreed timeframe, we top up your campaign at no charge or refund you in full. Your choice.',
  },
  {
    Icon: BarChart3,
    title: 'A report at the end',
    text: 'Every campaign finishes with an analytics report, so you can see exactly what was delivered.',
  },
  {
    Icon: Lock,
    title: 'Secure payment',
    text: 'You receive a secure payment link after your order form. We accept Visa, Mastercard, bank transfer and mobile money.',
  },
  {
    Icon: Clock,
    title: 'Fast, clear start',
    text: 'Campaigns typically begin within 24 to 48 hours of payment confirmation, with a confirmation email and campaign brief.',
  },
  {
    Icon: MessageCircle,
    title: 'People you can reach',
    text: 'Email or message us and every inquiry is answered within 24 hours by the named team below.',
  },
]

const STEPS = [
  { title: 'Send your track', text: 'Fill in the order form with your track link and what you want to achieve.' },
  { title: 'Get your payment link', text: 'A secure payment link is sent to you after you submit the form.' },
  { title: 'Campaign brief and launch', text: 'Once payment is confirmed you get a confirmation email and campaign brief. Your campaign typically starts within 24 to 48 hours.' },
  { title: 'Receive your report', text: 'When the campaign ends, you get a full analytics report of the results.' },
]

export default function TrustSection({ onOrder }) {
  return (
    <section className="py-24 px-6" id="trust" aria-labelledby="trust-heading" style={{ background: '#FAF7F2' }}>
      <div className="max-w-6xl mx-auto">

        <div className="max-w-2xl mb-14">
          <span className="section-label">How We Work</span>
          <h2 id="trust-heading" className="font-display font-bold text-4xl md:text-5xl mb-4"
            style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}>
            What You Can <span className="grad-text">Count On</span>
          </h2>
          <p style={{ color: '#6B6B6B' }}>
            Paying a promotion service you found online takes trust, and we don't take that lightly.
            Here is exactly what we commit to, and what happens after you order.
          </p>
        </div>

        {/* Commitments */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 mb-20" style={{ listStyle: 'none' }}>
          {COMMITMENTS.map(({ Icon, title, text }) => (
            <li key={title} className="pt-6" style={{ borderTop: '1px solid rgba(26,26,26,0.14)' }}>
              <div className="rounded-xl flex items-center justify-center mb-4"
                style={{ width: 46, height: 46, background: 'rgba(255,106,0,0.10)', border: '1.5px solid rgba(255,106,0,0.25)', color: '#FF6A00' }}>
                <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>{text}</p>
            </li>
          ))}
        </ul>

        {/* After you order */}
        <div className="rounded-3xl px-6 py-10 md:px-10 md:py-12"
          style={{ background: '#FFFFFF', border: '1.5px solid rgba(75,63,114,0.12)', boxShadow: '0 4px 24px rgba(26,26,26,0.06)' }}>
          <h3 className="font-display font-bold text-2xl mb-10" style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}>
            What happens after you order
          </h3>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10" style={{ listStyle: 'none' }}>
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                    style={{ background: '#FF6A00', color: '#FFFFFF' }}>{i + 1}</span>
                  {i < STEPS.length - 1 && (
                    <span className="hidden lg:block flex-1 h-px" aria-hidden="true" style={{ background: 'rgba(255,106,0,0.30)' }} />
                  )}
                </div>
                <h4 className="font-display font-bold text-base mb-2" style={{ color: '#1A1A1A' }}>{step.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center gap-4 pt-8" style={{ borderTop: '1px solid rgba(26,26,26,0.08)' }}>
            <button type="button" onClick={() => onOrder && onOrder()} className="btn-primary">Start your order</button>
            <Link to="/contact" className="btn-ghost">Ask a question first</Link>
            <span className="text-sm" style={{ color: 'rgba(107,107,107,0.90)' }}>or write to support@echorisemedia.com</span>
          </div>
        </div>

      </div>
    </section>
  )
}
