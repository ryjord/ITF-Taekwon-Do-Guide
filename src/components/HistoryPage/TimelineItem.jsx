import { cn } from '../../lib/utils'

/**
 * TimelineItem Component
 * 
 * Professional timeline event item component for displaying historical events
 * in the ITF Taekwondo timeline with interactive features and responsive design.
 * 
 * Features:
 * - Responsive design optimized for all screen sizes
 * - Interactive expand/collapse functionality
 * - Professional styling with smooth transitions
 * - Accessibility-compliant interactive elements
 * - Category-based visual indicators
 * - Commercial-ready code structure
 * 
 * @param {Object} props - Component properties
 * @param {TimelineEvent} props.event - Timeline event data object
 * @param {boolean} props.isActive - Whether the item is currently expanded
 * @param {Function} props.onClick - Click handler for expand/collapse
 * @param {Function} [props.onKeyDown] - Keyboard event handler for accessibility
 * 
 * @returns {JSX.Element} Timeline item component
 * 
 * @example
 * <TimelineItem 
 *   event={eventData}
 *   isActive={true}
 *   onClick={handleClick}
 *   onKeyDown={handleKeyDown}
 * />
 */

/**
 * Timeline Event Type Definition
 * 
 * @typedef {Object} TimelineEvent
 * @property {string} id - Unique event identifier
 * @property {string} year - Event year for display
 * @property {string} date - Specific event date
 * @property {string} title - Event title
 * @property {string} description - Brief event description
 * @property {string} icon - Visual icon representation
 * @property {string} category - Event category for styling
 */

export const TimelineItem = ({ event, isActive, onClick, onKeyDown }) => {
  // ===== RENDER METHODS =====

  /**
   * Renders the timeline connector line
   * @returns {JSX.Element} Connector line component
   */
  const renderConnectorLine = () => (
    <div 
      className="
        absolute left-3 sm:left-4 md:left-8 top-full sm:top-1/2 
        w-0.5 h-3 sm:h-4 bg-primary/30 -bottom-3 sm:-bottom-4 
        hidden sm:block transition-all duration-300
      "
      aria-hidden="true"
    />
  )

  /**
   * Renders the event icon with active state styling
   * @returns {JSX.Element} Event icon component
   */
  const renderEventIcon = () => (
    <div 
      className={cn(
        "flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16",
        "rounded-full flex items-center justify-center",
        "text-lg sm:text-xl md:text-2xl border-2 sm:border-3 md:border-4",
        "transition-all duration-300 shadow-sm hover:shadow-md",
        isActive 
          ? 'bg-primary text-white border-primary shadow-lg' 
          : 'bg-background border-primary/30 text-primary hover:border-primary/50'
      )}
      aria-hidden="true"
    >
      {event.icon}
    </div>
  )

  /**
   * Renders the event header with year and category
   * @returns {JSX.Element} Event header component
   */
  const renderEventHeader = () => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-4 mb-1 sm:mb-2">
      <span 
        className="
          text-lg sm:text-xl md:text-2xl font-bold text-primary
          transition-colors duration-200
        "
      >
        {event.year}
      </span>
      <span 
        className={cn(
          "text-xs sm:text-sm px-2 py-0.5 sm:px-2 sm:py-1 rounded-full self-start",
          "font-medium transition-all duration-200",
          "bg-primary/10 text-primary border border-primary/20",
          "hover:bg-primary/20 hover:border-primary/30"
        )}
      >
        {event.category}
      </span>
    </div>
  )

  /**
   * Renders the event title
   * @returns {JSX.Element} Event title component
   */
  const renderEventTitle = () => (
    <h3 
      className="
        text-base sm:text-lg md:text-xl font-bold text-foreground 
        mb-1 sm:mb-2 line-clamp-2 transition-colors duration-200
        group-hover:text-primary
      "
    >
      {event.title}
    </h3>
  )

  /**
   * Renders the event description
   * @returns {JSX.Element} Event description component
   */
  const renderEventDescription = () => (
    <p 
      className="
        text-foreground/70 text-xs sm:text-sm md:text-base 
        leading-relaxed line-clamp-2 sm:line-clamp-3
        transition-colors duration-200
      "
    >
      {event.description}
    </p>
  )

  /**
   * Renders the event date
   * @returns {JSX.Element} Event date component
   */
  const renderEventDate = () => (
    <div 
      className="
        text-xs text-foreground/50 mt-1 sm:mt-2 
        transition-colors duration-200
      "
    >
      {event.date}
    </div>
  )

  /**
   * Renders the expand/collapse indicator
   * @returns {JSX.Element} Expand indicator component
   */
  const renderExpandIndicator = () => (
    <div 
      className={cn(
        "flex-shrink-0 transition-all duration-300 self-center sm:self-auto",
        "group-hover:scale-110",
        isActive ? 'rotate-180 text-primary' : 'text-primary/70'
      )}
      aria-hidden="true"
    >
      <svg 
        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 9l-7 7-7-7" 
        />
      </svg>
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div 
      className={cn(
        // Base styles
        "relative flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4",
        "p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border-2",
        "transition-all duration-300 cursor-pointer w-full group",
        
        // Hover effects
        "hover:scale-[1.01] sm:hover:scale-[1.02]",
        "hover:shadow-sm sm:hover:shadow-md",
        
        // Active state
        isActive 
          ? 'bg-primary/10 border-primary shadow-sm sm:shadow-md' 
          : 'bg-background border-border hover:border-primary/50'
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`${event.title} - ${event.year}. Click to ${isActive ? 'collapse' : 'expand'} details.`}
    >
      {/* Timeline Connector Line */}
      {renderConnectorLine()}
      
      {/* Event Icon */}
      {renderEventIcon()}
      
      {/* Content Container */}
      <div className="flex-1 min-w-0 w-full">
        {renderEventHeader()}
        {renderEventTitle()}
        {renderEventDescription()}
        {renderEventDate()}
      </div>
      
      {/* Expand/Collapse Indicator */}
      {renderExpandIndicator()}
    </div>
  )
}

/**
 * TimelineItem Prop Types (for documentation)
 * 
 * @typedef {Object} TimelineItemProps
 * @property {TimelineEvent} event - Timeline event data object
 * @property {boolean} isActive - Whether the item is currently expanded
 * @property {Function} onClick - Click handler for expand/collapse
 * @property {Function} [onKeyDown] - Keyboard event handler for accessibility
 */