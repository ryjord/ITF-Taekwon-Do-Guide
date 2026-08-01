import { useState, useCallback } from 'react'
import { PartyPopper, Sparkles } from 'lucide-react'

import { Progress } from '@/components/ui/progress'
import { cn, formatTime, shuffle } from '@/lib/utils'

import { StatTile } from '../StatTile'
import { useGameTimer } from '../../../hooks/useGameTimer'

export const MCQGame = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameState, setGameState] = useState('playing')
  const [shuffledQuestions] = useState(() => shuffle(quiz.questions))

  const pointsPerQuestion = Math.floor(quiz.points / quiz.questions.length)
  const currentQuestion = shuffledQuestions[currentQuestionIndex]

  const finishGame = useCallback(
    (finalScore, finalCorrectCount, timeUsed) => {
      setGameState('finished')

      const isPerfectScore = finalCorrectCount === quiz.questions.length
      const adjustedScore = isPerfectScore ? quiz.points : finalScore
      const accuracy = (finalCorrectCount / quiz.questions.length) * 100
      const timePerQuestion = timeUsed / quiz.questions.length

      onComplete({
        gameType: quiz.gameType,
        category: quiz.category,
        score: adjustedScore,
        timeUsed,
        perfectScore: isPerfectScore,
        totalQuestions: quiz.questions.length,
        correctAnswers: finalCorrectCount,
        accuracy,
        timePerQuestion,
        completionRate: 100,
        shuffled: true,
        totalPossiblePoints: quiz.points,
        averageTimePerQuestion: timePerQuestion,
      })
    },
    [quiz, onComplete]
  )

  const timeLeft = useGameTimer(quiz.timeLimit, {
    isActive: gameState === 'playing',
    onExpire: useCallback(() => finishGame(score, correctAnswers, quiz.timeLimit), [finishGame, score, correctAnswers, quiz.timeLimit]),
  })

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex)

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const newScore = isCorrect ? score + pointsPerQuestion : score
    const newCorrectCount = isCorrect ? correctAnswers + 1 : correctAnswers
    const isLastQuestion = currentQuestionIndex >= shuffledQuestions.length - 1

    setTimeout(() => {
      if (isLastQuestion) {
        finishGame(newScore, newCorrectCount, quiz.timeLimit - timeLeft)
      } else {
        if (isCorrect) {
          setScore(newScore)
          setCorrectAnswers(newCorrectCount)
        }
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
      }
    }, 1000)
  }

  if (gameState === 'finished') {
    const isPerfectScore = correctAnswers === quiz.questions.length
    const finalScore = isPerfectScore ? quiz.points : score
    const accuracy = (correctAnswers / quiz.questions.length) * 100
    const timeUsed = quiz.timeLimit - timeLeft

    return (
      <div className="space-y-6 text-center">
        <PartyPopper className="mx-auto size-14 text-primary" aria-hidden="true" />
        <h2 className="text-3xl font-bold text-foreground">Quiz Complete!</h2>

        {isPerfectScore && (
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
            Perfect Score!
          </div>
        )}

        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
          <StatTile value={finalScore} label="Points" />
          <StatTile value={`${correctAnswers}/${quiz.questions.length}`} label="Correct" />
          <StatTile value={`${accuracy.toFixed(1)}%`} label="Accuracy" />
          <StatTile value={formatTime(timeUsed)} label="Time" />
        </div>

        <div className="mx-auto max-w-md rounded-xl bg-primary/10 p-4">
          <h4 className="mb-2 font-semibold text-primary">Performance Summary</h4>
          <p className="text-sm text-foreground/70">
            {accuracy >= 90
              ? "Outstanding! You've mastered this material!"
              : accuracy >= 75
                ? 'Great job! You have a solid understanding.'
                : accuracy >= 60
                  ? 'Good effort! Keep practicing to improve.'
                  : 'Keep studying! Review the material and try again.'}
          </p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg text-foreground/60">Loading questions...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/60">
          Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
        </div>
        <div className="text-sm font-semibold text-primary">Time: {formatTime(timeLeft)}</div>
      </div>

      <Progress value={((currentQuestionIndex + 1) / shuffledQuestions.length) * 100} />

      <div className="text-center">
        <h3 className="mb-6 text-2xl font-bold text-foreground">{currentQuestion.question}</h3>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === currentQuestion.correctAnswer
            const showCorrect = selectedAnswer !== null && isCorrect
            const showIncorrect = isSelected && !isCorrect

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={cn(
                  'w-full rounded-xl border-2 p-4 text-left transition-all duration-200',
                  selectedAnswer === null
                    ? 'cursor-pointer border-border bg-background hover:border-primary/50 hover:bg-primary/5'
                    : showCorrect
                      ? 'border-success bg-success/15 text-success'
                      : showIncorrect
                        ? 'border-destructive bg-destructive/15 text-destructive'
                        : 'cursor-not-allowed border-border bg-background opacity-50'
                )}
                aria-label={`Option ${String.fromCharCode(65 + index)}: ${option}`}
                aria-pressed={isSelected}
                aria-describedby={selectedAnswer !== null && isCorrect ? 'correct-answer' : undefined}
              >
                <div className="flex items-center">
                  <div
                    className={cn(
                      'mr-3 flex size-8 shrink-0 items-center justify-center rounded-full border-2 font-semibold',
                      selectedAnswer === null
                        ? 'border-primary text-primary'
                        : showCorrect
                          ? 'border-success text-success'
                          : showIncorrect
                            ? 'border-destructive text-destructive'
                            : 'border-border text-foreground/40'
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 text-left">{option}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedAnswer !== null && (
        <div className="animate-fade-in mt-6 rounded-xl border border-primary/20 bg-primary/10 p-4" role="region" aria-label="Answer Explanation">
          <h4 className="mb-2 font-semibold text-primary">Explanation:</h4>
          <p className="text-foreground/70" id="correct-answer">
            {currentQuestion.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
