import { useGlobalProgress } from '../../hooks/useGlobalProgess'
import achievementsData from '../../data/achievements/achievements.json'

/**
 * StatCard Component
 * 
 * A reusable statistic card component that displays progress metrics
 * with icons and formatted values.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.title - The title/label for the statistic
 * @param {string|number} props.value - The value to display
 * @param {string} props.icon - Emoji or icon representing the statistic
 * @returns {JSX.Element} Statistic card component
 */
const StatCard = ({ title, value, icon }) => (
  <div 
    className="bg-primary/10 rounded-2xl p-6 text-center border-2 border-primary/20"
    role="region"
    aria-label={`${title}: ${value}`}
  >
    <div className="text-3xl mb-2" aria-hidden="true">{icon}</div>
    <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
    <div className="text-sm text-foreground/70">{title}</div>
  </div>
)

/**
 * CategoryProgressBar Component
 * 
 * Displays progress for a specific quiz category with visual progress bar
 * and category information.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.category - Category identifier
 * @param {number} props.games - Number of games played in this category
 * @param {number} props.points - Points earned in this category
 * @returns {JSX.Element} Category progress bar component
 */
const CategoryProgressBar = ({ category, games, points }) => {
  /**
   * Category configuration mapping with display information
   * @type {Object}
   */
  const categoryInfo = {
    terminology: { name: 'Korean Terminology', icon: '🗣️', color: 'bg-blue-500' },
    patterns: { name: 'Patterns', icon: '🌀', color: 'bg-red-500' },
    techniques: { name: 'Techniques', icon: '🥋', color: 'bg-green-500' },
    history: { name: 'History', icon: '📜', color: 'bg-purple-500' }
  }[category]

  /**
   * Calculates progress percentage for the visual bar
   * Caps at 100% for visual consistency
   * @type {number}
   */
  const progressPercentage = Math.min((games / 10) * 100, 100)

  return (
    <div className="bg-background border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{categoryInfo.icon}</span>
          <div>
            <h4 className="font-semibold text-foreground">{categoryInfo.name}</h4>
            <p className="text-sm text-foreground/60">{games} games • {points} points</p>
          </div>
        </div>
      </div>
      <div 
        className="w-full bg-gray-200 rounded-full h-3"
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`Progress for ${categoryInfo.name}: ${progressPercentage.toFixed(0)}%`}
      >
        <div 
          className={`${categoryInfo.color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  )
}

/**
 * AchievementBadge Component
 * 
 * Displays an individual achievement with unlock status and details.
 * Uses individual Zustand selectors to prevent unnecessary re-renders.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.achievementId - Unique identifier for the achievement
 * @returns {JSX.Element} Achievement badge component
 */
const AchievementBadge = ({ achievementId }) => {
  // Individual selector to prevent infinite re-render loops
  const achievements = useGlobalProgress((state) => state.achievements)
  
  /**
   * Finds achievement data from the achievements JSON file
   * @type {Object|null}
   */
  const achievement = achievementsData.achievements.find(a => a.id === achievementId)
  
  // Return null if achievement data is not found (safety check)
  if (!achievement) return null

  /**
   * Checks if the achievement has been unlocked by the user
   * @type {boolean}
   */
  const isUnlocked = achievements.includes(achievementId)

  return (
    <div 
      className={`
        border-2 rounded-2xl p-4 text-center transition-all min-w-[200px]
        ${isUnlocked 
          ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-md' 
          : 'border-gray-300 bg-gray-100 dark:bg-gray-800 opacity-50'
        }
      `}
      role="article"
      aria-label={`Achievement: ${achievement.name}. ${isUnlocked ? 'Unlocked' : 'Locked'}. ${achievement.description}`}
    >
      <div className="text-3xl mb-2" aria-hidden="true">{achievement.icon}</div>
      <h4 className="font-semibold mb-1 text-foreground">{achievement.name}</h4>
      <p className="text-sm text-foreground/70">{achievement.description}</p>
      <div 
        className={`
          mt-2 text-xs px-2 py-1 rounded-full
          ${isUnlocked 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }
        `}
      >
        {isUnlocked ? 'Unlocked' : 'Locked'}
      </div>
    </div>
  )
}

/**
 * ProgressDashboard Component
 * 
 * Main progress tracking dashboard that displays comprehensive user statistics,
 * category progress, game type completion, and achievement tracking.
 * 
 * Features:
 * - Overall progress statistics
 * - Category-specific progress bars
 * - Game type completion counts
 * - Achievement gallery with unlock status
 * - Recent achievements showcase
 * - Debug information (development only)
 * 
 * @returns {JSX.Element} Complete progress dashboard interface
 */
export const ProgressDashboard = () => {
  // ===== INDIVIDUAL SELECTORS =====
  // Using individual selectors prevents infinite re-render loops
  
  /** @type {number} Total number of games played across all types */
  const totalGamesPlayed = useGlobalProgress((state) => state.totalGamesPlayed)
  
  /** @type {number} Total points earned across all games */
  const totalPoints = useGlobalProgress((state) => state.totalPoints)
  
  /** @type {Object} Game completion counts by game type */
  const gamesCompleted = useGlobalProgress((state) => state.gamesCompleted)
  
  /** @type {number} Total time played in seconds */
  const timePlayed = useGlobalProgress((state) => state.timePlayed)
  
  /** @type {Array} Array of unlocked achievement IDs */
  const achievements = useGlobalProgress((state) => state.achievements)
  
  /** @type {Object} Progress data by category */
  const categoryProgress = useGlobalProgress((state) => state.categoryProgress)

  // ===== COMPUTED VALUES =====

  /**
   * Formats time played into a readable string
   * @type {string}
   */
  const formattedTimePlayed = `${Math.floor(timePlayed / 60)}m`

  /**
   * Gets the 3 most recently unlocked achievements for the showcase
   * @type {Array}
   */
  const recentAchievements = achievements.slice(-3)

  // ===== RENDER METHODS =====

  /**
   * Renders the main statistics grid
   * @returns {JSX.Element} Statistics cards grid
   */
  const renderMainStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard title="Games Played" value={totalGamesPlayed} icon="🎮" />
      <StatCard title="Total Points" value={totalPoints} icon="🏆" />
      <StatCard title="Time Played" value={formattedTimePlayed} icon="⏱️" />
      <StatCard title="Achievements" value={achievements.length} icon="⭐" />
    </div>
  )

  /**
   * Renders the category progress section
   * @returns {JSX.Element} Category progress component
   */
  const renderCategoryProgress = () => (
    <section 
      className="bg-background border border-border rounded-2xl p-6"
      aria-labelledby="category-progress-heading"
    >
      <h2 id="category-progress-heading" className="text-2xl font-bold text-foreground mb-6">
        Category Progress
      </h2>
      <div className="space-y-4">
        {Object.entries(categoryProgress).map(([category, data]) => (
          <CategoryProgressBar 
            key={category}
            category={category}
            games={data.games}
            points={data.points}
          />
        ))}
      </div>
    </section>
  )

  /**
   * Renders the game type progress section
   * @returns {JSX.Element} Game type progress component
   */
  const renderGameTypeProgress = () => (
    <section 
      className="bg-background border border-border rounded-2xl p-6"
      aria-labelledby="game-type-progress-heading"
    >
      <h2 id="game-type-progress-heading" className="text-2xl font-bold text-foreground mb-6">
        Game Types
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(gamesCompleted).map(([gameType, count]) => (
          <div 
            key={gameType} 
            className="bg-primary/10 rounded-2xl p-4 text-center"
            role="region"
            aria-label={`${gameType} games: ${count} completed`}
          >
            <div className="text-2xl font-bold text-primary mb-1">{count}</div>
            <div className="text-sm text-foreground/70 capitalize">{gameType}</div>
          </div>
        ))}
      </div>
    </section>
  )

  /**
   * Renders the achievements gallery section
   * @returns {JSX.Element} Achievements gallery component
   */
  const renderAchievementsGallery = () => (
    <section 
      className="bg-background border border-border rounded-2xl p-6"
      aria-labelledby="achievements-heading"
    >
      <h2 id="achievements-heading" className="text-2xl font-bold text-foreground mb-6">
        Achievements ({achievements.length}/{achievementsData.achievements.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievementsData.achievements.map(achievement => (
          <AchievementBadge 
            key={achievement.id} 
            achievementId={achievement.id} 
          />
        ))}
      </div>
    </section>
  )

  /**
   * Renders the recent achievements showcase
   * @returns {JSX.Element} Recent achievements component
   */
  const renderRecentAchievements = () => (
    recentAchievements.length > 0 && (
      <section 
        className="bg-background border border-border rounded-2xl p-6"
        aria-labelledby="recent-achievements-heading"
      >
        <h3 id="recent-achievements-heading" className="text-lg font-semibold mb-4">
          Recent Achievements
        </h3>
        <div 
          className="flex gap-3 overflow-x-auto pb-2"
          role="list"
          aria-label="Recently unlocked achievements"
        >
          {recentAchievements.map(achievementId => (
            <AchievementBadge key={achievementId} achievementId={achievementId} />
          ))}
        </div>
      </section>
    )
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div className="space-y-8">
      {renderMainStats()}
      {renderCategoryProgress()}
      {renderGameTypeProgress()}
      {renderAchievementsGallery()}
      {renderRecentAchievements()}
    </div>
  )
}