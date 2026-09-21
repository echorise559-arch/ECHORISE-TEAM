import useSEO from '../hooks/useSEO'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import OrderModal from '../components/OrderModal'
import SpotifyCustomModal from '../components/SpotifyCustomModal'
import PricingCard from '../components/PricingCard'
import ReviewCard from '../components/ReviewCard'
import TeamSection from '../components/TeamSection'
import TrustSection from '../components/TrustSection'
import StatsBar from '../components/StatsBar'
import FAQSection from '../components/FAQSection'
import PartnerLogos from '../components/PartnerLogos'
import TopArtists from '../components/TopArtists'
import VideoTestimonials from '../components/VideoTestimonials'
import { SPOTIFY_PACKAGES, REVIEWS } from '../data'

/* ── Platform SVG Icons ─────────────────────────────────────────── */
const SpotifyIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const SoundCloudIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M0 13.516c0-.68.52-1.235 1.175-1.235.655 0 1.175.554 1.175 1.235 0 .682-.52 1.235-1.175 1.235C.52 14.751 0 14.198 0 13.516zm2.35.56c0-.682.52-1.235 1.175-1.235.655 0 1.175.553 1.175 1.235 0 .682-.52 1.235-1.175 1.235-.655 0-1.175-.553-1.175-1.235zm2.35-.56c0-.682.52-1.235 1.175-1.235.655 0 1.175.553 1.175 1.235 0 .682-.52 1.235-1.175 1.235-.655 0-1.175-.553-1.175-1.235zm2.35-1.12c0-.682.52-1.235 1.175-1.235.655 0 1.175.553 1.175 1.235v1.68c0 .682-.52 1.235-1.175 1.235-.655 0-1.175-.553-1.175-1.235v-1.68zm2.35-2.24c0-.682.52-1.235 1.175-1.235.655 0 1.175.553 1.175 1.235v3.92c0 .682-.52 1.235-1.175 1.235-.655 0-1.175-.553-1.175-1.235v-3.92zm2.35 1.12c0-.682.52-1.235 1.175-1.235.655 0 1.175.553 1.175 1.235v2.8c0 .682-.52 1.235-1.175 1.235-.655 0-1.175-.553-1.175-1.235v-2.8zm2.35-3.36c0-.682.52-1.235 1.175-1.235.655 0 1.175.553 1.175 1.235v6.16c0 .682-.52 1.235-1.175 1.235-.655 0-1.175-.553-1.175-1.235V7.916zm2.35 1.68c0-.682.52-1.235 1.175-1.235.655 0 1.175.553 1.175 1.235v4.48c0 .682-.52 1.235-1.175 1.235-.655 0-1.175-.553-1.175-1.235V9.596zm2.349-1.12A2.054 2.054 0 0 1 21.5 6.42a2.054 2.054 0 0 1 2.054 2.056v2.8A2.054 2.054 0 0 1 21.5 13.33a2.054 2.054 0 0 1-2.051-2.054V8.476z"/>
  </svg>
)

const ChartIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)

const DanceIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <circle cx="12" cy="3" r="2"/>
    <path d="M14 8.5l2.5 1.5-1 4 2 4h-2l-1.5-3.5-1.5 1V19h-2v-5l2-2.5V9.5l-2 1-1-1.5 3-2h1.5z"/>
    <path d="M8.5 9.5L6 11l1 1.5 1.5-1V19h2v-9z" opacity="0"/>
  </svg>
)

const YouTubeIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
  </svg>
)

const AppleMusicIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026A9.4 9.4 0 0 0 4.24.41C3.027.738 2.076 1.387 1.37 2.405A4.94 4.94 0 0 0 .57 4.018 11.143 11.143 0 0 0 .08 5.886v12.214c.017.12.027.243.045.362a9.068 9.068 0 0 0 .652 2.557c.52 1.146 1.35 1.968 2.48 2.501a6.38 6.38 0 0 0 1.79.52c.474.073.951.087 1.43.1h11.28c.316-.013.633-.027.948-.067a8.99 8.99 0 0 0 2.296-.68c1.1-.537 1.907-1.356 2.42-2.48.33-.72.49-1.49.55-2.28.01-.15.02-.3.02-.44V6.124zm-8.516 9.597c-.13.06-.27.09-.41.09-.22 0-.44-.07-.62-.21l-3.64-2.73v-7.2c0-.41.34-.75.75-.75s.75.34.75.75v6.72l3.2 2.4c.33.25.4.72.15 1.05-.09.13-.22.24-.38.3z"/>
  </svg>
)

const TikTokIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.72a4.85 4.85 0 0 1-1.01-.03z"/>
  </svg>
)

const AudiomackIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
  </svg>
)

const BoomplayIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-2-5l6-3.5L10 8v7z"/>
  </svg>
)

const DeezerIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M18.944 17.773H24v2.25h-5.056zM18.944 14H24v2.25h-5.056zM18.944 10.227H24v2.25h-5.056zM13.5 17.773h5.056v2.25H13.5zM13.5 14h5.056v2.25H13.5zM8.055 17.773H13.5v2.25H8.055zM2.611 17.773h5.056v2.25H2.611z"/>
  </svg>
)

const TidalIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004L12.012 3.992zM16.016 7.996l-4.004 4.004 4.004 4.004L20.02 11.998l-4.004-4.002z"/>
  </svg>
)

const AmazonMusicIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.661.661 0 0 1-.75.074c-1.052-.873-1.24-1.279-1.814-2.113-1.734 1.769-2.962 2.299-5.21 2.299-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.099v-.41c0-.753.06-1.642-.384-2.294-.385-.578-1.124-.816-1.774-.816-1.205 0-2.277.618-2.54 1.897-.054.285-.261.567-.549.582l-3.061-.331c-.259-.058-.548-.266-.472-.66C5.97 2.516 8.78 1.5 11.298 1.5c1.285 0 2.963.341 3.977 1.313 1.285 1.2 1.162 2.8 1.162 4.542v4.115c0 1.237.513 1.781 .995 2.448.169.236.206.521-.008.698l-1.28 1.179zm3.675 1.321c-.31.27-.76.288-1.119.108-1.571-1.303-1.854-1.906-2.715-3.148-2.593 2.648-4.432 3.441-7.795 3.441C4.977 19.517 2 17.418 2 13.112c0-2.91 1.577-4.888 3.825-5.856 1.944-.853 4.656-1.007 6.727-1.241V5.6c0-.851.068-1.857-.434-2.596-.436-.655-1.274-.924-2.011-.924-1.366 0-2.582.7-2.882 2.149-.061.323-.296.643-.621.659L3.47 4.554c-.294-.065-.621-.302-.536-.747C3.851 1.395 7.228 0 10.269 0c1.456 0 3.358.387 4.509 1.488 1.456 1.36 1.316 3.172 1.316 5.146v4.661c0 1.401.581 2.017 1.127 2.773.192.267.233.59-.009.791l-1.363 1.257z"/>
  </svg>
)

const PandoraIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M0 0v24h7.228C13.532 24 24 20.401 24 11.755 24 4.755 17.943 0 11.228 0H0zm7 17V7h3.782c3.225 0 5.988 1.705 5.988 5.044C16.77 15.086 14.007 17 10.782 17H7z"/>
  </svg>
)

const iHeartRadioIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.183 4.068 1 7.127 1c2.07 0 4.035 1.167 4.873 3h0c.838-1.833 2.802-3 4.873-3C19.932 1 23 3.183 23 7.191c0 4.105-5.374 8.863-11 14.402z"/>
  </svg>
)

const BulletDot = ({ color = '#FF6A00' }) => (
  <svg viewBox="0 0 8 8" fill={color} width="8" height="8">
    <circle cx="4" cy="4" r="4"/>
  </svg>
)

