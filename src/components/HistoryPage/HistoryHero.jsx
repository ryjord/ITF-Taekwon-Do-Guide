import { Card, CardContent } from '@/components/ui/card'

const MILESTONES = [
  { year: '1955', label: 'Founded' },
  { year: '1966', label: 'ITF Established' },
  { year: '1972', label: 'Encyclopedia' },
  { year: '140+', label: 'Countries' },
  { year: '24', label: 'Patterns' },
  { year: '60M+', label: 'Practitioners' },
]

export const HistoryHero = () => {
  return (
    <section
      className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary/5 via-background to-primary/10 py-16 sm:py-24"
      role="banner"
      aria-label="ITF Taekwon-Do History Introduction"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center">
          <div className="mb-8 sm:mb-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl">
              ITF <span className="text-primary">History</span>
            </h1>
            <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-primary sm:mb-6 sm:w-32" />
            <p className="mx-auto max-w-3xl px-4 text-base leading-relaxed text-foreground/80 sm:text-lg lg:text-xl">
              Journey through the remarkable evolution of International Taekwon-Do Federation, from its
              visionary founding by General Choi Hong Hi to its current global prominence.
            </p>
          </div>

          <div
            className="mx-auto mb-12 grid max-w-6xl grid-cols-2 gap-4 px-4 sm:mb-16 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6"
            role="grid"
            aria-label="ITF Taekwon-Do historical milestones"
          >
            {MILESTONES.map((milestone) => (
              <Card
                key={milestone.label}
                className="flex min-h-30 flex-col justify-center text-center transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-lg"
              >
                <CardContent>
                  <div className="mb-2 text-2xl font-bold text-primary sm:text-3xl">{milestone.year}</div>
                  <div className="text-xs font-semibold uppercase leading-tight tracking-wide text-foreground/80 sm:text-sm">
                    {milestone.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mx-auto max-w-2xl border-primary/20">
            <CardContent>
              <p className="mb-3 text-base font-medium leading-relaxed text-foreground/80 sm:text-lg">
                <span className="font-semibold text-primary">April 11, 1955</span> marks the birth of
                Taekwon-Do, when General Choi Hong Hi officially named the art "the way of the foot and
                fist."
              </p>
              <p className="text-sm text-foreground/60">
                From Korean military roots to worldwide martial art phenomenon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
