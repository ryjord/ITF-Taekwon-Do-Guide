/**
 * QuizCard Component
 * 
 * A reusable quiz card component that displays quiz information and allows selection.
 * Provides comprehensive quiz details including type, difficulty, duration, and points.
 * 
 * Features:
 * - Interactive card with hover effects and selection capability
 * - Visual difficulty indicators with color coding
 * - Responsive design with proper spacing and typography
 * - Accessibility support with proper semantic markup
 * - Dynamic content based on quiz type and properties
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.quiz - Quiz object containing:
 *   @param {string} quiz.id - Unique identifier for the quiz
 *   @param {string} quiz.title - Display title of the quiz
 *   @param {string} quiz.description - Brief description of the quiz content
 *   @param {string} quiz.difficulty - Difficulty level ('easy', 'medium', 'hard')
 *   @param {number} quiz.points - Total points available for the quiz
 *   @param {number} quiz.timeLimit - Time limit in seconds
 *   @param {number} [quiz.questionCount] - Optional number of questions
 *   @param {number} [quiz.cards] - Optional number of cards for flashcard games
 *   @param {number} [quiz.pairs] - Optional number of pairs for matching games
 * @param {Object} props.gameType - Game type information containing:
 *   @param {string} gameType.id - Unique identifier for the game type
 *   @param {string} gameType.name - Display name of the game type
 *   @param {string} gameType.icon - Emoji or icon representing the game type
 * @param {Function} props.onSelect - Callback function when quiz card is clicked
 * @returns {JSX.Element} Quiz card interface
 */
export const QuizCard = ({ quiz, gameType, onSelect }) => {
  /**
   * Determines the appropriate background color class based on difficulty level
   * @param {string} difficulty - The difficulty level ('easy', 'medium', 'hard')
   * @returns {string} Tailwind CSS class for the background color
   */
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-500',
      medium: 'bg-blue-500', 
      hard: 'bg-red-500'
    }
    return colors[difficulty] || 'bg-gray-500'
  }

  /**
   * Calculates and formats the time limit for display
   * @returns {string} Formatted time string (e.g., "5 min")
   */
  const getFormattedTime = () => {
    return `${Math.floor(quiz.timeLimit / 60)} min`
  }

  /**
   * Gets the appropriate item count text based on quiz type
   * @returns {string|null} Formatted item count or null if not applicable
   */
  const getItemCount = () => {
    if (quiz.questionCount) return `${quiz.questionCount} questions`
    if (quiz.cards) return `${quiz.cards.length} cards`
    if (quiz.pairs) return `${quiz.pairs.length} pairs`
    return null
  }

  /**
   * Handles card click event
   */
  const handleCardClick = () => {
    onSelect(quiz)
  }

  /**
   * Handles keyboard interaction for accessibility
   * @param {React.KeyboardEvent} event - Keyboard event
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick()
    }
  }

  return (
    <div 
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="
        bg-background border border-border rounded-2xl p-6 
        hover:shadow-lg hover:border-primary/50 hover:scale-105 
        transition-all duration-300 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      "
      role="button"
      tabIndex={0}
      aria-label={`Select ${quiz.title} quiz - ${quiz.description}. Difficulty: ${quiz.difficulty}. Points: ${quiz.points}.`}
    >
      {/* Header: Game Type & Difficulty */}
      <div className="flex items-center justify-between mb-3">
        {/* Game Type Info */}
        <div className="flex items-center gap-2" aria-label={`Game type: ${gameType?.name}`}>
          <span className="text-xl" aria-hidden="true">{gameType?.icon}</span>
          <span className="text-sm text-foreground/70">{gameType?.name}</span>
        </div>
        
        {/* Difficulty & Points */}
        <div className="flex items-center gap-2">
          <span 
            className={`
              px-2 py-1 rounded-full text-xs font-medium text-white 
              ${getDifficultyColor(quiz.difficulty)}
            `}
            aria-label={`Difficulty: ${quiz.difficulty}`}
          >
            {quiz.difficulty.toUpperCase()}
          </span>
          <span className="text-sm text-foreground/60" aria-label={`Points: ${quiz.points}`}>
            {quiz.points} pts
          </span>
        </div>
      </div>

      {/* Quiz Title */}
      <h3 className="text-xl font-bold text-foreground mb-2">
        {quiz.title}
      </h3>
      
      {/* Quiz Description */}
      <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
        {quiz.description}
      </p>

      {/* Footer: Quiz Metadata */}
      <div className="flex items-center justify-between text-sm text-foreground/60">
        {/* Quiz Statistics */}
        <div className="flex items-center gap-4">
          {getItemCount() && (
            <span aria-label={getItemCount()}>
              {getItemCount()}
            </span>
          )}
          <span aria-label={`Time limit: ${getFormattedTime()}`}>
            {getFormattedTime()}
          </span>
        </div>
        
        {/* Action Button */}
        <button 
          className="
            text-primary hover:text-primary-hover font-medium
            focus:outline-none focus:underline
          "
          onClick={handleCardClick}
          aria-label={`Start ${gameType?.name} game: ${quiz.title}`}
        >
          Start {gameType?.name} →
        </button>
      </div>
    </div>
  )
}