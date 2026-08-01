import { useState, useEffect } from 'react'
import { cn } from '../lib/utils'

/**
 * ThemeToggle Component
 * 
 * Advanced theme switching component with system preference detection,
 * persistent storage, and smooth transitions between light and dark modes.
 * 
 * Features:
 * - System preference detection using prefers-color-scheme
 * - Persistent theme storage in localStorage
 * - Smooth CSS transitions and accessibility compliance
 * - ARIA labels and keyboard navigation support
 * - Professional iconography with clear visual indicators
 * 
 * @returns {JSX.Element} Theme toggle button component
 * 
 * @example
 * <ThemeToggle />
 */
export const ThemeToggle = () => {
  // ===== STATE MANAGEMENT =====
  
  /** Current theme state (true = dark, false = light) */
  const [isDark, setIsDark] = useState(true)
  
  /** Loading state to prevent flash of wrong theme */
  const [isMounted, setIsMounted] = useState(false)

  // ===== EFFECTS =====

  /**
   * Initializes theme on component mount
   * Checks localStorage and system preferences
   */
  useEffect(() => {
    /**
     * Retrieves user's theme preference with fallbacks
     * @returns {'dark' | 'light'} User's preferred theme
     */
    const getInitialTheme = () => {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme')
      
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // Priority: saved preference > system preference > default dark
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme
      }
      
      return systemPrefersDark ? 'dark' : 'light'
    }

    // Apply initial theme
    const initialTheme = getInitialTheme()
    const isDarkMode = initialTheme === 'dark'
    
    setIsDark(isDarkMode)
    
    // Update DOM classes
    if (isDarkMode) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
    
    // Mark as mounted to prevent flash
    setIsMounted(true)
    
    console.log(`🎨 Theme initialized: ${initialTheme}`)
  }, [])

  /**
   * Listens for system theme changes and updates accordingly
   */
  useEffect(() => {
    /**
     * Handles system theme change events
     * @param {MediaQueryListEvent} event - Media query change event
     */
    const handleSystemThemeChange = (event) => {
      // Only update if user hasn't set an explicit preference
      const savedTheme = localStorage.getItem('theme')
      
      if (!savedTheme) {
        const newDarkMode = event.matches
        setIsDark(newDarkMode)
        
        if (newDarkMode) {
          document.documentElement.classList.remove('light')
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
          document.documentElement.classList.add('light')
        }
        
        console.log('🎨 Theme updated to match system preference')
      }
    }

    // Add event listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [])

  // ===== EVENT HANDLERS =====

  /**
   * Toggles between light and dark themes
   * Updates state, localStorage, and DOM classes
   */
  const toggleTheme = () => {
    const newDarkMode = !isDark
    
    // Update DOM classes with transition
    document.documentElement.classList.add('theme-transition')
    
    if (newDarkMode) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
    
    // Update state and storage
    setIsDark(newDarkMode)
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
    
    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition')
    }, 300)
    
    console.log(`🎨 Theme toggled to: ${newDarkMode ? 'dark' : 'light'}`)
  }

  /**
   * Handles keyboard navigation for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleTheme()
    }
  }

  // ===== RENDER LOGIC =====

  // Prevent flash of wrong theme during initial load
  if (!isMounted) {
    return (
      <div 
        className={cn(
          "p-2 rounded-md bg-muted border border-border",
          "w-9 h-9 animate-pulse"
        )}
        aria-hidden="true"
      />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={cn(
        // Base styles
        "p-2 rounded-md transition-all duration-300",
        "w-9 h-9 flex items-center justify-center",
        
        // Theme-based styles
        "bg-primary hover:bg-primary/90",
        "dark:bg-primary dark:hover:bg-primary/90",
        
        // Interactive states
        "text-primary-foreground",
        "border border-border/50",
        "hover:border-primary/50",
        "hover:shadow-lg hover:shadow-primary/25",
        "transform hover:scale-105 active:scale-95",
        
        // Focus accessibility
        "focus:outline-none focus:ring-2 focus:ring-primary",
        "focus:ring-offset-2 focus:ring-offset-background",
        
        // Reduced motion support
        "motion-reduce:transform-none motion-reduce:transition-none"
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={`Current theme: ${isDark ? 'Dark' : 'Light'}. Click to switch.`}
    >
      {/* Sun Icon (Light Mode) */}
      {isDark ? (
        <svg 
          className="w-5 h-5 transition-transform duration-300 hover:rotate-45" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        // Moon Icon (Dark Mode)
        <svg 
          className="w-5 h-5 transition-transform duration-300 hover:rotate-45" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  )
}