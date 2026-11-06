'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'
import { trackLinkClick } from '@/lib/analytics'

interface SocialLinksProps {
  links: any[]
  config: any
}

export function SocialLinks({ links, config }: SocialLinksProps) {
  if (!links?.length) return null

  const visibleLinks = links.filter(l => l.visibility !== 'HIDDEN' && !l.isArchived)
  const featuredLinks = visibleLinks.filter(l => l.isFeatured)
  const regularLinks = visibleLinks.filter(l => !l.isFeatured)

  const animationConfig = config || {}
  const staggerDelay = animationConfig.staggerDelay || 0.1

  return (
    <div className="mt-8">
      {(featuredLinks.length > 0 || regularLinks.length > 0) && (
        <>
          {featuredLinks.length > 0 && (
            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              >
                {featuredLinks.map((link, index) => (
                  <LinkItem
                    key={link.id}
                    link={link}
                    index={index}
                    staggerDelay={staggerDelay}
                    featured={true}
                  />
                ))}
              </motion.div>
            </div>
          )}

          {regularLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="space-y-2"
            >
              {regularLinks.map((link, index) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  index={index}
                  staggerDelay={staggerDelay}
                  featured={false}
                />
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

function LinkItem({ link, index, staggerDelay, featured }: { link: any; index: number; staggerDelay: number; featured: boolean }) {
  const isIconOnly = link.visibility === 'ICON_ONLY' || (featured && link.isMonochrome)

  return (
    <motion.a
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5 + index * staggerDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLinkClick(link.id, link.url)}
      className={cn(
        'group relative flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-card/50 border border-border/50',
        'backdrop-blur-sm transition-all duration-300',
        'hover:border-primary/50 hover:bg-primary/5',
        featured && 'bg-primary/10 border-primary/20',
        isIconOnly && 'justify-center px-4'
      )}
      style={{
        backgroundColor: link.iconColor ? `${link.iconColor}15` : undefined,
        borderColor: link.iconColor ? `${link.iconColor}40` : undefined,
      }}
    >
      {!isIconOnly && link.iconUrl && (
        <img
          src={link.iconUrl}
          alt=""
          className={cn(
            'w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex-shrink-0',
            'transition-transform duration-300',
            'group-hover:scale-110 group-hover:rotate-3',
            link.isMonochrome && 'grayscale brightness-200'
          )}
          style={{ filter: link.isMonochrome ? 'grayscale(1) brightness(2)' : 'none' }}
        />
      )}

      {!isIconOnly && !link.iconUrl && (
        <div
          className={cn(
            'w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0',
            'bg-gradient-to-br from-primary to-accent',
            'transition-transform duration-300',
            'group-hover:scale-110 group-hover:rotate-3'
          )}
        >
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
      )}

      {!isIconOnly && (
        <div className="flex-1 min-w-0 text-left">
          <span className={cn(
            'font-medium text-sm truncate block',
            link.iconColor ? `text-[${link.iconColor}]` : 'text-foreground'
          )}>
            {link.label}
          </span>
          {link.description && (
            <span className="text-xs text-muted-foreground truncate block">
              {link.description}
            </span>
          )}
        </div>
      )}

      <ExternalLink
        className={cn(
          'w-5 h-5 text-muted-foreground group-hover:text-primary transition-all duration-300',
          'opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0',
          isIconOnly && 'opacity-100 translate-x-0'
        )}
        aria-hidden="true"
      />
    </motion.a>
  )
}