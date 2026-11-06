'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Play } from 'lucide-react'

interface VideoGalleryWidgetProps {
  config: any
  style: React.CSSProperties
}

export function VideoGalleryWidget({ config, style }: VideoGalleryWidgetProps) {
  const videos = config.videos || []
  const layout = config.layout || 'grid'

  if (!videos.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No videos in gallery</p>
      </div>
    )
  }

  return (
    <div style={style} className="h-full">
      <div className={cn(
        'grid gap-4',
        layout === 'grid' && 'grid-cols-1 sm:grid-cols-2',
        layout === 'list' && 'grid-cols-1',
      )}>
        {videos.map((video: any, index: number) => (
          <motion.div
            key={video.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative overflow-hidden rounded-xl group bg-muted"
          >
            {video.thumbnailUrl && (
              <img
                src={video.thumbnailUrl}
                alt={video.title || `Video ${index + 1}`}
                className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            {video.url && (
              <button className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-12 h-12 text-white" />
              </button>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="font-semibold text-white truncate">{video.title || `Video ${index + 1}`}</h4>
              {video.description && <p className="text-sm text-white/80 truncate">{video.description}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}