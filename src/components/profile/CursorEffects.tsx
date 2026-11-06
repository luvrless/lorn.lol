'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface CursorEffectsProps {
  config: any
}

export function CursorEffects({ config }: CursorEffectsProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cursorRef = useRef<any>(null)
  const trailRef = useRef<HTMLDivElement[]>([])
  const particleRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!config?.enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setHovered(true)
    const handleMouseLeave = () => setHovered(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [config?.enabled])

  useEffect(() => {
    if (!config?.enabled) return

    const cursor = cursorRef.current
    if (!cursor) return

    const animate = () => {
      cursor.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px) translate(-50%, -50%)`
      requestAnimationFrame(animate)
    }

    animate()
  }, [mousePosition, config?.enabled])

  if (!config?.enabled) return null

  const customCursor = config.imageUrl
  const size = config.size || 32
  const color = config.color || '#6366f1'

  return (
    <>
      {customCursor && (
        <img
          ref={cursorRef}
          src={customCursor}
          alt=""
          className={cn(
            'fixed pointer-events-none z-[9999] transition-transform duration-100',
            config.animated && 'animate-pulse',
            hovered && config.hoverEffect === 'scale' && 'scale-150',
            hovered && config.hoverEffect === 'rotate' && 'rotate-180',
          )}
          style={{
            width: size,
            height: size,
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {!customCursor && (
        <div
          ref={cursorRef}
          className={cn(
            'fixed pointer-events-none z-[9999] rounded-full border-2 transition-transform duration-100',
            'mix-blend-difference',
            hovered && config.hoverEffect === 'scale' && 'scale-150',
            hovered && config.hoverEffect === 'pulse' && 'animate-pulse',
          )}
          style={{
            width: size,
            height: size,
            borderColor: color,
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {config.glow && (
        <div
          className="fixed pointer-events-none z-[9998] rounded-full blur-xl transition-opacity duration-300"
          style={{
            width: size * 3,
            height: size * 3,
            backgroundColor: color,
            opacity: 0.3,
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {config.trail && (
        <TrailEffect mousePosition={mousePosition} color={color} size={size} />
      )}

      {config.particles && (
        <ParticlesEffect mousePosition={mousePosition} color={color} />
      )}
    </>
  )
}

function TrailEffect({ mousePosition, color, size }: { mousePosition: { x: number; y: number }; color: string; size: number }) {
  const trailRef = useRef<HTMLDivElement[]>([])
  const [trails, setTrails] = useState<Array<{ x: number; y: number; opacity: number; scale: number }>>([])

  useEffect(() => {
    const trail = document.createElement('div')
    trail.className = 'fixed pointer-events-none z-[9997] rounded-full transition-all duration-300'
    trail.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      left: ${mousePosition.x}px;
      top: ${mousePosition.y}px;
      transform: translate(-50%, -50%);
    `
    document.body.appendChild(trail)
    trailRef.current.push(trail)

    setTrails(prev => [...prev.slice(-9), { x: mousePosition.x, y: mousePosition.y, opacity: 1, scale: 1 }])

    if (trailRef.current.length > 10) {
      const old = trailRef.current.shift()
      if (old) old.remove()
    }

    return () => {
      trailRef.current.forEach(t => t.remove())
      trailRef.current = []
    }
  }, [mousePosition, color, size])

  return null
}

function ParticlesEffect({ mousePosition, color }: { mousePosition: { x: number; y: number }; color: string }) {
  const [particles, setParticles] = useState<Array<{
    x: number
    y: number
    vx: number
    vy: number
    life: number
    size: number
  }>>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02,
          }))
          .filter(p => p.life > 0)

        if (Math.random() < 0.3) {
          newParticles.push({
            x: mousePosition.x + (Math.random() - 0.5) * 20,
            y: mousePosition.y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            life: 1,
            size: Math.random() * 4 + 2,
          })
        }

        return newParticles.slice(-30)
      })
    }, 50)

    return () => clearInterval(interval)
  }, [mousePosition])

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="fixed pointer-events-none z-[9996] rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: p.life,
            left: p.x,
            top: p.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </>
  )
}