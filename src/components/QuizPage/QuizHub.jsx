import { useState, useMemo } from 'react'
import { Gamepad2, LineChart, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { QuizCategoryCard } from './QuizCategoryCard'
import { DifficultySelector } from './DifficultySelector'
import { GameTypeSelector } from './GameTypeSelector'
import { QuizCard } from './QuizCard'
import { StatTile } from './StatTile'
import { ProgressDashboard } from '../Progress/ProgressDashboard'
import { useGlobalProgress } from '../../hooks/useGlobalProgess'

import categoriesData from '../../data/quiz/QuizCategories.json'
import mcqData from '../../data/quiz/MCQData.json'
import wordSearchData from '../../data/quiz/WordSearchData.json'
import translationData from '../../data/quiz/TranslationData.json'
import crosswordData from '../../data/quiz/CrosswordData.json'
import flashcardData from '../../data/quiz/FlashCardData.json'
import matchingData from '../../data/quiz/MatchingData.json'

export const QuizHub = ({ onQuizSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [selectedGameType, setSelectedGameType] = useState(null)

  const totalGamesPlayed = useGlobalProgress((state) => state.totalGamesPlayed)
  const totalPoints = useGlobalProgress((state) => state.totalPoints)
  const timePlayed = useGlobalProgress((state) => state.timePlayed)
  const achievements = useGlobalProgress((state) => state.achievements)

  const allQuizzes = useMemo(
    () => [
      ...mcqData.quizzes,
      ...wordSearchData.quizzes,
      ...translationData.quizzes,
      ...crosswordData.quizzes,
      ...flashcardData.quizzes,
      ...matchingData.quizzes,
    ],
    []
  )

  const quizCountByCategory = useMemo(() => {
    return allQuizzes.reduce((counts, quiz) => {
      counts[quiz.category] = (counts[quiz.category] || 0) + 1
      return counts
    }, {})
  }, [allQuizzes])

  const filteredQuizzes = useMemo(
    () =>
      allQuizzes.filter((quiz) => {
        const matchesCategory = !selectedCategory || quiz.category === selectedCategory
        const matchesDifficulty = !selectedDifficulty || quiz.difficulty === selectedDifficulty
        const matchesGameType = !selectedGameType || quiz.gameType === selectedGameType
        return matchesCategory && matchesDifficulty && matchesGameType
      }),
    [allQuizzes, selectedCategory, selectedDifficulty, selectedGameType]
  )

  const hasActiveFilters = selectedCategory || selectedDifficulty || selectedGameType

  const clearFilters = () => {
    setSelectedCategory(null)
    setSelectedDifficulty(null)
    setSelectedGameType(null)
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
  }

  const formattedTimePlayed = `${Math.floor(timePlayed / 60)}m`

  return (
    <div className="space-y-12">
      <div className="animate-fade-in-down text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          ITF <span className="text-primary">Quizzes</span>
        </h1>
        <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-primary sm:w-32" />
        <p className="mx-auto max-w-2xl text-lg text-foreground/70 sm:text-xl">
          Test your knowledge, master the art. Challenge yourself with interactive quizzes.
        </p>
      </div>

      <Tabs defaultValue="quizzes" className="items-center">
        <TabsList>
          <TabsTrigger value="quizzes">
            <Gamepad2 className="size-4" aria-hidden="true" />
            Play Quizzes
          </TabsTrigger>
          <TabsTrigger value="progress">
            <LineChart className="size-4" aria-hidden="true" />
            My Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="w-full space-y-12">
          <section aria-labelledby="category-heading">
            <h2 id="category-heading" className="mb-6 text-center text-2xl font-bold text-foreground">
              Choose a Category
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categoriesData.quizCategories.map((category) => (
                <QuizCategoryCard
                  key={category.id}
                  category={category}
                  quizCount={quizCountByCategory[category.id] || 0}
                  isSelected={selectedCategory === category.id}
                  onClick={() => handleCategorySelect(category.id)}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="game-type-heading">
            <h2 id="game-type-heading" className="mb-6 text-center text-2xl font-bold text-foreground">
              Select Game Type
            </h2>
            <GameTypeSelector
              gameTypes={categoriesData.gameTypes}
              selectedGameType={selectedGameType}
              onGameTypeSelect={setSelectedGameType}
            />
          </section>

          <section aria-labelledby="difficulty-heading">
            <h2 id="difficulty-heading" className="mb-6 text-center text-2xl font-bold text-foreground">
              Select Difficulty
            </h2>
            <DifficultySelector
              difficulties={categoriesData.difficultyLevels}
              selectedDifficulty={selectedDifficulty}
              onDifficultySelect={setSelectedDifficulty}
            />
          </section>

          <section aria-labelledby="quizzes-heading">
            <div className="mb-6 flex items-center justify-between">
              <h2 id="quizzes-heading" className="text-2xl font-bold text-foreground">
                Available Quizzes ({filteredQuizzes.length})
              </h2>
              {hasActiveFilters && (
                <Button variant="link" onClick={clearFilters} className="px-0">
                  Clear All Filters
                </Button>
              )}
            </div>

            {filteredQuizzes.length > 0 ? (
              <div
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                role="list"
                aria-label="Available quizzes"
              >
                {filteredQuizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    gameType={categoriesData.gameTypes.find((g) => g.id === quiz.gameType)}
                    onSelect={onQuizSelect}
                  />
                ))}
              </div>
            ) : (
              <Card role="status" aria-live="polite">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <Search className="mb-4 size-10 text-foreground/40" aria-hidden="true" />
                  <h3 className="mb-2 text-xl font-semibold text-foreground">No quizzes found</h3>
                  <p className="text-foreground/70">
                    Try adjusting your category, game type, or difficulty filters
                  </p>
                </CardContent>
              </Card>
            )}
          </section>
        </TabsContent>

        <TabsContent value="progress" className="w-full">
          <ProgressDashboard />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4" aria-label="Your progress statistics">
        <StatTile value={totalGamesPlayed} label="Games Played" />
        <StatTile value={totalPoints} label="Total Points" />
        <StatTile value={formattedTimePlayed} label="Time Played" />
        <StatTile value={achievements.length} label="Achievements" />
      </div>
    </div>
  )
}
