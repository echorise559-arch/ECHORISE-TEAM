// Brevo transactional email helper (server-side only).
// Environment variables:
//   BREVO_API_KEY   Brevo API key (already used by the invoice sender)
//   NOTIFY_EMAILS   comma-separated inboxes that receive form submissions
//                   (defaults to support@ and hello@echorisemedia.com)

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email'

export const SENDER = { name: 'Echorise Media', email: 'support@echorisemedia.com' }
export const DEFAULT_NOTIFY = ['support@echorisemedia.com', 'hello@echorisemedia.com']

const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/

export function notifyRecipients() {
  const raw = (process.env.NOTIFY_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  const valid = [...new Set(raw.filter(e => EMAIL_RE.test(e)))]
  const list = valid.length ? valid : DEFAULT_NOTIFY
  return list.map(email => ({ email }))
}

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// rows: [[label, value], ...]. Values are escaped; newlines are preserved.
export function renderTable(title, rows, footer = '') {
  const body = rows
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(([k, v]) => `<tr>
<td style="padding:10px 14px;border-bottom:1px solid #EEE9E2;width:170px;vertical-align:top;font:600 12px Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6B6B6B">${esc(k)}</td>
<td style="padding:10px 14px;border-bottom:1px solid #EEE9E2;vertical-align:top;font:14px/1.6 Arial,sans-serif;color:#1A1A1A;white-space:pre-wrap;word-break:break-word">${esc(v)}</td>
</tr>`).join('')
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#FAF7F2">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;margin:0 auto;background:#FFFFFF;border:1px solid #EEE9E2;border-radius:12px;overflow:hidden">
<tr><td colspan="2" style="padding:18px 14px;background:#1A1A1A;border-bottom:3px solid #FF6A00;font:700 16px Arial,sans-serif;color:#FFFFFF">${esc(title)}</td></tr>
${body}
${footer ? `<tr><td colspan="2" style="padding:14px;font:12px Arial,sans-serif;color:#6B6B6B">${esc(footer)}</td></tr>` : ''}
</table></body></html>`
}

export async function sendMail({ to, subject, htmlContent, textContent, replyTo }) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    const err = new Error('BREVO_API_KEY is not set')
    err.code = 'NO_KEY'
    throw err
  }
  const payload = { sender: SENDER, to, subject, htmlContent }
  if (textContent) payload.textContent = textContent
  if (replyTo) payload.replyTo = replyTo

  let res
  try {
    res = await fetch(BREVO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'api-key': apiKey },
      body: JSON.stringify(payload),
    })
  } catch (cause) {
    const err = new Error(`Could not reach Brevo: ${cause.message}`)
    err.code = 'NETWORK'
    throw err
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || `Brevo responded with status ${res.status}`)
    err.code = 'BREVO'
    err.status = res.status
    throw err
  }
  return data
}
