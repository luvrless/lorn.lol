'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Palette, Monitor, Music, MousePointer, Eye, Save, Check } from 'lucide-react'

export default function CustomizeDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const [backgroundConfig, setBackgroundConfig] = useState({
    type: 'GRADIENT',
    imageUrl: '',
    videoUrl: '',
    blur: 0,
    brightness: 1,
    opacity: 1,
    overlayColor: '#000000',
    overlayOpacity: 0.4,
  })

  const [cardConfig, setCardConfig] = useState({
    layout: 'centered',
    opacity: 0.85,
    backgroundBlur: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff1a',
  })

  const [textConfig, setTextConfig] = useState({
    fontFamily: 'Inter',
    primaryColor: '#ffffff',
    secondaryColor: '#a1a1aa',
    glowColor: '#a855f7',
    glowIntensity: 0,
  })

  const [cursorConfig, setCursorConfig] = useState({
    type: 'default',
    color: '#a855f7',
    trail: false,
  })

  const [enterScreenConfig, setEnterScreenConfig] = useState({
    enabled: true,
    title: 'click to enter',
    textColor: '#ffffff',
    soundVolume: 0.5,
  })

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          if (data.profile.backgroundConfig) setBackgroundConfig((prev) => ({ ...prev, ...data.profile.backgroundConfig }))
          if (data.profile.cardConfig) setCardConfig((prev) => ({ ...prev, ...data.profile.cardConfig }))
          if (data.profile.textConfig) setTextConfig((prev) => ({ ...prev, ...data.profile.textConfig }))
          if (data.profile.cursorConfig) setCursorConfig((prev) => ({ ...prev, ...data.profile.cursorConfig }))
          if (data.profile.enterScreenConfig) setEnterScreenConfig((prev) => ({ ...prev, ...data.profile.enterScreenConfig }))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handlePublish = async () => {
    try {
      setSaving(true)
      setSuccess(false)
      const res = await fetch('/api/profile/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backgroundConfig,
          cardConfig,
          textConfig,
          cursorConfig,
          enterScreenConfig,
        }),
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Customization Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build your unique visual experience with shader effects, typography, and card geometry.
          </p>
        </div>
        <Button onClick={handlePublish} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Publishing...' : 'Publish Design'}
        </Button>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-xs text-green-500 flex items-center gap-2">
          <Check className="w-4 h-4" />
          Design successfully published to your live profile!
        </div>
      )}

      <Tabs defaultValue="background" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full">
          <TabsTrigger value="background">Background</TabsTrigger>
          <TabsTrigger value="card">Card Design</TabsTrigger>
          <TabsTrigger value="text">Typography</TabsTrigger>
          <TabsTrigger value="cursor">Cursor & FX</TabsTrigger>
          <TabsTrigger value="enter">Enter Screen</TabsTrigger>
        </TabsList>

        {/* Background Settings */}
        <TabsContent value="background" className="space-y-4">
          <Card className="glass-dark border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Background Visual Style</CardTitle>
              <CardDescription className="text-xs">Select shader presets, video loops, or gradients.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Background Mode</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['GRADIENT', 'IMAGE', 'VIDEO', 'PARTICLES', 'AURORA', 'GALAXY', 'STARS', 'LIQUID'].map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={backgroundConfig.type === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBackgroundConfig({ ...backgroundConfig, type })}
                      className="text-xs"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {backgroundConfig.type === 'IMAGE' && (
                <div className="space-y-2">
                  <Label className="text-xs">Image URL (Direct JPG/PNG/WebP)</Label>
                  <Input
                    placeholder="https://..."
                    value={backgroundConfig.imageUrl || ''}
                    onChange={(e) => setBackgroundConfig({ ...backgroundConfig, imageUrl: e.target.value })}
                  />
                </div>
              )}

              {backgroundConfig.type === 'VIDEO' && (
                <div className="space-y-2">
                  <Label className="text-xs">Video URL (Direct MP4/WebM)</Label>
                  <Input
                    placeholder="https://..."
                    value={backgroundConfig.videoUrl || ''}
                    onChange={(e) => setBackgroundConfig({ ...backgroundConfig, videoUrl: e.target.value })}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Overlay Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={backgroundConfig.overlayColor || '#000000'}
                      onChange={(e) => setBackgroundConfig({ ...backgroundConfig, overlayColor: e.target.value })}
                      className="w-12 h-9 p-1 bg-transparent cursor-pointer"
                    />
                    <Input
                      value={backgroundConfig.overlayColor || '#000000'}
                      onChange={(e) => setBackgroundConfig({ ...backgroundConfig, overlayColor: e.target.value })}
                      className="font-mono text-xs flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Background Blur ({backgroundConfig.blur}px)</Label>
                  <Input
                    type="range"
                    min="0"
                    max="40"
                    value={backgroundConfig.blur}
                    onChange={(e) => setBackgroundConfig({ ...backgroundConfig, blur: Number(e.target.value) })}
                    className="accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Card Design Settings */}
        <TabsContent value="card" className="space-y-4">
          <Card className="glass-dark border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Card Glassmorphism & Geometry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Card Opacity ({Math.round(cardConfig.opacity * 100)}%)</Label>
                  <Input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={cardConfig.opacity}
                    onChange={(e) => setCardConfig({ ...cardConfig, opacity: Number(e.target.value) })}
                    className="accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Backdrop Blur ({cardConfig.backgroundBlur}px)</Label>
                  <Input
                    type="range"
                    min="0"
                    max="40"
                    value={cardConfig.backgroundBlur}
                    onChange={(e) => setCardConfig({ ...cardConfig, backgroundBlur: Number(e.target.value) })}
                    className="accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Corner Radius ({cardConfig.borderRadius}px)</Label>
                  <Input
                    type="range"
                    min="0"
                    max="40"
                    value={cardConfig.borderRadius}
                    onChange={(e) => setCardConfig({ ...cardConfig, borderRadius: Number(e.target.value) })}
                    className="accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Layout Style</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['centered', 'minimal', 'floating'].map((layout) => (
                      <Button
                        key={layout}
                        type="button"
                        variant={cardConfig.layout === layout ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCardConfig({ ...cardConfig, layout })}
                        className="text-xs capitalize"
                      >
                        {layout}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography */}
        <TabsContent value="text" className="space-y-4">
          <Card className="glass-dark border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Typography & Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Font Family</Label>
                  <select
                    value={textConfig.fontFamily}
                    onChange={(e) => setTextConfig({ ...textConfig, fontFamily: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background/50 text-xs"
                  >
                    <option value="Inter">Inter (Clean Modern)</option>
                    <option value="Poppins">Poppins (Geometric)</option>
                    <option value="JetBrains Mono">JetBrains Mono (Developer/Hacker)</option>
                    <option value="Cinzel">Cinzel (Luxury Serif)</option>
                    <option value="Outfit">Outfit (Guns.lol Aesthetic)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Glow Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={textConfig.glowColor || '#a855f7'}
                      onChange={(e) => setTextConfig({ ...textConfig, glowColor: e.target.value })}
                      className="w-12 h-9 p-1 bg-transparent cursor-pointer"
                    />
                    <Input
                      value={textConfig.glowColor || '#a855f7'}
                      onChange={(e) => setTextConfig({ ...textConfig, glowColor: e.target.value })}
                      className="font-mono text-xs flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cursor & FX */}
        <TabsContent value="cursor" className="space-y-4">
          <Card className="glass-dark border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Interactive Cursor Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['default', 'crosshair', 'dot', 'glow'].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={cursorConfig.type === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCursorConfig({ ...cursorConfig, type })}
                    className="text-xs capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enter Screen */}
        <TabsContent value="enter" className="space-y-4">
          <Card className="glass-dark border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Click to Enter Overlay</CardTitle>
              <CardDescription className="text-xs">
                Requires visitor interaction to start playing background music seamlessly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Enter Screen Prompt Text</Label>
                <Input
                  value={enterScreenConfig.title}
                  onChange={(e) => setEnterScreenConfig({ ...enterScreenConfig, title: e.target.value })}
                  placeholder="click anywhere to enter"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
