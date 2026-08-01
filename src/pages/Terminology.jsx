// imports
import { useState, useMemo } from 'react'
import { TerminologyHero } from '../components/Terminology/TerminologyHero'
import { SearchBar } from '../components/Terminology/SearchBar'
import { CategoryFilter } from '../components/Terminology/CategoryFilter'
import { TerminologyTable } from '../components/Terminology/TerminologyTable'
import terminologyData from '../data/terminology/TerminologyData.json'

// Terminology Page Component
export const Terminology = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    return terminologyData.terms.filter(term => {
      const matchesSearch = 
        term.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.koreanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.romanized.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.beltLearnt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === '' || term.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      {/* Full-screen Hero*/}
      <TerminologyHero />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:py-16 lg:py-20">
        
        {/* Search and Filters Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16 space-y-6">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search by English, Korean, romanization, belt, or category..."
          />
          
          <CategoryFilter 
            categories={terminologyData.categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Results Info */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Terminology Dictionary
          </h2>
          <div className="text-foreground/70 text-sm sm:text-base">
            Showing {filteredTerms.length} of {terminologyData.terms.length} terms
          </div>
        </div>

        {/* Terminology Table */}
        {filteredTerms.length > 0 ? (
          <TerminologyTable terms={filteredTerms} />
        ) : (
          <div className="text-center py-12 bg-background border border-border rounded-2xl">
            <div className="text-3xl mb-4 opacity-50">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No terms found</h3>
            <p className="text-foreground/70 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="bg-background border border-border rounded-xl p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-primary mb-2">{terminologyData.terms.length}</div>
            <div className="text-foreground/70 text-xs sm:text-sm">Total Terms</div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-primary mb-2">{terminologyData.categories.length}</div>
            <div className="text-foreground/70 text-xs sm:text-sm">Categories</div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-primary mb-2">10+</div>
            <div className="text-foreground/70 text-xs sm:text-sm">Belt Levels</div>
          </div>
          <div className="bg-background border border-border rounded-xl p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold text-primary mb-2">🎤</div>
            <div className="text-foreground/70 text-xs sm:text-sm">Audio Guide</div>
          </div>
        </div>
      </div>
    </div>
  )
}