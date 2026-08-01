import { Card, CardContent } from '@/components/ui/card'
import { Timeline } from '../components/HistoryPage/Timeline'
import { HistoryHero } from '../components/HistoryPage/HistoryHero'
import historyData from '../data/history/HistoryTimeline.json'

export const History = () => {
  return (
    <div
      className="min-h-screen bg-linear-to-br from-primary/5 via-background to-primary/10 py-24"
      role="main"
      aria-label="ITF Taekwon-Do History Application"
    >
      <HistoryHero />

      <section className="w-full" role="region" aria-label="ITF Taekwon-Do Historical Timeline">
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Historical Chronology
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
            Journey through seven decades of ITF Taekwon-Do evolution, from military roots to global
            martial art phenomenon.
          </p>
        </div>
        <Timeline events={historyData.timeline} />
      </section>

      <section className="mt-16 w-full lg:mt-20" role="region" aria-label="Continuing the ITF Taekwon-Do Legacy">
        <Card className="mx-auto max-w-4xl border-border text-center [--card-spacing:--spacing(8)] sm:[--card-spacing:--spacing(10)] lg:[--card-spacing:--spacing(12)]">
          <CardContent>
            <h3 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
              Preserving Tradition, Embracing Innovation
            </h3>
            <p className="mb-6 text-base leading-relaxed text-foreground/70 sm:text-lg">
              Today, ITF Taekwon-Do continues to honor General Choi Hong Hi's original vision while
              adapting to contemporary needs. This dynamic balance ensures the art remains both authentic
              to its traditional roots and accessible to future generations worldwide.
            </p>
            <p className="text-sm leading-relaxed text-foreground/60 sm:text-base">
              Maintaining relevance as both a martial discipline and a way of life for millions of
              practitioners across six continents.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
