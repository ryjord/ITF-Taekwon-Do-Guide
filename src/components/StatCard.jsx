import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export const StatCard = ({ icon: Icon, value, label, description, className, ...props }) => (
  <Card
    className={cn(
      'text-center transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-lg',
      className
    )}
    {...props}
  >
    <CardContent>
      {Icon && <Icon className="mx-auto mb-2 size-6 text-primary" aria-hidden="true" />}
      <div className="text-3xl font-bold text-primary sm:text-4xl">{value}</div>
      <div className="mt-1 text-sm font-semibold tracking-wide text-foreground/80 uppercase">{label}</div>
      {description && <p className="mt-2 text-sm leading-relaxed text-foreground/60 normal-case">{description}</p>}
    </CardContent>
  </Card>
)
