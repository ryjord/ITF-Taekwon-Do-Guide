import { useState, useEffect, useCallback, useRef } from 'react'
import { Check, Sparkles } from 'lucide-react'

import { cn, formatTime } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

import { StatTile } from '../StatTile'
import { GAME_TYPE_ICONS } from '../quizIcons'
import { useGameTimer } from '../../../hooks/useGameTimer'

const CrosswordIcon = GAME_TYPE_ICONS.crossword

const canPlaceWord = (grid, word, startRow, startCol, direction, size) => {
  if (startRow < 0 || startCol < 0) return false

  if (direction === 'across') {
    if (startCol + word.length > size) return false

    for (let i = 0; i < word.length; i++) {
      const cell = grid[startRow][startCol + i]
      if (!cell.isBlack && cell.letter !== word[i]) return false
      if (
        cell.isBlack &&
        ((startRow > 0 && !grid[startRow - 1][startCol + i].isBlack) ||
          (startRow < size - 1 && !grid[startRow + 1][startCol + i].isBlack))
      ) {
        return false
      }
    }

    if (startCol > 0 && !grid[startRow][startCol - 1].isBlack) return false
    if (startCol + word.length < size && !grid[startRow][startCol + word.length].isBlack) return false
  } else {
    if (startRow + word.length > size) return false

    for (let i = 0; i < word.length; i++) {
      const cell = grid[startRow + i][startCol]
      if (!cell.isBlack && cell.letter !== word[i]) return false
      if (
        cell.isBlack &&
        ((startCol > 0 && !grid[startRow + i][startCol - 1].isBlack) ||
          (startCol < size - 1 && !grid[startRow + i][startCol + 1].isBlack))
      ) {
        return false
      }
    }

    if (startRow > 0 && !grid[startRow - 1][startCol].isBlack) return false
    if (startRow + word.length < size && !grid[startRow + word.length][startCol].isBlack) return false
  }

  return true
}

const placeWord = (grid, word, startRow, startCol, direction, wordId, wordNumber) => {
  if (direction === 'across') {
    for (let i = 0; i < word.length; i++) {
      const currentCell = grid[startRow][startCol + i]
      grid[startRow][startCol + i] = {
        ...currentCell,
        letter: word[i],
        number: currentCell.number || (i === 0 ? wordNumber : null),
        across: wordId,
        isBlack: false,
      }
    }
  } else {
    for (let i = 0; i < word.length; i++) {
      const currentCell = grid[startRow + i][startCol]
      grid[startRow + i][startCol] = {
        ...currentCell,
        letter: word[i],
        number: currentCell.number || (i === 0 ? wordNumber : null),
        down: wordId,
        isBlack: false,
      }
    }
  }
}

