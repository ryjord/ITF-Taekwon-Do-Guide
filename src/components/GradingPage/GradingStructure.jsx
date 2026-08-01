import { BookOpen, Clock, Footprints, Repeat, Shield, Swords, Users, Zap } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

const CATEGORY_ICONS = {
  'Patterns (Tul)': Repeat,
  'Fundamental Movements': Footprints,
  'Step Sparring': Users,
  Sparring: Swords,
  'Self-Defence': Shield,
  'Breaking (Power Test)': Zap,
  'Terminology & Theory': BookOpen,
  'Time in Grade': Clock,
}

export const GradingStructure = ({ categories }) => {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      role="list"
      aria-label="What's tested at an ITF grading"
    >
      {categories.map((item) => {
        const Icon = CATEGORY_ICONS[item.category] ?? BookOpen

        return (
          <Card key={item.category} role="listitem" className="transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
            <CardContent>
              <Icon className="mb-3 size-7 text-primary" aria-hidden="true" />
              <h3 className="mb-2 font-bold text-foreground">{item.category}</h3>
              <p className="text-sm leading-relaxed text-foreground/70">{item.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
