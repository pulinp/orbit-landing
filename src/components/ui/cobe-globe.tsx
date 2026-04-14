"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface Marker {
  id: string
  location: [number, number]
  label?: string
}

interface Arc {
  id: string
  from: [number, number]
  to: [number, number]
  label?: string
  color?: [number, number, number]
}

interface GlobeProps {
  markers?: Marker[]
  arcs?: Arc[]
  className?: string
  markerColor?: [number, number, number]
  baseColor?: [number, number, number]
  arcColor?: [number, number, number]
  glowColor?: [number, number, number]
  dark?: number
  mapBrightness?: number
  markerSize?: number
  markerElevation?: number
  arcWidth?: number
  arcHeight?: number
  speed?: number
  theta?: number
  diffuse?: number
  mapSamples?: number
  onMarkerClick?: (id: string) => void
  focusLocation?: [number, number] // NEW Prop
  onRotationComplete?: () => void  // NEW Prop
}

export function Globe({
  markers = [],
  arcs = [],
  className = "",
  markerColor = [0.3, 0.45, 0.85],
  baseColor = [1, 1, 1],
  arcColor = [0.3, 0.45, 0.85],
  glowColor = [0.94, 0.93, 0.91],
  dark = 0,
  mapBrightness = 10,
  markerSize = 0.025,
  markerElevation = 0.01,
  arcWidth = 0.5,
  arcHeight = 0.25,
  speed = 0.005, // Slightly faster to make a rotation pleasing
  theta = 0.2,
  diffuse = 1.5,
  mapSamples = 16000,
  onMarkerClick,
  focusLocation,
  onRotationComplete,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const lastPointer = useRef<{ x: number; y: number; t: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const velocity = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  // Use a mutable ref object to track external props without forcing an unmount!
  const pRef = useRef({ markers, arcs, markerColor, baseColor, arcColor, glowColor, dark, mapBrightness, markerSize, markerElevation, arcWidth, arcHeight, speed, theta, diffuse, mapSamples, focusLocation, onRotationComplete })
  useEffect(() => {
    pRef.current = { markers, arcs, markerColor, baseColor, arcColor, glowColor, dark, mapBrightness, markerSize, markerElevation, arcWidth, arcHeight, speed, theta, diffuse, mapSamples, focusLocation, onRotationComplete }
  }, [markers, arcs, markerColor, baseColor, arcColor, glowColor, dark, mapBrightness, markerSize, markerElevation, arcWidth, arcHeight, speed, theta, diffuse, mapSamples, focusLocation, onRotationComplete])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      pointerInteracting.current = { x: e.clientX, y: e.clientY }
      if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
      isPausedRef.current = true
    },
    []
  )

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (pointerInteracting.current !== null) {
      const deltaX = e.clientX - pointerInteracting.current.x
      const deltaY = e.clientY - pointerInteracting.current.y
      dragOffset.current = { phi: deltaX / 300, theta: deltaY / 1000 }
      const now = Date.now()
      if (lastPointer.current) {
        const dt = Math.max(now - lastPointer.current.t, 1)
        const maxVelocity = 0.15
        velocity.current = {
          phi: Math.max(-maxVelocity, Math.min(maxVelocity, ((e.clientX - lastPointer.current.x) / dt) * 0.3)),
          theta: Math.max(-maxVelocity, Math.min(maxVelocity, ((e.clientY - lastPointer.current.y) / dt) * 0.08)),
        }
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
      lastPointer.current = null
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  // Central loop. Empty dependency array to mount strictly once!
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number

    let phi = 0;
    let internalTheta = 0;
    
    let currentFocusStr = "";
    let targetPhi = 0;
    let targetTheta = 0;
    let spinAccumulator = 0;
    let state: "focusing" | "spinning" = "focusing";
    let lastRotComp = 0;

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      const p = pRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      globe = createGlobe(canvas, {
        devicePixelRatio: dpr, width, height: width,
        phi: 0, theta: p.theta,
        dark: p.dark, diffuse: p.diffuse, mapSamples: p.mapSamples, mapBrightness: p.mapBrightness,
        baseColor: p.baseColor, markerColor: p.markerColor, glowColor: p.glowColor,
        markerElevation: p.markerElevation,
        markers: p.markers.map((m) => ({ location: m.location, size: p.markerSize, id: m.id })),
        arcs: p.arcs.map((a) => ({ from: a.from, to: a.to, id: a.id, color: a.color || p.arcColor })),
        arcColor: p.arcColor, arcWidth: p.arcWidth, arcHeight: p.arcHeight, opacity: 0.7,
      })

      function animate() {
        const loopProps = pRef.current;
        
        // Track new focus target
        const locStr = loopProps.focusLocation ? `${loopProps.focusLocation[0]},${loopProps.focusLocation[1]}` : "";
        if (locStr && currentFocusStr !== locStr) {
          currentFocusStr = locStr;
          const focusLng = loopProps.focusLocation![1];
          const focusLat = loopProps.focusLocation![0];
          
          // Calculate target phi for the focus location
          const targetPhiRaw = focusLng * Math.PI / 180 + Math.PI; 
          targetTheta = focusLat * Math.PI / 180;
          
          // CLOCKWISE ONLY: Always rotate clockwise to reach the target
          // If target is "behind" current position, go the long way around clockwise
          targetPhi = targetPhiRaw - phiOffsetRef.current;
          
          // Normalize to bring the target into range, ensuring clockwise direction
          while (targetPhi <= phi) {
            targetPhi += 2 * Math.PI;
          }
          if (targetPhi - phi > 2 * Math.PI) {
            targetPhi -= 2 * Math.PI;
          }
          
          state = "focusing";
          spinAccumulator = 0;
        }

        if (!isPausedRef.current) {
          if (state === "focusing") {
             const diffPhi = targetPhi - phi;
             const diffTheta = targetTheta - internalTheta;
             
             // SMOOTH TRANSITION: Animate with standard easing, but continuously forward the targetPhi
             // so the globe never technically stops rotating, but elegantly corrects course.
             phi += diffPhi * 0.08 + loopProps.speed; 
             internalTheta += diffTheta * 0.08;
             targetPhi += loopProps.speed; // Ensure the target continuously advances ahead too!
             
             if (Math.abs(diffPhi) < 0.06 && Math.abs(diffTheta) < 0.06) {
                 state = "spinning";
             }
          } else if (state === "spinning") {
             phi += loopProps.speed;
             spinAccumulator += loopProps.speed;
             if (spinAccumulator >= 2 * Math.PI) {
                 state = "focusing";
                 spinAccumulator = 0;
                 if (Date.now() - lastRotComp > 1000) {
                     lastRotComp = Date.now();
                     if (loopProps.onRotationComplete) loopProps.onRotationComplete();
                 }
             }
          }
          
          if (Math.abs(velocity.current.phi) > 0.0001 || Math.abs(velocity.current.theta) > 0.0001) {
            phiOffsetRef.current += velocity.current.phi
            thetaOffsetRef.current += velocity.current.theta
            velocity.current.phi *= 0.95
            velocity.current.theta *= 0.95
          }
          const thetaMin = -0.4, thetaMax = 0.4
          if (thetaOffsetRef.current < thetaMin) {
            thetaOffsetRef.current += (thetaMin - thetaOffsetRef.current) * 0.1
          } else if (thetaOffsetRef.current > thetaMax) {
            thetaOffsetRef.current += (thetaMax - thetaOffsetRef.current) * 0.1
          }
        }

        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: loopProps.theta + internalTheta + thetaOffsetRef.current + dragOffset.current.theta,
          dark: loopProps.dark,
          mapBrightness: loopProps.mapBrightness,
          markerColor: loopProps.markerColor,
          baseColor: loopProps.baseColor,
          arcColor: loopProps.arcColor,
          markerElevation: loopProps.markerElevation,
          markers: loopProps.markers.map((m) => ({ location: m.location, size: loopProps.markerSize, id: m.id })),
          arcs: loopProps.arcs.map((a) => ({ from: a.from, to: a.to, id: a.id, color: a.color || loopProps.arcColor })),
        })
        animationId = requestAnimationFrame(animate)
      }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, []) // Empty mount!

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          onClick={() => onMarkerClick?.(m.id)}
          style={{
            position: "absolute",
            positionAnchor: `--cobe-${m.id}`,
            bottom: m.label ? "anchor(top)" : "anchor(center)",
            left: "anchor(center)",
            translate: m.label ? "-50% 0" : "-50% 50%",
            marginBottom: m.label ? 8 : 0,
            padding: m.label ? "2px 6px" : 0,
            width: m.label ? "auto" : 32,
            height: m.label ? "auto" : 32,
            background: m.label ? "#1a1a2e" : "transparent",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            whiteSpace: "nowrap" as const,
            pointerEvents: "auto" as const,
            cursor: onMarkerClick ? "pointer" : "default",
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.8s, filter 0.8s",
            borderRadius: m.label ? 0 : "50%",
          }}
        >
          {m.label && m.label}
          {m.label && (
            <span
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translate3d(-50%, -1px, 0)",
                border: "5px solid transparent",
                borderTopColor: "#1a1a2e",
              }}
            />
          )}
        </div>
      ))}
      {arcs
        .filter((a) => a.label)
        .map((a) => (
          <div
            key={a.id}
            style={{
              position: "absolute",
              positionAnchor: `--cobe-arc-${a.id}`,
              bottom: "anchor(top)",
              left: "anchor(center)",
              translate: "-50% 0",
              marginBottom: 8,
              padding: "2px 6px",
              background: "#fff",
              color: "#1a1a2e",
              fontFamily: "monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              whiteSpace: "nowrap" as const,
              pointerEvents: "none" as const,
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              opacity: `var(--cobe-visible-arc-${a.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-arc-${a.id}, 0)) * 8px))`,
              transition: "opacity 0.8s, filter 0.8s",
            }}
          >
            {a.label}
            <span
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translate3d(-50%, -1px, 0)",
                border: "5px solid transparent",
                borderTopColor: "#fff",
              }}
            />
          </div>
        ))}
    </div>
  )
}
