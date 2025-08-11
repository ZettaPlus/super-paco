'use client'

import { useEffect, useMemo, useState } from 'react'
import { Ruleta } from '@/components/Ruleta'
import confetti from 'canvas-confetti'

type Slot = { id: string; label: string; background: string; textOrientation?: 'horizontal' | 'vertical' }

const generateId = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`)

export default function Home() {
  // Secuencia fija de 16 etiquetas: 5/2/5/4
  const labels = useMemo(() => [
    'Siga participando', 'Premio sorpresa', 'Siga participando', 'Vuelve a girar',
    'Premio sorpresa', 'Siga participando', 'Bono sorpresa', 'Premio sorpresa',
    'Siga participando', 'Vuelve a girar', 'Premio sorpresa', 'Siga participando',
    'Bono sorpresa', 'Vuelve a girar', 'Siga participando', 'Vuelve a girar',
  ], [])

  // Colores alternados para mejorar contraste visual
  const palette = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6']
  const slots: Slot[] = useMemo(() => labels.map((label, i) => ({
    id: generateId(),
    label,
    background: palette[i % palette.length],
    textOrientation: 'vertical',
  })), [labels])

  const [winner, setWinner] = useState<Slot | null>(null)

  // Auto-ocultar premio a los 5s
  useEffect(() => {
    if (!winner) return
    const t = setTimeout(() => setWinner(null), 5000)
    return () => clearTimeout(t)
  }, [winner])

  // Probabilidades: 31%, 13%, 31%, 25%
  const weights: Record<string, number> = {
    'siga participando': 31,
    'bono sorpresa': 13,
    'premio sorpresa': 31,
    'vuelve a girar': 25,
  }

  const handleSpinEnd = (win: Slot) => {
    setWinner(win)
    // Confeti: “cae” hacia la derecha (simulamos gravedad horizontal con drift creciente)
    const durationMs = 1200
    const start = Date.now()
    ;(function frame() {
      const t = Math.min(1, (Date.now() - start) / durationMs)
      const drift = 0.6 + 1.6 * t // acelera hacia la derecha
      confetti({
        particleCount: 12,
        spread: 35,
        startVelocity: 40,
        gravity: 0,        // sin caída vertical
        drift,             // "gravedad" horizontal a la derecha
        scalar: 1.2,
        ticks: 200,
        angle: 0,          // vector inicial hacia la derecha
        origin: { x: 0.0, y: Math.random() * 0.8 + 0.1 },
      })
      if (t < 1) requestAnimationFrame(frame)
    })()
  }

  const normalize = (s: string) => s.trim().toLowerCase()
  const prizeImageByLabel: Record<string, string> = {
    'siga participando': '/prizes/siga-participando.png',
    'bono sorpresa': '/prizes/bono-sorpresa.png',
    'premio sorpresa': '/prizes/premio-sorpresa.png',
    'vuelve a girar': '/prizes/vuelve-a-girar.png',
  }

  return (
    <div 
      className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200"
    >
      {/* Fondo con imagen rotada -90° cubriendo completamente */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/school-bg.png"
          alt="background"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
            transformOrigin: 'center center',
            width: '100dvh',
            height: '100dvw',
            objectFit: 'cover'
          }}
        />
      </div>

      <div className="flex-1 relative z-10">
        <div className="absolute left-[35vw] top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Ruleta slots={slots} onEnd={handleSpinEnd} weights={weights} />
        </div>
        {/* Imagen de premio según resultado: overlay a pantalla completa, rotada -90° */}
        {winner && (
          <div
            className="fixed inset-0 z-30 cursor-pointer"
            onClick={() => setWinner(null)}
            role="button"
            aria-label="Cerrar premio"
          >
            <img
              src={prizeImageByLabel[normalize(winner.label)]}
              alt={winner.label}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) rotate(-90deg)',
                transformOrigin: 'center center',
                width: '100dvh',
                height: '100dvw',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
