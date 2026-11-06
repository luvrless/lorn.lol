'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Loader2,
  Heart,
  Repeat,
  Shuffle,
  ListMusic,
} from 'lucide-react'

interface MusicPlayerProps {
  tracks: any[]
  config: any
}

export function MusicPlayer({ tracks, config }: MusicPlayerProps) {
  const activeTracks = tracks.filter(t => t.isActive).sort((a, b) => a.order - b.order)
  if (!activeTracks.length) return null

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLInputElement>(null)

  const currentTrack = activeTracks[currentIndex]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.src = currentTrack.audioUrl
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      }
    }
  }, [currentIndex, currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => handleNext()
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleError = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
    }
  }, [])

  const handlePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false))
    }
  }

  const handleNext = () => {
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * activeTracks.length))
    } else {
      setCurrentIndex((prev) => (prev + 1) % activeTracks.length)
    }
  }

  const handlePrevious = () => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0
    } else {
      setCurrentIndex((prev) => (prev - 1 + activeTracks.length) % activeTracks.length)
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setVolume(value)
    if (audioRef.current) audioRef.current.volume = value
  }

  const toggleLike = (trackId: string) => {
    setLikedTracks(prev => {
      const next = new Set(prev)
      if (next.has(trackId)) next.delete(trackId)
      else next.add(trackId)
      return next
    })
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const playerStyle = config?.musicPlayerStyle || 'compact'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="mt-8"
    >
      <div className="relative">
        {playerStyle === 'vinyl' && <VinylPlayer track={currentTrack} isPlaying={isPlaying} />}
        {playerStyle === 'waveform' && <WaveformPlayer track={currentTrack} audioRef={audioRef} />}
        {playerStyle === 'lyrics' && currentTrack.syncedLyrics && (
          <LyricsPlayer lyrics={currentTrack.syncedLyrics} currentTime={currentTime} />
        )}
        {playerStyle === 'marquee' && (
          <MarqueePlayer track={currentTrack} isPlaying={isPlaying} />
        )}

        <div className={cn(
          'bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-4 sm:p-6',
          'transition-all duration-300',
          playerStyle === 'background-only' && 'opacity-0 pointer-events-none h-0 p-0'
        )}>
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {currentTrack.coverUrl && (
                <motion.img
                  key={currentTrack.id}
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Now Playing</p>
              <h3 className="font-semibold truncate">{currentTrack.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleLike(currentTrack.id)}
                className={cn('p-2 rounded-lg transition-colors', likedTracks.has(currentTrack.id) ? 'text-red-500' : 'text-muted-foreground hover:text-red-500')}
                aria-label="Like track"
              >
                <Heart className={cn('w-5 h-5', likedTracks.has(currentTrack.id) && 'fill-current')} />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
              <input
                ref={progressRef}
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleProgressChange}
                className="flex-1 h-1.5 appearance-none bg-muted rounded-full accent-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button onClick={handlePrevious} disabled={!duration} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Previous">
                <SkipBack className="w-5 h-5" />
              </button>
              <button onClick={handlePlayPause} className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-glow" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button onClick={handleNext} disabled={!duration} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Next">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setShuffle(!shuffle)} className={cn('p-2 rounded-lg transition-colors', shuffle ? 'text-primary' : 'text-muted-foreground hover:text-foreground')} aria-label="Shuffle">
                  <Shuffle className="w-4 h-4" />
                </button>
                <button onClick={() => setRepeat(!repeat)} className={cn('p-2 rounded-lg transition-colors', repeat ? 'text-primary' : 'text-muted-foreground hover:text-foreground')} aria-label="Repeat">
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1.5 appearance-none bg-muted rounded-full accent-primary"
                />
              </div>

              <button onClick={() => setShowPlaylist(!showPlaylist)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Playlist">
                <ListMusic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showPlaylist && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 border-t border-border pt-4"
              >
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {activeTracks.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors',
                        index === currentIndex ? 'bg-primary/10 text-primary' : 'hover:bg-accent/5'
                      )}
                    >
                      <span className={cn('w-6 text-center text-xs', index === currentIndex ? 'font-bold' : 'text-muted-foreground')}>
                        {index + 1}
                      </span>
                      {track.coverUrl && <img src={track.coverUrl} alt="" className="w-8 h-8 rounded object-cover" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatTime(track.duration)}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function VinylPlayer({ track, isPlaying }: { track: any; isPlaying: boolean }) {
  return (
    <div className="flex justify-center mb-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-border relative overflow-hidden">
          {track.coverUrl && (
            <img
              src={track.coverUrl}
              alt=""
              className="w-full h-full object-cover"
              style={{ animation: isPlaying ? 'rotate-slow 20s linear infinite' : 'none' }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-muted/50 border-2 border-border" />
          </div>
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-muted border-2 border-border" />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-12 bg-border/50" style={{ transformOrigin: 'bottom center' }} />
      </div>
    </div>
  )
}

function WaveformPlayer({ track, audioRef }: { track: any; audioRef: React.RefObject<HTMLAudioElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !audioRef.current) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const source = audioCtx.createMediaElementSource(audioRef.current)
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 256
    source.connect(analyser)
    analyser.connect(audioCtx.destination)

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'hsl(var(--primary))'

      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.8
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
        x += barWidth + 1
      }
    }

    draw()

    return () => {
      audioCtx.close()
    }
  }, [audioRef])

  return (
    <div className="flex justify-center mb-4">
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="rounded-lg bg-muted/50"
      />
    </div>
  )
}

function LyricsPlayer({ lyrics, currentTime }: { lyrics: any[]; currentTime: number }) {
  const currentLine = lyrics.find((line, index) => {
    const nextLine = lyrics[index + 1]
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time)
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-4 p-4 bg-card/50 backdrop-blur-xl rounded-xl border border-border/50"
    >
      {currentLine && (
        <p className="text-lg font-medium">{currentLine.text}</p>
      )}
      {!currentLine && (
        <p className="text-muted-foreground">♪ Instrumental ♪</p>
      )}
    </motion.div>
  )
}

function MarqueePlayer({ track, isPlaying }: { track: any; isPlaying: boolean }) {
  return (
    <div className="overflow-hidden mb-4">
      <div className={cn(
        'inline-block whitespace-nowrap px-4 py-2 bg-primary/10 rounded-lg',
        isPlaying && 'animate-marquee'
      )}>
        <Music className="w-4 h-4 inline mr-2 text-primary" />
        <span className="font-medium">{track.title}</span>
        <span className="mx-4 text-muted-foreground">by</span>
        <span className="font-medium">{track.artist}</span>
        {track.album && (
          <>
            <span className="mx-4 text-muted-foreground">from</span>
            <span className="font-medium">{track.album}</span>
          </>
        )}
        <span className="mx-4">♫</span>
      </div>
    </div>
  )
}