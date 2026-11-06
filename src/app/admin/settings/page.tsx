'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Settings,
  Crown,
  ShieldAlert,
  Save,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Lock,
  Globe,
} from 'lucide-react'

export default function AdminSettingsPage() {
  const [configs, setConfigs] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null)

  const fetchConfigs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setConfigs(data.configs || {})
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfigs()
  }, [])

  const updateSetting = async (key: string, value: any, description?: string) => {
    try {
      setSavingKey(key)
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, description }),
      })
      if (res.ok) {
        setConfigs((prev) => ({ ...prev, [key]: value }))
        setSavedSuccess(key)
        setTimeout(() => setSavedSuccess(null), 3000)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSavingKey(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">System Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure site-wide policies, monetization toggles, security boundaries, and registrations.
        </p>
      </div>

      {/* Monetization & Free Status */}
      <Card className="glass-dark border-primary/40 bg-gradient-to-r from-primary/5 via-card/50 to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary">
            <Crown className="w-5 h-5" />
            <CardTitle className="text-lg">Monetization & Free Availability</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Toggle between the current promotional free mode and the paid subscription gate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/60">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Free Premium Access for All Users</span>
                <Badge variant={configs.premium_mode_free !== false ? 'default' : 'secondary'} className="text-[10px]">
                  {configs.premium_mode_free !== false ? 'Currently Enabled (Free)' : 'Disabled (Paid Mode)'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, all users enjoy full access to premium badge showcases, video backgrounds, custom shaders, and unlimited links without paying.
              </p>
            </div>
            <Switch
              checked={configs.premium_mode_free !== false}
              onCheckedChange={(checked) =>
                updateSetting('premium_mode_free', checked, 'When true, all premium features are currently free for everyone')
              }
              disabled={savingKey === 'premium_mode_free' || loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Platform Core Controls */}
      <Card className="glass-dark border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Platform Access Controls</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Manage user onboarding and OAuth integrations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/60">
            <div className="space-y-1">
              <span className="font-semibold text-sm">Allow New User Registrations</span>
              <p className="text-xs text-muted-foreground">
                Permit new users to register and claim profile handles on lorn.lol.
              </p>
            </div>
            <Switch
              checked={configs.enable_registration !== false}
              onCheckedChange={(checked) =>
                updateSetting('enable_registration', checked, 'Enable user registration')
              }
              disabled={savingKey === 'enable_registration' || loading}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/60">
            <div className="space-y-1">
              <span className="font-semibold text-sm">Discord OAuth Sign-In</span>
              <p className="text-xs text-muted-foreground">
                Allow logging in and connecting Discord accounts.
              </p>
            </div>
            <Switch
              checked={configs.enable_discord_oauth !== false}
              onCheckedChange={(checked) =>
                updateSetting('enable_discord_oauth', checked, 'Enable Discord OAuth')
              }
              disabled={savingKey === 'enable_discord_oauth' || loading}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/60">
            <div className="space-y-1">
              <span className="font-semibold text-sm">Maintenance Mode</span>
              <p className="text-xs text-muted-foreground">
                Show maintenance screen to all non-staff visitors.
              </p>
            </div>
            <Switch
              checked={configs.maintenance_mode === true}
              onCheckedChange={(checked) =>
                updateSetting('maintenance_mode', checked, 'Enable maintenance mode')
              }
              disabled={savingKey === 'maintenance_mode' || loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Brand & Identity */}
      <Card className="glass-dark border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Site Identity & Metadata</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_name" className="text-xs">Site Title</Label>
              <div className="flex gap-2">
                <Input
                  id="site_name"
                  defaultValue={configs.site_name || 'LORN.LOL'}
                  onBlur={(e) => updateSetting('site_name', e.target.value, 'Site name')}
                  className="bg-background/50 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="site_description" className="text-xs">Site Tagline</Label>
              <div className="flex gap-2">
                <Input
                  id="site_description"
                  defaultValue={configs.site_description || 'Your Digital Identity'}
                  onBlur={(e) => updateSetting('site_description', e.target.value, 'Site description')}
                  className="bg-background/50 text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
