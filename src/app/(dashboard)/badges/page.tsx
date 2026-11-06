'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Sparkles, CheckCircle2, Lock, Shield } from 'lucide-react'

export default function BadgesDashboardPage() {
  const [allBadges, setAllBadges] = useState<any[]>([])
  const [userBadgeIds, setUserBadgeIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/badges').then((r) => r.json()).catch(() => ({ badges: [] })),
      fetch('/api/user/me').then((r) => r.json()).catch(() => ({})),
    ])
      .then(([badgesData, userData]) => {
        setAllBadges(badgesData.badges || [])
        // If user has badges
        if (userData.user?.badges) {
          setUserBadgeIds(new Set(userData.user.badges.map((b: any) => b.badgeId)))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Profile Badges</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Collect achievements, event commemorations, and staff insignia to display on your digital card.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBadges.map((badge) => {
          const isOwned = userBadgeIds.has(badge.id)
          return (
            <Card
              key={badge.id}
              className="glass-dark border-border/50 hover:border-border transition-all duration-200 overflow-hidden relative group"
            >
              <CardContent className="p-4 flex items-start gap-3.5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center p-2 flex-shrink-0 relative"
                  style={{
                    backgroundColor: `${badge.color || '#A855F7'}15`,
                    border: `1px solid ${badge.color || '#A855F7'}35`,
                  }}
                >
                  <img
                    src={badge.iconUrl}
                    alt={badge.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <h3 className="font-semibold text-sm truncate">{badge.name}</h3>
                    <Badge variant="outline" className="text-[9px] font-mono px-1.5 py-0">
                      {badge.rarity}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {badge.description}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px]">
                    {isOwned ? (
                      <span className="text-green-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {badge.requirement || 'Special Event'}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
