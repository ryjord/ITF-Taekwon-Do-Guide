/**
 * QuizCategoryCard Component
 * 
 * A reusable category selection card component that displays quiz category information
 * and allows users to select/deselect categories with visual feedback.
 * 
 * Features:
 * - Interactive category selection with toggle behavior
 * - Visual feedback for selected state with color changes and shadows
 * - Hover effects with scale transformation and shadow elevation
 * - Accessibility support with proper semantic markup and ARIA attributes
 * - Responsive design with proper text hierarchy and spacing
 * - Category metadata display including icon, description, and quiz count
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.category - Category object containing:
 *   @param {string} category.id - Unique identifier for the category
 *   @param {string} category.name - Display name of the category
 *   @param {string} category.description - Brief description of the category content
 *   @param {string} category.icon - Emoji or icon representing the category
 *   @param {number} category.totalQuizzes - Number of quizzes available in this category
 * @param {boolean} props.isSelected - Whether the category is currently selected
 * @param {Function} props.onClick - Callback function when category card is clicked
 * @returns {JSX.Element} Category card interface
 */
export const QuizCategoryCard = ({ category, isSelected, onClick }) => {
  /**
   * Handles category card click event
   */
  const handleClick = () => {
    onClick()
  }

  /**
   * Handles keyboard interaction for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        p-6 rounded-2xl border-2 transition-all duration-300 text-left 
        hover:scale-105 hover:shadow-lg w-full h-full
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${isSelected
          ? 'bg-primary text-white border-primary shadow-md transform scale-105'
          : 'bg-background border-border hover:border-primary/50'
        }
      `}
      aria-pressed={isSelected}
      aria-label={`
        ${category.name} category: ${category.description}. 
        ${category.totalQuizzes} quizzes available.
        ${isSelected ? 'Currently selected' : 'Click to select'}
      `}
    >
      {/* Category Icon */}
      <div 
        className="text-3xl mb-3" 
        aria-hidden="true"
        role="img"
      >
        {category.icon}
      </div>

      {/* Category Name */}
      <h3 className="text-xl font-bold mb-2">
        {category.name}
      </h3>
      
      {/* Category Description */}
      <p 
        className={`
          text-sm leading-relaxed mb-4
          ${isSelected ? 'opacity-90' : 'opacity-80'}
        `}
      >
        {category.description}
      </p>

      {/* Quiz Count */}
      <div 
        className={`
          text-xs mt-3 pt-3 border-t
          ${isSelected 
            ? 'opacity-80 border-white/30' 
            : 'opacity-70 border-border'
          }
        `}
        aria-label={`${category.totalQuizzes} quizzes available in this category`}
      >
        {category.totalQuizzes} quizzes available
      </div>
    </button>
  )
}