import { Card, CardContent } from '@/components/ui/card'

const STATISTICS = [
  {
    value: '24',
    label: 'Tul (Patterns)',
    description: 'From Chon-Ji to Tong-Il, representing the 24 hours in a day',
  },
  {
    value: '100+',
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
            <Card
              key={stat.label}
              className="transition-transform duration-300 hover:scale-105"
              role="listitem"
            >
              <CardContent>
                <h3 className="mb-3 text-5xl font-bold text-primary">{stat.value}</h3>
                <p className="mb-2 text-lg font-semibold text-foreground/80">{stat.label}</p>
                <p className="text-sm leading-relaxed text-foreground/60">{stat.description}</p>
              </CardContent>
            </Card>
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