const createCrosswordGrid = (wordDefinitions, size) => {
  const grid = Array(size)
    .fill()
    .map(() =>
      Array(size)
        .fill()
        .map(() => ({ letter: '', number: null, across: null, down: null, isBlack: true }))
    )

  const clues = []
  let wordNumber = 1

  const sortedWords = [...wordDefinitions].sort((a, b) => b.word.length - a.word.length)

  const firstWord = sortedWords[0]
  const firstWordText = firstWord.word.toUpperCase()
  const startRow = Math.floor(size / 2)
  const startCol = Math.floor((size - firstWordText.length) / 2)

  for (let i = 0; i < firstWordText.length; i++) {
    grid[startRow][startCol + i] = {
      ...grid[startRow][startCol + i],
      letter: firstWordText[i],
      number: i === 0 ? wordNumber : null,
      across: firstWord.id,
      isBlack: false,
    }
  }

  clues.push({
    id: firstWord.id,
    number: wordNumber,
    word: firstWordText,
    clue: firstWord.clue,
    direction: 'across',
    position: { x: startCol, y: startRow },
    solved: false,
  })

  wordNumber++

  for (let w = 1; w < sortedWords.length; w++) {
    const wordObj = sortedWords[w]
    const word = wordObj.word.toUpperCase()
    let placed = false

    for (let letterIndex = 0; letterIndex < word.length && !placed; letterIndex++) {
      const letter = word[letterIndex]

      for (let row = 0; row < size && !placed; row++) {
        for (let col = 0; col < size && !placed; col++) {
          if (grid[row][col].letter === letter && !grid[row][col].isBlack) {
            if (!grid[row][col].down && canPlaceWord(grid, word, row - letterIndex, col, 'down', size)) {
              placeWord(grid, word, row - letterIndex, col, 'down', wordObj.id, wordNumber)
              clues.push({
                id: wordObj.id,
                number: wordNumber,
                word,
                clue: wordObj.clue,
                direction: 'down',
                position: { x: col, y: row - letterIndex },
                solved: false,
              })
              wordNumber++
              placed = true
              break
            }

            if (!grid[row][col].across && canPlaceWord(grid, word, row, col - letterIndex, 'across', size)) {
              placeWord(grid, word, row, col - letterIndex, 'across', wordObj.id, wordNumber)
              clues.push({
                id: wordObj.id,
                number: wordNumber,
                word,
                clue: wordObj.clue,
                direction: 'across',
                position: { x: col - letterIndex, y: row },
                solved: false,
              })
              wordNumber++
              placed = true
              break
            }
          }
        }
      }
    }

    if (!placed) {
      for (let row = 0; row < size && !placed; row++) {
        for (let col = 0; col < size && !placed; col++) {
          if (canPlaceWord(grid, word, row, col, 'across', size)) {
            placeWord(grid, word, row, col, 'across', wordObj.id, wordNumber)
            clues.push({
              id: wordObj.id,
              number: wordNumber,
              word,
              clue: wordObj.clue,
              direction: 'across',
              position: { x: col, y: row },
              solved: false,
            })
            wordNumber++
            placed = true
          } else if (canPlaceWord(grid, word, row, col, 'down', size)) {
            placeWord(grid, word, row, col, 'down', wordObj.id, wordNumber)
            clues.push({
              id: wordObj.id,
              number: wordNumber,
              word,
              clue: wordObj.clue,
              direction: 'down',
              position: { x: col, y: row },
              solved: false,
            })
            wordNumber++
            placed = true
          }
        }
      }
    }
  }

  return { grid, clues }
}

const findFirstOpenCell = (grid, size) => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!grid[row][col].isBlack) return [row, col]
    }
  }
  return null
}

