'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MousePointerClick, Volume2, VolumeX } from 'lucide-react'
import { BackgroundRenderer } from './BackgroundRenderer'

interface EnterScreenProps {
  config: any
  onEnter: () => void
  exiting: boolean
}

const entranceAnimations: Record<string, any> = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 } },
  zoom: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.2 }, transition: { duration: 0.5 } },
  blur: { initial: { opacity: 0, filter: 'blur(20px)' }, animate: { opacity: 1, filter: 'blur(0px)' }, exit: { opacity: 0, filter: 'blur(20px)' }, transition: { duration: 0.5 } },
  slide: { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -100 }, transition: { duration: 0.5 } },
  curtain: { initial: { opacity: 0, clipPath: 'inset(0 0 100% 0)' }, animate: { opacity: 1, clipPath: 'inset(0 0 0% 0)' }, exit: { opacity: 0, clipPath: 'inset(100% 0 0% 0)' }, transition: { duration: 0.8 } },
  dissolve: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.6 } },
  glitch: { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 10 }, transition: { duration: 0.5 } },
  ripple: { initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.5 }, transition: { duration: 0.5 } },
  pixel: { initial: { opacity: 0, filter: 'blur(4px) contrast(2)' }, animate: { opacity: 1, filter: 'blur(0px) contrast(1)' }, exit: { opacity: 0, filter: 'blur(4px) contrast(2)' }, transition: { duration: 0.5 } },
}

const exitAnimations: Record<string, any> = {
  fade: { opacity: 0, transition: { duration: 0.5 } },
  zoom: { opacity: 0, scale: 1.2, transition: { duration: 0.5 } },
  blur: { opacity: 0, filter: 'blur(20px)', transition: { duration: 0.5 } },
  slide: { opacity: 0, y: -100, transition: { duration: 0.5 } },
  curtain: { opacity: 0, clipPath: 'inset(100% 0 0% 0)', transition: { duration: 0.8 } },
  dissolve: { opacity: 0, transition: { duration: 0.6 } },
  glitch: { opacity: 0, x: 10, transition: { duration: 0.5 } },
  ripple: { opacity: 0, scale: 1.5, transition: { duration: 0.5 } },
  pixel: { opacity: 0, filter: 'blur(4px) contrast(2)', transition: { duration: 0.5 } },
}

export function EnterScreen({ config, onEnter, exiting }: EnterScreenProps) {
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const entranceAnimation = config?.enterAnimation || 'fade'
  const exitAnimation = config?.exitAnimation || 'fade'
  const soundUrl = config?.soundUrl
  const soundVolume = config?.soundVolume || 0.5
  const autoPlaySound = config?.autoPlaySound

  useEffect(() => {
    if (soundUrl && autoPlaySound && !exiting) {
      audioRef.current = new Audio(soundUrl)
      audioRef.current.volume = soundVolume
      audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => {})
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [soundUrl, autoPlaySound, exiting])

  const handleClick = () => {
    if (audioRef.current && !audioPlaying) {
      audioRef.current.play().catch(() => {})
    }
    onEnter()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const entranceConfig = entranceAnimations[entranceAnimation as keyof typeof entranceAnimations] || entranceAnimations.fade
  const exitConfig = exitAnimations[exitAnimation as keyof typeof exitAnimations] || exitAnimations.fade

  return (
    <motion.div
      ref={containerRef}
      initial={entranceConfig.initial}
      animate={exiting ? exitConfig : entranceConfig.animate}
      exit={exitConfig}
      transition={entranceConfig.transition}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: config?.backgroundColor,
        background: config?.gradient ? `linear-gradient(135deg, ${config.gradient.join(', ')})` : undefined,
        backdropFilter: config?.blur ? `blur(${config.blur}px)` : 'none',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Enter screen"
    >
      <BackgroundRenderer config={config} username="enter" />

      {config?.videoUrl && (
        <video
          src={config.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="fixed inset-0 w-full h-full object-cover"
          style={{ opacity: 0.5 }}
        />
      )}

      {config?.imageUrl && (
        <img
          src={config.imageUrl}
          alt=""
          className="fixed inset-0 w-full h-full object-cover"
          style={{ opacity: 0.3 }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
        {config?.iconUrl && (
          <motion.img
            src={config.iconUrl}
            alt=""
            className="w-24 h-24 mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        )}

        {config?.title && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={cn(
              'font-display text-4xl sm:text-6xl font-bold mb-4',
              'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
            )}
            style={{ fontFamily: config?.fontFamily }}
          >
            {config.title}
          </motion.h1>
        )}

        {config?.subtitle && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={cn('text-xl sm:text-2xl text-muted-foreground mb-6', 'font-medium')}
            style={{ fontFamily: config?.fontFamily, color: config?.textColor }}
          >
            {config.subtitle}
          </motion.h2>
        )}

        {config?.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn('text-lg text-muted-foreground mb-8 max-w-md', 'leading-relaxed')}
            style={{ fontFamily: config?.fontFamily, color: config?.textColor }}
          >
            {config.description}
          </motion.p>
        )}

        <motion.button
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            'relative group px-8 py-4 rounded-xl font-semibold text-lg',
            'transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
            config?.buttonStyle?.backgroundColor ? `bg-[${config.buttonStyle.backgroundColor}]` : 'bg-gradient-to-r from-primary to-accent',
            config?.buttonStyle?.textColor ? `text-[${config.buttonStyle.textColor}]` : 'text-primary-foreground',
            config?.buttonStyle?.borderRadius ? `rounded-[${config.buttonStyle.borderRadius}px]` : 'rounded-xl',
            config?.buttonStyle?.padding?.x ? `px-${config.buttonStyle.padding.x}` : 'px-8',
            config?.buttonStyle?.padding?.y ? `py-${config.buttonStyle.padding.y}` : 'py-4',
          )}
          style={{
            boxShadow: hovered ? '0 0 30px hsl(var(--primary) / 0.5)' : 'none',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
          whileHover={config?.buttonStyle?.hoverEffect === 'scale' ? { scale: 1.05 } : config?.buttonStyle?.hoverEffect === 'glow' ? { boxShadow: '0 0 30px hsl(var(--primary) / 0.5)' } : config?.buttonStyle?.hoverEffect === 'slide' ? { x: 5 } : {}}
          whileTap={{ scale: 0.95 }}
        >
          {config?.buttonIcon && (
            <span className="mr-2 flex items-center">
              <img src={config.buttonIcon} alt="" className="w-5 h-5" />
            </span>
          )}
          {config?.buttonText || 'Click to Enter'}
          <MousePointerClick className="ml-2 w-5 h-5 inline-block animate-bounce" />
        </motion.button>

        {soundUrl && (
          <button
            onClick={() => {
              if (audioRef.current) {
                if (audioPlaying) audioRef.current.pause()
                else audioRef.current.play()
                setAudioPlaying(!audioPlaying)
              }
            }}
            className="mt-6 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            aria-label={audioPlaying ? 'Mute' : 'Unmute'}
          >
            {audioPlaying ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
          </button>
        )}
      </div>
    </motion.div>
  )
}