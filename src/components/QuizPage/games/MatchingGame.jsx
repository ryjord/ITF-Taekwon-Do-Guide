import { useState, useEffect, useCallback } from 'react'

/**
 * MatchingGame Component
 * 
 * A professional memory matching game with randomized card placement,
 * comprehensive progress tracking, and detailed performance analytics.
 * 
 * Features:
 * - Randomized card placement for fair gameplay
 * - Memory matching mechanics with visual feedback
 * - English to Romanized Korean matching for young learners
 * - Progress tracking and scoring
 * - Time-based challenge with visual progress
 * 
 * @param {Object} quiz - Quiz configuration object
 * @param {Function} onComplete - Callback when game completes with standardized results
 * @returns {JSX.Element} Matching game interface
 */
export const MatchingGame = ({ quiz, onComplete }) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[Array, Function]} All card pairs with game state */
  const [pairs, setPairs] = useState([])
  
  /** @type {[number|null, Function]} Index of currently selected card or null */
  const [selectedCard, setSelectedCard] = useState(null)
  
  /** @type {[Array, Function]} Array of matched pair IDs */
  const [matchedPairs, setMatchedPairs] = useState([])
  
  /** @type {[number, Function]} Remaining time in seconds */
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit)
  
  /** @type {[string, Function]} Current game state: 'playing' | 'finished' */
  const [gameState, setGameState] = useState('playing')
  
  /** @type {[number, Function]} Current accumulated score */
  const [score, setScore] = useState(0)

  // ===== CALCULATED VALUES =====

  /**
   * Calculates points per matched pair ensuring perfect score equals total available points
   * @returns {number} Points awarded for each matched pair
   */
  const calculatePointsPerPair = useCallback(() => {
    return Math.floor(quiz.points / quiz.pairs.length)
  }, [quiz.points, quiz.pairs.length])

  // ===== EFFECTS & INITIALIZATION =====

  /**
   * Initialize game by creating and shuffling card pairs on component mount
   * Creates duplicate cards for matching and applies Fisher-Yates shuffle
   */
  useEffect(() => {
    const initializeGame = () => {
      // Create card pairs with duplicates for matching - English to Romanized
      const cardPairs = [
        // English cards
        ...quiz.pairs.map(pair => ({
          ...pair,
          id: pair.id + '-english',
          isEnglish: true,
          displayText: pair.english,
          subText: null, // No subtext for English cards
          matchId: pair.id
        })),
        // Romanized cards (with Korean subtext)
        ...quiz.pairs.map(pair => ({
          ...pair,
          id: pair.id + '-romanized',
          isEnglish: false,
          displayText: pair.romanized,
          subText: pair.korean, // Korean characters as subtext
          matchId: pair.id
        }))
      ]

      // Fisher-Yates shuffle algorithm for true randomization
      const shuffledPairs = [...cardPairs]
      for (let i = shuffledPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledPairs[i], shuffledPairs[j]] = [shuffledPairs[j], shuffledPairs[i]]
      }

      // Initialize game state for each card
      setPairs(shuffledPairs.map(pair => ({
        ...pair,
        isFlipped: false,
        isMatched: false
      })))
    }

    initializeGame()
  }, [quiz.pairs])

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

  /**
   * Check for game completion when matched pairs change
   * Automatically finishes game when all pairs are matched
   */
  useEffect(() => {
    if (matchedPairs.length === quiz.pairs.length && quiz.pairs.length > 0) {
      setTimeout(() => finishGame(), 500)
    }
  }, [matchedPairs.length, quiz.pairs.length])

  // ===== GAME LOGIC =====

  /**
   * Handles card selection and matching logic
   * @param {number} index - Index of the clicked card
   */
  const handleCardClick = useCallback((index) => {
    // Prevent interaction with already flipped or matched cards
    if (pairs[index].isFlipped || pairs[index].isMatched) return

    // Flip the selected card
    const newPairs = [...pairs]
    newPairs[index].isFlipped = true
    setPairs(newPairs)

    if (selectedCard === null) {
      // First card selection
      setSelectedCard(index)
    } else {
      // Second card selection - check for match
      const firstCard = pairs[selectedCard]
      const secondCard = pairs[index]
      
      const isMatch = firstCard.matchId === secondCard.matchId
      
      if (isMatch) {
        // Mark both cards as matched
        newPairs[selectedCard].isMatched = true
        newPairs[index].isMatched = true
        setPairs(newPairs)
        
        // Update matched pairs and score
        const newMatchedPairs = [...matchedPairs, firstCard.matchId]
        setMatchedPairs(newMatchedPairs)
        
        const pointsPerPair = calculatePointsPerPair()
        setScore(prev => prev + pointsPerPair)
      } else {
        // Flip cards back after delay if no match
        setTimeout(() => {
          const resetPairs = [...pairs]
          resetPairs[selectedCard].isFlipped = false
          resetPairs[index].isFlipped = false
          setPairs(resetPairs)
        }, 1000)
      }
      setSelectedCard(null)
    }
  }, [pairs, selectedCard, matchedPairs, calculatePointsPerPair])

  /**
   * Finalizes game results and triggers completion callback
   * Ensures perfect score calculation and provides comprehensive analytics
   * @param {number} finalScore - Final game score
   * @param {number} finalMatchedCount - Final count of matched pairs
   */
  const finishGame = useCallback((finalScore = score, finalMatchedCount = matchedPairs.length) => {
    setGameState('finished')
    const timeUsed = quiz.timeLimit - timeLeft
    
    // Ensure perfect score equals total available points
    const isPerfectScore = finalMatchedCount === quiz.pairs.length
    const adjustedScore = isPerfectScore ? quiz.points : finalScore
    
    // Calculate accuracy and performance metrics
    const completionRate = (finalMatchedCount / quiz.pairs.length) * 100
    const timePerPair = timeUsed / quiz.pairs.length
    
    // Standardized results object for progress tracking system
    const standardizedResults = {
      // Core game identification
      gameType: quiz.gameType,
      category: quiz.category,
      
      // Performance metrics
      score: adjustedScore,
      timeUsed: timeUsed,
      perfectScore: isPerfectScore,
      
      // Pair-specific analytics
      totalPairs: quiz.pairs.length,
      matchedPairs: finalMatchedCount,
      
      // Advanced metrics for progress system
      completionRate: completionRate,
      timePerPair: timePerPair,
      
      // Additional context for achievements
      shuffled: true, // Indicates cards were randomized
      totalPossiblePoints: quiz.points,
      averageTimePerPair: timePerPair
    }
    
    // Trigger completion callback with standardized data
    onComplete(standardizedResults)
  }, [score, matchedPairs.length, quiz, timeLeft, onComplete])

  // ===== RENDER METHODS =====

  /**
   * Renders individual card component
   * @param {Object} pair - Card data object
   * @param {number} index - Card index in the array
   * @returns {JSX.Element} Card component
   */
  const renderCard = useCallback((pair, index) => (
    <div
      key={`${pair.id}-${index}`}
      onClick={() => handleCardClick(index)}
      className={`aspect-square cursor-pointer transition-transform duration-300 ${
        pair.isFlipped || pair.isMatched ? '' : 'hover:scale-105'
      }`}
      role="button"
      aria-label={pair.isFlipped || pair.isMatched ? 
        `${pair.isEnglish ? 'English' : 'Romanized Korean'} card: ${pair.displayText}` : 
        'Hidden card - click to reveal'
      }
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick(index)}
    >
      <div className={`w-full h-full rounded-xl border-2 transition-all duration-300 flex items-center justify-center p-4 text-center ${
        pair.isMatched
          ? 'bg-green-500 text-white border-green-500 shadow-lg'
          : pair.isFlipped
          ? 'bg-primary text-white border-primary shadow-md'
          : 'bg-background border-primary hover:bg-primary/10'
      }`}>
        {pair.isFlipped || pair.isMatched ? (
          <div className="w-full">
            <div className="font-bold text-lg mb-1">
              {pair.displayText}
            </div>
            {pair.subText && (
              <div className="text-sm opacity-70 mt-1 border-t border-white/30 pt-1">
                {pair.subText}
              </div>
            )}
          </div>
        ) : (
          <div className="text-2xl">?</div>
        )}
      </div>
    </div>
  ), [handleCardClick])

  /**
   * Renders game completion screen with comprehensive statistics
   * @returns {JSX.Element} Completion screen component
   */
  const renderCompletionScreen = () => {
    const isPerfectScore = matchedPairs.length === quiz.pairs.length
    const finalScore = isPerfectScore ? quiz.points : score
    const completionRate = (matchedPairs.length / quiz.pairs.length) * 100
    
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🃏</div>
        <h2 className="text-3xl font-bold text-foreground">Matching Complete!</h2>
        
        {/* Perfect Score Celebration */}
        {isPerfectScore && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-full inline-block">
            ⭐ Perfect Memory! ⭐
          </div>
        )}
        
        {/* Performance Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <StatBox value={finalScore} label="Points" />
          <StatBox 
            value={`${matchedPairs.length}/${quiz.pairs.length}`} 
            label="Matched" 
          />
          <StatBox 
            value={`${completionRate.toFixed(1)}%`} 
            label="Completion" 
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

  // ===== MAIN COMPONENT RENDER =====

  // Show completion screen if game is finished
  if (gameState === 'finished') {
    return renderCompletionScreen()
  }

  // Show loading state if pairs haven't been initialized yet
  if (pairs.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-lg text-foreground/60">Setting up matching game...</div>
      </div>
    )
  }

  // Render main game interface
  return (
    <div className="space-y-6">
      {/* Game Header with Progress Info */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-foreground/60">
          Matched {matchedPairs.length} of {quiz.pairs.length} pairs
        </div>
        <div className="text-sm font-semibold text-primary">
          Time: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(matchedPairs.length / quiz.pairs.length) * 100}%` }}
          role="progressbar"
          aria-valuenow={matchedPairs.length}
          aria-valuemin={0}
          aria-valuemax={quiz.pairs.length}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pairs.map((pair, index) => renderCard(pair, index))}
      </div>

      {/* Instructions */}
      <div className="text-center text-foreground/60 text-sm">
        Click cards to find matching English-Romanized pairs. Match all pairs to complete the game!
      </div>

      {/* Score Display */}
      <div className="text-center">
        <div className="inline-block bg-primary/10 rounded-full px-4 py-2">
          <span className="text-sm text-foreground/60 mr-2">Score:</span>
          <span className="font-bold text-primary">{score}</span>
          <span className="text-sm text-foreground/60 ml-2">/ {quiz.points}</span>
        </div>
      </div>
    </div>
  )
}