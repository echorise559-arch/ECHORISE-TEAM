// Artist of the Week / Artist of the Month showcase.
// Content is managed from the hidden admin page (/admin/artists) and loaded from
// /.netlify/functions/artists. The whole section stays hidden until at least one
// artist has been added, so visitors never see an empty block.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const SLOT_TITLE = { week: 'Artist of the Week', month: 'Artist of the Month' }

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

function LinkGroup({ title, links, variant }) {
  if (!links || links.length === 0) return null
  return (
    <div className="as-links">
      <span className="as-links-title">{title}</span>
      <ul className="as-pill-row">
        {links.map(l => (
          <li key={`${l.platform}-${l.url}`}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`as-pill as-pill--${variant}`}
              aria-label={`${l.platform} (opens in a new tab)`}
            >
              {l.platform}
              <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SpotlightCard({ artist, wide }) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = artist.imageUrl && !imgFailed
  return (
    <article className={`as-card${wide ? ' as-card--wide' : ''}`}>
      <div className="as-media">
        {showImage ? (
          <img
            src={artist.imageUrl}
            alt={`${artist.name}, ${SLOT_TITLE[artist.slot]}`}
            className="as-img"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="as-placeholder" aria-hidden="true">{initials(artist.name)}</div>
        )}
        <span className="as-badge">{SLOT_TITLE[artist.slot]}</span>
      </div>

      <div className="as-body">
        {artist.label && <p className="as-period">{artist.label}</p>}
        <h3 className="as-name">{artist.name}</h3>
        {artist.tagline && <p className="as-tagline">{artist.tagline}</p>}
        {artist.description && <p className="as-desc">{artist.description}</p>}
        <LinkGroup title="Listen" links={artist.streaming} variant="solid" />
        <LinkGroup title="Follow" links={artist.socials} variant="line" />
      </div>
    </article>
  )
}

export default function ArtistSpotlight() {
  const [artists, setArtists] = useState([])

  useEffect(() => {
    let alive = true
    fetch('/.netlify/functions/artists')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!alive || !data) return
        setArtists(['week', 'month'].map(k => data[k]).filter(Boolean))
      })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  if (artists.length === 0) return null

  return (
    <section className="as-section" id="artist-spotlight" aria-labelledby="artist-spotlight-heading">
      <div className="as-inner">
        <div className="as-head">
          <span className="section-label">Artist Spotlight</span>
          <h2 id="artist-spotlight-heading" className="font-display font-bold as-title">
            Artists in the <span className="grad-text">spotlight</span>
          </h2>
          <p className="as-lede">Featured by the Echorise Media team. Listen, follow and support them.</p>
        </div>

        <div className={`as-grid${artists.length === 1 ? ' as-grid--single' : ''}`}>
          {artists.map(a => (
            <SpotlightCard key={a.slot} artist={a} wide={artists.length === 1} />
          ))}
        </div>

        <div className="as-cta">
          <p className="as-cta-text">Want your music featured here?</p>
          <Link to="/contact?subject=Artist%20Spotlight%20feature" className="btn-primary">Get featured</Link>
        </div>
      </div>
    </section>
  )
}
