import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * CrosswordGame Component
 * 
 * A professional crossword puzzle game with proper crossword mechanics,
 * comprehensive progress tracking, and detailed performance analytics.
 */
export const CrosswordGame = ({ quiz, onComplete }) => {
  // ===== STATE MANAGEMENT =====
  const [grid, setGrid] = useState([])
  const [clues, setClues] = useState([])
  const [userInput, setUserInput] = useState([])
  const [selectedCell, setSelectedCell] = useState(null)
  const [direction, setDirection] = useState('across')
  const [solvedWords, setSolvedWords] = useState([])
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit)
  const [gameState, setGameState] = useState('playing')
  const [score, setScore] = useState(0)

  // Use refs to track latest state without dependencies
  const solvedWordsRef = useRef(solvedWords)
  const userInputRef = useRef(userInput)
  const gridRef = useRef(grid)

  // Update refs when state changes
  useEffect(() => {
    solvedWordsRef.current = solvedWords
    userInputRef.current = userInput
    gridRef.current = grid
  }, [solvedWords, userInput, grid])

  // ===== CALCULATED VALUES =====
  const calculatePointsPerWord = useCallback(() => {
    return Math.floor(quiz.points / quiz.grid.words.length)
  }, [quiz.points, quiz.grid.words.length])

  // ===== GAME COMPLETION FUNCTION =====
  const finishGame = useCallback(() => {
    if (gameState === 'finished') return // Prevent multiple calls
    
    setGameState('finished')
    const timeUsed = quiz.timeLimit - timeLeft
    
    const isPerfectScore = solvedWordsRef.current.length === quiz.grid.words.length
    const adjustedScore = isPerfectScore ? quiz.points : score
    
    const completionRate = (solvedWordsRef.current.length / quiz.grid.words.length) * 100
    const timePerWord = timeUsed / Math.max(quiz.grid.words.length, 1)
    
    const standardizedResults = {
      gameType: quiz.gameType,
      category: quiz.category,
      score: adjustedScore,
      timeUsed: timeUsed,
      perfectScore: isPerfectScore,
      totalWords: quiz.grid.words.length,
      solvedWords: solvedWordsRef.current.length,
      completionRate: completionRate,
      timePerWord: timePerWord,
      shuffled: false,
      totalPossiblePoints: quiz.points,
      averageTimePerWord: timePerWord,
      solvedWordsList: solvedWordsRef.current
    }
    
    console.log('Game finished with results:', standardizedResults)
    onComplete(standardizedResults)
  }, [gameState, quiz, timeLeft, score, onComplete])

  // ===== NAVIGATION FUNCTIONS =====
  const moveToNextCell = useCallback(() => {
    if (!selectedCell) return null
    
    const [row, col] = selectedCell
    let newRow = row
    let newCol = col
    
    if (direction === 'across') {
      newCol = col + 1
      while (newCol < quiz.grid.size && gridRef.current[newRow] && gridRef.current[newRow][newCol] && gridRef.current[newRow][newCol].isBlack) {
        newCol++
      }
    } else {
      newRow = row + 1
      while (newRow < quiz.grid.size && gridRef.current[newRow] && gridRef.current[newRow][newCol] && gridRef.current[newRow][newCol].isBlack) {
        newRow++
      }
    }
    
    if (newRow < quiz.grid.size && newCol < quiz.grid.size && gridRef.current[newRow] && gridRef.current[newRow][newCol] && !gridRef.current[newRow][newCol].isBlack) {
      setSelectedCell([newRow, newCol])
      return [newRow, newCol]
    }
    
    return null
  }, [selectedCell, direction, quiz.grid.size])

  const moveToPreviousCell = useCallback(() => {
    if (!selectedCell) return null
    
    const [row, col] = selectedCell
    let newRow = row
    let newCol = col
    
    if (direction === 'across') {
      newCol = col - 1
      while (newCol >= 0 && gridRef.current[newRow] && gridRef.current[newRow][newCol] && gridRef.current[newRow][newCol].isBlack) {
        newCol--
      }
    } else {
      newRow = row - 1
      while (newRow >= 0 && gridRef.current[newRow] && gridRef.current[newRow][newCol] && gridRef.current[newRow][newCol].isBlack) {
        newRow--
      }
    }
    
    if (newRow >= 0 && newCol >= 0 && gridRef.current[newRow] && gridRef.current[newRow][newCol] && !gridRef.current[newRow][newCol].isBlack) {
      setSelectedCell([newRow, newCol])
      return [newRow, newCol]
    }
    
    return null
  }, [selectedCell, direction])

  const navigateWithArrows = useCallback((key) => {
    if (!selectedCell) return
    
    const [row, col] = selectedCell
    let newRow = row
    let newCol = col
    
    switch (key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1)
        while (newRow >= 0 && gridRef.current[newRow] && gridRef.current[newRow][newCol] && gridRef.current[newRow][newCol].isBlack) {
          newRow--
        }
        break
      case 'ArrowDown':
        newRow = Math.min(quiz.grid.size - 1, row + 1)
        while (newRow < quiz.grid.size && gridRef.current[newRow] && gridRef.current[newRow][newCol] && gridRef.current[newRow][newCol].isBlack) {
          newRow++
        }
        break
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1)
        while (newCol >= 0 && gridRef.current[newRow] && gridRef.current[newRow][newCol] && gridRef.current[newRow][newCol].isBlack) {
          newCol--
        }
        break
      case 'ArrowRight':
        newCol = Math.min(quiz.grid.size - 1, col + 1)
        while (newCol < quiz.grid.size && gridRef.current[newRow] && gridRef.current[newRow][newCol] && gridRef.current[newRow][newCol].isBlack) {
          newCol++
        }
        break
    }
    
    if (newRow >= 0 && newRow < quiz.grid.size && newCol >= 0 && newCol < quiz.grid.size && gridRef.current[newRow] && gridRef.current[newRow][newCol] && !gridRef.current[newRow][newCol].isBlack) {
      setSelectedCell([newRow, newCol])
    }
  }, [selectedCell, quiz.grid.size])

  // ===== CROSSWORD GENERATION FUNCTIONS =====
  const createCrosswordGrid = useCallback((wordDefinitions, size) => {
    // Initialize empty grid
    const grid = Array(size).fill().map(() => 
      Array(size).fill().map(() => ({ 
        letter: '', 
        number: null, 
        across: null, 
        down: null,
        isBlack: true
      }))
    )
    
    const clues = []
    let wordNumber = 1

    // Sort words by length (longest first) for better placement
    const sortedWords = [...wordDefinitions].sort((a, b) => b.word.length - a.word.length)

    // Place first word in the center horizontally
    const firstWord = sortedWords[0]
    const firstWordText = firstWord.word.toUpperCase()
    const startRow = Math.floor(size / 2)
    const startCol = Math.floor((size - firstWordText.length) / 2)
    
    // Place first word across
    for (let i = 0; i < firstWordText.length; i++) {
      grid[startRow][startCol + i] = {
        ...grid[startRow][startCol + i],
        letter: firstWordText[i],
        number: i === 0 ? wordNumber : null,
        across: firstWord.id,
        isBlack: false
      }
    }
    
    clues.push({
      id: firstWord.id,
      number: wordNumber,
      word: firstWordText,
      clue: firstWord.clue,
      direction: 'across',
      position: { x: startCol, y: startRow },
      solved: false
    })
    
    wordNumber++

    // Place remaining words by intersecting with existing words
    for (let w = 1; w < sortedWords.length; w++) {
      const wordObj = sortedWords[w]
      const word = wordObj.word.toUpperCase()
      let placed = false
      
      // Try each letter of the word to find intersections
      for (let letterIndex = 0; letterIndex < word.length && !placed; letterIndex++) {
        const letter = word[letterIndex]
        
        // Search grid for matching letters to intersect with
        for (let row = 0; row < size && !placed; row++) {
          for (let col = 0; col < size && !placed; col++) {
            if (grid[row][col].letter === letter && !grid[row][col].isBlack) {
              // Try placing vertically (down) intersecting with horizontal word
              if (!grid[row][col].down && canPlaceWord(grid, word, row - letterIndex, col, 'down', size)) {
                placeWord(grid, word, row - letterIndex, col, 'down', wordObj.id, wordNumber)
                clues.push({
                  id: wordObj.id,
                  number: wordNumber,
                  word: word,
                  clue: wordObj.clue,
                  direction: 'down',
                  position: { x: col, y: row - letterIndex },
                  solved: false
                })
                wordNumber++
                placed = true
                break
              }
              
              // Try placing horizontally (across) intersecting with vertical word  
              if (!grid[row][col].across && canPlaceWord(grid, word, row, col - letterIndex, 'across', size)) {
                placeWord(grid, word, row, col - letterIndex, 'across', wordObj.id, wordNumber)
                clues.push({
                  id: wordObj.id,
                  number: wordNumber,
                  word: word,
                  clue: wordObj.clue,
                  direction: 'across',
                  position: { x: col - letterIndex, y: row },
                  solved: false
                })
                wordNumber++
                placed = true
                break
              }
            }
          }
        }
      }
      
      // If couldn't place by intersecting, try to place anywhere (fallback)
      if (!placed) {
        for (let row = 0; row < size && !placed; row++) {
          for (let col = 0; col < size && !placed; col++) {
            if (canPlaceWord(grid, word, row, col, 'across', size)) {
              placeWord(grid, word, row, col, 'across', wordObj.id, wordNumber)
              clues.push({
                id: wordObj.id,
                number: wordNumber,
                word: word,
                clue: wordObj.clue,
                direction: 'across',
                position: { x: col, y: row },
                solved: false
              })
              wordNumber++
              placed = true
            } else if (canPlaceWord(grid, word, row, col, 'down', size)) {
              placeWord(grid, word, row, col, 'down', wordObj.id, wordNumber)
              clues.push({
                id: wordObj.id,
                number: wordNumber,
                word: word,
                clue: wordObj.clue,
                direction: 'down',
                position: { x: col, y: row },
                solved: false
              })
              wordNumber++
              placed = true
            }
          }
        }
      }
    }

    return { grid, clues }
  }, [])

  const canPlaceWord = useCallback((grid, word, startRow, startCol, direction, size) => {
    if (startRow < 0 || startCol < 0) return false
    
    if (direction === 'across') {
      if (startCol + word.length > size) return false
      
      // Check if word fits without conflicts
      for (let i = 0; i < word.length; i++) {
        const cell = grid[startRow][startCol + i]
        
        // If cell is not empty and doesn't match the required letter
        if (!cell.isBlack && cell.letter !== word[i]) return false
        
        // Check adjacent cells for isolation rules
        if (cell.isBlack) {
          // Would create an isolated word
          if ((startRow > 0 && !grid[startRow - 1][startCol + i].isBlack) ||
              (startRow < size - 1 && !grid[startRow + 1][startCol + i].isBlack)) {
            return false
          }
        }
      }
      
      // Check if there's space before and after
      if (startCol > 0 && !grid[startRow][startCol - 1].isBlack) return false
      if (startCol + word.length < size && !grid[startRow][startCol + word.length].isBlack) return false
      
    } else { // down
      if (startRow + word.length > size) return false
      
      for (let i = 0; i < word.length; i++) {
        const cell = grid[startRow + i][startCol]
        
        if (!cell.isBlack && cell.letter !== word[i]) return false
        
        if (cell.isBlack) {
          if ((startCol > 0 && !grid[startRow + i][startCol - 1].isBlack) ||
              (startCol < size - 1 && !grid[startRow + i][startCol + 1].isBlack)) {
            return false
          }
        }
      }
      
      if (startRow > 0 && !grid[startRow - 1][startCol].isBlack) return false
      if (startRow + word.length < size && !grid[startRow + word.length][startCol].isBlack) return false
    }
    
    return true
  }, [])

  const placeWord = useCallback((grid, word, startRow, startCol, direction, wordId, wordNumber) => {
    if (direction === 'across') {
      for (let i = 0; i < word.length; i++) {
        const currentCell = grid[startRow][startCol + i]
        grid[startRow][startCol + i] = {
          ...currentCell,
          letter: word[i],
          number: currentCell.number || (i === 0 ? wordNumber : null),
          across: wordId,
          isBlack: false
        }
      }
    } else { // down
      for (let i = 0; i < word.length; i++) {
        const currentCell = grid[startRow + i][startCol]
        grid[startRow + i][startCol] = {
          ...currentCell,
          letter: word[i],
          number: currentCell.number || (i === 0 ? wordNumber : null),
          down: wordId,
          isBlack: false
        }
      }
    }
  }, [])

  // ===== GAME LOGIC FUNCTIONS =====
  const getWordCells = useCallback((clue) => {
    const cells = []
    const { position, direction, word } = clue
    
    if (direction === 'across') {
      for (let i = 0; i < word.length; i++) {
        cells.push([position.y, position.x + i])
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        cells.push([position.y + i, position.x])
      }
    }
    
    return cells
  }, [])

  const isWordCompleted = useCallback((clue) => {
    const cells = getWordCells(clue)
    return cells.every(([row, col]) => 
      userInputRef.current[row] && userInputRef.current[row][col] === gridRef.current[row][col].letter
    )
  }, [getWordCells])

  // FIXED: Improved checkAllWords function that uses refs for latest state
  const checkAllWords = useCallback(() => {
    const newlySolved = []
    const currentSolvedWords = solvedWordsRef.current
    const currentClues = clues // clues don't change after initialization
    
    currentClues.forEach(clue => {
      if (!currentSolvedWords.includes(clue.id) && isWordCompleted(clue)) {
        newlySolved.push(clue.id)
      }
    })
    
    if (newlySolved.length > 0) {
      const pointsPerWord = calculatePointsPerWord()
      
      // Update all state synchronously
      setSolvedWords(prev => {
        const updatedSolvedWords = [...prev, ...newlySolved]
        
        // Update score
        setScore(prevScore => prevScore + (pointsPerWord * newlySolved.length))
        
        // Update clues
        setClues(prevClues => prevClues.map(clue => 
          newlySolved.includes(clue.id) ? { ...clue, solved: true } : clue
        ))
        
        return updatedSolvedWords
      })
    }
  }, [clues, isWordCompleted, calculatePointsPerWord])

  // FIXED: Improved handleKeyDown that checks words immediately after state update
  const handleKeyDown = useCallback((event) => {
    if (!selectedCell) return
    
    const [row, col] = selectedCell
    const key = event.key.toUpperCase()
    
    if (/^[A-Z]$/.test(key)) {
      event.preventDefault()
      
      // Create new input with the updated letter
      const newInput = userInput.map(r => [...r])
      newInput[row][col] = key
      
      // Update state immediately
      setUserInput(newInput)
      
      // Move to next cell
      moveToNextCell()
      
      // Check for completed words immediately using the latest ref values
      setTimeout(() => {
        checkAllWords()
      }, 0)
    }
    else if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      const newInput = userInput.map(r => [...r])
      
      if (userInput[row][col]) {
        newInput[row][col] = ''
        setUserInput(newInput)
        
        // Check words after clearing a cell
        setTimeout(() => {
          checkAllWords()
        }, 0)
      } else {
        const prevCell = moveToPreviousCell()
        if (prevCell) {
          newInput[prevCell[0]][prevCell[1]] = ''
          setUserInput(newInput)
          
          // Check words after clearing previous cell
          setTimeout(() => {
            checkAllWords()
          }, 0)
        }
      }
    }
    else if (event.key === 'Tab') {
      event.preventDefault()
      setDirection(prev => prev === 'across' ? 'down' : 'across')
    }
    else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault()
      navigateWithArrows(event.key)
    }
  }, [selectedCell, userInput, moveToNextCell, moveToPreviousCell, navigateWithArrows, checkAllWords])

  const getCurrentWord = useCallback(() => {
    if (!selectedCell) return null
    
    const [row, col] = selectedCell
    const cell = grid[row][col]
    
    if (direction === 'across' && cell.across) {
      return clues.find(clue => clue.id === cell.across && clue.direction === 'across')
    } else if (direction === 'down' && cell.down) {
      return clues.find(clue => clue.id === cell.down && clue.direction === 'down')
    }
    
    return null
  }, [selectedCell, grid, direction, clues])

  // ===== EFFECTS & INITIALIZATION =====
  useEffect(() => {
    const initializeGame = () => {
      const { grid: newGrid, clues: newClues } = createCrosswordGrid(quiz.grid.words, quiz.grid.size)
      
      const emptyInput = Array(quiz.grid.size).fill().map(() => Array(quiz.grid.size).fill(''))
      
      setGrid(newGrid)
      setClues(newClues)
      setUserInput(emptyInput)
      
      // Select first available cell
      for (let row = 0; row < quiz.grid.size; row++) {
        for (let col = 0; col < quiz.grid.size; col++) {
          if (!newGrid[row][col].isBlack) {
            setSelectedCell([row, col])
            return
          }
        }
      }
    }

    initializeGame()
  }, [quiz.grid.words, quiz.grid.size, createCrosswordGrid])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && gameState === 'playing') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishGame()
    }
  }, [timeLeft, gameState, finishGame])

  // FIXED: Game completion effect that uses ref for latest solvedWords
  useEffect(() => {
    if (solvedWordsRef.current.length === quiz.grid.words.length && quiz.grid.words.length > 0 && gameState === 'playing') {
      console.log('All words solved! Finishing game...')
      finishGame()
    }
  }, [solvedWords, quiz.grid.words.length, gameState, finishGame])

  // ===== RENDER METHODS =====
  const renderGridCell = useCallback((cell, rowIndex, colIndex) => {
    if (cell.isBlack) {
      return (
        <div
          key={`${rowIndex}-${colIndex}`}
          className="bg-gray-800 border border-gray-700 aspect-square"
          aria-label="Black cell"
        />
      )
    }

    const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
    const inCurrentWord = getCurrentWord() && getWordCells(getCurrentWord()).some(([r, c]) => r === rowIndex && c === colIndex)
    const isCorrect = userInput[rowIndex] && userInput[rowIndex][colIndex] === cell.letter
    const hasInput = userInput[rowIndex] && userInput[rowIndex][colIndex]
    
    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={`
          relative border border-gray-300 flex items-center justify-center
          transition-all duration-200 cursor-pointer select-none
          bg-white
          ${isSelected ? 'ring-2 ring-blue-500 ring-inset z-10' : ''}
          ${inCurrentWord ? 'bg-blue-50' : ''}
          ${isCorrect ? 'bg-green-100' : hasInput ? 'bg-red-100' : ''}
          aspect-square
        `}
        onClick={() => setSelectedCell([rowIndex, colIndex])}
        role="button"
        aria-label={`Cell ${rowIndex}-${colIndex}: ${hasInput ? `Letter ${userInput[rowIndex][colIndex]}` : 'Empty'}${cell.number ? `, word number ${cell.number}` : ''}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {cell.number && (
          <div className="absolute top-0 left-0 text-xs p-1 text-gray-600">
            {cell.number}
          </div>
        )}
        
        <div className={`text-lg font-bold ${
          isCorrect ? 'text-green-800' : 
          hasInput ? 'text-red-800' : 
          'text-gray-800'
        }`}>
          {userInput[rowIndex]?.[colIndex] || ''}
        </div>
      </div>
    )
  }, [selectedCell, getCurrentWord, getWordCells, userInput, handleKeyDown])

  const renderClueListItem = useCallback((clue) => (
    <div
      key={clue.id}
      className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
        clue.solved
          ? 'bg-green-100 border-green-300 text-green-800 line-through'
          : getCurrentWord()?.id === clue.id
          ? 'bg-blue-100 border-blue-300 text-blue-800'
          : 'bg-gray-50 border-gray-200 text-gray-800'
      }`}
      onClick={() => {
        setSelectedCell([clue.position.y, clue.position.x])
        setDirection(clue.direction)
      }}
      role="button"
      aria-label={`Clue ${clue.number}: ${clue.clue}. ${clue.solved ? 'Solved' : 'Unsolved'}`}
      tabIndex={0}
    >
      <div className="flex items-start gap-2">
        <span className="font-semibold text-sm flex-shrink-0">{clue.number}.</span>
        <div className="flex-1">
          <div className="text-sm">{clue.clue}</div>
          <div className="text-xs opacity-75 mt-1">
            {clue.direction === 'across' ? '→' : '↓'} {clue.word.length} letters
          </div>
        </div>
        {clue.solved && (
          <div className="text-green-600 text-lg flex-shrink-0">✓</div>
        )}
      </div>
    </div>
  ), [getCurrentWord])

  const renderCompletionScreen = () => {
    const isPerfectScore = solvedWords.length === quiz.grid.words.length
    const finalScore = isPerfectScore ? quiz.points : score
    const completionRate = (solvedWords.length / quiz.grid.words.length) * 100
    
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">🧩</div>
        <h2 className="text-3xl font-bold text-foreground">Crossword Complete!</h2>
        
        {isPerfectScore && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-full inline-block">
            ⭐ Perfect Puzzle! ⭐
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-primary/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">{finalScore}</div>
            <div className="text-sm text-foreground/70">Points</div>
          </div>
          <div className="bg-primary/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">{solvedWords.length}/{quiz.grid.words.length}</div>
            <div className="text-sm text-foreground/70">Solved</div>
          </div>
          <div className="bg-primary/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">{completionRate.toFixed(1)}%</div>
            <div className="text-sm text-foreground/70">Completion</div>
          </div>
          <div className="bg-primary/10 rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">
              {Math.floor((quiz.timeLimit - timeLeft) / 60)}:{(quiz.timeLimit - timeLeft) % 60 < 10 ? '0' : ''}{(quiz.timeLimit - timeLeft) % 60}
            </div>
            <div className="text-sm text-foreground/70">Time</div>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'finished') {
    return renderCompletionScreen()
  }

  if (grid.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-lg text-foreground/60">Setting up crossword puzzle...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="text-sm text-foreground/60">
          Solved {solvedWords.length} of {quiz.grid.words.length} words
        </div>
        <div className="text-sm font-semibold text-primary">
          Time: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(solvedWords.length / quiz.grid.words.length) * 100}%` }}
          role="progressbar"
          aria-valuenow={solvedWords.length}
          aria-valuemin={0}
          aria-valuemax={quiz.grid.words.length}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div 
            className="bg-card rounded-xl p-4 border select-none"
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${quiz.grid.size}, minmax(0, 1fr))`,
              gap: '1px',
              background: '#e5e7eb'
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => renderGridCell(cell, rowIndex, colIndex))
            )}
          </div>
          
          {selectedCell && getCurrentWord() && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                <strong>Current Word:</strong> {getCurrentWord()?.clue}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                Direction: {direction} • Press Tab to switch direction
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-80">
          <div className="bg-card rounded-xl p-4 border h-full">
            <h3 className="font-bold text-lg text-foreground mb-4">Clues</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-2">Across →</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {clues.filter(clue => clue.direction === 'across').map(renderClueListItem)}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Down ↓</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {clues.filter(clue => clue.direction === 'down').map(renderClueListItem)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-foreground/60 text-sm">
        Click cells to select, type letters to fill. Use arrow keys to navigate, Tab to switch direction.
      </div>

      <div className="text-center">
        <div className="inline-block bg-primary/10 rounded-full px-4 py-2">
          <span className="text-sm text-foreground/60 mr-2">Solved:</span>
          <span className="font-bold text-primary">{solvedWords.length}</span>
          <span className="text-sm text-foreground/60 mx-2">/</span>
          <span className="text-sm text-foreground/60">{quiz.grid.words.length}</span>
        </div>
      </div>
    </div>
  )
}