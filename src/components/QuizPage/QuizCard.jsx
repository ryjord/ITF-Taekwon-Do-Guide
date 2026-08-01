import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { GAME_TYPE_ICONS, DIFFICULTY_BADGE_VARIANT } from './quizIcons'

const getItemCount = (quiz) => {
  if (quiz.questionCount) return `${quiz.questionCount} questions`
  if (quiz.cards) return `${quiz.cards.length} cards`
  if (quiz.pairs) return `${quiz.pairs.length} pairs`
  return null
}

export const QuizCard = ({ quiz, gameType, onSelect }) => {
  const GameTypeIcon = GAME_TYPE_ICONS[gameType?.id]
  const itemCount = getItemCount(quiz)
  const timeLimit = `${Math.floor(quiz.timeLimit / 60)} min`

  const handleSelect = () => onSelect(quiz)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelect()
    }
  }

  return (
    <Card
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="cursor-pointer transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-lg"
      aria-label={`Start ${quiz.title} quiz - ${quiz.description}. Difficulty: ${quiz.difficulty}. Points: ${quiz.points}.`}
    >
      <CardContent>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            {GameTypeIcon && <GameTypeIcon className="size-4" aria-hidden="true" />}
            <span>{gameType?.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={DIFFICULTY_BADGE_VARIANT[quiz.difficulty]}>
              {quiz.difficulty.toUpperCase()}
            </Badge>
            <span className="text-sm text-foreground/60">{quiz.points} pts</span>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold text-foreground">{quiz.title}</h3>

        <p className="mb-4 text-sm leading-relaxed text-foreground/70">{quiz.description}</p>

        <div className="flex items-center justify-between text-sm text-foreground/60">
          <div className="flex items-center gap-4">
            {itemCount && <span>{itemCount}</span>}
            <span>{timeLimit}</span>
          </div>
          <span className="font-medium text-primary">Start {gameType?.name} →</span>
        </div>
      </CardContent>
    </Card>
  )
}
