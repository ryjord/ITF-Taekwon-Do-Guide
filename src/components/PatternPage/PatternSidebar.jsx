import PatternData from '/src/data/patterns/Patterns.json'

/**
 * PatternSidebar Component
 * 
 * Professional sidebar navigation component for ITF Taekwon-Do patterns
 * featuring belt-level grouping, pattern organization, and smooth selection.
 * 
 * Features:
 * - Belt-level grouping for intuitive pattern organization
 * - Sticky positioning with optimized scrolling
 * - Professional styling with consistent design language
 * - Accessibility-compliant navigation patterns
 * - Smooth selection states and hover interactions
 * - Commercial-ready code structure with comprehensive documentation
 * 
 * @param {Object} props - Component properties
 * @param {Pattern} props.selectedPattern - Currently selected pattern object
 * @param {Function} props.onPatternSelect - Callback function when pattern is selected
 * 
 * @returns {JSX.Element} Pattern sidebar navigation component
 * 
 * @example
 * <PatternSidebar 
 *   selectedPattern={selectedPattern}
 *   onPatternSelect={setSelectedPattern}
 * />
 */

/**
 * Pattern Data Structure
 * 
 * @typedef {Object} Pattern
 * @property {string} id - Unique pattern identifier
 * @property {string} name - Formal pattern name
 * @property {string} beltColor - Associated belt color for grouping
 */

export const PatternSidebar = ({ selectedPattern, onPatternSelect }) => {
  // ===== DATA PROCESSING =====

  /**
   * Groups patterns by belt color for organized display
   * @type {Object}
   */
  const beltGroups = PatternData.patterns.reduce((groups, pattern) => {
    const beltCategory = `${pattern.beltColor} Belt`
    if (!groups[beltCategory]) {
      groups[beltCategory] = []
    }
    groups[beltCategory].push(pattern)
    return groups
  }, {})

  // ===== EVENT HANDLERS =====

  /**
   * Handles pattern selection with proper event handling
   * @param {Pattern} pattern - Selected pattern object
   */
  const handlePatternSelect = (pattern) => {
    onPatternSelect(pattern)
  }

  /**
   * Handles keyboard navigation for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   * @param {Pattern} pattern - Pattern to select
   */
  const handlePatternKeyDown = (event, pattern) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handlePatternSelect(pattern)
    }
  }

  // ===== RENDER METHODS =====

  /**
   * Renders individual pattern navigation button
   * @param {Pattern} pattern - Pattern data object
   * @returns {JSX.Element} Pattern navigation button
   */
  const renderPatternButton = (pattern) => {
    const isSelected = selectedPattern?.id === pattern.id
    
    return (
      <button
        key={pattern.id}
        onClick={() => handlePatternSelect(pattern)}
        onKeyDown={(event) => handlePatternKeyDown(event, pattern)}
        className={`
          w-full text-left px-3 py-2 rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
          ${isSelected 
            ? 'bg-primary text-white shadow-md font-semibold' 
            : 'text-foreground/80 hover:bg-primary/10 hover:text-foreground'
          }
        `}
        aria-current={isSelected ? 'page' : undefined}
        aria-label={`Select ${pattern.name} pattern`}
      >
        {pattern.name}
      </button>
    )
  }

  /**
   * Renders belt group section with patterns
   * @param {string} belt - Belt category name
   * @param {Array<Pattern>} patterns - Array of patterns in this belt group
   * @returns {JSX.Element} Belt group section
   */
  const renderBeltGroup = ([belt, patterns]) => (
    <div key={belt} className="space-y-3">
      <h4 
        className="
          font-semibold text-foreground/80 text-sm uppercase 
          tracking-wide border-b border-border pb-2
        "
      >
        {belt}
      </h4>
      <div className="space-y-1">
        {patterns.map(renderPatternButton)}
      </div>
    </div>
  )

  /**
   * Renders sidebar header section
   * @returns {JSX.Element} Sidebar header component
   */
  const renderSidebarHeader = () => (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-foreground mb-2">
        Pattern Library
      </h3>
      <p className="text-foreground/60 text-sm">
        {PatternData.patterns.length} patterns organized by belt level
      </p>
    </div>
  )

  /**
   * Renders belt groups container
   * @returns {JSX.Element} Belt groups container
   */
  const renderBeltGroups = () => (
    <div className="space-y-6">
      {Object.entries(beltGroups).map(renderBeltGroup)}
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <aside 
      className="
        bg-background border border-border rounded-2xl shadow-lg p-6 
        sticky top-24 max-h-[80vh] overflow-y-auto
      "
      role="navigation"
      aria-label="Pattern selection sidebar"
    >
      {renderSidebarHeader()}
      {renderBeltGroups()}
    </aside>
  )
}

/**
 * PatternSidebar Prop Types (for documentation)
 * 
 * @typedef {Object} PatternSidebarProps
 * @property {Pattern} selectedPattern - Currently selected pattern object
 * @property {Function} onPatternSelect - Callback function when pattern is selected
 */