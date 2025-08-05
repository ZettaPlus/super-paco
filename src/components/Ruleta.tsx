'use client'
import { useRef, useState } from 'react'
import { gsap } from 'gsap'

type Slot = { id: string; label: string; background: string; textOrientation?: 'horizontal' | 'vertical' }

interface Props {
  slots: Slot[]
  duration?: number
  onEnd?: (winner: Slot) => void
}

export function Ruleta({ slots, duration = 4000, onEnd }: Props) {
  const wheelRef = useRef<SVGSVGElement>(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const spin = () => {
    if (isSpinning || slots.length === 0) return
    
    setIsSpinning(true)
    const count = slots.length
    const angle = 360 / count
    const randomIndex = Math.floor(Math.random() * count)
    const finalAngle = 360 * 8 + randomIndex * angle + angle / 2

    gsap.to(wheelRef.current, {
      rotation: finalAngle,
      duration: duration / 1000,
      ease: 'power4.out',
      transformOrigin: '50% 50%',
      onComplete: () => {
        setIsSpinning(false)
        onEnd?.(slots[randomIndex])
      },
    })
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        {/* Marco exterior con efecto 3D */}
        <div className="w-[600px] h-[600px] bg-gradient-to-br from-red-800 via-red-700 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.3)] border-4 border-red-900">
          {/* Anillo dorado metálico */}
          <div className="w-[570px] h-[570px] bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-[inset_0_2px_15px_rgba(0,0,0,0.3),0_2px_10px_rgba(255,215,0,0.5)] border-2 border-yellow-700">
            {/* Luces brillantes con efecto glow */}
            <div className="w-[540px] h-[540px] relative">
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * Math.PI / 180
                const left = Math.round(270 + 230 * Math.cos(angle))
                const top = Math.round(270 + 230 * Math.sin(angle))
                
                return (
                  <div
                    key={i}
                    className="absolute w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full shadow-[0_0_20px_rgba(255,255,0,1),0_0_40px_rgba(255,255,0,0.6)] animate-pulse"
                    style={{
                      left: `${left}px`,
                      top: `${top}px`,
                    }}
                  />
                )
              })}
              
              {/* Ruleta interna con profundidad */}
              <svg ref={wheelRef} viewBox="0 0 200 200" width={540} height={540} className="absolute inset-0 drop-shadow-2xl">
                {/* Sombra de la ruleta */}
                <defs>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.5)"/>
                  </filter>
                  <linearGradient id="segmentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.3)"/>
                    <stop offset="50%" stopColor="rgba(255,255,255,0.1)"/>
                    <stop offset="100%" stopColor="rgba(0,0,0,0.2)"/>
                  </linearGradient>
                </defs>
                
                {slots.map((s, i) => {
                  const start = (360 / slots.length) * i
                  const end = (360 / slots.length) * (i + 1)
                  const largeArcFlag = end - start <= 180 ? 0 : 1
                  
                  const x1 = 100 + 80 * Math.cos(start * Math.PI / 180)
                  const y1 = 100 + 80 * Math.sin(start * Math.PI / 180)
                  const x2 = 100 + 80 * Math.cos(end * Math.PI / 180)
                  const y2 = 100 + 80 * Math.sin(end * Math.PI / 180)
                  
                  const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
                  
                  return (
                    <g key={s.id}>
                      {/* Sombra del segmento */}
                      <path
                        d={path}
                        fill="rgba(0,0,0,0.3)"
                        transform="translate(2,2)"
                      />
                      {/* Segmento principal */}
                      <path
                        d={path}
                        fill={s.background}
                        stroke="#fff"
                        strokeWidth="3"
                        filter="url(#shadow)"
                      />
                      {/* Efecto de profundidad */}
                      <path
                        d={path}
                        fill="url(#segmentGradient)"
                        opacity="0.3"
                      />
                      {/* Texto con sombra */}
                      <text
                        x="100"
                        y="60"
                        transform={`rotate(${start + (end - start) / 2} 100 100) ${s.textOrientation === 'vertical' ? 'rotate(90 100 60)' : ''}`}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontSize="18"
                        fill="#fff"
                        fontWeight="bold"
                        stroke="#000"
                        strokeWidth="1"
                        filter="url(#shadow)"
                      >
                        {s.label}
                      </text>
                    </g>
                  )
                })}
                
                {/* Centro de la ruleta con efecto 3D */}
                <circle cx="100" cy="100" r="18" fill="url(#segmentGradient)" stroke="#dc2626" strokeWidth="3" />
                <circle cx="100" cy="100" r="15" fill="linear-gradient(45deg, #dc2626, #b91c1c)" stroke="#fff" strokeWidth="2" />
                <circle cx="100" cy="100" r="8" fill="linear-gradient(45deg, #ef4444, #dc2626)" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Puntero apuntando hacia arriba (rotado 180°) */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          {/* Sombra del puntero */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[28px] border-r-[28px] border-t-[56px] border-l-transparent border-r-transparent border-t-black opacity-30"></div>
          {/* Puntero principal */}
          <div className="relative">
            <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[48px] border-l-transparent border-r-transparent border-t-red-600 shadow-lg"></div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[40px] border-l-transparent border-r-transparent border-t-yellow-400"></div>
            {/* Brillo del puntero */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[32px] border-l-transparent border-r-transparent border-t-yellow-200"></div>
          </div>
        </div>

        {/* Botón en el centro de la ruleta */}
        <button 
          onClick={spin}
          disabled={isSpinning}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full font-bold text-white text-lg transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)] z-10 ${
            isSpinning 
              ? 'bg-gradient-to-b from-gray-500 to-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-b from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 active:scale-95 active:shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
          }`}
        >
          {/* Brillo del botón */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-20 rounded-full"></div>
          <span className="relative z-10">
            {isSpinning ? '🎰' : '🎰'}
          </span>
        </button>
      </div>
      
      
    </div>
  )
}
