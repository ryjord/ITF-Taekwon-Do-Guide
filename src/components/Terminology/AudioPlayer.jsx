import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Loader2, Pause, Play, Volume2, VolumeX } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const AudioPlayer = ({ audioSrc, className, term = 'pronunciation' }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const audioRef = useRef(null)
  const progressBarRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
      }
    }

    const handleLoadStart = () => {
      setIsLoading(true)
      setHasError(false)
    }

    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(100)
      setCurrentTime(audio.duration)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const togglePlay = () => {
    if (!audioSrc) {
      setHasError(true)
      return
    }

    const audio = audioRef.current

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => setHasError(true))
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressClick = (event) => {
    if (!audioRef.current || !progressBarRef.current) return

    const progressBarWidth = progressBarRef.current.clientWidth
    const seekPercentage = (event.nativeEvent.offsetX / progressBarWidth) * 100
    const newTime = (seekPercentage / 100) * duration

    audioRef.current.currentTime = newTime
    setProgress(seekPercentage)
    setCurrentTime(newTime)
  }

  const toggleMute = () => setVolume(volume === 0 ? 100 : 0)

  const handleKeyDown = (event) => {
    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault()
        togglePlay()
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, currentTime - 5)
        }
        break
      case 'ArrowRight':
        event.preventDefault()
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(duration, currentTime + 5)
        }
        break
      default:
        break
    }
  }

  const formatTime = (seconds) => {
    if (!isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={cn(
        'flex items-center space-x-4 rounded-lg border border-border bg-muted/30 p-4 transition-all duration-200 hover:bg-muted/50',
        className
      )}
      role="region"
      aria-label={`Audio player for ${term}`}
    >
      <audio ref={audioRef} src={audioSrc} preload="metadata" aria-hidden="true" />

      <Button
        variant={hasError ? 'destructive' : 'default'}
        size="icon"
        onClick={togglePlay}
        onKeyDown={handleKeyDown}
        disabled={isLoading || hasError || !audioSrc}
        className="rounded-full"
        aria-label={
          isLoading
            ? 'Loading audio'
            : hasError
              ? 'Audio error - cannot play'
              : isPlaying
                ? `Pause ${term} pronunciation`
                : `Play ${term} pronunciation`
        }
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : hasError ? (
          <AlertCircle className="size-4" />
        ) : isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        )}
      </Button>

      <div className="flex min-w-0 flex-1 items-center space-x-3">
        <span className="min-w-8.75 text-xs tabular-nums text-foreground/60">{formatTime(currentTime)}</span>

        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          className="group relative h-2 flex-1 cursor-pointer rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Audio progress"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-100 group-hover:bg-primary/80"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow-md transition-opacity group-hover:opacity-100"
            style={{ left: `${progress}%` }}
          />
        </div>

        <span className="min-w-8.75 text-xs tabular-nums text-foreground/60">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleMute}
          aria-label={volume === 0 ? 'Unmute audio' : 'Mute audio'}
        >
          {volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </Button>

        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(event) => setVolume(parseInt(event.target.value, 10))}
          className="w-16 cursor-pointer accent-primary"
          aria-label="Volume control"
        />
      </div>
    </div>
  )
}
