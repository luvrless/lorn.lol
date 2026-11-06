'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Save, ExternalLink, Globe, Sparkles, Check, AlertCircle } from 'lucide-react'

export default function ProfileDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    bio: '',
    location: '',
    avatarUrl: '',
    bannerUrl: '',
    showJoinedDate: true,
  })

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setFormData({
            username: data.user.username || '',
            displayName: data.user.displayName || '',
            bio: data.user.bio || '',
            location: data.user.location || '',
            avatarUrl: data.user.avatarUrl || '',
            bannerUrl: data.user.bannerUrl || '',
            showJoinedDate: data.user.showJoinedDate ?? true,
          })
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to update profile')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Profile Details</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Personalize your identity, biography, and public profile presentation.
          </p>
        </div>
        {formData.username && (
          <Button variant="outline" size="sm" asChild>
            <a href={`/${formData.username}`} target="_blank" rel="noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-2" />
              View Public Profile
            </a>
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar & Banner Preview */}
        <Card className="glass-dark border-border/50 overflow-hidden relative">
          <div
            className="h-36 w-full bg-gradient-to-r from-primary/30 via-accent/20 to-primary/40 border-b border-border/50 bg-cover bg-center"
            style={formData.bannerUrl ? { backgroundImage: `url(${formData.bannerUrl})` } : {}}
          />
          <CardContent className="p-6 relative pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-12 gap-4">
              <div className="flex items-end gap-4">
                <Avatar className="w-24 h-24 border-4 border-card rounded-2xl shadow-xl">
                  <AvatarImage src={formData.avatarUrl} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold rounded-2xl">
                    {formData.displayName?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <h2 className="font-bold text-lg">{formData.displayName || formData.username || 'Your Name'}</h2>
                  <p className="text-xs text-muted-foreground font-mono">lorn.lol/{formData.username || 'username'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identity Information */}
        <Card className="glass-dark border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">General Information</CardTitle>
            <CardDescription className="text-xs">
              These details are publicly displayed across your card.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs">Username handle</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">lorn.lol/</span>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                    className="pl-20 font-mono text-sm"
                    placeholder="handle"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-xs">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Public display name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-xs">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell visitors about yourself..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Berlin, Germany"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl" className="text-xs">Avatar Image URL</Label>
                <Input
                  id="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bannerUrl" className="text-xs">Banner Image URL</Label>
              <Input
                id="bannerUrl"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold">Display Registration Date</span>
                <p className="text-[11px] text-muted-foreground">Show your join date badge on your profile card.</p>
              </div>
              <Switch
                checked={formData.showJoinedDate}
                onCheckedChange={(checked) => setFormData({ ...formData, showJoinedDate: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/15 border border-destructive/30 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-xs text-green-500 flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            Profile updated successfully!
          </div>
        )}

        <Button type="submit" disabled={saving || loading} className="w-full sm:w-auto">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
