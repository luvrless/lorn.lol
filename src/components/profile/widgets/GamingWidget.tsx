'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GamingWidgetProps {
  type: string
  config: any
  style: React.CSSProperties
}

export function GamingWidget({ type, config, style }: GamingWidgetProps) {
  const title = config.title
  const games = config.games || []
  const setup = config.setup || {}
  const stats = config.stats || {}
  const hardware = config.hardware || []
  const layout = config.layout || 'grid'

  return (
    <div style={style} className="h-full">
      {title && (
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-lg mb-4"
        >
          {title}
        </motion.h3>
      )}

      {type === 'MY_GAMES' && games.length > 0 && (
        <div className={cn('grid gap-3', layout === 'grid' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}>
          {games.map((game: any, index: number) => (
            <motion.div
              key={game.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-muted/50 rounded-lg border border-border/50 group"
            >
              {game.coverUrl && (
                <div className="relative aspect-video mb-3 overflow-hidden rounded">
                  <img
                    src={game.coverUrl}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {game.playtime && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                      {game.playtime}h
                    </div>
                  )}
                </div>
              )}
              <h4 className="font-medium truncate">{game.name}</h4>
              {game.platform && <span className="text-xs text-muted-foreground">{game.platform}</span>}
              {game.genre && <span className="text-xs text-primary/80 ml-2">{game.genre}</span>}
            </motion.div>
          ))}
        </div>
      )}

      {type === 'GAMING_SETUP' && Object.keys(setup).length > 0 && (
        <div className="space-y-3">
          {Object.entries(setup).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
            >
              <span className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
              <span className="font-medium truncate max-w-[60%] text-right">{String(value)}</span>
            </motion.div>
          ))}
        </div>
      )}

      {type === 'HARDWARE' && hardware.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hardware.map((item: any, index: number) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-muted/50 rounded-lg border border-border/50"
            >
              <div className="flex items-center gap-3">
                {item.iconUrl && <img src={item.iconUrl} alt="" className="w-10 h-10 rounded" />}
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  {item.specs && <p className="text-xs text-muted-foreground">{item.specs}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {type === 'GAMING_STATS' && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="text-center p-4 bg-muted/50 rounded-lg border border-border/50"
            >
              <div className="font-bold text-2xl text-primary">{String(value)}</div>
              <div className="text-xs text-muted-foreground capitalize mt-1">{key.replace(/_/g, ' ')}</div>
            </motion.div>
          ))}
        </div>
      )}

      {type === 'GAME_COLLECTIONS' && config.collections && (
        <div className="space-y-4">
          {config.collections.map((collection: any, index: number) => (
            <motion.div
              key={collection.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-muted/50 rounded-lg border border-border/50"
            >
              <h4 className="font-semibold mb-2">{collection.name}</h4>
              <div className="flex flex-wrap gap-2">
                {collection.games?.slice(0, 5).map((game: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">{game}</span>
                ))}
                {collection.games && collection.games.length > 5 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">+{collection.games.length - 5} more</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}