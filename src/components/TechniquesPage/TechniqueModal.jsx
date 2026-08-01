import { useState } from 'react'
import { ImageOff } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const TechniqueImage = ({ src, alt, label }) => {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="text-center">
        <ImageOff className="mx-auto mb-4 size-10 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-foreground/60">Technique diagram for {label}</p>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="max-h-48 max-w-full rounded-lg object-contain"
    />
  )
}

export const TechniqueModal = ({ technique, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {technique && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">{technique.korean}</DialogTitle>
              <DialogDescription className="font-semibold text-foreground/80">
                {technique.english}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8">
              <div
                className="flex min-h-64 items-center justify-center rounded-xl border border-primary/20 bg-linear-to-br from-primary/10 to-primary/5 p-8"
                role="img"
                aria-label={`Visual demonstration of ${technique.english} technique`}
              >
                <TechniqueImage
                  key={technique.korean}
                  src={technique.image}
                  alt={`${technique.english} technique execution`}
                  label={technique.english}
                />
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-foreground">Technique Description</h4>
                <p className="leading-relaxed text-foreground/70">{technique.detailedDescription}</p>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-foreground">Execution Steps</h4>
                <ol className="space-y-3 text-sm text-foreground/70" aria-label="Step-by-step execution instructions">
                  {technique.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span
                        className="mr-3 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
                <h4 className="mb-2 font-semibold text-foreground">Practical Application</h4>
                <p className="text-sm leading-relaxed text-foreground/70">{technique.application}</p>
              </div>

              <div>
                <h4 className="mb-3 font-semibold text-foreground">Common Mistakes to Avoid</h4>
                <ul className="space-y-2 text-sm text-foreground/70" aria-label="Common technique mistakes">
                  {technique.commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-0.5 shrink-0 text-primary" aria-hidden="true">
                        &bull;
                      </span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
