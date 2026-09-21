import { useState, useEffect } from 'react'

const TG_TEXT = encodeURIComponent("Hi Echorise Media, I'd like to know more about your services")

/**
 * Fetches Telegram / TikTok / Instagram links from the Netlify function
 * (reads TELEGRAM_LINK — or the older TELEGRAM_USERNAME — plus TIKTOK_URL and
 * INSTAGRAM_URL env vars server-side).
 * Any value that isn't configured comes back as null so callers can simply
 * hide that button/icon instead of rendering a dead link — nothing errors
 * or breaks if these variables are left unset.
 */
export function useSocialLinks() {
  const [links, setLinks] = useState({
    telegramLink: null,
    tiktokUrl: null,
    instagramUrl: null,
    loaded: false,
  })

  useEffect(() => {
    fetch('/.netlify/functions/get-contact')
      .then(r => r.json())
      .then(data => {
        setLinks({
          telegramLink: data.telegramLink
            ? data.telegramLink
            : data.telegramUsername ? `https://t.me/${data.telegramUsername}?text=${TG_TEXT}` : null,
          tiktokUrl: data.tiktokUrl || null,
          instagramUrl: data.instagramUrl || null,
          loaded: true,
        })
      })
      .catch(err => {
        console.warn('get-contact error:', err)
        setLinks(prev => ({ ...prev, loaded: true }))
      })
  }, [])

  return links
}
