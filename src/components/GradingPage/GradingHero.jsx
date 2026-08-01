import { StatCard } from '@/components/StatCard'

const MILESTONES = [
  { value: '10', label: 'Kup Grades' },
  { value: '9+', label: 'Dan Grades' },
  { value: '6', label: 'Belt Colours' },
  { value: '8', label: 'Categories Tested' },
]

export const GradingHero = () => {
  return (
    <section
      className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-24"
      role="banner"
      aria-label="ITF Taekwon-Do Grading and Belts Introduction"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center">
          <div className="mb-8 sm:mb-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
              Grading <span className="text-primary">& Belts</span>
            </h1>
            <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-primary sm:mb-6 sm:w-32" />
            <p className="mx-auto max-w-3xl px-4 text-base leading-relaxed text-foreground/80 sm:text-lg lg:text-xl">
              What each belt colour represents, and what's tested at every grading from white belt to
              black belt.
            </p>
          </div>

          <div
            className="mx-auto mb-12 grid max-w-4xl grid-cols-2 gap-4 px-4 sm:mb-16 sm:gap-6 lg:grid-cols-4"
            role="grid"
            aria-label="Grading overview statistics"
          >
            {MILESTONES.map((milestone) => (
              <StatCard key={milestone.label} value={milestone.value} label={milestone.label} className="min-h-30 justify-center" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
