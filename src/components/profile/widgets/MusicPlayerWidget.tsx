'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart } from 'lucide-react'

interface MusicPlayerWidgetProps {
  config: any
  style: React.CSSProperties
}

export function MusicPlayerWidget({ config, style }: MusicPlayerWidgetProps) {
  const tracks = config.tracks || []
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  const audioRef = useRef<HTMLAudioElement>(null)
  const currentTrack = tracks[currentIndex]

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.volume = volume
      audioRef.current.src = currentTrack.audioUrl
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false))
    }
  }, [currentIndex, currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => setCurrentIndex((prev) => (prev + 1) % tracks.length)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [tracks.length])

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!tracks.length) {
    return (
      <div style={style} className="text-center py-12 text-muted-foreground">
        <p>No tracks in player</p>
      </div>
    )
  }

  return (
    <div style={style} className="h-full">
      <div className="flex items-center gap-4">
        {currentTrack.coverUrl && (
          <img src={currentTrack.coverUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{currentTrack.title}</p>
          <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>
        <button onClick={() => { const n = new Set(liked); currentTrack.id ? n.add(currentTrack.id) : n.delete(currentTrack.id); setLiked(n) }} className={cn('p-2 rounded-lg', liked.has(currentTrack.id) ? 'text-red-500' : 'text-muted-foreground')}>
          <Heart className={cn('w-5 h-5', liked.has(currentTrack.id) && 'fill-current')} />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
        <input type="range" min={0} max={duration || 100} value={currentTime} onChange={e => { const v = parseFloat(e.target.value); if (audioRef.current) audioRef.current.currentTime = v; setCurrentTime(v) }} className="flex-1 h-1.5 appearance-none bg-muted rounded-full accent-primary" />
        <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button onClick={() => setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length)} className="p-2 text-muted-foreground hover:text-foreground"><SkipBack className="w-5 h-5" /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-primary text-primary-foreground rounded-full"><Play className="w-6 h-6" /></button>
        <button onClick={() => setCurrentIndex((prev) => (prev + 1) % tracks.length)} className="p-2 text-muted-foreground hover:text-foreground"><SkipForward className="w-5 h-5" /></button>
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <input type="range" min={0} max={1} step={0.1} value={volume} onChange={e => { setVolume(parseFloat(e.target.value)); if (audioRef.current) audioRef.current.volume = parseFloat(e.target.value) }} className="w-20 h-1.5 appearance-none bg-muted rounded-full accent-primary" />
      </div>
    </div>
  )
}