import { Link } from 'react-router-dom'
import { FileText, Clock, Globe, ShieldCheck, BarChart3, Mail, MessageCircle, BadgeCheck } from 'lucide-react'

/* Why live calls are kept for existing clients. Every reason below is tied to
   something the site already promises (24-hour written replies, work across
   18+ countries, top-up or refund terms), so the policy reads as consistent
   rather than as a way to avoid contact. Edit the wording freely. */
const REASONS = [
  {
    Icon: FileText,
    title: 'Everything is agreed in writing',
    text: 'Targeting, delivery timeline and our top-up or refund terms are confirmed in writing, so both sides have a clear record and nothing gets lost in a conversation.',
  },
  {
    Icon: Clock,
    title: 'Faster replies for everyone',
    text: 'Every inquiry is answered within 24 hours. Keeping live calls for active campaigns lets the team spend its hours on campaigns and replies instead of a calendar.',
  },
  {
    Icon: Globe,
    title: 'Artists in 18+ countries',
    text: 'We work across many time zones. Written support means you get the same quality of answer whether you are in Lagos, London or Los Angeles, with no 3am calls.',
  },
  {
    Icon: ShieldCheck,
    title: 'Protection from impersonators',
    text: 'Music promotion attracts people posing as agencies. We only discuss campaign details with verified clients who hold an order reference, which protects you as much as us.',
  },
  {
    Icon: BarChart3,
    title: 'Calls work best with real data',
    text: 'Once a campaign is running there are real numbers to go through, so a call covers your analytics and next steps instead of a generic sales pitch.',
  },
]

const FOR_NEW_CLIENTS = [
  'A written answer to every question within 24 hours',
  'A custom proposal within 24 hours if you need something specific',
  'Instant answers from the chat assistant on this site',
  'Video reviews from real clients, and our top-up or refund promise',
]

export default function CallPolicy({ showCta = true }) {
  return (
    <section className="py-24 px-6" id="call-policy" aria-labelledby="call-policy-heading" style={{ background: '#FAF7F2' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="section-label">Call Policy</span>
          <h2
            id="call-policy-heading"
            className="font-display font-bold text-4xl md:text-5xl mb-4"
            style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}
          >
            Calls Are For <span className="grad-text">Existing Clients</span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: '#6B6B6B' }}>
            Live calls are reserved for artists with an active or completed order. It is not about being hard to reach. It is how we keep campaigns fast, safe and properly documented. Before you order, we answer everything in writing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {REASONS.map(({ Icon, title, text }) => (
            <div key={title} className="glass-card p-7">
              <span
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(255,106,0,0.10)', border: '1.5px solid rgba(255,106,0,0.22)', color: '#FF6A00' }}
              >
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
              </span>
              <h3 className="font-display font-bold text-base mb-2" style={{ color: '#1A1A1A' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>{text}</p>
            </div>
          ))}

          {/* Existing clients card fills the sixth grid slot */}
          <div
            className="rounded-3xl p-7 flex flex-col"
            style={{ background: 'linear-gradient(135deg,#1A1A1A 0%,#2D1A0E 100%)', border: '1.5px solid rgba(255,106,0,0.25)' }}
          >
            <span
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(255,106,0,0.18)', border: '1.5px solid rgba(255,106,0,0.35)', color: '#FF6A00' }}
            >
              <BadgeCheck size={20} strokeWidth={2} aria-hidden="true" />
            </span>
            <h3 className="font-display font-bold text-base mb-2" style={{ color: '#FFFFFF' }}>Already a client?</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
              Message us with the email you ordered with and ask for a call. Your campaign manager will arrange a time that works for your time zone.
            </p>
          </div>
        </div>

        <div className="glass-card p-8 md:p-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(29,185,84,0.12)', border: '1.5px solid rgba(29,185,84,0.28)', color: '#14873D' }}
            >
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            </span>
            <h3 className="font-display font-bold text-lg" style={{ color: '#1A1A1A' }}>New here? This is what you get instead</h3>
          </div>
          <ul className="flex flex-col gap-3 mb-2">
            {FOR_NEW_CLIENTS.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#3A3A3A' }}>
                <span
                  className="w-5 h-5 mt-0.5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold"
                  style={{ background: 'rgba(255,106,0,0.10)', border: '1.5px solid rgba(255,106,0,0.28)', color: '#FF6A00' }}
                >✓</span>
                {item}
              </li>
            ))}
          </ul>
          {showCta && (
            <div className="mt-7 text-center">
              <Link to="/contact" className="btn-primary inline-flex items-center justify-center gap-2 px-10 py-4">
                <Mail size={18} strokeWidth={2.2} aria-hidden="true" /> Send Us a Message →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
