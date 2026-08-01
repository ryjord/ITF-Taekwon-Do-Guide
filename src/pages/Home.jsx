// imports
import { Hero } from '../components/HomePage/Hero'
import { Stats } from '../components/HomePage/Stats'
import { FeaturedGrid } from '../components/HomePage/FeaturedGrid'
import { PhilosophySection } from '../components/HomePage/PhilosophySection'
import { Slideshow } from '../components/HomePage/Slideshow'

// main component
export const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Slideshow />
      <Stats />
      <FeaturedGrid />
      <PhilosophySection />
    </div>
  )
}