import { useState, useEffect } from 'react'
import { ChevronLeft, PartyPopper, Target, Trophy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'

import { MCQGame } from './games/MCQGame'
import { FlashcardGame } from './games/FlashCardGame'
import { MatchingGame } from './games/MatchingGame'
import { TranslationGame } from './games/TranslationGame'
import { WordSearchGame } from './games/WordSearchGame'
import { CrosswordGame } from './games/CrosswordGame'
import { StatTile } from './StatTile'
import { ACHIEVEMENT_ICONS, DEFAULT_ACHIEVEMENT_ICON } from './quizIcons'
import { useScrollTo } from '../../hooks/useScrollTo'
import { useGlobalProgress } from '../../hooks/useGlobalProgess'
import achievementsData from '../../data/achievements/achievements.json'

const ACHIEVEMENTS_BY_ID = Object.fromEntries(achievementsData.achievements.map((a) => [a.id, a]))

const GAME_COMPONENTS = {
  mcq: MCQGame,
  flashcards: FlashcardGame,
  matching: MatchingGame,
  translation: TranslationGame,
  wordsearch: WordSearchGame,
  crossword: CrosswordGame,
}

const getItemType = (quiz) => {
  if (quiz.questionCount) return 'Questions'
  if (quiz.cards) return 'Cards'
  if (quiz.pairs) return 'Pairs'
  return 'Items'
}

const getItemCount = (quiz) => quiz.questionCount || quiz.cards?.length || quiz.pairs?.length || 0

export const QuizGame = ({ quiz, onBack }) => {
  const [gameState, setGameState] = useState('ready')
  const [gameResults, setGameResults] = useState(null)
  const [newAchievements, setNewAchievements] = useState([])

  const scrollToTop = useScrollTo()
  const recordGameCompletion = useGlobalProgress((state) => state.recordGameCompletion)

  useEffect(() => {
    if (gameState === 'playing' || gameState === 'finished') {
      scrollToTop()
    }
  }, [gameState, scrollToTop])

  const handleGameComplete = async (results) => {
    const progressData = {
      ...results,
      gameType: quiz.gameType,
      category: quiz.category,
      score: results.score || 0,
      timeUsed: results.timeUsed || 0,
    }

    try {
      const { newAchievements: earnedAchievements } = await recordGameCompletion(progressData)
      if (earnedAchievements.length > 0) {
        setNewAchievements(earnedAchievements)
      }
    } catch (error) {
      console.error('Error recording progress:', error)
    }

    setGameResults(results)
    setGameState('finished')
  }

  const handlePlayAgain = () => {
    setGameState('ready')
    setGameResults(null)
    setNewAchievements([])
  }

  const handleStartGame = () => {
    setGameState('playing')
    setTimeout(scrollToTop, 100)
  }

  const GameComponent = GAME_COMPONENTS[quiz.gameType]

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} aria-label="Back to quizzes">
          <ChevronLeft className="size-4" aria-hidden="true" />
          Back to Quizzes
        </Button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">{quiz.title}</h1>
          <p className="text-foreground/70">{quiz.description}</p>
        </div>

        <div className="w-24" aria-hidden="true" />
      </div>

      <Card>
        <CardContent>
          {gameState === 'ready' && (
            <div className="space-y-6 text-center">
              <Target className="mx-auto size-14 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-foreground">Ready to Start?</h2>
              <p className="mx-auto max-w-md text-foreground/70">
                {quiz.questionCount && `${quiz.questionCount} questions • `}
                {quiz.cards && `${quiz.cards.length} cards • `}
                {quiz.pairs && `${quiz.pairs.length} pairs to match • `}
                {Math.floor(quiz.timeLimit / 60)} minute time limit
              </p>
              <Button onClick={handleStartGame} size="lg" aria-label="Start the game">
                Start Game
              </Button>
            </div>
          )}

          {gameState === 'playing' &&
            (GameComponent ? (
              <GameComponent quiz={quiz} onComplete={handleGameComplete} />
            ) : (
              <p className="text-center text-foreground/70">This game type is under development!</p>
            ))}

          {gameState === 'finished' && gameResults && (
            <div className="space-y-6 text-center">
              {newAchievements.length > 0 && (
                <Card className="border-primary/30 bg-primary/5" role="alert" aria-live="polite">
                  <CardContent>
                    <h3 className="mb-3 flex items-center justify-center gap-2 text-lg font-bold text-foreground">
                      <PartyPopper className="size-5 text-primary" aria-hidden="true" />
                      New Achievements Unlocked!
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                      {newAchievements.map((achievementId) => {
                        const achievement = ACHIEVEMENTS_BY_ID[achievementId]
                        const Icon = ACHIEVEMENT_ICONS[achievementId] || DEFAULT_ACHIEVEMENT_ICON
                        return (
                          <div
                            key={achievementId}
                            className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                          >
                            <Icon className="size-4" aria-hidden="true" />
                            {achievement?.name || achievementId}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Trophy className="mx-auto size-14 text-primary" aria-hidden="true" />
              <h2 className="text-3xl font-bold text-foreground">Game Complete!</h2>

              <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
                <StatTile value={gameResults.score} label="Score" />

                {gameResults.totalQuestions && (
                  <StatTile value={`${gameResults.correctAnswers}/${gameResults.totalQuestions}`} label="Correct" />
                )}

                {gameResults.totalCards && (
                  <StatTile value={`${gameResults.rememberedCards}/${gameResults.totalCards}`} label="Remembered" />
                )}

                {gameResults.totalPairs && (
                  <StatTile value={`${gameResults.matchedPairs}/${gameResults.totalPairs}`} label="Matched" />
                )}

                <StatTile value={formatTime(gameResults.timeUsed)} label="Time Used" />
              </div>

              <div className="flex justify-center gap-4">
                <Button onClick={handlePlayAgain} aria-label="Play this game again">
                  Play Again
                </Button>
                <Button variant="secondary" onClick={onBack} aria-label="Return to quiz selection">
                  Back to Quizzes
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
        <Card className="bg-primary/5">
          <CardContent className="py-3">
            <div className="font-semibold text-primary">{getItemType(quiz)}</div>
            <div>{getItemCount(quiz)}</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardContent className="py-3">
            <div className="font-semibold text-primary">Time Limit</div>
            <div>{Math.floor(quiz.timeLimit / 60)} minutes</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardContent className="py-3">
            <div className="font-semibold text-primary">Points</div>
            <div>{quiz.points} total</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
