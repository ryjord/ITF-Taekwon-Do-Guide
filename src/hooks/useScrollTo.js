import { useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * useScrollTo Custom Hook
 * 
 * Advanced scroll management utility for smooth navigation and reliable
 * scroll positioning across route changes and user interactions.
 * 
 * Features:
 * - Multi-target scroll support (top, elements, selectors, coordinates)
 * - Double-scroll technique for maximum reliability
 * - Automatic scroll on route changes
 * - Comprehensive error handling and fallbacks
 * - Accessibility-compliant scroll behavior
 * 
 * @returns {Function} scrollTo function with flexible target options
 * 
 * @example
 * const scrollTo = useScrollTo()
 * 
 * // Scroll to top
 * scrollTo('top')
 * 
 * // Scroll to element by ID
 * scrollTo('#section-id')
 * 
 * // Scroll to element by selector
 * scrollTo('.class-name')
 * 
 * // Scroll to specific position
 * scrollTo(500)
 */
export const useScrollTo = () => {
  const location = useLocation()
  const scrollTimeoutRef = useRef(null)

  /**
   * Enhanced scroll function with multiple target types and reliability features
   * @param {string|number} target - Scroll target: 'top', '#id', '.selector', or pixel position
   * @param {ScrollBehavior} behavior - Scroll behavior: 'smooth', 'instant', 'auto'
   * @returns {void}
   */
  const scrollTo = useCallback((target = 'top', behavior = 'smooth') => {
    // Clear any existing timeout to prevent conflicts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    /**
     * Executes the primary scroll operation based on target type
     */
    const executePrimaryScroll = () => {
      try {
        switch (true) {
          case target === 'top':
            window.scrollTo({ top: 0, left: 0, behavior })
            break

          case typeof target === 'string' && target.startsWith('#'):
            const elementById = document.getElementById(target.slice(1))
            if (elementById) {
              elementById.scrollIntoView({ 
                behavior, 
                block: 'start',
                inline: 'nearest'
              })
            } else {
              console.warn(`🚨 Element with ID "${target.slice(1)}" not found for scrolling`)
              return false
            }
            break

          case typeof target === 'number':
            window.scrollTo({ top: target, left: 0, behavior })
            break

          case typeof target === 'string':
            // Handle CSS selector
            const elementBySelector = document.querySelector(target)
            if (elementBySelector) {
              elementBySelector.scrollIntoView({ 
                behavior, 
                block: 'start',
                inline: 'nearest'
              })
            } else {
              console.warn(`🚨 Element with selector "${target}" not found for scrolling`)
              return false
            }
            break

          default:
            console.warn('🚨 Invalid scroll target provided:', target)
            return false
        }
        return true
      } catch (error) {
        console.error('🚨 Error during primary scroll execution:', error)
        return false
      }
    }

    /**
     * Executes reliability scroll to ensure final positioning
     */
    const executeReliabilityScroll = () => {
      try {
        switch (true) {
          case target === 'top' && window.scrollY > 0:
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
            break

          case typeof target === 'string' && target.startsWith('#'):
            const element = document.getElementById(target.slice(1))
            if (element) {
              element.scrollIntoView({ 
                behavior: 'instant', 
                block: 'start',
                inline: 'nearest'
              })
            }
            break
        }
      } catch (error) {
        console.error('🚨 Error during reliability scroll execution:', error)
      }
    }

    // ===== EXECUTE SCROLL SEQUENCE =====

    // Primary scroll attempt
    const primarySuccess = executePrimaryScroll()

    // Schedule reliability scroll only if primary was successful
    if (primarySuccess) {
      scrollTimeoutRef.current = setTimeout(executeReliabilityScroll, 50)
    }
  }, [])

  // ===== AUTO-SCROLL ON ROUTE CHANGES =====

  /**
   * Handles automatic scrolling on route changes
   * Respects anchor links and provides smooth transitions
   */
  useEffect(() => {
    const handleRouteScroll = () => {
      // Check for anchor links in URL
      const hash = location.hash
      
      if (hash) {
        // Small delay to ensure DOM is ready for anchor scrolling
        setTimeout(() => {
          scrollTo(hash, 'smooth')
        }, 100)
      } else {
        // Standard scroll to top for route changes
        scrollTo('top', 'smooth')
      }
    }

    handleRouteScroll()
  }, [location.pathname, location.hash, scrollTo])

  // ===== CLEANUP =====

  /**
   * Cleanup function to prevent memory leaks
   */
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return scrollTo
}