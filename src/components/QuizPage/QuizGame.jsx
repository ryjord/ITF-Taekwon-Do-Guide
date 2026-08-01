import { useState, useEffect, useRef } from 'react'
import { MCQGame } from './games/MCQGame'
import { FlashcardGame } from './games/FlashCardGame'
import { MatchingGame } from './games/MatchingGame'
import { TranslationGame } from './games/TranslationGame'
import { WordSearchGame } from './games/WordSearchGame'
import { useScrollTo } from '../../hooks/useScrollTo'
import { useGlobalProgress } from '../../hooks/useGlobalProgess'
import { CrosswordGame } from './games/CrosswordGame'

/**
 * QuizGame Component
 * 
 * Main game container component that manages the game lifecycle and renders
 * the appropriate game type based on quiz configuration.
 * 
 * Features:
 * - Game state management (ready, playing, finished)
 * - Achievement tracking and celebration
 * - Progress recording to global state
 * - Responsive game routing based on quiz type
 * - Auto-scroll behavior for better UX
 * - Comprehensive results display
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.quiz - Quiz configuration object containing:
 *   @param {string} quiz.id - Unique identifier for the quiz
 *   @param {string} quiz.title - Display title of the quiz
 *   @param {string} quiz.description - Brief description of the quiz
 *   @param {string} quiz.gameType - Type of game ('mcq', 'flashcards', 'matching', 'translation', 'wordsearch')
 *   @param {string} quiz.category - Category of the quiz
 *   @param {number} quiz.points - Total points available
 *   @param {number} quiz.timeLimit - Time limit in seconds
 *   @param {number} [quiz.questionCount] - Number of questions (for MCQ/Translation)
 *   @param {Array} [quiz.cards] - Array of cards (for Flashcard games)
 *   @param {Array} [quiz.pairs] - Array of pairs (for Matching games)
 * @param {Function} props.onBack - Callback function to return to quiz selection
 * @returns {JSX.Element} Complete game interface with state management
 */
