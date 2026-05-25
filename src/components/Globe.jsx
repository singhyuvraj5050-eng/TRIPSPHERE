// Globe.jsx
// This is the main 3D globe component.
// It renders the globe, pins, arcs, hover tooltips,
// and calls back to the parent when a city is clicked.

import { useRef, useEffect, useState } from 'react'
import ReactGlobe from 'react-globe.gl'
import { POINTS, ARCS, HOME } from '../data/cities'

export default function Globe({ onCityClick }) {
  // useRef gives us direct access to the globe so we can call its methods
  const globeRef = useRef()

  // Which city pin is the mouse currently hovering over
  const [hoveredCity, setHoveredCity] = useState(null)

  // On first load: rotate the camera to point at Jharkhand / India
  // useEffect with [] runs ONCE after the component appears
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView(
        {
          lat:      HOME.lat,    // center on Daltonganj
          lng:      HOME.lon,
          altitude: 2.2,         // zoom level — smaller = closer
        },
        1500                     // animate over 1.5 seconds
      )
    }
  }, [])

  return (
    <div className="w-full h-screen">
      <ReactGlobe
        ref={globeRef}

        // ── Globe visual ───────────────────────────────────────────
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"   // transparent background

        // ── City pins ──────────────────────────────────────────────
        // pointsData is the array of all cities
        // The string values like "lat", "color" tell the library
        // which FIELD in each object to read
        pointsData={POINTS}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.00001}
        pointRadius={0.3}
        pointResolution={14}

        // When mouse enters a pin → store that city as hovered
        onPointHover={point => setHoveredCity(point || null)}

        // When a pin is CLICKED → tell the parent page which city
        // onCityClick is a function passed down from GlobePage
        onPointClick={point => onCityClick(point)}

        // ── Arc lines ──────────────────────────────────────────────
        arcsData={ARCS}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color" 
        arcAltitude={0.25}          // how high the arc curves above the globe
        arcStroke={0.3}             // line thickness
        arcDashLength={0.08}         // length of each dash
        arcDashGap={0.02}           // gap between dashes
        arcDashAnimateTime={15000}   // ms for one full animation loop

        // ── Atmosphere glow ────────────────────────────────────────
        atmosphereColor="#4fc3f7"
        atmosphereAltitude={0.12}

        // ── Controls ───────────────────────────────────────────────
        enablePointerInteraction={true}
      />

      {/* ── HOVER TOOLTIP ──────────────────────────────────────────
          Small label that appears above a pin on hover.
          Completely separate from the click popup card.
          position: absolute puts it in a fixed spot on screen
          (not following the cursor — simpler and cleaner).
      ──────────────────────────────────────────────────────────── */}
      {hoveredCity && (
        <div
          className="absolute top-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <div
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
            style={{
              background: 'rgba(15,23,42,0.92)',
              border:     `1px solid ${hoveredCity.color}60`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Colored dot matching the pin */}
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: hoveredCity.color }}
            />
            {hoveredCity.name}
            {hoveredCity.isHome && (
              <span className="text-orange-400 text-xs font-normal">
                · Hometown
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}