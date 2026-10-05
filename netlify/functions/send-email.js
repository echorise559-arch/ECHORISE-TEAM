// ── Netlify Function: Brevo email proxy (invoice emails) ──────────────────────
// Runs server-side so the Brevo API key never reaches the browser.
// Locked: only a signed-in admin (Bearer token from admin-login) can use it,
// so nobody else can send mail as support@echorisemedia.com.

import { isAuthorized } from '../lib/auth.js'

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'
const reply = (statusCode, obj) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(obj),
})

export const handler = async function (event) {
  if (event.httpMethod !== 'POST') return reply(405, { error: 'Method Not Allowed' })

  if (!isAuthorized(event)) {
    return reply(401, { error: 'Session expired. Please sign in again.' })
  }

  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return reply(500, { error: 'Brevo API key not configured' })

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return reply(400, { error: 'Invalid JSON' })
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || `Brevo error ${res.status}`)
    return reply(200, data)
  } catch (err) {
    return reply(500, { error: err.message })
  }
}
