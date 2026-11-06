'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Images, Upload, Trash2, Folder, ExternalLink, RefreshCw, Plus } from 'lucide-react'

export default function MediaDashboardPage() {
  const [mediaList, setMediaList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [fileUrlInput, setFileUrlInput] = useState('')

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/media')
      if (res.ok) {
        const data = await res.json()
        setMediaList(data.assets || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('/api/media', {
        method: 'POST',
        body: form,
      })

      if (res.ok) {
        fetchMedia()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Media Library</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Store images, backgrounds, audio tracks, and animated graphics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              accept="image/*,video/*,audio/*"
            />
            <Button asChild disabled={uploading} className="bg-primary hover:bg-primary/90 text-primary-foreground pointer-events-none">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Asset'}
              </span>
            </Button>
          </label>
        </div>
      </div>

      <Card className="glass-dark border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Uploaded Assets ({mediaList.length})</CardTitle>
          <CardDescription className="text-xs">Direct CDN-accelerated media files</CardDescription>
        </CardHeader>
        <CardContent>
          {mediaList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Images className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="text-xs text-muted-foreground">No media assets uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((item) => (
                <div key={item.id} className="group relative rounded-xl overflow-hidden border border-border/50 bg-background/50 p-2">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted/20 flex items-center justify-center">
                    {item.mimeType?.startsWith('image/') ? (
                      <img src={item.url} alt={item.fileName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-muted-foreground font-mono">{item.fileName}</span>
                    )}
                  </div>
                  <p className="text-[11px] truncate mt-2 font-mono text-muted-foreground">{item.fileName}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
