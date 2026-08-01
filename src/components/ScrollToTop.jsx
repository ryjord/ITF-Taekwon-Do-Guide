import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollController Component
 * 
 * Declarative scroll management component that automatically handles
 * scroll positioning based on route changes and custom triggers.
 * 
 * Features:
 * - Automatic scroll on route changes
 * - Custom trigger-based scroll activation
 * - Multiple scroll target options (top, bottom, element IDs)
 * - Smooth scroll behavior configuration
 * - Dependency-based scroll execution
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.triggers - Boolean array that triggers scroll when any become true
 * @param {Array} props.dependencies - Additional dependencies for trigger effect
 * @param {boolean} props.onRouteChange - Whether to scroll on route changes
 * @param {ScrollBehavior} props.behavior - Scroll behavior: 'smooth', 'instant', 'auto'
 * @param {string} props.scrollTo - Scroll target: 'top', 'bottom', or '#element-id'
 * @param {React.ReactNode} props.children - Child components to render
 * 
 * @returns {JSX.Element} Scroll controller wrapper component
 * 
 * @example
 * // Scroll to top on route changes
 * <ScrollController>
 *   <YourComponent />
 * </ScrollController>
 * 
 * @example
 * // Scroll to element when data loads
 * <ScrollController 
 *   triggers={[dataLoaded]}
 *   scrollTo="#main-content"
 *   behavior="smooth"
 * >
 *   <YourComponent />
 * </ScrollController>
 */
export const ScrollController = ({ 
  triggers = [],
  dependencies = [],
  onRouteChange = true,
  behavior = 'smooth',
  scrollTo = 'top',
  children 
}) => {
  const location = useLocation()

  // ===== SCROLL POSITIONING LOGIC =====

  /**
   * Executes scroll to specified position with error handling
   * @param {string} position - Target position to scroll to
   * @param {ScrollBehavior} scrollBehavior - Scroll behavior type
   */
  const scrollToPosition = (position, scrollBehavior) => {
    try {
      switch (position) {
        case 'top':
          window.scrollTo({ 
            top: 0, 
            left: 0, 
            behavior: scrollBehavior 
          })
          console.log('📜 Scrolled to top of page')
          break

        case 'bottom':
          window.scrollTo({ 
            top: document.body.scrollHeight, 
            behavior: scrollBehavior 
          })
          console.log('📜 Scrolled to bottom of page')
          break

        default:
          // Handle element ID scrolling
          if (typeof position === 'string' && position.startsWith('#')) {
            const elementId = position.slice(1)
            const element = document.getElementById(elementId)
            
            if (element) {
              element.scrollIntoView({ 
                behavior: scrollBehavior,
                block: 'start',
                inline: 'nearest'
              })
              console.log(`📜 Scrolled to element: #${elementId}`)
            } else {
              console.warn(`🚨 Scroll target element not found: #${elementId}`)
            }
          } else {
            console.warn('🚨 Invalid scroll target provided:', position)
          }
          break
      }
    } catch (error) {
      console.error('🚨 Error during scroll execution:', error)
    }
  }

  // ===== EFFECT: ROUTE CHANGE SCROLL =====

  /**
   * Handles automatic scrolling on route changes
   */
  useEffect(() => {
    if (onRouteChange) {
      // Small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        scrollToPosition(scrollTo, behavior)
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [location.pathname, onRouteChange, behavior, scrollTo])

  // ===== EFFECT: TRIGGER-BASED SCROLL =====

  /**
   * Handles scrolling based on custom triggers and dependencies
   */
  useEffect(() => {
    // Check if any trigger condition is met
    const shouldScroll = triggers.some(trigger => 
      Boolean(trigger) && trigger !== false
    )

    if (shouldScroll) {
      // Small delay to ensure DOM updates are complete
      const timeoutId = setTimeout(() => {
        scrollToPosition(scrollTo, behavior)
      }, 50)

      return () => clearTimeout(timeoutId)
    }
  }, [...triggers, ...dependencies, behavior, scrollTo])

  // ===== RENDER =====

  /**
   * Renders children without additional wrapper elements
   */
  return children || null
}

/**
 * ScrollController Prop Types (for documentation)
 * 
 * @typedef {Object} ScrollControllerProps
 * @property {Array<boolean>} [triggers=[]] - Boolean conditions that trigger scrolling
 * @property {Array<any>} [dependencies=[]] - Additional dependencies for trigger effect
 * @property {boolean} [onRouteChange=true] - Enable/disable scroll on route changes
 * @property {('smooth'|'instant'|'auto')} [behavior='smooth'] - Scroll behavior
 * @property {string} [scrollTo='top'] - Scroll target position
 * @property {React.ReactNode} [children] - Child components to render
 */