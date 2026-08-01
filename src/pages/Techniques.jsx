// imports
import { useState } from 'react'
import { TechniquesHero } from '../components/TechniquesPage/TechniquesHero'
import { CategoryNavigation } from '../components/TechniquesPage/CategoryNavigation'
import { TechniquesOverview } from '../components/TechniquesPage/TechniquesOverview'
import { StancesCategory } from '../components/TechniquesPage/categories/StancesCategory'
import { StrikesCategory } from '../components/TechniquesPage/categories/StrikesCategory'
import { BlocksCategory } from '../components/TechniquesPage/categories/BlocksCategory'
import { KicksCategory } from '../components/TechniquesPage/categories/KicksCategory'
import { ThrustsCategory } from '../components/TechniquesPage/categories/ThrustsCategory'
import { PunchesCategory } from '../components/TechniquesPage/categories/PunchesCategory'

// Main Techniques Page Component
export const Techniques = () => {
  const [currentCategory, setCurrentCategory] = useState('overview')

  // Category configuration
  const categories = [
    { id: 'overview', name: 'Overview' },
    { id: 'stances', name: 'Stances' },
    { id: 'strikes', name: 'Strikes'},
    { id: 'blocks', name: 'Blocks'},
    { id: 'kicks', name: 'Kicks'},
    { id: 'thrusts', name: 'Thrusts'},
    { id: 'punches', name: 'Punches' }
  ]

  // Render current category component
  const renderCurrentCategory = () => {
    switch (currentCategory) {
      case 'overview':
        return <TechniquesOverview onCategorySelect={setCurrentCategory} />
      case 'stances':
        return <StancesCategory />
      case 'strikes':
        return <StrikesCategory />
      case 'blocks':
        return <BlocksCategory />
      case 'kicks':
        return <KicksCategory />
      case 'thrusts':
        return <ThrustsCategory />
      case 'punches':
        return <PunchesCategory />
      default:
        return <TechniquesOverview onCategorySelect={setCurrentCategory} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <TechniquesHero />
      
      {/* Sticky Category Navigation */}
      <CategoryNavigation
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={setCurrentCategory}
      />
      
      {/* Dynamic Content Area with Smooth Transitions */}
      <main className="transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentCategory()}
        </div>
      </main>
    </div>
  )
}