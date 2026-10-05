// Public, read-only endpoint for the Artist of the Week / Month section.
//   GET /.netlify/functions/artists            -> { week: {...}|null, month: {...}|null, year: {...}|null }
//   GET /.netlify/functions/artists?image=week -> the stored image for that slot

import { SLOTS, readRecord, readImage } from '../lib/storage.js'
import { json } from '../lib/http.js'

function publicShape(slot, record) {
  if (!record || !record.name) return null
  return {
    slot,
    name: record.name,
    tagline: record.tagline || '',
    label: record.label || '',
    description: record.description || '',
    socials: record.socials || [],
    streaming: record.streaming || [],
    imageUrl: record.hasImage ? `/.netlify/functions/artists?image=${slot}&v=${record.updatedAt || 0}` : '',
  }
}

export default async (req) => {
  if (req.method !== 'GET') return json(405, { error: 'Method Not Allowed' })

  const url = new URL(req.url)
  const imageSlot = url.searchParams.get('image')

  if (imageSlot) {
    if (!SLOTS.includes(imageSlot)) return json(404, { error: 'Not found' })
    const img = await readImage(imageSlot)
    if (!img) return json(404, { error: 'Not found' })
    return new Response(img.data, {
      status: 200,
      headers: {
        'Content-Type': img.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }

  try {
    const [week, month, year] = await Promise.all(SLOTS.map(readRecord))
    return json(200, { week: publicShape('week', week), month: publicShape('month', month), year: publicShape('year', year) }, { 'Cache-Control': 'public, max-age=0, must-revalidate' })
  } catch (err) {
    console.error('artists: read failed', err)
    return json(500, { error: 'Could not load artists' })
  }
}
