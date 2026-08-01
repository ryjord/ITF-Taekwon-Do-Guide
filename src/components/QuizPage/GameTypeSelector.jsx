/**
 * GameTypeSelector Component
 * 
 * A reusable game type selector component that allows users to choose
 * from different game types with detailed information and visual feedback.
 * 
 * Features:
 * - Toggle selection (select/deselect same game type)
 * - Visual feedback for selected state with icons and descriptions
 * - Responsive design with flex wrapping
 * - Accessibility support with proper ARIA attributes
 * - Smooth transitions and hover effects
 * - Detailed game type information display
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.gameTypes - Array of game type objects containing:
 *   @param {string} gameType.id - Unique identifier for the game type
 *   @param {string} gameType.name - Display name of the game type
 *   @param {string} gameType.description - Brief description of the game type
 *   @param {string} gameType.icon - Emoji or icon representing the game type
 * @param {string|null} props.selectedGameType - Currently selected game type ID or null
 * @param {Function} props.onGameTypeSelect - Callback function when game type is selected/deselected
 * @returns {JSX.Element} Game type selector interface
 */
export const GameTypeSelector = ({ 
  gameTypes, 
  selectedGameType, 
  onGameTypeSelect 
}) => {
  /**
   * Handles game type selection with toggle behavior
   * Clicking the same game type again will deselect it
   * @param {string} gameTypeId - The ID of the game type to select/deselect
   */
  const handleGameTypeClick = (gameTypeId) => {
    onGameTypeSelect(
      selectedGameType === gameTypeId ? null : gameTypeId
    )
  }

  /**
   * Renders individual game type button component
   * @param {Object} gameType - Game type object containing id, name, description, and icon
   * @returns {JSX.Element} Game type button component
   */
  const renderGameTypeButton = (gameType) => {
    const isSelected = selectedGameType === gameType.id
    
    return (
      <button
        key={gameType.id}
        onClick={() => handleGameTypeClick(gameType.id)}
        className={`
          flex items-center px-5 py-3 rounded-xl border-2 transition-all duration-200 
          font-medium w-full sm:w-auto min-w-[280px] max-w-[320px]
          ${isSelected
            ? 'bg-primary text-white border-primary shadow-md transform scale-105'
            : 'bg-background border-border hover:bg-primary/10 hover:border-primary/50 hover:scale-105'
          }
        `}
        aria-pressed={isSelected}
        aria-label={`${gameType.name} game type: ${gameType.description}. ${isSelected ? 'Selected' : 'Click to select'}`}
      >
        {/* Game Type Icon */}
        <span 
          className="text-xl mr-3 flex-shrink-0" 
          aria-hidden="true"
          role="img"
        >
          {gameType.icon}
        </span>
        
        {/* Game Type Information */}
        <div className="text-left flex-1 min-w-0">
          <div className="font-semibold text-base leading-tight">
            {gameType.name}
          </div>
          <div 
            className={`text-xs leading-snug mt-1 ${
              isSelected ? 'opacity-90' : 'opacity-80'
            }`}
          >
            {gameType.description}
          </div>
        </div>
      </button>
    )
  }

  return (
    <div 
      className="flex flex-wrap justify-center gap-3"
      role="group" 
      aria-label="Select game type"
    >
      {gameTypes.map(renderGameTypeButton)}
    </div>
  )
}