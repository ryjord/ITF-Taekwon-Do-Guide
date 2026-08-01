import { Card, CardContent } from '@/components/ui/card'

export const StatTile = ({ value, label }) => (
  <Card className="text-center">
    <CardContent>
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-foreground/70">{label}</div>
    </CardContent>
  </Card>
)
