// Server-side admin authentication.
// The password lives only in the ADMIN_PASSWORD environment variable.
// A successful login returns a signed, expiring token (HMAC-SHA256) that the
// admin pages send back as "Authorization: Bearer <token>". Nothing is stored.

import { createHmac, createHash, timingSafeEqual } from 'node:crypto'

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

function secretKey() {
  return `${process.env.ADMIN_PASSWORD || ''}|echorise-admin-session`
}

function sign(payload) {
  return createHmac('sha256', secretKey()).update(payload).digest('base64url')
}

function safeEqual(a, b) {
  const ha = createHash('sha256').update(String(a)).digest()
  const hb = createHash('sha256').update(String(b)).digest()
  return timingSafeEqual(ha, hb)
}

export function isAdminConfigured() {
  return typeof process.env.ADMIN_PASSWORD === 'string' && process.env.ADMIN_PASSWORD.length >= 8
}

export function checkPassword(candidate) {
  if (!isAdminConfigured()) return false
  return safeEqual(candidate || '', process.env.ADMIN_PASSWORD)
}

export function issueToken() {
  const exp = String(Date.now() + TOKEN_TTL_MS)
  const body = Buffer.from(exp).toString('base64url')
  return { token: `${body}.${sign(body)}`, expiresAt: Number(exp) }
}

export function verifyToken(token) {
  if (!isAdminConfigured() || typeof token !== 'string') return false
  const [body, sig] = token.split('.')
  if (!body || !sig) return false
  if (!safeEqual(sig, sign(body))) return false
  const exp = Number(Buffer.from(body, 'base64url').toString())
  return Number.isFinite(exp) && exp > Date.now()
}

// Accepts either a Fetch Request (functions v2) or a Lambda event (functions v1).
export function bearerFrom(source) {
  const h = typeof source?.headers?.get === 'function'
    ? source.headers.get('authorization')
    : (source?.headers?.authorization || source?.headers?.Authorization)
  if (!h || typeof h !== 'string') return ''
  const m = h.match(/^Bearer\s+(.+)$/i)
  return m ? m[1].trim() : ''
}

export function isAuthorized(source) {
  return verifyToken(bearerFrom(source))
}
