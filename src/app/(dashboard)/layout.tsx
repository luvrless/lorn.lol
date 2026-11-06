'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const baseNavigation = [
  { name: 'Overview', href: '/dashboard/overview', icon: Home },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Customize', href: '/dashboard/customize', icon: Palette },
  { name: 'Links', href: '/dashboard/links', icon: Link2 },
  { name: 'Pages', href: '/dashboard/pages', icon: Layout },
  { name: 'Widgets', href: '/dashboard/widgets', icon: Boxes },
  { name: 'Media Library', href: '/dashboard/media', icon: Images },
  { name: 'Music', href: '/dashboard/music', icon: Music },
  { name: 'Badges', href: '/dashboard/badges', icon: Award },
  { name: 'Templates', href: '/dashboard/templates', icon: LayoutTemplate },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Plug },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Share', href: '/dashboard/share', icon: Share2 },
  { name: 'Account', href: '/dashboard/account', icon: Settings },
  { name: 'Premium', href: '/dashboard/premium', icon: Crown },
  { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

  const isStaff = ['STAFF', 'ADMIN', 'OWNER', 'MODERATOR'].includes((session?.user as any)?.role || '')

  const navigation = isStaff
    ? [...baseNavigation, { name: 'Admin Panel', href: '/admin/dashboard', icon: Shield }]
    : baseNavigation

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Sidebar
          navigation={navigation}
          pathname={pathname}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Header
            user={session?.user}
            onMenuClick={() => setMobileSidebarOpen(true)}
            onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            theme={theme || 'dark'}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
