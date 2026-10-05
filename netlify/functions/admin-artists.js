// Admin-only management of the three spotlight slots (week, month, year).
//   GET                      -> { week, month, year, options }   full records for editing
//   PUT    { slot, data, image } -> save a slot. image: data URL to replace,
//                               null to remove the image, omitted to keep it
//   DELETE ?slot=week|month|year  -> clear the slot (text, links and image)

import { isAuthorized } from '../lib/auth.js'
import { json, readJson } from '../lib/http.js'
import {
  SLOTS, LIMITS, SOCIAL_PLATFORMS, STREAMING_PLATFORMS,
  readRecord, writeRecord, deleteRecord, writeImage, deleteImage,
  validateInput, decodeImage,
} from '../lib/storage.js'

function editorShape(record) {
  if (!record) return null
  return {
    name: record.name || '',
    tagline: record.tagline || '',
    label: record.label || '',
    description: record.description || '',
    socials: record.socials || [],
    streaming: record.streaming || [],
    hasImage: !!record.hasImage,
    updatedAt: record.updatedAt || 0,
    imageUrl: record.hasImage ? `/.netlify/functions/artists?image=${record.slot}&v=${record.updatedAt || 0}` : '',
  }
}

export default async (req) => {
  if (!isAuthorized(req)) return json(401, { error: 'Session expired. Please sign in again.' })

  try {
    if (req.method === 'GET') {
      const [week, month, year] = await Promise.all(SLOTS.map(readRecord))
      return json(200, {
        week: editorShape(week && { ...week, slot: 'week' }),
        month: editorShape(month && { ...month, slot: 'month' }),
        year: editorShape(year && { ...year, slot: 'year' }),
        options: {
          socialPlatforms: SOCIAL_PLATFORMS,
          streamingPlatforms: STREAMING_PLATFORMS,
          limits: LIMITS,
        },
      })
    }

    if (req.method === 'PUT') {
      const body = await readJson(req)
      const slot = body.slot
      if (!SLOTS.includes(slot)) return json(400, { error: 'Unknown slot' })

      const checked = validateInput(body.data)
      if (checked.error) return json(400, { error: checked.error })

      const previous = await readRecord(slot)
      let hasImage = !!previous?.hasImage

      if (body.image === null) {
        await deleteImage(slot)
        hasImage = false
      } else if (typeof body.image === 'string') {
        const decoded = decodeImage(body.image)
        if (decoded.error) return json(400, { error: decoded.error })
        await writeImage(slot, decoded.bytes, decoded.contentType)
        hasImage = true
      }

      const record = { ...checked.value, hasImage, updatedAt: Date.now() }
      await writeRecord(slot, record)
      return json(200, { ok: true, [slot]: editorShape({ ...record, slot }) })
    }

    if (req.method === 'DELETE') {
      const slot = new URL(req.url).searchParams.get('slot')
      if (!SLOTS.includes(slot)) return json(400, { error: 'Unknown slot' })
      await deleteRecord(slot)
      return json(200, { ok: true })
    }

    return json(405, { error: 'Method Not Allowed' })
  } catch (err) {
    if (err.status) return json(err.status, { error: err.message })
    console.error('admin-artists failed', err)
    return json(500, { error: 'The server could not complete that action. Please try again.' })
  }
}
