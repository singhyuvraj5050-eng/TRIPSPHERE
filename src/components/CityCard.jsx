import { useState, useRef } from 'react'

export default function CityCard({ city, onClose }) {
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [visible, setVisible] = useState(false)
  const prevNameRef = useRef(null)

  if (city?.name !== prevNameRef.current) {
    prevNameRef.current = city?.name
    setCurrentPhoto(0)
    setVisible(false)
    if (city) {
      requestAnimationFrame(() => setVisible(true))
    }
  }

  if (!city) return null

  const isHome    = city.isHome
  const accent    = isHome ? '#ff6b35' : '#4fc3f7'
  const photos    = city.photos || []
  const hasPhotos = photos.length > 0

  function prev() {
    setCurrentPhoto(i => (i - 1 + photos.length) % photos.length)
  }

  function next() {
    setCurrentPhoto(i => (i + 1) % photos.length)
  }

  return (
    <div className="absolute bottom-6 right-6 z-50 pointer-events-none">
      <div
        className="pointer-events-auto w-80 rounded-2xl overflow-hidden"
        style={{
          background: '#1e293b',
          border:     `1px solid ${accent}40`,
          boxShadow:  `0 0 40px ${accent}20, 0 20px 60px rgba(0,0,0,0.5)`,
          transform:  visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
          opacity:    visible ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease',
        }}
      >

        {/* ── PHOTO SLIDESHOW ── */}
        <div className="relative h-52 overflow-hidden" style={{ background: '#0f172a' }}>

          {hasPhotos ? (
            <>
              <div
                className="flex h-full"
                style={{
                  width:      `${photos.length * 100}%`,
                  transform:  `translateX(-${(currentPhoto * 100) / photos.length}%)`,
                  transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {photos.map((src, i) => (
                  <div
                    key={i}
                    className="h-full shrink-0"
                    style={{ width: `${100 / photos.length}%` }}
                  >
                    <img
                      src={src}
                      alt={`${city.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                      style={{ opacity: 0.85 }}
                    />
                  </div>
                ))}
              </div>

              {photos.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full text-white hover:scale-110 transition-all"
                    style={{
                      width: 28, height: 28,
                      background: 'rgba(0,0,0,0.55)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      fontSize: 18, cursor: 'pointer',
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full text-white hover:scale-110 transition-all"
                    style={{
                      width: 28, height: 28,
                      background: 'rgba(0,0,0,0.55)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      fontSize: 18, cursor: 'pointer',
                    }}
                  >
                    ›
                  </button>

                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPhoto(i)}
                        style={{
                          width:        i === currentPhoto ? 16 : 6,
                          height:       6,
                          borderRadius: 3,
                          background:   i === currentPhoto ? accent : 'rgba(255,255,255,0.35)',
                          border:       'none',
                          cursor:       'pointer',
                          transition:   'all 0.3s ease',
                          padding:      0,
                        }}
                      />
                    ))}
                  </div>

                  <div
                    className="absolute top-3 left-3 text-xs text-white rounded-full px-2 py-0.5"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  >
                    {currentPhoto + 1} / {photos.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)' }}
            >
              <div className="text-4xl">{isHome ? '🏠' : '📍'}</div>
              <div className="text-slate-500 text-xs">No photos yet</div>
            </div>
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, #1e293b 100%)' }}
          />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex items-center justify-center rounded-full text-slate-300 hover:text-white transition-colors"
            style={{
              width: 28, height: 28,
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: 18, lineHeight: 1, cursor: 'pointer',
            }}
          >
            ×
          </button>

          <div className="absolute bottom-3 left-4">
            <div className="flex items-center gap-2 mb-0.5">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
              />
              <h2 className="text-white font-bold text-xl leading-none">
                {city.name}
              </h2>
              {city.altName && (
                <span className="text-slate-400 text-xs">/ {city.altName}</span>
              )}
            </div>
            <p className="text-slate-400 text-xs pl-4">
              {city.state && `${city.state} · `}{city.isHome ? 'My Hometown' : 'India'}
            </p>
          </div>
        </div>

        {/* ── CARD BODY ── */}
        <div className="p-4 flex flex-col gap-3">

          <p className="text-slate-300 text-sm leading-relaxed">
            {city.desc}
          </p>

          {city.memory && (
            <div
              className="rounded-xl p-3 text-sm leading-relaxed"
              style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-base">💭</span>
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: accent }}
                >
                  Memory
                </span>
              </div>
              <p className="text-slate-300">{city.memory}</p>
            </div>
          )}

          {!isHome && (
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)' }}
            >
              <span className="text-base">✈️</span>
              <span className="text-orange-300 text-xs">
                Arc connected from{' '}
                <span className="font-semibold text-orange-400">Daltonganj</span>
              </span>
            </div>
          )}

          {isHome && (
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.25)' }}
            >
              <span className="text-base">🏠</span>
              <span className="text-orange-300 text-xs font-medium">
                All arcs start from here
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}