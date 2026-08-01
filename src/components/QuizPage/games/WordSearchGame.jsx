import { useState, useEffect, useCallback } from 'react'
import { Sparkles } from 'lucide-react'

import { cn, formatTime } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

import { StatTile } from '../StatTile'
import { GAME_TYPE_ICONS } from '../quizIcons'
import { useGameTimer } from '../../../hooks/useGameTimer'

const SearchIcon = GAME_TYPE_ICONS.wordsearch

const DIRECTIONS = [
  [0, 1], // right
  [1, 0], // down
  [1, 1], // diagonal down-right
  [1, -1], // diagonal down-left
]

const canPlaceWord = (grid, word, row, col, [dr, dc], size) => {
  const endRow = row + dr * (word.length - 1)
  const endCol = col + dc * (word.length - 1)
  if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) return false

  for (let i = 0; i < word.length; i++) {
    const cell = grid[row + dr * i][col + dc * i]
    if (cell !== '' && cell !== word[i]) return false
  }
  return true
}

const placeWord = (grid, word, row, col, [dr, dc]) => {
  for (let i = 0; i < word.length; i++) {
    grid[row + dr * i][col + dc * i] = word[i]
  }
}

const generateGrid = (gridConfig) => {
  const { size } = gridConfig
  const words = gridConfig.words.map((w) => w.word.toUpperCase())
  const grid = Array(size)
    .fill()
    .map(() => Array(size).fill(''))

  words.forEach((word) => {
    let placed = false
    let attempts = 0
    while (!placed && attempts < 100) {
      attempts++
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)
      if (canPlaceWord(grid, word, row, col, direction, size)) {
        placeWord(grid, word, row, col, direction)
        placed = true
      }
    }
  })

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === '') {
        grid[row][col] = letters[Math.floor(Math.random() * letters.length)]
      }
    }
  }

  return grid
}

