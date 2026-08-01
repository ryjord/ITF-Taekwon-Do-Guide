import { Footprints, Hand, Shield, Swords, Wind, Zap } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import stanceData from '@/data/techniques/stance.json'
import strikesData from '@/data/techniques/strikes.json'
import blocksData from '@/data/techniques/blocks.json'
import kickData from '@/data/techniques/kick.json'
import thrustsData from '@/data/techniques/thrusts.json'
import punchesData from '@/data/techniques/punches.json'

const countTechniques = (data) => data.beltLevels.reduce((total, level) => total + level.techniques.length, 0)

const TECHNIQUE_STATS = [
  { icon: Footprints, count: countTechniques(stanceData), label: 'Stances' },
  { icon: Zap, count: countTechniques(kickData), label: 'Kicks' },
  { icon: Hand, count: countTechniques(punchesData), label: 'Punches' },
  { icon: Swords, count: countTechniques(strikesData), label: 'Strikes' },
  { icon: Wind, count: countTechniques(thrustsData), label: 'Thrusts' },
  { icon: Shield, count: countTechniques(blocksData), label: 'Blocks' },
]

const TOTAL_TECHNIQUES = TECHNIQUE_STATS.reduce((total, stat) => total + stat.count, 0)

export const TechniquesHero = () => {
  return (
    <section
      className="bg-linear-to-br from-primary/10 via-primary/40 to-primary pt-20"
      role="banner"
      aria-label="ITF Taekwon-Do Techniques Introduction"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground drop-shadow-lg md:text-7xl lg:text-8xl">
              ITF <span className="text-primary">Techniques</span>
            </h1>
            <div className="mx-auto mb-6 h-1 w-32 rounded-full bg-primary shadow-lg" />

            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-foreground/80 md:text-2xl">
              Master <span className="font-semibold text-primary">{TOTAL_TECHNIQUES} core techniques</span> that
              form the foundation of traditional ITF Taekwon-Do.
            </p>
          </div>

          <div
            className="mx-auto mb-16 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6"
            role="grid"
            aria-label="ITF Taekwon-Do technique statistics"
          >
            {TECHNIQUE_STATS.map((stat) => (
              <Card
                key={stat.label}
                className="text-center transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-lg"
              >
                <CardContent>
                  <stat.icon className="mx-auto mb-2 size-6 text-primary" aria-hidden="true" />
                  <div className="text-3xl font-bold text-primary">{stat.count}</div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mx-auto max-w-2xl border-primary/20 bg-linear-to-r from-primary/10 to-secondary/10">
            <CardContent>
              <p className="mb-3 text-lg font-medium leading-relaxed text-foreground/80">
                <span className="font-semibold text-primary">Ready to master your form?</span> Explore each
                category for detailed breakdowns and step-by-step guidance.
              </p>
              <p className="text-sm text-foreground/60">
                Comprehensive training resources for students of all belt levels.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
