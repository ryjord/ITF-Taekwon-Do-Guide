import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import PatternData from '@/data/patterns/Patterns.json'

const BELT_GROUPS = PatternData.patterns.reduce((groups, pattern) => {
  const beltCategory = `${pattern.beltColor} Belt`
  groups[beltCategory] ??= []
  groups[beltCategory].push(pattern)
  return groups
}, {})

export const PatternList = ({ selectedPattern, onPatternSelect }) => {
  const handleKeyDown = (event, pattern) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onPatternSelect(pattern)
    }
  }

  return (
    <div className="space-y-6">
      {Object.entries(BELT_GROUPS).map(([belt, patterns]) => (
        <div key={belt} className="space-y-3">
          <h4 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-foreground/80">
            {belt}
          </h4>
          <div className="space-y-1">
            {patterns.map((pattern) => (
              <Button
                key={pattern.id}
                variant={selectedPattern?.id === pattern.id ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start text-left',
                  selectedPattern?.id !== pattern.id && 'text-foreground/80'
                )}
                onClick={() => onPatternSelect(pattern)}
                onKeyDown={(event) => handleKeyDown(event, pattern)}
                aria-current={selectedPattern?.id === pattern.id ? 'page' : undefined}
                aria-label={`Select ${pattern.name} pattern`}
              >
                {pattern.name}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export const PatternSidebar = ({ selectedPattern, onPatternSelect }) => {
  return (
    <aside
      className="sticky top-24 max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-lg"
      role="navigation"
      aria-label="Pattern selection sidebar"
    >
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-bold text-foreground">Pattern Library</h3>
        <p className="text-sm text-foreground/60">
          {PatternData.patterns.length} patterns organized by belt level
        </p>
      </div>

      <PatternList selectedPattern={selectedPattern} onPatternSelect={onPatternSelect} />
    </aside>
  )
}
