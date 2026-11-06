'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LayoutTemplate, Sparkles, Check } from 'lucide-react'

const sampleTemplates = [
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'Dark cyber aesthetic with radiant purple glow and animated grid shader.',
    category: 'Cyber',
    colors: ['#A855F7', '#EC4899', '#06B6D4'],
  },
  {
    id: 'minimal-noir',
    name: 'Minimal Noir',
    description: 'Ultra-clean monochromatic glassmorphism with subtle grain overlay.',
    category: 'Minimal',
    colors: ['#000000', '#27272A', '#FAFAFA'],
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    description: 'Flowing northern lights shader with emerald and indigo spectrums.',
    category: 'VFX',
    colors: ['#10B981', '#06B6D4', '#6366F1'],
  },
  {
    id: 'sunset-liquid',
    name: 'Sunset Liquid',
    description: 'Fluid simulation with warm amber, rose, and violet chromatic dispersion.',
    category: 'Liquid',
    colors: ['#F59E0B', '#EF4444', '#8B5CF6'],
  },
]

export default function TemplatesDashboardPage() {
  const [appliedId, setAppliedId] = useState<string | null>(null)

  const handleApply = (id: string) => {
    setAppliedId(id)
    setTimeout(() => setAppliedId(null), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tight">Theme Templates</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Instantly apply curated color schemes, background shaders, and typography.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sampleTemplates.map((tmpl) => (
          <Card key={tmpl.id} className="glass-dark border-border/50 hover:border-border transition-all overflow-hidden">
            <div
              className="h-28 w-full p-4 flex items-end justify-between"
              style={{
                background: `linear-gradient(135deg, ${tmpl.colors[0]}, ${tmpl.colors[1]}, ${tmpl.colors[2]})`,
              }}
            >
              <Badge className="bg-black/60 backdrop-blur-md text-white text-[10px] border-none font-mono">
                {tmpl.category}
              </Badge>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-sm">{tmpl.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{tmpl.description}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-1.5">
                  {tmpl.colors.map((c, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <Button
                  size="sm"
                  variant={appliedId === tmpl.id ? 'default' : 'outline'}
                  className="text-xs h-8"
                  onClick={() => handleApply(tmpl.id)}
                >
                  {appliedId === tmpl.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-green-400" />
                      Applied!
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      Apply Preset
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
