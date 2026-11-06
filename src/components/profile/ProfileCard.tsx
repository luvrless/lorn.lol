'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

interface ProfileCardProps {
  profile: any
  username: string
  config: any
}

export function ProfileCard({ profile, username, config }: ProfileCardProps) {
  const user = profile?.user
  const cardConfig = config || {}
  const layout = cardConfig.layout || 'centered'
  const entranceAnimation = cardConfig.entranceAnimation || 'fade'

  const cardStyles = {
    width: cardConfig.width || 480,
    maxWidth: '100%',
    opacity: cardConfig.opacity ?? 1,
    backgroundColor: `rgba(15, 15, 18, ${cardConfig.transparency ?? 0.8})`,
    backdropFilter: `blur(${cardConfig.backgroundBlur || 20}px)`,
    borderRadius: cardConfig.border?.radius || 24,
    border: cardConfig.border?.enabled
      ? `${cardConfig.border.thickness || 1}px solid ${cardConfig.border.color || 'hsl(var(--border))'}`
      : 'none',
    boxShadow: cardConfig.shadow?.enabled
      ? `${cardConfig.shadow.offsetX || 0}px ${cardConfig.shadow.offsetY || 10}px ${cardConfig.shadow.blur || 40}px ${cardConfig.shadow.spread || 0}px ${cardConfig.shadow.color || 'rgba(0,0,0,0.3)'}`
      : 'none',
  }

  const containerStyles = {
    display: 'flex',
    justifyContent: layout === 'left' ? 'flex-start' : layout === 'right' ? 'flex-end' : 'center',
    alignItems: 'center',
    minHeight: '60vh',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={containerStyles}
    >
      <div
        className={cn(
          'relative overflow-hidden',
          'transition-all duration-300',
          cardConfig.hoverEffect === 'scale' && 'hover:scale-[1.02]',
          cardConfig.hoverEffect === 'glow' && 'hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]',
          cardConfig.tilt3d && 'transform-gpu'
        )}
        style={cardStyles}
        onMouseMove={cardConfig.tilt3d ? handleTilt : undefined}
        onMouseLeave={cardConfig.tilt3d ? resetTilt : undefined}
      >
        {cardConfig.border?.gradient && (
          <div
            className="absolute inset-0 -z-10 rounded-[inherit]"
            style={{
              background: `linear-gradient(135deg, ${cardConfig.border.gradient.join(', ')})`,
              opacity: cardConfig.border.animated ? 1 : 0,
              animation: cardConfig.border.animated ? 'rotate-slow 3s linear infinite' : 'none',
            }}
          />
        )}

        {cardConfig.border?.glow && (
          <div
            className="absolute inset-0 -z-10 rounded-[inherit] blur-2xl"
            style={{
              background: `radial-gradient(circle at center, ${cardConfig.border.color || 'hsl(var(--primary))'} 0%, transparent 70%)`,
              opacity: 0.3,
            }}
          />
        )}

        <div className="p-6 sm:p-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-6"
          >
            <Avatar className={cn('w-24 h-24 mx-auto ring-4 ring-background', 'shadow-glow')}>
              <AvatarImage src={user?.avatarUrl || undefined} alt={user?.displayName || username} />
              <AvatarFallback className="text-3xl font-display font-bold bg-gradient-to-br from-primary to-accent">
                {(user?.displayName || username)[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {user?.displayName || username}
              </span>
              {user?.role === 'PREMIUM' && (
                <Badge variant="premium" className="ml-2 px-2 py-0.5 text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </h1>

            {user?.profileStatus && (
              <p className="text-accent font-medium mb-4">{user.profileStatus}</p>
            )}

            {user?.bio && (
              <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto leading-relaxed">
                {user.bio}
              </p>
            )}

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
              {user?.location && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {user.location}
                </span>
              )}
              {user?.languages?.length && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {user.languages.join(', ')}
                </span>
              )}
              {user?.showJoinedDate && user?.createdAt && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function handleTilt(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = (y - centerY) / 10
  const rotateY = (centerX - x) / 10

  e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
}

function resetTilt(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
}