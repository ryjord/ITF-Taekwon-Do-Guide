import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * FlashcardGame Component
 * 
 * A professional flashcard learning game that presents cards in random order,
 * tracks user progress, and provides audio pronunciation support.
 * 
 * Features:
 * - Randomized card order for better learning retention
 * - Flip animation with 3D perspective
 * - Audio pronunciation playback
 * - Progress tracking and scoring
 * - Time-based challenge
 * 
 * @param {Object} quiz - Quiz configuration object
 * @param {Function} onComplete - Callback when game completes
 * @returns {JSX.Element} Flashcard game interface
 */
export const FlashcardGame = ({ quiz, onComplete }) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[number, Function]} Current card index in shuffled deck */
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  
  /** @type {[boolean, Function]} Whether current card is flipped to show back */
  const [isFlipped, setIsFlipped] = useState(false)
  
  /** @type {[number, Function]} Current game score */
  const [score, setScore] = useState(0)
  
  /** @type {[number, Function]} Remaining time in seconds */
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit)
  
  /** @type {[string, Function]} Current game state: 'playing' | 'finished' */
  const [gameState, setGameState] = useState('playing')
  
  /** @type {[number, Function]} Count of correctly remembered cards */
  const [rememberedCards, setRememberedCards] = useState(0)
  
  /** @type {import('react').RefObject<number>} Timestamp when game started */
  const startTimeRef = useRef(Date.now())
  
  /** @type {import('react').RefObject<HTMLAudioElement>} Audio element reference */
  const audioRef = useRef(null)
  
  /** @type {[Array, Function]} Shuffled copy of quiz cards for random order */
  const [shuffledCards, setShuffledCards] = useState([])

  // ===== CALCULATED VALUES =====

  /**
   * Calculates points per card based on total quiz points and card count
   * Uses precise distribution to ensure perfect score equals total available points
   * @returns {number} Points awarded for each remembered card
   */
  const calculatePointsPerCard = useCallback(() => {
    // For perfect mathematical distribution, calculate base points per card
    const basePoints = Math.floor(quiz.points / quiz.cards.length)
    
    // Calculate remaining points after base distribution
    const remainingPoints = quiz.points - (basePoints * quiz.cards.length)
    
    // Return base points - we'll handle the remaining points at the end
    return basePoints
  }, [quiz.points, quiz.cards.length])

  /**
   * Gets the current card data from shuffled deck
   * @returns {Object|null} Current card object or null if not available
   */
  const currentCardData = shuffledCards[currentCardIndex]

  // ===== EFFECTS & INITIALIZATION =====

  /**
   * Initialize game by shuffling cards on component mount
   * Uses Fisher-Yates shuffle algorithm for true randomization
   */
  useEffect(() => {
    const shuffleCards = () => {
      const cards = [...quiz.cards]
      // Fisher-Yates shuffle algorithm
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[cards[i], cards[j]] = [cards[j], cards[i]]
      }
      setShuffledCards(cards)
    }

    shuffleCards()
  }, [quiz.cards])

  /**
   * Game timer effect - counts down remaining time
   * Automatically ends game when time reaches zero
   */
  useEffect(() => {
    if (timeLeft > 0 && gameState === 'playing') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishGame()
    }
  }, [timeLeft, gameState])

  // ===== GAME LOGIC =====

  /**
   * Plays audio pronunciation for current card if available
   * Handles errors gracefully to prevent game interruption
   */
  const playAudio = useCallback(() => {
    if (audioRef.current && currentCardData?.audio) {
      audioRef.current.play().catch(error => {
        console.warn('Audio playback failed:', error)
        // Gracefully handle audio errors without breaking game flow
      })
    }
  }, [currentCardData])

  /**
   * Handles card flip animation
   * Toggles between front and back of card
   */
  const handleCardFlip = useCallback(() => {
    setIsFlipped(prev => !prev)
  }, [])

  /**
 * Finalizes game results and triggers completion callback
 * Ensures perfect score calculation matches total available points
 * @param {number} finalScore - Final game score
 * @param {number} finalRemembered - Final count of remembered cards
 */
const finishGame = useCallback((finalScore = score, finalRemembered = rememberedCards) => {
  setGameState('finished')
  const timeUsed = quiz.timeLimit - timeLeft
  
  // Calculate remaining points that weren't distributed evenly
  const basePointsPerCard = Math.floor(quiz.points / quiz.cards.length)
  const distributedPoints = basePointsPerCard * quiz.cards.length
  const remainingPoints = quiz.points - distributedPoints
  
  // Ensure perfect score equals total available points
  const isPerfectScore = finalRemembered === quiz.cards.length
  let adjustedScore = finalScore
  
  // Add remaining points only for perfect scores
  if (isPerfectScore) {
    adjustedScore = quiz.points
  }
  
  // Standardized results object for progress tracking system
  const standardizedResults = {
    // Core game identification
    gameType: quiz.gameType,
    category: quiz.category,
    
    // Performance metrics
    score: adjustedScore,
    timeUsed: timeUsed,
    perfectScore: isPerfectScore,
    
    // Card-specific analytics
    totalCards: quiz.cards.length,
    rememberedCards: finalRemembered,
    
    // Advanced metrics for progress system
    completionRate: (finalRemembered / quiz.cards.length) * 100,
    timePerCard: timeUsed / quiz.cards.length,
    
    // Additional context for achievements
    shuffled: true, // Indicates cards were randomized
    totalPossiblePoints: quiz.points
  }
  
  // Trigger completion callback with standardized data
  onComplete(standardizedResults)
}, [score, rememberedCards, quiz, timeLeft, onComplete])

