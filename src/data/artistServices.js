// ─── ARTIST SERVICES ─────────────────────────────────────────────────────────
// Six affordable services for independent musicians and artists.
//
// PAYMENT LINKS: there are only two, and each one charges a fixed amount.
// The price a visitor picks is the ONLY thing that decides which link is used
// (see getPaymentLink), so a price and a link can never get out of sync.
export const PAYMENT_LINKS = {
  5: 'https://nestuge.com/echorise43',
  10: 'https://nestuge.com/echorise44',
}

export const getPaymentLink = (price) => PAYMENT_LINKS[price] || ''

// For services sold at two prices. Edit the wording here once you decide exactly
// what separates the two options; the prices and links stay the same.
export const TIERS = {
  5: { label: 'Standard', note: 'A polished, professional design with a clear concept, built from your brief.' },
  10: { label: 'Premium', note: 'A more detailed custom design with richer styling, layered elements and extra polish.' },
}

export const ARTIST_SERVICES = [
  {
    id: 'artist-bio',
    icon: 'bio',
    name: 'Professional Artist Bio Rewrite',
    prices: [5],
    description: 'Make your musical identity stand out with a professional artist biography that tells your story, highlights your unique sound, and presents you professionally to potential fans, collaborators, and industry professionals.',
    includes: [
      'A professionally rewritten artist biography',
      'A shorter bio suitable for social media profiles',
      'A longer version for your website or electronic press kit (EPK)',
      'A clear presentation of your musical identity and unique story',
    ],
    linkLabel: 'Link to your music or profile',
    linkRequired: false,
    notesLabel: 'Your current bio and key facts',
    notesPlaceholder: 'Paste your current bio (if any), your genre, achievements, and anything you want highlighted…',
  },
  {
    id: 'cover-art',
    icon: 'cover',
    name: 'Single Cover Artwork Design',
    prices: [5, 10],
    description: 'Give your next release a professional visual identity with custom single-cover artwork designed to complement your music and artistic direction.',
    includes: [
      'Custom cover artwork for one single',
      'Artwork prepared in the appropriate square format for digital music releases',
      'One revision',
      'Delivery within 24 to 48 hours, subject to the agreed turnaround and receipt of all required materials',
    ],
    linkLabel: 'Link to your music or profile',
    linkRequired: false,
    notesLabel: 'Your artwork brief',
    notesPlaceholder: 'Single title, artist name as it should appear, style or mood you want, colours, reference images or links…',
  },
  {
    id: 'release-check',
    icon: 'check',
    name: 'Music Release Readiness Check',
    prices: [5],
    description: 'Get your next release checked before it goes live. Receive practical feedback to help you present your music professionally and catch overlooked issues before release day.',
    includes: [
      'Cover artwork quality and presentation review',
      'Artist name and song title consistency check',
      'Release information review',
      'Artist profile and music link review',
      'Release announcement readiness check',
      'A concise report highlighting areas that need attention',
    ],
    linkLabel: 'Link to your release or pre-save page',
    linkRequired: true,
    notesLabel: 'Release details',
    notesPlaceholder: 'Release title, release date, distributor, and anything specific you want us to look at…',
  },
  {
    id: 'spotify-audit',
    icon: 'audit',
    name: 'Spotify Artist Profile Audit',
    prices: [5],
    description: 'Make a stronger first impression when listeners discover your music. Get a professional review of your Spotify artist profile with practical recommendations to improve its presentation and consistency.',
    includes: [
      'Artist image and header presentation review, where applicable',
      'Artist biography review',
      'Artist Pick review, where available',
      'Release catalogue presentation review',
      'Consistency check between the artist’s identity and other platforms',
      'Three to five practical recommendations for improvement',
    ],
    note: 'A presentation review with practical recommendations. It does not promise specific growth, playlist, or placement results.',
    linkLabel: 'Your Spotify artist profile link',
    linkRequired: true,
    notesLabel: 'Other platforms and notes',
    notesPlaceholder: 'Links to your other platforms (Instagram, YouTube, Apple Music…) and anything you want us to focus on…',
  },
  {
    id: 'release-announcement',
    icon: 'announce',
    name: 'Custom Music Release Announcement',
    prices: [5],
    description: 'Announce your next single, EP, or album with professional, ready-to-post copy that communicates your release clearly and gives your audience a reason to pay attention.',
    includes: [
      'One release announcement caption',
      'One countdown post caption',
      'One release-day caption',
      'Relevant hashtags suited to the release',
    ],
    linkLabel: 'Link to your music or profile',
    linkRequired: false,
    notesLabel: 'Release details',
    notesPlaceholder: 'Title, whether it is a single, EP or album, release date, genre, the story behind it, and your tone (serious, fun, emotional…)',
  },
  {
    id: 'youtube-thumbnail',
    icon: 'thumbnail',
    name: 'YouTube Music Video Thumbnail Design',
    prices: [5, 10],
    description: 'Give your music videos, lyric videos, visualizers, and live performances a more professional presentation with a custom YouTube thumbnail designed around your music and artistic identity.',
    includes: [
      'One custom YouTube thumbnail',
      'Design suited to the artist’s musical identity and video',
      'Correct YouTube thumbnail dimensions',
      'One revision',
    ],
    linkLabel: 'Link to your video or channel',
    linkRequired: false,
    notesLabel: 'Your thumbnail brief',
    notesPlaceholder: 'Video title, artist name as it should appear, style or mood, colours, and any images you want us to use…',
  },
]
