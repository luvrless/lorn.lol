'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Link2, Plus, Trash2, ExternalLink, Star, RefreshCw, Check, Globe } from 'lucide-react'

const PLATFORMS = [
  'Discord',
  'Spotify',
  'GitHub',
  'YouTube',
  'Twitch',
  'Twitter / X',
  'Instagram',
  'TikTok',
  'Roblox',
  'Steam',
  'Telegram',
  'Custom Link',
]

export default function LinksDashboardPage() {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    platform: 'Discord',
    label: '',
    url: '',
    isFeatured: false,
    visibility: 'VISIBLE' as const,
  })

  const fetchLinks = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/links')
      if (res.ok) {
        const data = await res.json()
        setLinks(data.links || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setModalOpen(false)
        setFormData({ platform: 'Discord', label: '', url: '', isFeatured: false, visibility: 'VISIBLE' })
        fetchLinks()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to add link')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Social Links</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Showcase your platforms, channels, and websites on your profile.
          </p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-dark border-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                Add New Link
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs">Platform</Label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background/50 text-xs text-foreground"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Button Label</Label>
                <Input
                  placeholder="e.g. Join my Discord / My GitHub"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Destination URL</Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                />
                <Label htmlFor="featured" className="text-xs font-normal cursor-pointer">
                  Feature this link (highlights with special glow border)
                </Label>
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button type="submit" disabled={creating} className="w-full">
                {creating ? 'Adding Link...' : 'Save Link'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Links List */}
      <Card className="glass-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Active Profile Links ({links.length})</CardTitle>
          <CardDescription className="text-xs">
            Links appear in the order shown below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-background/50 border border-border/40 hover:border-border transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{link.label}</span>
                    {link.isFeatured && (
                      <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-400/30 bg-amber-400/10">
                        <Star className="w-2.5 h-2.5 mr-1 fill-amber-400" />
                        Featured
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground font-mono">[{link.platform}]</span>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5"
                  >
                    <span className="truncate max-w-sm">{link.url}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground pr-2">
                  {link.clicks ?? 0} clicks
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(link.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {links.length === 0 && !loading && (
            <div className="text-center py-10 space-y-3">
              <Globe className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="text-xs text-muted-foreground">You haven&apos;t added any links yet.</p>
              <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                Add your first link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