/**
 * Processes user response and advances to next card or ends game
 * @param {boolean} remembered - Whether user remembered the card correctly
 */
const handleNextCard = useCallback((remembered) => {
  const pointsPerCard = calculatePointsPerCard()
  
  // Calculate what the new values will be
  const newScore = remembered ? score + pointsPerCard : score
  const newRemembered = remembered ? rememberedCards + 1 : rememberedCards

  // Check if this is the last card
  const isLastCard = currentCardIndex >= shuffledCards.length - 1

  if (isLastCard) {
    // For the last card, finish the game immediately with the updated values
    finishGame(newScore, newRemembered)
  } else {
    // For non-last cards, update state and continue
    if (remembered) {
      setScore(newScore)
      setRememberedCards(newRemembered)
    }
    setCurrentCardIndex(prev => prev + 1)
    setIsFlipped(false)
  }
}, [currentCardIndex, shuffledCards.length, calculatePointsPerCard, score, rememberedCards, finishGame])

  // ===== RENDER METHODS =====

  /**
   * Renders game completion screen with final statistics
   * @returns {JSX.Element} Completion screen component
   */
  const renderCompletionScreen = () => {
    // Calculate the final score with perfect score adjustment
    const basePointsPerCard = Math.floor(quiz.points / quiz.cards.length)
    const isPerfectScore = rememberedCards === quiz.cards.length
    let finalScore = score
    
    // For perfect scores, show the full available points
    if (isPerfectScore) {
      finalScore = quiz.points
    }
    
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🎴</div>
        <h2 className="text-3xl font-bold text-foreground">Flashcards Complete!</h2>
        {isPerfectScore && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-full inline-block">
            ⭐ Perfect Score! ⭐
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <StatBox value={finalScore} label="Points" />
          <StatBox 
            value={`${rememberedCards}/${quiz.cards.length}`} 
            label="Remembered" 
          />
          <StatBox 
            value={`${Math.floor((quiz.timeLimit - timeLeft) / 60)}:${(quiz.timeLimit - timeLeft) % 60 < 10 ? '0' : ''}${(quiz.timeLimit - timeLeft) % 60}`}
            label="Time" 
          />
        </div>
      </div>
    )
  }

  /**
   * Renders individual statistic box for completion screen
   * @param {string|number} value - The statistic value to display
   * @param {string} label - The label for the statistic
   * @returns {JSX.Element} Statistic box component
   */
  const StatBox = ({ value, label }) => (
    <div className="bg-primary/10 rounded-xl p-4">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-foreground/70">{label}</div>
    </div>
  )

  /**
   * Renders the main flashcard with flip animation
   * @returns {JSX.Element} Flashcard component
   */
  const renderFlashcard = () => (
    <div className="flex justify-center">
      <div 
        onClick={handleCardFlip}
        className="w-80 h-48 cursor-pointer perspective-1000"
        role="button"
        aria-label={isFlipped ? "Flip card to front" : "Flip card to back"}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardFlip()}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}>
          {/* Front of card - Question/term */}
          <div className="absolute w-full h-full bg-background border-2 border-primary rounded-2xl p-6 backface-hidden flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-foreground text-center mb-4">
              {currentCardData.front}
            </h3>
            <p className="text-foreground/60 text-sm">Click to flip</p>
          </div>

          {/* Back of card - Answer/definition */}
          <div className="absolute w-full h-full bg-primary text-white rounded-2xl p-6 backface-hidden rotate-y-180 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-center mb-2">
              {currentCardData.back}
            </h3>
            {currentCardData.romanized && (
              <p className="text-white/80 text-lg mb-2">({currentCardData.romanized})</p>
            )}
            <p className="text-white/70 text-sm text-center mb-4">
              {currentCardData.meaning}
            </p>
            {currentCardData.audio && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  playAudio()
                }}
                className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
                aria-label="Play pronunciation"
              >
                🔊 Play Audio
              </button>
            )}
            <audio 
              ref={audioRef} 
              src={currentCardData.audio} 
              preload="none"
              aria-label="Audio pronunciation"
            />
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Renders action buttons for user response
   * Only shown when card is flipped to back side
   * @returns {JSX.Element} Action buttons component
   */
  const renderActionButtons = () => (
    <div className="flex justify-center gap-4">
      <button
        onClick={() => handleNextCard(false)}
        className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
        aria-label="Mark as needs practice"
      >
        Need Practice
      </button>
      <button
        onClick={() => handleNextCard(true)}
        className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
        aria-label="Mark as remembered"
      >
        I Remember!
      </button>
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  // Show completion screen if game is finished
  if (gameState === 'finished') {
    return renderCompletionScreen()
  }

  // Show loading state if cards haven't been shuffled yet
  if (!currentCardData) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-lg text-foreground/60">Loading cards...</div>
      </div>
    )
  }

  // Render main game interface
  return (
    <div className="space-y-6">
      {/* Game Header with Progress Info */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-foreground/60">
          Card {currentCardIndex + 1} of {shuffledCards.length}
        </div>
        <div className="text-sm font-semibold text-primary">
          Time: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentCardIndex + 1) / shuffledCards.length) * 100}%` }}
          role="progressbar"
          aria-valuenow={currentCardIndex + 1}
          aria-valuemin={0}
          aria-valuemax={shuffledCards.length}
        />
      </div>

      {/* Main Flashcard */}
      {renderFlashcard()}

      {/* Action Buttons (only when card is flipped) */}
      {isFlipped && renderActionButtons()}
    </div>
  )
}