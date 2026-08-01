import { Link } from 'react-router-dom'

/**
 * Hero Component
 * 
 * Professional hero section component for the ITF Taekwon-Do application
 * featuring compelling visuals, clear value proposition, and strategic CTAs.
 * 
 * Features:
 * - Responsive background image with optimized overlays
 * - Professional typography hierarchy for all screen sizes
 * - Strategic call-to-action buttons with hover effects
 * - Accessibility-compliant semantic structure
 * - Performance-optimized background handling
 * - Commercial-ready code with comprehensive documentation
 * 
 * @returns {JSX.Element} Hero section component
 * 
 * @example
 * <Hero />
 */
export const Hero = () => {
  // ===== RENDER METHODS =====

  /**
   * Renders background layers with optimized performance
   * @returns {JSX.Element} Background component
   */
  const renderBackground = () => (
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/image/hero-taekwondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
      role="img"
      aria-label="ITF Taekwon-Do practitioner performing a technique"
    >
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Gradient overlay for brand integration */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-transparent to-primary/30"></div>
    </div>
  )

  /**
   * Renders main heading with brand emphasis
   * @returns {JSX.Element} Main heading component
   */
  const renderMainHeading = () => (
    <div className="mb-8">
       <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
        ITF <span className="text-red-800 animate-gradient bg-gradient-to-r from-red-800 via-red-600 to-red-800 bg-clip-text text-transparent">Taekwon-Do</span>
      </h1>
       <div className="w-32 h-1 bg-gradient-to-r from-red-800 to-red-600 mx-auto mb-6 rounded-full shadow-lg"></div>
    </div>
  )

  /**
   * Renders subheading with founding information
   * @returns {JSX.Element} Subheading component
   */
  const renderSubheading = () => (
    <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 drop-shadow-md">
      Est. April 11th, 1955 • The Art of Foot and Fist
    </p>
  )

  /**
   * Renders description with value proposition
   * @returns {JSX.Element} Description component
   */
  const renderDescription = () => (
    <p className="text-base md:text-lg text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto drop-shadow-md leading-relaxed">
      Master General Choi Hong Hi's legacy through comprehensive resources. 
      Your complete guide to traditional patterns, techniques, and philosophy 
      of authentic ITF Taekwon-Do.
    </p>
  )

  /**
   * Renders call-to-action buttons
   * @returns {JSX.Element} CTA buttons component
   */
  const renderCTAs = () => (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
      <Link 
        to="/techniques" 
        className="
          bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 
          text-base md:text-lg font-semibold rounded-lg
          transition-all duration-200 hover:translate-y-[-2px] 
          hover:shadow-lg focus:outline-none focus:ring-2 
          focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          shadow-md
        "
        aria-label="Explore Techniques section"
      >
        Explore Techniques
      </Link>
      
      <Link 
        to="/patterns" 
        className="
          border-2 border-white text-white hover:bg-white hover:text-primary 
          px-6 md:px-8 py-3 text-base md:text-lg font-semibold rounded-lg
          transition-all duration-200 hover:translate-y-[-2px]
          focus:outline-none focus:ring-2 focus:ring-white 
          focus:ring-offset-2 focus:ring-offset-background
          shadow-sm hover:shadow-md
        "
        aria-label="Learn Patterns section"
      >
        Learn Patterns
      </Link>
    </div>
  )

  /**
   * Riders main content container
   * @returns {JSX.Element} Content container component
   */
  const renderContent = () => (
    <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
      {renderMainHeading()}
      {renderSubheading()}
      {renderDescription()}
      {renderCTAs()}
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <section 
      className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden"
      role="banner"
      aria-label="ITF Taekwon-Do Hero Section"
    >
      {renderBackground()}
      {renderContent()}
    </section>
  )
}