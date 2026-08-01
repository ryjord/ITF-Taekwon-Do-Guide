import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

/**
 * TerminologyHero Component
 * 
 * Professional hero section for the ITF Taekwon-Do Terminology page featuring
 * dynamic background elements, animated features, and comprehensive learning indicators.
 * 
 * Features:
 * - Animated Korean text patterns with professional typography
 * - Dynamic geometric background elements
 * - Interactive feature indicators with status animations
 * - Smooth scroll navigation with animated indicator
 * - Responsive design with optimized mobile experience
 * - Accessibility-compliant semantic structure
 * 
 * @returns {JSX.Element} Terminology hero section component
 * 
 * @example
 * <TerminologyHero />
 */
export const TerminologyHero = () => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[boolean, Function]} Scroll indicator visibility state */
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)

  // ===== EFFECTS =====

  /**
   * Handles scroll behavior for scroll indicator visibility
   */
  useEffect(() => {
    /**
     * Hides scroll indicator when user starts scrolling
     */
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // ===== RENDER METHODS =====

  /**
   * Renders animated Korean text background patterns
   * @returns {JSX.Element} Background patterns component
   */
  const renderBackgroundPatterns = () => (
    <div className="absolute inset-0 opacity-5 pointer-events-none">
      {/* Korean Text Pattern - Essential Taekwon-Do Terms */}
      <div className="absolute top-1/4 left-1/4 text-6xl font-korean rotate-12 animate-float-slow">태권도</div>
      <div className="absolute top-1/3 right-1/4 text-5xl font-korean -rotate-12 animate-float-medium">정신</div>
      <div className="absolute bottom-1/4 left-1/3 text-4xl font-korean rotate-6 animate-float-fast">기술</div>
      <div className="absolute bottom-1/3 right-1/3 text-6xl font-korean -rotate-6 animate-float-slow">수련</div>
      <div className="absolute top-1/2 left-1/2 text-8xl font-korean -translate-x-1/2 -translate-y-1/2 opacity-10 animate-pulse-slow">도장</div>
      
      {/* Geometric Patterns with Animation */}
      <div className="absolute top-20 left-20 w-32 h-32 border-2 border-primary/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 border-2 border-primary/20 rotate-45 animate-spin-slow"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary/20 rounded-full opacity-30 animate-ping-slow"></div>
      
      {/* Additional Floating Elements */}
      <div className="absolute top-40 right-40 w-16 h-16 border border-primary/10 rounded-lg rotate-12 animate-float-medium"></div>
      <div className="absolute bottom-40 left-40 w-20 h-20 border border-primary/10 rounded-full animate-float-slow"></div>
    </div>
  )

  /**
   * Riders the main title section with professional typography
   * @returns {JSX.Element} Main title component
   */
  const renderMainTitle = () => (
    <div className="mb-8 animate-fade-in-down">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 tracking-tight drop-shadow-lg">
        ITF <span className="text-blue-800 animate-gradient bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 bg-clip-text text-transparent">Terminology</span>
      </h1>
       <div className="w-32 h-1 bg-gradient-to-r from-blue-800 to-blue-600 mx-auto mb-6 rounded-full shadow-lg"></div>
    </div>
  )

  /**
   * Renders the subtitle with motivational messaging
   * @returns {JSX.Element} Subtitle component
   */
  const renderSubtitle = () => (
    <p className="text-xl sm:text-2xl lg:text-3xl text-foreground/80 mb-8 leading-relaxed font-light animate-fade-in-down">
      Master the Language of Traditional <span className="font-semibold text-blue-700 bg-gradient-to-r from-blue-700 to-blue-700 bg-clip-text text-transparent">Taekwon-Do</span>
    </p>
  )

  /**
   * Renders the detailed description section
   * @returns {JSX.Element} Description component
   */
  const renderDescription = () => (
    <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up">
      Comprehensive dictionary of Korean commands, techniques, and philosophy 
      with authentic audio pronunciation. Essential knowledge for dedicated practitioners 
      seeking to deepen their understanding of traditional ITF Taekwon-Do.
    </p>
  )

  /**
   * Renders feature indicators with status animations
   * @returns {JSX.Element} Feature indicators component
   */
  const renderFeatureIndicators = () => (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-foreground/60 animate-stagger-fade-in">
      <div className="flex items-center gap-3 bg-background/50 backdrop-blur-sm px-4 py-3 rounded-full border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="font-medium">Authentic Audio Pronunciation</span>
      </div>
      <div className="flex items-center gap-3 bg-background/50 backdrop-blur-sm px-4 py-3 rounded-full border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <span className="font-medium">Progressive Belt Learning</span>
      </div>
      <div className="flex items-center gap-3 bg-background/50 backdrop-blur-sm px-4 py-3 rounded-full border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <span className="font-medium">Comprehensive Categories</span>
      </div>
    </div>
  )

  /**
   * Riders animated scroll indicator
   * @returns {JSX.Element} Scroll indicator component
   */
  const renderScrollIndicator = () => (
    showScrollIndicator && (
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-foreground/50 uppercase tracking-wider font-medium">Explore Terminology</span>
          <div className="animate-bounce">
            <svg 
              className="w-5 h-5 text-foreground" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </div>
      </div>
    )
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <section 
     className="
        relative min-h-[80vh] flex items-center justify-center 
        bg-gradient-to-br from-primary/50 via-primary/40 to-primary/100 
        border-b border-primary/30 overflow-hidden
      "
      role="banner"
      aria-label="ITF Taekwon-Do Terminology Introduction"
    >
      {/* Background Patterns */}
      {renderBackgroundPatterns()}
      
      {/* Main Content */}
      <div className="text-center relative z-10 max-w-4xl mx-auto px-4">
        {renderMainTitle()}
        {renderSubtitle()}
        {renderDescription()}
        {renderFeatureIndicators()}
      </div>

      {/* Scroll Indicator */}
      {renderScrollIndicator()}
    </section>
  )
}

