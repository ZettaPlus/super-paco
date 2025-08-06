'use client'

import { useEffect, useState } from 'react'
import { Ruleta } from '@/components/Ruleta'
import { loadConfig, saveConfig } from '@/utils/config'

type Slot = { id: string; label: string; background: string; video?: string; textOrientation?: 'horizontal' | 'vertical' }

type FileData = {
  name: string
  data: string // base64
  type: string
}

const defaultSlots: Slot[] = [
  { id: '1', label: '100', background: '#fbbf24', textOrientation: 'horizontal' },
  { id: '2', label: '500', background: '#3b82f6', textOrientation: 'horizontal' },
  { id: '3', label: '10', background: '#fbbf24', textOrientation: 'horizontal' },
  { id: '4', label: '200', background: '#ec4899', textOrientation: 'horizontal' },
  { id: '5', label: '30', background: '#fbbf24', textOrientation: 'horizontal' },
  { id: '6', label: '1000', background: '#3b82f6', textOrientation: 'horizontal' },
  { id: '7', label: '700', background: '#fbbf24', textOrientation: 'horizontal' },
  { id: '8', label: '5', background: '#ec4899', textOrientation: 'horizontal' },
  { id: '9', label: '2000', background: '#fbbf24', textOrientation: 'horizontal' },
  { id: '10', label: '300', background: '#3b82f6', textOrientation: 'horizontal' },
  { id: '11', label: '50', background: '#fbbf24', textOrientation: 'horizontal' },
  { id: '12', label: '600', background: '#ec4899', textOrientation: 'horizontal' }
]

