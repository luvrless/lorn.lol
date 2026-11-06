'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const weatherIcons: Record<string, React.ReactNode> = {
  clear: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
  clouds: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8"><path d="M17.5 19H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1.9a2 2 0 0 1 1.8 1.1l1.2 2.3A4 4 0 0 0 19.5 12a4 4 0 0 0-2-3.5" /></svg>,
  rain: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8"><path d="M17.5 19H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1.9a2 2 0 0 1 1.8 1.1l1.2 2.3A4 4 0 0 0 19.5 12a4 4 0 0 0-2-3.5" /><line x1="16" y1="13" x2="16" y2="21" /><line x1="8" y1="13" x2="8" y2="21" /><line x1="12" y1="13" x2="12" y2="21" /></svg>,
  snow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8"><path d="M17.5 19H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1.9a2 2 0 0 1 1.8 1.1l1.2 2.3A4 4 0 0 0 19.5 12a4 4 0 0 0-2-3.5" /><circle cx="16" cy="16" r="1" /><circle cx="8" cy="16" r="1" /><circle cx="12" cy="16" r="1" /><circle cx="16" cy="11" r="1" /><circle cx="8" cy="11" r="1" /><circle cx="12" cy="11" r="1" /></svg>,
  thunderstorm: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8"><path d="M17.5 19H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1.9a2 2 0 0 1 1.8 1.1l1.2 2.3A4 4 0 0 0 19.5 12a4 4 0 0 0-2-3.5" /><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
}

interface WeatherWidgetProps {
  config: any
  style: React.CSSProperties
}

export function WeatherWidget({ config, style }: WeatherWidgetProps) {
  const location = config.location || 'Current Location'
  const weather = config.weather || {
    temperature: 22,
    condition: 'clear',
    humidity: 65,
    wind: 12,
    description: 'Clear sky',
  }
  const unit = config.unit || 'celsius'

  const temp = unit === 'fahrenheit' ? Math.round(weather.temperature * 9/5 + 32) : weather.temperature
  const tempUnit = unit === 'fahrenheit' ? '°F' : '°C'
  const Icon = weatherIcons[weather.condition] || weatherIcons.clear

  return (
    <div style={style} className="h-full">
      <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-semibold text-lg"
            >
              {location}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground"
            >
              {weather.description}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-display font-bold"
          >
            {temp}{tempUnit}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4"
        >
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            {Icon}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-border/50"
        >
          <WeatherDetail label="Humidity" value={`${weather.humidity}%`} />
          <WeatherDetail label="Wind" value={`${weather.wind} km/h`} />
          <WeatherDetail label="Feels Like" value={`${Math.round(weather.temperature - (100 - weather.humidity) / 5)}${tempUnit}`} />
        </motion.div>
      </div>
    </div>
  )
}

function WeatherDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-3 bg-muted/50 rounded-lg border border-border/50">
      <div className="font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}