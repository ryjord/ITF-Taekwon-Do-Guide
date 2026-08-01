/**
 * PhilosophySection Component
 * 
 * Comprehensive philosophy display component showcasing the core values
 * and principles of ITF Taekwon-Do with professional presentation.
 * 
 * Features:
 * - Professional typography hierarchy and spacing
 * - Interactive philosophy pillars with hover effects
 * - Inspirational founder quotes and teachings
 * - Responsive design optimized for all devices
 * - Accessibility-compliant semantic structure
 * - Commercial-ready code with comprehensive documentation
 * 
 * @returns {JSX.Element} Philosophy section component
 * 
 * @example
 * <PhilosophySection />
 */
export const PhilosophySection = () => {
  // ===== DATA DEFINITIONS =====

  /**
   * Core philosophy pillars data
   * @type {Array}
   */
  const philosophyPillars = [
    {
      icon: '🙏',
      title: 'Respect & Honour',
      description: 'Honouring instructors, seniors, and the art itself through disciplined practice and mutual respect in all interactions.',
      color: 'from-blue-500/10 to-blue-600/10'
    },
    {
      icon: '💪',
      title: 'Mental Fortitude',
      description: 'Developing unwavering focus, patience, and indomitable spirit to overcome challenges in training and life.',
      color: 'from-green-500/10 to-green-600/10'
    },
    {
      icon: '🌍',
      title: 'Peace & Freedom',
      description: 'Promoting global peace, justice, and building a better world through martial virtue and ethical conduct.',
      color: 'from-purple-500/10 to-purple-600/10'
    }
  ]

  // ===== RENDER METHODS =====

  /**
   * Renders section header with decorative elements
   * @returns {JSX.Element} Section header component
   */
  const renderSectionHeader = () => (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
        The Heart of <span className="text-primary">ITF Taekwon-Do</span>
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/70 mx-auto rounded-full"></div>
    </div>
  )

  /**
   * Renders main philosophy content
   * @returns {JSX.Element} Philosophy content component
   */
  const renderPhilosophyContent = () => (
    <div className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-all duration-300">
      <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 text-center md:text-left">
        At the heart of ITF Taekwon-Do lies a profound philosophy that extends far beyond physical technique. 
        Founded on principles of <span className="text-primary font-semibold">respect, integrity, and perseverance</span>, 
        ITF Taekwon-Do is a way of life that cultivates both body and mind. Practitioners are encouraged to embody
        these values in daily life, fostering a spirit of humility and continuous self-improvement.
      </p>

      {renderPhilosophyPillars()}
      {renderFounderQuote()}
    </div>
  )

  /**
   * Renders philosophy pillars grid
   * @returns {JSX.Element} Philosophy pillars component
   */
  const renderPhilosophyPillars = () => (
    <div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      role="list"
      aria-label="Core philosophy pillars of ITF Taekwon-Do"
    >
      {philosophyPillars.map((pillar, index) => (
        <div 
          key={pillar.title}
          className="
            text-center p-6 rounded-xl border border-border/50
            bg-gradient-to-br from-primary/5 to-primary/10
            hover:from-primary/10 hover:to-primary/15
            transition-all duration-300 transform hover:scale-105
            cursor-default group
          "
          role="listitem"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <div 
            className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            {pillar.icon}
          </div>
          <h3 className="font-semibold text-foreground mb-3 text-lg">
            {pillar.title}
          </h3>
          <p className="text-foreground/70 text-sm leading-relaxed">
            {pillar.description}
          </p>
        </div>
      ))}
    </div>
  )

  /**
   * Renders founder inspirational quote
   * @returns {JSX.Element} Quote component
   */
  const renderFounderQuote = () => (
    <div 
      className="
        bg-gradient-to-r from-primary/10 to-primary/5 
        border-l-4 border-primary rounded-r-lg p-6
        hover:shadow-md transition-shadow duration-300
      "
      role="complementary"
      aria-label="Inspirational teaching from General Choi Hong Hi"
    >
      <blockquote className="text-foreground/80 italic text-lg md:text-xl text-center leading-relaxed">
        "To help others to develop and succeed in life is a reward itself and only has value when nothing is expected in return."
      </blockquote>
      <cite className="block mt-4 text-foreground/60 font-semibold text-right not-italic">
        — General Choi Hong Hi, Founder of ITF Taekwon-Do
      </cite>
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <section 
      className="py-16 bg-gradient-to-b from-background/30 to-background/80"
      role="region"
      aria-label="ITF Taekwon-Do Philosophy"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderSectionHeader()}
        {renderPhilosophyContent()}
      </div>
    </section>
  )
}