import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Repeat, ScrollText, Swords, Target, Zap } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

const FEATURED_SECTIONS = [
  {
    name: 'Techniques',
    href: '/techniques',
    icon: Swords,
    description:
      'Master strikes, blocks, stances, and kicks with detailed form breakdowns and progressive learning paths.',
    badge: 'Core Fundamentals',
  },
  {
    name: 'Patterns (Tul)',
    href: '/patterns',
    icon: Repeat,
    description:
      'Learn all 24 ITF patterns from Chon-Ji to Tong-Il with step-by-step guides and video demonstrations.',
    badge: '24 Traditional Forms',
  },
  {
    name: 'Drills',
    href: '/drills',
    icon: Zap,
    description:
      'Practice combinations, footwork, and sparring drills to improve your skills and build muscle memory.',
    badge: 'Training Exercises',
  },
  {
    name: 'Terminology',
    href: '/terminology',
    icon: BookOpen,
    description:
      'Learn Korean commands, counting, and technical terms with authentic audio pronunciation guides.',
    badge: 'Language & Culture',
  },
  {
    name: 'History',
    href: '/history',
    icon: ScrollText,
    description:
      "Explore ITF's rich heritage from General Choi Hong Hi to global expansion through interactive timelines.",
    badge: 'Legacy & Heritage',
  },
  {
    name: 'Quiz',
    href: '/quiz',
    icon: Target,
    description: 'Test your knowledge with interactive quizzes on techniques, patterns, and theoretical principles.',
    badge: 'Interactive Learning',
  },
]

export const FeaturedGrid = () => {
  return (
    <section
      className="bg-linear-to-b from-background to-background/80 py-16"
      role="region"
      aria-label="Featured application sections"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Comprehensive ITF Taekwon-Do Resources
          </h2>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-foreground/70">
            Explore our complete collection of traditional ITF Taekwon-Do resources,
            from fundamental techniques to advanced patterns and interactive learning tools.
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          role="navigation"
          aria-label="Main application sections"
        >
          {FEATURED_SECTIONS.map((section) => (
            <Link
              key={section.name}
              to={section.href}
              className="group block rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-label={`Navigate to ${section.name} section`}
            >
              <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
                <CardContent>
                  <div
                    className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 shadow-md transition-transform duration-300 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <section.icon className="size-7 text-primary" />
                  </div>

                  <div className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors duration-200 group-hover:bg-primary/20">
                    {section.badge}
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-foreground transition-colors duration-200 group-hover:text-primary">
                    {section.name}
                  </h3>

                  <p className="mb-4 text-sm leading-relaxed text-foreground/70">
                    {section.description}
                  </p>

                  <div
                    className="flex items-center text-sm font-semibold text-primary transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    Explore Section
                    <ArrowRight className="ml-2 size-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-foreground/60">
            Looking for something specific? Explore our complete sitemap in the navigation menu.
          </p>
        </div>
      </div>
    </section>
  )
}
