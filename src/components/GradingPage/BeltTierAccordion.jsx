import { cn } from '@/lib/utils'
import { getBeltColorClass } from '@/lib/beltColors'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const BeltTierAccordion = ({ tiers }) => {
  return (
    <section className="mx-auto w-full max-w-4xl" role="region" aria-label="ITF Taekwon-Do belt tier progression">
      <Accordion type="single" collapsible className="space-y-3">
        {tiers.map((tier) => (
          <AccordionItem
            key={tier.kupRange}
            value={tier.kupRange}
            className="rounded-2xl border border-border bg-background px-4 hover:border-primary/50 sm:px-6"
          >
            <AccordionTrigger
              className="py-4 hover:no-underline sm:py-6"
              aria-label={`${tier.kupRange} — ${tier.color}`}
            >
              <div className="flex flex-1 items-center gap-3 text-left sm:gap-4">
                <span
                  className={cn('size-10 shrink-0 rounded-full border-2 sm:size-12', getBeltColorClass(tier.color))}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <span className="text-lg font-bold text-primary sm:text-xl">{tier.kupRange}</span>
                    <span className="text-sm font-medium text-foreground/60">{tier.color}</span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-6">
                <p className="text-sm leading-relaxed text-foreground/70">{tier.focus}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
