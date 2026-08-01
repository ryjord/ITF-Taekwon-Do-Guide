import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const SLIDES = [
  {
    koreanName: 'Ye Ui',
    englishName: 'Courtesy',
    description:
      'Showing respect to instructors, seniors, and fellow students through disciplined behavior and proper etiquette in all interactions.',
    caption: 'I shall respect the instructor and seniors',
  },
  {
    koreanName: 'Yom Chi',
    englishName: 'Integrity',
    description:
      'Being honest and having strong moral principles, always choosing the right path even when no one is watching.',
    caption: 'I shall never misuse Taekwon-Do',
  },
  {
    koreanName: 'In Nae',
    englishName: 'Perseverance',
    description:
      'Persisting in pursuit of goals despite obstacles, developing mental toughness through continuous practice and dedication.',
    caption: 'I shall persevere in all endeavours',
  },
  {
    koreanName: 'Guk Gi',
    englishName: 'Self-Control',
    description:
      'Maintaining control over mind, body, and actions, especially in challenging situations requiring discipline and restraint.',
    caption: 'I shall exercise self-control in all situations',
  },
  {
    koreanName: 'Baekjul Boolgool',
    englishName: 'Indomitable Spirit',
    description:
      'Showing courage and standing for what is right, facing adversity with unwavering determination and moral strength.',
    caption: 'I shall be a champion of freedom and justice',
  },
]

export const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [isPaused])

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1))
          break
        case 'ArrowRight':
          event.preventDefault()
          setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
          break
        case ' ':
          event.preventDefault()
          setIsPaused((prev) => !prev)
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsPaused(true)
  }

  const goToPrevious = () => goToSlide(currentSlide === 0 ? SLIDES.length - 1 : currentSlide - 1)
  const goToNext = () => goToSlide((currentSlide + 1) % SLIDES.length)

  return (
    <section
      className="relative mx-4 h-96 max-w-6xl overflow-hidden rounded-2xl border border-white/20 shadow-2xl md:mx-8 md:h-150 lg:mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="The Five Tenets of ITF Taekwon-Do"
    >
      <div className="relative h-full w-full">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.englishName}
            className={cn(
              'absolute inset-0 transition-all duration-700',
              index === currentSlide
                ? 'translate-x-0 opacity-100'
                : index < currentSlide
                  ? '-translate-x-8 opacity-0'
                  : 'translate-x-8 opacity-0'
            )}
            aria-hidden={index !== currentSlide}
          >
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary via-primary to-secondary">
              <div className="mx-auto max-w-4xl px-6 text-center text-white">
                <p className="mb-4 text-lg font-light tracking-wide opacity-90 md:text-xl">
                  {slide.koreanName}
                </p>
                <h3 className="mb-6 text-3xl font-bold tracking-tight drop-shadow-lg md:text-5xl">
                  {slide.englishName}
                </h3>
                <p className="mx-auto mb-6 max-w-2xl text-base font-light leading-relaxed opacity-95 md:text-lg">
                  {slide.description}
                </p>
                <div className="mx-auto max-w-md rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                  <p className="text-base font-medium italic opacity-95 md:text-lg">
                    "{slide.caption}"
                  </p>
                  <p className="mt-3 text-sm font-light opacity-80">— Student Oath</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 space-x-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.englishName}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-3 w-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2',
              index === currentSlide ? 'bg-white shadow-lg' : 'bg-white/40 hover:bg-white/60'
            )}
            aria-label={`Go to slide ${index + 1}: ${slide.englishName}`}
            aria-current={index === currentSlide}
          />
        ))}
      </div>

      <Button
        variant="ghost-inverse"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-5" />
      </Button>

      <Button
        variant="ghost-inverse"
        size="icon"
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="size-5" />
      </Button>

      <Button
        variant="ghost-inverse"
        size="icon-sm"
        onClick={() => setIsPaused((prev) => !prev)}
        className="absolute right-4 top-4 rounded-full backdrop-blur-sm"
        aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
      >
        {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
      </Button>

      <div className="absolute left-4 top-4 rounded bg-white/10 px-2 py-1 text-xs font-medium text-white opacity-80 backdrop-blur-sm">
        {currentSlide + 1} / {SLIDES.length}
      </div>
    </section>
  )
}
