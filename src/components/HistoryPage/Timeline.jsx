import { useState } from 'react'
import { TimelineItem } from './TimelineItem'

/**
 * Timeline Component
 * 
 * Professional interactive timeline component for displaying ITF Taekwondo history
 * with expandable details, smooth animations, and comprehensive event information.
 * 
 * Features:
 * - Interactive timeline with expandable event details
 * - Responsive design optimized for all screen sizes
 * - Professional animations and smooth transitions
 * - Categorized event display with visual indicators
 * - Accessibility-compliant navigation and interactions
 * - Comprehensive historical data with additional context
 * 
 * @param {Object} props - Component properties
 * @param {Array<TimelineEvent>} props.events - Array of timeline event objects
 * 
 * @returns {JSX.Element} Interactive timeline component
 * 
 * @example
 * <Timeline events={timelineData} />
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
 * @property {string} category - Event category for grouping
 * @property {Object} detailed - Detailed event information
 * @property {string} detailed.background - Historical background context
 * @property {string} detailed.significance - Importance and impact
 * @property {Array<string>} [detailed.keyFigures] - Important people involved
 * @property {Array<string>} [detailed.foundingCountries] - Countries involved
 * @property {Array<string>} [detailed.volumes] - Publication volumes
 * @property {string} [detailed.impact] - Historical impact description
 * @property {string} [detailed.lastWords] - Significant quotes
 * @property {Array<string>} [detailed.majorGroups] - Organizational groups
 * @property {string} [detailed.currentState] - Current status description
 */

