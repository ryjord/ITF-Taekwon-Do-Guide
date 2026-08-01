import { cn } from '@/lib/utils'

export const CategoryNavigation = ({ categories, currentCategory, onCategoryChange }) => {
  const handleKeyDown = (event, categoryId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onCategoryChange(categoryId)
    }
  }

  return (
    <nav
      className="sticky top-16 z-40 border-b border-border bg-background/95 shadow-sm backdrop-blur-sm supports-backdrop-filter:bg-background/60"
      role="navigation"
      aria-label="Technique categories"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex overflow-x-auto" role="tablist" aria-label="Select technique category">
          {categories.map((category) => {
            const isActive = currentCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                onKeyDown={(event) => handleKeyDown(event, category.id)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-semibold transition-all duration-200 md:text-base',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:z-10',
                  isActive
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-transparent text-foreground/70 hover:border-primary/30 hover:bg-primary/5 hover:text-primary'
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`View ${category.name} techniques`}
                role="tab"
              >
                <category.icon className="size-4 shrink-0" aria-hidden="true" />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
