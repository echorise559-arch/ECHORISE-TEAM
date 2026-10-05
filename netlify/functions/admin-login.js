// POST { password } -> { token, expiresAt }   (sign in)
// GET  with Bearer token -> { ok: true }       (check an existing session)

import { checkPassword, isAdminConfigured, issueToken, isAuthorized } from '../lib/auth.js'
import { json, readJson, pause } from '../lib/http.js'

export default async (req) => {
  if (req.method === 'GET') {
    return isAuthorized(req) ? json(200, { ok: true }) : json(401, { error: 'Not signed in' })
  }
  if (req.method !== 'POST') return json(405, { error: 'Method Not Allowed' })

  if (!isAdminConfigured()) {
    return json(503, { error: 'ADMIN_PASSWORD is not set on the server (it must be at least 8 characters).' })
  }

  let body
  try {
    body = await readJson(req, 10_000)
  } catch (err) {
    return json(err.status || 400, { error: err.message })
  }

  if (!checkPassword(body.password)) {
    await pause(700) // slows down guessing
    return json(401, { error: 'Incorrect password' })
  }
  const { token, expiresAt } = issueToken()
  return json(200, { token, expiresAt })
}
