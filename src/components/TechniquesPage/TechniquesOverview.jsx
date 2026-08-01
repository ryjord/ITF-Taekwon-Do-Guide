import { ArrowRight } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useScrollTo } from '@/hooks/useScrollTo'

export const TechniquesOverview = ({ categories, onCategorySelect }) => {
  const scrollTo = useScrollTo()

  const handleCategoryClick = (categoryId) => {
    scrollTo(500)
    onCategorySelect(categoryId)
  }

  const dataCategories = categories.filter((category) => category.data)
  const totalTechniques = dataCategories.reduce(
    (total, category) =>
      total + category.data.beltLevels.reduce((sum, level) => sum + level.techniques.length, 0),
    0
  )

  return (
    <div className="py-12">
      <div className="mb-16 text-center">
        <h1 className="mb-6 text-4xl font-bold text-foreground">Technique Categories</h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-foreground/70">
          Explore comprehensive breakdowns of all ITF Taekwon-Do techniques. Each category includes
          step-by-step guidance and training applications.
        </p>
      </div>

      <div
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        role="grid"
        aria-label="Taekwon-Do technique categories"
      >
        {dataCategories.map((category) => {
          const categoryTotal = category.data.beltLevels.reduce((sum, level) => sum + level.techniques.length, 0)
          const title = `${category.data.category} (${category.data.koreanName})`

          return (
            <Card
              key={category.id}
              className="group transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl"
            >
              <CardContent>
                <category.icon
                  className="mb-4 size-8 text-primary transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <h3 className="mb-3 text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {title}
                </h3>
                <p className="mb-4 leading-relaxed text-foreground/70">{category.data.description}</p>

                <div className="flex items-center justify-between border-t border-border/50 pt-4">
                  <span className="text-lg font-semibold text-primary">
                    {categoryTotal} {category.data.category.toLowerCase()}
                  </span>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={() => handleCategoryClick(category.id)}
                    aria-label={`Explore ${title}. ${categoryTotal} ${category.data.category.toLowerCase()} available.`}
                  >
                    Explore
                    <ArrowRight className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-24 text-center">
        <Card className="mx-auto max-w-2xl border-primary/20 bg-linear-to-r from-primary/10 to-primary/5">
          <CardContent>
            <h3 className="mb-6 text-2xl font-bold text-foreground">Complete Technique Library</h3>
            <p className="mb-4 leading-relaxed text-foreground/70">
              All <span className="font-semibold text-primary">{totalTechniques} techniques</span> organized by
              category, with detailed instructions, applications, and training tips for every belt level.
            </p>
            <p className="text-sm text-foreground/60">
              From basic white belt fundamentals to advanced black belt applications
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
