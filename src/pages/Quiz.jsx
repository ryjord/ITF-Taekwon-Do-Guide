// ===== MAIN IMPORTS =====
import { useState, useEffect, useRef } from 'react'
import { QuizHub } from '../components/QuizPage/QuizHub'
import { QuizGame } from '../components/QuizPage/QuizGame'

// ===== QUIZ DATA IMPORTS =====
import categoriesData from '../data/quiz/QuizCategories.json'
import mcqData from '../data/quiz/MCQData.json'
import wordSearchData from '../data/quiz/WordSearchData.json'
import translationData from '../data/quiz/TranslationData.json'
import crosswordData from '../data/quiz/CrosswordData.json'
import flashcardData from '../data/quiz/FlashCardData.json'
import matchingData from '../data/quiz/MatchingData.json'

// ===== DATA COMBINATION =====

/**
 * Combined quiz data object that aggregates all quiz categories,
 * game types, difficulties, and individual quizzes from all data files.
 * 
 * Structure:
 * - quizCategories: Array of category objects
 * - gameTypes: Array of game type objects  
 * - difficultyLevels: Array of difficulty objects
 * - allQuizzes: Combined array of all quizzes from all game types
 * 
 * @type {Object}
 */
const combinedQuizData = {
  ...categoriesData,
  allQuizzes: [
    ...mcqData.quizzes,
    ...wordSearchData.quizzes,
    ...translationData.quizzes,
    ...crosswordData.quizzes,
    ...flashcardData.quizzes,
    ...matchingData.quizzes
  ]
}

// ===== MAIN QUIZ COMPONENT =====

/**
 * Quiz Component
 * 
 * Main quiz application container that manages the high-level navigation
 * between the quiz hub (selection interface) and individual quiz games.
 * 
 * Features:
 * - View state management (hub vs game)
 * - Smooth transitions between views
 * - Auto-scroll behavior for game start
 * - Centralized quiz data aggregation
 * - Responsive layout with gradient background
 * - Professional spacing and visual hierarchy
 * 
 * @returns {JSX.Element} Complete quiz application interface
 */
export const Quiz = () => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[string, Function]} Current view state: 'hub' or 'game' */
  const [currentView, setCurrentView] = useState('hub')
  
  /** @type {[Object|null, Function]} Currently selected quiz object or null */
  const [selectedQuiz, setSelectedQuiz] = useState(null)

  // ===== REFERENCES =====
  
  /** @type {import('react').RefObject<HTMLDivElement>} Reference to game container for auto-scroll */
  const gameContainerRef = useRef(null)

  // ===== EVENT HANDLERS =====

  /**
   * Handles quiz selection from the hub and transitions to game view
   * @param {Object} quiz - The selected quiz object
   */
  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz)
    setCurrentView('game')
  }

  /**
   * Handles navigation back to the quiz hub from a game
   * Resets selected quiz and returns to hub view
   */
  const handleBackToHub = () => {
    setSelectedQuiz(null)
    setCurrentView('hub')
  }

  // ===== EFFECTS =====

  /**
   * Auto-scrolls to game container when transitioning to game view
   * Provides smooth user experience when starting a new quiz
   */
  useEffect(() => {
    if (currentView === 'game' && gameContainerRef.current) {
      gameContainerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [currentView])

  // ===== RENDER METHODS =====

  /**
   * Renders the appropriate view based on current state
   * @returns {JSX.Element} Current view component
   */
  const renderCurrentView = () => {
    switch (currentView) {
      case 'hub':
        return (
          <QuizHub 
            quizData={combinedQuizData}
            onQuizSelect={handleQuizSelect}
          />
        )
      case 'game':
        return (
          <div ref={gameContainerRef}>
            <QuizGame 
              quiz={selectedQuiz}
              onBack={handleBackToHub}
            />
          </div>
        )
      default:
        // Fallback to hub view for unknown states
        return (
          <QuizHub 
            quizData={combinedQuizData}
            onQuizSelect={handleQuizSelect}
          />
        )
    }
  }

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 py-24"
      role="main"
      aria-label="Taekwon-Do Quiz Application"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {renderCurrentView()}
      </div>
    </div>
  )
}