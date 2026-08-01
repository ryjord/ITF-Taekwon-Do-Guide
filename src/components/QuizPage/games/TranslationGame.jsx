import { useState, useCallback } from 'react'
import { Check, FileText, Sparkles, Volume2, X } from 'lucide-react'

import { cn, formatTime, shuffle } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

import { StatTile } from '../StatTile'
import { useGameTimer } from '../../../hooks/useGameTimer'

const COMMON_VARIATIONS = {
  colour: 'color',
  favourite: 'favorite',
  centre: 'center',
  honour: 'honor',
  defence: 'defense',
}

const normalizeAnswer = (answer) => answer.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')

const isAnswerCorrect = (userAnswer, correctAnswer) => {
  const normalizedUser = normalizeAnswer(userAnswer)
  const normalizedCorrect = normalizeAnswer(correctAnswer)

  if (normalizedUser === normalizedCorrect) return true

  if (
    COMMON_VARIATIONS[normalizedUser] === normalizedCorrect ||
    COMMON_VARIATIONS[normalizedCorrect] === normalizedUser
  ) {
    return true
  }

  const withoutArticles = (str) => str.replace(/^(a|an|the)\s+/i, '')
  if (withoutArticles(normalizedUser) === withoutArticles(normalizedCorrect)) return true

  if (
    normalizedUser + 's' === normalizedCorrect ||
    normalizedUser === normalizedCorrect + 's' ||
    normalizedUser + 'es' === normalizedCorrect ||
    normalizedUser === normalizedCorrect + 'es'
  ) {
    return true
  }

  return false
}

