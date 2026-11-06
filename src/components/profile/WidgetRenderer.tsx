'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ImageGalleryWidget } from './widgets/ImageGalleryWidget'
import { VideoGalleryWidget } from './widgets/VideoGalleryWidget'
import { MusicPlayerWidget } from './widgets/MusicPlayerWidget'
import { AboutMeWidget } from './widgets/AboutMeWidget'
import { SocialWidget } from './widgets/SocialWidget'
import { GamingWidget } from './widgets/GamingWidget'
import { CustomWidget } from './widgets/CustomWidget'
import { ClockWidget } from './widgets/ClockWidget'
import { CountdownWidget } from './widgets/CountdownWidget'
import { WeatherWidget } from './widgets/WeatherWidget'

interface WidgetRendererProps {
  widget: any
  config: any
}

export function WidgetRenderer({ widget, config }: WidgetRendererProps) {
  const widgetConfig = widget.config || {}
  const widgetStyle = widget.style || {}
  const type = widget.type

  const baseStyles = {
    backgroundColor: widgetStyle.backgroundColor || 'rgba(15, 15, 18, 0.6)',
    backdropFilter: 'blur(20px)',
    border: widgetStyle.border ? `1px solid ${widgetStyle.border}` : '1px solid hsl(var(--border))',
    borderRadius: widgetStyle.borderRadius || 16,
    padding: widgetStyle.padding || 24,
    ...widgetStyle.customStyles,
  }

  const renderWidget = () => {
    switch (type) {
      case 'IMAGE_GALLERY':
        return <ImageGalleryWidget config={widgetConfig} style={baseStyles} />
      case 'VIDEO_GALLERY':
        return <VideoGalleryWidget config={widgetConfig} style={baseStyles} />
      case 'MUSIC_PLAYER':
        return <MusicPlayerWidget config={widgetConfig} style={baseStyles} />
      case 'ABOUT_ME':
      case 'PERSONAL_INFO':
      case 'LANGUAGES':
      case 'LOCATION':
      case 'SKILLS':
      case 'PROJECTS':
      case 'CUSTOM_TEXT':
        return <AboutMeWidget type={type} config={widgetConfig} style={baseStyles} />
      case 'DISCORD':
      case 'DISCORD_SERVER':
      case 'ROBLOX':
      case 'STEAM':
      case 'YOUTUBE':
      case 'TWITCH':
      case 'GITHUB':
      case 'SPOTIFY':
        return <SocialWidget type={type} config={widgetConfig} style={baseStyles} />
      case 'MY_GAMES':
      case 'GAMING_SETUP':
      case 'HARDWARE':
      case 'GAME_SETTINGS':
      case 'CROSSHAIR_SETTINGS':
      case 'GAMING_STATS':
      case 'GAME_COLLECTIONS':
        return <GamingWidget type={type} config={widgetConfig} style={baseStyles} />
      case 'CLOCK':
        return <ClockWidget config={widgetConfig} style={baseStyles} />
      case 'COUNTDOWN':
        return <CountdownWidget config={widgetConfig} style={baseStyles} />
      case 'WEATHER':
        return <WeatherWidget config={widgetConfig} style={baseStyles} />
      case 'CUSTOM_LIST':
      case 'CUSTOM_INFO_ROWS':
      case 'EMBEDDED_MEDIA':
      case 'MUSIC_COLLECTION':
      case 'CLIPS':
      case 'IMAGE_GALLERY':
      case 'VIDEO_GALLERY':
      default:
        return <CustomWidget type={type} config={widgetConfig} style={baseStyles} />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={baseStyles}
      className="relative overflow-hidden"
    >
      {renderWidget()}
    </motion.div>
  )
}