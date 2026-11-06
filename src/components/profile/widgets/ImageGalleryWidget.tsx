'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ImageGalleryWidgetProps {
  config: any
  style: React.CSSProperties
}

export function ImageGalleryWidget({ config, style }: ImageGalleryWidgetProps) {
  const images = config.images || []
  const layout = config.layout || 'grid'
  const aspectRatio = config.aspectRatio || '1/1'

  if (!images.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No images in gallery</p>
      </div>
    )
  }

  return (
    <div style={style} className="h-full">
      <div className={cn(
        'grid gap-2',
        layout === 'grid' && 'grid-cols-2 sm:grid-cols-3',
        layout === 'masonry' && 'grid-cols-2 sm:grid-cols-3',
        layout === 'carousel' && 'grid-cols-1',
      )}>
        {images.map((image: any, index: number) => (
          <motion.div
            key={image.id || index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative overflow-hidden rounded-lg group"
            style={{ aspectRatio }}
          >
            {image.url && (
              <Image
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            )}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-sm">
                {image.caption}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}