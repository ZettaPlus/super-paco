'use client'

import { useEffect, useState } from 'react'

export default function RotateScreenButton() {
  const [rotated, setRotated] = useState(false)
  useEffect(() => {
    document.body.classList.toggle('screen-rotated', rotated)
  }, [rotated])
  return (
    <button
      onClick={() => setRotated(v => !v)}
      aria-pressed={rotated}
      aria-label="Girar pantalla 180°"
      className="fixed z-50 bottom-4 right-4 rounded-full bg-black/70 text-white px-3 py-2 text-sm hover:bg-black/80 active:scale-95"
    >
      {rotated ? 'Normal' : 'Girar 180°'}
    </button>
  )
}


