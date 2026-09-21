import { useWhatsApp } from '../hooks/useWhatsApp'
import { useSocialLinks } from '../hooks/useSocialLinks'

const TG_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.55-1.1.55l.4-5.56 10.13-9.17c.44-.39-.1-.61-.68-.22L7.06 12.6l-5.5-1.71c-1.2-.37-1.21-1.2.26-1.79l21.5-8.28c1-.36 1.87.24 1.59 1.97z"/>
  </svg>
)

const WA_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

/**
 * Renders an Email button + WhatsApp button side by side.
 * The WhatsApp href is populated from the WHATSAPP_NUMBER Netlify env var
 * via the /.netlify/functions/get-contact serverless function.
 */
export default function ContactButtons({ className = '' }) {
  const waLink = useWhatsApp()
  const { telegramLink } = useSocialLinks()

  function handleWaClick(e) {
    // Block click if number hasn't loaded yet
    if (waLink === '#') e.preventDefault()
  }

  return (
    <div className={`flex flex-col sm:flex-row flex-wrap gap-3 ${className}`}>
      {/* Email button — uses site's existing btn-primary style */}
      <a
        href="mailto:support@echorisemedia.com?subject=Inquiry%20%E2%80%94%20Echorise%20Media"
        aria-label="Send email to Echorise Media"
        className="btn-primary inline-flex items-center justify-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M2 7l10 7 10-7"/>
        </svg>
        Email Us
      </a>

      {/* WhatsApp button — href populated on load from Netlify env var */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={handleWaClick}
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
        style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.28)' }}
      >
        {WA_SVG}
        WhatsApp Us
      </a>

      {/* Telegram button — only renders once TELEGRAM_LINK is configured on Netlify */}
      {telegramLink && (
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message on Telegram"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm tracking-wide text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
          style={{ background: '#26A5E4', boxShadow: '0 4px 20px rgba(38,165,228,0.28)' }}
        >
          {TG_SVG}
          Telegram Us
        </a>
      )}
    </div>
  )
}