export const QuizGame = ({ quiz, onBack }) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[string, Function]} Current game state: 'ready', 'playing', or 'finished' */
  const [gameState, setGameState] = useState('ready')
  
  /** @type {[Object|null, Function]} Results object from completed game */
  const [gameResults, setGameResults] = useState(null)
  
  /** @type {[Array, Function]} Array of newly unlocked achievement IDs */
  const [newAchievements, setNewAchievements] = useState([])

  // ===== HOOKS & REFERENCES =====
  
  /** Custom hook for smooth scrolling to top of page */
  const scrollToTop = useScrollTo()
  
  /** Zustand hook for recording game progress and achievements */
  const recordGameCompletion = useGlobalProgress((state) => state.recordGameCompletion)

  // ===== EFFECTS =====

  /**
   * Auto-scroll to top when game state changes to playing or finished
   * Ensures users see the current game state without manual scrolling
   */
  useEffect(() => {
    if (gameState === 'playing' || gameState === 'finished') {
      scrollToTop()
    }
  }, [gameState, scrollToTop])

  // ===== GAME LIFECYCLE HANDLERS =====

  /**
   * Handles game completion with progress recording and achievement tracking
   * @param {Object} results - Game results object from the completed game
   */
  const handleGameComplete = async (results) => {
    // Prepare progress data with quiz metadata
    const progressData = {
      ...results,
      gameType: quiz.gameType,
      category: quiz.category,
      score: results.score || 0,
      timeUsed: results.timeUsed || 0
    }
    
    try {
      // Record game completion and check for new achievements
      const { newAchievements: earnedAchievements } = await recordGameCompletion(progressData)

      // Display new achievements if any were unlocked
      if (earnedAchievements.length > 0) {
        setNewAchievements(earnedAchievements)
      }
      
      // Update state with game results
      setGameResults(results)
      setGameState('finished')
    } catch (error) {
      console.error('Error recording progress:', error)
      // Still show results even if progress recording fails
      setGameResults(results)
      setGameState('finished')
    }
  }

  /**
   * Resets game state to allow playing again
   * Clears results and achievements from previous game
   */
  const handlePlayAgain = () => {
    setGameState('ready')
    setGameResults(null)
    setNewAchievements([])
  }

  /**
   * Starts the game with a slight delay for smooth transition
   */
  const handleStartGame = () => {
    setGameState('playing')
    // Small delay to ensure DOM is ready before scrolling
    setTimeout(() => {
      scrollToTop()
    }, 100)
  }

  // ===== GAME RENDERING =====

  /**
   * Renders the appropriate game component based on quiz type
   * @returns {JSX.Element} The game component for the current quiz type
   */
  const renderGame = () => {
    switch (quiz.gameType) {
      case 'mcq':
        return <MCQGame quiz={quiz} onComplete={handleGameComplete} />
      case 'flashcards':
        return <FlashcardGame quiz={quiz} onComplete={handleGameComplete} />
      case 'matching':
        return <MatchingGame quiz={quiz} onComplete={handleGameComplete} />
      case 'translation':
        return <TranslationGame quiz={quiz} onComplete={handleGameComplete} />
      case 'wordsearch':
        return <WordSearchGame quiz={quiz} onComplete={handleGameComplete} />
      case 'crossword':
        return <CrosswordGame quiz={quiz} onComplete={handleGameComplete} />
      default:
        return (
          <div className="text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Game Coming Soon</h2>
            <p className="text-foreground/70">This game type is under development!</p>
          </div>
        )
    }
  }

  /**
   * Renders achievement celebration banner when new achievements are unlocked
   * @returns {JSX.Element} Achievement celebration component
   */
  const renderAchievementCelebration = () => (
    <div 
      className="bg-yellow-100 border border-yellow-400 rounded-xl p-4 mb-4"
      role="alert"
      aria-live="polite"
    >
      <h3 className="text-lg font-bold text-yellow-800 mb-2">🎉 New Achievements Unlocked!</h3>
      <div className="flex justify-center gap-2">
        {newAchievements.map(achievementId => (
          <div 
            key={achievementId} 
            className="bg-yellow-200 px-3 py-1 rounded-full text-sm"
          >
            {achievementId}
          </div>
        ))}
      </div>
    </div>
  )

  /**
   * Renders statistics box for completion screen
   * @param {string|number} value - The statistic value
   * @param {string} label - The statistic label
   * @returns {JSX.Element} Statistic box component
   */
  const renderStatBox = (value, label) => (
    <div className="bg-primary/10 rounded-xl p-4">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-foreground/70">{label}</div>
    </div>
  )

  /**
   * Gets the appropriate item type label based on quiz configuration
   * @returns {string} Item type label
   */
  const getItemType = () => {
    if (quiz.questionCount) return 'Questions'
    if (quiz.cards) return 'Cards'
    if (quiz.pairs) return 'Pairs'
    return 'Items'
  }

  /**
   * Gets the item count based on quiz configuration
   * @returns {number} Number of items in the quiz
   */
  const getItemCount = () => {
    return quiz.questionCount || quiz.cards?.length || quiz.pairs?.length || 0
  }

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-primary hover:text-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          aria-label="Back to quizzes"
        >
          <svg 
            className="w-5 h-5 mr-2" 
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
          Back to Quizzes
        </button>
        
        {/* Quiz Title and Description */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">{quiz.title}</h1>
          <p className="text-foreground/70">{quiz.description}</p>
        </div>

        {/* Spacer for layout balance */}
        <div className="w-20" aria-hidden="true"></div>
      </div>

      {/* Main Game Content */}
      <div className="bg-background border border-border rounded-2xl p-8">
        {/* Ready State */}
        {gameState === 'ready' && (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4" aria-hidden="true">🎯</div>
            <h2 className="text-2xl font-bold text-foreground">Ready to Start?</h2>
            <p className="text-foreground/70 max-w-md mx-auto">
              {quiz.questionCount && `${quiz.questionCount} questions • `}
              {quiz.cards && `${quiz.cards.length} cards • `}
              {quiz.pairs && `${quiz.pairs.length} pairs to match • `}
              {Math.floor(quiz.timeLimit / 60)} minute time limit
            </p>
            <button
              onClick={handleStartGame}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Start the game"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && renderGame()}

        {/* Finished State */}
        {gameState === 'finished' && gameResults && (
          <div className="text-center space-y-6">
            {/* Achievement Celebration */}
            {newAchievements.length > 0 && renderAchievementCelebration()}
            
            <div className="text-6xl mb-4" aria-hidden="true">🏆</div>
            <h2 className="text-3xl font-bold text-foreground">Game Complete!</h2>
            
            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {renderStatBox(gameResults.score, 'Score')}
              
              {gameResults.totalQuestions && 
                renderStatBox(
                  `${gameResults.correctAnswers}/${gameResults.totalQuestions}`, 
                  'Correct'
                )
              }
              
              {gameResults.totalCards && 
                renderStatBox(
                  `${gameResults.rememberedCards}/${gameResults.totalCards}`, 
                  'Remembered'
                )
              }
              
              {gameResults.totalPairs && 
                renderStatBox(
                  `${gameResults.matchedPairs}/${gameResults.totalPairs}`, 
                  'Matched'
                )
              }
              
              {renderStatBox(
                `${Math.floor(gameResults.timeUsed / 60)}:${gameResults.timeUsed % 60 < 10 ? '0' : ''}${gameResults.timeUsed % 60}`,
                'Time Used'
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePlayAgain}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Play this game again"
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                aria-label="Return to quiz selection"
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Information Footer */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
        <div className="bg-primary/10 rounded-lg p-3">
          <div className="font-semibold text-primary">
            {getItemType()}
          </div>
          <div>{getItemCount()}</div>
        </div>
        <div className="bg-primary/10 rounded-lg p-3">
          <div className="font-semibold text-primary">Time Limit</div>
          <div>{Math.floor(quiz.timeLimit / 60)} minutes</div>
        </div>
        <div className="bg-primary/10 rounded-lg p-3">
          <div className="font-semibold text-primary">Points</div>
          <div>{quiz.points} total</div>
        </div>
      </div>
    </div>
  )
}