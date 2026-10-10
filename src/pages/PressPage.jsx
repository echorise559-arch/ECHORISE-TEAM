import useSEO from '../hooks/useSEO'
import { useState } from 'react'
import PageHero from '../components/PageHero'
import PressRequestModal, { PRESS_OUTLETS } from '../components/PressRequestModal'

const ACCENT = '#FF6A00'

const PenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
)
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const FEATURES = [
  { icon: <PenIcon />, title: 'Professionally Written Articles', desc: 'Your story is written by experienced music writers and published in full on the outlet you choose.' },
  { icon: <LinkIcon />, title: 'Permanent Backlinks', desc: 'Each article links to your Spotify, YouTube or any music page you want people to visit.' },
  { icon: <ShareIcon />, title: 'Shared on Their Socials', desc: 'The outlet posts about your feature on its own social media page, putting it in front of its followers.' },
  { icon: <SearchIcon />, title: 'Better Search Visibility', desc: 'Published coverage gives your name and brand more presence when people search for you on Google.' },
  { icon: <ClockIcon />, title: 'Coverage That Stays Online', desc: 'Your article remains published, so it keeps working for you long after release week.' },
  { icon: <UsersIcon />, title: 'Seen by the Right People', desc: 'Listeners, labels and fellow artists often check press coverage when deciding who to follow and work with.' },
]

const HOW_IT_WORKS = [
  ['01', 'Choose a Package', 'Pick the package that suits you and select the outlets you want to be featured on.'],
  ['02', 'Share Your Story', 'Send us your music links, a short bio and the highlights you want covered.'],
  ['03', 'We Write Your Article', 'Our writers turn your details into a clear, well-written press article.'],
  ['04', 'Published and Shared', 'Your article goes live, the outlet shares it on social media, and we send you the links.'],
]

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'One feature on the outlet of your choice.',
    outlets: 'Choose 1 of the 5 outlets',
    items: [
      'A professionally written and published press article',
      'Permanent backlink to your Spotify, YouTube or any music page',
      'Social media post on the outlet\'s page',
      'Stronger search presence for your artist name and brand',
    ],
    badge: '',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Two outlets, double the reach and credibility.',
    outlets: 'Choose any 2 of the 5 outlets',
    items: [
      '2 high-quality press articles on major platforms',
      'Social media promotion from both outlets',
      'More exposure and a stronger artist brand',
    ],
    badge: 'Popular',
  },
  {
    id: 'elite',
    name: 'Elite',
    tagline: 'Complete coverage across all five outlets.',
    outlets: 'All 5 outlets included',
    items: [
      '5 press articles across the full outlet list',
      'Permanent, published coverage on every outlet',
      'Backlinks to all of your music links',
      'Social media posts on every outlet',
      'The widest search visibility and brand reach we offer',
    ],
    badge: 'Full coverage',
  },
]

const BENEFITS = [
  ['Builds Credibility', 'Press coverage shows people that your music is being talked about by real publications.'],
  ['Reaches New People', 'Attract listeners, labels and collaborators who find you through the articles.'],
  ['Strengthens Your Presence', 'Give your name more places to be found online, all linked back to your music.'],
  ['Real, Published Coverage', 'Every article is published on a live outlet that you can open, read and share.'],
]

const FAQS = [
  { q: 'Which outlets can I be featured on?', a: 'We work with ' + PRESS_OUTLETS.join(', ') + '. Starter includes one outlet of your choice, Pro includes any two, and Elite covers all five.' },
  { q: 'What do you need from me?', a: 'Your artist name, a link to your music, a short bio and anything you would like the article to highlight, such as a new release, achievements or your story so far.' },
  { q: 'Will the article link to my music?', a: 'Yes. Each article includes a permanent link to your Spotify, YouTube or any other music page you choose.' },
  { q: 'Does the outlet share my feature on social media?', a: 'Yes. Every package includes a post about your feature on the outlet\'s own social media page.' },
  { q: 'How do I get started?', a: 'Tap Request a Feature, choose your package and outlets, and tell us about your music. We reply by email within 24 hours with the next steps.' },
]

