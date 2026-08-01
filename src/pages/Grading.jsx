import { GradingHero } from '../components/GradingPage/GradingHero'
import { BeltTierAccordion } from '../components/GradingPage/BeltTierAccordion'
import { BeltMeanings } from '../components/GradingPage/BeltMeanings'
import { GradingStructure } from '../components/GradingPage/GradingStructure'
import { GradingDisclaimer } from '../components/GradingPage/GradingDisclaimer'
import gradingData from '../data/grading/GradingData.json'

export const Grading = () => {
  return (
    <div
      className="min-h-screen bg-linear-to-br from-primary/5 via-background to-primary/10 py-24"
      role="main"
      aria-label="ITF Taekwon-Do Grading and Belts Application"
    >
      <GradingHero />

      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6 lg:space-y-20 lg:px-8">
        <section role="region" aria-label="Belt colour meanings">
          <div className="mb-12 text-center lg:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">What Each Belt Means</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
              General Choi Hong Hi assigned each belt colour a meaning, reflecting the student's growth
              from beginner to master.
            </p>
          </div>
          <BeltMeanings meanings={gradingData.beltMeanings} />
        </section>

        <section role="region" aria-label="Belt tier progression">
          <div className="mb-12 text-center lg:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">Grade by Grade</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
              What's typically introduced at each kup grade, from white belt through to black belt.
            </p>
          </div>
          <BeltTierAccordion tiers={gradingData.tiers} />
        </section>

        <section role="region" aria-label="What's tested at a grading">
          <div className="mb-12 text-center lg:mb-16">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">What's Tested</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
              Every ITF grading draws from the same broad categories, regardless of grade.
            </p>
          </div>
          <GradingStructure categories={gradingData.gradingStructure} />
        </section>

        <section role="region" aria-label="Content sources and disclaimer" className="mx-auto max-w-4xl">
          <GradingDisclaimer
            disclaimer={gradingData.disclaimer}
            beltMeaningsSource={gradingData.beltMeaningsSource}
            gradingStructureSources={gradingData.gradingStructureSources}
          />
        </section>
      </div>
    </div>
  )
}
