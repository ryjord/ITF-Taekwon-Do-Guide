import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import achievementsData from '../data/achievements/achievements.json'

/**
 * Global Progress Store
 * 
 * Comprehensive state management for Taekwondo training progress tracking,
 * achievement unlocking, and user performance analytics across all game types.
 * 
 * Features:
 * - Persistent progress tracking across browser sessions
 * - Real-time achievement evaluation and unlocking
 * - Multi-category progress monitoring
 * - Game completion statistics and analytics
 * - Secure condition evaluation with error handling
 * 
 * @version 1.0
 * @persist taekwondo-progress
 */
export const useGlobalProgress = create(
  persist(
    (set, get) => ({
      // ===== STATE DEFINITIONS =====
      
      /** @type {number} Total number of games played across all categories */
      totalGamesPlayed: 0,
      
      /** @type {number} Cumulative points earned from all completed games */
      totalPoints: 0,
      
      /** @type {Object} Games completed count by game type */
      gamesCompleted: {
        mcq: 0,
        wordsearch: 0, 
        translation: 0,
        crossword: 0,
        flashcards: 0,
        matching: 0
      },
      
      /** @type {number} Total time spent playing games (in seconds) */
      timePlayed: 0,
      
      /** @type {Array<string>} Array of unlocked achievement IDs */
      achievements: [],
      
      /** @type {Object} Progress tracking by learning category */
      categoryProgress: {
        terminology: { games: 0, points: 0 },
        patterns: { games: 0, points: 0 },
        techniques: { games: 0, points: 0 },
        history: { games: 0, points: 0 }
      },

      // ===== ACTION METHODS =====

      /**
       * Records game completion and updates progress metrics
       * Automatically evaluates and unlocks new achievements based on updated progress
       * 
       * @param {Object} gameResults - Results from completed game
       * @param {string} gameResults.gameType - Type of game completed
       * @param {string} gameResults.category - Learning category of the game
       * @param {number} gameResults.score - Points earned from the game
       * @param {number} gameResults.timeUsed - Time taken to complete game (seconds)
       * @returns {Object} Object containing new progress state and unlocked achievements
       */
      recordGameCompletion: (gameResults) => {
        const currentState = get()
        
        /**
         * Safely evaluates achievement conditions using Function constructor
         * @param {string} condition - JavaScript condition string to evaluate
         * @param {Object} progress - Current progress state for evaluation
         * @param {Object} gameResults - Game results for condition evaluation
         * @returns {boolean} Whether condition is met
         */
        const evaluateCondition = (condition, progress, gameResults = {}) => {
          try {
            return new Function('progress', 'gameResults', `return ${condition}`)(
              progress, 
              gameResults
            )
          } catch (error) {
            console.error('Error evaluating achievement condition:', error)
            return false
          }
        }

        /**
         * Checks for newly unlocked achievements based on current progress
         * @param {Object} progress - Updated progress state
         * @param {Object} gameResults - Game results for condition evaluation
         * @returns {Array<string>} Array of newly unlocked achievement IDs
         */
        const checkAchievements = (progress, gameResults = {}) => {
          const newAchievements = []
          
          achievementsData.achievements.forEach(achievement => {
            // Skip already unlocked achievements
            if (progress.achievements.includes(achievement.id)) return
            
            let conditionMet = false
            
            // Evaluate condition based on type
            if (achievement.conditionType === 'progress') {
              conditionMet = evaluateCondition(achievement.condition, progress)
            } else if (achievement.conditionType === 'game') {
              conditionMet = evaluateCondition(achievement.condition, progress, gameResults)
            }
            
            // Unlock achievement if condition is met
            if (conditionMet) {
              newAchievements.push(achievement.id)
              console.log(`🎉 Achievement unlocked: ${achievement.name}`)
            }
          })
          
          return newAchievements
        }

        // ===== PROGRESS CALCULATION =====

        /** @type {Object} Updated progress state with new game results */
        const newProgress = {
          totalGamesPlayed: currentState.totalGamesPlayed + 1,
          totalPoints: currentState.totalPoints + (gameResults.score || 0),
          timePlayed: currentState.timePlayed + (gameResults.timeUsed || 0),
          gamesCompleted: {
            ...currentState.gamesCompleted,
            [gameResults.gameType]: (currentState.gamesCompleted[gameResults.gameType] || 0) + 1
          },
          categoryProgress: {
            ...currentState.categoryProgress,
            [gameResults.category]: {
              games: (currentState.categoryProgress[gameResults.category]?.games || 0) + 1,
              points: (currentState.categoryProgress[gameResults.category]?.points || 0) + (gameResults.score || 0)
            }
          },
          achievements: [...currentState.achievements]
        }

        console.log('📊 New progress calculated:', newProgress)

        // ===== ACHIEVEMENT EVALUATION =====

        /** @type {Array<string>} Newly unlocked achievement IDs */
        const newAchievements = checkAchievements(newProgress, gameResults)
        console.log('🏆 Achievements to add:', newAchievements)

        // Add new achievements to progress state
        if (newAchievements.length > 0) {
          newProgress.achievements = [...newProgress.achievements, ...newAchievements]
          console.log('✅ Final progress with achievements:', newProgress)
        }

        // ===== STATE UPDATE =====

        set(newProgress)
        
        return { 
          newProgress, 
          newAchievements 
        }
      },

      /**
       * Resets all progress data to initial state
       * Clears achievements, game history, and category progress
       * 
       * @returns {void}
       */
      resetProgress: () => {
        set({
          totalGamesPlayed: 0,
          totalPoints: 0,
          gamesCompleted: {
            mcq: 0,
            wordsearch: 0,
            translation: 0, 
            crossword: 0,
            flashcards: 0,
            matching: 0
          },
          timePlayed: 0,
          achievements: [],
          categoryProgress: {
            terminology: { games: 0, points: 0 },
            patterns: { games: 0, points: 0 },
            techniques: { games: 0, points: 0 },
            history: { games: 0, points: 0 }
          }
        })
        
        console.log('🔄 Progress reset to initial state')
      }
    }),
    {
      // ===== PERSISTENCE CONFIGURATION =====
      
      name: 'taekwondo-progress',
      version: 1,
    }
  )
)