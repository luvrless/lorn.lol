'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Sparkles, Calendar, Award, CheckCircle2, AlertCircle } from 'lucide-react'

export default function AdminEventsPage() {
  const [milestoneActive, setMilestoneActive] = useState(false)
  const [triggering, setTriggering] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const trigger1KMilestone = async () => {
    try {
      setTriggering(true)
      setMessage(null)
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'milestone_1k_achieved',
          value: true,
          description: '1K Registered Users Milestone Triggered',
        }),
      })
      if (res.ok) {
        setMilestoneActive(true)
        setMessage('1K Milestone achieved! "The 1K" celebration badge is now unlocked for eligible community members.')
      }
    } catch (e: any) {
      setMessage(`Error: ${e.message}`)
    } finally {
      setTriggering(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Events & Milestones</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage platform milestones (including The 1K user celebration) and seasonal sales events.
        </p>
      </div>

      {/* The 1K Milestone Card */}
      <Card className="glass-dark border-teal-500/40 bg-teal-500/5 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center p-2">
                <img src="/badges/the-1k.svg" alt="The 1K" className="w-full h-full object-contain" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  The 1K Users Celebration Event
                  <Badge variant="outline" className="text-teal-400 border-teal-500/30 bg-teal-500/10 text-[10px]">
                    1,000 MILESTONE
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Replaces guns.lol &quot;The Million&quot; with lorn.lol&apos;s custom &quot;The 1K&quot; community badge.
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={trigger1KMilestone}
              disabled={triggering || milestoneActive}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {milestoneActive ? 'Milestone Active' : 'Trigger 1K Release'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-300">
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seasonal Events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-dark border-border/50">
          <CardHeader className="p-4">
            <div className="flex items-center gap-2">
              <img src="/badges/summer-2026.svg" alt="Summer" className="w-6 h-6" />
              <CardTitle className="text-sm">Summer 2026 Event</CardTitle>
            </div>
            <CardDescription className="text-xs">Seasonal badge and exclusive summer theme unlocks.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge variant="outline" className="text-[10px]">Upcoming</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="p-4">
            <div className="flex items-center gap-2">
              <img src="/badges/easter-2026.svg" alt="Easter" className="w-6 h-6" />
              <CardTitle className="text-sm">Easter 2026 Event</CardTitle>
            </div>
            <CardDescription className="text-xs">Easter sale and exclusive rabbit badge distribution.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge variant="outline" className="text-[10px]">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-border/50">
          <CardHeader className="p-4">
            <div className="flex items-center gap-2">
              <img src="/badges/christmas-2025.svg" alt="Winter" className="w-6 h-6" />
              <CardTitle className="text-sm">Christmas 2025 Event</CardTitle>
            </div>
            <CardDescription className="text-xs">Snowfall background shader and snowflake badge.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status</span>
              <Badge variant="outline" className="text-[10px]">Archived</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