export default function PressPage() {
  useSEO({
    title: 'Press Features for Artists | Echorise Media — Music Media Coverage',
    description: 'Get your story published on respected music and entertainment outlets. Professionally written press articles with backlinks to your music and social media posts from each outlet.',
    canonical: 'https://echorisemedia.com/press',
  })
  const [requestOpen, setRequestOpen] = useState(false)
  const [preselect, setPreselect] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const openRequest = (id) => {
    setPreselect(id || '')
    setRequestOpen(true)
  }

  const scrollToPackages = () => {
    const el = document.getElementById('press-packages')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHero
        label="Press Features"
        title={<>Get Your Story<br /><span className="grad-text">Published</span></>}
        subtitle="Take your music career further with professionally written coverage on respected music and entertainment outlets. Build recognition, strengthen your artist image and grow your audience."
        accent={ACCENT}
        image="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&h=700&fit=crop&crop=center"
      >
        <div className="flex gap-4 flex-wrap">
          <button onClick={() => openRequest('')} className="btn-primary">Request a Feature →</button>
          <button onClick={scrollToPackages} className="btn-ghost">View Packages</button>
        </div>
      </PageHero>

      {/* Outlets */}
      <section className="py-20 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="section-label" style={{ color: ACCENT }}>Our Outlets</span>
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Where Your Story <span className="grad-text">Gets Featured</span></h2>
            <p className="max-w-xl mx-auto text-sm" style={{ color: '#6B6B6B' }}>Choose from five music and entertainment outlets that cover artists, releases and the culture around them.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {PRESS_OUTLETS.map((name, i) => (
              <div key={name} className="glass-card p-6 text-center">
                <div className="font-display font-black text-3xl mb-2 grad-text" style={{ opacity: 0.35 }}>{String(i + 1).padStart(2, '0')}</div>
                <h3 className="font-display font-bold" style={{ color: '#1A1A1A' }}>{name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label" style={{ color: ACCENT }}>How It Works</span>
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Simple Process. <span className="grad-text">Clear Results.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(([num, title, desc]) => (
              <div key={num} className="glass-card p-6">
                <div className="font-display font-black text-5xl mb-3 grad-text" style={{ opacity: 0.25 }}>{num}</div>
                <h3 className="font-display font-bold mb-2" style={{ color: '#1A1A1A' }}>{title}</h3>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="press-packages" className="py-20 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label" style={{ color: ACCENT }}>Packages</span>
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Music Promotion <span className="grad-text">Press Packages</span></h2>
            <p className="max-w-xl mx-auto text-sm" style={{ color: '#6B6B6B' }}>Each package helps you gain recognition, strengthen your artist image and grow your audience across leading music platforms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map(p => (
              <div key={p.id} className="glass-card p-8 flex flex-col relative" style={p.badge ? { border: `1.5px solid ${ACCENT}55` } : undefined}>
                {p.badge && (
                  <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,106,0,0.10)', color: ACCENT, border: '1px solid rgba(255,106,0,0.30)' }}>{p.badge}</span>
                )}
                <h3 className="font-display font-bold text-2xl mb-1" style={{ color: '#1A1A1A' }}>{p.name}</h3>
                <p className="text-sm mb-4" style={{ color: '#6B6B6B' }}>{p.tagline}</p>
                <div className="text-xs font-display font-bold uppercase tracking-wider mb-5 px-3 py-2 rounded-xl self-start" style={{ background: 'rgba(255,106,0,0.08)', color: ACCENT }}>{p.outlets}</div>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {p.items.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#1A1A1A' }}>
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,106,0,0.12)', color: ACCENT }}><CheckIcon /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => openRequest(p.id)} className="btn-primary justify-center w-full">Choose {p.name} →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 px-6" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <span className="section-label" style={{ color: ACCENT }}>What's Included</span>
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Coverage That <span className="grad-text">Works for You</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="glass-card p-7">
                <div className="mb-4" style={{ color: ACCENT }}>{f.icon}</div>
                <h3 className="font-display font-bold mb-2" style={{ color: '#1A1A1A' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why artists choose it */}
      <section className="py-20 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label" style={{ color: ACCENT }}>Why Artists Choose Press</span>
            <h2 className="font-display font-bold text-3xl mb-3" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Be Seen. Be <span className="grad-text">Taken Seriously.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BENEFITS.map(([title, desc]) => (
              <div key={title} className="glass-card p-7">
                <h3 className="font-display font-bold mb-2" style={{ color: '#1A1A1A' }}>{title}</h3>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="py-8 px-6" style={{ background: '#FAF7F2' }}>
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative h-64">
          <img src="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&h=500&fit=crop&crop=center" alt="Music studio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-8" style={{ background: 'linear-gradient(135deg,rgba(255,106,0,0.88),rgba(200,70,0,0.85))' }}>
            <h3 className="font-display font-bold text-3xl text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Ready to see your name in the press?</h3>
            <p className="text-white/80 mb-6 max-w-md">Tell us about your music and we will take care of the rest.</p>
            <button onClick={() => openRequest('')} className="px-8 py-3.5 rounded-full font-display font-bold text-sm cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg" style={{ background: '#1A1A1A', color: '#fff' }}>
              Request a Feature →
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">FAQ</span>
            <h2 className="font-display font-bold text-4xl mb-4" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>Press Features <span className="grad-text">Questions</span></h2>
          </div>
          <div className="flex flex-col" style={{ borderColor: 'rgba(26,26,26,0.08)' }}>
            {FAQS.map((item, i) => (
              <div key={item.q} className="py-6" style={{ borderBottom: '1px solid rgba(26,26,26,0.08)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center gap-5 text-left">
                  <span className="font-display font-semibold text-base" style={{ color: '#1A1A1A' }}>{item.q}</span>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 font-bold ${openFaq === i ? 'rotate-45' : ''}`}
                    style={{ background: 'rgba(255,106,0,0.08)', border: '1.5px solid rgba(255,106,0,0.25)', color: ACCENT }}>
                    +
                  </span>
                </button>
                <div className={`faq-answer text-sm leading-relaxed ${openFaq === i ? 'open' : ''}`} style={{ color: '#6B6B6B' }}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PressRequestModal isOpen={requestOpen} onClose={() => setRequestOpen(false)} preselect={preselect} />
    </>
  )
}
