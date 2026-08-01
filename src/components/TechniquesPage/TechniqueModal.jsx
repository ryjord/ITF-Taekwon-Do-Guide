import { useEffect, useCallback } from 'react'

/**
 * TechniqueModal Component
 * 
 * Comprehensive modal dialog that displays detailed information about
 * a specific ITF Taekwon-Do technique with step-by-step guidance,
 * applications, and common mistakes.
 * 
 * Features:
 * - Full technique breakdown with Korean and English names
 * - Step-by-step execution instructions
 * - Practical application guidance
 * - Common mistakes and corrections
 * - Keyboard accessibility and escape key support
 * - Responsive design with proper overflow handling
 * 
 * @param {Object} props - Component properties
 * @param {Object|null} props.technique - Technique data object or null when closed
 * @param {boolean} props.isOpen - Whether the modal is currently open
 * @param {Function} props.onClose - Callback function to close the modal
 * @returns {JSX.Element} Technique modal dialog component
 */
export const TechniqueModal = ({ technique, isOpen, onClose }) => {
  // ===== EFFECTS =====

  /**
   * Handles keyboard events for accessibility (Escape key to close)
   */
  useEffect(() => {
    /**
     * Handles Escape key press to close modal
     * @param {KeyboardEvent} event - Keyboard event
     */
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden'
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  /**
   * Handles backdrop click to close modal
   * @param {React.MouseEvent} event - Mouse event
   */
  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }, [onClose])

  /**
   * Handles close button click
   */
  const handleCloseClick = useCallback(() => {
    onClose()
  }, [onClose])

  // ===== EARLY RETURNS =====

  // Return null if modal is not open or technique data is missing
  if (!isOpen || !technique) return null

  // ===== RENDER METHODS =====

  /**
   * Renders the modal header with technique names and close button
   * @returns {JSX.Element} Modal header component
   */
  const renderModalHeader = () => (
    <div className="border-b border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary" id="technique-modal-title">
            {technique.korean}
          </h3>
          <p className="text-foreground/80 font-semibold mt-1">
            {technique.english}
          </p>
        </div>
        <button
          onClick={handleCloseClick}
          className="
            text-foreground/60 hover:text-foreground transition-colors p-2 rounded-lg 
            hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          "
          aria-label="Close technique details"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </div>
  )

  /**
   * Renders the technique image or placeholder
   * @returns {JSX.Element} Technique image component
   */
  const renderTechniqueImage = () => (
    <div 
      className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 flex items-center justify-center min-h-64"
      role="img"
      aria-label={`Visual demonstration of ${technique.english} technique`}
    >
      {technique.image ? (
        <img 
          src={technique.image} 
          alt={`${technique.english} technique execution`}
          className="max-w-full max-h-48 object-contain rounded-lg"
        />
      ) : (
        <div className="text-center">
          <div className="text-6xl mb-4" aria-hidden="true">👊</div>
          <p className="text-foreground/60 text-sm">
            Technique diagram for {technique.english}
          </p>
          <p className="text-foreground/40 text-xs mt-2">
            [Add technique photo to JSON data]
          </p>
        </div>
      )}
    </div>
  )

  /**
   * Renders the detailed technique description
   * @returns {JSX.Element} Description component
   */
  const renderDescription = () => (
    <div>
      <h4 className="font-semibold text-foreground mb-3">Technique Description</h4>
      <p className="text-foreground/70 leading-relaxed">
        {technique.detailedDescription}
      </p>
    </div>
  )

  /**
   * Renders step-by-step execution instructions
   * @returns {JSX.Element} Execution steps component
   */
  const renderExecutionSteps = () => (
    <div>
      <h4 className="font-semibold text-foreground mb-3">Execution Steps</h4>
      <ol 
        className="text-foreground/70 space-y-3 text-sm"
        role="list"
        aria-label="Step-by-step execution instructions"
      >
        {technique.steps.map((step, index) => (
          <li key={index} className="flex items-start">
            <span 
              className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )

  /**
   * Renders practical application guidance
   * @returns {JSX.Element} Application component
   */
  const renderApplication = () => (
    <div 
      className="bg-primary/5 border border-primary/10 rounded-lg p-4"
      role="region"
      aria-label="Practical application guidance"
    >
      <h4 className="font-semibold text-foreground mb-2">Practical Application</h4>
      <p className="text-foreground/70 text-sm leading-relaxed">
        {technique.application}
      </p>
    </div>
  )

  /**
   * Renders common mistakes and corrections
   * @returns {JSX.Element} Common mistakes component
   */
  const renderCommonMistakes = () => (
    <div>
      <h4 className="font-semibold text-foreground mb-3">Common Mistakes to Avoid</h4>
      <ul 
        className="text-foreground/70 space-y-2 text-sm"
        role="list"
        aria-label="Common technique mistakes"
      >
        {technique.commonMistakes.map((mistake, index) => (
          <li key={index} className="flex items-start">
            <span className="text-primary mr-2 mt-0.5 flex-shrink-0" aria-hidden="true">•</span>
            <span>{mistake}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="technique-modal-title"
      aria-describedby="technique-modal-description"
    >
      <div 
        className="
          bg-background border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] 
          overflow-y-auto shadow-2xl
        "
        id="technique-modal-description"
      >
        {renderModalHeader()}
        
        <div className="p-6 space-y-8">
          {renderTechniqueImage()}
          {renderDescription()}
          {renderExecutionSteps()}
          {renderApplication()}
          {renderCommonMistakes()}
        </div>
      </div>
    </div>
  )
}