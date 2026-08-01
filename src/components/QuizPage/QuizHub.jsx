import { useState, useMemo } from 'react'
import { QuizCategoryCard } from './QuizCategoryCard'
import { DifficultySelector } from './DifficultySelector'
import { GameTypeSelector } from './GameTypeSelector'
import { QuizCard } from './QuizCard'
import { ProgressDashboard } from '../Progress/ProgressDashboard'
import { useGlobalProgress } from '../../hooks/useGlobalProgess'

// Import all quiz data from JSON files
import categoriesData from '../../data/quiz/QuizCategories.json'
import mcqData from '../../data/quiz/MCQData.json'
import wordSearchData from '../../data/quiz/WordSearchData.json'
import translationData from '../../data/quiz/TranslationData.json'
import crosswordData from '../../data/quiz/CrosswordData.json'
import flashcardData from '../../data/quiz/FlashCardData.json'
import matchingData from '../../data/quiz/MatchingData.json'

/**
 * QuizHub Component
 * 
 * Main quiz selection hub that provides a comprehensive interface for browsing,
 * filtering, and selecting quizzes across different categories, game types, and difficulties.
 * 
 * Features:
 * - Tab-based navigation between quizzes and progress dashboard
 * - Multi-filter quiz selection (category, game type, difficulty)
 * - Real-time progress statistics display
 * - Responsive grid layouts for all screen sizes
 * - Dynamic quiz filtering with clear visual feedback
 * 
 * @param {Object} props - Component properties
 * @param {Function} props.onQuizSelect - Callback function when a quiz is selected
 * @returns {JSX.Element} Complete quiz selection interface
 */
