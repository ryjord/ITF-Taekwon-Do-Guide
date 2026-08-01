import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { CATEGORY_ICONS } from './quizIcons'

export const QuizCategoryCard = ({ category, quizCount, isSelected, onClick }) => {
  const Icon = CATEGORY_ICONS[category.id]

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <Card
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={cn(
        'h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg',
        isSelected ? 'border-primary bg-primary text-primary-foreground shadow-md' : 'hover:border-primary/50'
      )}
      aria-pressed={isSelected}
      aria-label={`${category.name} category: ${category.description}. ${quizCount} ${quizCount === 1 ? 'quiz' : 'quizzes'} available. ${isSelected ? 'Currently selected' : 'Click to select'}`}
    >
      <CardContent>
        {Icon && <Icon className="mb-3 size-8" aria-hidden="true" />}

        <h3 className="mb-2 text-xl font-bold">{category.name}</h3>

        <p className={cn('mb-4 text-sm leading-relaxed', isSelected ? 'opacity-90' : 'text-foreground/70')}>
          {category.description}
        </p>

        <div
          className={cn(
            'mt-3 border-t pt-3 text-xs',
            isSelected ? 'border-white/30 opacity-80' : 'border-border text-foreground/60'
          )}
        >
          {quizCount} {quizCount === 1 ? 'quiz' : 'quizzes'} available
        </div>
      </CardContent>
    </Card>
  )
}
