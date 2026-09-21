// ── Netlify Function — contact / social links proxy ────────────────────────────
// Reads contact + social values from Netlify environment variables so they never
// have to be hardcoded in the client bundle. Set them in
// Netlify Dashboard → Site configuration → Environment variables:
//   WHATSAPP_NUMBER    e.g. 2348012345678        (WhatsApp button)
//   TELEGRAM_LINK      e.g. https://t.me/echorisemedia   (Telegram button — full link, EDIT THIS to change it)
//   TELEGRAM_USERNAME  e.g. echorisemedia          (optional fallback if TELEGRAM_LINK isn't set; no @ or URL needed)
//   TIKTOK_URL         e.g. https://tiktok.com/@echorisemedia   (optional)
//   INSTAGRAM_URL      e.g. https://instagram.com/echorisemedia (optional)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

export const handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' }
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  // Every value is optional — the frontend simply hides the related button/link
  // if a value isn't set, so leaving any of them unconfigured never causes an error.
  const body = {}
  if (process.env.WHATSAPP_NUMBER) body.whatsappNumber = process.env.WHATSAPP_NUMBER.trim()

  // Telegram: a full link (TELEGRAM_LINK) wins; otherwise fall back to the old username variable.
  const rawTgLink = (process.env.TELEGRAM_LINK || '').trim()
  if (rawTgLink) {
    const tgLink = /^https?:\/\//i.test(rawTgLink) ? rawTgLink : `https://${rawTgLink.replace(/^\/+/, '')}`
    body.telegramLink = tgLink
  } else if (process.env.TELEGRAM_USERNAME) {
    body.telegramUsername = process.env.TELEGRAM_USERNAME.replace(/^@/, '').trim()
  }
  if (process.env.TIKTOK_URL) body.tiktokUrl = process.env.TIKTOK_URL.trim()
  if (process.env.INSTAGRAM_URL) body.instagramUrl = process.env.INSTAGRAM_URL.trim()

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}
