import { Flame, Globe, HeartHandshake } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

const PHILOSOPHY_PILLARS = [
  {
    icon: HeartHandshake,
    title: 'Respect & Honour',
    description:
      'Honouring instructors, seniors, and the art itself through disciplined practice and mutual respect in all interactions.',
  },
  {
    icon: Flame,
    title: 'Mental Fortitude',
    description:
      'Developing unwavering focus, patience, and indomitable spirit to overcome challenges in training and life.',
  },
  {
    icon: Globe,
    title: 'Peace & Freedom',
    description:
      'Promoting global peace, justice, and building a better world through martial virtue and ethical conduct.',
  },
]

export const PhilosophySection = () => {
  return (
    <section
      className="bg-linear-to-b from-background/30 to-background/80 py-16"
      role="region"
      aria-label="ITF Taekwon-Do Philosophy"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
            The Heart of <span className="text-primary">ITF Taekwon-Do</span>
          </h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-primary" />
        </div>

        <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl [--card-spacing:--spacing(8)] md:[--card-spacing:--spacing(12)]">
          <CardContent>
            <p className="mb-8 text-center text-lg leading-relaxed text-foreground/80 md:text-left md:text-xl">
              At the heart of ITF Taekwon-Do lies a profound philosophy that extends far beyond physical technique.
              Founded on principles of{' '}
              <span className="font-semibold text-primary">respect, integrity, and perseverance</span>, ITF
              Taekwon-Do is a way of life that cultivates both body and mind. Practitioners are encouraged to
              embody these values in daily life, fostering a spirit of humility and continuous self-improvement.
            </p>

            <div
              className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3"
              role="list"
              aria-label="Core philosophy pillars of ITF Taekwon-Do"
            >
              {PHILOSOPHY_PILLARS.map((pillar) => (
                <Card
                  key={pillar.title}
                  className="border-none bg-primary/5 text-center transition-colors duration-300 hover:bg-primary/10"
                  role="listitem"
                >
                  <CardContent className="flex flex-col items-center">
                    <pillar.icon className="mb-3 size-8 text-primary" aria-hidden="true" />
                    <h3 className="mb-3 text-lg font-semibold text-foreground">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-foreground/70">{pillar.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div
              className="rounded-r-lg border-l-4 border-primary bg-primary/5 p-6"
              role="complementary"
              aria-label="Inspirational teaching from General Choi Hong Hi"
            >
              <blockquote className="text-center text-lg italic leading-relaxed text-foreground/80 md:text-xl">
                "To help others to develop and succeed in life is a reward itself and only has value when nothing
                is expected in return."
              </blockquote>
              <cite className="mt-4 block text-right text-sm font-semibold not-italic text-foreground/60">
                — General Choi Hong Hi, Founder of ITF Taekwon-Do
              </cite>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