export const Timeline = ({ events }) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[string|null, Function]} Currently active/expanded event ID */
  const [activeEvent, setActiveEvent] = useState(null)

  // ===== EVENT HANDLERS =====

  /**
   * Handles event selection and toggle functionality
   * @param {string} eventId - ID of the event to toggle
   */
  const handleEventToggle = (eventId) => {
    setActiveEvent(activeEvent === eventId ? null : eventId)
  }

  /**
   * Handles keyboard navigation for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   * @param {string} eventId - Event ID to select
   */
  const handleEventKeyDown = (event, eventId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleEventToggle(eventId)
    }
  }

  // ===== RENDER METHODS =====

  /**
   * Renders the main timeline line with gradient effect
   * @returns {JSX.Element} Timeline line component
   */
  const renderTimelineLine = () => (
    <div 
      className="
        absolute left-2 sm:left-4 md:left-8 top-0 bottom-0 w-0.5 
        bg-gradient-to-b from-primary via-primary/50 to-primary/30 
        rounded-full hidden sm:block shadow-lg
      "
      aria-hidden="true"
    />
  )

  /**
   * Renders detailed content for active events
   * @param {TimelineEvent} event - Event data object
   * @returns {JSX.Element} Detailed content component
   */
  const renderEventDetails = (event) => {
    if (activeEvent !== event.id) return null

    return (
      <div 
        className="
          mt-2 sm:mt-3 ml-0 sm:ml-12 md:ml-20 p-3 sm:p-4 md:p-6 
          bg-gradient-to-r from-primary/5 to-primary/10 
          border border-primary/20 rounded-lg sm:rounded-xl md:rounded-2xl 
          w-full animate-fade-in
        "
        role="region"
        aria-label={`Detailed information for ${event.title}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full">
          {/* Background Information */}
          <div className="w-full">
            <h4 className="font-semibold text-foreground mb-1 sm:mb-2 text-xs sm:text-sm md:text-base flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2" aria-hidden="true"></span>
              Historical Background
            </h4>
            <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed w-full">
              {event.detailed.background}
            </p>
          </div>
          
          {/* Significance */}
          <div className="w-full">
            <h4 className="font-semibold text-foreground mb-1 sm:mb-2 text-xs sm:text-sm md:text-base flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2" aria-hidden="true"></span>
              Historical Significance
            </h4>
            <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed w-full">
              {event.detailed.significance}
            </p>
          </div>
          
          {/* Dynamic Additional Details */}
          {renderAdditionalDetails(event)}
        </div>
      </div>
    )
  }

  /**
   * Renders dynamic additional details based on event type
   * @param {TimelineEvent} event - Event data object
   * @returns {JSX.Element} Additional details components
   */
  const renderAdditionalDetails = (event) => {
    const details = []

    // Key Figures
    if (event.detailed.keyFigures) {
      details.push(
        <div key="keyFigures" className="md:col-span-2 w-full">
          <h4 className="font-semibold text-foreground mb-1 sm:mb-2 text-xs sm:text-sm md:text-base flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2" aria-hidden="true"></span>
            Key Historical Figures
          </h4>
          <div className="flex flex-wrap gap-1 sm:gap-2 w-full">
            {event.detailed.keyFigures.map((figure, idx) => (
              <span 
                key={idx}
                className="
                  bg-primary/20 text-primary px-2 py-0.5 sm:px-3 sm:py-1 
                  rounded-full text-xs font-medium shadow-sm
                  hover:bg-primary/30 transition-colors duration-200
                "
              >
                {figure}
              </span>
            ))}
          </div>
        </div>
      )
    }

    // Founding Countries
    if (event.detailed.foundingCountries) {
      details.push(
        <div key="foundingCountries" className="md:col-span-2 w-full">
          <h4 className="font-semibold text-foreground mb-1 sm:mb-2 text-xs sm:text-sm md:text-base flex items-center">
            <span className="w-2 h-2 bg-primary rounded-full mr-2" aria-hidden="true"></span>
            Founding Nations
          </h4>
          <div className="flex flex-wrap gap-1 sm:gap-2 w-full">
            {event.detailed.foundingCountries.map((country, idx) => (
              <span 
                key={idx}
                className="
                  bg-primary/20 text-primary px-2 py-0.5 sm:px-3 sm:py-1 
                  rounded-full text-xs font-medium shadow-sm
                  hover:bg-primary/30 transition-colors duration-200
                "
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      )
    }

    // Additional dynamic fields
    const additionalFields = {
      volumes: 'Publication Volumes',
      impact: 'Historical Impact',
      lastWords: 'Final Legacy',
      majorGroups: 'Major Organizations',
      currentState: 'Current Status'
    }

    Object.entries(additionalFields).forEach(([key, label]) => {
      if (event.detailed[key]) {
        details.push(
          <div key={key} className="md:col-span-2 w-full">
            <h4 className="font-semibold text-foreground mb-1 sm:mb-2 text-xs sm:text-sm md:text-base flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2" aria-hidden="true"></span>
              {label}
            </h4>
            {Array.isArray(event.detailed[key]) ? (
              <div className="flex flex-wrap gap-1 sm:gap-2 w-full">
                {event.detailed[key].map((item, idx) => (
                  <span 
                    key={idx}
                    className="
                      bg-primary/20 text-primary px-2 py-0.5 sm:px-3 sm:py-1 
                      rounded-full text-xs font-medium shadow-sm
                      hover:bg-primary/30 transition-colors duration-200
                    "
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-foreground/70 text-xs sm:text-sm leading-relaxed w-full">
                {event.detailed[key]}
              </p>
            )}
          </div>
        )
      }
    })

    return details
  }

  /**
   * Renders individual timeline event with interactive elements
   * @param {TimelineEvent} event - Event data object
   * @param {number} index - Event index for styling
   * @returns {JSX.Element} Timeline event component
   */
  const renderTimelineEvent = (event, index) => (
    <div 
      key={event.id}
      className="relative w-full animate-slide-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <TimelineItem 
        event={event}
        isActive={activeEvent === event.id}
        onClick={() => handleEventToggle(event.id)}
        onKeyDown={(e) => handleEventKeyDown(e, event.id)}
      />
      
      {renderEventDetails(event)}
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <section 
      className="relative w-full max-w-full mx-auto"
      role="region"
      aria-label="ITF Taekwondo Historical Timeline"
    >
      {renderTimelineLine()}
      
      <div 
        className="space-y-3 sm:space-y-6 relative w-full"
        role="list"
        aria-label="Historical events timeline"
      >
        {events.map(renderTimelineEvent)}
      </div>
    </section>
  )
}