import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TechniqueModal } from './TechniqueModal'

const PrincipleList = ({ title, items }) => (
  <div className="space-y-4">
    <h4 className="text-lg font-semibold text-foreground">{title}</h4>
    <ul className="space-y-3 text-sm text-foreground/70">
      {items.map((item) => (
        <li key={item} className="flex items-start">
          <span className="mr-3 mt-0.5 shrink-0 text-primary" aria-hidden="true">
            &bull;
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

export const TechniqueCategoryPage = ({ data }) => {
  const [selectedTechnique, setSelectedTechnique] = useState(null)

  const totalTechniques = data.beltLevels.reduce((total, level) => total + level.techniques.length, 0)

  return (
    <div className="py-12">
      <div className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-foreground">
          {data.category} <span className="text-primary">({data.koreanName})</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-foreground/70">{data.description}</p>
      </div>

      <div className="mb-20">
        <h2 className="mb-12 text-center text-2xl font-bold text-foreground">Belt Progression</h2>

        <div className="relative">
          <div
            className="absolute left-1/2 h-full w-1 -translate-x-1/2 rounded-full bg-linear-to-b from-gray-300 via-yellow-400 via-green-500 via-blue-500 to-red-600"
            aria-hidden="true"
          />

          <div className="space-y-16" role="list" aria-label={`${data.category} techniques by belt level`}>
            {data.beltLevels.map((beltLevel, index) => (
              <div key={beltLevel.belt} className="relative">
                <div
                  className={cn(
                    'relative z-10 mx-auto max-w-2xl rounded-2xl border border-border bg-background/80 p-8 shadow-sm backdrop-blur-sm',
                    index % 2 === 0 ? 'ml-auto' : 'mr-auto'
                  )}
                >
                  <div
                    className={cn(
                      'absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r px-6 py-2 text-sm font-bold uppercase tracking-wide text-black shadow-md',
                      beltLevel.beltColor
                    )}
                  >
                    {beltLevel.belt}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {beltLevel.techniques.map((technique) => (
                      <Card
                        key={`${technique.korean}-${technique.english}`}
                        className="transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                      >
                        <CardContent>
                          <h4 className="mb-2 text-lg font-bold text-primary">{technique.korean}</h4>
                          <p className="mb-3 font-semibold text-foreground/80">{technique.english}</p>
                          <p className="mb-3 text-sm leading-relaxed text-foreground/70">{technique.description}</p>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-xs"
                            onClick={() => setSelectedTechnique(technique)}
                            aria-label={`Learn about ${technique.english} (${technique.korean})`}
                          >
                            Click for details
                            <ArrowRight className="ml-1 size-3" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="mx-auto max-w-4xl border-primary/20 bg-linear-to-r from-primary/10 to-primary/5">
        <CardContent>
          <h3 className="mb-8 text-center text-2xl font-bold text-foreground">
            {data.category} Training Principles
          </h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <PrincipleList title="Key Focus Areas" items={data.trainingPrinciples.focusAreas} />
            <PrincipleList title="Safety Considerations" items={data.trainingPrinciples.safety} />
          </div>
        </CardContent>
      </Card>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center space-x-12 text-sm text-foreground/60">
          <div>
            <div className="text-2xl font-bold text-primary">{totalTechniques}</div>
            <div>Total {data.category}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{data.beltLevels.length}</div>
            <div>Belt Levels</div>
          </div>
        </div>
      </div>

      <TechniqueModal
        technique={selectedTechnique}
        isOpen={!!selectedTechnique}
        onClose={() => setSelectedTechnique(null)}
      />
    </div>
  )
}
