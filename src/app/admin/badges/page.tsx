'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Award, Plus, Sparkles, Check, RefreshCw, Search } from 'lucide-react'

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBadge, setSelectedBadge] = useState<any>(null)
  const [userIdInput, setUserIdInput] = useState('')
  const [reasonInput, setReasonInput] = useState('')
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignStatus, setAssignStatus] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  const fetchBadges = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/badges')
      if (res.ok) {
        const data = await res.json()
        setBadges(data.badges || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBadges()
  }, [])

  const handleAwardBadge = async () => {
    if (!selectedBadge || !userIdInput) return
    try {
      setAssignLoading(true)
      setAssignStatus(null)
      const res = await fetch('/api/admin/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          badgeId: selectedBadge.id,
          userId: userIdInput.trim(),
          reason: reasonInput.trim() || 'Awarded by staff administrator',
        }),
      })
      if (res.ok) {
        setAssignStatus('Badge successfully awarded!')
        setUserIdInput('')
        setReasonInput('')
        fetchBadges()
      } else {
        const err = await res.json()
        setAssignStatus(`Error: ${err.error || 'Failed to award'}`)
      }
    } catch (e: any) {
      setAssignStatus(`Error: ${e.message}`)
    } finally {
      setAssignLoading(false)
    }
  }

  const filteredBadges = badges.filter(
    (b) =>
      b.name.toLowerCase().includes(filter.toLowerCase()) ||
      b.slug.toLowerCase().includes(filter.toLowerCase()) ||
      b.category.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Badge Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Displaying all 26 SVG badges with accurate guns.lol style coloring and 1K milestone.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchBadges} disabled={loading}>
          <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filter badges by name or category..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="pl-9 bg-background/50 text-sm"
        />
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => (
          <Card
            key={badge.id}
            className="glass-dark border-border/50 hover:border-border transition-all duration-200 overflow-hidden group"
          >
            <CardContent className="p-4 flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 flex-shrink-0 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: `${badge.color || '#A855F7'}15`,
                  border: `1px solid ${badge.color || '#A855F7'}30`,
                }}
              >
                <img
                  src={badge.iconUrl}
                  alt={badge.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm truncate">{badge.name}</h3>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {badge.rarity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {badge.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {badge._count?.owners ?? 0} owners
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs hover:bg-primary/10 hover:text-primary"
                        onClick={() => {
                          setSelectedBadge(badge)
                          setAssignStatus(null)
                        }}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Award
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-dark border-border/50">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-primary" />
                          Award &quot;{badge.name}&quot; Badge
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                          <img src={badge.iconUrl} alt={badge.name} className="w-8 h-8" />
                          <div>
                            <p className="text-xs font-semibold">{badge.name}</p>
                            <p className="text-[11px] text-muted-foreground">{badge.description}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium">User ID or Username</label>
                          <Input
                            placeholder="Enter User ID (e.g. clxxx...)"
                            value={userIdInput}
                            onChange={(e) => setUserIdInput(e.target.value)}
                            className="text-xs"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-medium">Reason (optional)</label>
                          <Input
                            placeholder="Awarded for community contribution"
                            value={reasonInput}
                            onChange={(e) => setReasonInput(e.target.value)}
                            className="text-xs"
                          />
                        </div>

                        {assignStatus && (
                          <div className={cn(
                            'p-2.5 rounded-lg text-xs font-medium',
                            assignStatus.startsWith('Error')
                              ? 'bg-destructive/15 text-destructive border border-destructive/30'
                              : 'bg-green-500/15 text-green-500 border border-green-500/30'
                          )}>
                            {assignStatus}
                          </div>
                        )}

                        <Button
                          onClick={handleAwardBadge}
                          disabled={assignLoading || !userIdInput}
                          className="w-full text-xs"
                        >
                          {assignLoading ? 'Granting...' : 'Confirm Award'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
import { cn } from '@/lib/utils'
