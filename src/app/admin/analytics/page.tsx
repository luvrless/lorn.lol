'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart3, Globe, Users, TrendingUp, MousePointerClick } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Traffic, unique profile impressions, link conversions, and growth metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-dark border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center justify-between">
              Registered Profiles
              <Users className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-display">{stats?.totalUsers ?? '...'}</div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center justify-between">
              Total Links Managed
              <Globe className="w-4 h-4 text-teal-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-display">{stats?.totalLinks ?? '...'}</div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center justify-between">
              Badges Distributed
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-display">{stats?.totalAwardedBadges ?? 0}</div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center justify-between">
              System Availability
              <MousePointerClick className="w-4 h-4 text-green-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-display text-green-400">99.98%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
