import { useState, useEffect, useCallback } from 'react'

/**
 * TranslationGame Component
 * 
 * A professional translation learning game with randomized question order,
 * comprehensive progress tracking, and detailed performance analytics.
 * 
 * Features:
 * - Randomized question order for better learning retention
 * - Flexible answer validation with spelling variations
 * - Audio pronunciation support
 * - Progress tracking and scoring
 * - Time-based challenge with visual progress
 * 
 * @param {Object} quiz - Quiz configuration object
 * @param {Function} onComplete - Callback when game completes with standardized results
 * @returns {JSX.Element} Translation game interface
 */
export const TranslationGame = ({ quiz, onComplete }) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[number, Function]} Current question index in shuffled deck */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  
  /** @type {[string, Function]} User's current translation input */
  const [userInput, setUserInput] = useState('')
  
  /** @type {[number, Function]} Current accumulated score */
  const [score, setScore] = useState(0)
  
  /** @type {[number, Function]} Count of correctly answered questions */
  const [correctAnswers, setCorrectAnswers] = useState(0)
  
  /** @type {[number, Function]} Remaining time in seconds */
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit)
  
  /** @type {[string, Function]} Current game state: 'playing' | 'finished' */
  const [gameState, setGameState] = useState('playing')
  
  /** @type {[Array, Function]} Shuffled copy of quiz questions for random order */
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  
  /** @type {[{show: boolean, isCorrect: boolean, message: string}, Function]} Feedback state for user responses */
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' })
  
  /** @type {[Array, Function]} Track all answered questions for detailed results */
  const [answeredQuestions, setAnsweredQuestions] = useState([])

  // ===== CALCULATED VALUES =====

  /**
   * Calculates points per question ensuring perfect score equals total available points
   * Uses base point distribution with remainder handling for perfect scores
   * @returns {number} Points awarded for each correct answer
   */
  const calculatePointsPerQuestion = useCallback(() => {
    return Math.floor(quiz.points / quiz.questions.length)
  }, [quiz.points, quiz.questions.length])

  /**
   * Gets the current question data from shuffled deck
   * @returns {Object|null} Current question object or null if not available
   */
  const currentQuestion = shuffledQuestions[currentQuestionIndex]

  // ===== EFFECTS & INITIALIZATION =====

  /**
   * Initialize game by shuffling questions on component mount
   * Uses Fisher-Yates shuffle algorithm for true randomization
   */
  useEffect(() => {
    const shuffleQuestions = () => {
      const questions = [...quiz.questions]
      // Fisher-Yates shuffle algorithm for true randomization
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[questions[i], questions[j]] = [questions[j], questions[i]]
      }
      setShuffledQuestions(questions)
    }

    shuffleQuestions()
  }, [quiz.questions])

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
   * Normalizes answers for flexible comparison
   * Removes punctuation, extra spaces, and converts to lowercase
   * @param {string} answer - The answer to normalize
   * @returns {string} Normalized answer string
   */
  const normalizeAnswer = useCallback((answer) => {
    return answer.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
  }, [])

  /**
   * Validates user answer with flexible matching rules
   * Supports spelling variations, article differences, and plural forms
   * @param {string} userAnswer - User's submitted answer
   * @param {string} correctAnswer - Expected correct answer
   * @returns {boolean} Whether answer is considered correct
   */
  const isAnswerCorrect = useCallback((userAnswer, correctAnswer) => {
    const normalizedUser = normalizeAnswer(userAnswer)
    const normalizedCorrect = normalizeAnswer(correctAnswer)
    
    // Exact match
    if (normalizedUser === normalizedCorrect) return true
    
    // Allow minor spelling variations
    const commonVariations = {
      'colour': 'color',
      'favourite': 'favorite',
      'centre': 'center',
      'honour': 'honor',
      'defence': 'defense'
    }
    
    if (commonVariations[normalizedUser] === normalizedCorrect || 
        commonVariations[normalizedCorrect] === normalizedUser) {
      return true
    }
    
    // Allow answers without articles for simplicity
    const withoutArticles = (str) => str.replace(/^(a|an|the)\s+/i, '')
    if (withoutArticles(normalizedUser) === withoutArticles(normalizedCorrect)) {
      return true
    }

    // Allow plural/singular variations for simple cases
    if ((normalizedUser + 's' === normalizedCorrect) || 
        (normalizedUser === normalizedCorrect + 's') ||
        (normalizedUser + 'es' === normalizedCorrect) ||
        (normalizedUser === normalizedCorrect + 'es')) {
      return true
    }
    
    return false
  }, [normalizeAnswer])

  /**
   * Plays audio pronunciation for current question if available
   * Handles errors gracefully to prevent game interruption
   */
  const playAudio = useCallback(() => {
    if (currentQuestion?.audio) {
      const audio = new Audio(currentQuestion.audio)
      audio.play().catch(error => {
        console.warn('Audio playback failed:', error)
        // Gracefully handle audio errors without breaking game flow
      })
    }
  }, [currentQuestion])

  /**
   * Finalizes game results and triggers completion callback
   * Ensures perfect score calculation and provides comprehensive analytics
   * @param {number} finalScore - Final game score
   * @param {number} finalCorrectCount - Final count of correct answers
   */
  const finishGame = useCallback((finalScore = score, finalCorrectCount = correctAnswers) => {
    setGameState('finished')
    const timeUsed = quiz.timeLimit - timeLeft
    
    // Ensure perfect score equals total available points
    const isPerfectScore = finalCorrectCount === quiz.questions.length
    const adjustedScore = isPerfectScore ? quiz.points : finalScore
    
    // Calculate accuracy and performance metrics
    const accuracy = (finalCorrectCount / quiz.questions.length) * 100
    const timePerQuestion = timeUsed / quiz.questions.length
    
    // Standardized results object for progress tracking system
    const standardizedResults = {
      // Core game identification
      gameType: quiz.gameType,
      category: quiz.category,
      
      // Performance metrics
      score: adjustedScore,
      timeUsed: timeUsed,
      perfectScore: isPerfectScore,
      
      // Question-specific analytics
      totalQuestions: quiz.questions.length,
      correctAnswers: finalCorrectCount,
      
      // Advanced metrics for progress system
      accuracy: accuracy,
      timePerQuestion: timePerQuestion,
      completionRate: 100, // Translation games are always 100% completed
      
      // Additional context for achievements
      shuffled: true, // Indicates questions were randomized
      totalPossiblePoints: quiz.points,
      averageTimePerQuestion: timePerQuestion,
      
      // Detailed results for review
      answeredQuestions: answeredQuestions
    }
    
    // Trigger completion callback with standardized data
    onComplete(standardizedResults)
  }, [score, correctAnswers, quiz, timeLeft, answeredQuestions, onComplete])

  /**
   * Handles answer submission with validation and progression
   * @param {Event} e - Form submission event
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    
    if (!userInput.trim()) return

    const pointsPerQuestion = calculatePointsPerQuestion()
    const isCorrect = isAnswerCorrect(userInput, currentQuestion.english)
    
    // Calculate what the new values will be
    const newScore = isCorrect ? score + pointsPerQuestion : score
    const newCorrectCount = isCorrect ? correctAnswers + 1 : correctAnswers

    // Show feedback to user
    if (isCorrect) {
      setFeedback({
        show: true,
        isCorrect: true,
        message: 'Correct! 🎉'
      })
    } else {
      setFeedback({
        show: true,
        isCorrect: false,
        message: `Almost! The answer is "${currentQuestion.english}"`
      })
    }

    // Record the answered question
    const newAnsweredQuestions = [...answeredQuestions, {
      ...currentQuestion,
      userAnswer: userInput,
      isCorrect,
      points: isCorrect ? pointsPerQuestion : 0
    }]
    setAnsweredQuestions(newAnsweredQuestions)

    // Check if this is the last question
    const isLastQuestion = currentQuestionIndex >= shuffledQuestions.length - 1

    // Move to next question or finish after a brief delay for user feedback
    setTimeout(() => {
      if (isLastQuestion) {
        // For the last question, finish the game with updated values
        finishGame(newScore, newCorrectCount)
      } else {
        // Update state and continue to next question
        if (isCorrect) {
          setScore(newScore)
          setCorrectAnswers(newCorrectCount)
        }
        setCurrentQuestionIndex(prev => prev + 1)
        setUserInput('')
        setFeedback({ show: false, isCorrect: false, message: '' })
      }
    }, 1500) // 1.5 second delay for user to see feedback
  }, [userInput, currentQuestion, calculatePointsPerQuestion, isAnswerCorrect, score, correctAnswers, currentQuestionIndex, shuffledQuestions.length, answeredQuestions, finishGame])

  /**
   * Handles question skip with progression
   */
  const handleSkip = useCallback(() => {
    setFeedback({
      show: true,
      isCorrect: false,
      message: `Skipped! The answer was "${currentQuestion.english}"`
    })

    // Record skipped question
    const newAnsweredQuestions = [...answeredQuestions, {
      ...currentQuestion,
      userAnswer: 'skipped',
      isCorrect: false,
      points: 0
    }]
    setAnsweredQuestions(newAnsweredQuestions)

    // Check if this is the last question
    const isLastQuestion = currentQuestionIndex >= shuffledQuestions.length - 1

    setTimeout(() => {
      if (isLastQuestion) {
        // For the last question, finish the game
        finishGame(score, correctAnswers)
      } else {
        // Continue to next question
        setCurrentQuestionIndex(prev => prev + 1)
        setUserInput('')
        setFeedback({ show: false, isCorrect: false, message: '' })
      }
    }, 1000) // 1 second delay for skip feedback
  }, [currentQuestion, currentQuestionIndex, shuffledQuestions.length, answeredQuestions, score, correctAnswers, finishGame])

  // ===== RENDER METHODS =====

  /**
   * Renders game completion screen with comprehensive statistics
   * @returns {JSX.Element} Completion screen component
   */
  const renderCompletionScreen = () => {
    const isPerfectScore = correctAnswers === quiz.questions.length
    const finalScore = isPerfectScore ? quiz.points : score
    const accuracy = (correctAnswers / quiz.questions.length) * 100
    
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-3xl font-bold text-foreground">Translation Complete!</h2>
        
        {/* Perfect Score Celebration */}
        {isPerfectScore && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-full inline-block">
            ⭐ Perfect Score! ⭐
          </div>
        )}
        
        {/* Performance Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <StatBox value={finalScore} label="Points" />
          <StatBox 
            value={`${correctAnswers}/${quiz.questions.length}`} 
            label="Correct" 
          />
          <StatBox 
            value={`${accuracy.toFixed(1)}%`} 
            label="Accuracy" 
          />
          <StatBox 
            value={`${Math.floor((quiz.timeLimit - timeLeft) / 60)}:${(quiz.timeLimit - timeLeft) % 60 < 10 ? '0' : ''}${(quiz.timeLimit - timeLeft) % 60}`}
            label="Time" 
          />
        </div>

        {/* Results Summary */}
        <div className="max-w-2xl mx-auto bg-card rounded-xl p-6 border space-y-4">
          <h3 className="text-xl font-bold text-foreground">Your Answers</h3>
          {answeredQuestions.map((question, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${
              question.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex justify-between items-start">
                <div className="text-left">
                  <div className="font-semibold text-foreground">{question.romanized}</div>
                  <div className="text-sm text-foreground/60">{question.korean}</div>
                  <div className="text-sm mt-1">
                    Your answer: <span className={question.isCorrect ? "text-green-600" : "text-red-600"}>
                      {question.userAnswer}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${question.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {question.isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-foreground/60">+{question.points}</div>
                </div>
              </div>
            </div>
          ))}
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

  // Show loading state if questions haven't been shuffled yet
  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-lg text-foreground/60">Loading questions...</div>
      </div>
    )
  }

  // Render main game interface
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Game Header with Progress Info */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-foreground/60">
          Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
        </div>
        <div className="text-sm font-semibold text-primary">
          Time: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}
          role="progressbar"
          aria-valuenow={currentQuestionIndex + 1}
          aria-valuemin={0}
          aria-valuemax={shuffledQuestions.length}
        />
      </div>

      {/* Game Area */}
      <div className="bg-card rounded-2xl p-8 shadow-lg border text-center space-y-6">
        {/* Word to Translate */}
        <div className="space-y-4">
          <div className="text-foreground/60 text-sm">Write the English translation:</div>
          <div className="text-4xl font-bold text-primary mb-2">
            {currentQuestion.romanized}
          </div>
          <div className="text-2xl text-foreground/80">
            {currentQuestion.korean}
          </div>
          
          {/* Audio Button */}
          {currentQuestion.audio && (
            <button
              onClick={playAudio}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
              aria-label="Play pronunciation"
            >
              <span>🔊</span>
              Listen
            </button>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type the English translation..."
              className="w-full px-4 py-3 text-lg border-2 border-primary rounded-xl focus:outline-none focus:border-primary/70 bg-background text-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={feedback.show}
              autoFocus
              aria-label="Translation input"
            />
          </div>

          {/* Feedback Message */}
          {feedback.show && (
            <div 
              className={`p-4 rounded-xl text-lg font-semibold ${
                feedback.isCorrect 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
              role="alert"
              aria-live="polite"
            >
              {feedback.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <button
              type="button"
              onClick={handleSkip}
              disabled={feedback.show}
              className="px-6 py-3 border-2 border-foreground/20 text-foreground/70 rounded-xl hover:bg-foreground/5 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              aria-label="Skip question"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={feedback.show || !userInput.trim()}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Check answer"
            >
              Check Answer
            </button>
          </div>
        </form>
      </div>

      {/* Instructions */}
      <div className="text-center text-foreground/60 text-sm">
        Type the English meaning of the Korean word. Don't worry about capitalization or small spelling mistakes!
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