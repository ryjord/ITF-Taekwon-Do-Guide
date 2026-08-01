import { cn } from '../../lib/utils'

/**
 * PatternHero Component
 * 
 * Professional hero section for the ITF Taekwon-Do Patterns page featuring
 * dynamic animations, comprehensive pattern statistics, and motivational messaging.
 * 
 * Features:
 * - Animated gradient background with professional styling
 * - Dynamic pattern statistics with counting animations
 * - Responsive design with optimized typography hierarchy
 * - Accessibility-compliant semantic structure
 * - Professional badge elements with hover effects
 * - Smooth transitions and engaging visual elements
 * 
 * @returns {JSX.Element} Patterns hero section component
 * 
 * @example
 * <PatternHero />
 */
export const PatternHero = () => {
  // ===== RENDER METHODS =====

  /**
   * Renders the main heading with professional typography
   * @returns {JSX.Element} Main heading component
   */
  const renderMainHeading = () => (
    <div className="mb-8 animate-fade-in-down">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 tracking-tight drop-shadow-lg">
        ITF <span className="text-blue-800 animate-gradient bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 bg-clip-text text-transparent">Patterns</span>
      </h1>
      <div className="w-32 h-1 bg-gradient-to-r from-blue-800 to-blue-600 mx-auto mb-6 rounded-full shadow-lg"></div>
    </div>
  )

  /**
   * Riders the subtitle with motivational messaging
   * @returns {JSX.Element} Subtitle component
   */
  const renderSubtitle = () => (
    <p className="text-xl md:text-2xl lg:text-3xl text-foreground/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-up">
      The <span className="font-semibold text-blue-700">24 Tul</span> of Traditional Taekwon-Do - 
      From Fundamental Forms to Master-Level Artistry and Philosophical Expression
    </p>
  )

  /**
   * Renders statistics badges with hover animations
   * @returns {JSX.Element} Statistics badges component
   */
  const renderStatisticsBadges = () => (
    <div className="flex flex-wrap justify-center gap-4 animate-stagger-fade-in mb-10">
      {[
        { label: 'Patterns', value: '24', delay: '0ms' },
        { label: 'White to Black Belt', value: '9', delay: '100ms' },
        { label: 'Total Movements', value: '1084', delay: '200ms' }
      ].map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "bg-white/20 backdrop-blur-sm text-foreground px-6 py-3 rounded-full",
            "border border-white/30 shadow-lg hover:shadow-xl",
            "transition-all duration-300 transform hover:scale-105 hover:bg-white/30",
            "group cursor-default relative overflow-hidden",
            "animate-fade-in-up"
          )}
          style={{ animationDelay: stat.delay }}
        >
          {/* Animated background on hover */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
            aria-hidden="true"
          />
          
          {/* Content */}
          <div className="relative z-10 flex items-center space-x-2">
            <span className="font-bold text-white drop-shadow-sm">
              {stat.value}
            </span>
            <span className="font-medium text-sm md:text-base">
              {stat.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  )

  /**
   * Riders decorative background elements
   * @returns {JSX.Element} Background elements component
   */
  const renderBackgroundElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Korean Characters */}
      <div className="absolute top-10 left-10 text-6xl font-korean text-white/10 animate-float-slow">틀</div>
      <div className="absolute top-20 right-20 text-5xl font-korean text-white/10 animate-float-medium">수련</div>
      <div className="absolute bottom-20 left-20 text-4xl font-korean text-white/10 animate-float-fast">정신</div>
      <div className="absolute bottom-10 right-10 text-6xl font-korean text-white/10 animate-float-slow">태권도</div>
      
      {/* Geometric Patterns */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-white/10 rounded-full animate-ping-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border-2 border-white/10 rotate-45 animate-spin-slow"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white/10 rounded-full opacity-30 animate-pulse-slow"></div>
    </div>
  )

  /**
   * Renders scroll indicator for user guidance
   * @returns {JSX.Element} Scroll indicator component
  */
  const renderScrollIndicator = () => (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
      <div className="flex flex-col items-center gap-2">
        <span className="text-white/70 text-xs uppercase tracking-wider font-medium">
          Explore Patterns
        </span>
        <svg 
          className="w-5 h-5 text-white/70" 
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
      aria-label="ITF Taekwon-Do Patterns Introduction"
    >
      {/* Background Elements */}
      {renderBackgroundElements()}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          {renderMainHeading()}
          {renderSubtitle()}
          {renderStatisticsBadges()}
        </div>
      </div>

      {/* Scroll Indicator */}
      {renderScrollIndicator()}
    </section>
  )
}
