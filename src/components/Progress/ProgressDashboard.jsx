import { Lock, Trophy } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import { StatTile } from '../QuizPage/StatTile'
import { ACHIEVEMENT_ICONS, CATEGORY_ICONS, DEFAULT_ACHIEVEMENT_ICON } from '../QuizPage/quizIcons'
import { useGlobalProgress } from '../../hooks/useGlobalProgess'
import achievementsData from '../../data/achievements/achievements.json'

const CATEGORY_NAMES = {
  terminology: 'Korean Terminology',
  patterns: 'Patterns',
  techniques: 'Techniques',
  history: 'History',
}

const CategoryProgressBar = ({ category, games, points }) => {
  const Icon = CATEGORY_ICONS[category]
  const progressPercentage = Math.min((games / 10) * 100, 100)

  return (
    <Card>
      <CardContent>
        <div className="mb-3 flex items-center gap-3">
          {Icon && <Icon className="size-6 text-primary" aria-hidden="true" />}
          <div>
            <h4 className="font-semibold text-foreground">{CATEGORY_NAMES[category]}</h4>
            <p className="text-sm text-foreground/60">
              {games} games • {points} points
            </p>
          </div>
        </div>
        <Progress
          value={progressPercentage}
          aria-label={`Progress for ${CATEGORY_NAMES[category]}: ${progressPercentage.toFixed(0)}%`}
        />
      </CardContent>
    </Card>
  )
}

const AchievementBadge = ({ achievementId }) => {
  const achievements = useGlobalProgress((state) => state.achievements)
  const achievement = achievementsData.achievements.find((a) => a.id === achievementId)
  if (!achievement) return null

  const isUnlocked = achievements.includes(achievementId)
  const Icon = ACHIEVEMENT_ICONS[achievementId] || DEFAULT_ACHIEVEMENT_ICON

  return (
    <Card
      className={cn('min-w-50 items-center text-center transition-all', !isUnlocked && 'opacity-50')}
      role="article"
      aria-label={`Achievement: ${achievement.name}. ${isUnlocked ? 'Unlocked' : 'Locked'}. ${achievement.description}`}
    >
      <CardContent className="items-center">
        <Icon className={cn('mb-2 size-8', isUnlocked ? 'text-primary' : 'text-foreground/40')} aria-hidden="true" />
        <h4 className="mb-1 font-semibold text-foreground">{achievement.name}</h4>
        <p className="text-sm text-foreground/70">{achievement.description}</p>
        <Badge variant={isUnlocked ? 'default' : 'outline'} className="mt-2">
          {isUnlocked ? <Trophy className="size-3" aria-hidden="true" /> : <Lock className="size-3" aria-hidden="true" />}
          {isUnlocked ? 'Unlocked' : 'Locked'}
        </Badge>
      </CardContent>
    </Card>
  )
}

export const ProgressDashboard = () => {
  const totalGamesPlayed = useGlobalProgress((state) => state.totalGamesPlayed)
  const totalPoints = useGlobalProgress((state) => state.totalPoints)
  const gamesCompleted = useGlobalProgress((state) => state.gamesCompleted)
  const timePlayed = useGlobalProgress((state) => state.timePlayed)
  const achievements = useGlobalProgress((state) => state.achievements)
  const categoryProgress = useGlobalProgress((state) => state.categoryProgress)

  const formattedTimePlayed = `${Math.floor(timePlayed / 60)}m`
  const recentAchievements = achievements.slice(-3)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile value={totalGamesPlayed} label="Games Played" />
        <StatTile value={totalPoints} label="Total Points" />
        <StatTile value={formattedTimePlayed} label="Time Played" />
        <StatTile value={achievements.length} label="Achievements" />
      </div>

      <section aria-labelledby="category-progress-heading">
        <h2 id="category-progress-heading" className="mb-6 text-2xl font-bold text-foreground">
          Category Progress
        </h2>
        <div className="space-y-4">
          {Object.entries(categoryProgress).map(([category, data]) => (
            <CategoryProgressBar key={category} category={category} games={data.games} points={data.points} />
          ))}
        </div>
      </section>

      <section aria-labelledby="game-type-progress-heading">
        <h2 id="game-type-progress-heading" className="mb-6 text-2xl font-bold text-foreground">
          Game Types
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Object.entries(gamesCompleted).map(([gameType, count]) => (
            <StatTile key={gameType} value={count} label={gameType.charAt(0).toUpperCase() + gameType.slice(1)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="achievements-heading">
        <h2 id="achievements-heading" className="mb-6 text-2xl font-bold text-foreground">
          Achievements ({achievements.length}/{achievementsData.achievements.length})
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievementsData.achievements.map((achievement) => (
            <AchievementBadge key={achievement.id} achievementId={achievement.id} />
          ))}
        </div>
      </section>

      {recentAchievements.length > 0 && (
        <section aria-labelledby="recent-achievements-heading">
          <h3 id="recent-achievements-heading" className="mb-4 text-lg font-semibold">
            Recent Achievements
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2" role="list" aria-label="Recently unlocked achievements">
            {recentAchievements.map((achievementId) => (
              <AchievementBadge key={achievementId} achievementId={achievementId} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
