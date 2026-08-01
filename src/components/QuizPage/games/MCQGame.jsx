import { useState, useEffect, useCallback } from 'react'

/**
 * MCQGame Component
 * 
 * A professional multiple-choice quiz game with randomized question order,
 * comprehensive progress tracking, and detailed performance analytics.
 * 
 * Features:
 * - Randomized question order for fair assessment
 * - Real-time scoring with perfect score guarantees
 * - Progress tracking for achievements system
 * - Detailed explanations and feedback
 * - Time-based challenge with visual progress
 * 
 * @param {Object} quiz - Quiz configuration object
 * @param {Function} onComplete - Callback when game completes with standardized results
 * @returns {JSX.Element} MCQ game interface
 */
export const MCQGame = ({ quiz, onComplete }) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[number, Function]} Current question index in shuffled deck */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  
  /** @type {[number|null, Function]} Index of selected answer or null if not answered */
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  
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
    completionRate: 100, // MCQ games are always 100% completed
    
    // Additional context for achievements
    shuffled: true, // Indicates questions were randomized
    totalPossiblePoints: quiz.points,
    averageTimePerQuestion: timePerQuestion
  }
  
  // Trigger completion callback with standardized data
  onComplete(standardizedResults)
}, [score, correctAnswers, quiz, timeLeft, onComplete])

/**
 * Handles user answer selection with validation and progression
 * @param {number} answerIndex - Index of the selected answer option
 */
const handleAnswerSelect = useCallback((answerIndex) => {
  setSelectedAnswer(answerIndex)
  
  const pointsPerQuestion = calculatePointsPerQuestion()
  const isCorrect = answerIndex === currentQuestion.correctAnswer
  
  // Calculate what the new values will be
  const newScore = isCorrect ? score + pointsPerQuestion : score
  const newCorrectCount = isCorrect ? correctAnswers + 1 : correctAnswers

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
      setSelectedAnswer(null)
    }
  }, 1000) // 1 second delay for user to see feedback
}, [currentQuestionIndex, shuffledQuestions.length, calculatePointsPerQuestion, score, correctAnswers, currentQuestion, finishGame])
  

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
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-foreground">Quiz Complete!</h2>
        
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
        
        {/* Performance Feedback */}
        <div className="bg-primary/10 rounded-xl p-4 max-w-md mx-auto">
          <h4 className="font-semibold text-primary mb-2">Performance Summary</h4>
          <p className="text-foreground/70 text-sm">
            {accuracy >= 90 ? "Outstanding! You've mastered this material!" :
             accuracy >= 75 ? "Great job! You have a solid understanding." :
             accuracy >= 60 ? "Good effort! Keep practicing to improve." :
             "Keep studying! Review the material and try again."}
          </p>
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
   * Renders answer option with visual feedback states
   * @param {string} option - The answer option text
   * @param {number} index - The index of the answer option
   * @returns {JSX.Element} Answer option button component
   */
  const renderAnswerOption = (option, index) => {
    const isSelected = selectedAnswer === index
    const isCorrect = index === currentQuestion.correctAnswer
    const showCorrect = selectedAnswer !== null && isCorrect
    const showIncorrect = isSelected && !isCorrect
    
    return (
      <button
        key={index}
        onClick={() => handleAnswerSelect(index)}
        disabled={selectedAnswer !== null}
        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 w-full ${
          selectedAnswer === null
            ? 'bg-background border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer'
            : showCorrect
            ? 'bg-green-500 text-white border-green-500 shadow-lg transform scale-105'
            : showIncorrect
            ? 'bg-red-500 text-white border-red-500 opacity-80'
            : 'bg-background border-border opacity-50 cursor-not-allowed'
        }`}
        aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
        aria-pressed={isSelected}
        aria-describedby={selectedAnswer !== null && isCorrect ? "correct-answer" : undefined}
      >
        <div className="flex items-center">
          {/* Option Letter Indicator */}
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 font-semibold flex-shrink-0 ${
            selectedAnswer === null
              ? 'border-primary text-primary'
              : showCorrect || showIncorrect
              ? 'border-white text-white'
              : 'border-gray-300 text-gray-300'
          }`}>
            {String.fromCharCode(65 + index)}
          </div>
          
          {/* Option Text */}
          <span className="text-left flex-1">{option}</span>
        </div>
      </button>
    )
  }

  /**
   * Renders explanation panel when answer is selected
   * @returns {JSX.Element} Explanation component
   */
  const renderExplanation = () => (
    <div 
      className="bg-primary/10 border border-primary/20 rounded-xl p-4 mt-6 animate-fade-in"
      role="region"
      aria-label="Answer Explanation"
    >
      <h4 className="font-semibold text-primary mb-2">Explanation:</h4>
      <p className="text-foreground/70" id="correct-answer">
        {currentQuestion.explanation}
      </p>
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
    <div className="space-y-6">
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

      {/* Question */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-6">
          {currentQuestion.question}
        </h3>
        
        {/* Answer Options Grid */}
        <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
          {currentQuestion.options.map((option, index) => 
            renderAnswerOption(option, index)
          )}
        </div>
      </div>

      {/* Explanation (when answered) */}
      {selectedAnswer !== null && renderExplanation()}
    </div>
  )
}