'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface SidebarProps {
  navigation: Array<{ name: string; href: string; icon: React.ComponentType<{ className?: string }> }>
  pathname: string
  open: boolean
  onClose: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ navigation, pathname, open, onClose, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <TooltipProvider>
        <aside
          className={cn(
            'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300 lg:translate-x-0',
            open ? 'w-64' : 'w-20',
            mobileOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <Link href="/dashboard/overview" className="flex items-center gap-2" onClick={onMobileClose}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: open ? 1 : 0, x: 0 }}
                  transition={{ duration: 150 }}
                  className="font-display font-bold text-xl text-gradient white-space-nowrap overflow-hidden"
                >
                  LORN.LOL
                </motion.span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onClose}
              >
                <ChevronRight className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" role="navigation" aria-label="Main navigation">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Tooltip key={item.name} delayDuration={200}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={onMobileClose}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                          'group relative overflow-hidden',
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/5',
                          !open && 'justify-center'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: open ? 1 : 0, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 150 }}
                          className="white-space-nowrap font-medium"
                        >
                          {item.name}
                        </motion.span>
                        {isActive && open && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 3 }}
                            className="absolute left-0 top-0 bottom-0 bg-primary rounded-l-xl"
                          />
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="hidden lg:block">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </nav>

            <div className="p-3 border-t border-border">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: open ? 1 : 0, height: open ? 'auto' : 0 }}
                transition={{ duration: 200 }}
                className="overflow-hidden"
              >
                <Link
                  href="/dashboard/premium"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary hover:from-primary/20 hover:to-accent/20 transition-all"
                  onClick={onMobileClose}
                >
                  <div className="w-5 h-5 flex-shrink-0 text-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <span className="font-medium white-space-nowrap">Upgrade to Premium</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </aside>
      </TooltipProvider>

      <TooltipProvider>
        <aside
          className={cn(
            'fixed left-0 top-0 z-50 h-screen w-20 bg-card border-r border-border lg:hidden',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <Link href="/dashboard/overview" className="flex items-center justify-center" onClick={onMobileClose}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={onMobileClose}>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </Button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      'flex items-center justify-center px-2 py-2.5 rounded-xl transition-all duration-200',
                      'group relative',
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={item.name}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    {isActive && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 3 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px bg-primary rounded-t-full"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="p-2 border-t border-border">
              <Link
                href="/dashboard/premium"
                className="flex items-center justify-center px-2 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-primary hover:from-primary/20 hover:to-accent/20 transition-all"
                onClick={onMobileClose}
                aria-label="Upgrade to Premium"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </Link>
            </div>
          </div>
        </aside>
      </TooltipProvider>
    </>
  )
}

import { TooltipProvider } from '@/components/ui/tooltip'