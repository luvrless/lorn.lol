'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Home,
  User,
  Palette,
  Link2,
  Layout,
  Boxes,
  Images,
  Music,
  Award,
  LayoutTemplate,
  Plug,
  BarChart3,
  Share2,
  Settings,
  Crown,
  HelpCircle,
  Shield,
  ExternalLink,
  Copy,
  Check,
  LogOut,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavSection {
  title: string
  items: NavItem[]
}

interface SidebarProps {
  pathname: string
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ pathname, mobileOpen, onMobileClose }: SidebarProps) {
  const { data: session } = useSession()
  const [copied, setCopied] = useState(false)

  const user = session?.user as any
  const username = user?.username || 'user'
  const isStaff = ['STAFF', 'ADMIN', 'OWNER', 'MODERATOR'].includes(user?.role || '')

  const profileUrl = `https://lorn.lol/${username}`

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const sections: NavSection[] = [
    {
      title: 'GENERAL',
      items: [
        { name: 'Overview', href: '/dashboard/overview', icon: Home },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
        { name: 'Appearance', href: '/dashboard/customize', icon: Palette },
        { name: 'Links', href: '/dashboard/links', icon: Link2 },
      ],
    },
    {
      title: 'CONTENT',
      items: [
        { name: 'Pages', href: '/dashboard/pages', icon: Layout },
        { name: 'Widgets', href: '/dashboard/widgets', icon: Boxes },
        { name: 'Media Library', href: '/dashboard/media', icon: Images },
        { name: 'Audio & Music', href: '/dashboard/music', icon: Music },
        { name: 'Badges', href: '/dashboard/badges', icon: Award },
      ],
    },
    {
      title: 'GROWTH',
      items: [
        { name: 'Templates', href: '/dashboard/templates', icon: LayoutTemplate },
        { name: 'Integrations', href: '/dashboard/integrations', icon: Plug },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Share Profile', href: '/dashboard/share', icon: Share2 },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { name: 'Account', href: '/dashboard/account', icon: Settings },
        { name: 'Premium', href: '/dashboard/premium', icon: Crown },
        { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
        ...(isStaff ? [{ name: 'Admin Panel', href: '/admin/dashboard', icon: Shield }] : []),
      ],
    },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0a0d] border-r border-zinc-800/70 select-none text-zinc-300">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-800/70 flex items-center justify-between">
        <Link href="/dashboard/overview" className="flex items-center gap-2.5 group" onClick={onMobileClose}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-[1px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#0d0d12] rounded-[7px] flex items-center justify-center font-bold text-white text-sm">
              L
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-wide text-white group-hover:text-purple-400 transition-colors">
              lorn.lol
            </span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium">Dashboard</span>
          </div>
        </Link>
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Mini Profile & Quick URL (guns.lol style) */}
      <div className="p-3 mx-3 my-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-8 h-8 ring-1 ring-zinc-700/60">
            <AvatarImage src={user?.image || ''} alt={username} />
            <AvatarFallback className="bg-purple-950 text-purple-200 text-xs font-semibold">
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white truncate">{user?.name || username}</span>
              {user?.role === 'OWNER' && (
                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  OWNER
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 truncate font-mono">lorn.lol/{username}</p>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-zinc-800/50 flex items-center gap-1.5">
          <button
            onClick={copyUrl}
            className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[11px] font-medium bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span>Copy URL</span>
              </>
            )}
          </button>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Open Public Profile"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/dashboard/overview' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150',
                    isActive
                      ? 'bg-zinc-800/90 text-white shadow-sm border border-zinc-700/60 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 flex-shrink-0 transition-colors',
                      isActive ? 'text-purple-400' : 'text-zinc-400 group-hover:text-zinc-200'
                    )}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer User Pill */}
      <div className="p-3 border-t border-zinc-800/70 bg-[#08080a]">
        <button
          onClick={() => signOut({ callbackUrl: '/signin' })}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-600">v1.0</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <aside className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
