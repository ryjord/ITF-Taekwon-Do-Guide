import { Volume2, TrendingUp, LayoutGrid } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

const FEATURES = [
  { icon: Volume2, label: 'Authentic Audio Pronunciation' },
  { icon: TrendingUp, label: 'Progressive Belt Learning' },
  { icon: LayoutGrid, label: 'Comprehensive Categories' },
]

export const TerminologyHero = () => {
  return (
    <section
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-b border-primary/30 bg-linear-to-br from-primary/50 via-primary/40 to-primary"
      role="banner"
      aria-label="ITF Taekwon-Do Terminology Introduction"
    >
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground drop-shadow-lg md:text-7xl lg:text-8xl">
            ITF <span className="text-primary">Terminology</span>
          </h1>
          <div className="mx-auto mb-6 h-1 w-32 rounded-full bg-primary shadow-lg" />
        </div>

        <p className="mb-8 text-xl font-light leading-relaxed text-foreground/80 md:text-2xl lg:text-3xl">
          Master the Language of Traditional <span className="font-semibold text-primary">Taekwon-Do</span>
        </p>

        <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
          Comprehensive dictionary of Korean commands, techniques, and philosophy with authentic audio
          pronunciation. Essential knowledge for dedicated practitioners seeking to deepen their understanding
          of traditional ITF Taekwon-Do.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {FEATURES.map((feature) => (
            <Badge
              key={feature.label}
              variant="outline"
              className="h-auto gap-2 rounded-full border-white/30 bg-white/20 px-4 py-3 text-sm backdrop-blur-sm"
            >
              <feature.icon className="size-4 text-primary" aria-hidden="true" />
              <span className="font-medium text-foreground">{feature.label}</span>
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}
