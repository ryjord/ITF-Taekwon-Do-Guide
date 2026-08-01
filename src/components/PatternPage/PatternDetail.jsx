import { cn } from '../../lib/utils'

/**
 * PatternDetail Component
 * 
 * Comprehensive pattern detail view for ITF Taekwon-Do patterns (Tul)
 * featuring step-by-step movements, historical context, and professional styling.
 * 
 * Features:
 * - Detailed pattern information with belt color coding
 * - Step-by-step movement instructions with numbering
 * - Historical context and pattern meaning
 * - Responsive grid layout for optimal viewing
 * - Professional animations and transitions
 * - Accessibility-compliant navigation
 * 
 * @param {Object} props - Component properties
 * @param {Pattern} props.pattern - Pattern data object to display
 * @param {Function} props.onBack - Callback function to return to patterns list
 * 
 * @returns {JSX.Element} Pattern detail component
 * 
 * @example
 * <PatternDetail 
 *   pattern={selectedPattern}
 *   onBack={() => setSelectedPattern(null)}
 * />
 */

/**
 * Pattern Type Definition
 * 
 * @typedef {Object} Pattern
 * @property {string} id - Unique pattern identifier
 * @property {string} name - Formal pattern name
 * @property {string} beltColor - Associated belt color
 * @property {string} beltRank - Belt rank (e.g., "1st Dan")
 * @property {number} moveCount - Number of movements in pattern
 * @property {string} meaning - Philosophical meaning of pattern
 * @property {string} diagram - Visual diagram representation
 * @property {string} patternShape - Pattern shape description
 * @property {string} patternDescription - Pattern shape explanation
 * @property {string} [historicalContext] - Optional historical background
 * @property {string} [focus] - Technical focus of pattern
 * @property {Array<Movement>} [movements] - Step-by-step movement instructions
 */

/**
 * Movement Type Definition
 * 
 * @typedef {Object} Movement
 * @property {string} stance - Stance used in movement
 * @property {string} description - Movement description
 * @property {Array<string>} [steps] - Detailed step breakdown
 */