export default function Home() {
  const [slots, setSlots] = useState<Slot[]>(defaultSlots)
  const [duration, setDuration] = useState(4000)
  const [backgroundFile, setBackgroundFile] = useState<FileData | null>(null)
  const [winner, setWinner] = useState<Slot | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [currentVideo, setCurrentVideo] = useState('')

  useEffect(() => {
    const savedSlots = loadConfig<Slot[]>('ruleta-slots', defaultSlots)
    const savedDuration = loadConfig<number>('ruleta-duration', 4000)
    const savedBackground = loadConfig<FileData | null>('ruleta-background', null)
    setSlots(savedSlots)
    setDuration(savedDuration)
    setBackgroundFile(savedBackground)
  }, [])

  const updateSlot = (id: string, field: keyof Slot, value: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const addSlot = () => {
    const newId = (slots.length + 1).toString()
    const colors = ['#fbbf24', '#3b82f6', '#ec4899']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    setSlots(prev => [...prev, { id: newId, label: '100', background: randomColor, textOrientation: 'horizontal' }])
  }

  const removeSlot = (id: string) => {
    if (slots.length > 2) {
      setSlots(prev => prev.filter(s => s.id !== id))
    }
  }

  const handleSaveConfig = () => {
    saveConfig('ruleta-slots', slots)
    saveConfig('ruleta-duration', duration)
    saveConfig('ruleta-background', backgroundFile)
    setShowConfig(false)
  }

  const handleSpinEnd = (winner: Slot) => {
    setWinner(winner)
    if (winner.video) {
      setCurrentVideo(convertToEmbedUrl(winner.video))
      setShowVideo(true)
    }
  }

  const closeVideo = () => {
    setShowVideo(false)
    setCurrentVideo('')
  }

  const convertToEmbedUrl = (url: string): string => {
    // Convertir URL de YouTube a formato embed
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }
    return url
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'video', slotId?: string) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const fileData: FileData = {
        name: file.name,
        data: result,
        type: file.type
      }

      if (type === 'background') {
        setBackgroundFile(fileData)
      } else if (type === 'video' && slotId) {
        setSlots(prev => prev.map(s => s.id === slotId ? { ...s, video: result } : s))
      }
    }
    reader.readAsDataURL(file)
  }

  if (showConfig) {
    return (
      <div 
        className="min-h-screen p-8"
        style={{
          backgroundImage: backgroundFile ? `url(${backgroundFile.data})` : 'linear-gradient(to bottom right, #f3f4f6, #f9fafb, #e5e7eb)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">⚙️ Configuración</h1>
            <button
              onClick={() => setShowConfig(false)}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all shadow-lg active:scale-95"
            >
              ← Volver a la Ruleta
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel de configuración */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Configuración</h2>
              
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-3 text-gray-700">Configuración General</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-gray-700">Duración de la animación</label>
                    <div className="relative">
                      <input
                        type="range"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg appearance-none cursor-pointer shadow-inner"
                        min="1000"
                        max="10000"
                        step="500"
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span className="font-medium">1s</span>
                        <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">{duration}ms</span>
                        <span className="font-medium">10s</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Imagen de fondo (opcional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'background')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    />
                    {backgroundFile && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Vista previa del fondo:</label>
                        <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border">
                          <img 
                            src={backgroundFile.data} 
                            alt="Vista previa del fondo"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextElementSibling!.textContent = 'Error al cargar la imagen'
                            }}
                          />
                          <div className="hidden text-center text-gray-500 text-sm py-8">Error al cargar la imagen</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{backgroundFile.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg font-semibold">Secciones de la Ruleta</label>
                  <button
                    onClick={addSlot}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg active:scale-95"
                  >
                    ➕ Agregar Sección
                  </button>
                </div>
                
                <div className="grid gap-4 max-h-96 overflow-y-auto p-2">
                  {slots.map((slot) => (
                    <div key={slot.id} className="border border-gray-200 p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg transition-all">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-full border-3 border-white shadow-lg ring-2 ring-gray-200"
                            style={{ backgroundColor: slot.background }}
                          />
                          <input
                            type="text"
                            value={slot.label}
                            onChange={(e) => updateSlot(slot.id, 'label', e.target.value)}
                            placeholder="Valor (ej: 100, 500, 1000)"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                          />
                          <input
                            type="color"
                            value={slot.background}
                            onChange={(e) => updateSlot(slot.id, 'background', e.target.value)}
                            className="w-12 h-12 border-2 border-gray-300 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                            title="Seleccionar color"
                          />
                          {slots.length > 2 && (
                            <button
                              onClick={() => removeSlot(slot.id)}
                              className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition-all shadow-md active:scale-95"
                              title="Eliminar sección"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">Video (opcional)</label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, 'video', slot.id)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                          />
                          {slot.video && (
                            <p className="text-xs text-gray-500 mt-1">Video cargado</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">Orientación del texto</label>
                          <select
                            value={slot.textOrientation || 'horizontal'}
                            onChange={(e) => updateSlot(slot.id, 'textOrientation', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                          >
                            <option value="horizontal">Horizontal</option>
                            <option value="vertical">Vertical</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveConfig}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold text-lg transition-all shadow-lg active:scale-95"
              >
                💾 Guardar Configuración
              </button>
            </div>

            {/* Vista previa de la ruleta */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Vista Previa</h2>
              <div className="flex justify-center">
                <Ruleta
                  slots={slots}
                  duration={duration}
                  onEnd={handleSpinEnd}
                />
              </div>
              {winner && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-xl text-center shadow-lg border border-green-300">
                  <p className="font-bold text-lg text-green-800">🎉 ¡Ganador!</p>
                  <p className="font-semibold text-xl text-green-900 mt-1">{winner.label}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: backgroundFile ? `url(${backgroundFile.data})` : 'linear-gradient(to bottom right, #f3f4f6, #f9fafb, #e5e7eb)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        {/* Logo Superepa.co */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
          <img 
            src="/logo-superepa.png" 
            alt="Super epa.co" 
            className="h-16 w-auto drop-shadow-lg"
          />
        </div>
        
        <div className="relative">
          <Ruleta
            slots={slots}
            duration={duration}
            onEnd={handleSpinEnd}
          />
          

        </div>
        
        {/* Botón de configuración discreto */}
        <button
          onClick={() => setShowConfig(true)}
          className="fixed top-4 right-4 p-3 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-800 rounded-full shadow-md transition-all backdrop-blur-sm"
          title="Configurar ruleta"
        >
          ⚙️
        </button>
      </div>

      {/* Modal de video */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">🎬 Video del Ganador</h3>
              <button
                onClick={closeVideo}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {currentVideo.includes('youtube.com/embed') ? (
                <iframe
                  src={currentVideo}
                  title="Video del ganador"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={currentVideo}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Tu navegador no soporta el elemento video.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