export const WordSearchGame = ({ quiz, onComplete }) => {
  const [grid] = useState(() => generateGrid(quiz.grid))
  const [foundWords, setFoundWords] = useState([])
  const [foundWordPositions, setFoundWordPositions] = useState([])
  const [selectedCells, setSelectedCells] = useState([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState(null)
  const [gameState, setGameState] = useState('playing')
  const [wordStatus, setWordStatus] = useState(() =>
    Object.fromEntries(quiz.grid.words.map((w) => [w.word.toUpperCase(), false]))
  )

  const finishGame = useCallback(
    (finalScore, finalFoundCount, timeUsed) => {
      setGameState('finished')

      const isPerfectScore = finalFoundCount === quiz.grid.words.length
      const adjustedScore = isPerfectScore ? quiz.points : finalScore
      const completionRate = (finalFoundCount / quiz.grid.words.length) * 100
      const timePerWord = timeUsed / quiz.grid.words.length

      onComplete({
        gameType: quiz.gameType,
        category: quiz.category,
        score: adjustedScore,
        timeUsed,
        perfectScore: isPerfectScore,
        totalWords: quiz.grid.words.length,
        foundWords: finalFoundCount,
        completionRate,
        timePerWord,
        shuffled: true,
        totalPossiblePoints: quiz.points,
        averageTimePerWord: timePerWord,
        foundWordsList: foundWords,
      })
    },
    [foundWords, quiz, onComplete]
  )

  const timeLeft = useGameTimer(quiz.timeLimit, {
    isActive: gameState === 'playing',
    onExpire: useCallback(
      () =>
        finishGame(
          Math.floor((foundWords.length / quiz.grid.words.length) * quiz.points),
          foundWords.length,
          quiz.timeLimit
        ),
      [finishGame, foundWords, quiz]
    ),
  })

  useEffect(() => {
    if (foundWords.length === quiz.grid.words.length && quiz.grid.words.length > 0) {
      const timer = setTimeout(() => finishGame(quiz.points, foundWords.length, quiz.timeLimit - timeLeft), 500)
      return () => clearTimeout(timer)
    }
  }, [foundWords, quiz, finishGame, timeLeft])

  const getCellsInDirection = useCallback(
    (startRow, startCol, currentRow, currentCol) => {
      const rowDiff = currentRow - startRow
      const colDiff = currentCol - startCol
      let rowStep = 0
      let colStep = 0

      if (Math.abs(rowDiff) > Math.abs(colDiff)) {
        rowStep = rowDiff > 0 ? 1 : -1
      } else if (Math.abs(colDiff) > Math.abs(rowDiff)) {
        colStep = colDiff > 0 ? 1 : -1
      } else if (rowDiff !== 0 && colDiff !== 0) {
        rowStep = rowDiff > 0 ? 1 : -1
        colStep = colDiff > 0 ? 1 : -1
      } else {
        return [[startRow, startCol]]
      }

      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))
      const cells = []
      for (let i = 0; i <= steps; i++) {
        const row = startRow + i * rowStep
        const col = startCol + i * colStep
        if (row >= 0 && row < quiz.grid.size && col >= 0 && col < quiz.grid.size) {
          cells.push([row, col])
        } else {
          break
        }
      }
      return cells
    },
    [quiz.grid.size]
  )

  const handleCellMouseDown = useCallback((row, col) => {
    setIsSelecting(true)
    setStartCell([row, col])
    setSelectedCells([[row, col]])
  }, [])

  const handleCellMouseEnter = useCallback(
    (row, col) => {
      if (isSelecting && startCell) {
        setSelectedCells(getCellsInDirection(startCell[0], startCell[1], row, col))
      }
    },
    [isSelecting, startCell, getCellsInDirection]
  )

  const checkSelectedWord = useCallback(() => {
    if (selectedCells.length < 2) {
      setSelectedCells([])
      return
    }

    const selectedWord = selectedCells.map(([row, col]) => grid[row][col]).join('')
    const reversedWord = selectedWord.split('').reverse().join('')
    const targetWords = quiz.grid.words.map((w) => w.word.toUpperCase())

    let foundWord = null
    let isReversed = false
    if (targetWords.includes(selectedWord)) {
      foundWord = selectedWord
    } else if (targetWords.includes(reversedWord)) {
      foundWord = reversedWord
      isReversed = true
    }

    if (foundWord && !foundWords.includes(foundWord)) {
      setFoundWords((prev) => [...prev, foundWord])
      setWordStatus((prev) => ({ ...prev, [foundWord]: true }))
      const wordPositions = isReversed ? [...selectedCells].reverse() : selectedCells
      setFoundWordPositions((prev) => [...prev, ...wordPositions])
    }
    setSelectedCells([])
  }, [selectedCells, grid, quiz.grid.words, foundWords])

  const handleCellMouseUp = useCallback(() => {
    if (selectedCells.length > 0) checkSelectedWord()
    setIsSelecting(false)
    setStartCell(null)
  }, [selectedCells, checkSelectedWord])

  const isCellInFoundWord = useCallback(
    (row, col) => foundWordPositions.some(([r, c]) => r === row && c === col),
    [foundWordPositions]
  )
  const isWordFound = useCallback((word) => wordStatus[word.toUpperCase()] || false, [wordStatus])
  const isCellSelected = useCallback(
    (row, col) => selectedCells.some(([r, c]) => r === row && c === col),
    [selectedCells]
  )

  if (gameState === 'finished') {
    const isPerfectScore = foundWords.length === quiz.grid.words.length
    const finalScore = isPerfectScore
      ? quiz.points
      : Math.floor((foundWords.length / quiz.grid.words.length) * quiz.points)
    const completionRate = (foundWords.length / quiz.grid.words.length) * 100
    const timeUsed = quiz.timeLimit - timeLeft

    return (
      <div className="space-y-6 text-center">
        {SearchIcon && <SearchIcon className="mx-auto size-14 text-primary" aria-hidden="true" />}
        <h2 className="text-3xl font-bold text-foreground">Word Search Complete!</h2>

        {isPerfectScore && (
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
            All Words Found!
          </div>
        )}

        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
          <StatTile value={finalScore} label="Points" />
          <StatTile value={`${foundWords.length}/${quiz.grid.words.length}`} label="Found" />
          <StatTile value={`${completionRate.toFixed(1)}%`} label="Completion" />
          <StatTile value={formatTime(timeUsed)} label="Time" />
        </div>

        <div className="mx-auto max-w-2xl rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-xl font-bold text-foreground">Words to Find</h3>
          <div className="grid grid-cols-2 gap-3">
            {quiz.grid.words.map((wordObj) => (
              <WordListItem key={wordObj.word} wordObj={wordObj} isFound={isWordFound(wordObj.word)} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (grid.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg text-foreground/60">Generating word search...</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/60">
          Found {foundWords.length} of {quiz.grid.words.length} words
        </div>
        <div className="text-sm font-semibold text-primary">Time: {formatTime(timeLeft)}</div>
      </div>

      <Progress value={(foundWords.length / quiz.grid.words.length) * 100} />

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div
            className="grid touch-none gap-1 rounded-xl border bg-card p-4 select-none"
            style={{ gridTemplateColumns: `repeat(${quiz.grid.size}, minmax(0, 1fr))`, aspectRatio: '1/1' }}
            onMouseLeave={() => isSelecting && handleCellMouseUp()}
            onMouseUp={handleCellMouseUp}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'flex cursor-pointer items-center justify-center rounded border-2 text-lg font-bold transition-all duration-200 select-none',
                    isCellSelected(rowIndex, colIndex)
                      ? 'scale-105 border-primary bg-primary text-primary-foreground shadow-md'
                      : isCellInFoundWord(rowIndex, colIndex)
                        ? 'border-success bg-success text-white shadow-md'
                        : 'border-primary/30 bg-background text-foreground hover:bg-primary/5 dark:hover:bg-primary/10'
                  )}
                  onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                  role="button"
                  aria-label={`Cell ${rowIndex}-${colIndex}: ${cell}`}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCellMouseDown(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:w-64">
          <div className="h-full rounded-xl border bg-card p-4">
            <h3 className="mb-4 text-lg font-bold text-foreground">Words to Find</h3>
            <div className="space-y-2">
              {quiz.grid.words.map((wordObj) => (
                <WordListItem key={wordObj.word} wordObj={wordObj} isFound={isWordFound(wordObj.word)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-foreground/60">
        Click and drag to select words. Words can be horizontal, vertical, or diagonal.
      </div>
    </div>
  )
}

const WordListItem = ({ wordObj, isFound }) => (
  <div
    className={cn(
      'rounded-lg border-2 p-3 transition-colors',
      isFound
        ? 'border-success/40 bg-success/15 text-success line-through'
        : 'border-border bg-muted text-foreground/80'
    )}
  >
    <div className="font-semibold">{wordObj.word}</div>
    <div className="text-sm opacity-75">{wordObj.clue}</div>
  </div>
)
