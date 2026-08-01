import { useState } from 'react'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { PatternHero } from '../components/PatternPage/PatternHero'
import { PatternMatrix } from '../components/PatternPage/PatternMatrix'
import { PatternSidebar, PatternList } from '../components/PatternPage/PatternSidebar'
import { PatternDetail } from '../components/PatternPage/PatternDetail'

export const Patterns = () => {
  const [selectedPattern, setSelectedPattern] = useState(null)
  const [viewMode, setViewMode] = useState('matrix')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const selectPattern = (pattern) => {
    setSelectedPattern(pattern)
    setViewMode('detail')
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 to-primary/10">
      <PatternHero />

      <div className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 lg:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button>
                <Menu className="size-4" />
                Pattern List
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Pattern Library</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <PatternList selectedPattern={selectedPattern} onPatternSelect={selectPattern} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="hidden lg:block lg:w-1/4">
            <PatternSidebar selectedPattern={selectedPattern} onPatternSelect={selectPattern} />
          </div>

          <div className="lg:w-3/4">
            {viewMode === 'matrix' ? (
              <PatternMatrix onPatternSelect={selectPattern} />
            ) : (
              <PatternDetail pattern={selectedPattern} onBack={() => setViewMode('matrix')} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
