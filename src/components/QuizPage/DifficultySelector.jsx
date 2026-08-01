/**
 * DifficultySelector Component
 * 
 * A reusable difficulty level selector component that allows users to choose
 * from predefined difficulty options with visual feedback and toggle behavior.
 * 
 * Features:
 * - Toggle selection (select/deselect same difficulty)
 * - Visual feedback for selected state
 * - Responsive design with flex wrapping
 * - Accessibility support
 * - Smooth transitions and hover effects
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.difficulties - Array of difficulty objects with id, name, and icon
 * @param {string|null} props.selectedDifficulty - Currently selected difficulty ID or null
 * @param {Function} props.onDifficultySelect - Callback function when difficulty is selected/deselected
 * @returns {JSX.Element} Difficulty selector interface
 */
export const DifficultySelector = ({ 
  difficulties, 
  selectedDifficulty, 
  onDifficultySelect 
}) => {
  /**
   * Handles difficulty selection with toggle behavior
   * Clicking the same difficulty again will deselect it
   * @param {string} difficultyId - The ID of the difficulty to select/deselect
   */
  const handleDifficultyClick = (difficultyId) => {
    onDifficultySelect(
      selectedDifficulty === difficultyId ? null : difficultyId
    )
  }

  /**
   * Renders individual difficulty button component
   * @param {Object} difficulty - Difficulty object containing id, name, and icon
   * @returns {JSX.Element} Difficulty button component
   */
  const renderDifficultyButton = (difficulty) => {
    const isSelected = selectedDifficulty === difficulty.id
    
    return (
      <button
        key={difficulty.id}
        onClick={() => handleDifficultyClick(difficulty.id)}
        className={`
          px-6 py-3 rounded-full border-2 transition-all duration-200 font-medium
          flex items-center justify-center
          ${isSelected
            ? 'bg-primary text-white border-primary shadow-md transform scale-105'
            : 'bg-background border-border hover:bg-primary/10 hover:border-primary/50 hover:scale-105'
          }
        `}
        aria-pressed={isSelected}
        aria-label={`${difficulty.name} difficulty ${isSelected ? 'selected' : ''}`}
      >
        <span className="mr-2 text-lg" aria-hidden="true">
          {difficulty.icon}
        </span>
        {difficulty.name}
      </button>
    )
  }

  return (
    <div 
      className="flex flex-wrap justify-center gap-4"
      role="group" 
      aria-label="Select difficulty level"
    >
      {difficulties.map(renderDifficultyButton)}
    </div>
  )
}