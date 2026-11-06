'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plug, Check, ExternalLink } from 'lucide-react'

const integrationsList = [
  { name: 'Discord', description: 'Sync profile status, avatar, and server booster badge.', connected: true, badge: 'CONNECTED' },
  { name: 'Spotify', description: 'Display real-time currently listening song and album cover.', connected: false, badge: 'READY' },
  { name: 'Steam', description: 'Show games, in-game hours, and gaming badges.', connected: false, badge: 'READY' },
  { name: 'GitHub', description: 'Display public repositories, stars, and contribution commits.', connected: false, badge: 'READY' },
  { name: 'YouTube', description: 'Embed latest channel videos and subscriber milestone counter.', connected: false, badge: 'READY' },
  { name: 'Twitch', description: 'Broadcast live streaming notifications directly on your card.', connected: false, badge: 'READY' },
]

export default function IntegrationsDashboardPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Platform Integrations</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Link external accounts to sync real-time statuses and live media feeds.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {integrationsList.map((item) => (
          <Card key={item.name} className="glass-dark border-border/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {item.name[0]}
                  </div>
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                </div>
                <Badge
                  variant={item.connected ? 'default' : 'outline'}
                  className="text-[10px] font-mono"
                >
                  {item.badge}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              <div className="pt-1">
                <Button
                  size="sm"
                  variant={item.connected ? 'outline' : 'default'}
                  className="w-full text-xs h-8"
                >
                  {item.connected ? 'Manage Connection' : 'Connect Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
