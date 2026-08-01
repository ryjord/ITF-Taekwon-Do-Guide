import { Badge } from '@/components/ui/badge'
import PatternData from '@/data/patterns/Patterns.json'

const totalMovements = PatternData.patterns.reduce((sum, pattern) => sum + pattern.moveCount, 0)

const STATS = [
  { label: 'Patterns', value: String(PatternData.patterns.length) },
  { label: 'White to Black Belt', value: '9' },
  { label: 'Total Movements', value: String(totalMovements) },
]

export const PatternHero = () => {
  return (
    <section
      className="relative overflow-hidden border-b border-primary/30 bg-linear-to-br from-primary/50 via-primary/40 to-primary py-20"
      role="banner"
      aria-label="ITF Taekwon-Do Patterns Introduction"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground drop-shadow-lg md:text-7xl lg:text-8xl">
          ITF <span className="text-primary">Patterns</span>
        </h1>
        <div className="mx-auto mb-6 h-1 w-32 rounded-full bg-primary shadow-lg" />

        <p className="mx-auto mb-10 max-w-4xl text-xl font-light leading-relaxed text-foreground/90 md:text-2xl lg:text-3xl">
          The <span className="font-semibold text-primary">24 Tul</span> of Traditional Taekwon-Do &mdash;
          from fundamental forms to master-level artistry and philosophical expression.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {STATS.map((stat) => (
            <Badge
              key={stat.label}
              variant="outline"
              className="h-auto gap-2 rounded-full border-white/30 bg-white/20 px-6 py-3 text-sm backdrop-blur-sm"
            >
              <span className="font-bold text-foreground">{stat.value}</span>
              <span className="font-medium text-foreground/80">{stat.label}</span>
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
