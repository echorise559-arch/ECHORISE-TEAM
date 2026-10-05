// Admin-only: sends a test notification so email delivery can be confirmed after deploy.

import { isAuthorized } from '../lib/auth.js'
import { json } from '../lib/http.js'
import { sendMail, notifyRecipients, renderTable } from '../lib/mail.js'

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method Not Allowed' })
  if (!isAuthorized(req)) return json(401, { error: 'Session expired. Please sign in again.' })

  const to = notifyRecipients()
  try {
    await sendMail({
      to,
      subject: 'Echorise Media: test notification',
      htmlContent: renderTable('Test notification', [
        ['Status', 'Email delivery from the Echorise Media site is working.'],
        ['Sent at', new Date().toISOString()],
        ['Recipients', to.map(t => t.email).join(', ')],
      ], 'Form submissions from the website will arrive in this same format.'),
    })
    return json(200, { ok: true, recipients: to.map(t => t.email) })
  } catch (err) {
    console.error('test email failed', err.code, err.message)
    const hint = err.code === 'NO_KEY'
      ? 'BREVO_API_KEY is not set in the site environment variables.'
      : `Brevo said: ${err.message}`
    return json(502, { error: hint })
  }
}
