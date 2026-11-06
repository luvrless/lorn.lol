'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ShieldAlert,
  Users,
  Award,
  Calendar,
  DollarSign,
  Flag,
  BarChart3,
  UserCheck,
  ShieldCheck,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LayoutDashboard,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface AdminLayoutClientProps {
  user: any
  children: React.ReactNode
}

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Badge Manager', href: '/admin/badges', icon: Award },
  { name: 'Events & 1K', href: '/admin/events', icon: Calendar },
  { name: 'Monetization & Free Mode', href: '/admin/monetization', icon: DollarSign },
  { name: 'Moderation Queue', href: '/admin/moderation', icon: Flag },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Staff Management', href: '/admin/staff', icon: UserCheck },
  { name: 'Security & Audit', href: '/admin/security', icon: ShieldCheck },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-card/60 backdrop-blur-xl fixed inset-y-0 z-40">
        <div className="p-5 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide font-display">STAFF PORTAL</h2>
              <p className="text-xs text-muted-foreground font-mono">lorn.lol v1.0</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono border-destructive/40 text-destructive bg-destructive/10">
            {user?.role || 'STAFF'}
          </Badge>
        </div>

        <div className="px-3 py-2 border-b border-border/30">
          <Link
            href="/dashboard/overview"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to User Dashboard
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-destructive/15 text-destructive border border-destructive/30 font-semibold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/50 flex items-center gap-3 bg-muted/20">
          <Avatar className="h-9 w-9 border border-border/60">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback className="bg-destructive/20 text-destructive text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{user?.name || 'Staff'}</p>
            <p className="text-[11px] text-muted-foreground truncate">@{user?.username || 'admin'}</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-destructive" />
          <span className="font-bold text-sm">Staff Portal</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm pt-16" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-card border-r border-border p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            <Link
              href="/dashboard/overview"
              className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-xs font-medium text-muted-foreground bg-accent/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to User Dashboard
            </Link>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium',
                    isActive ? 'bg-destructive/15 text-destructive font-semibold' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
