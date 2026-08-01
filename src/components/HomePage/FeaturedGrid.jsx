import { Link } from 'react-router-dom'

/**
 * FeaturedGrid Component
 * 
 * Professional grid layout component showcasing the main sections of the
 * ITF Taekwon-Do application with engaging visuals and intuitive navigation.
 * 
 * Features:
 * - Responsive grid layout optimized for all screen sizes
 * - Dynamic gradient backgrounds for visual appeal
 * - Interactive hover effects with smooth transitions
 * - Professional typography and spacing hierarchy
 * - Accessibility-compliant navigation elements
 * - Commercial-ready code with comprehensive documentation
 * 
 * @returns {JSX.Element} Featured grid section component
 * 
 * @example
 * <FeaturedGrid />
 */
export const FeaturedGrid = () => {
  // ===== DATA DEFINITIONS =====

  /**
   * Featured sections configuration with comprehensive metadata
   * @type {Array<FeaturedSection>}
   */
  const featuredSections = [
    {
      name: "Techniques",
      href: "/techniques",
      icon: "🥋", 
      description: "Master strikes, blocks, stances, and kicks with detailed form breakdowns and progressive learning paths.",
      gradient: "from-red-500 to-red-600",
      badge: "Core Fundamentals",
      ariaLabel: "Navigate to Techniques section"
    },
    {
      name: "Patterns (Tul)",
      href: "/patterns", 
      icon: "🌀", 
      description: "Learn all 24 ITF patterns from Chon-Ji to Tong-Il with step-by-step guides and video demonstrations.",
      gradient: "from-orange-500 to-red-500",
      badge: "24 Traditional Forms",
      ariaLabel: "Navigate to Patterns section"
    },
    {
      name: "Drills",
      href: "/drills",
      icon: "⚡", 
      description: "Practice combinations, footwork, and sparring drills to improve your skills and build muscle memory.",
      gradient: "from-yellow-500 to-orange-500",
      badge: "Training Exercises",
      ariaLabel: "Navigate to Drills section"
    },
    {
      name: "Terminology", 
      href: "/terminology",
      icon: "📚", 
      description: "Learn Korean commands, counting, and technical terms with authentic audio pronunciation guides.",
      gradient: "from-green-500 to-blue-500",
      badge: "Language & Culture",
      ariaLabel: "Navigate to Terminology section"
    },
    {
      name: "History",
      href: "/history",
      icon: "📜", 
      description: "Explore ITF's rich heritage from General Choi Hong Hi to global expansion through interactive timelines.",
      gradient: "from-purple-500 to-pink-500",
      badge: "Legacy & Heritage",
      ariaLabel: "Navigate to History section"
    },
    {
      name: "Quiz",
      href: "/quiz",
      icon: "🎯", 
      description: "Test your knowledge with interactive quizzes on techniques, patterns, and theoretical principles.",
      gradient: "from-blue-500 to-purple-500",
      badge: "Interactive Learning",
      ariaLabel: "Navigate to Quiz section"
    }
  ]

  // ===== RENDER METHODS =====

  /**
   * Renders section header with compelling call-to-action
   * @returns {JSX.Element} Section header component
   */
  const renderSectionHeader = () => (
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-foreground mb-4">
        Comprehensive ITF Taekwon-Do Resources
      </h2>
      <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
        Explore our complete collection of traditional ITF Taekwon-Do resources, 
        from fundamental techniques to advanced patterns and interactive learning tools.
      </p>
    </div>
  )

  /**
   * Renders individual featured section card
   * @param {FeaturedSection} section - Featured section data
   * @param {number} index - Array index for animation timing
   * @returns {JSX.Element} Featured section card component
   */
  const renderFeaturedCard = (section, index) => (
    <Link
      key={section.name}
      to={section.href}
      className="group block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-xl"
      aria-label={section.ariaLabel}
    >
      <div 
        className="
          h-full bg-background border border-border rounded-xl p-6
          transition-all duration-300 hover:shadow-xl hover:scale-105 
          hover:border-primary/50 cursor-pointer
          animate-fade-in-up
        "
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Icon Container */}
        <div 
          className={`
            w-16 h-16 rounded-2xl bg-gradient-to-br ${section.gradient} 
            flex items-center justify-center mb-4 
            transition-all duration-300 group-hover:scale-110
            shadow-md group-hover:shadow-lg
          `}
          aria-hidden="true"
        >
          <span className="text-2xl">{section.icon}</span>
        </div>

        {/* Badge */}
        <div 
          className="
            inline-block bg-primary/10 text-primary text-xs font-semibold 
            px-3 py-1 rounded-full mb-3 transition-colors duration-200
            group-hover:bg-primary/20
          "
        >
          {section.badge}
        </div>

        {/* Section Title */}
        <h3 
          className="
            text-xl font-bold text-foreground mb-3 
            group-hover:text-primary transition-colors duration-200
          "
        >
          {section.name}
        </h3>

        {/* Description */}
        <p className="text-foreground/70 mb-4 leading-relaxed text-sm">
          {section.description}
        </p>

        {/* Call-to-Action */}
        <div 
          className="
            flex items-center text-primary font-semibold text-sm
            group-hover:translate-x-1 transition-transform duration-200
          "
          aria-hidden="true"
        >
          Explore Section
          <svg 
            className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </Link>
  )

  /**
   * Renders featured sections grid
   * @returns {JSX.Element} Featured grid component
   */
  const renderFeaturedGrid = () => (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="navigation"
      aria-label="Main application sections"
    >
      {featuredSections.map(renderFeaturedCard)}
    </div>
  )

  /**
   * Renders additional call-to-action for mobile users
   * @returns {JSX.Element} Additional CTA component
   */
  const renderAdditionalCTA = () => (
    <div className="text-center mt-12">
      <p className="text-foreground/60 text-sm">
        Looking for something specific? Explore our complete sitemap in the navigation menu.
      </p>
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <section 
      className="py-16 bg-gradient-to-b from-background to-background/80"
      role="region"
      aria-label="Featured application sections"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderSectionHeader()}
        {renderFeaturedGrid()}
        {renderAdditionalCTA()}
      </div>
    </section>
  )
}

/**
 * Featured Section Type Definition
 * 
 * @typedef {Object} FeaturedSection
 * @property {string} name - Section display name
 * @property {string} href - Navigation path
 * @property {string} icon - Visual icon representation
 * @property {string} description - Section description
 * @property {string} gradient - CSS gradient classes
 * @property {string} badge - Category badge text
 * @property {string} ariaLabel - Accessibility label
 */