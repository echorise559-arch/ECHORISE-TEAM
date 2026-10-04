import { useState, useRef } from 'react'
import { Play, BadgeCheck, ShieldCheck, Users, BarChart3 } from 'lucide-react'
import { VIDEO_TESTIMONIALS } from '../data'

// Cloudinary's hosted Video Player (player.cloudinary.com/embed/...) is an
// HTML page, not a raw video file — it must go in an <iframe>, never in a
// <video src>. Everything else (plain .mp4 / secure_url links) uses the
// lightweight click-to-play <video> below.
const isCloudinaryEmbed = (url) => typeof url === 'string' && url.includes('player.cloudinary.com/embed')

// Same phone-shaped frame for every review, so the row always lines up.
const FRAME_STYLE = {
  aspectRatio: '9 / 16',
  borderRadius: 24,
  border: '1px solid rgba(26,26,26,0.12)',
  boxShadow: '0 14px 40px rgba(26,26,26,0.14)',
}

function VideoCard({ item, index }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef(null)
  const label = `Client video review ${index + 1}`

  const handlePlay = () => {
    setPlaying(true)
    // Wait a frame so the <video> is mounted with controls before calling play()
    requestAnimationFrame(() => videoRef.current?.play()?.catch(() => {}))
  }

  return (
    <figure className="vt-card">
      <div className="relative overflow-hidden bg-black" style={FRAME_STYLE}>
        {isCloudinaryEmbed(item.videoUrl) ? (
          <iframe
            src={item.videoUrl}
            title={label}
            className="absolute inset-0 w-full h-full"
            style={{ border: 'none' }}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : playing ? (
          <video
            ref={videoRef}
            src={item.videoUrl}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain bg-black"
          />
        ) : (
          <button
            type="button"
            onClick={handlePlay}
            aria-label={`Play ${label.toLowerCase()}`}
            className="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer"
            style={{
              backgroundImage: item.poster ? `url(${item.poster})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#000',
            }}
          >
            {!item.poster && (
              <video
                src={item.videoUrl}
                preload="metadata"
                muted
                playsInline
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
            <span
              className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-110"
              style={{ background: 'rgba(255,106,0,0.95)', boxShadow: '0 4px 24px rgba(255,106,0,0.45)' }}
            >
              <Play size={26} fill="currentColor" strokeWidth={0} aria-hidden="true" style={{ marginLeft: 3 }} />
            </span>
          </button>
        )}
      </div>

      <figcaption className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold" style={{ color: '#1A1A1A' }}>
        <BadgeCheck size={18} strokeWidth={2} aria-hidden="true" style={{ color: '#FF6A00' }} />
        {item.tag || 'Verified Client'}
      </figcaption>
    </figure>
  )
}

// Plain-language backing for the "organic" claim. Each point restates what the
// site already promises elsewhere (FAQ, Trust section), so nothing new is claimed.
const ORGANIC_POINTS = [
  {
    Icon: Users,
    title: 'Real people, real placements',
    text: 'Your track is pitched by hand to genuine curators, bloggers and listener communities that match your genre.',
  },
  {
    Icon: ShieldCheck,
    title: 'No bots. No artificial streaming.',
    text: 'We never use bot accounts, stream farms or purchased plays. They put your artist profile at risk and they are not what the artists in these videos paid for.',
  },
  {
    Icon: BarChart3,
    title: 'Check it in your own data',
    text: 'Organic growth is visible in your analytics: listeners from varied locations, saves, follows and playlist adds, not one flat wall of plays.',
  },
]

export default function VideoTestimonials() {
  if (!VIDEO_TESTIMONIALS || VIDEO_TESTIMONIALS.length === 0) return null

  return (
    <section className="py-24 px-6" id="video-testimonials" aria-labelledby="video-reviews-heading" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="section-label">Client Video Reviews</span>
          <h2
            id="video-reviews-heading"
            className="font-display font-bold text-4xl md:text-5xl mb-4"
            style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}
          >
            Hear It <span className="grad-text">Straight From Them</span>
          </h2>
          <p className="max-w-md mx-auto" style={{ color: '#6B6B6B' }}>
            Real video reviews from artists we've worked with. Names are kept private.
          </p>
          <div
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full text-xs font-display font-bold tracking-widest uppercase"
            style={{ background: 'rgba(29,185,84,0.10)', border: '1.5px solid rgba(29,185,84,0.30)', color: '#14873D' }}
          >
            <ShieldCheck size={16} strokeWidth={2.2} aria-hidden="true" />
            100% Organic Outreach · No Bots
          </div>
        </div>

        {/* Equal-width phone frames, centred, so 1, 2, 3 or more videos always look balanced */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
          {VIDEO_TESTIMONIALS.map((item, i) => (
            <VideoCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* Why these results are organic */}
        <div
          className="mt-16 rounded-3xl p-8 md:p-10"
          style={{ background: '#FAF7F2', border: '1.5px solid rgba(29,185,84,0.22)' }}
        >
          <h3
            className="font-display font-bold text-2xl text-center mb-8"
            style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}
          >
            Why these results are <span style={{ color: '#14873D' }}>genuinely organic</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ORGANIC_POINTS.map(({ Icon, title, text }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(29,185,84,0.12)', border: '1.5px solid rgba(29,185,84,0.28)', color: '#14873D' }}
                >
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                </span>
                <div className="font-display font-bold text-base mb-2" style={{ color: '#1A1A1A' }}>{title}</div>
                <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>{text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-center mt-8" style={{ color: 'rgba(107,107,107,0.90)' }}>
            Every campaign follows each platform's terms of service. If we miss the promised numbers, we top up your campaign or refund you.
          </p>
        </div>
      </div>
    </section>
  )
}
