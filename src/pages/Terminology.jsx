import { useMemo, useState } from 'react'
import { Mic, SearchX } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { TerminologyHero } from '../components/Terminology/TerminologyHero'
import { SearchBar } from '../components/Terminology/SearchBar'
import { CategoryFilter } from '../components/Terminology/CategoryFilter'
import { TerminologyTable } from '../components/Terminology/TerminologyTable'
import terminologyData from '../data/terminology/TerminologyData.json'

const BELT_LEVEL_COUNT = new Set(terminologyData.terms.map((term) => term.beltLearnt)).size

const STATS = [
  { value: terminologyData.terms.length, label: 'Total Terms' },
  { value: terminologyData.categories.length, label: 'Categories' },
  { value: BELT_LEVEL_COUNT, label: 'Belt Levels' },
  { icon: Mic, label: 'Audio Guide' },
]

export const Terminology = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const filteredTerms = useMemo(() => {
    return terminologyData.terms.filter((term) => {
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

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-primary/10">
      <TerminologyHero />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mb-8 space-y-6 sm:mb-12 lg:mb-16">
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

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">Terminology Dictionary</h2>
          <div className="text-sm text-foreground/70 sm:text-base">
            Showing {filteredTerms.length} of {terminologyData.terms.length} terms
          </div>
        </div>

        {filteredTerms.length > 0 ? (
          <TerminologyTable terms={filteredTerms} />
        ) : (
          <Card className="py-12 text-center">
            <CardContent>
              <SearchX className="mx-auto mb-4 size-8 text-foreground/40" aria-hidden="true" />
              <h3 className="mb-2 text-lg font-semibold text-foreground sm:text-xl">No terms found</h3>
              <p className="text-sm text-foreground/70 sm:text-base">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 grid grid-cols-2 gap-4 text-center sm:gap-6 md:grid-cols-4">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardContent>
                {stat.icon ? (
                  <stat.icon className="mx-auto mb-2 size-6 text-primary" aria-hidden="true" />
                ) : (
                  <div className="mb-2 text-xl font-bold text-primary sm:text-2xl">{stat.value}</div>
                )}
                <div className="text-xs text-foreground/70 sm:text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
