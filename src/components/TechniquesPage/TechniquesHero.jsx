/**
 * TechniquesHero Component
 * 
 * Grand hero section for the ITF Taekwon-Do Techniques page.
 * Features compelling statistics, professional typography, and engaging
 * visual elements to showcase the comprehensive technique library.
 * 
 * Features:
 * - Impactful typography with gradient background
 * - Interactive statistics grid with hover effects
 * - Professional spacing and visual hierarchy
 * - Accessibility-compliant semantic structure
 * - Responsive design for all screen sizes
 * 
 * @returns {JSX.Element} Techniques hero section component
 */
export const TechniquesHero = () => {
  // ===== DATA DEFINITIONS =====

  /**
   * Technique statistics data showcasing the comprehensive ITF curriculum
   * @type {Array}
   */
  const techniqueStats = [
    { count: 18, label: 'Stances', description: 'Foundation positions for power and balance' },
    { count: 17, label: 'Kicks', description: 'Dynamic leg techniques for all ranges' },
    { count: 6, label: 'Punches', description: 'Powerful hand strikes with precision' },
    { count: 8, label: 'Strikes', description: 'Hand attacks for maximum impact' },
    { count: 5, label: 'Thrusts', description: 'Close combat spear hand techniques' },
    { count: 24, label: 'Blocks', description: 'Defensive techniques for protection' }
  ]

  // ===== RENDER METHODS =====

  /**
   * Renders individual statistic card with hover effects
   * @param {Object} stat - Statistic data object
   * @param {number} index - Array index for key and animation delay
   * @returns {JSX.Element} Statistic card component
   */
  const renderStatCard = (stat, index) => (
    <div
      key={stat.label}
      className="
        bg-background/80 backdrop-blur-sm border border-border rounded-xl p-6 text-center 
        hover:scale-105 hover:border-primary/50 hover:shadow-lg 
        transition-all duration-300 cursor-default
        focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2
      "
      role="article"
      aria-label={`${stat.count} ${stat.label}: ${stat.description}`}
      tabIndex={0}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Statistic Number */}
      <div 
        className="text-3xl font-bold text-primary mb-2"
        aria-live="polite"
      >
        {stat.count}
      </div>
      
      {/* Statistic Label */}
      <div className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
        {stat.label}
      </div>
    </div>
  )

  /**
   * Renders the main heading section with impact typography
   * @returns {JSX.Element} Main heading component
   */
  const renderMainHeading = () => (
    <div className="mb-8 animate-fade-in-down">
       <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 tracking-tight drop-shadow-lg ">
        ITF <span className="text-blue-800 animate-gradient bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 bg-clip-text text-transparent">Techniques</span>
      </h1>
       <div className="w-32 h-1 bg-gradient-to-r from-blue-800 to-blue-600 mx-auto mb-6 rounded-full shadow-lg"></div>
      
      <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
        Master <span className="text-blue-700 font-semibold">78 core techniques</span> that form the foundation 
        of traditional ITF Taekwon-Do.
      </p>
    </div>
  )

  /**
   * Renders the statistics grid with all technique counts
   * @returns {JSX.Element} Statistics grid component
   */
  const renderStatsGrid = () => (
    <div 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto mb-16 animate-fade-in-up"
      role="grid"
      aria-label="ITF Taekwon-Do technique statistics"
    >
      {techniqueStats.map(renderStatCard)}
    </div>
  )

  /**
   * Renders the call-to-action section with motivational messaging
   * @returns {JSX.Element} Call-to-action component
   */
  const renderCallToAction = () => (
    <div 
      className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 max-w-2xl mx-auto animate-fade-in-up"
      role="region"
      aria-label="Training motivation"
    >
      <p className="text-foreground/80 text-lg mb-3 font-medium leading-relaxed">
        <span className="text-blue-700 font-semibold">Ready to master your form?</span> Explore each category 
        for detailed breakdowns and step-by-step guidance.
      </p>
      <p className="text-foreground/60 text-sm">
        Comprehensive training resources for students of all belt levels.
      </p>
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <section 
      className="pt-20 bg-gradient-to-br from-primary/10 via-primary/40 to-primary/100"
      role="banner"
      aria-label="ITF Taekwon-Do Techniques Introduction"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          
          {renderMainHeading()}
          {renderStatsGrid()}
          {renderCallToAction()}
          
        </div>
      </div>
    </section>
  )
}