import { useEffect, useRef, useState } from 'react'

import { QuizHub } from '../components/QuizPage/QuizHub'
import { QuizGame } from '../components/QuizPage/QuizGame'

export const Quiz = () => {
  const [currentView, setCurrentView] = useState('hub')
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const gameContainerRef = useRef(null)

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz)
    setCurrentView('game')
  }

  const handleBackToHub = () => {
    setSelectedQuiz(null)
    setCurrentView('hub')
  }

  useEffect(() => {
    if (currentView === 'game' && gameContainerRef.current) {
      gameContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentView])

  return (
    <div
      className="min-h-screen bg-linear-to-br from-primary/5 via-background to-primary/10 py-24"
      role="main"
      aria-label="Taekwon-Do Quiz Application"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
        {currentView === 'game' && selectedQuiz ? (
          <div ref={gameContainerRef}>
            <QuizGame quiz={selectedQuiz} onBack={handleBackToHub} />
          </div>
        ) : (
          <QuizHub onQuizSelect={handleQuizSelect} />
        )}
      </div>
    </div>
  )
}
