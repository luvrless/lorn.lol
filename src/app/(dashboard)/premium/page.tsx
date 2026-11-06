'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Sparkles, Check, Zap, Shield, Star, Flame, Eye } from 'lucide-react'

const premiumFeatures = [
  { name: '4K Video Backgrounds', description: 'Upload and embed dynamic loop videos with custom audio.' },
  { name: 'Interactive WebGL Shaders', description: 'Real-time raymarching, liquid, aurora, and galaxy shaders.' },
  { name: 'Exclusive Badge Showcase', description: 'Access to special collector and animated profile badges.' },
  { name: 'Animated Avatar & Card Glows', description: 'Multi-color radiant border glow effects and particles.' },
  { name: 'Unlimited Social Links', description: 'No caps on how many links or buttons you can display.' },
  { name: 'Custom Background Music & Synced Lyrics', description: 'Auto-playing track with synchronized karaoke lyric feeds.' },
  { name: 'Detailed Visitor Analytics', description: 'Country maps, referrers, unique visitors, and click heatmaps.' },
  { name: 'Priority Global CDN Edge Delivery', description: 'Ultra-fast sub-millisecond asset rendering.' },
]

export default function PremiumDashboardPage() {
  const [isFreeMode, setIsFreeMode] = useState(true)

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Launch Banner */}
      <Card className="glass-dark border-primary/50 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/20 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-15 pointer-events-none">
          <Crown className="w-48 h-48 text-primary" />
        </div>
        <CardContent className="p-8 relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 flex items-center gap-1.5 shadow-glow">
              <Sparkles className="w-3.5 h-3.5" />
              SPECIAL LAUNCH ACCESS
            </Badge>
            <Badge variant="outline" className="border-teal-400 text-teal-400 bg-teal-400/10 text-xs">
              100% FREE FOR ALL USERS
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            All Premium Features Are Currently Free!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            During our initial public rollout, all premium upgrades, video backgrounds, animated shaders,
            and custom styling controls are unlocked for every registered member at no cost.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow">
              <Link href="/dashboard/customize">
                <Sparkles className="w-4 h-4 mr-2" />
                Customize With Free Premium
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border/60">
              <Link href="/dashboard/badges">
                Explore Badges
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Breakdown Grid */}
      <div>
        <h2 className="text-xl font-bold font-display tracking-tight mb-4">Included Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {premiumFeatures.map((feat, i) => (
            <Card key={i} className="glass-dark border-border/50 hover:border-primary/40 transition-colors">
              <CardContent className="p-5 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                  <Check className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm">{feat.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
