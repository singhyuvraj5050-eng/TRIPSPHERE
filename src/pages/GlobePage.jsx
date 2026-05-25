// GlobePage.jsx
// This is the full page. It manages the "which city is selected" state
// and passes it down to Globe and CityCard.

import { useState } from 'react'
import Globe    from '../components/Globe'
import CityCard from '../components/CityCard'
import { VISITED, HOME } from '../data/cities'

export default function GlobePage() {
  // selectedCity = the city object the user last clicked
  // null means no city is selected (no card shown)
  const [selectedCity, setSelectedCity] = useState(null)

  // Called when user clicks a pin on the globe
  function handleCityClick(city) {
    // If clicking the same city that's already open → close it
    // Otherwise → open the new city
    if (selectedCity && selectedCity.name === city.name) {
      setSelectedCity(null)
    } else {
      setSelectedCity(city)
    }
  }

  // Called when X button inside CityCard is clicked
  function handleClose() {
    setSelectedCity(null)
  }

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden">

      {/* ── 3D GLOBE — fills the whole screen ──────────────── */}
      {/* We pass handleCityClick as a prop named onCityClick */}
      <Globe onCityClick={handleCityClick} />

      {/* ── TOP LEFT — Title card ───────────────────────────── */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div
          className="rounded-2xl p-5 w-64"
          style={{
            background:     'rgba(15,23,42,0.82)',
            backdropFilter: 'blur(12px)',
            border:         '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <h1 className="text-white font-bold text-lg tracking-tight">
            My Travel Map
          </h1>

          {/* Hometown label */}
          <p className="text-slate-400 text-sm mt-1">
            From{' '}
            <span className="font-semibold" style={{ color: '#ff6b35' }}>
              {HOME.name}
            </span>
            {HOME.altName && (
              <span className="text-slate-500 text-xs">
                {' '}({HOME.altName})
              </span>
            )}
            {' '}to the world
          </p>

          {/* Legend */}
          <div className="mt-4 flex flex-col gap-2.5">
            <LegendItem color="#ff6b35" label="Hometown · Daltonganj" />
            <LegendItem color="#4fc3f7" label="Visited cities" />
            <LegendRow />
          </div>

          <p className="text-slate-600 text-xs mt-4">
            Click a pin to explore · Drag to rotate
          </p>
        </div>
      </div>

      {/* ── TOP RIGHT — City list ───────────────────────────── */}
      <div className="absolute top-6 right-6 z-10 pointer-events-none">
        <div
          className="rounded-2xl p-5 w-56"
          style={{
            background:     'rgba(15,23,42,0.82)',
            backdropFilter: 'blur(12px)',
            border:         '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-3">
            Places visited
          </p>

          <div className="flex flex-col gap-2.5">
            {VISITED.map(city => (
              <div key={city.name} className="flex items-start gap-2">
                {/* Dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: '#4fc3f7' }}
                />
                <div>
                  <p className="text-slate-200 text-xs font-medium">
                    {city.name}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {city.state}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM — Stats bar ──────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div
          className="flex gap-6 rounded-2xl px-8 py-4"
          style={{
            background:     'rgba(15,23,42,0.82)',
            backdropFilter: 'blur(12px)',
            border:         '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <StatItem
            value="1"
            label="Hometown"
            color="#ff6b35"
          />
          <Divider />
          <StatItem
            value={VISITED.length}
            label="Cities"
            color="#4fc3f7"
          />
          <Divider />
          <StatItem
            value={VISITED.length}
            label="Arcs"
            color="#a78bfa"
          />
          <Divider />
          <StatItem
            value="Jharkhand"
            label="Home state"
            color="#34d399"
          />
        </div>
      </div>

      {/* ── CITY POPUP CARD ─────────────────────────────────────
          Renders bottom-right when a city is clicked.
          selectedCity is null when no city is selected,
          so CityCard renders nothing (we check inside CityCard).
      ──────────────────────────────────────────────────────── */}
      <CityCard
        city={selectedCity}
        onClose={handleClose}
      />

    </div>
  )
}

// ─── Small helper components ────────────────────────────────
// Kept here because they're tiny and only used on this page.

function StatItem({ value, label, color }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-slate-500 text-xs mt-1 uppercase tracking-widest">
        {label}
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div
      className="self-stretch"
      style={{ width: 1, background: 'rgba(255,255,255,0.07)' }}
    />
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: color }}
      />
      <span className="text-slate-300 text-xs">{label}</span>
    </div>
  )
}

// The arc legend row — shows gradient line from orange to cyan
function LegendRow() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-0.5 w-6 rounded shrink-0"
        style={{
          background: 'linear-gradient(to right, #ff6b35, #4fc3f7)',
        }}
      />
      <span className="text-slate-300 text-xs">Flight arcs</span>
    </div>
  )
}