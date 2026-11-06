'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Lock, Activity, Key } from 'lucide-react'

export default function AdminSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Security & Audit Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review authentication security events, rate limit anomalies, and administrative actions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-dark border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-green-500" />
              Auth Defense
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold font-mono text-green-400">ACTIVE</div>
            <p className="text-[11px] text-muted-foreground mt-1">NextAuth JWT encrypted sessions</p>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              Rate Limiting
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold font-mono text-blue-400">ENFORCED</div>
            <p className="text-[11px] text-muted-foreground mt-1">IP-based sliding window rate limiter</p>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              Bot API Token Gate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold font-mono text-amber-400">ONLINE</div>
            <p className="text-[11px] text-muted-foreground mt-1">Bearer token Discord bot authentication</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
