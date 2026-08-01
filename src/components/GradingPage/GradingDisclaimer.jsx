import { ExternalLink, Info } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

export const GradingDisclaimer = ({ disclaimer, beltMeaningsSource, gradingStructureSources }) => {
  const sourceUrls = [...beltMeaningsSource.urls, ...gradingStructureSources]

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent>
        <div className="flex gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="space-y-3">
            <p className="font-semibold text-foreground">{disclaimer.summary}</p>
            <p className="text-sm leading-relaxed text-foreground/70">{disclaimer.detail}</p>
            <p className="text-sm leading-relaxed text-foreground/70">{beltMeaningsSource.attribution}.</p>

            <div>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-foreground/50 uppercase">Sources</h3>
              <ul className="space-y-1">
                {sourceUrls.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{url}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
