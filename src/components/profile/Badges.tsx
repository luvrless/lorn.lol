'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge as BadgeComponent } from '@/components/ui/badge'

interface BadgesProps {
  badges: any[]
  config: any
}

export function Badges({ badges, config }: BadgesProps) {
  const visibleBadges = badges.filter(b => b.isVisible).sort((a, b) => a.order - b.order)

  if (!visibleBadges.length) return null

  const animationConfig = config || {}
  const staggerDelay = animationConfig.staggerDelay || 0.1

  const rarityOrder = { MYTHIC: 6, LEGENDARY: 5, EPIC: 4, RARE: 3, UNCOMMON: 2, COMMON: 1 }
  const sortedBadges = [...visibleBadges].sort((a, b) => {
    const aRarity = rarityOrder[a.badge?.rarity as keyof typeof rarityOrder] || 0
    const bRarity = rarityOrder[b.badge?.rarity as keyof typeof rarityOrder] || 0
    return bRarity - aRarity
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="mt-8"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        {sortedBadges.map((userBadge, index) => {
          const badge = userBadge.badge
          if (!badge) return null

          const isAnimated = badge.isAnimated && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          const isMonochrome = animationConfig.monochromeBadges

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * staggerDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.1, y: -2 }}
            >
              <BadgeComponent
                variant="outline"
                className={cn(
                  'gap-1.5 px-3 py-1.5 cursor-default',
                  'relative overflow-hidden',
                  isAnimated && 'animate-pulse-glow',
                  badge.glowColor && 'shadow-[0_0_15px_rgba(var(--glow-color),0.5)]'
                )}
                style={{
                  borderColor: isMonochrome ? 'hsl(var(--border))' : badge.color,
                  backgroundColor: isMonochrome ? 'transparent' : `${badge.color}15`,
                  color: isMonochrome ? 'hsl(var(--foreground))' : badge.color,
                  ['--glow-color' as any]: badge.glowColor || badge.color,
                } as React.CSSProperties}
              >
                {badge.iconUrl && (
                  <img
                    src={badge.iconUrl}
                    alt=""
                    className="w-4 h-4"
                    style={{ filter: isMonochrome ? 'grayscale(1)' : 'none' }}
                  />
                )}
                <span className="font-medium text-xs">{badge.name}</span>
                {isAnimated && badge.animationConfig?.type === 'shimmer' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                )}
              </BadgeComponent>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}