'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Crown, DollarSign, Check, ShieldCheck, Zap } from 'lucide-react'

export default function AdminMonetizationPage() {
  const [premiumFreeMode, setPremiumFreeMode] = useState(true)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.configs?.premium_mode_free !== undefined) {
          setPremiumFreeMode(data.configs.premium_mode_free)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async (val: boolean) => {
    try {
      setUpdating(true)
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'premium_mode_free',
          value: val,
          description: 'When true, all premium features are currently free for everyone',
        }),
      })
      if (res.ok) {
        setPremiumFreeMode(val)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Monetization & Premium</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage platform pricing tiers, Stripe subscription locks, and free promotional access.
        </p>
      </div>

      <Card className="glass-dark border-primary/40 bg-gradient-to-br from-primary/10 via-card/50 to-accent/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Global Free Access Mode</CardTitle>
                <CardDescription className="text-xs">
                  Controls whether premium features are free for all users or require paid checkout.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-background/60 p-3 rounded-xl border border-border/60">
              <span className="text-xs font-semibold">
                {premiumFreeMode ? 'Free Access Active' : 'Paid Enforced'}
              </span>
              <Switch
                checked={premiumFreeMode}
                onCheckedChange={handleToggle}
                disabled={loading || updating}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="p-4 rounded-xl bg-background/40 border border-border/40 text-xs text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">Current Operational State:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>Free Mode (Default):</strong> Users can use premium video backgrounds, custom WebGL shaders, animated avatar borders, unlimited links, and custom fonts for free.
              </li>
              <li>
                <strong>Paid Mode:</strong> The dashboard displays upgrade buttons and users must purchase a subscription to enable premium perks.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
