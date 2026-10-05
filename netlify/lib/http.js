// Small response helpers for Netlify Functions v2 (Fetch API style).

export function json(status, data, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  })
}

export async function readJson(req, maxBytes = 4 * 1024 * 1024) {
  const text = await req.text()
  if (text.length > maxBytes) throw Object.assign(new Error('Request too large'), { status: 413 })
  try {
    return JSON.parse(text || '{}')
  } catch {
    throw Object.assign(new Error('Invalid JSON'), { status: 400 })
  }
}

export function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