export const QuizHub = ({ onQuizSelect }) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[string|null, Function]} Currently selected category ID or null */
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  /** @type {[string|null, Function]} Currently selected difficulty level or null */
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  
  /** @type {[string|null, Function]} Currently selected game type ID or null */
  const [selectedGameType, setSelectedGameType] = useState(null)
  
  /** @type {[string, Function]} Active tab state: 'quizzes' or 'progress' */
  const [activeTab, setActiveTab] = useState('quizzes')

  // ===== PROGRESS HOOKS =====
  
  /**
   * Individual Zustand selectors to prevent infinite re-renders
   * Each selector only subscribes to its specific piece of state
   */
  const totalGamesPlayed = useGlobalProgress((state) => state.totalGamesPlayed)
  const totalPoints = useGlobalProgress((state) => state.totalPoints)
  const timePlayed = useGlobalProgress((state) => state.timePlayed)
  const achievements = useGlobalProgress((state) => state.achievements)

  // ===== COMPUTED VALUES =====

  /**
   * Combines all quizzes from different game type data files into a single array
   * @type {Array}
   */
  const allQuizzes = useMemo(() => [
    ...mcqData.quizzes,
    ...wordSearchData.quizzes,
    ...translationData.quizzes,
    ...crosswordData.quizzes,
    ...flashcardData.quizzes,
    ...matchingData.quizzes
  ], [])

  /**
   * Filters quizzes based on current category, difficulty, and game type selections
   * @type {Array}
   */
  const filteredQuizzes = useMemo(() => 
    allQuizzes.filter(quiz => {
      const matchesCategory = !selectedCategory || quiz.category === selectedCategory
      const matchesDifficulty = !selectedDifficulty || quiz.difficulty === selectedDifficulty
      const matchesGameType = !selectedGameType || quiz.gameType === selectedGameType
      return matchesCategory && matchesDifficulty && matchesGameType
    }),
    [allQuizzes, selectedCategory, selectedDifficulty, selectedGameType]
  )

  /**
   * Checks if any filters are currently active
   * @type {boolean}
   */
  const hasActiveFilters = selectedCategory || selectedDifficulty || selectedGameType

  // ===== EVENT HANDLERS =====

  /**
   * Clears all active filters (category, difficulty, game type)
   */
  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedDifficulty(null)
    setSelectedGameType(null)
  }

  /**
   * Handles category selection with toggle behavior
   * @param {string} categoryId - The category ID to select/deselect
   */
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(
      selectedCategory === categoryId ? null : categoryId
    )
  }

  /**
   * Formats time played into a readable string
   * @returns {string} Formatted time string (e.g., "25m")
   */
  const getFormattedTimePlayed = () => {
    return `${Math.floor(timePlayed / 60)}m`
  }

  // ===== RENDER METHODS =====

  /**
   * Renders the main header section
   * @returns {JSX.Element} Header component
   */
  const renderHeader = () => (
    <div className="mb-8 text-center animate-fade-in-down">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 tracking-tight drop-shadow-lg">
        ITF <span className="text-blue-800 animate-gradient bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 bg-clip-text text-transparent">Quizzes</span>
      </h1>
      <div className="w-32 h-1 bg-gradient-to-r from-blue-800 to-blue-600 mx-auto mb-6 rounded-full shadow-lg"></div>
      <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
        Test your knowledge, master the art. Challenge yourself with interactive quizzes.
      </p>
    </div>
  )

  /**
   * Renders the tab navigation component
   * @returns {JSX.Element} Tab navigation component
   */
  const renderTabNavigation = () => (
    <section className="flex justify-center">
      <div 
        className="bg-background border border-border rounded-2xl p-1"
        role="tablist"
        aria-label="Quiz hub navigation"
      >
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'quizzes'
              ? 'bg-primary text-white shadow-md'
              : 'text-foreground/70 hover:text-foreground'
          }`}
          role="tab"
          aria-selected={activeTab === 'quizzes'}
          aria-controls="quizzes-panel"
        >
          🎮 Play Quizzes
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'progress'
              ? 'bg-primary text-white shadow-md'
              : 'text-foreground/70 hover:text-foreground'
          }`}
          role="tab"
          aria-selected={activeTab === 'progress'}
          aria-controls="progress-panel"
        >
          📊 My Progress
        </button>
      </div>
    </section>
  )

  /**
   * Renders the category selection section
   * @returns {JSX.Element} Category selection component
   */
  const renderCategorySelection = () => (
    <section aria-labelledby="category-heading" >
      <h2 id="category-heading" className="text-2xl font-bold text-foreground mb-6 text-center">
        Choose a Category
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoriesData.quizCategories.map((category) => (
          <QuizCategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() => handleCategorySelect(category.id)}
          />
        ))}
      </div>
    </section>
  )

  /**
   * Renders the game type selection section
   * @returns {JSX.Element} Game type selection component
   */
  const renderGameTypeSelection = () => (
    <section aria-labelledby="game-type-heading" className="mt-12">
      <h2 id="game-type-heading" className="text-2xl font-bold text-foreground mb-6 text-center">
        Select Game Type
      </h2>
      <GameTypeSelector
        gameTypes={categoriesData.gameTypes}
        selectedGameType={selectedGameType}
        onGameTypeSelect={setSelectedGameType}
      />
    </section>
  )

  /**
   * Renders the difficulty selection section
   * @returns {JSX.Element} Difficulty selection component
   */
  const renderDifficultySelection = () => (
    <section aria-labelledby="difficulty-heading" className='mt-12'>
      <h2 id="difficulty-heading" className="text-2xl font-bold text-foreground mb-6 text-center">
        Select Difficulty
      </h2>
      <DifficultySelector
        difficulties={categoriesData.difficultyLevels}
        selectedDifficulty={selectedDifficulty}
        onDifficultySelect={setSelectedDifficulty}
      />
    </section>
  )

  /**
   * Renders the available quizzes section with filtering
   * @returns {JSX.Element} Quiz listing component
   */
  const renderAvailableQuizzes = () => (
    <section aria-labelledby="quizzes-heading" className='mt-12'>
      <div className="flex items-center justify-between mb-6">
        <h2 id="quizzes-heading" className="text-2xl font-bold text-foreground">
          Available Quizzes ({filteredQuizzes.length})
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-primary hover:text-primary-hover text-sm font-medium focus:outline-none focus:underline"
            aria-label="Clear all filters"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {filteredQuizzes.length > 0 ? (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Available quizzes"
        >
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              gameType={categoriesData.gameTypes.find(g => g.id === quiz.gameType)}
              onSelect={onQuizSelect}
            />
          ))}
        </div>
      ) : (
        <div 
          className="text-center py-12 bg-background border border-border rounded-2xl"
          role="status"
          aria-live="polite"
        >
          <div className="text-4xl mb-4" aria-hidden="true">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No quizzes found
          </h3>
          <p className="text-foreground/70">
            Try adjusting your category, game type, or difficulty filters
          </p>
        </div>
      )}
    </section>
  )

  /**
   * Renders the progress statistics section
   * @returns {JSX.Element} Progress stats component
   */
  const renderProgressStats = () => (
    <section 
      className="bg-background border border-border rounded-2xl p-6"
      aria-label="Your progress statistics"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-2xl font-bold text-primary mb-2">
            {totalGamesPlayed}
          </div>
          <div className="text-foreground/70 text-sm">Games Played</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-primary mb-2">
            {totalPoints}
          </div>
          <div className="text-foreground/70 text-sm">Total Points</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-primary mb-2">
            {getFormattedTimePlayed()}
          </div>
          <div className="text-foreground/70 text-sm">Time Played</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-primary mb-2">
            {achievements.length}
          </div>
          <div className="text-foreground/70 text-sm">Achievements</div>
        </div>
      </div>
    </section>
  )

  // ===== MAIN COMPONENT RENDER =====

  return (
    <div className="space-y-12">
      {renderHeader()}
      {renderTabNavigation()}

      {/* Content based on active tab */}
      {activeTab === 'quizzes' ? (
        <div role="tabpanel" id="quizzes-panel" aria-labelledby="quizzes-tab">
          {renderCategorySelection()}
          {renderGameTypeSelection()}
          {renderDifficultySelection()}
          {renderAvailableQuizzes()}
        </div>
      ) : (
        <div role="tabpanel" id="progress-panel" aria-labelledby="progress-tab">
          <ProgressDashboard />
        </div>
      )}

      {renderProgressStats()}
    </div>
  )
}