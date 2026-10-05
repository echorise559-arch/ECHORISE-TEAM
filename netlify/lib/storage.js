// Artist spotlight storage on Netlify Blobs (built in, no extra account needed).
//   store "artists"        -> key "week" | "month"  (JSON record)
//   store "artist-images"  -> key "week" | "month"  (image bytes + content type)

import { getStore } from '@netlify/blobs'

export const SLOTS = ['week', 'month']

const LIMITS = {
  name: 80,
  tagline: 90,
  label: 40,
  description: 600,
  linkLabel: 40,
  url: 300,
  maxSocials: 6,
  maxStreaming: 8,
  maxImageBytes: 1_500_000,
}
export { LIMITS }

export const SOCIAL_PLATFORMS = ['Instagram', 'TikTok', 'X (Twitter)', 'YouTube', 'Facebook', 'Snapchat', 'Threads', 'Website', 'Other']
export const STREAMING_PLATFORMS = [
  'Spotify', 'Apple Music', 'Audiomack', 'Boomplay', 'SoundCloud', 'YouTube Music',
  'YouTube', 'Deezer', 'Tidal', 'Amazon Music', 'Bandcamp', 'Other',
]

const records = () => getStore('artists')
const images = () => getStore('artist-images')

export async function readRecord(slot) {
  try {
    const data = await records().get(slot, { type: 'json' })
    return data || null
  } catch {
    return null
  }
}

export async function writeRecord(slot, record) {
  await records().setJSON(slot, record)
}

export async function deleteRecord(slot) {
  await records().delete(slot)
  await images().delete(slot)
}

export async function readImage(slot) {
  try {
    const found = await images().getWithMetadata(slot, { type: 'arrayBuffer' })
    if (!found || !found.data) return null
    return { data: found.data, contentType: found.metadata?.contentType || 'image/jpeg' }
  } catch {
    return null
  }
}

export async function writeImage(slot, bytes, contentType) {
  // Netlify Blobs accepts an ArrayBuffer; copy exactly the bytes of the Buffer.
  const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  await images().set(slot, buf, { metadata: { contentType } })
}

export async function deleteImage(slot) {
  await images().delete(slot)
}

// ── Validation ────────────────────────────────────────────────────────────────

function cleanText(value, max) {
  return String(value ?? '').replace(/\r\n/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max)
}

export function cleanUrl(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  if (withScheme.length > LIMITS.url) return null
  let u
  try {
    u = new URL(withScheme)
  } catch {
    return null
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null
  if (!u.hostname.includes('.')) return null
  return u.toString()
}

function cleanLinks(list, allowed, max, fieldName) {
  if (list === undefined || list === null) return { links: [] }
  if (!Array.isArray(list)) return { error: `${fieldName} must be a list` }
  const out = []
  for (const item of list) {
    const platform = cleanText(item?.platform, LIMITS.linkLabel)
    const url = cleanUrl(item?.url)
    if (!platform && !String(item?.url ?? '').trim()) continue
    if (!allowed.includes(platform)) return { error: `Choose a valid platform in ${fieldName}` }
    if (!url) return { error: `Enter a valid link for ${platform} in ${fieldName}` }
    out.push({ platform, url })
    if (out.length > max) return { error: `${fieldName} allows at most ${max} links` }
  }
  return { links: out }
}

export function validateInput(input) {
  const name = cleanText(input?.name, LIMITS.name)
  if (!name) return { error: 'Artist name is required' }
  const description = cleanText(input?.description, LIMITS.description)
  const tagline = cleanText(input?.tagline, LIMITS.tagline)
  const label = cleanText(input?.label, LIMITS.label)

  const socials = cleanLinks(input?.socials, SOCIAL_PLATFORMS, LIMITS.maxSocials, 'Social links')
  if (socials.error) return { error: socials.error }
  const streaming = cleanLinks(input?.streaming, STREAMING_PLATFORMS, LIMITS.maxStreaming, 'Streaming links')
  if (streaming.error) return { error: streaming.error }

  return { value: { name, tagline, label, description, socials: socials.links, streaming: streaming.links } }
}

// ── Image decoding ────────────────────────────────────────────────────────────

export function decodeImage(dataUrl) {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''))
  if (!m) return { error: 'Image must be a JPG, PNG or WebP file' }
  const bytes = Buffer.from(m[2], 'base64')
  if (bytes.length === 0) return { error: 'Image is empty' }
  if (bytes.length > LIMITS.maxImageBytes) return { error: 'Image is too large after resizing. Try a smaller image' }
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
  const isWebp = bytes.slice(0, 4).toString('latin1') === 'RIFF' && bytes.slice(8, 12).toString('latin1') === 'WEBP'
  const actual = isJpeg ? 'image/jpeg' : isPng ? 'image/png' : isWebp ? 'image/webp' : null
  if (!actual) return { error: 'The file is not a valid image' }
  return { bytes, contentType: actual }
}
