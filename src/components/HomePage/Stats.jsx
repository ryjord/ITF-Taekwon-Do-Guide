/**
 * Stats Component
 * 
 * Professional statistics display component showcasing key ITF Taekwon-Do metrics
 * with engaging visual design and inspirational messaging.
 * 
 * Features:
 * - Responsive grid layout for optimal viewing
 * - Interactive hover effects with smooth transitions
 * - Professional typography hierarchy
 * - Inspirational founder quote integration
 * - Accessibility-compliant semantic structure
 * - Commercial-ready code with comprehensive documentation
 * 
 * @returns {JSX.Element} Statistics section component
 * 
 * @example
 * <Stats />
 */
export const Stats = () => {
  // ===== RENDER METHODS =====

  /**
   * Renders individual statistic card
   * @param {Object} stat - Statistic data object
   * @param {number} index - Array index for animation timing
   * @returns {JSX.Element} Statistic card component
   */
  const renderStatCard = (stat, index) => (
    <div 
      key={stat.label}
      className="
        transform hover:scale-105 transition-all duration-300
        bg-background/50 backdrop-blur-sm border border-border/50
        rounded-2xl p-6 shadow-sm hover:shadow-md
        cursor-default group
      "
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <h3 className="text-5xl font-bold text-primary mb-3 group-hover:text-primary/80 transition-colors">
        {stat.value}
      </h3>
      <p className="text-lg text-foreground/80 font-semibold mb-2">
        {stat.label}
      </p>
      <p className="text-sm text-foreground/60 leading-relaxed">
        {stat.description}
      </p>
    </div>
  )

  /**
   * Renders statistics grid section
   * @returns {JSX.Element} Statistics grid component
   */
  const renderStatsGrid = () => {
    const statistics = [
      {
        value: '24',
        label: 'Tul (Patterns)',
        description: 'From Chon-Ji to Tong-Il, representing the 24 hours in a day'
      },
      {
        value: '100+',
        label: 'Techniques',
        description: 'Stances, Blocks, Strikes & Kicks for practical training'
      },
      {
        value: '1955',
        label: 'Founded',
        description: 'By General Choi Hong Hi in South Korea'
      }
    ]

    return (
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        role="list"
        aria-label="ITF Taekwon-Do key statistics"
      >
        {statistics.map(renderStatCard)}
      </div>
    )
  }

  /**
   * Renders inspirational quote section
   * @returns {JSX.Element} Quote component
   */
  const renderInspirationalQuote = () => (
    <div 
      className="mt-12 text-center max-w-2xl mx-auto animate-fade-in"
      role="complementary"
      aria-label="Inspirational quote from General Choi Hong Hi"
    >
      <blockquote className="text-foreground/70 italic text-lg leading-relaxed">
        "Refrain from reckless and thoughtless actions. Be as calm and judicious as a mountain."
      </blockquote>
      <cite className="block mt-3 text-foreground/50 text-sm font-medium not-italic">
        — General Choi Hong Hi; The Founder of ITF Taekwon-Do
      </cite>
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <section 
      className="py-16 bg-background/30 border-y border-border/30"
      role="region"
      aria-label="ITF Taekwon-Do Statistics"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderStatsGrid()}
        {renderInspirationalQuote()}
      </div>
    </section>
  )
}