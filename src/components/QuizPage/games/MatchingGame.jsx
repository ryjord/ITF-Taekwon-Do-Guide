import { useState, useEffect, useCallback } from 'react'
import { Sparkles } from 'lucide-react'

import { cn, formatTime, shuffle } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

import { StatTile } from '../StatTile'
import { GAME_TYPE_ICONS } from '../quizIcons'
import { useGameTimer } from '../../../hooks/useGameTimer'

const MatchingIcon = GAME_TYPE_ICONS.matching

const buildPairs = (quizPairs) => {
  const cardPairs = [
    ...quizPairs.map((pair) => ({
      ...pair,
      id: pair.id + '-english',
      isEnglish: true,
      displayText: pair.english,
      subText: null,
      matchId: pair.id,
    })),
    ...quizPairs.map((pair) => ({
      ...pair,
      id: pair.id + '-romanized',
      isEnglish: false,
      displayText: pair.romanized,
      subText: pair.korean,
      matchId: pair.id,
    })),
  ]

  return shuffle(cardPairs).map((pair) => ({ ...pair, isFlipped: false, isMatched: false }))
}

export const MatchingGame = ({ quiz, onComplete }) => {
  const [pairs, setPairs] = useState(() => buildPairs(quiz.pairs))
  const [selectedCard, setSelectedCard] = useState(null)
  const [matchedPairs, setMatchedPairs] = useState([])
  const [gameState, setGameState] = useState('playing')
  const [score, setScore] = useState(0)

  const pointsPerPair = Math.floor(quiz.points / quiz.pairs.length)

  const finishGame = useCallback(
    (finalScore, finalMatchedCount, timeUsed) => {
      setGameState('finished')

      const isPerfectScore = finalMatchedCount === quiz.pairs.length
      const adjustedScore = isPerfectScore ? quiz.points : finalScore
      const completionRate = (finalMatchedCount / quiz.pairs.length) * 100
      const timePerPair = timeUsed / quiz.pairs.length

      onComplete({
        gameType: quiz.gameType,
        category: quiz.category,
        score: adjustedScore,
        timeUsed,
        perfectScore: isPerfectScore,
        totalPairs: quiz.pairs.length,
        matchedPairs: finalMatchedCount,
        completionRate,
        timePerPair,
        shuffled: true,
        totalPossiblePoints: quiz.points,
        averageTimePerPair: timePerPair,
      })
    },
    [quiz, onComplete]
  )

  const timeLeft = useGameTimer(quiz.timeLimit, {
    isActive: gameState === 'playing',
    onExpire: useCallback(
      () => finishGame(score, matchedPairs.length, quiz.timeLimit),
      [finishGame, score, matchedPairs.length, quiz.timeLimit]
    ),
  })

  useEffect(() => {
    if (matchedPairs.length === quiz.pairs.length && quiz.pairs.length > 0) {
      const timer = setTimeout(() => finishGame(score, matchedPairs.length, quiz.timeLimit - timeLeft), 500)
      return () => clearTimeout(timer)
    }
  }, [matchedPairs, quiz.pairs.length, quiz.timeLimit, score, timeLeft, finishGame])

  const handleCardClick = useCallback(
    (index) => {
      if (pairs[index].isFlipped || pairs[index].isMatched) return

      const newPairs = [...pairs]
      newPairs[index].isFlipped = true
      setPairs(newPairs)

      if (selectedCard === null) {
        setSelectedCard(index)
      } else {
        const firstCard = pairs[selectedCard]
        const secondCard = pairs[index]
        const isMatch = firstCard.matchId === secondCard.matchId

        if (isMatch) {
          newPairs[selectedCard].isMatched = true
          newPairs[index].isMatched = true
          setPairs(newPairs)
          setMatchedPairs((prev) => [...prev, firstCard.matchId])
          setScore((prev) => prev + pointsPerPair)
        } else {
          setTimeout(() => {
            setPairs((prev) => {
              const resetPairs = [...prev]
              resetPairs[selectedCard].isFlipped = false
              resetPairs[index].isFlipped = false
              return resetPairs
            })
          }, 1000)
        }
        setSelectedCard(null)
      }
    },
    [pairs, selectedCard, pointsPerPair]
  )

  if (gameState === 'finished') {
    const isPerfectScore = matchedPairs.length === quiz.pairs.length
    const finalScore = isPerfectScore ? quiz.points : score
    const completionRate = (matchedPairs.length / quiz.pairs.length) * 100
    const timeUsed = quiz.timeLimit - timeLeft

    return (
      <div className="space-y-6 text-center">
        {MatchingIcon && <MatchingIcon className="mx-auto size-14 text-primary" aria-hidden="true" />}
        <h2 className="text-3xl font-bold text-foreground">Matching Complete!</h2>

        {isPerfectScore && (
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
            Perfect Memory!
          </div>
        )}

        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
          <StatTile value={finalScore} label="Points" />
          <StatTile value={`${matchedPairs.length}/${quiz.pairs.length}`} label="Matched" />
          <StatTile value={`${completionRate.toFixed(1)}%`} label="Completion" />
          <StatTile value={formatTime(timeUsed)} label="Time" />
        </div>
      </div>
    )
  }

  if (pairs.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg text-foreground/60">Setting up matching game...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/60">
          Matched {matchedPairs.length} of {quiz.pairs.length} pairs
        </div>
        <div className="text-sm font-semibold text-primary">Time: {formatTime(timeLeft)}</div>
      </div>

      <Progress value={(matchedPairs.length / quiz.pairs.length) * 100} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {pairs.map((pair, index) => (
          <div
            key={`${pair.id}-${index}`}
            onClick={() => handleCardClick(index)}
            className={cn(
              'aspect-square cursor-pointer transition-transform duration-300',
              !(pair.isFlipped || pair.isMatched) && 'hover:scale-105'
            )}
            role="button"
            aria-label={
              pair.isFlipped || pair.isMatched
                ? `${pair.isEnglish ? 'English' : 'Romanized Korean'} card: ${pair.displayText}`
                : 'Hidden card - click to reveal'
            }
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(index)}
          >
            <div
              className={cn(
                'flex h-full w-full items-center justify-center rounded-xl border-2 p-4 text-center transition-all duration-300',
                pair.isMatched
                  ? 'border-success bg-success text-white shadow-lg'
                  : pair.isFlipped
                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                    : 'border-primary bg-background hover:bg-primary/10'
              )}
            >
              {pair.isFlipped || pair.isMatched ? (
                <div className="w-full">
                  <div className="mb-1 text-lg font-bold">{pair.displayText}</div>
                  {pair.subText && <div className="mt-1 border-t border-white/30 pt-1 text-sm opacity-70">{pair.subText}</div>}
                </div>
              ) : (
                <div className="text-2xl">?</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-foreground/60">
        Click cards to find matching English-Romanized pairs. Match all pairs to complete the game!
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