export const PatternDetail = ({ pattern, onBack }) => {
  // ===== BELT COLOR CONFIGURATION =====

  /**
   * Belt color to CSS class mapping for consistent visual representation
   * @type {Object}
   */
  const BELT_COLOR_MAP = {
    // Solid belt colors
    'White': 'bg-white border-gray-300 text-gray-800 shadow-sm',
    'Yellow': 'bg-yellow-400 border-yellow-500 text-yellow-900 shadow-md',
    'Green': 'bg-green-500 border-green-600 text-white shadow-md',
    'Blue': 'bg-blue-500 border-blue-600 text-white shadow-md',
    'Red': 'bg-red-500 border-red-600 text-white shadow-md',
    'Black': 'bg-black border-gray-800 text-white shadow-lg',
    
    // Striped belt combinations
    'White with Yellow Stripe': 'bg-gradient-to-r from-white from-70% to-yellow-400 to-70% border-gray-300 text-gray-800 shadow-sm',
    'Yellow with Green Stripe': 'bg-gradient-to-r from-yellow-400 from-70% to-green-500 to-70% border-yellow-500 text-white shadow-md',
    'Green with Blue Stripe': 'bg-gradient-to-r from-green-500 from-70% to-blue-500 to-70% border-green-600 text-white shadow-md',
    'Blue with Red Stripe': 'bg-gradient-to-r from-blue-500 from-70% to-red-500 to-70% border-blue-600 text-white shadow-md',
    'Red with Black Stripe': 'bg-gradient-to-r from-red-500 from-70% to-black to-70% border-red-600 text-white shadow-md'
  }

  // ===== UTILITY FUNCTIONS =====

  /**
   * Gets CSS classes for belt color badge styling
   * @param {string} beltColor - Belt color name
   * @returns {string} CSS classes for belt badge
   */
  const getBeltColorClass = (beltColor) => {
    return BELT_COLOR_MAP[beltColor] || 'bg-gray-200 border-gray-300 text-gray-800 shadow-sm'
  }

  /**
   * Formats pattern name from ID if formal name not provided
   * @param {Pattern} patternData - Pattern data object
   * @returns {string} Formatted pattern name
   */
  const getPatternName = (patternData) => {
    if (patternData.name) return patternData.name
    
    // Fallback: Convert ID to readable format (e.g., "chon-ji" → "Chon Ji")
    return patternData.id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // ===== RENDER METHODS =====

  /**
   * Renders error state when no pattern is selected
   * @returns {JSX.Element} Error state component
   */
  const renderErrorState = () => (
    <div 
      className="bg-background border border-border rounded-2xl shadow-lg p-8 text-center animate-fade-in"
      role="alert"
      aria-label="No pattern selected"
    >
      <div className="text-4xl mb-4" aria-hidden="true">❌</div>
      <h2 className="text-2xl font-bold text-foreground mb-4">
        No Pattern Selected
      </h2>
      <p className="text-foreground/70 mb-6">
        Please select a pattern from the list to view detailed information.
      </p>
      <button 
        onClick={onBack}
        className="
          text-primary hover:text-primary/80 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm
        "
      >
        Back to Patterns List
      </button>
    </div>
  )

  /**
   * Renders back navigation button
   * @returns {JSX.Element} Back button component
   */
  const renderBackButton = () => (
    <button 
      onClick={onBack}
      className="
        flex items-center text-primary hover:text-primary/80 
        transition-all duration-200 mb-6 group
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm
      "
      aria-label="Return to patterns list"
    >
      <svg 
        className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      Back to Patterns
    </button>
  )

  /**
   * Renders pattern header with diagram and basic info
   * @param {Pattern} patternData - Pattern data
   * @returns {JSX.Element} Pattern header component
   */
  const renderPatternHeader = (patternData) => (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 mb-6 animate-slide-up">
      <div className="text-center">
        <div 
          className="text-6xl mb-4 animate-pulse-slow" 
          aria-label="Pattern diagram"
          role="img"
        >
          {patternData.diagram || "🌀"}
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {getPatternName(patternData)}
        </h1>
        <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
          <span className="text-foreground/70 font-medium">
            {patternData.moveCount} Movements
          </span>
          <span 
            className={cn(
              "px-3 py-1 rounded-full text-sm font-semibold border-2 transition-all duration-300",
              "hover:scale-105 hover:shadow-md",
              getBeltColorClass(patternData.beltColor)
            )}
            aria-label={`${patternData.beltColor} belt pattern`}
          >
            {patternData.beltColor} Belt
          </span>
        </div>
      </div>
    </div>
  )

  /**
   * Renders pattern information section
   * @param {Pattern} patternData - Pattern data
   * @returns {JSX.Element} Pattern info component
   */
  const renderPatternInfo = (patternData) => (
    <div className="space-y-6">
      {/* Pattern Meaning */}
      <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <h3 className="font-semibold text-foreground mb-3 text-lg">Meaning</h3>
        <p className="text-foreground/70 leading-relaxed">
          {patternData.meaning}
        </p>
      </div>
      
      {/* Pattern Diagram */}
      <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <h3 className="font-semibold text-foreground mb-3 text-lg">Diagram</h3>
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 text-center hover:bg-primary/10 transition-colors duration-200">
          <div 
            className="text-4xl font-mono mb-2 animate-bounce-slow" 
            aria-label="Pattern shape"
          >
            {patternData.patternShape || "+"}
          </div>
          <p className="text-sm text-foreground/60">
            {patternData.patternDescription || "Traditional pattern shape representing the foundation of techniques"}
          </p>
        </div>
      </div>

      {/* Historical Context */}
      {patternData.historicalContext && (
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h3 className="font-semibold text-foreground mb-3 text-lg">Historical Context</h3>
          <p className="text-foreground/70 text-sm leading-relaxed">
            {patternData.historicalContext}
          </p>
        </div>
      )}
    </div>
  )

  /**
   * Renders movement instructions section
   * @param {Pattern} patternData - Pattern data
   * @returns {JSX.Element} Movements component
   */
  const renderMovements = (patternData) => (
    <div>
      <h3 className="text-xl font-bold text-foreground mb-6 animate-fade-in">
        Movement Instructions
      </h3>
      
      {patternData.movements && patternData.movements.length > 0 ? (
        <div className="space-y-3">
          {patternData.movements.map((movement, index) => (
            <div 
              key={index}
              className="
                flex items-start p-4 bg-primary/5 border border-primary/10 rounded-lg
                hover:bg-primary/10 hover:border-primary/20 transition-all duration-200
                animate-slide-up group cursor-default
              "
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div 
                className="
                  bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center 
                  mr-4 flex-shrink-0 font-semibold transition-all duration-200
                  group-hover:scale-110 group-hover:shadow-md
                "
                aria-label={`Movement ${index + 1}`}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  {movement.stance || "Ready Stance"}
                </h4>
                <p className="text-foreground/70 text-sm mt-1 leading-relaxed">
                  {movement.description}
                </p>
                {movement.steps && movement.steps.length > 0 && (
                  <ul 
                    className="text-foreground/60 text-xs mt-2 space-y-1"
                    role="list"
                  >
                    {movement.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex animate-fade-in">
                        <span className="mr-2 text-primary" aria-hidden="true">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="text-center py-8 text-foreground/50 animate-fade-in"
          role="status"
          aria-label="Movement details in progress"
        >
          <div className="text-4xl mb-2" aria-hidden="true">🥋</div>
          <p className="font-medium">Movement Details Coming Soon</p>
          <p className="text-sm mt-2">
            Complete movement breakdown currently in development
          </p>
        </div>
      )}

      {/* Pattern Progression */}
      <div 
        className="
          mt-8 p-4 bg-gradient-to-r from-primary/5 to-primary/10 
          border border-primary/20 rounded-lg animate-fade-in
          hover:shadow-md transition-all duration-200
        "
        style={{ animationDelay: '400ms' }}
      >
        <h4 className="font-semibold text-foreground mb-2">Pattern Progression</h4>
        <p className="text-foreground/70 text-sm leading-relaxed">
          This {patternData.beltRank} pattern contains {patternData.moveCount} movements 
          and focuses on {patternData.focus || "fundamental techniques and principles"}.
        </p>
      </div>
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  // Early return for error state
  if (!pattern) {
    return renderErrorState()
  }

  return (
    <div 
      className="bg-background border border-border rounded-2xl shadow-lg p-8 animate-fade-in"
      role="article"
      aria-label={`Pattern details for ${getPatternName(pattern)}`}
    >
      {renderBackButton()}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Pattern Diagram & Information */}
        <div>
          {renderPatternHeader(pattern)}
          {renderPatternInfo(pattern)}
        </div>

        {/* Right Column: Step-by-Step Movements */}
        <div>
          {renderMovements(pattern)}
        </div>
      </div>
    </div>
  )
}