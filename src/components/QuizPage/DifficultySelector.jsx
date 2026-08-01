import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DIFFICULTY_ICONS } from './quizIcons'

export const DifficultySelector = ({ difficulties, selectedDifficulty, onDifficultySelect }) => {
  const handleDifficultyClick = (difficultyId) => {
    onDifficultySelect(selectedDifficulty === difficultyId ? null : difficultyId)
  }

  return (
    <div className="flex flex-wrap justify-center gap-4" role="group" aria-label="Select difficulty level">
      {difficulties.map((difficulty) => {
        const isSelected = selectedDifficulty === difficulty.id
        const Icon = DIFFICULTY_ICONS[difficulty.id]

        return (
          <Button
            key={difficulty.id}
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => handleDifficultyClick(difficulty.id)}
            className={cn('rounded-full px-6 py-3', isSelected && 'scale-105 shadow-md')}
            aria-pressed={isSelected}
            aria-label={`${difficulty.name} difficulty ${isSelected ? 'selected' : ''}`}
          >
            {Icon && <Icon className="size-4" aria-hidden="true" />}
            {difficulty.name}
          </Button>
        )
      })}
    </div>
  )
}
