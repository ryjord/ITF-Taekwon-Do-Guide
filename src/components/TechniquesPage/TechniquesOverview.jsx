import { cn } from '../../lib/utils'
import { useScrollTo } from '../../hooks/useScrollTo'

/**
 * TechniquesOverview Component
 * 
 * Main overview page for ITF Taekwon-Do technique categories.
 * Provides a comprehensive grid of technique categories with smooth navigation
 * and professional visual design.
 * 
 * Features:
 * - Category grid with hover animations and gradients
 * - Smooth scrolling transitions between views
 * - Professional spacing and typography hierarchy
 * - Accessibility-compliant interactive elements
 * - Responsive design for all screen sizes
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.onCategorySelect - Callback function when a category is selected
 * @returns {JSX.Element} Techniques overview interface
 */
export const TechniquesOverview = ({ onCategorySelect }) => {
  // ===== HOOKS =====
  
  /** Custom hook for smooth scrolling behavior */
  const scrollTo = useScrollTo()

  // ===== DATA DEFINITIONS =====

  /**
   * Category configuration data for all ITF Taekwon-Do technique categories
   * @type {Array}
   */
  const categoryCards = [
    {
      id: 'stances',
      title: 'Stances (Sogi)',
      description: 'Foundation positions for power, balance, and mobility in all patterns',
      count: '18 stances',
      color: 'from-primary to-primary/20'
    },
    {
      id: 'strikes', 
      title: 'Strikes (Jireugi)',
      description: 'Punching techniques and hand attacks for maximum impact',
      count: '8 strikes',
      color: 'from-primary to-primary/20'
    },
    {
      id: 'blocks',
      title: 'Blocks (Makgi)',
      description: 'Defensive techniques to protect, deflect, and counter attacks',
      count: '24 blocks',
      color: 'from-primary to-primary/20'
    },
    {
      id: 'kicks',
      title: 'Kicks (Chagi)',
      description: 'Powerful leg techniques and dynamic foot attacks for all ranges', 
      count: '17 kicks',
      color: 'from-primary to-primary/20'
    },
    {
      id: 'thrusts',
      title: 'Thrusts (Tzireugi)',
      description: 'Spear hands, palm heels, and pushing techniques for close combat',
      count: '5 thrusts',
      color: 'from-primary to-primary/20'
    },
    {
      id: 'punches',
      title: 'Punches (Jirugi)',
      description: 'Powerful hand strikes delivered with precision and speed',
      count: '6 punches',
      color: 'from-primary to-primary/20'
    }
  ]

  // ===== EVENT HANDLERS =====

  /**
   * Handles category selection with smooth scrolling transition
   * @param {string} categoryId - The ID of the selected category
   */
  const handleCategoryClick = (categoryId) => {
    scrollTo(500)
    onCategorySelect(categoryId)
  }

  /**
   * Handles keyboard navigation for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   * @param {string} categoryId - The category ID to select
   */
  const handleCategoryKeyDown = (event, categoryId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCategoryClick(categoryId)
    }
  }

  // ===== RENDER METHODS =====

  /**
   * Renders the main page header section
   * @returns {JSX.Element} Page header component
   */
  const renderPageHeader = () => (
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold text-foreground mb-6">
        Technique Categories
      </h1>
      <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
        Explore comprehensive breakdowns of all ITF Taekwon-Do techniques. 
        Each category includes step-by-step guidance and training applications.
      </p>
    </div>
  )

  /**
   * Renders individual category card component
   * @param {Object} category - Category data object
   * @returns {JSX.Element} Category card component
   */
  const renderCategoryCard = (category) => (
    <button
      key={category.id}
      onClick={() => handleCategoryClick(category.id)}
      onKeyDown={(e) => handleCategoryKeyDown(e, category.id)}
      className={`
        group text-left bg-background border border-border rounded-2xl p-8 
        transition-all duration-300 relative overflow-hidden
        hover:shadow-2xl hover:scale-105 hover:border-primary/50 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        active:scale-95
      `}
      aria-label={`Explore ${category.title} - ${category.description}. ${category.count} available.`}
    >
      {/* Category Content */}
      <div className="relative z-10">
        {/* Category Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            {category.title}
          </h3>
          
          {/* Description */}
          <p className="text-foreground/70 leading-relaxed mb-4">
            {category.description}
          </p>
        </div>

        {/* Footer with Count and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <span className="text-primary font-semibold text-lg">
            {category.count}
          </span>
          
          <div 
            className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300"
            aria-hidden="true"
          >
            Explore
            <svg 
              className="ml-2 w-4 h-4" 
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
      </div>

      {/* Hover Gradient Overlay */}
      <div 
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none",
          category.color
        )} 
        aria-hidden="true"
      />
    </button>
  )

  /**
   * Renders the category grid section
   * @returns {JSX.Element} Category grid component
   */
  const renderCategoryGrid = () => (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      role="grid"
      aria-label="Taekwon-Do technique categories"
    >
      {categoryCards.map(renderCategoryCard)}
    </div>
  )

  /**
   * Renders the statistics footer section
   * @returns {JSX.Element} Statistics footer component
   */
  const renderStatsFooter = () => (
    <div className="mt-24 text-center">
      <div 
        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 max-w-2xl mx-auto"
        role="region"
        aria-label="Technique library statistics"
      >
        <h3 className="text-2xl font-bold text-foreground mb-6">
          Complete Technique Library
        </h3>
        <p className="text-foreground/70 mb-4 leading-relaxed">
          All <span className="text-primary font-semibold">78 techniques</span> organized by category, 
          with detailed instructions, applications, and training tips for every belt level.
        </p>
        <p className="text-foreground/60 text-sm">
          From basic white belt fundamentals to advanced black belt applications
        </p>
      </div>
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div className="py-12">
      {renderPageHeader()}
      {renderCategoryGrid()}
      {renderStatsFooter()}
    </div>
  )
}