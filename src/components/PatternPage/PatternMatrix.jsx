import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PatternData from '@/data/patterns/Patterns.json'

export const PatternMatrix = ({ onPatternSelect }) => {
  return (
    <section className="w-full" role="region" aria-label="Pattern selection matrix">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold text-foreground">Pattern Matrix</h2>
        <p className="text-lg text-foreground/70">
          Complete collection of {PatternData.patterns.length} ITF Taekwon-Do patterns
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        role="grid"
        aria-label="ITF Taekwon-Do patterns grid"
      >
        {PatternData.patterns.map((pattern) => (
          <Card
            key={pattern.id}
            className="group transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
          >
            <CardContent className="text-center">
              <div
                className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-md transition-shadow duration-300 group-hover:shadow-lg"
                aria-hidden="true"
              >
                {pattern.patternShape || '+'}
              </div>

              <h3 className="mb-2 text-xl font-bold text-foreground transition-colors duration-200 group-hover:text-primary">
                {pattern.name}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-foreground/70">
                {pattern.moveCount} Movements &bull; {pattern.beltColor} Belt
              </p>

              <Button
                size="sm"
                onClick={() => onPatternSelect(pattern)}
                aria-label={`Explore ${pattern.name} pattern in detail`}
              >
                Explore Pattern
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
