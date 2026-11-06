'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ClockWidgetProps {
  config: any
  style: React.CSSProperties
}

export function ClockWidget({ config, style }: ClockWidgetProps) {
  const [time, setTime] = useState(new Date())
  const timezone = config.timezone || 'UTC'
  const format = config.format || '24h'
  const showSeconds = config.showSeconds !== false
  const showDate = config.showDate !== false

  useEffect(() => {
    const updateTime = () => setTime(new Date())
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const timeString = time.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: format === '12h' ? 'numeric' : '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: format === '12h',
  })

  const dateString = time.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div style={style} className="h-full flex flex-col items-center justify-center text-center">
      {showDate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2"
        >
          <div className="text-muted-foreground text-sm">{dateString}</div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('font-display font-bold', config.fontSize ? `text-[${config.fontSize}px]` : 'text-4xl sm:text-6xl')}
        style={{ fontFamily: config.fontFamily }}
      >
        {timeString}
      </motion.div>

      {config.showTimezone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-muted-foreground"
        >
          {timezone}
        </motion.div>
      )}
    </div>
  )
}