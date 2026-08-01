import { AlertCircle, ChevronLeft, Construction, PlayCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { getBeltColorClass } from '@/lib/beltColors'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const getPatternName = (pattern) =>
  pattern.name ??
  pattern.id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const getPatternShape = (pattern) => pattern.patternShape || '+'

export const PatternDetail = ({ pattern, onBack }) => {
  if (!pattern) {
    return (
      <Card className="text-center" role="alert" aria-label="No pattern selected">
        <CardContent>
          <AlertCircle className="mx-auto mb-4 size-10 text-muted-foreground" aria-hidden="true" />
          <h2 className="mb-4 text-2xl font-bold text-foreground">No Pattern Selected</h2>
          <p className="mb-6 text-foreground/70">
            Please select a pattern from the list to view detailed information.
          </p>
          <Button variant="link" onClick={onBack}>
            Back to Patterns List
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card role="article" aria-label={`Pattern details for ${getPatternName(pattern)}`}>
      <CardContent>
        <Button variant="link" className="mb-6 h-auto p-0" onClick={onBack} aria-label="Return to patterns list">
          <ChevronLeft className="size-4" />
          Back to Patterns
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-6 rounded-xl border border-primary/20 bg-linear-to-br from-primary/10 to-primary/5 p-8 text-center">
              <div
                className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground"
                aria-hidden="true"
              >
                {getPatternShape(pattern)}
              </div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">{getPatternName(pattern)}</h1>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="font-medium text-foreground/70">{pattern.moveCount} Movements</span>
                <Badge
                  className={cn('border px-3 py-1 text-sm font-semibold', getBeltColorClass(pattern.beltColor))}
                  aria-label={`${pattern.beltColor} belt pattern`}
                >
                  {pattern.beltColor} Belt
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">Meaning</h3>
                <p className="leading-relaxed text-foreground/70">{pattern.meaning}</p>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">Diagram</h3>
                <div className="rounded-lg border border-primary/10 bg-primary/5 p-6 text-center">
                  <div className="mb-2 font-mono text-4xl" aria-label="Pattern shape">
                    {getPatternShape(pattern)}
                  </div>
                  <p className="text-sm text-foreground/60">
                    {pattern.patternDescription ||
                      'Traditional pattern shape representing the foundation of techniques'}
                  </p>
                </div>
              </div>

              {pattern.videoUrl && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-foreground">Video Demonstration</h3>
                  <Button asChild variant="outline" className="w-full">
                    <a href={pattern.videoUrl} target="_blank" rel="noopener noreferrer">
                      <PlayCircle className="size-4" />
                      Watch on YouTube
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold text-foreground">Movement Instructions</h3>

            {pattern.movements && pattern.movements.length > 0 ? (
              <div className="space-y-3">
                {pattern.movements.map((movement, index) => (
                  <div
                    key={index}
                    className="flex items-start rounded-lg border border-primary/10 bg-primary/5 p-4 transition-colors duration-200 hover:border-primary/20 hover:bg-primary/10"
                  >
                    <div
                      className="mr-4 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground"
                      aria-label={`Movement ${index + 1}`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{movement.stance || 'Ready Stance'}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/70">{movement.description}</p>
                      {movement.steps && movement.steps.length > 0 && (
                        <ul className="mt-2 space-y-1 text-xs text-foreground/60">
                          {movement.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex">
                              <span className="mr-2 text-primary" aria-hidden="true">
                                &bull;
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-foreground/50" role="status" aria-label="Movement details in progress">
                <Construction className="mx-auto mb-2 size-10" aria-hidden="true" />
                <p className="font-medium">Movement Details Coming Soon</p>
                <p className="mt-2 text-sm">Complete movement breakdown currently in development</p>
              </div>
            )}

            <div className="mt-8 rounded-lg border border-primary/20 bg-linear-to-r from-primary/5 to-primary/10 p-4">
              <h4 className="mb-2 font-semibold text-foreground">Pattern Progression</h4>
              <p className="text-sm leading-relaxed text-foreground/70">
                This {pattern.beltRank} pattern contains {pattern.moveCount} movements and focuses on{' '}
                {pattern.focus || 'fundamental techniques and principles'}.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
