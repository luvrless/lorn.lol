'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#070709] text-zinc-100 flex">
        {/* Sidebar */}
        <Sidebar
          pathname={pathname}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area (guns.lol dashboard padding & layout) */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
          <Header
            user={session?.user}
            onMenuClick={() => setMobileSidebarOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
