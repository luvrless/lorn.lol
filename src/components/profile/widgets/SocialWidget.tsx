'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SocialWidgetProps {
  type: string
  config: any
  style: React.CSSProperties
}

const platformIcons: Record<string, React.ReactNode> = {
  DISCORD: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.991 4.735.078.078 0 0 0 .085-.028c.464-.636.973-1.208 1.514-1.708a13.14 13.14 0 0 0 .035-.775.074.074 0 0 0-.02-.114 13.21 13.21 0 0 1-1.871-6.297.07.07 0 0 1 .015-.086 11.96 11.96 0 0 1 3.855-5.023.077.077 0 0 1 .082.027 11.34 11.34 0 0 1 3.805 1.518.074.074 0 0 0 .085-.028c.486-.69 1.045-1.285 1.658-1.77a19.827 19.827 0 0 0 4.97-1.41.07.07 0 0 0 .025-.105zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419z" /></svg>,
  GITHUB: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>,
  TWITTER: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-3.256 2.62-8.492-9.51-10.083 11.45L2 21.792l7.244-8.48-7.591-8.42L12 2.25l10.33 11.86 4.087-5.598 3.307-2.273-5.48 6.238z" /></svg>,
  YOUTUBE: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L16.564 12l-7.02 3.568z" /></svg>,
  TWITCH: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.5 6.2v11.6c0 1.8-1.3 3.2-2.9 3.2H3.4C1.8 21 0 19.5 0 17.8V6.2C0 4.4 1.8 3 3.4 3h17.2c1.6 0 2.9 1.3 2.9 3.2zm-8.9 9.5c-.3 0-.6-.1-.9-.2l-4-2.4v4.9c0 1-.8 1.8-1.8 1.8H8.4c-1 0-1.8-.8-1.8-1.8V9c0-.9.8-1.7 1.8-1.7h2.2l3.9-2.3v9.6z" /></svg>,
  SPOTIFY: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.66.36-1.38.48-2.16.18-2.64-.9-4.74-2.58-6.06-4.68-.18-.3-.06-.66.3-.84 2.58-1.26 4.8-2.76 6.6-3.6.3-.12.66 0 .84.3 1.5 1.74 2.22 4.02 2.1 6.12-.06.36-.42.6-.78.6-.84 0-1.56-.54-1.92-1.26zm1.02-4.86c-.6.42-1.38.54-2.22.3-.84-.3-1.44-1.02-1.74-1.86-.3-.9.12-1.8.9-2.22 1.8-1.14 4.5-1.02 6.24.36.3.3.66.54 1.02.54.66 0 1.26-.36 1.68-1.02.48-.72.6-1.62.42-2.46z" /></svg>,
  ROBLOX: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.2 12.7c0 .8-.5 1.6-1.4 2.1-1.4.8-3.3 1.3-5.6 1.3-2.3 0-4.2-.5-5.6-1.3-.8-.5-1.4-1.3-1.4-2.1 0-.8.6-1.6 1.4-2.1.8-.8 1.8-1.3 3-1.5V8.5c0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4v1.2c1.2.2 2.2.7 3 1.5.9-.8 2-1.3 3-1.5V8.5c0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4v2.1c1.2-.2 2.2-.7 3-1.5.8-.8 1.9-1.3 3-1.5.8-.5 1.4-1.3 1.4-2.1z" /></svg>,
}

const platformColors: Record<string, string> = {
  DISCORD: '#5865F2',
  GITHUB: '#ffffff',
  TWITTER: '#1DA1F2',
  YOUTUBE: '#FF0000',
  TWITCH: '#9146FF',
  SPOTIFY: '#1DB954',
  ROBLOX: '#00A2FF',
}

export function SocialWidget({ type, config, style }: SocialWidgetProps) {
  const username = config.username || ''
  const displayName = config.displayName || username
  const showStats = config.showStats !== false
  const stats = config.stats || {}
  const layout = config.layout || 'card'

  const Icon = platformIcons[type] || <span>{type}</span>
  const color = platformColors[type] || '#6366f1'

  if (!username) {
    return (
      <div style={style} className="text-center py-12 text-muted-foreground">
        <p>Connect your {type} account</p>
      </div>
    )
  }

  return (
    <div style={style} className="h-full">
      <div className={cn(
        'p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm',
        layout === 'minimal' && 'p-4',
      )}>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {Icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg truncate">{displayName}</span>
              {config.verified && (
                <span className="text-green-500" title="Verified">✓</span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">@{username}</span>
          </div>
          <a
            href={config.profileUrl || `https://${type.toLowerCase()}.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50"
            aria-label={`View ${type} profile`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        {showStats && Object.keys(stats).length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
            {Object.entries(stats).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="font-bold text-xl text-foreground">{String(value)}</div>
                <div className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}