'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CustomWidgetProps {
  type: string
  config: any
  style: React.CSSProperties
}

export function CustomWidget({ type, config, style }: CustomWidgetProps) {
  const title = config.title
  const content = config.content || ''
  const items = config.items || []
  const fields = config.fields || []
  const layout = config.layout || 'default'

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

      {content && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none mb-6"
        >
          <p className="text-muted-foreground">{content}</p>
        </motion.div>
      )}

      {fields.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn('space-y-3', layout === 'grid' && 'grid grid-cols-1 sm:grid-cols-2 gap-3')}
        >
          {fields.map((field: any, index: number) => (
            <motion.div
              key={field.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
            >
              <span className="text-sm text-muted-foreground capitalize">{field.label || field.key}</span>
              <span className="font-medium truncate max-w-[60%] text-right">{field.value}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn('space-y-2', layout === 'grid' && 'grid grid-cols-1 sm:grid-cols-2 gap-3')}
        >
          {items.map((item: any, index: number) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-muted/50 rounded-lg border border-border/50"
            >
              {item.label && <span className="text-xs text-muted-foreground">{item.label}</span>}
              {item.value && <span className="font-medium">{item.value}</span>}
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">
                  Link
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {type === 'EMBEDDED_MEDIA' && config.embedUrl && (
        <div className="aspect-video rounded-lg overflow-hidden border border-border/50">
          <iframe
            src={config.embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      )}

      {type === 'TIMEZONE' && config.timezone && (
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-4xl font-bold mb-2"
          >
            {new Date().toLocaleTimeString('en-US', { timeZone: config.timezone, hour: '2-digit', minute: '2-digit' })}
          </motion.div>
          <div className="text-muted-foreground">{config.timezone}</div>
        </div>
      )}
    </div>
  )
}