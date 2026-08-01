import { cn } from '@/lib/utils'
import { getBeltColorClass } from '@/lib/beltColors'
import { Card, CardContent } from '@/components/ui/card'

export const BeltMeanings = ({ meanings }) => {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="list"
      aria-label="Belt colour meanings"
    >
      {meanings.map((belt) => (
        <Card key={belt.kupRange} role="listitem">
          <CardContent>
            <div className="mb-3 flex items-center gap-3">
              <span
                className={cn('size-8 shrink-0 rounded-full border-2', getBeltColorClass(belt.color))}
                aria-hidden="true"
              />
              <div>
                <div className="font-bold text-foreground">{belt.color}</div>
                <div className="text-xs text-foreground/60">{belt.kupRange}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/70">{belt.meaning}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
