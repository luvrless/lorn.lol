'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CountdownWidgetProps {
  config: any
  style: React.CSSProperties
}

export function CountdownWidget({ config, style }: CountdownWidgetProps) {
  const targetDate = config.targetDate ? new Date(config.targetDate) : null
  const title = config.title || 'Countdown'
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!targetDate) return

    const updateCountdown = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()

      if (diff <= 0) {
        setExpired(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  if (!targetDate) {
    return (
      <div style={style} className="text-center py-12 text-muted-foreground">
        <p>No target date set</p>
      </div>
    )
  }

  if (expired) {
    return (
      <div style={style} className="text-center py-12">
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-lg text-green-500"
        >
          {config.expiredMessage || 'Time is up!'}
        </motion.h3>
      </div>
    )
  }

  return (
    <div style={style} className="h-full flex flex-col items-center justify-center text-center">
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-semibold text-lg mb-4"
      >
        {title}
      </motion.h3>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 sm:gap-4 mb-4"
      >
        <CountdownUnit label="Days" value={timeLeft.days} />
        <CountdownUnit label="Hours" value={timeLeft.hours} />
        <CountdownUnit label="Minutes" value={timeLeft.minutes} />
        <CountdownUnit label="Seconds" value={timeLeft.seconds} />
      </motion.div>

      {config.showTargetDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground"
        >
          Until {targetDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </motion.div>
      )}
    </div>
  )
}

function CountdownUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <motion.span
        className={cn('font-display font-bold', 'text-2xl sm:text-3xl lg:text-4xl')}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {value.toString().padStart(2, '0')}
      </motion.span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</span>
    </div>
  )
}