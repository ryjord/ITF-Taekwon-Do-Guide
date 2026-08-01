import { useState, useEffect, useCallback } from 'react'

/**
 * WordSearchGame Component
 * 
 * A professional word search game with dynamic grid generation,
 * comprehensive progress tracking, and detailed performance analytics.
 * 
 * Features:
 * - Dynamic grid generation with word placement in multiple directions
 * - Drag-to-select word discovery with visual feedback
 * - Progress tracking and scoring
 * - Time-based challenge with visual progress
 * 
 * @param {Object} quiz - Quiz configuration object
 * @param {Function} onComplete - Callback when game completes with standardized results
 * @returns {JSX.Element} Word search game interface
 */
export const WordSearchGame = ({ quiz, onComplete }) => {
  // ===== STATE MANAGEMENT =====
  
  /** @type {[Array, Function]} 2D array representing the word search grid */
  const [grid, setGrid] = useState([])
  
  /** @type {[Array, Function]} Array of found word strings */
  const [foundWords, setFoundWords] = useState([])
  
  /** @type {[Array, Function]} Array of cell positions for found words */
  const [foundWordPositions, setFoundWordPositions] = useState([])
  
  /** @type {[Array, Function]} Array of currently selected cell positions */
  const [selectedCells, setSelectedCells] = useState([])
  
  /** @type {[boolean, Function]} Whether user is currently selecting cells */
  const [isSelecting, setIsSelecting] = useState(false)
  
  /** @type {[Array|null, Function]} Starting cell position for selection */
  const [startCell, setStartCell] = useState(null)
  
  /** @type {[number, Function]} Remaining time in seconds */
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit)
  
  /** @type {[string, Function]} Current game state: 'playing' | 'finished' */
  const [gameState, setGameState] = useState('playing')
  
  /** @type {[Object, Function]} Object tracking found status for each word */
  const [wordStatus, setWordStatus] = useState({})

  // ===== CALCULATED VALUES =====

  /**
   * Calculates points per word ensuring perfect score equals total available points
   * @returns {number} Points awarded for each found word
   */
  const calculatePointsPerWord = useCallback(() => {
    return Math.floor(quiz.points / quiz.grid.words.length)
  }, [quiz.points, quiz.grid.words.length])

  // ===== EFFECTS & INITIALIZATION =====

  /**
   * Initialize game by generating word search grid on component mount
   */
  useEffect(() => {
    generateGrid()
  }, [quiz.grid])

  /**
   * Game timer effect - counts down remaining time
   * Automatically ends game when time reaches zero
   */
  useEffect(() => {
    if (timeLeft > 0 && gameState === 'playing') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishGame()
    }
  }, [timeLeft, gameState])

  /**
   * Check for game completion when found words change
   * Automatically finishes game when all words are found
   */
  useEffect(() => {
    if (foundWords.length === quiz.grid.words.length && quiz.grid.words.length > 0) {
      setTimeout(() => finishGame(), 500)
    }
  }, [foundWords, quiz.grid.words.length])

  // ===== GAME LOGIC =====

  /**
   * Generates the word search grid with placed words and random filler letters
   */
  const generateGrid = useCallback(() => {
    const size = quiz.grid.size
    const words = quiz.grid.words.map(w => w.word.toUpperCase())
    
    // Create empty grid
    const emptyGrid = Array(size).fill().map(() => Array(size).fill(''))
    
    // Place words in grid
    const newGrid = placeWordsInGrid([...emptyGrid], words, size)
    
    // Fill empty spaces with random letters
    const filledGrid = fillEmptySpaces(newGrid, size)
    
    setGrid(filledGrid)
    
    // Initialize word status tracking
    const initialWordStatus = {}
    words.forEach(word => {
      initialWordStatus[word] = false
    })
    setWordStatus(initialWordStatus)
  }, [quiz.grid.size, quiz.grid.words])

  /**
   * Places words into the grid in random directions
   * @param {Array} grid - The grid array to place words into
   * @param {Array} words - Array of words to place
   * @param {number} size - Grid size
   * @returns {Array} Grid with words placed
   */
  const placeWordsInGrid = useCallback((grid, words, size) => {
    const directions = [
      [0, 1],   // right
      [1, 0],   // down
      [1, 1],   // diagonal down-right
      [1, -1]   // diagonal down-left
    ]

    words.forEach(word => {
      let placed = false
      let attempts = 0
      
      // Try to place word with random positioning
      while (!placed && attempts < 100) {
        attempts++
        const direction = directions[Math.floor(Math.random() * directions.length)]
        const row = Math.floor(Math.random() * size)
        const col = Math.floor(Math.random() * size)
        
        if (canPlaceWord(grid, word, row, col, direction, size)) {
          placeWord(grid, word, row, col, direction)
          placed = true
        }
      }
    })
    
    return grid
  }, [])

  /**
   * Checks if a word can be placed at the given position and direction
   * @param {Array} grid - The grid array
   * @param {string} word - Word to place
   * @param {number} row - Starting row
   * @param {number} col - Starting column
   * @param {Array} direction - Direction vector [dr, dc]
   * @param {number} size - Grid size
   * @returns {boolean} Whether word can be placed
   */
  const canPlaceWord = useCallback((grid, word, row, col, direction, size) => {
    const [dr, dc] = direction
    
    // Check if word fits within grid boundaries
    const endRow = row + dr * (word.length - 1)
    const endCol = col + dc * (word.length - 1)
    
    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
      return false
    }
    
    // Check if cells are available or have matching letters
    for (let i = 0; i < word.length; i++) {
      const currentRow = row + dr * i
      const currentCol = col + dc * i
      const cell = grid[currentRow][currentCol]
      
      if (cell !== '' && cell !== word[i]) {
        return false
      }
    }
    
    return true
  }, [])

  /**
   * Places a word into the grid at the specified position and direction
   * @param {Array} grid - The grid array
   * @param {string} word - Word to place
   * @param {number} row - Starting row
   * @param {number} col - Starting column
   * @param {Array} direction - Direction vector [dr, dc]
   */
  const placeWord = useCallback((grid, word, row, col, direction) => {
    const [dr, dc] = direction
    
    for (let i = 0; i < word.length; i++) {
      const currentRow = row + dr * i
      const currentCol = col + dc * i
      grid[currentRow][currentCol] = word[i]
    }
  }, [])

  /**
   * Fills empty grid spaces with random letters
   * @param {Array} grid - The grid array
   * @param {number} size - Grid size
   * @returns {Array} Completely filled grid
   */
  const fillEmptySpaces = useCallback((grid, size) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === '') {
          grid[row][col] = letters[Math.floor(Math.random() * letters.length)]
        }
      }
    }
    
    return grid
  }, [])

  /**
   * Handles mouse down event for starting word selection
   * @param {number} row - Row index of clicked cell
   * @param {number} col - Column index of clicked cell
   */
  const handleCellMouseDown = useCallback((row, col) => {
    setIsSelecting(true)
    setStartCell([row, col])
    setSelectedCells([[row, col]])
  }, [])

  /**
   * Handles mouse enter event during word selection
   * @param {number} row - Row index of entered cell
   * @param {number} col - Column index of entered cell
   */
  const handleCellMouseEnter = useCallback((row, col) => {
    if (isSelecting && startCell) {
      const [startRow, startCol] = startCell
      const newSelection = getCellsInDirection(startRow, startCol, row, col)
      setSelectedCells(newSelection)
    }
  }, [isSelecting, startCell])

  /**
   * Handles mouse up event to complete word selection
   */
  const handleCellMouseUp = useCallback(() => {
    if (selectedCells.length > 0) {
      checkSelectedWord()
    }
    setIsSelecting(false)
    setStartCell(null)
  }, [selectedCells])

  /**
   * Calculates cells between start and current position in a straight line
   * @param {number} startRow - Starting row
   * @param {number} startCol - Starting column
   * @param {number} currentRow - Current row
   * @param {number} currentCol - Current column
   * @returns {Array} Array of cell positions in the line
   */
  const getCellsInDirection = useCallback((startRow, startCol, currentRow, currentCol) => {
    const rowDiff = currentRow - startRow
    const colDiff = currentCol - startCol
    
    // Determine the primary direction
    let rowStep = 0
    let colStep = 0
    
    if (Math.abs(rowDiff) > Math.abs(colDiff)) {
      // Vertical movement
      rowStep = rowDiff > 0 ? 1 : -1
    } else if (Math.abs(colDiff) > Math.abs(rowDiff)) {
      // Horizontal movement  
      colStep = colDiff > 0 ? 1 : -1
    } else if (rowDiff !== 0 && colDiff !== 0) {
      // Diagonal movement
      rowStep = rowDiff > 0 ? 1 : -1
      colStep = colDiff > 0 ? 1 : -1
    } else {
      // Single cell
      return [[startRow, startCol]]
    }
    
    // Calculate cells in the determined direction
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))
    const cells = []
    
    for (let i = 0; i <= steps; i++) {
      const row = startRow + i * rowStep
      const col = startCol + i * colStep
      
      // Only add cells that are within grid bounds
      if (row >= 0 && row < quiz.grid.size && col >= 0 && col < quiz.grid.size) {
        cells.push([row, col])
      } else {
        // Stop if we hit the grid boundary
        break
      }
    }
    
    return cells
  }, [quiz.grid.size])

  /**
   * Checks if selected cells form a valid word from the word list
   */
  const checkSelectedWord = useCallback(() => {
    if (selectedCells.length < 2) {
      setSelectedCells([])
      return
    }

    const selectedWord = selectedCells.map(([row, col]) => grid[row][col]).join('')
    const reversedWord = selectedWord.split('').reverse().join('')
    
    // Check if selected word matches any target word
    const targetWords = quiz.grid.words.map(w => w.word.toUpperCase())
    
    let foundWord = null
    let isReversed = false
    
    if (targetWords.includes(selectedWord)) {
      foundWord = selectedWord
    } else if (targetWords.includes(reversedWord)) {
      foundWord = reversedWord
      isReversed = true
    }
    
    if (foundWord && !foundWords.includes(foundWord)) {
      const pointsPerWord = calculatePointsPerWord()
      const newFoundWords = [...foundWords, foundWord]
      setFoundWords(newFoundWords)
      setWordStatus(prev => ({ ...prev, [foundWord]: true }))
      
      // Store the positions of the found word for permanent highlighting
      const wordPositions = isReversed ? [...selectedCells].reverse() : selectedCells
      setFoundWordPositions(prev => [...prev, ...wordPositions])
      
      // Clear selection immediately after finding a word
      setSelectedCells([])
    } else {
      // Clear selection if word wasn't found
      setSelectedCells([])
    }
  }, [selectedCells, grid, quiz.grid.words, foundWords, calculatePointsPerWord])

  /**
   * Checks if a cell is part of a found word
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} Whether cell is in a found word
   */
  const isCellInFoundWord = useCallback((row, col) => {
    return foundWordPositions.some(([r, c]) => r === row && c === col)
  }, [foundWordPositions])

  /**
   * Checks if a word has been found
   * @param {string} word - Word to check
   * @returns {boolean} Whether word has been found
   */
  const isWordFound = useCallback((word) => {
    return wordStatus[word.toUpperCase()] || false
  }, [wordStatus])

  /**
   * Checks if a cell is currently selected
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} Whether cell is selected
   */
  const isCellSelected = useCallback((row, col) => {
    return selectedCells.some(([r, c]) => r === row && c === col)
  }, [selectedCells])

  /**
   * Finalizes game results and triggers completion callback
   * Ensures perfect score calculation and provides comprehensive analytics
   * @param {number} finalScore - Final game score
   * @param {number} finalFoundCount - Final count of found words
   */
  const finishGame = useCallback((finalScore = Math.floor((foundWords.length / quiz.grid.words.length) * quiz.points), finalFoundCount = foundWords.length) => {
    setGameState('finished')
    const timeUsed = quiz.timeLimit - timeLeft
    
    // Ensure perfect score equals total available points
    const isPerfectScore = finalFoundCount === quiz.grid.words.length
    const adjustedScore = isPerfectScore ? quiz.points : finalScore
    
    // Calculate accuracy and performance metrics
    const completionRate = (finalFoundCount / quiz.grid.words.length) * 100
    const timePerWord = timeUsed / quiz.grid.words.length
    
    // Standardized results object for progress tracking system
    const standardizedResults = {
      // Core game identification
      gameType: quiz.gameType,
      category: quiz.category,
      
      // Performance metrics
      score: adjustedScore,
      timeUsed: timeUsed,
      perfectScore: isPerfectScore,
      
      // Word-specific analytics
      totalWords: quiz.grid.words.length,
      foundWords: finalFoundCount,
      
      // Advanced metrics for progress system
      completionRate: completionRate,
      timePerWord: timePerWord,
      
      // Additional context for achievements
      shuffled: true, // Indicates grid was randomly generated
      totalPossiblePoints: quiz.points,
      averageTimePerWord: timePerWord,
      
      // Detailed results for review
      foundWordsList: foundWords
    }
    
    // Trigger completion callback with standardized data
    onComplete(standardizedResults)
  }, [foundWords, quiz, timeLeft, onComplete])

  // ===== RENDER METHODS =====

  /**
   * Renders individual grid cell component
   * @param {string} cell - Cell letter
   * @param {number} rowIndex - Row index
   * @param {number} colIndex - Column index
   * @returns {JSX.Element} Grid cell component
   */
  const renderGridCell = useCallback((cell, rowIndex, colIndex) => (
    <div
      key={`${rowIndex}-${colIndex}`}
      className={`
        flex items-center justify-center font-bold text-lg border-2 rounded
        transition-all duration-200 cursor-pointer select-none
        ${isCellSelected(rowIndex, colIndex)
          ? 'bg-primary text-white border-primary shadow-md transform scale-105'
          : isCellInFoundWord(rowIndex, colIndex)
          ? 'bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600 shadow-md'
          : 'bg-background border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 text-foreground'
        }
      `}
      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
      onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
      role="button"
      aria-label={`Cell ${rowIndex}-${colIndex}: ${cell}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCellMouseDown(rowIndex, colIndex)}
    >
      {cell}
    </div>
  ), [isCellSelected, isCellInFoundWord, handleCellMouseDown, handleCellMouseEnter])

  /**
   * Renders word list item component
   * @param {Object} wordObj - Word object with word and clue
   * @param {number} index - Word index
   * @returns {JSX.Element} Word list item component
   */
  const renderWordListItem = useCallback((wordObj, index) => (
    <div
      key={index}
      className={`p-3 rounded-lg border-2 transition-colors ${
        isWordFound(wordObj.word)
          ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 line-through'
          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
      }`}
    >
      <div className="font-semibold">{wordObj.word}</div>
      <div className="text-sm opacity-75">{wordObj.clue}</div>
    </div>
  ), [isWordFound])

  /**
   * Renders game completion screen with comprehensive statistics
   * @returns {JSX.Element} Completion screen component
   */
  const renderCompletionScreen = () => {
    const isPerfectScore = foundWords.length === quiz.grid.words.length
    const finalScore = isPerfectScore ? quiz.points : Math.floor((foundWords.length / quiz.grid.words.length) * quiz.points)
    const completionRate = (foundWords.length / quiz.grid.words.length) * 100
    
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-3xl font-bold text-foreground">Word Search Complete!</h2>
        
        {/* Perfect Score Celebration */}
        {isPerfectScore && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-full inline-block">
            ⭐ All Words Found! ⭐
          </div>
        )}
        
        {/* Performance Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <StatBox value={finalScore} label="Points" />
          <StatBox 
            value={`${foundWords.length}/${quiz.grid.words.length}`} 
            label="Found" 
          />
          <StatBox 
            value={`${completionRate.toFixed(1)}%`} 
            label="Completion" 
          />
          <StatBox 
            value={`${Math.floor((quiz.timeLimit - timeLeft) / 60)}:${(quiz.timeLimit - timeLeft) % 60 < 10 ? '0' : ''}${(quiz.timeLimit - timeLeft) % 60}`}
            label="Time" 
          />
        </div>

        {/* Word List Summary */}
        <div className="max-w-2xl mx-auto bg-card rounded-xl p-6 border">
          <h3 className="text-xl font-bold text-foreground mb-4">Words to Find</h3>
          <div className="grid grid-cols-2 gap-3">
            {quiz.grid.words.map((wordObj, index) => renderWordListItem(wordObj, index))}
          </div>
        </div>
      </div>
    )
  }

  /**
   * Renders individual statistic box for completion screen
   * @param {string|number} value - The statistic value to display
   * @param {string} label - The label for the statistic
   * @returns {JSX.Element} Statistic box component
   */
  const StatBox = ({ value, label }) => (
    <div className="bg-primary/10 rounded-xl p-4">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-foreground/70">{label}</div>
    </div>
  )

  // ===== MAIN COMPONENT RENDER =====

  // Show completion screen if game is finished
  if (gameState === 'finished') {
    return renderCompletionScreen()
  }

  // Show loading state if grid hasn't been generated yet
  if (grid.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-lg text-foreground/60">Generating word search...</div>
      </div>
    )
  }

  // Render main game interface
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Game Header with Progress Info */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-foreground/60">
          Found {foundWords.length} of {quiz.grid.words.length} words
        </div>
        <div className="text-sm font-semibold text-primary">
          Time: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(foundWords.length / quiz.grid.words.length) * 100}%` }}
          role="progressbar"
          aria-valuenow={foundWords.length}
          aria-valuemin={0}
          aria-valuemax={quiz.grid.words.length}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Word Search Grid */}
        <div className="flex-1">
          <div 
            className="grid gap-1 bg-card rounded-xl p-4 border select-none"
            style={{ 
              gridTemplateColumns: `repeat(${quiz.grid.size}, minmax(0, 1fr))`,
              aspectRatio: '1/1'
            }}
            onMouseLeave={() => {
              if (isSelecting) {
                handleCellMouseUp()
              }
            }}
            onMouseUp={handleCellMouseUp}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => renderGridCell(cell, rowIndex, colIndex))
            )}
          </div>
        </div>

        {/* Word List */}
        <div className="lg:w-64">
          <div className="bg-card rounded-xl p-4 border h-full">
            <h3 className="font-bold text-lg text-foreground mb-4">Words to Find</h3>
            <div className="space-y-2">
              {quiz.grid.words.map((wordObj, index) => renderWordListItem(wordObj, index))}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-foreground/60 text-sm">
        Click and drag to select words. Words can be horizontal, vertical, or diagonal.
      </div>

      {/* Score Display */}
      <div className="text-center">
        <div className="inline-block bg-primary/10 rounded-full px-4 py-2">
          <span className="text-sm text-foreground/60 mr-2">Found:</span>
          <span className="font-bold text-primary">{foundWords.length}</span>
          <span className="text-sm text-foreground/60 mx-2">/</span>
          <span className="text-sm text-foreground/60">{quiz.grid.words.length}</span>
        </div>
      </div>
    </div>
  )
}