import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

/**
 * AudioPlayer Component
 * 
 * Professional audio player component for Taekwon-Do terminology pronunciation
 * with advanced playback controls, progress tracking, and accessibility features.
 * 
 * Features:
 * - Play/pause functionality with visual feedback
 * - Progress tracking and seek capabilities
 * - Volume control with mute functionality
 * - Loading states and error handling
 * - Keyboard accessibility and ARIA labels
 * - Responsive design with professional styling
 * 
 * @param {Object} props - Component properties
 * @param {string} props.audioSrc - URL of the audio file to play
 * @param {string} [props.className] - Additional CSS classes for customization
 * @param {string} [props.term] - Optional term name for better accessibility
 * 
 * @returns {JSX.Element} Audio player component
 * 
 * @example
 * <AudioPlayer audioSrc="/audio/technique.mp3" term="Chagi" />
 */
export const AudioPlayer = ({ audioSrc, className, term = 'pronunciation' }) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[boolean, Function]} Playback state */
  const [isPlaying, setIsPlaying] = useState(false)
  
  /** @type {[number, Function]} Current playback progress (0-100) */
  const [progress, setProgress] = useState(0)
  
  /** @type {[number, Function]} Current volume level (0-100) */
  const [volume, setVolume] = useState(100)
  
  /** @type {[boolean, Function]} Loading state */
  const [isLoading, setIsLoading] = useState(false)
  
  /** @type {[boolean, Function]} Error state */
  const [hasError, setHasError] = useState(false)
  
  /** @type {[number, Function]} Audio duration in seconds */
  const [duration, setDuration] = useState(0)
  
  /** @type {[number, Function]} Current time in seconds */
  const [currentTime, setCurrentTime] = useState(0)

  // ===== REFERENCES =====
  
  const audioRef = useRef(null)
  const progressBarRef = useRef(null)

  // ===== EFFECTS =====

  /**
   * Handles audio metadata loading
   */
  useEffect(() => {
    const audio = audioRef.current
    
    /**
     * Sets audio duration when metadata is loaded
     */
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    
    /**
     * Updates progress during playback
     */
    const handleTimeUpdate = () => {
      if (audio.duration) {
        const currentProgress = (audio.currentTime / audio.duration) * 100
        setProgress(currentProgress)
        setCurrentTime(audio.currentTime)
      }
    }
    
    /**
     * Handles audio loading state
     */
    const handleLoadStart = () => {
      setIsLoading(true)
      setHasError(false)
    }
    
    /**
     * Handles audio playback errors
     */
    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
      setIsPlaying(false)
      console.error('🚨 Audio playback error:', audio.error)
    }

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('error', handleError)
    audio.addEventListener('ended', handleEnded)

    // Cleanup function
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  /**
   * Handles volume changes
   */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // ===== EVENT HANDLERS =====

  /**
   * Toggles play/pause state
   */
  const togglePlay = () => {
    if (!audioSrc) {
      setHasError(true)
      return
    }

    const audio = audioRef.current
    
    try {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play().catch(error => {
          console.error('🚨 Audio play failed:', error)
          setHasError(true)
        })
      }
      setIsPlaying(!isPlaying)
    } catch (error) {
      console.error('🚨 Audio playback error:', error)
      setHasError(true)
    }
  }

  /**
   * Handles playback completion
   */
  const handleEnded = () => {
    setIsPlaying(false)
    setProgress(100)
    setCurrentTime(duration)
  }

  /**
   * Handles progress bar clicks for seeking
   * @param {React.MouseEvent} event - Mouse event
   */
  const handleProgressClick = (event) => {
    if (!audioRef.current || !progressBarRef.current) return
    
    const progressBar = progressBarRef.current
    const clickPosition = event.nativeEvent.offsetX
    const progressBarWidth = progressBar.clientWidth
    const seekPercentage = (clickPosition / progressBarWidth) * 100
    
    const newTime = (seekPercentage / 100) * duration
    audioRef.current.currentTime = newTime
    setProgress(seekPercentage)
    setCurrentTime(newTime)
  }

  /**
   * Handles volume changes
   * @param {React.ChangeEvent} event - Change event
   */
  const handleVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value)
    setVolume(newVolume)
  }

  /**
   * Toggles mute/unmute
   */
  const toggleMute = () => {
    setVolume(volume === 0 ? 100 : 0)
  }

  /**
   * Handles keyboard navigation
   * @param {React.KeyboardEvent} event - Keyboard event
   */
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

  // ===== UTILITY FUNCTIONS =====

  /**
   * Formats time from seconds to MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds) => {
    if (!isFinite(seconds)) return '0:00'
    
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // ===== RENDER METHODS =====

  /**
   * Renders playback control button
   * @returns {JSX.Element} Playback control button
   */
  const renderPlayButton = () => (
    <button
      onClick={togglePlay}
      onKeyDown={handleKeyDown}
      disabled={isLoading || hasError || !audioSrc}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        hasError 
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        isLoading && "animate-pulse"
      )}
      aria-label={
        isLoading ? "Loading audio" :
        hasError ? "Audio error - cannot play" :
        isPlaying ? `Pause ${term} pronunciation` : `Play ${term} pronunciation`
      }
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : hasError ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ) : isPlaying ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      )}
    </button>
  )

  /**
   * Renders progress bar and time display
   * @returns {JSX.Element} Progress section
   */
  const renderProgressSection = () => (
    <div className="flex items-center space-x-3 flex-1 min-w-0">
      <span className="text-xs text-foreground/60 tabular-nums min-w-[35px]">
        {formatTime(currentTime)}
      </span>
      
      <div 
        ref={progressBarRef}
        onClick={handleProgressClick}
        className="flex-1 h-2 bg-muted rounded-full cursor-pointer group relative"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Audio progress"
      >
        <div 
          className="h-full bg-primary rounded-full transition-all duration-100 group-hover:bg-primary/80"
          style={{ width: `${progress}%` }}
        />
        <div 
          className="absolute top-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1/2 -translate-x-1/2 shadow-md"
          style={{ left: `${progress}%` }}
        />
      </div>
      
      <span className="text-xs text-foreground/60 tabular-nums min-w-[35px]">
        {formatTime(duration)}
      </span>
    </div>
  )

  /**
   * Renders volume controls
   * @returns {JSX.Element} Volume control section
   */
  const renderVolumeControls = () => (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleMute}
        className="p-1 text-foreground/60 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
        aria-label={volume === 0 ? "Unmute audio" : "Mute audio"}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          {volume === 0 ? (
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          ) : (
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          )}
        </svg>
      </button>
      
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="w-16 accent-primary cursor-pointer"
        aria-label="Volume control"
      />
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div 
      className={cn(
        "flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border border-border",
        "transition-all duration-200 hover:bg-muted/50",
        className
      )}
      role="region"
      aria-label={`Audio player for ${term}`}
    >
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        aria-hidden="true"
      />
      
      {/* Play/Pause Button */}
      {renderPlayButton()}
      
      {/* Progress Section */}
      {renderProgressSection()}
      
      {/* Volume Controls */}
      {renderVolumeControls()}
    </div>
  )
}