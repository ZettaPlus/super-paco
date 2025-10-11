'use client'

import { useEffect, useMemo, useState } from 'react'
import { Ruleta } from '@/components/Ruleta'
import RotateScreenButton from '@/components/RotateScreenButton'
import confetti from 'canvas-confetti'

type Slot = { id: string; label: string; background: string; textOrientation?: 'horizontal' | 'vertical' }

const generateId = () => (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`)

export default function Home() {
  const [rotation, setRotation] = useState(0)
  const isHorizontal = rotation === 90 || rotation === 270
  
  const getPosition = () => {
    if (rotation === 0) return '35vw'
    if (rotation === 90 || rotation === 270) return '50%'
    if (rotation === 180) return '65vw'
    return '35vw'
  }
  // Lista explícita: etiqueta + color fijo por casilla (evita cualquier desajuste)
  const slots: Slot[] = useMemo(() => [
    { label: 'Siga participando', background: '#10b981' },
    { label: 'Premio sorpresa',  background: '#ef4444' },
    { label: 'Siga participando', background: '#10b981' },
    { label: 'Vuelve a girar',    background: '#f59e0b' },
    { label: 'Premio sorpresa',  background: '#ef4444' },
    { label: 'Siga participando', background: '#10b981' },
    { label: 'Bono sorpresa',     background: '#7c3aed' },
    { label: 'Premio sorpresa',  background: '#ef4444' },
    { label: 'Siga participando', background: '#10b981' },
    { label: 'Vuelve a girar',    background: '#f59e0b' },
    { label: 'Premio sorpresa',  background: '#ef4444' },
    { label: 'Siga participando', background: '#10b981' },
    { label: 'Bono sorpresa',     background: '#7c3aed' },
    { label: 'Vuelve a girar',    background: '#f59e0b' },
    { label: 'Siga participando', background: '#10b981' },
    { label: 'Vuelve a girar',    background: '#f59e0b' },
  ].map(s => ({ ...s, id: generateId(), textOrientation: 'vertical' })), [])

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
    
    const durationMs = 1200
    const start = Date.now()
    
    ;(function frame() {
      const t = Math.min(1, (Date.now() - start) / durationMs)
      
      let confettiConfig: any = {}
      
      if (rotation === 0) {
        // Vertical: confeti hacia la derecha
        const drift = 0.6 + 1.6 * t
        confettiConfig = {
          particleCount: 12,
          spread: 35,
          startVelocity: 40,
          gravity: 0,
          drift,
          scalar: 1.2,
          ticks: 200,
          angle: 0,
          origin: { x: 0.0, y: Math.random() * 0.8 + 0.1 },
        }
      } else if (rotation === 90) {
        // Horizontal: confeti hacia abajo
        confettiConfig = {
          particleCount: 25,
          spread: 35,
          startVelocity: 40,
          gravity: 1,
          scalar: 1.2,
          ticks: 200,
          angle: 90,
          origin: { x: Math.random() * 0.8 + 0.1, y: 0.0 },
        }
      } else if (rotation === 180) {
        // Vertical invertido: confeti hacia la izquierda
        const drift = -(0.6 + 1.6 * t)
        confettiConfig = {
          particleCount: 12,
          spread: 35,
          startVelocity: 40,
          gravity: 0,
          drift,
          scalar: 1.2,
          ticks: 200,
          angle: 180,
          origin: { x: 1.0, y: Math.random() * 0.8 + 0.1 },
        }
      } else if (rotation === 270) {
        // Horizontal invertido: confeti hacia arriba
        confettiConfig = {
          particleCount: 25,
          spread: 35,
          startVelocity: 40,
          gravity: -1,
          scalar: 1.2,
          ticks: 200,
          angle: 270,
          origin: { x: Math.random() * 0.8 + 0.1, y: 1.0 },
        }
      }
      
      confetti(confettiConfig)
      if (t < 1) requestAnimationFrame(frame)
    })()
  }

  const normalize = (s: string) => s.trim().toLowerCase()
  const prizeFolder = isHorizontal ? 'prizes-horizontal' : 'prizes-vertical'
  const prizeImageByLabel: Record<string, string> = {
    'siga participando': `/${prizeFolder}/siga-participando.png`,
    'bono sorpresa': `/${prizeFolder}/bono-sorpresa.png`,
    'premio sorpresa': `/${prizeFolder}/premio-sorpresa.png`,
    'vuelve a girar': `/${prizeFolder}/vuelve-a-girar.png`,
  }
  const bgImage = isHorizontal ? '/bg-horizontal.png' : '/bg-vertical.png'
  
  const getBgRotation = () => {
    if (rotation === 0) return '-90deg'
    if (rotation === 90) return '0deg'
    if (rotation === 180) return '90deg'
    if (rotation === 270) return '180deg'
    return '-90deg'
  }
  const bgRotation = getBgRotation()

  return (
    <div 
      className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200"
    >
      {/* Fondo con imagen */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={bgImage}
          alt="background"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) rotate(${bgRotation})`,
            transformOrigin: 'center center',
            width: isHorizontal ? '100dvw' : '100dvh',
            height: isHorizontal ? '100dvh' : '100dvw',
            objectFit: 'cover'
          }}
        />
      </div>

      <div className="flex-1 relative z-10">
        <div 
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: getPosition() }}
        >
          <Ruleta slots={slots} onEnd={handleSpinEnd} weights={weights} rotation={rotation} isHorizontal={isHorizontal} />
        </div>
        {/* Imagen de premio según resultado: overlay a pantalla completa */}
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
                transform: `translate(-50%, -50%) rotate(${bgRotation})`,
                transformOrigin: 'center center',
                width: isHorizontal ? '100dvw' : '100dvh',
                height: isHorizontal ? '100dvh' : '100dvw',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
      </div>
      <RotateScreenButton onRotationChange={setRotation} />
    </div>
  )
}
