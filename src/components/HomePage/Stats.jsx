import { StatCard } from '@/components/StatCard'
import stanceData from '@/data/techniques/stance.json'
import strikesData from '@/data/techniques/strikes.json'
import blocksData from '@/data/techniques/blocks.json'
import kickData from '@/data/techniques/kick.json'
import thrustsData from '@/data/techniques/thrusts.json'
import punchesData from '@/data/techniques/punches.json'

const countTechniques = (data) => data.beltLevels.reduce((total, level) => total + level.techniques.length, 0)

const TOTAL_TECHNIQUES = [stanceData, strikesData, blocksData, kickData, thrustsData, punchesData].reduce(
  (total, data) => total + countTechniques(data),
  0
)

const STATISTICS = [
  {
    value: '24',
    label: 'Tul (Patterns)',
    description: 'From Chon-Ji to Tong-Il, representing the 24 hours in a day',
  },
  {
    value: TOTAL_TECHNIQUES,
    label: 'Techniques',
    description: 'Stances, Blocks, Strikes & Kicks for practical training',
  },
  {
    value: '1955',
    label: 'Founded',
    description: 'By General Choi Hong Hi in South Korea',
  },
]

export const Stats = () => {
  return (
    <section
      className="border-y border-border/30 bg-background/30 py-16"
      role="region"
      aria-label="ITF Taekwon-Do Statistics"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="grid grid-cols-1 gap-6 text-center md:grid-cols-3"
          role="list"
          aria-label="ITF Taekwon-Do key statistics"
        >
          {STATISTICS.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              role="listitem"
            />
          ))}
        </div>

        <div
          className="mx-auto mt-12 max-w-2xl text-center"
          role="complementary"
          aria-label="Inspirational quote from General Choi Hong Hi"
        >
          <blockquote className="text-lg italic leading-relaxed text-foreground/70">
            "Refrain from reckless and thoughtless actions. Be as calm and judicious as a mountain."
          </blockquote>
          <cite className="mt-3 block text-sm font-medium not-italic text-foreground/50">
            — General Choi Hong Hi; The Founder of ITF Taekwon-Do
          </cite>
        </div>
      </div>
    </section>
  )
}
