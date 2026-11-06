'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Music, Plus, Play, Pause, Trash2, Volume2 } from 'lucide-react'

export default function MusicDashboardPage() {
  const [tracks, setTracks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    audioUrl: '',
    duration: 180,
    lyrics: '',
  })

  const fetchTracks = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/music')
      if (res.ok) {
        const data = await res.json()
        setTracks(data.tracks || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTracks()
  }, [])

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setModalOpen(false)
        setFormData({ title: '', artist: '', audioUrl: '', duration: 180, lyrics: '' })
        fetchTracks()
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Audio & Music Player</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure ambient background music and synchronized lyrics for profile visitors.
          </p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Audio Track
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-dark border-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-primary" />
                Add Audio Track
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTrack} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs">Song Title</Label>
                <Input
                  placeholder="Song name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Artist</Label>
                <Input
                  placeholder="Artist name"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Audio File URL (Direct MP3 link)</Label>
                <Input
                  type="url"
                  placeholder="https://.../song.mp3"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Lyrics (Optional)</Label>
                <Textarea
                  placeholder="Paste lyrics here..."
                  value={formData.lyrics}
                  onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Save Audio Track
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Your Soundtrack ({tracks.length})</CardTitle>
          <CardDescription className="text-xs">
            Plays automatically when a visitor clicks into your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-background/50 border border-border/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{track.title}</h4>
                  <p className="text-xs text-muted-foreground">{track.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-primary"
                  onClick={() => setPlayingId(playingId === track.id ? null : track.id)}
                >
                  {playingId === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ))}

          {tracks.length === 0 && !loading && (
            <div className="text-center py-10 space-y-3">
              <Volume2 className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="text-xs text-muted-foreground">No audio tracks configured yet.</p>
              <Button size="sm" variant="outline" onClick={() => setModalOpen(true)}>
                Add background track
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
