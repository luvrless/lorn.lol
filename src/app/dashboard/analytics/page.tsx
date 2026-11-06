'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, Users, MousePointerClick, Globe, TrendingUp } from 'lucide-react'

export default function AnalyticsDashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfile(data.profile)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Profile Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor traffic flow, unique visitors, link click conversions, and engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-dark border-border/50">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
              Total Page Impressions
              <Eye className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold font-display">{profile?.viewCount || '0'}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Lifetime views on your card</p>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
              Unique Visitors
              <Users className="w-4 h-4 text-teal-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold font-display">{profile?.uniqueVisitors || '0'}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Distinct IP addresses recorded</p>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center justify-between">
              Social Link Clicks
              <MousePointerClick className="w-4 h-4 text-amber-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold font-display">{profile?.linkClicks || '0'}</div>
            <p className="text-[11px] text-muted-foreground mt-1">Total button redirections</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Traffic Trends</CardTitle>
          <CardDescription className="text-xs">Visitor activity across recent days</CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center border-t border-border/30">
          <div className="text-center space-y-2">
            <TrendingUp className="w-8 h-8 text-primary/40 mx-auto" />
            <p className="text-xs text-muted-foreground">Real-time telemetry logging active</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
