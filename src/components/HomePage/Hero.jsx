import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export const Hero = () => {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16"
      role="banner"
      aria-label="ITF Taekwon-Do Hero Section"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/image/hero-taekwondo.jpg')" }}
        role="img"
        aria-label="ITF Taekwon-Do practitioner performing a technique"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-linear-to-br from-background/40 via-transparent to-primary/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-7xl lg:text-8xl">
            ITF <span className="text-primary">Taekwon-Do</span>
          </h1>
          <div className="mx-auto mb-6 h-1 w-32 rounded-full bg-primary shadow-lg" />
        </div>

        <p className="mb-6 text-lg text-white/90 drop-shadow-md md:mb-8 md:text-xl lg:text-2xl">
          Est. April 11th, 1955 &bull; The Art of Foot and Fist
        </p>

        <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-white/80 drop-shadow-md md:mb-8 md:text-lg">
          Master General Choi Hong Hi's legacy through comprehensive resources.
          Your complete guide to traditional patterns, techniques, and philosophy
          of authentic ITF Taekwon-Do.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row md:gap-4">
          <Button asChild size="lg" className="text-base md:text-lg">
            <Link to="/techniques" aria-label="Explore Techniques section">
              Explore Techniques
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline-inverse"
            className="text-base md:text-lg"
          >
            <Link to="/patterns" aria-label="Learn Patterns section">
              Learn Patterns
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