export const CrosswordGame = ({ quiz, onComplete }) => {
  const [{ grid, clues: initialClues }] = useState(() => createCrosswordGrid(quiz.grid.words, quiz.grid.size))
  const [clues, setClues] = useState(initialClues)
  const [userInput, setUserInput] = useState(() =>
    Array(quiz.grid.size)
      .fill()
      .map(() => Array(quiz.grid.size).fill(''))
  )
  const [selectedCell, setSelectedCell] = useState(() => findFirstOpenCell(grid, quiz.grid.size))
  const [direction, setDirection] = useState('across')
  const [solvedWords, setSolvedWords] = useState([])
  const [gameState, setGameState] = useState('playing')
  const [score, setScore] = useState(0)

  const solvedWordsRef = useRef(solvedWords)
  const userInputRef = useRef(userInput)

  useEffect(() => {
    solvedWordsRef.current = solvedWords
    userInputRef.current = userInput
  }, [solvedWords, userInput])

  const pointsPerWord = Math.floor(quiz.points / quiz.grid.words.length)

  const finishGame = useCallback(
    (timeUsed) => {
      if (gameState === 'finished') return
      setGameState('finished')

      const isPerfectScore = solvedWordsRef.current.length === quiz.grid.words.length
      const adjustedScore = isPerfectScore ? quiz.points : score
      const completionRate = (solvedWordsRef.current.length / quiz.grid.words.length) * 100
      const timePerWord = timeUsed / Math.max(quiz.grid.words.length, 1)

      onComplete({
        gameType: quiz.gameType,
        category: quiz.category,
        score: adjustedScore,
        timeUsed,
        perfectScore: isPerfectScore,
        totalWords: quiz.grid.words.length,
        solvedWords: solvedWordsRef.current.length,
        completionRate,
        timePerWord,
        shuffled: false,
        totalPossiblePoints: quiz.points,
        averageTimePerWord: timePerWord,
        solvedWordsList: solvedWordsRef.current,
      })
    },
    [gameState, quiz, score, onComplete]
  )

  const timeLeft = useGameTimer(quiz.timeLimit, {
    isActive: gameState === 'playing',
    onExpire: useCallback(() => finishGame(quiz.timeLimit), [finishGame, quiz.timeLimit]),
  })

  const moveToNextCell = useCallback(() => {
    if (!selectedCell) return null
    const [row, col] = selectedCell
    let newRow = row
    let newCol = col

    if (direction === 'across') {
      newCol = col + 1
      while (
        newCol < quiz.grid.size &&
        grid[newRow] &&
        grid[newRow][newCol] &&
        grid[newRow][newCol].isBlack
      ) {
        newCol++
      }
    } else {
      newRow = row + 1
      while (
        newRow < quiz.grid.size &&
        grid[newRow] &&
        grid[newRow][newCol] &&
        grid[newRow][newCol].isBlack
      ) {
        newRow++
      }
    }

    if (
      newRow < quiz.grid.size &&
      newCol < quiz.grid.size &&
      grid[newRow] &&
      grid[newRow][newCol] &&
      !grid[newRow][newCol].isBlack
    ) {
      setSelectedCell([newRow, newCol])
      return [newRow, newCol]
    }

    return null
  }, [selectedCell, direction, quiz.grid.size, grid])

  const moveToPreviousCell = useCallback(() => {
    if (!selectedCell) return null
    const [row, col] = selectedCell
    let newRow = row
    let newCol = col

    if (direction === 'across') {
      newCol = col - 1
      while (newCol >= 0 && grid[newRow] && grid[newRow][newCol] && grid[newRow][newCol].isBlack) {
        newCol--
      }
    } else {
      newRow = row - 1
      while (newRow >= 0 && grid[newRow] && grid[newRow][newCol] && grid[newRow][newCol].isBlack) {
        newRow--
      }
    }

    if (
      newRow >= 0 &&
      newCol >= 0 &&
      grid[newRow] &&
      grid[newRow][newCol] &&
      !grid[newRow][newCol].isBlack
    ) {
      setSelectedCell([newRow, newCol])
      return [newRow, newCol]
    }

    return null
  }, [selectedCell, direction, grid])

  const navigateWithArrows = useCallback(
    (key) => {
      if (!selectedCell) return
      const [row, col] = selectedCell
      let newRow = row
      let newCol = col

      switch (key) {
        case 'ArrowUp':
          newRow = Math.max(0, row - 1)
          while (newRow >= 0 && grid[newRow] && grid[newRow][newCol] && grid[newRow][newCol].isBlack) {
            newRow--
          }
          break
        case 'ArrowDown':
          newRow = Math.min(quiz.grid.size - 1, row + 1)
          while (
            newRow < quiz.grid.size &&
            grid[newRow] &&
            grid[newRow][newCol] &&
            grid[newRow][newCol].isBlack
          ) {
            newRow++
          }
          break
        case 'ArrowLeft':
          newCol = Math.max(0, col - 1)
          while (newCol >= 0 && grid[newRow] && grid[newRow][newCol] && grid[newRow][newCol].isBlack) {
            newCol--
          }
          break
        case 'ArrowRight':
          newCol = Math.min(quiz.grid.size - 1, col + 1)
          while (
            newCol < quiz.grid.size &&
            grid[newRow] &&
            grid[newRow][newCol] &&
            grid[newRow][newCol].isBlack
          ) {
            newCol++
          }
          break
      }

      if (
        newRow >= 0 &&
        newRow < quiz.grid.size &&
        newCol >= 0 &&
        newCol < quiz.grid.size &&
        grid[newRow] &&
        grid[newRow][newCol] &&
        !grid[newRow][newCol].isBlack
      ) {
        setSelectedCell([newRow, newCol])
      }
    },
    [selectedCell, quiz.grid.size, grid]
  )

  const getWordCells = useCallback((clue) => {
    const cells = []
    const { position, direction: clueDirection, word } = clue

    if (clueDirection === 'across') {
      for (let i = 0; i < word.length; i++) cells.push([position.y, position.x + i])
    } else {
      for (let i = 0; i < word.length; i++) cells.push([position.y + i, position.x])
    }

    return cells
  }, [])

  const isWordCompleted = useCallback(
    (clue) => {
      const cells = getWordCells(clue)
      return cells.every(
        ([row, col]) => userInputRef.current[row] && userInputRef.current[row][col] === grid[row][col].letter
      )
    },
    [getWordCells, grid]
  )

  const checkAllWords = useCallback(() => {
    const newlySolved = []
    const currentSolvedWords = solvedWordsRef.current

    clues.forEach((clue) => {
      if (!currentSolvedWords.includes(clue.id) && isWordCompleted(clue)) {
        newlySolved.push(clue.id)
      }
    })

    if (newlySolved.length > 0) {
      setSolvedWords((prev) => {
        setScore((prevScore) => prevScore + pointsPerWord * newlySolved.length)
        setClues((prevClues) => prevClues.map((clue) => (newlySolved.includes(clue.id) ? { ...clue, solved: true } : clue)))
        return [...prev, ...newlySolved]
      })
    }
  }, [clues, isWordCompleted, pointsPerWord])

  const handleKeyDown = useCallback(
    (event) => {
      if (!selectedCell) return
      const [row, col] = selectedCell
      const key = event.key.toUpperCase()

      if (/^[A-Z]$/.test(key)) {
        event.preventDefault()
        const newInput = userInput.map((r) => [...r])
        newInput[row][col] = key
        setUserInput(newInput)
        moveToNextCell()
        setTimeout(checkAllWords, 0)
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault()
        const newInput = userInput.map((r) => [...r])

        if (userInput[row][col]) {
          newInput[row][col] = ''
          setUserInput(newInput)
          setTimeout(checkAllWords, 0)
        } else {
          const prevCell = moveToPreviousCell()
          if (prevCell) {
            newInput[prevCell[0]][prevCell[1]] = ''
            setUserInput(newInput)
            setTimeout(checkAllWords, 0)
          }
        }
      } else if (event.key === 'Tab') {
        event.preventDefault()
        setDirection((prev) => (prev === 'across' ? 'down' : 'across'))
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault()
        navigateWithArrows(event.key)
      }
    },
    [selectedCell, userInput, moveToNextCell, moveToPreviousCell, navigateWithArrows, checkAllWords]
  )

  const getCurrentWord = useCallback(() => {
    if (!selectedCell) return null
    const [row, col] = selectedCell
    const cell = grid[row][col]

    if (direction === 'across' && cell.across) {
      return clues.find((clue) => clue.id === cell.across && clue.direction === 'across')
    } else if (direction === 'down' && cell.down) {
      return clues.find((clue) => clue.id === cell.down && clue.direction === 'down')
    }

    return null
  }, [selectedCell, grid, direction, clues])

  useEffect(() => {
    if (solvedWordsRef.current.length === quiz.grid.words.length && quiz.grid.words.length > 0 && gameState === 'playing') {
      finishGame(quiz.timeLimit - timeLeft)
    }
  }, [solvedWords, quiz.grid.words.length, quiz.timeLimit, gameState, finishGame, timeLeft])

  if (gameState === 'finished') {
    const isPerfectScore = solvedWords.length === quiz.grid.words.length
    const finalScore = isPerfectScore ? quiz.points : score
    const completionRate = (solvedWords.length / quiz.grid.words.length) * 100
    const timeUsed = quiz.timeLimit - timeLeft

    return (
      <div className="space-y-6 text-center">
        {CrosswordIcon && <CrosswordIcon className="mx-auto size-14 text-primary" aria-hidden="true" />}
        <h2 className="text-3xl font-bold text-foreground">Crossword Complete!</h2>

        {isPerfectScore && (
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
            Perfect Puzzle!
          </div>
        )}

        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
          <StatTile value={finalScore} label="Points" />
          <StatTile value={`${solvedWords.length}/${quiz.grid.words.length}`} label="Solved" />
          <StatTile value={`${completionRate.toFixed(1)}%`} label="Completion" />
          <StatTile value={formatTime(timeUsed)} label="Time" />
        </div>
      </div>
    )
  }

  if (grid.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg text-foreground/60">Setting up crossword puzzle...</div>
      </div>
    )
  }

  const currentWord = getCurrentWord()

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-foreground/60">
          Solved {solvedWords.length} of {quiz.grid.words.length} words
        </div>
        <div className="text-sm font-semibold text-primary">Time: {formatTime(timeLeft)}</div>
      </div>

      <Progress value={(solvedWords.length / quiz.grid.words.length) * 100} />

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div
            className="grid gap-px rounded-xl border bg-border p-4 select-none"
            style={{ gridTemplateColumns: `repeat(${quiz.grid.size}, minmax(0, 1fr))` }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                if (cell.isBlack) {
                  return <div key={`${rowIndex}-${colIndex}`} className="aspect-square bg-foreground/80" aria-label="Black cell" />
                }

                const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                const inCurrentWord = currentWord && getWordCells(currentWord).some(([r, c]) => r === rowIndex && c === colIndex)
                const isCorrect = userInput[rowIndex] && userInput[rowIndex][colIndex] === cell.letter
                const hasInput = userInput[rowIndex] && userInput[rowIndex][colIndex]

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={cn(
                      'relative flex aspect-square cursor-pointer items-center justify-center bg-background transition-all duration-200 select-none',
                      isSelected && 'z-10 ring-2 ring-primary ring-inset',
                      inCurrentWord && 'bg-primary/10',
                      isCorrect ? 'bg-success/15' : hasInput && 'bg-destructive/15'
                    )}
                    onClick={() => setSelectedCell([rowIndex, colIndex])}
                    role="button"
                    aria-label={`Cell ${rowIndex}-${colIndex}: ${hasInput ? `Letter ${userInput[rowIndex][colIndex]}` : 'Empty'}${cell.number ? `, word number ${cell.number}` : ''}`}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                  >
                    {cell.number && <div className="absolute top-0 left-0 p-1 text-xs text-foreground/60">{cell.number}</div>}
                    <div
                      className={cn(
                        'text-lg font-bold',
                        isCorrect
                          ? 'text-success'
                          : hasInput
                            ? 'text-destructive'
                            : 'text-foreground'
                      )}
                    >
                      {userInput[rowIndex]?.[colIndex] || ''}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {selectedCell && currentWord && (
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/10 p-4">
              <div className="text-sm text-primary">
                <strong>Current Word:</strong> {currentWord.clue}
              </div>
              <div className="mt-1 text-xs text-primary/80">Direction: {direction} • Press Tab to switch direction</div>
            </div>
          )}
        </div>

        <div className="lg:w-80">
          <div className="h-full rounded-xl border bg-card p-4">
            <h3 className="mb-4 text-lg font-bold text-foreground">Clues</h3>

            <div className="mb-6">
              <h4 className="mb-2 font-semibold text-foreground">Across →</h4>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {clues
                  .filter((clue) => clue.direction === 'across')
                  .map((clue) => (
                    <ClueListItem key={clue.id} clue={clue} isCurrent={currentWord?.id === clue.id} onSelect={setSelectedCell} onSetDirection={setDirection} />
                  ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-foreground">Down ↓</h4>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {clues
                  .filter((clue) => clue.direction === 'down')
                  .map((clue) => (
                    <ClueListItem key={clue.id} clue={clue} isCurrent={currentWord?.id === clue.id} onSelect={setSelectedCell} onSetDirection={setDirection} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-foreground/60">
        Click cells to select, type letters to fill. Use arrow keys to navigate, Tab to switch direction.
      </div>
    </div>
  )
}

const ClueListItem = ({ clue, isCurrent, onSelect, onSetDirection }) => (
  <div
    className={cn(
      'cursor-pointer rounded-lg border-2 p-3 transition-colors',
      clue.solved
        ? 'border-success/40 bg-success/15 text-success line-through'
        : isCurrent
          ? 'border-primary/30 bg-primary/10 text-primary'
          : 'border-border bg-muted text-foreground/80'
    )}
    onClick={() => {
      onSelect([clue.position.y, clue.position.x])
      onSetDirection(clue.direction)
    }}
    role="button"
    aria-label={`Clue ${clue.number}: ${clue.clue}. ${clue.solved ? 'Solved' : 'Unsolved'}`}
    tabIndex={0}
  >
    <div className="flex items-start gap-2">
      <span className="shrink-0 text-sm font-semibold">{clue.number}.</span>
      <div className="flex-1">
        <div className="text-sm">{clue.clue}</div>
        <div className="mt-1 text-xs opacity-75">
          {clue.direction === 'across' ? '→' : '↓'} {clue.word.length} letters
        </div>
      </div>
      {clue.solved && <Check className="size-4 shrink-0 text-success" aria-hidden="true" />}
    </div>
  </div>
)
