// Sends a website form to the Netlify function that emails the Echorise team.
// Resolves only when the server confirms the email was accepted; otherwise it
// throws an Error whose message is safe to show to the visitor.

const ENDPOINT = '/.netlify/functions/submit'

export async function submitForm(type, data) {
  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...data }),
    })
  } catch {
    throw new Error('Could not reach the server. Check your internet connection and try again.')
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(body.error || 'Something went wrong while sending. Please try again, or email support@echorisemedia.com.')
  }
  return body
}
