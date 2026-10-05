// Public form endpoint. Every website form posts here and the details are
// emailed directly to the team through Brevo (no third-party form service).
//   POST { type: "contact" | "custom_request" | "order" | "invoice_request", ...fields }
// Success is only reported after Brevo accepts the message.

import { json, readJson } from '../lib/http.js'
import { sendMail, notifyRecipients, renderTable } from '../lib/mail.js'

const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/

const clip = (v, n) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n)
const oneLine = (v, n) => clip(v, n).replace(/\s+/g, ' ')

// ── Best-effort rate limit (per function instance) ───────────────────────────
const hits = new Map()
function limited(ip) {
  const now = Date.now()
  const windowMs = 10 * 60 * 1000
  const list = (hits.get(ip) || []).filter(t => now - t < windowMs)
  if (list.length >= 8) { hits.set(ip, list); return true }
  list.push(now)
  hits.set(ip, list)
  if (hits.size > 500) {
    for (const [k, v] of hits) if (!v.some(t => now - t < windowMs)) hits.delete(k)
  }
  return false
}

// ── Per-type definitions ──────────────────────────────────────────────────────
function needEmail(v) {
  const email = oneLine(v, 200)
  return EMAIL_RE.test(email) ? email : null
}

const TYPES = {
  contact(b) {
    const name = oneLine(b.name, 120)
    const email = needEmail(b.email)
    const message = clip(b.message, 5000)
    if (!name || !email || !message) return { error: 'Please fill in your name, a valid email and your message.' }
    const subject = oneLine(b.subject, 200)
    return {
      replyTo: { email, name },
      subject: `New contact message from ${name}`,
      title: 'New contact message',
      rows: [['Name', name], ['Email', email], ['Subject', subject || '(none)'], ['Message', message]],
    }
  },

  custom_request(b) {
    const artistName = oneLine(b.artistName, 120)
    const email = needEmail(b.email)
    const trackLink = oneLine(b.trackLink, 500)
    const country = oneLine(b.country, 80)
    const platform = oneLine(b.platform, 40)
    const budget = Number(b.budget)
    if (!artistName || !email || !trackLink || !country) return { error: 'Please complete all required fields.' }
    return {
      replyTo: { email, name: artistName },
      subject: `New custom promotion request: ${artistName}${platform ? ` (${platform})` : ''}`,
      title: 'New custom promotion request',
      rows: [
        ['Artist', artistName], ['Email', email], ['Platform', platform],
        ['Track link', trackLink], ['Budget (USD)', Number.isFinite(budget) ? String(budget) : ''],
        ['Country', country], ['Desired chart position', oneLine(b.chartPosition, 120)],
        ['Notes', clip(b.notes, 3000)],
      ],
    }
  },

  order(b) {
    const artistName = oneLine(b.artistName, 120)
    const email = needEmail(b.email)
    const trackLink = oneLine(b.trackLink, 500)
    const platform = oneLine(b.platform, 60)
    const pkg = oneLine(b.package, 160)
    const country = oneLine(b.country, 80)
    if (!artistName || !email || !trackLink || !platform || !pkg || !country) return { error: 'Please complete all required fields.' }
    const paymentLink = oneLine(b.paymentLink, 300)
    return {
      replyTo: { email, name: artistName },
      subject: `New order: ${artistName} (${pkg})`,
      title: 'New campaign order',
      rows: [
        ['Artist', artistName], ['Email', email], ['Track link', trackLink],
        ['Platform', platform], ['Package', pkg], ['Country', country],
        ['Payment page', paymentLink || 'No payment link: send a quote or invoice'],
        ['Terms accepted', b.agreeTerms ? 'Yes' : 'No'],
        ['Notes', clip(b.notes, 3000)],
      ],
      footer: 'The customer was sent to the payment page after submitting. Confirm payment before starting the campaign.',
    }
  },

  invoice_request(b) {
    const name = oneLine(b.name, 120)
    const email = needEmail(b.email)
    const amount = Number(b.amount)
    if (!name || !email) return { error: 'Please enter your name and a valid email.' }
    return {
      replyTo: { email, name },
      subject: `Invoice request: ${name}`,
      title: 'New invoice request',
      rows: [
        ['Name', name], ['Email', email], ['Platform', oneLine(b.platform, 40)],
        ['Amount (USD)', Number.isFinite(amount) ? String(amount) : ''],
        ['Notes', clip(b.notes, 3000)],
      ],
      footer: 'Create the invoice from the admin invoice panel and send it to this email address.',
    }
  },
}

export default async (req, context) => {
  if (req.method !== 'POST') return json(405, { error: 'Method Not Allowed' })

  let body
  try {
    body = await readJson(req, 60_000)
  } catch (err) {
    return json(err.status || 400, { error: err.message })
  }

  // Hidden honeypot field: real visitors never fill it in.
  if (body.hp) return json(200, { ok: true })

  const build = TYPES[body.type]
  if (!build) return json(400, { error: 'Unknown form type.' })

  const ip = context?.ip || req.headers.get('x-nf-client-connection-ip') || 'unknown'
  if (limited(ip)) return json(429, { error: 'Too many submissions. Please wait a few minutes and try again.' })

  const result = build(body)
  if (result.error) return json(400, { error: result.error })

  try {
    await sendMail({
      to: notifyRecipients(),
      subject: result.subject,
      htmlContent: renderTable(result.title, [...result.rows, ['Received', new Date().toUTCString()]], result.footer || ''),
      replyTo: result.replyTo,
    })
    return json(200, { ok: true })
  } catch (err) {
    console.error('submit: email failed', body.type, err.code, err.message)
    return json(502, { error: 'We could not send your message right now. Please try again, or email support@echorisemedia.com.' })
  }
}
