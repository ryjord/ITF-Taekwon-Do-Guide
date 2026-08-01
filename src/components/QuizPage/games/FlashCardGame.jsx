import { useState, useRef, useCallback } from 'react'
import { Sparkles, Volume2 } from 'lucide-react'

import { cn, formatTime, shuffle } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

import { StatTile } from '../StatTile'
import { GAME_TYPE_ICONS } from '../quizIcons'
import { useGameTimer } from '../../../hooks/useGameTimer'

const FlashcardIcon = GAME_TYPE_ICONS.flashcards

export const FlashcardGame = ({ quiz, onComplete }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [score, setScore] = useState(0)
  const [gameState, setGameState] = useState('playing')
  const [rememberedCards, setRememberedCards] = useState(0)
  const [shuffledCards] = useState(() => shuffle(quiz.cards))

  const audioRef = useRef(null)

  const pointsPerCard = Math.floor(quiz.points / quiz.cards.length)
  const currentCardData = shuffledCards[currentCardIndex]

  const playAudio = () => {
    if (audioRef.current && currentCardData?.audio) {
      audioRef.current.play().catch((error) => console.warn('Audio playback failed:', error))
    }
  }

  const handleCardFlip = () => setIsFlipped((prev) => !prev)

  const finishGame = useCallback(
    (finalScore, finalRemembered, timeUsed) => {
      setGameState('finished')

      const isPerfectScore = finalRemembered === quiz.cards.length
      const adjustedScore = isPerfectScore ? quiz.points : finalScore

      onComplete({
        gameType: quiz.gameType,
        category: quiz.category,
        score: adjustedScore,
        timeUsed,
        perfectScore: isPerfectScore,
        totalCards: quiz.cards.length,
        rememberedCards: finalRemembered,
        completionRate: (finalRemembered / quiz.cards.length) * 100,
        timePerCard: timeUsed / quiz.cards.length,
        shuffled: true,
        totalPossiblePoints: quiz.points,
      })
    },
    [quiz, onComplete]
  )

  const timeLeft = useGameTimer(quiz.timeLimit, {
    isActive: gameState === 'playing',
    onExpire: useCallback(
      () => finishGame(score, rememberedCards, quiz.timeLimit),
      [finishGame, score, rememberedCards, quiz.timeLimit]
    ),
  })

  const handleNextCard = (remembered) => {
    const newScore = remembered ? score + pointsPerCard : score
    const newRemembered = remembered ? rememberedCards + 1 : rememberedCards
    const isLastCard = currentCardIndex >= shuffledCards.length - 1

    if (isLastCard) {
      finishGame(newScore, newRemembered, quiz.timeLimit - timeLeft)
    } else {
      if (remembered) {
        setScore(newScore)
        setRememberedCards(newRemembered)
      }
      setCurrentCardIndex((prev) => prev + 1)
      setIsFlipped(false)
    }
  }

  if (gameState === 'finished') {
    const isPerfectScore = rememberedCards === quiz.cards.length
    const finalScore = isPerfectScore ? quiz.points : score
    const timeUsed = quiz.timeLimit - timeLeft

    return (
      <div className="space-y-6 text-center">
        {FlashcardIcon && <FlashcardIcon className="mx-auto size-14 text-primary" aria-hidden="true" />}
        <h2 className="text-3xl font-bold text-foreground">Flashcards Complete!</h2>

        {isPerfectScore && (
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
            Perfect Score!
          </div>
        )}

        <div className="mx-auto grid max-w-md grid-cols-3 gap-4">
          <StatTile value={finalScore} label="Points" />
          <StatTile value={`${rememberedCards}/${quiz.cards.length}`} label="Remembered" />
          <StatTile value={formatTime(timeUsed)} label="Time" />
        </div>
      </div>
    )
  }

  if (!currentCardData) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg text-foreground/60">Loading cards...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/60">
          Card {currentCardIndex + 1} of {shuffledCards.length}
        </div>
        <div className="text-sm font-semibold text-primary">Time: {formatTime(timeLeft)}</div>
      </div>

      <Progress value={((currentCardIndex + 1) / shuffledCards.length) * 100} />

      <div className="flex justify-center">
        <div
          onClick={handleCardFlip}
          className="h-48 w-80 cursor-pointer perspective-[1000px]"
          role="button"
          aria-label={isFlipped ? 'Flip card to front' : 'Flip card to back'}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleCardFlip()}
        >
          <div
            className={cn(
              'relative h-full w-full transform-3d transition-transform duration-500',
              isFlipped && 'rotate-y-180'
            )}
          >
            <div className="absolute flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-primary bg-background p-6 backface-hidden">
              <h3 className="mb-4 text-center text-2xl font-bold text-foreground">{currentCardData.front}</h3>
              <p className="text-sm text-foreground/60">Click to flip</p>
            </div>

            <div className="absolute flex h-full w-full rotate-y-180 flex-col items-center justify-center rounded-2xl bg-primary p-6 text-primary-foreground backface-hidden">
              <h3 className="mb-2 text-center text-2xl font-bold">{currentCardData.back}</h3>
              {currentCardData.romanized && <p className="mb-2 text-lg text-primary-foreground/80">({currentCardData.romanized})</p>}
              <p className="mb-4 text-center text-sm text-primary-foreground/70">{currentCardData.meaning}</p>
              {currentCardData.audio && (
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    playAudio()
                  }}
                  aria-label="Play pronunciation"
                >
                  <Volume2 className="size-4" aria-hidden="true" />
                  Play Audio
                </Button>
              )}
              <audio ref={audioRef} src={currentCardData.audio} preload="none" aria-label="Audio pronunciation" />
            </div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="flex justify-center gap-4">
          <Button variant="destructive" onClick={() => handleNextCard(false)} aria-label="Mark as needs practice">
            Need Practice
          </Button>
          <Button variant="success" onClick={() => handleNextCard(true)} aria-label="Mark as remembered">
            I Remember!
          </Button>
        </div>
      )}
    </div>
  )
}
