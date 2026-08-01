// ===== MAIN IMPORTS =====
import { Timeline } from '../components/HistoryPage/Timeline'
import { HistoryHero } from '../components/HistoryPage/HistoryHero'
import historyData from '../data/history/HistoryTimeline.json'

// ===== MAIN HISTORY COMPONENT =====

/**
 * History Component
 * 
 * Comprehensive history application container that showcases the rich heritage 
 * and evolution of ITF Taekwon-Do through interactive timelines and engaging content.
 * 
 * Features:
 * - Full-screen professional layout with gradient background
 * - Interactive historical timeline with detailed events
 * - Hero section with historical milestones and impact
 * - Responsive design optimized for all devices
 * - Accessibility-compliant navigation and content structure
 * - Commercial-ready code with comprehensive documentation
 * 
 * @returns {JSX.Element} Complete history application interface
 */
export const History = () => {
  // ===== RENDER METHODS =====

  /**
   * Renders the timeline section with historical events
   * @returns {JSX.Element} Timeline section component
   */
  const renderTimelineSection = () => (
    <section 
      className="w-full"
      role="region"
      aria-label="ITF Taekwon-Do Historical Timeline"
    >
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Historical Chronology
        </h2>
        <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
          Journey through seven decades of ITF Taekwon-Do evolution, from military roots 
          to global martial art phenomenon.
        </p>
      </div>
      <Timeline events={historyData.timeline} />
    </section>
  )

  /**
   * Renders the legacy and continuation section
   * @returns {JSX.Element} Legacy section component
   */
  const renderLegacySection = () => (
    <section 
      className="w-full mt-16 lg:mt-20"
      role="region"
      aria-label="Continuing the ITF Taekwon-Do Legacy"
    >
      <div className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-8 sm:p-10 lg:p-12 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6">
          Preserving Tradition, Embracing Innovation
        </h3>
        <div className="max-w-4xl mx-auto">
          <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-6">
            Today, ITF Taekwon-Do continues to honor General Choi Hong Hi's original vision 
            while adapting to contemporary needs. This dynamic balance ensures the art remains 
            both authentic to its traditional roots and accessible to future generations worldwide.
          </p>
          <p className="text-sm sm:text-base text-foreground/60 leading-relaxed">
            Maintaining relevance as both a martial discipline and a way of life for millions 
            of practitioners across six continents.
          </p>
        </div>
      </div>
    </section>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 py-24"
      role="main"
      aria-label="ITF Taekwon-Do History Application"
    >
        
        {/* Hero Section */}
 
          <HistoryHero />

        
        {/* Timeline Section */}

          {renderTimelineSection()}

        {/* Legacy Section  */}

          {renderLegacySection()}
        
      </div>

  )
}

/**
 * History Page Prop Types (for documentation)
 * 
 * @typedef {Object} HistoryPageProps
 * @property {Object} historyData - Historical timeline data
 * @property {Array} historyData.timeline - Array of historical events
 */