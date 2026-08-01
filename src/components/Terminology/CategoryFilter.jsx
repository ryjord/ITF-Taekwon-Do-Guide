import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, allLabel = 'All Terms', className }) => {
  const options = [{ label: allLabel, value: '' }, ...categories.map((category) => ({ label: category, value: category }))]

  return (
    <div
      className={cn('flex flex-wrap justify-center gap-3 rounded-2xl border border-border/50 bg-muted/30 p-1', className)}
      role="toolbar"
      aria-label="Category filter options"
    >
      {options.map((option) => {
        const isSelected = selectedCategory === option.value
        return (
          <Button
            key={option.value || 'all'}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => onCategoryChange(option.value)}
            aria-pressed={isSelected}
            aria-label={`Filter by ${option.label} category`}
          >
            {option.label}
          </Button>
        )
      })}
    </div>
  )
}
