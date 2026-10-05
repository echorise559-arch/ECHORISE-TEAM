// Counts quick taps/clicks on an element. After `required` taps within `windowMs`
// of each other, `revealed` becomes true. Used to show hidden admin shortcuts.

import { useCallback, useEffect, useRef, useState } from 'react'

export default function useFiveTap(required = 5, windowMs = 2000) {
  const [revealed, setRevealed] = useState(false)
  const count = useRef(0)
  const timer = useRef(null)

  const onTap = useCallback(() => {
    count.current += 1
    clearTimeout(timer.current)
    if (count.current >= required) {
      count.current = 0
      setRevealed(true)
      return
    }
    timer.current = setTimeout(() => { count.current = 0 }, windowMs)
  }, [required, windowMs])

  useEffect(() => () => clearTimeout(timer.current), [])

  return { revealed, onTap }
}
