'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Boxes, Plus, Sparkles, Check, Trash2, Globe, Music, Gamepad2, MessageSquare } from 'lucide-react'

const availableWidgets = [
  { type: 'DISCORD', title: 'Discord Presence', description: 'Show your live online status, avatar, and custom status message.', icon: MessageSquare },
  { type: 'SPOTIFY', title: 'Spotify Now Playing', description: 'Broadcast the song and album art you are currently playing.', icon: Music },
  { type: 'STEAM', title: 'Steam Activity', description: 'Display recent games played, hours, and steam level.', icon: Gamepad2 },
  { type: 'CUSTOM_TEXT', title: 'Custom Rich Text Block', description: 'Insert markdown, quotes, hardware specs, or announcements.', icon: Globe },
]

export default function WidgetsDashboardPage() {
  const [widgets, setWidgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWidgets = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/widgets')
      if (res.ok) {
        const data = await res.json()
        setWidgets(data.widgets || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWidgets()
  }, [])

  const handleAddWidget = async (type: string, title: string) => {
    try {
      const res = await fetch('/api/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          config: {},
          isEnabled: true,
          isVisible: true,
        }),
      })
      if (res.ok) {
        fetchWidgets()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteWidget = async (id: string) => {
    try {
      const res = await fetch(`/api/widgets/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setWidgets((prev) => prev.filter((w) => w.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Profile Widgets</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Attach real-time gaming feeds, Spotify music players, and rich text cards.
        </p>
      </div>

      {/* Available widgets to add */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Available Widgets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableWidgets.map((w) => {
            const Icon = w.icon
            return (
              <Card key={w.type} className="glass-dark border-border/50 hover:border-border transition-colors">
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{w.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{w.description}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 flex-shrink-0"
                    onClick={() => handleAddWidget(w.type, w.title)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Active widgets */}
      <Card className="glass-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Active Widgets on Profile ({widgets.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {widgets.map((widget) => (
            <div key={widget.id} className="p-3.5 rounded-xl bg-background/50 border border-border/40 flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm">{widget.title || widget.type}</span>
                <p className="text-[11px] text-muted-foreground font-mono">Type: {widget.type}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteWidget(widget.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {widgets.length === 0 && !loading && (
            <p className="text-xs text-muted-foreground text-center py-6">
              No widgets added to your card yet. Select from the options above!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
