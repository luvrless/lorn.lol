'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface BackgroundRendererProps {
  config: any
  username: string
}

export function BackgroundRenderer({ config, username }: BackgroundRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [shaderProgram, setShaderProgram] = useState<WebGLProgram | null>(null)
  const [gl, setGl] = useState<WebGLRenderingContext | null>(null)

  useEffect(() => {
    if (!config) return

    const type = config.type || 'SOLID'

    switch (type) {
      case 'IMAGE':
        renderImageBackground(config)
        break
      case 'VIDEO':
        renderVideoBackground(config)
        break
      case 'GRADIENT':
        renderGradientBackground(config)
        break
      case 'SHADER':
      case 'CUSTOM_SHADER':
        initShaderBackground(config)
        break
      case 'PARTICLES':
        initParticlesBackground(config)
        break
      case 'AURORA':
        initAuroraBackground(config)
        break
      case 'GALAXY':
        initGalaxyBackground(config)
        break
      case 'STARS':
        initStarsBackground(config)
        break
      case 'LIQUID':
        initLiquidBackground(config)
        break
      case 'SILK':
        initSilkBackground(config)
        break
      case 'CLOUDS':
        initCloudsBackground(config)
        break
      case 'LIGHTNING':
        initLightningBackground(config)
        break
      case 'PLASMA':
        initPlasmaBackground(config)
        break
      case 'IRIDESCENCE':
        initIridescenceBackground(config)
        break
      case 'DITHER':
        initDitherBackground(config)
        break
      case 'CRT':
        initCRTBackground(config)
        break
      case 'LIGHT_RAYS':
        initLightRaysBackground(config)
        break
      case 'SNOWFALL':
        initSnowfallBackground(config)
        break
      case 'RAIN':
        initRainBackground(config)
        break
      case 'ANIMATED_GRADIENT':
        initAnimatedGradientBackground(config)
        break
      default:
        renderSolidBackground(config)
    }
  }, [config])

  const renderImageBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas || !config.imageUrl) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = config.imageUrl
    img.onload = () => {
      const scale = config.scale || 1
      const position = config.position || { x: 50, y: 50 }

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(
          img,
          0,
          0,
          canvas.width * scale,
          canvas.height * scale
        )
        requestAnimationFrame(draw)
      }
      draw()
    }
  }

  const renderVideoBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas || !config.videoUrl) return

    const video = document.createElement('video')
    video.src = config.videoUrl
    video.muted = true
    video.loop = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    video.onloadeddata = () => {
      video.play().catch(() => {})
      const draw = () => {
        if (video.paused || video.ended) return
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        requestAnimationFrame(draw)
      }
      draw()
    }
  }

  const renderGradientBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gradient = config.gradient
    if (!gradient) return

    const draw = () => {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.stops.forEach((stop: any) => {
        grad.addColorStop(stop.position / 100, stop.color)
      })
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    draw()
  }

  const renderSolidBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const color = config.colors?.[0] || '#09090b'
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const initShaderBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const webgl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!webgl) return

    setGl(webgl)

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

    const fragmentShaderSource = config.customShader || `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float t = u_time * 0.5;
        vec3 color = mix(u_color1, u_color2, sin(uv.x * 10.0 + t) * 0.5 + 0.5);
        gl_FragColor = vec4(color, 1.0);
      }
    `

    const vertexShader = compileShader(webgl, webgl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(webgl, webgl.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vertexShader || !fragmentShader) return

    const program = webgl.createProgram()
    if (!program) return

    webgl.attachShader(program, vertexShader)
    webgl.attachShader(program, fragmentShader)
    webgl.linkProgram(program)

    if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
      console.error('Shader program link error:', webgl.getProgramInfoLog(program))
      return
    }

    setShaderProgram(program)
    animateShader(webgl, program, config)
  }

  const compileShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  const animateShader = (gl: WebGLRenderingContext, program: WebGLProgram, config: any) => {
    const canvas = gl.canvas as HTMLCanvasElement
    const startTime = Date.now()

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const color1Location = gl.getUniformLocation(program, 'u_color1')
    const color2Location = gl.getUniformLocation(program, 'u_color2')

    const colors = config.colors || ['#6366f1', '#d946ef']
    const color1 = hexToRgb(colors[0])
    const color2 = hexToRgb(colors[1] || colors[0])

    const render = () => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)

      gl.enableVertexAttribArray(positionLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.uniform1f(timeLocation, (Date.now() - startTime) * 0.001 * (config.speed || 1))
      if (color1) gl.uniform3f(color1Location, color1.r / 255, color1.g / 255, color1.b / 255)
      if (color2) gl.uniform3f(color2Location, color2.r / 255, color2.g / 255, color2.b / 255)

      gl.drawArrays(gl.TRIANGLES, 0, 6)

      requestAnimationFrame(render)
    }

    render()
  }

  const initParticlesBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Particle[] = []
    const count = config.particleCount || 100
    const colors = config.colors || ['#6366f1', '#d946ef']

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2 * (config.speed || 1),
        vy: (Math.random() - 0.5) * 2 * (config.speed || 1),
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = hexToRgba(p.color, p.opacity)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  const initAuroraBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const waves: Wave[] = []
    const colors = config.colors || ['#6366f1', '#d946ef', '#06b6d4']

    for (let i = 0; i < 5; i++) {
      waves.push({
        amplitude: Math.random() * 100 + 50,
        frequency: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2,
        speed: (Math.random() * 0.01 + 0.005) * (config.speed || 1),
        color: colors[i % colors.length],
        opacity: 0.1 + Math.random() * 0.2,
      })
    }

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      waves.forEach((wave) => {
        ctx.beginPath()
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height / 2 +
            Math.sin(x * wave.frequency + wave.phase + time * wave.speed) * wave.amplitude
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        ctx.fillStyle = hexToRgba(wave.color, wave.opacity)
        ctx.fill()
      })

      time += 0.01
      requestAnimationFrame(animate)
    }

    animate()
  }

  const initGalaxyBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const stars: Star[] = []
    const count = 300

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.7 ? '#fff' : Math.random() > 0.5 ? '#ffd700' : '#87ceeb',
      })
    }

    const animate = () => {
      ctx.fillStyle = '#050510'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1)
        star.opacity = Math.max(0.1, Math.min(1, star.opacity))

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = hexToRgba(star.color, star.opacity)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  const initStarsBackground = (config: any) => {
    return initGalaxyBackground(config)
  }

  const initLiquidBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const blobs: Blob[] = []
    const colors = config.colors || ['#6366f1', '#d946ef', '#06b6d4']

    for (let i = 0; i < 8; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5 * (config.speed || 1),
        vy: (Math.random() - 0.5) * 0.5 * (config.speed || 1),
        radius: Math.random() * 200 + 100,
        color: colors[i % colors.length],
        opacity: 0.15,
        points: Array.from({ length: 12 }, () => Math.random() * Math.PI * 2),
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      blobs.forEach((blob) => {
        blob.x += blob.vx
        blob.y += blob.vy

        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius

        ctx.beginPath()
        for (let i = 0; i < blob.points.length; i++) {
          const angle = blob.points[i] + Date.now() * 0.0001
          const r = blob.radius + Math.sin(angle * 3) * 30
          const x = blob.x + Math.cos(angle) * r
          const y = blob.y + Math.sin(angle) * r
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()

        ctx.fillStyle = hexToRgba(blob.color, blob.opacity)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  const initSilkBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const lines: SilkLine[] = []
    const colors = config.colors || ['#6366f1', '#d946ef']

    for (let i = 0; i < 20; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        length: Math.random() * 300 + 100,
        speed: (Math.random() * 0.02 + 0.01) * (config.speed || 1),
        color: colors[i % colors.length],
        opacity: 0.1,
        width: Math.random() * 2 + 0.5,
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 11, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      lines.forEach((line) => {
        line.x += Math.cos(line.angle) * line.speed
        line.y += Math.sin(line.angle) * line.speed
        line.angle += (Math.random() - 0.5) * 0.1

        if (line.x < 0) line.x = canvas.width
        if (line.x > canvas.width) line.x = 0
        if (line.y < 0) line.y = canvas.height
        if (line.y > canvas.height) line.y = 0

        ctx.beginPath()
        ctx.moveTo(line.x, line.y)
        ctx.lineTo(
          line.x + Math.cos(line.angle) * line.length,
          line.y + Math.sin(line.angle) * line.length
        )
        ctx.strokeStyle = hexToRgba(line.color, line.opacity)
        ctx.lineWidth = line.width
        ctx.lineCap = 'round'
        ctx.stroke()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  const initCloudsBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const clouds: Cloud[] = []
    const colors = config.colors || ['#ffffff', '#e0e0e0']

    for (let i = 0; i < 10; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: (Math.random() * 0.2 + 0.05) * (config.speed || 1),
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[i % colors.length],
        puffs: Array.from({ length: 5 }, () => ({
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 50,
          radius: Math.random() * 40 + 20,
        })),
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      clouds.forEach((cloud) => {
        cloud.x += cloud.speed
        if (cloud.x > canvas.width + 200) cloud.x = -200

        cloud.puffs.forEach((puff) => {
          ctx.beginPath()
          ctx.arc(cloud.x + puff.x, cloud.y + puff.y, puff.radius * cloud.scale, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(cloud.color, cloud.opacity)
          ctx.fill()
        })
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  const initLightningBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let bolts: Bolt[] = []
    const colors = config.colors || ['#6366f1', '#d946ef', '#ffffff']

    const spawnBolt = () => {
      if (Math.random() < 0.02 * (config.speed || 1)) {
        bolts.push({
          x: Math.random() * canvas.width,
          y: 0,
          segments: Array.from({ length: 10 }, (_, i) => ({
            x: (Math.random() - 0.5) * 50,
            y: canvas.height / 10,
          })),
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          thickness: Math.random() * 3 + 1,
        })
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 11, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      spawnBolt()

      bolts = bolts.filter((bolt) => {
        bolt.life -= 0.1
        if (bolt.life <= 0) return false

        ctx.beginPath()
        ctx.moveTo(bolt.x, 0)
        bolt.segments.forEach((seg, i) => {
          ctx.lineTo(bolt.x + seg.x, (i + 1) * canvas.height / 10)
        })
        ctx.strokeStyle = hexToRgba(bolt.color, bolt.life)
        ctx.lineWidth = bolt.thickness
        ctx.lineCap = 'round'
        ctx.stroke()
        return true
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  const initPlasmaBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0

    const animate = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data

      for (let y = 0; y < canvas.height; y += 2) {
        for (let x = 0; x < canvas.width; x += 2) {
          const value = Math.sin(x * 0.01 + time) +
            Math.sin(y * 0.01 + time) +
            Math.sin((x + y) * 0.01 + time) +
            Math.sin(Math.sqrt(x * x + y * y) * 0.02 + time)

          const colorValue = (value + 4) / 8
          const index = (y * canvas.width + x) * 4

          data[index] = Math.sin(colorValue * Math.PI * 2) * 127 + 127
          data[index + 1] = Math.sin(colorValue * Math.PI * 2 + 2) * 127 + 127
          data[index + 2] = Math.sin(colorValue * Math.PI * 2 + 4) * 127 + 127
          data[index + 3] = 255
        }
      }

      ctx.putImageData(imageData, 0, 0)
      time += 0.02 * (config.speed || 1)
      requestAnimationFrame(animate)
    }

    animate()
  }

  const initIridescenceBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0

    const animate = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      )

      for (let i = 0; i <= 10; i++) {
        const hue = (time * 30 + i * 36) % 360
        gradient.addColorStop(i / 10, `hsl(${hue}, 70%, 50%)`)
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.005 * (config.speed || 1)
      requestAnimationFrame(animate)
    }

    animate()
  }

  const initDitherBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = config.colors || ['#09090b', '#6366f1']
    const c1 = hexToRgb(colors[0]) || { r: 9, g: 9, b: 11 }
    const c2 = hexToRgb(colors[1]) || { r: 99, g: 102, b: 241 }

    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const threshold = ((x * 3 + y * 5) % 256) / 255
        const mix = (Math.sin(x * 0.1) + Math.sin(y * 0.1)) / 2 + 0.5
        const useC1 = mix > threshold

        const color = useC1 ? c1 : c2
        const index = (y * canvas.width + x) * 4

        data[index] = color.r
        data[index + 1] = color.g
        data[index + 2] = color.b
        data[index + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const initCRTBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4
        const scanline = Math.sin(y * 0.5) * 0.3 + 0.7
        const vignette = 1 - Math.sqrt(
          Math.pow((x - canvas.width / 2) / (canvas.width / 2), 2) +
          Math.pow((y - canvas.height / 2) / (canvas.height / 2), 2)
        ) * 0.5

        const color = config.colors?.[0] || '#09090b'
        const rgb = hexToRgb(color) || { r: 9, g: 9, b: 11 }

        data[index] = rgb.r * scanline * vignette
        data[index + 1] = rgb.g * scanline * vignette
        data[index + 2] = rgb.b * scanline * vignette
        data[index + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const initLightRaysBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const colors = config.colors || ['#6366f1', '#d946ef']

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 11, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.1
        const length = Math.max(canvas.width, canvas.height)

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(
          centerX + Math.cos(angle) * length,
          centerY + Math.sin(angle) * length
        )
        ctx.strokeStyle = hexToRgba(colors[i % colors.length], 0.1)
        ctx.lineWidth = 2
        ctx.stroke()
      }

      time += 0.01 * (config.speed || 1)
      requestAnimationFrame(animate)
    }

    animate()
  }

  const initSnowfallBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const flakes: Flake[] = []
    const count = config.particleCount || 100

    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        drift: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.8 + 0.2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      flakes.forEach((flake) => {
        flake.y += flake.speed * (config.speed || 1)
        flake.x += flake.drift * (config.speed || 1)

        if (flake.y > canvas.height) {
          flake.y = -10
          flake.x = Math.random() * canvas.width
        }

        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  const initRainBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drops: Drop[] = []
    const count = config.particleCount || 200

    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 10 + 5,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drops.forEach((drop) => {
        drop.y += drop.speed * (config.speed || 1)

        if (drop.y > canvas.height) {
          drop.y = -drop.length
          drop.x = Math.random() * canvas.width
        }

        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x, drop.y + drop.length)
        ctx.strokeStyle = `rgba(100, 150, 255, ${drop.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  const initAnimatedGradientBackground = (config: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    const colors = config.gradient?.stops || [
      { color: '#6366f1', position: 0 },
      { color: '#d946ef', position: 50 },
      { color: '#06b6d4', position: 100 },
    ]

    const animate = () => {
      const gradient = ctx.createLinearGradient(
        0, 0,
        canvas.width * Math.cos(time), canvas.height * Math.sin(time)
      )

      colors.forEach((stop: any) => {
        const pos = (stop.position / 100 + Math.sin(time) * 0.1) % 1
        gradient.addColorStop(Math.max(0, Math.min(1, pos)), stop.color)
      })

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.005 * (config.speed || 1)
      requestAnimationFrame(animate)
    }

    animate()
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 -z-10', 'width-full height-full')}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  opacity: number
}

interface Wave {
  amplitude: number
  frequency: number
  phase: number
  speed: number
  color: string
  opacity: number
}

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
  twinkleSpeed: number
  color: string
}

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  opacity: number
  points: number[]
}

interface SilkLine {
  x: number
  y: number
  angle: number
  length: number
  speed: number
  color: string
  opacity: number
  width: number
}

interface Cloud {
  x: number
  y: number
  speed: number
  scale: number
  opacity: number
  color: string
  puffs: Array<{ x: number; y: number; radius: number }>
}

interface Bolt {
  x: number
  y: number
  segments: Array<{ x: number; y: number }>
  life: number
  color: string
  thickness: number
}

interface Flake {
  x: number
  y: number
  radius: number
  speed: number
  drift: number
  opacity: number
}

interface Drop {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return `rgba(0, 0, 0, ${alpha})`
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}