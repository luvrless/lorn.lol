'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Users,
  Award,
  Link2,
  AlertTriangle,
  Crown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  RefreshCw,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updatingPremium, setUpdatingPremium] = useState(false)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const togglePremiumFreeMode = async (enabled: boolean) => {
    setUpdatingPremium(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'premium_mode_free',
          value: enabled,
          description: 'When true, all premium features are currently free for everyone',
        }),
      })
      if (res.ok) {
        setStats((prev: any) => ({ ...prev, premiumModeFree: enabled }))
      }
    } catch (e) {
      console.error(e)
    } finally {
      setUpdatingPremium(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Staff Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            System health, active user counts, and platform configuration controls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/admin/users">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Link>
          </Button>
        </div>
      </div>

      {/* Global Notice: Free Mode */}
      <Card className="border-primary/30 bg-primary/5 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Crown className="w-32 h-32 text-primary" />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-base">Platform Premium Availability Mode</h3>
                <Badge variant={stats?.premiumModeFree ? 'default' : 'secondary'} className="text-xs">
                  {stats?.premiumModeFree ? 'FREE FOR ALL USERS' : 'PAID ONLY (ENFORCED)'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground max-w-xl">
                Currently, premium features are set to <strong>{stats?.premiumModeFree ? 'Free for everyone' : 'Paid'}</strong>.
                When Free Mode is active, all badges, customizations, and widgets are accessible without an active Stripe subscription.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-background/50 p-3 rounded-xl border border-border/60">
              <span className="text-xs font-medium">Free Mode</span>
              <Switch
                checked={stats?.premiumModeFree ?? true}
                onCheckedChange={togglePremiumFreeMode}
                disabled={updatingPremium || loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-dark border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Registered Users</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{stats?.totalUsers ?? '...'}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Platform profiles</p>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Active Badges</CardTitle>
            <Award className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{stats?.totalBadges ?? 26}</div>
            <p className="text-[11px] text-muted-foreground mt-1">{stats?.totalAwardedBadges ?? 0} total granted</p>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Created Social Links</CardTitle>
            <Link2 className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{stats?.totalLinks ?? 0}</div>
            <p className="text-[11px] text-muted-foreground mt-1">User link items</p>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Pending Moderation</CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{stats?.pendingReports ?? 0}</div>
            <p className="text-[11px] text-muted-foreground mt-1">User reports in queue</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users and Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-dark border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Recent Registrations</CardTitle>
              <CardDescription className="text-xs">Latest users joined on lorn.lol</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users" className="text-xs">
                View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.recentUsers?.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                    {u.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">@{u.username}</p>
                    <p className="text-[11px] text-muted-foreground">{u.email || 'No email'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {u.role}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
                    <Link href={`/${u.username}`} target="_blank">
                      Profile
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            {!stats?.recentUsers?.length && (
              <p className="text-xs text-muted-foreground text-center py-4">No recent users found.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="glass-dark border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-bold">Quick Administrative Tools</CardTitle>
            <CardDescription className="text-xs">Frequently accessed actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Button variant="outline" asChild className="w-full justify-start text-xs h-10 border-border/60">
              <Link href="/admin/badges">
                <Award className="w-4 h-4 mr-2.5 text-amber-500" />
                Award / Revoke Badges
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start text-xs h-10 border-border/60">
              <Link href="/admin/events">
                <Sparkles className="w-4 h-4 mr-2.5 text-teal-400" />
                Trigger 1K Milestone Badge
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start text-xs h-10 border-border/60">
              <Link href="/admin/settings">
                <Shield className="w-4 h-4 mr-2.5 text-primary" />
                Configure Platform Features
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start text-xs h-10 border-border/60">
              <Link href="/admin/security">
                <Clock className="w-4 h-4 mr-2.5 text-purple-400" />
                Audit Logs & Security History
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { cn } from '@/lib/utils'
