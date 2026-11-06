'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import {
  Menu,
  Globe,
  LogOut,
  User,
  Settings,
  ExternalLink,
  Copy,
  Check,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  user: any
  onMenuClick: () => void
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const { data: session } = useSession()
  const [copied, setCopied] = useState(false)

  const currentUser = (user || session?.user) as any
  const username = currentUser?.username || 'user'
  const isStaff = ['STAFF', 'ADMIN', 'OWNER', 'MODERATOR'].includes(currentUser?.role || '')
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

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#08080b]/80 backdrop-blur-xl border-b border-zinc-800/60 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-500 hidden sm:inline">dashboard</span>
          <span className="text-zinc-600 hidden sm:inline">/</span>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-zinc-300 hover:text-purple-400 transition-colors bg-zinc-900/60 border border-zinc-800/80 px-2.5 py-1 rounded-md"
          >
            <span className="text-zinc-500">lorn.lol/</span>
            <span className="text-white font-medium">{username}</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* Right: Quick Actions (guns.lol style) */}
      <div className="flex items-center gap-2">
        <button
          onClick={copyUrl}
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/80 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 border border-purple-500/30 transition-all shadow-sm"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Live Profile</span>
        </a>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative p-1 rounded-full hover:bg-zinc-800/60 ml-1"
            >
              <Avatar className="w-8 h-8 ring-1 ring-zinc-700/60">
                <AvatarImage src={currentUser?.image || ''} alt={username} />
                <AvatarFallback className="bg-purple-950 text-purple-200 text-xs font-bold">
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#0e0e13] border-zinc-800 text-zinc-200">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-white leading-none">
                  {currentUser?.name || username}
                </p>
                <p className="text-xs leading-none text-zinc-400 font-mono">
                  @{username}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="cursor-pointer hover:bg-zinc-800/80">
                <User className="w-4 h-4 mr-2 text-zinc-400" />
                Profile Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/customize" className="cursor-pointer hover:bg-zinc-800/80">
                <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                Appearance
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/account" className="cursor-pointer hover:bg-zinc-800/80">
                <Settings className="w-4 h-4 mr-2 text-zinc-400" />
                Account
              </Link>
            </DropdownMenuItem>
            {isStaff && (
              <>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard" className="cursor-pointer hover:bg-zinc-800/80 text-amber-300">
                    <Shield className="w-4 h-4 mr-2 text-amber-400" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem
              className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => signOut({ callbackUrl: '/signin' })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