/* ── Data ─────────────────────────────────────────────────────────── */
const SERVICES = [
  { icon: <SpotifyIcon />,    title: 'Spotify Promotion',    desc: 'Targeted listener campaigns and algorithm-boosting strategies that put your track in front of people who actually engage.', to: '/spotify',    color: '#1DB954', bg: 'rgba(29,185,84,0.14)' },
  { icon: <SoundCloudIcon />, title: 'SoundCloud Promotion', desc: "Build your SoundCloud presence from the ground up — real plays, followers, and reposts from your genre's core community.",  to: '/soundcloud', color: '#FF5500', bg: 'rgba(255,85,0,0.14)' },
  { icon: <ChartIcon />,      title: 'Chart Promotion',       desc: 'From regional viral charts to the UK and USA Top 100 — we know how charts move, and we have the network to move yours.',      to: '/chart',      color: '#FF6A00', bg: 'rgba(255,106,0,0.10)' },
  { icon: <DanceIcon />,      title: 'Dance & TikTok Promo',  desc: 'Real creators on TikTok and Instagram Reels making authentic content around your track — the kind that sparks viral moments.',  to: '/dance',      color: '#4B3F72', bg: 'rgba(75,63,114,0.08)' },
  { icon: <YouTubeIcon />,    title: 'YouTube Promotion',     desc: 'Grow your channel with real views, subscribers, and watch-time campaigns designed to trigger the YouTube algorithm in your favour.', to: '/youtube',  color: '#FF0000', bg: 'rgba(255,0,0,0.08)' },
  { icon: <AppleMusicIcon />, title: 'Apple Music Promotion', desc: "Get your tracks onto Apple Music playlists, climb the Shazam chart, and build a loyal listener base on one of the world's top platforms.", to: '/apple-music', color: '#FC3C44', bg: 'rgba(252,60,68,0.08)' },
]

const ALL_PLATFORMS = [
  { name: 'Spotify',      color: '#1DB954', icon: <SpotifyIcon size={16} /> },
  { name: 'SoundCloud',   color: '#FF5500', icon: <SoundCloudIcon size={16} /> },
  { name: 'YouTube',      color: '#FF0000', icon: <YouTubeIcon size={16} /> },
  { name: 'Apple Music',  color: '#FC3C44', icon: <AppleMusicIcon size={16} /> },
  { name: 'TikTok',       color: '#010101', icon: <TikTokIcon size={16} /> },
  { name: 'Audiomack',    color: '#F5A623', icon: <AudiomackIcon size={16} /> },
  { name: 'Boomplay',     color: '#FF1F5A', icon: <BoomplayIcon size={16} /> },
  { name: 'Deezer',       color: '#A238FF', icon: <DeezerIcon size={16} /> },
  { name: 'Tidal',        color: '#1A1A1A', icon: <TidalIcon size={16} /> },
  { name: 'Amazon Music', color: '#00A8E1', icon: <AmazonMusicIcon size={16} /> },
  { name: 'Pandora',      color: '#005483', icon: <PandoraIcon size={16} /> },
  { name: 'iHeartRadio',  color: '#C6002B', icon: <iHeartRadioIcon size={16} /> },
]

const STATS = [
  { color: '#FF6A00', label: '1,400+ Artists Promoted' },
  { color: '#FF6A00', label: '50M+ Streams Driven' },
  { color: '#1DB954', label: '18+ Countries Reached' },
  { color: '#4B3F72', label: '24-Hour Response' },
]

const GENRES = ['Afrobeats','R&B','Hip-Hop','Electronic','Pop','Amapiano','Dancehall','Drill','Lo-Fi','House','Soul','Jazz Fusion','Trap','Latin','Alternative','Indie','UK Rap','Techno']

