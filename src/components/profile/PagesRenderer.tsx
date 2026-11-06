'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { WidgetsRenderer } from './WidgetsRenderer'
import { BackgroundRenderer } from './BackgroundRenderer'

interface PagesRendererProps {
  pages: any[]
  config: any
}

export function PagesRenderer({ pages, config }: PagesRendererProps) {
  const publishedPages = pages.filter(p => p.isPublished).sort((a, b) => a.order - b.order)

  if (!publishedPages.length) return null

  const animationConfig = config || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="mt-16 space-y-16"
    >
      {publishedPages.map((page, pageIndex) => (
        <motion.section
          key={page.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 + pageIndex * 0.1 }}
          id={page.slug}
          className="relative"
        >
          <BackgroundRenderer config={page.backgroundConfig} username={`page-${page.slug}`} />

          <div className="relative z-10 max-w-6xl mx-auto px-4">
            {(page.title || page.description) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center mb-12"
              >
                {page.title && (
                  <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {page.title}
                  </h2>
                )}
                {page.description && (
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{page.description}</p>
                )}
              </motion.div>
            )}

            <WidgetsRenderer
              widgets={page.widgets || []}
              config={animationConfig}
              layout={page.layout}
            />
          </div>
        </motion.section>
      ))}
    </motion.div>
  )
}