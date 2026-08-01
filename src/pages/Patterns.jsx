
// imports
import { PatternHero } from '../components/PatternPage/PatternHero'
import { PatternMatrix } from '../components/PatternPage/PatternMatrix'
import { PatternSidebar } from '../components/PatternPage/PatternSidebar'
import { PatternDetail } from '../components/PatternPage/PatternDetail'
import { useState } from 'react'

export const Patterns = () => {
  const [selectedPattern, setSelectedPattern] = useState(null)
  const [viewMode, setViewMode] = useState('matrix') 
  const [sidebarOpen, setSidebarOpen] = useState(false) 

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      <PatternHero />
      
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Pattern List</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Hidden on mobile by default */}
          <div className={`lg:w-1/4 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <PatternSidebar 
              selectedPattern={selectedPattern}
              onPatternSelect={(pattern) => {
                setSelectedPattern(pattern)
                setViewMode('detail')
                setSidebarOpen(false)
              }}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {viewMode === 'matrix' ? (
              <PatternMatrix 
                onPatternSelect={(pattern) => {
                  setSelectedPattern(pattern)
                  setViewMode('detail')
                }}
              />
            ) : (
              <PatternDetail 
                pattern={selectedPattern} 
                onBack={() => setViewMode('matrix')}
                />
            )}
          </div>

        </div>
      </div>
    </div>
  )
}