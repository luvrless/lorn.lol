'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Globe,
  Users,
  MousePointerClick,
  Link2,
  TrendingUp,
  Crown,
  Sparkles,
  Palette,
  Plus,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  BarChart3,
  Clock,
  Bell,
  Star,
  Heart,
  Crown as CrownIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from 'next-auth/react'

const quickActions = [
  { name: 'Edit Profile', href: '/dashboard/profile', icon: Palette, description: 'Update your profile info', iconColor: 'primary' },
  { name: 'Customize Design', href: '/dashboard/customize', icon: Sparkles, description: 'Change colors, fonts, animations', iconColor: 'accent' },
  { name: 'Add Links', href: '/dashboard/links', icon: Link2, description: 'Manage your social links', iconColor: 'blue' },
  { name: 'Upload Media', href: '/dashboard/media', icon: Plus, description: 'Add images, videos, audio', iconColor: 'green' },
  { name: 'View Analytics', href: '/dashboard/analytics', icon: BarChart3, description: 'See your profile stats', iconColor: 'purple' },
  { name: 'Share Profile', href: '/dashboard/share', icon: ExternalLink, description: 'Get your profile URL & QR', iconColor: 'orange' },
]

const recentActivity = [
  { type: 'profile_view', message: 'Profile viewed by visitor from United States', time: '2 minutes ago', icon: Globe, color: 'text-blue-500' },
  { type: 'link_click', message: 'GitHub link clicked 3 times', time: '15 minutes ago', icon: MousePointerClick, color: 'text-green-500' },
  { type: 'badge_earned', message: 'Earned "Early Supporter" badge', time: '1 hour ago', icon: Star, color: 'text-yellow-500' },
  { type: 'profile_view', message: 'Profile viewed by visitor from Germany', time: '2 hours ago', icon: Globe, color: 'text-blue-500' },
  { type: 'music_play', message: 'Track "Midnight Vibes" played', time: '3 hours ago', icon: Heart, color: 'text-pink-500' },
  { type: 'template_applied', message: 'Applied "Neon Dreams" template', time: '5 hours ago', icon: Palette, color: 'text-purple-500' },
]

export default function OverviewPage() {
  const { data: session, status } = useSession()
  const [copied, setCopied] = useState<string | null>(null)

  const profileUrl = session?.user?.username ? `https://lorn.lol/${session.user.username}` : ''

  const copyToClipboard = async () => {
    if (profileUrl) {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(profileUrl)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  if (status === 'loading') {
    return <DashboardSkeleton />
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back, {session?.user?.name || 'User'}</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your profile</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={copyToClipboard} className="gap-2">
            <Copy className="w-4 h-4" />
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Copied!
              </>
            ) : (
              'Copy Profile URL'
            )}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="default">
                <Link href={`/lorn.lol/${session?.user?.username}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open your public profile</TooltipContent>
          </Tooltip>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Profile Views"
          value="12.4K"
          change="+12.5%"
          changeType="positive"
          icon={Globe}
          iconColor="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          title="Unique Visitors"
          value="8.2K"
          change="+8.2%"
          changeType="positive"
          icon={Users}
          iconColor="text-green-500"
          bgColor="bg-green-500/10"
        />
        <StatCard
          title="Link Clicks"
          value="1.8K"
          change="+22.1%"
          changeType="positive"
          icon={MousePointerClick}
          iconColor="text-purple-500"
          bgColor="bg-purple-500/10"
        />
        <StatCard
          title="Click Rate"
          value="14.5%"
          change="+2.3%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-orange-500"
          bgColor="bg-orange-500/10"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Profile Completion
              </CardTitle>
              <Badge variant="outline" className="text-green-500 border-green-500/50 bg-green-500/10">
                85% Complete
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CompletionItem label="Profile Information" value={90} />
                <CompletionItem label="Social Links" value={80} />
                <CompletionItem label="Customization" value={85} />
                <CompletionItem label="Media & Assets" value={70} />
                <CompletionItem label="Widgets & Pages" value={60} />
                <CompletionItem label="Integrations" value={95} />
              </div>
              <Button asChild className="mt-6 w-full sm:w-auto" variant="outline">
                <Link href="/dashboard/profile">
                  Complete Your Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CrownIcon className="w-5 h-5" />
                Account Status
              </CardTitle>
              <Badge variant={session?.user?.role === 'PREMIUM' ? 'default' : 'outline'}>
                {session?.user?.role === 'PREMIUM' ? 'Premium Active' : 'Free Plan'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusItem label="Username" value={session?.user?.username || 'Not set'} icon={Globe} />
              <StatusItem label="Discord Connected" value="Yes" icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 5.991 4.735.078.078 0 0 0 .085-.028c.464-.636.973-1.208 1.514-1.708a13.14 13.14 0 0 0 .035-.775.074.074 0 0 0-.02-.114 13.21 13.21 0 0 1-1.871-6.297.07.07 0 0 1 .015-.086 11.96 11.96 0 0 1 3.855-5.023.077.077 0 0 1 .082.027 11.34 11.34 0 0 1 3.805 1.518.074.074 0 0 0 .085-.028c.486-.69 1.045-1.285 1.658-1.77a19.827 19.827 0 0 0 4.97-1.41.07.07 0 0 0 .025-.105zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419z" /></svg>} iconColor="text-[#5865F2]" />
              <div className="pt-4 border-t border-border">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/premium">Upgrade to Premium</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/5 transition-all group"
                  >
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform', `bg-${action.iconColor || 'primary'}/10`)}>
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{action.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors opacity-0 group-hover:opacity-100" />
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', `bg-${activity.color}/10`)}>
                      <Icon className={cn('w-4 h-4', activity.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function StatCard({ title, value, change, changeType, icon: Icon, iconColor, bgColor }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="font-display text-3xl font-bold mt-1">{value}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className={cn('text-sm font-medium', changeType === 'positive' ? 'text-green-500' : 'text-red-500')}>
                {change}
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </div>
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', bgColor)}>
            <Icon className={cn('w-6 h-6', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CompletionItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
        />
      </div>
    </div>
  )
}

function StatusItem({ label, value, icon: Icon, iconColor }: { label: string; value: string; icon: React.ReactNode | React.ComponentType<{ className?: string }>; iconColor?: string }) {
  const isComponent = typeof Icon === 'function'
  const IconComponent = isComponent ? Icon as React.ComponentType<{ className?: string }> : null
  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', `bg-${iconColor || 'primary'}/10`)}>
        {isComponent && IconComponent ? <IconComponent className="w-5 h-5" /> : Icon as React.ReactNode}
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}><CardContent className="p-6"><Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-32 mt-2" /><Skeleton className="h-3 w-20 mt-4" /></CardContent></Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><Card><CardContent className="p-6 space-y-4">{[1, 2, 3, 4, 5, 6].map((i) => (<div key={i} className="flex justify-between"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-16" /></div>))}<Skeleton className="h-10 w-full mt-6" /></CardContent></Card></div>
        <div><Card><CardContent className="p-6 space-y-4">{[1, 2, 3, 4].map((i) => (<div key={i} className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded" /><div><Skeleton className="h-3 w-20" /><Skeleton className="h-4 w-24" /></div></div>))}<Skeleton className="h-10 w-full mt-4" /></CardContent></Card></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}><CardContent className="p-6 space-y-4"><Skeleton className="h-4 w-24" />{[1, 2, 3, 4].map((j) => (<div key={j} className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded" /><div className="flex-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div></div>))}</CardContent></Card>
        ))}
      </div>
    </div>
  )
}