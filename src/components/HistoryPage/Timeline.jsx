import {
  Award,
  BookOpen,
  Building2,
  Flag,
  Globe,
  Landmark,
  Rocket,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const CATEGORY_ICONS = {
  foundation: Flag,
  demonstration: Users,
  organization: Building2,
  expansion: Globe,
  documentation: BookOpen,
  political: Landmark,
  legacy: Award,
  modern: Rocket,
}

const ADDITIONAL_DETAIL_LABELS = {
  keyFigures: 'Key Historical Figures',
  foundingCountries: 'Founding Nations',
  volumes: 'Publication Volumes',
  impact: 'Historical Impact',
  lastWords: 'Final Legacy',
  majorGroups: 'Major Organizations',
  currentState: 'Current Status',
}

const TAG_BADGE_CLASS = 'border-primary/20 bg-primary/10 text-primary'

const DetailSection = ({ label, className, children }) => (
  <div className={className}>
    <h4 className="mb-2 flex items-center text-sm font-semibold text-foreground">
      <span className="mr-2 size-2 rounded-full bg-primary" aria-hidden="true" />
      {label}
    </h4>
    {children}
  </div>
)

const TagList = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item) => (
      <Badge key={item} variant="outline" className={TAG_BADGE_CLASS}>
        {item}
      </Badge>
    ))}
  </div>
)

export const Timeline = ({ events }) => {
  return (
    <section className="mx-auto w-full max-w-4xl" role="region" aria-label="ITF Taekwondo Historical Timeline">
      <Accordion type="single" collapsible className="space-y-3">
        {events.map((event) => {
          const CategoryIcon = CATEGORY_ICONS[event.category] ?? Flag

          return (
            <AccordionItem
              key={event.id}
              value={event.id}
              className="rounded-2xl border border-border bg-background px-4 hover:border-primary/50 sm:px-6"
            >
              <AccordionTrigger
                className="py-4 hover:no-underline sm:py-6"
                aria-label={`${event.year} — ${event.title}`}
              >
                <div className="flex flex-1 items-start gap-3 text-left sm:gap-4">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5 text-primary sm:size-12 md:size-16"
                    aria-hidden="true"
                  >
                    <CategoryIcon className="size-4 sm:size-5 md:size-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-col gap-1 sm:mb-2 sm:flex-row sm:items-center sm:gap-3">
                      <span className="text-lg font-bold text-primary sm:text-xl md:text-2xl">{event.year}</span>
                      <Badge variant="outline" className={cn('w-fit', TAG_BADGE_CLASS)}>
                        {event.category}
                      </Badge>
                    </div>
                    <div className="mb-1 text-base font-bold text-foreground sm:text-lg md:text-xl">
                      {event.title}
                    </div>
                    <p className="text-xs leading-relaxed text-foreground/70 sm:text-sm md:text-base">
                      {event.description}
                    </p>
                    <div className="mt-1 text-xs text-foreground/50 sm:mt-2">{event.date}</div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="grid grid-cols-1 gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:gap-6 sm:p-6 md:grid-cols-2">
                  <DetailSection label="Historical Background">
                    <p className="text-sm leading-relaxed text-foreground/70">{event.detailed.background}</p>
                  </DetailSection>

                  <DetailSection label="Historical Significance">
                    <p className="text-sm leading-relaxed text-foreground/70">{event.detailed.significance}</p>
                  </DetailSection>

                  {Object.entries(ADDITIONAL_DETAIL_LABELS).map(([key, label]) => {
                    const value = event.detailed[key]
                    if (!value) return null

                    return (
                      <DetailSection key={key} label={label} className="md:col-span-2">
                        {Array.isArray(value) ? (
                          <TagList items={value} />
                        ) : (
                          <p className="text-sm leading-relaxed text-foreground/70">{value}</p>
                        )}
                      </DetailSection>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </section>
  )
}
