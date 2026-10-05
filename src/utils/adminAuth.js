// Client helpers for the hidden admin pages (/admin/invoice and /admin/artists).
// The password is checked on the server. The browser only keeps a signed,
// expiring token for the current tab (sessionStorage), never the password.

const KEY = 'echorise_admin_token'
const LOGIN = '/.netlify/functions/admin-login'

export function getToken() {
  try { return sessionStorage.getItem(KEY) || '' } catch { return '' }
}

function setToken(token) {
  try { sessionStorage.setItem(KEY, token) } catch { /* storage unavailable: session lasts until reload */ }
}

export function clearToken() {
  try { sessionStorage.removeItem(KEY) } catch { /* nothing to clear */ }
}

export async function login(password) {
  let res
  try {
    res = await fetch(LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.')
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Sign in failed')
  setToken(body.token)
  return body.token
}

// True when a stored token exists and the server still accepts it.
export async function hasValidSession() {
  const token = getToken()
  if (!token) return false
  try {
    const res = await fetch(LOGIN, { headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) return true
  } catch { /* offline: treat as signed out */ }
  clearToken()
  return false
}

// fetch() that attaches the admin token. A 401 clears the session and reports it.
export async function adminFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), Authorization: `Bearer ${getToken()}` },
  })
  if (res.status === 401) {
    clearToken()
    const err = new Error('Session expired. Please sign in again.')
    err.code = 'UNAUTHORIZED'
    throw err
  }
  return res
}
