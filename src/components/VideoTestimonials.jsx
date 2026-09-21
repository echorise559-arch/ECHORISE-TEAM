import { useState, useRef } from 'react'
import { Play, BadgeCheck } from 'lucide-react'
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
        </div>

        {/* Equal-width phone frames, centred, so 1, 2, 3 or more videos always look balanced */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
          {VIDEO_TESTIMONIALS.map((item, i) => (
            <VideoCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
