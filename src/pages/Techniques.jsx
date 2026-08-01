import { useState } from 'react'
import { Footprints, Hand, LayoutGrid, Shield, Swords, Wind, Zap } from 'lucide-react'

import { TechniquesHero } from '../components/TechniquesPage/TechniquesHero'
import { CategoryNavigation } from '../components/TechniquesPage/CategoryNavigation'
import { TechniquesOverview } from '../components/TechniquesPage/TechniquesOverview'
import { TechniqueCategoryPage } from '../components/TechniquesPage/TechniqueCategoryPage'
import stanceData from '../data/techniques/stance.json'
import strikesData from '../data/techniques/strikes.json'
import blocksData from '../data/techniques/blocks.json'
import kickData from '../data/techniques/kick.json'
import thrustsData from '../data/techniques/thrusts.json'
import punchesData from '../data/techniques/punches.json'

// Navigation metadata (id/name/icon) plus the raw technique data lives here;
// display copy (title/description/count) is derived from each category's
// own data at the point of use instead of being duplicated and hand-typed,
// since that duplication had already drifted out of sync (e.g. strikes'
// Korean name).
const CATEGORIES = [
  { id: 'overview', name: 'Overview', icon: LayoutGrid },
  { id: 'stances', name: 'Stances', icon: Footprints, data: stanceData },
  { id: 'strikes', name: 'Strikes', icon: Swords, data: strikesData },
  { id: 'blocks', name: 'Blocks', icon: Shield, data: blocksData },
  { id: 'kicks', name: 'Kicks', icon: Zap, data: kickData },
  { id: 'thrusts', name: 'Thrusts', icon: Wind, data: thrustsData },
  { id: 'punches', name: 'Punches', icon: Hand, data: punchesData },
]

export const Techniques = () => {
  const [currentCategory, setCurrentCategory] = useState('overview')

  const selected = CATEGORIES.find((category) => category.id === currentCategory)

  return (
    <div className="min-h-screen bg-background">
      <TechniquesHero />

      <CategoryNavigation
        categories={CATEGORIES}
        currentCategory={currentCategory}
        onCategoryChange={setCurrentCategory}
      />

      <main className="transition-all duration-300 ease-in-out">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {currentCategory === 'overview' || !selected?.data ? (
            <TechniquesOverview categories={CATEGORIES} onCategorySelect={setCurrentCategory} />
          ) : (
            <TechniqueCategoryPage data={selected.data} />
          )}
        </div>
      </main>
    </div>
  )
}
