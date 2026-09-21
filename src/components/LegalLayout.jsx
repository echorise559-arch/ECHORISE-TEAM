import { Link } from 'react-router-dom'
import PageHero from './PageHero'

// Shared wrapper for all legal pages (Company Information, Terms, Privacy, Refund Policy).
// Keeps typography and spacing consistent with the rest of the site's glass-card
// / section-label design language, without introducing any new visual system.
export default function LegalLayout({ label, title, updated, children }) {
  return (
    <>
      <PageHero
        label={label}
        title={title}
        subtitle={updated ? `Last updated: ${updated}` : undefined}
      />
      <section className="py-10 px-6 pb-28" style={{ background: '#FFFFFF' }}>
        <div className="max-w-3xl mx-auto">
          <div className="legal-card p-8 md:p-10 legal-content">
            {children}
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: '#6B6B6B' }}>
            <Link to="/legal" className="hover:underline" style={{ color: '#FF6A00' }}>Company Information</Link>
            <Link to="/terms" className="hover:underline" style={{ color: '#FF6A00' }}>Terms of Service</Link>
            <Link to="/privacy" className="hover:underline" style={{ color: '#FF6A00' }}>Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:underline" style={{ color: '#FF6A00' }}>Refund and Delivery Policy</Link>
          </div>
        </div>
      </section>
    </>
  )
}
