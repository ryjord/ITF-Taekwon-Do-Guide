import { useState, useEffect, useCallback } from 'react'

/**
 * Slideshow Component
 * 
 * Professional interactive slideshow showcasing the 5 Tenets of ITF Taekwon-Do
 * with crimson red theme, white text, and clean professional design.
 */
export const Slideshow = () => {
  // State management
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Professional slide data with crimson red theme
  const slides = [
    {
      koreanName: "Ye Ui",
      englishName: "Courtesy",
      description: "Showing respect to instructors, seniors, and fellow students through disciplined behavior and proper etiquette in all interactions.",
      caption: "I shall respect the instructor and seniors"
    },
    {
      koreanName: "Yom Chi",
      englishName: "Integrity",
      description: "Being honest and having strong moral principles, always choosing the right path even when no one is watching.",
      caption: "I shall never misuse Taekwon-Do"
    },
    {
      koreanName: "In Nae", 
      englishName: "Perseverance",
      description: "Persisting in pursuit of goals despite obstacles, developing mental toughness through continuous practice and dedication.",
      caption: "I shall persevere in all endeavours"
    },
    {
      koreanName: "Guk Gi",
      englishName: "Self-Control",
      description: "Maintaining control over mind, body, and actions, especially in challenging situations requiring discipline and restraint.",
      caption: "I shall exercise self-control in all situations"
    },
    {
      koreanName: "Baekjul Boolgool", 
      englishName: "Indomitable Spirit",
      description: "Showing courage and standing for what is right, facing adversity with unwavering determination and moral strength.",
      caption: "I shall be a champion of freedom and justice"
    }
  ]

  // Auto-advance slides - 3 seconds per slide
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000) // 3 seconds per slide

    return () => clearInterval(timer)
  }, [isPaused, slides.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1)
          break
        case 'ArrowRight':
          event.preventDefault()
          setCurrentSlide(prev => (prev + 1) % slides.length)
          break
        case ' ':
          event.preventDefault()
          setIsPaused(prev => !prev)
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [slides.length])

  // Navigation handlers
  const handleDotClick = (index) => {
    setCurrentSlide(index)
    setIsPaused(true)
  }

  const handlePrevious = () => {
    setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1)
    setIsPaused(true)
  }

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
    setIsPaused(true)
  }

  return (
    <section 
      className="
        relative h-96 md:h-[600px] lg:h-[600px] overflow-hidden
        rounded-2xl mx-4 md:mx-8 lg:mx-auto max-w-6xl
        shadow-2xl border border-white/20
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 transition-all duration-700 transform
              ${index === currentSlide 
                ? "opacity-100 translate-x-0" 
                : index < currentSlide 
                  ? "opacity-0 -translate-x-8" 
                  : "opacity-0 translate-x-8"
              }
            `}
          >
            {/* Crimson Red Gradient Background */}
            <div className="w-full h-full bg-gradient-to-br from-red-900 via-red-900 to-red-600 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-6">
                {/* Korean Name - Professional Typography */}
                <div className="mb-4">
                  <p className="text-lg md:text-xl font-light opacity-90 tracking-wide">
                    {slide.koreanName}
                  </p>
                </div>
                
                {/* English Name - Bold and Prominent */}
                <h3 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg tracking-tight">
                  {slide.englishName}
                </h3>
                
                {/* Description - Clean and Readable */}
                <p className="text-base md:text-lg mb-6 opacity-95 leading-relaxed max-w-2xl mx-auto font-light">
                  {slide.description}
                </p>
                
                {/* Student Oath - Professional Card Style */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-md mx-auto">
                  <p className="text-base md:text-lg italic opacity-95 font-medium">
                    "{slide.caption}"
                  </p>
                  <p className="text-sm opacity-80 mt-3 font-light">
                    — Student Oath
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots - Clean and Minimal */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2
              ${index === currentSlide 
                ? "bg-white shadow-lg" 
                : "bg-white/40 hover:bg-white/60"
              }
            `}
          />
        ))}
      </div>

      {/* Navigation Arrows - Subtle and Professional */}
      <button
        onClick={handlePrevious}
        className="
          absolute left-4 top-1/2 transform -translate-y-1/2
          bg-white/10 hover:bg-white/20 text-white
          w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
          transition-all duration-300 backdrop-blur-sm
          focus:outline-none focus:ring-2 focus:ring-white
          hover:scale-110 active:scale-95
          opacity-80 hover:opacity-100
        "
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="
          absolute right-4 top-1/2 transform -translate-y-1/2
          bg-white/10 hover:bg-white/20 text-white
          w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
          transition-all duration-300 backdrop-blur-sm
          focus:outline-none focus:ring-2 focus:ring-white
          hover:scale-110 active:scale-95
          opacity-80 hover:opacity-100
        "
      >
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Play/Pause Control - Minimal */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="
          absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white
          w-7 h-7 rounded-full flex items-center justify-center
          transition-all duration-300 backdrop-blur-sm
          focus:outline-none focus:ring-2 focus:ring-white
          hover:scale-110 active:scale-95
          opacity-80 hover:opacity-100
        "
      >
        {isPaused ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
          </svg>
        )}
      </button>

      {/* Slide Counter - Clean and Readable */}
      <div className="absolute top-4 left-4 bg-white/10 text-white px-2 py-1 rounded text-xs backdrop-blur-sm opacity-80 font-medium">
        {currentSlide + 1} / {slides.length}
      </div>
    </section>
  )
}