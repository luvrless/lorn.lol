'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Settings, Shield, Key, Lock, AlertTriangle, Check, User } from 'lucide-react'

export default function AccountDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Account & Security</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your credentials, 2-factor authentication, security keys, and account status.
        </p>
      </div>

      {/* Account Info */}
      <Card className="glass-dark border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-semibold">Security Credentials</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Account Email</Label>
              <Input
                value={user?.email || 'Connected via Discord OAuth'}
                disabled
                className="bg-background/40 font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Account Role</Label>
              <div className="pt-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {user?.role || 'USER'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card className="glass-dark border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <CardTitle className="text-base font-semibold">Two-Factor Authentication (2FA)</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Add an extra layer of defense with an authenticator app (TOTP).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/60">
            <div className="space-y-1">
              <span className="font-semibold text-sm">Two-Factor Protection</span>
              <p className="text-xs text-muted-foreground">
                Require a 6-digit one-time code when signing in.
              </p>
            </div>
            <Switch checked={user?.twoFactorEnabled ?? false} />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="glass-dark border-destructive/30 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <CardTitle className="text-base font-semibold">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Deleting your account will permanently wipe your profile, custom links, and badge history.
          </p>
          <Button variant="destructive" size="sm" className="text-xs">
            Delete My Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