export default function Home() {
  useSEO({ title: 'Echorise Media | #1 Music Promotion Studio — Spotify, SoundCloud, YouTube & More', description: 'Real listeners. Real results. Echorise Media promotes your music on Spotify, SoundCloud, YouTube, Apple Music, TikTok & charts worldwide. 1,400+ artists promoted. 50M+ streams driven.', canonical: 'https://echorisemedia.com/' })
  const [orderOpen, setOrderOpen] = useState(false)
  const [orderPreselect, setOrderPreselect] = useState('')
  const [spotifyOpen, setSpotifyOpen] = useState(false)

  const openOrder = (pkg) => {
    setOrderPreselect(pkg?.id || '')
    setOrderOpen(true)
  }

  const openSpotify = () => {
    setSpotifyOpen(true)
  }

  const closeOrder = () => setOrderOpen(false)
  const closeSpotify = () => setSpotifyOpen(false)

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 px-6 overflow-hidden bg-hero-pattern" style={{ background: '#FAF7F2' }}>
        <div className="orb w-[600px] h-[600px] -top-60 -right-40 animate-float-slow" style={{ background: '#FF6A00', opacity: 0.06 }} />
        <div className="orb w-[500px] h-[500px] -bottom-40 -left-40 animate-float" style={{ background: '#4B3F72', opacity: 0.05 }} />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-display font-bold tracking-widest uppercase"
                style={{ background: 'rgba(255,106,0,0.08)', border: '1.5px solid rgba(255,106,0,0.2)', color: '#FF6A00' }}>
                <BulletDot /> The Music Promotion Studio
              </div>

              <h1 className="font-display font-bold mb-6"
                style={{ fontSize: 'clamp(2.8rem,6vw,5rem)', lineHeight: 1.06, letterSpacing: '-0.03em', color: '#1A1A1A', fontFamily: 'Syne, sans-serif' }}>
                Your Music Deserves<br />
                <span className="grad-text">More Than an Algorithm</span>
              </h1>

              <p className="text-lg max-w-xl mb-10 leading-relaxed" style={{ color: '#6B6B6B' }}>
                We don't just push your track — we architect its rise. Echorise Media connects your music with real listeners, real channels, and real momentum on the platforms that define careers.
              </p>

              <div className="flex gap-4 flex-wrap mb-12">
                <button onClick={() => openOrder()} className="btn-primary animate-pulse-glow text-base px-10 py-4">
                  Order Now →
                </button>
                <Link to="/contact" className="btn-ghost text-base px-10 py-4">Talk to Our Team</Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6">
                {STATS.map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm font-medium" style={{ color: '#6B6B6B' }}>
                    <BulletDot color={color} /> {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image collage */}
            <div className="relative hidden lg:block">
              <div className="relative" style={{ height: 520 }}>
                <div className="absolute right-0 top-0 w-72 h-80 rounded-3xl overflow-hidden shadow-2xl" style={{ border: '4px solid white' }}>
                  <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=700&fit=crop&crop=center" alt="Artist performing" className="w-full h-full object-cover" />
                </div>
                <div className="absolute left-0 bottom-16 w-52 h-64 rounded-3xl overflow-hidden shadow-xl" style={{ border: '4px solid white' }}>
                  <img src="https://images.unsplash.com/photo-1508973379184-7517410ebc43?w=400&h=500&fit=crop&crop=center" alt="Artist in studio" className="w-full h-full object-cover" />
                </div>
                <div className="absolute right-16 bottom-0 w-36 h-36 rounded-2xl overflow-hidden shadow-lg" style={{ border: '4px solid white' }}>
                  <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop&crop=center" alt="Music studio" className="w-full h-full object-cover" />
                </div>
                <div className="absolute left-36 top-12 px-5 py-4 rounded-2xl font-display font-bold text-sm shadow-xl"
                  style={{ background: '#FF6A00', color: 'white', boxShadow: '0 4px 20px rgba(255,106,0,0.30)' }}>
                  <div className="text-2xl font-black">1,400+</div>
                  <div className="text-white/80 text-xs">Artists Amplified</div>
                </div>
                <div className="absolute right-0 bottom-32 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(26,26,26,0.08)', boxShadow: '0 4px 16px rgba(26,26,26,0.08)' }}>
                  <span className="text-yellow-500 text-lg">★★★★★</span>
                  <div>
                    <div className="font-display font-bold text-sm" style={{ color: '#1A1A1A' }}>Trusted</div>
                    <div className="text-xs" style={{ color: 'rgba(107,107,107,0.90)' }}>by 1,400+ artists</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GENRE TICKER ── */}
      <div className="ticker-wrap py-4">
        <div className="ticker-track">
          {[...GENRES, ...GENRES].map((g, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-4 font-body text-sm font-medium" style={{ color: '#6B6B6B' }}>
              {g} <span style={{ color: '#FF6A00', opacity: 0.8 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="py-24 px-6" id="services" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-xl mb-14">
            <span className="section-label">What We Do</span>
            <h2 className="font-display font-bold text-5xl mb-4" style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}>Promotion That <span className="grad-text">Actually Works</span></h2>
            <p style={{ color: '#6B6B6B' }}>Every campaign is tailored to your sound, your audience, and your goals. No bots. No shortcuts. No excuses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(s => (
              <Link key={s.title} to={s.to} className="glass-card p-8 block group">
                <div className="rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: s.bg, width: 56, height: 56, border: `1.5px solid ${s.color}33`, color: s.color }}>
                  {s.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-3" style={{ color: '#1A1A1A' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B6B6B' }}>{s.desc}</p>
                <span className="text-sm font-display font-bold flex items-center gap-1" style={{ color: s.color }}>
                  Explore <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* All Platforms Banner */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="rounded-3xl px-8 py-8 text-center" style={{ background: 'linear-gradient(135deg,#1A1A1A 0%,#2D1A0E 100%)', border: '1.5px solid rgba(255,106,0,0.2)' }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ background: 'rgba(255,106,0,0.15)', border: '1px solid rgba(255,106,0,0.3)', color: '#FF6A00' }}>
              <BulletDot /> All Platforms Covered
            </div>
            <h3 className="font-display font-bold text-2xl mb-2" style={{ color: 'white', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
              We Promote on <span style={{ color: '#FF6A00' }}>Every Major Platform</span>
            </h3>
            <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
              From the world's biggest streaming giants to the platforms dominating Africa and beyond — your music, everywhere it matters.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {ALL_PLATFORMS.map(p => (
                <div key={p.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${p.color}33`, color: 'rgba(255,255,255,0.85)' }}>
                  <span style={{ color: p.color, display: 'flex', alignItems: 'center' }}>{p.icon}</span>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PACKAGES PREVIEW ── */}
      <section className="py-24 px-6" id="packages" style={{ background: '#F3EFEA' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Spotify Packages</span>
            <h2 className="font-display font-bold text-5xl mb-4" style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}>Choose Your <span className="grad-text">Launch Pad</span></h2>
            <p className="max-w-sm mx-auto" style={{ color: '#6B6B6B' }}>Transparent pricing, no hidden fees. Every listener is real, every campaign is handcrafted.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {SPOTIFY_PACKAGES.map(pkg => <PricingCard key={pkg.id} pkg={pkg} onOrder={openOrder} />)}
          </div>
          <div className="text-center">
            <p className="mb-4 text-sm" style={{ color: 'rgba(107,107,107,0.90)' }}>Not seeing exactly what you need?</p>
            <button onClick={openSpotify} className="btn-outline">Request Custom Offer →</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="py-6"><StatsBar /></div>

      {/* ── ABOUT SPLIT ── */}
      <section className="py-24 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ height: 460 }}>
              <img
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop&crop=center"
                alt="Music producer in studio"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 px-5 py-4 rounded-2xl font-display font-bold text-sm shadow-xl"
              style={{ background: '#FF6A00', color: 'white', boxShadow: '0 4px 20px rgba(255,106,0,0.30)' }}>
              <div className="text-2xl font-black">1,400+</div>
              <div className="text-white/80 text-xs">Artists Amplified</div>
            </div>
            <div className="absolute -top-4 -left-4 px-4 py-3 rounded-xl shadow-xl"
              style={{ background: '#FFFFFF', border: '1px solid rgba(26,26,26,0.08)', boxShadow: '0 4px 16px rgba(26,26,26,0.08)' }}>
              <div className="flex items-center gap-2">
                <span style={{ color: '#1DB954', fontSize: 20 }}>♫</span>
                <div>
                  <div className="font-display font-bold text-xs" style={{ color: '#1A1A1A' }}>50M+ Streams</div>
                  <div className="text-xs" style={{ color: 'rgba(107,107,107,0.90)' }}>delivered globally</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span className="section-label">About Echorise</span>
            <h2 className="font-display font-bold text-4xl mb-5 leading-tight" style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}>
              Built by Music Lovers,<br />
              <span className="grad-text">For Music Makers</span>
            </h2>
            <p className="mb-5 leading-relaxed" style={{ color: '#6B6B6B' }}>
              Echorise Media was built because real artists deserve real results. We understand the struggle of getting your sound heard in a saturated world — so we built a system that actually works.
            </p>
            <p className="mb-8 leading-relaxed" style={{ color: '#6B6B6B' }}>
              We connect your music directly to real, engaged audiences who genuinely love your genre — across the world's biggest streaming platforms.
            </p>
            <div className="flex flex-col gap-3">
              {[
                ['100% real listeners — no bots, no fake streams',          '#1DB954'],
                ['Genre-targeted campaigns reaching the right audience',    '#FF6A00'],
                ['Campaigns live within 48 hours of payment',              '#4B3F72'],
                ['Full analytics report delivered at campaign end',         '#FF6A00'],
              ].map(([text, color]) => (
                <div key={text} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(26,26,26,0.65)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold"
                    style={{ background: color + '18', border: `1.5px solid ${color}40`, color }}>✓</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOM SPOTIFY SECTION ── */}
      <section className="py-24 px-6" id="spotify-custom" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-label" style={{ color: '#1DB954' }}>Custom Spotify Campaigns</span>
            <h2 className="font-display font-bold text-5xl mb-4" style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}>Your Sound. <span className="grad-text-spotify">Our Strategy.</span></h2>
            <p className="mb-8" style={{ color: '#6B6B6B' }}>Not every artist fits a template. If you have a specific budget, target chart position, or niche audience in mind, our Spotify specialists will build a campaign around your exact goals.</p>
            <ul className="flex flex-col gap-3 mb-8">
              {['Bespoke promotion strategy for your genre','Target specific countries and listener demographics','Chart position targeting in selected markets','Custom proposal delivered within 24 hours'].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#6B6B6B' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: 'rgba(29,185,84,0.12)', border: '1.5px solid rgba(29,185,84,0.3)', color: '#1DB954' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={openSpotify} className="btn-spotify">
              Request Custom Spotify Campaign →
            </button>
          </div>
          <div className="glass-card p-8" style={{ borderColor: 'rgba(29,185,84,0.2)' }}>
            <div className="rounded-2xl overflow-hidden mb-6" style={{ height: 200 }}>
              <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=300&fit=crop&crop=center" alt="Music production" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                style={{ background: 'linear-gradient(135deg,#1DB954,#00a846)' }}>♫</div>
              <div>
                <div className="font-display font-bold" style={{ color: '#1A1A1A' }}>Custom Spotify Package</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(26,26,26,0.28)' }}>Tailored to your track & goals</div>
              </div>
            </div>
            {[['Listener targeting','Custom'],['Chart position','Included'],['Budget range','$50 – $1,000+'],['Proposal turnaround','24 hours']].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2.5 text-sm" style={{ borderBottom: '1px solid rgba(26,26,26,0.08)' }}>
                <span style={{ color: 'rgba(107,107,107,0.90)' }}>{k}</span>
                <span style={v === 'Custom' || v === 'Included' ? { color: '#1DB954', fontWeight: 700 } : { color: '#1A1A1A', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div className="mt-5 p-3 rounded-xl text-xs italic" style={{ background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.2)', color: '#6B6B6B' }}>
              "We'll build a campaign that fits your budget, sound, and ambitions — not the other way around."
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNER LOGOS ── */}
      <PartnerLogos />

      {/* ── TOP ARTISTS ── */}
      <TopArtists onOrder={openOrder} />

      {/* ── HOW WE WORK / TRUST ── */}
      <TrustSection onOrder={openOrder} />

      {/* ── TEAM ── */}
      <TeamSection />

      {/* ── VIDEO TESTIMONIALS ── */}
      <VideoTestimonials />

      {/* ── REVIEWS ── */}
      <section className="py-24 px-6" id="reviews" style={{ background: '#F3EFEA' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Artist Reviews</span>
            <h2 className="font-display font-bold text-5xl mb-4" style={{ color: '#1A1A1A', letterSpacing: '-0.02em', fontFamily: 'Syne, sans-serif' }}>Artists We've <span className="grad-text">Amplified</span></h2>
            <p className="max-w-md mx-auto" style={{ color: '#6B6B6B' }}>Over 1,400 artists have trusted Echorise Media with their music. Here's what some of them had to say.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.map(r => <ReviewCard key={r.name} review={r} />)}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden text-center" style={{ background: 'linear-gradient(135deg, #FF6A00 0%, #E85F00 100%)' }}>
        <div className="orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: '#FFFFFF', opacity: 0.08 }} />
        <div className="max-w-2xl mx-auto relative z-10">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase mb-5 px-4 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.20)', color: 'white' }}>Ready When You Are</span>
          <h2 className="font-display font-bold text-5xl mb-5 text-white" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>Ready to <em>Rise?</em></h2>
          <p className="mb-8 text-lg" style={{ color: 'rgba(255,255,255,0.80)' }}>Let's build a campaign around your sound, your audience, and your goals. The conversation is free — the results are not.</p>
          <button onClick={() => openOrder()} className="text-base px-12 py-4 rounded-full font-bold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: '#FFFFFF', color: '#FF6A00', fontWeight: 700 }}>
            Get Your Custom Offer →
          </button>
          <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.60)' }}>No commitment. Response within 24 hours. We respond to every inquiry.</p>
        </div>
      </section>

      <OrderModal isOpen={orderOpen} onClose={closeOrder} preselect={orderPreselect} />
      <SpotifyCustomModal isOpen={spotifyOpen} onClose={closeSpotify} />
    </>
  )
}
