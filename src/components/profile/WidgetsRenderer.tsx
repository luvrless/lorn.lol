'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { WidgetRenderer } from './WidgetRenderer'

interface WidgetsRendererProps {
  widgets: any[]
  config: any
  layout?: string
}

export function WidgetsRenderer({ widgets, config, layout = 'GRID' }: WidgetsRendererProps) {
  const visibleWidgets = widgets.filter(w => w.isVisible && w.isEnabled).sort((a, b) => {
    if (a.pageId && b.pageId) {
      if (a.y !== b.y) return a.y - b.y
      if (a.x !== b.x) return a.x - b.x
      return a.order - b.order
    }
    return a.order - b.order
  })

  if (!visibleWidgets.length) return null

  const animationConfig = config || {}
  const staggerDelay = animationConfig.staggerDelay || 0.1

  const renderGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {visibleWidgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 + index * staggerDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ gridColumn: `span ${widget.width || 1}`, gridRow: `span ${widget.height || 1}` }}
        >
          <WidgetRenderer widget={widget} config={animationConfig} />
        </motion.div>
      ))}
    </div>
  )

  const renderMasonry = () => (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
      {visibleWidgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 + index * staggerDelay }}
          className="break-inside-avoid mb-4"
        >
          <WidgetRenderer widget={widget} config={animationConfig} />
        </motion.div>
      ))}
    </div>
  )

  const renderStack = () => (
    <div className="space-y-4">
      {visibleWidgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 + index * staggerDelay }}
        >
          <WidgetRenderer widget={widget} config={animationConfig} />
        </motion.div>
      ))}
    </div>
  )

  const renderFlow = () => (
    <div className="flex flex-wrap gap-4">
      {visibleWidgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 + index * staggerDelay }}
          style={{ flex: `0 0 ${widget.width || 12}rem` }}
        >
          <WidgetRenderer widget={widget} config={animationConfig} />
        </motion.div>
      ))}
    </div>
  )

  const renderCollage = () => (
    <div className="relative h-[600px] sm:h-[800px]">
      {visibleWidgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, scale: 0.8, rotate: (Math.random() - 0.5) * 20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + index * staggerDelay }}
          style={{
            position: 'absolute',
            left: `${widget.x || Math.random() * 80}%`,
            top: `${widget.y || Math.random() * 80}%`,
            width: `${(widget.width || 12) * 8}rem`,
            height: `${(widget.height || 6) * 8}rem`,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <WidgetRenderer widget={widget} config={animationConfig} />
        </motion.div>
      ))}
    </div>
  )

  switch (layout) {
    case 'MASONRY':
      return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{renderMasonry()}</motion.div>
    case 'STACK':
      return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{renderStack()}</motion.div>
    case 'WALL':
      return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{renderMasonry()}</motion.div>
    case 'SPINE':
      return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{renderStack()}</motion.div>
    case 'COLLAGE':
      return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{renderCollage()}</motion.div>
    case 'FLOW':
      return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{renderFlow()}</motion.div>
    case 'MAGAZINE':
      return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{renderGrid()}</motion.div>
    case 'DECK':
      return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{renderStack()}</motion.div>
    default:
      return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{renderGrid()}</motion.div>
  }
}