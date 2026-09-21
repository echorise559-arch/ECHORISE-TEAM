import { useState, useEffect } from 'react'

const WA_TEXT = encodeURIComponent("Hi Echorise Media, I'd like to know more about your services")

/**
 * Fetches the WhatsApp number from the Netlify function (reads WHATSAPP_NUMBER
 * env var server-side) and returns the full wa.me link.
 * Returns '#' until the fetch resolves so buttons are safe to render immediately.
 */
export function useWhatsApp() {
  const [waLink, setWaLink] = useState('#')

  useEffect(() => {
    fetch('/.netlify/functions/get-contact')
      .then(r => r.json())
      .then(data => {
        if (data.whatsappNumber) {
          setWaLink(`https://wa.me/${data.whatsappNumber}?text=${WA_TEXT}`)
        }
      })
      .catch(err => console.warn('get-contact error:', err))
  }, [])

  return waLink
}
