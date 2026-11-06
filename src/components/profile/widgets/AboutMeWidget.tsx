'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AboutMeWidgetProps {
  type: string
  config: any
  style: React.CSSProperties
}

export function AboutMeWidget({ type, config, style }: AboutMeWidgetProps) {
  const title = config.title
  const content = config.content || ''
  const items = config.items || []
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

      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn('space-y-3', layout === 'grid' && 'grid grid-cols-1 sm:grid-cols-2 gap-3')}
        >
          {items.map((item: any, index: number) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
            >
              <span className="text-sm text-muted-foreground capitalize">{item.label || item.key}</span>
              <span className="font-medium truncate max-w-[60%] text-right">{item.value}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {type === 'SKILLS' && items.length > 0 && (
        <div className="space-y-3">
          {items.map((skill: any, index: number) => (
            <motion.div
              key={skill.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-1"
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium">{skill.name}</span>
                <span className="text-muted-foreground">{skill.level}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {type === 'PROJECTS' && items.length > 0 && (
        <div className="space-y-4">
          {items.map((project: any, index: number) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-muted/50 rounded-lg border border-border/50"
            >
              <h4 className="font-semibold">{project.name}</h4>
              {project.description && <p className="text-sm text-muted-foreground mt-1">{project.description}</p>}
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm mt-2 inline-block hover:underline">
                  View Project →
                </a>
              )}
              {project.techStack && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.techStack.map((tech: string) => (
                    <span key={tech} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">{tech}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {type === 'LANGUAGES' && items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((lang: any, index: number) => (
            <motion.span
              key={lang.id || index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
            >
              {lang.name} {lang.proficiency && `(${lang.proficiency})`}
            </motion.span>
          ))}
        </div>
      )}

      {type === 'CUSTOM_TEXT' && (
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground">{content}</p>
        </div>
      )}
    </div>
  )
}