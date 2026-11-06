'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface OverlayEffectsProps {
  config: any
}

export function OverlayEffects({ config }: OverlayEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!config || config.type === 'none') {
      setEnabled(false)
      return
    }
    setEnabled(true)
  }, [config?.type])

  if (!enabled) return null

  const type = config.type
  const color = config.color || '#ffffff'
  const density = config.density || 50
  const speed = config.speed || 1
  const intensity = config.intensity || 1

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let particles: Particle[] = []
    let customElements: CustomElement[] = []

    const initParticles = () => {
      const count = Math.floor(density * intensity)
      particles = []

      for (let i = 0; i < count; i++) {
        particles.push(createParticle())
      }
    }

    const createParticle = (): Particle => {
      const baseSize = Math.random() * 4 + 1
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2 * speed,
        vy: (Math.random() - 0.5) * 2 * speed + 1 * speed,
        size: baseSize,
        opacity: Math.random() * 0.5 + 0.1,
        color: color,
        type: type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      }
    }

    const initCustomElements = () => {
      if (!config.customElements?.length) return
      customElements = config.customElements.map((el: any) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1 * speed,
        vy: (Math.random() - 0.5) * 1 * speed + 0.5 * speed,
        size: el.size || 30,
        opacity: Math.random() * 0.3 + 0.1,
        imageUrl: el.imageUrl,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      }))
    }

    initParticles()
    initCustomElements()

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        if (p.y > canvas.height + p.size) {
          p.y = -p.size
          p.x = Math.random() * canvas.width
        }
        if (p.x > canvas.width + p.size) p.x = -p.size
        if (p.x < -p.size) p.x = canvas.width + p.size

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.opacity

        drawParticle(ctx, p)

        ctx.restore()
      })

      customElements.forEach((el) => {
        el.x += el.vx
        el.y += el.vy
        el.rotation += el.rotationSpeed

        if (el.y > canvas.height + el.size) {
          el.y = -el.size
          el.x = Math.random() * canvas.width
        }

        ctx.save()
        ctx.translate(el.x, el.y)
        ctx.rotate(el.rotation)
        ctx.globalAlpha = el.opacity

        if (el.imageUrl) {
          const img = new Image()
          img.src = el.imageUrl
          ctx.drawImage(img, -el.size / 2, -el.size / 2, el.size, el.size)
        }

        ctx.restore()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [config])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  )
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  switch (p.type) {
    case 'snow':
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
      break
    case 'rain':
      ctx.beginPath()
      ctx.moveTo(0, -p.size * 5)
      ctx.lineTo(0, p.size * 5)
      ctx.strokeStyle = p.color
      ctx.lineWidth = 1
      ctx.stroke()
      break
    case 'petals':
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
      break
    case 'fireworks':
      ctx.beginPath()
      ctx.arc(0, 0, p.size * Math.random() * 2, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
      break
    case 'particles':
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
      break
    case 'stars':
      ctx.beginPath()
      ctx.moveTo(0, -p.size)
      ctx.lineTo(p.size * 0.3, p.size * 0.3)
      ctx.lineTo(p.size, p.size * 0.3)
      ctx.lineTo(p.size * 0.5, p.size * 0.8)
      ctx.lineTo(p.size * 0.8, p.size * 1.5)
      ctx.lineTo(0, p.size)
      ctx.lineTo(-p.size * 0.8, p.size * 1.5)
      ctx.lineTo(-p.size * 0.5, p.size * 0.8)
      ctx.lineTo(-p.size, p.size * 0.3)
      ctx.lineTo(-p.size * 0.3, p.size * 0.3)
      ctx.closePath()
      ctx.fillStyle = p.color
      ctx.fill()
      break
    case 'floating':
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
      break
    case 'light_rays':
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(p.size * 10, 0)
      ctx.strokeStyle = p.color
      ctx.lineWidth = 1
      ctx.stroke()
      break
    case 'ambient':
      ctx.beginPath()
      ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
      break
    default:
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
  }
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  type: string
  rotation: number
  rotationSpeed: number
}

interface CustomElement {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  imageUrl: string
  rotation: number
  rotationSpeed: number
}