export const TranslationGame = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameState, setGameState] = useState('playing')
  const [shuffledQuestions] = useState(() => shuffle(quiz.questions))
  const [feedback, setFeedback] = useState({ show: false, isCorrect: false, message: '' })
  const [answeredQuestions, setAnsweredQuestions] = useState([])

  const pointsPerQuestion = Math.floor(quiz.points / quiz.questions.length)
  const currentQuestion = shuffledQuestions[currentQuestionIndex]

  const playAudio = () => {
    if (currentQuestion?.audio) {
      const audio = new Audio(currentQuestion.audio)
      audio.play().catch((error) => console.warn('Audio playback failed:', error))
    }
  }

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
        answeredQuestions,
      })
    },
    [quiz, answeredQuestions, onComplete]
  )

  const timeLeft = useGameTimer(quiz.timeLimit, {
    isActive: gameState === 'playing',
    onExpire: useCallback(
      () => finishGame(score, correctAnswers, quiz.timeLimit),
      [finishGame, score, correctAnswers, quiz.timeLimit]
    ),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!userInput.trim()) return

    const isCorrect = isAnswerCorrect(userInput, currentQuestion.english)
    const newScore = isCorrect ? score + pointsPerQuestion : score
    const newCorrectCount = isCorrect ? correctAnswers + 1 : correctAnswers

    setFeedback(
      isCorrect
        ? { show: true, isCorrect: true, message: 'Correct!' }
        : { show: true, isCorrect: false, message: `Almost! The answer is "${currentQuestion.english}"` }
    )

    const newAnsweredQuestions = [
      ...answeredQuestions,
      { ...currentQuestion, userAnswer: userInput, isCorrect, points: isCorrect ? pointsPerQuestion : 0 },
    ]
    setAnsweredQuestions(newAnsweredQuestions)

    const isLastQuestion = currentQuestionIndex >= shuffledQuestions.length - 1
    const timeUsed = quiz.timeLimit - timeLeft

    setTimeout(() => {
      if (isLastQuestion) {
        finishGame(newScore, newCorrectCount, timeUsed)
      } else {
        if (isCorrect) {
          setScore(newScore)
          setCorrectAnswers(newCorrectCount)
        }
        setCurrentQuestionIndex((prev) => prev + 1)
        setUserInput('')
        setFeedback({ show: false, isCorrect: false, message: '' })
      }
    }, 1500)
  }

  const handleSkip = () => {
    setFeedback({ show: true, isCorrect: false, message: `Skipped! The answer was "${currentQuestion.english}"` })

    const newAnsweredQuestions = [
      ...answeredQuestions,
      { ...currentQuestion, userAnswer: 'skipped', isCorrect: false, points: 0 },
    ]
    setAnsweredQuestions(newAnsweredQuestions)

    const isLastQuestion = currentQuestionIndex >= shuffledQuestions.length - 1
    const timeUsed = quiz.timeLimit - timeLeft

    setTimeout(() => {
      if (isLastQuestion) {
        finishGame(score, correctAnswers, timeUsed)
      } else {
        setCurrentQuestionIndex((prev) => prev + 1)
        setUserInput('')
        setFeedback({ show: false, isCorrect: false, message: '' })
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
        <FileText className="mx-auto size-14 text-primary" aria-hidden="true" />
        <h2 className="text-3xl font-bold text-foreground">Translation Complete!</h2>

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

        <div className="mx-auto max-w-2xl space-y-4 rounded-xl border bg-card p-6 text-left">
          <h3 className="text-xl font-bold text-foreground">Your Answers</h3>
          {answeredQuestions.map((question, index) => (
            <div
              key={index}
              className={cn(
                'rounded-lg border-2 p-4',
                question.isCorrect ? 'border-success/30 bg-success/10' : 'border-destructive/30 bg-destructive/10'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-foreground">{question.romanized}</div>
                  <div className="text-sm text-foreground/60">{question.korean}</div>
                  <div className="mt-1 text-sm">
                    Your answer:{' '}
                    <span className={question.isCorrect ? 'text-success' : 'text-destructive'}>
                      {question.userAnswer}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {question.isCorrect ? (
                    <Check className="ml-auto size-5 text-success" aria-hidden="true" />
                  ) : (
                    <X className="ml-auto size-5 text-destructive" aria-hidden="true" />
                  )}
                  <div className="text-sm text-foreground/60">+{question.points}</div>
                </div>
              </div>
            </div>
          ))}
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/60">
          Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
        </div>
        <div className="text-sm font-semibold text-primary">Time: {formatTime(timeLeft)}</div>
      </div>

      <Progress value={((currentQuestionIndex + 1) / shuffledQuestions.length) * 100} />

      <div className="space-y-6 rounded-2xl border bg-card p-8 text-center shadow-lg">
        <div className="space-y-4">
          <div className="text-sm text-foreground/60">Write the English translation:</div>
          <div className="mb-2 text-4xl font-bold text-primary">{currentQuestion.romanized}</div>
          <div className="text-2xl text-foreground/80">{currentQuestion.korean}</div>

          {currentQuestion.audio && (
            <Button type="button" variant="secondary" onClick={playAudio} aria-label="Play pronunciation">
              <Volume2 className="size-4" aria-hidden="true" />
              Listen
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type the English translation..."
            className="h-auto rounded-xl border-2 border-primary px-4 py-3 text-center text-lg"
            disabled={feedback.show}
            autoFocus
            aria-label="Translation input"
          />

          {feedback.show && (
            <div
              className={cn(
                'rounded-xl p-4 text-lg font-semibold',
                feedback.isCorrect
                  ? 'border border-success/30 bg-success/15 text-success'
                  : 'border border-destructive/30 bg-destructive/10 text-destructive'
              )}
              role="alert"
              aria-live="polite"
            >
              {feedback.message}
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            <Button type="button" variant="outline" onClick={handleSkip} disabled={feedback.show} aria-label="Skip question">
              Skip
            </Button>
            <Button type="submit" disabled={feedback.show || !userInput.trim()} aria-label="Check answer">
              Check Answer
            </Button>
          </div>
        </form>
      </div>

      <div className="text-center text-sm text-foreground/60">
        Type the English meaning of the Korean word. Don't worry about capitalization or small spelling mistakes!
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
          <span className="text-foreground/60">Score:</span>
          <span className="font-bold text-primary">{score}</span>
          <span className="text-foreground/60">/ {quiz.points}</span>
        </div>
      </div>
    </div>
  )
}
