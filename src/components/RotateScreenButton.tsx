'use client'

import { useState } from 'react'

export default function RotateScreenButton({ onRotationChange }: { onRotationChange: (rotation: number) => void }) {
  const [rotation, setRotation] = useState(0)
  
  const toggle = () => {
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)
    onRotationChange(newRotation)
  }
  
  return (
    <button
      onClick={toggle}
      aria-label="Girar 90°"
      className="fixed z-50 bottom-4 right-4 rounded-full bg-black/70 text-white px-3 py-2 text-sm hover:bg-black/80 active:scale-95"
    >
      Girar 90°
    </button>
  )
}


