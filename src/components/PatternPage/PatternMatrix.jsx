import PatternData from '/src/data/patterns/Patterns.json'

/**
 * PatternMatrix Component
 * 
 * Professional grid layout component for displaying ITF Taekwon-Do patterns
 * in an organized matrix format with smooth interactions and accessibility features.
 * 
 * Features:
 * - Responsive grid layout optimized for all screen sizes
 * - Professional card design with consistent styling
 * - Smooth hover transitions and focus states
 * - Accessibility-compliant interactive elements
 * - Pattern statistics and belt level indicators
 * - Clean, commercial-ready code structure
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.onPatternSelect - Callback function when pattern is selected
 * 
 * @returns {JSX.Element} Pattern matrix grid component
 * 
 * @example
 * <PatternMatrix onPatternSelect={handlePatternSelect} />
 */
export const PatternMatrix = ({ onPatternSelect }) => {
  // ===== EVENT HANDLERS =====

  /**
   * Handles pattern selection with proper event handling
   * @param {Object} pattern - Selected pattern data object
   */
  const handlePatternSelect = (pattern) => {
    onPatternSelect(pattern)
  }

  /**
   * Handles keyboard navigation for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   * @param {Object} pattern - Pattern to select
   */
  const handlePatternKeyDown = (event, pattern) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handlePatternSelect(pattern)
    }
  }

  // ===== RENDER METHODS =====

  /**
   * Renders individual pattern card component
   * @param {Object} pattern - Pattern data object
   * @returns {JSX.Element} Pattern card component
   */
  const renderPatternCard = (pattern) => (
    <div 
      key={pattern.id}
      className="
        bg-background border border-border rounded-2xl p-6 shadow-lg
        transition-all duration-300 hover:shadow-xl hover:scale-105 
        hover:border-primary/50 cursor-pointer group
      "
      onClick={() => handlePatternSelect(pattern)}
      onKeyDown={(event) => handlePatternKeyDown(event, pattern)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${pattern.name} pattern`}
    >
      <div className="text-center">
        {/* Pattern Diagram */}
        <div 
          className="
            w-16 h-16 bg-gradient-to-br from-primary to-primary/80 
            rounded-full flex items-center justify-center mx-auto mb-4 
            text-white font-bold text-lg shadow-md
            group-hover:shadow-lg transition-shadow duration-300
          "
          aria-hidden="true"
        >
          {pattern.diagram || "🥋"}
        </div>
        
        {/* Pattern Name */}
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
          {pattern.name}
        </h3>
        
        {/* Pattern Metadata */}
        <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
          {pattern.moveCount} Movements • {pattern.beltColor} Belt
        </p>
        
        {/* Explore Button */}
        <button 
          className="
            bg-primary hover:bg-primary/90 text-white px-4 py-2 
            rounded-lg transition-all duration-200 font-medium
            focus:outline-none focus:ring-2 focus:ring-primary 
            focus:ring-offset-2 focus:ring-offset-background
            hover:shadow-md active:scale-95
          "
          aria-label={`Explore ${pattern.name} pattern in detail`}
        >
          Explore Pattern
        </button>
      </div>
    </div>
  )

  /**
   * Renders the matrix header section
   * @returns {JSX.Element} Matrix header component
   */
  const renderMatrixHeader = () => (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-foreground mb-2">
        Pattern Matrix
      </h2>
      <p className="text-foreground/70 text-lg">
        Complete collection of {PatternData.patterns.length} ITF Taekwon-Do patterns
      </p>
    </div>
  )

  /**
   * Renders the pattern grid layout
   * @returns {JSX.Element} Pattern grid component
   */
  const renderPatternGrid = () => (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      role="grid"
      aria-label="ITF Taekwon-Do patterns grid"
    >
      {PatternData.patterns.map(renderPatternCard)}
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <section 
      className="w-full"
      role="region"
      aria-label="Pattern selection matrix"
    >
      {renderMatrixHeader()}
      {renderPatternGrid()}
    </section>
  )
}

/**
 * PatternMatrix Prop Types (for documentation)
 * 
 * @typedef {Object} PatternMatrixProps
 * @property {Function} onPatternSelect - Callback function when pattern is selected
 */

/**
 * Pattern Data Structure (for documentation)
 * 
 * @typedef {Object} Pattern
 * @property {string} id - Unique pattern identifier
 * @property {string} name - Formal pattern name
 * @property {string} beltColor - Associated belt color
 * @property {number} moveCount - Number of movements in pattern
 * @property {string} [diagram] - Optional visual diagram representation
 */