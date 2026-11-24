import { useState } from 'react'
import './App.css'

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function Cell({ value, index, disabled, onCellClick, isWinningCell }) {
  const markClass = value ? ` mark-${value.toLowerCase()}` : ''

  return (
    <button
      type="button"
      className={`cell${markClass}${isWinningCell ? ' winning-cell' : ''}`}
      disabled={disabled || Boolean(value)}
      onClick={() => onCellClick(index)}
      aria-label={`Cell ${index + 1}, ${value || 'empty'}`}
    >
      {value}
    </button>
  )
}

function Board({ cells, disabled, onCellClick, winningLine }) {
  return (
    <div className="board" role="group" aria-label="Tic-Tac-Toe board">
      {cells.map((value, index) => (
        <Cell
          key={index}
          value={value}
          index={index}
          disabled={disabled}
          onCellClick={onCellClick}
          isWinningCell={winningLine?.includes(index) ?? false}
        />
      ))}
    </div>
  )
}

function GameStatus({ currentPlayer, winner, isDraw }) {
  if (winner) {
    return (
      <p className="status" aria-live="polite">
        Player <span className={`turn-mark turn-mark-${winner.toLowerCase()}`}>{winner}</span> wins!
      </p>
    )
  }

  if (isDraw) {
    return (
      <p className="status" aria-live="polite">
        It's a draw!
      </p>
    )
  }

  return (
    <p className="status" aria-live="polite">
      Player <span className={`turn-mark turn-mark-${currentPlayer.toLowerCase()}`}>{currentPlayer}</span>'s turn
    </p>
  )
}

function Scoreboard({ scores, currentPlayer }) {
  return (
    <div className="scoreboard" aria-label="Scoreboard">
      <div className={`score score-x${currentPlayer === 'X' ? ' active-x' : ''}`}>
        <span className="label">Player X</span>
        <span className="value">{scores.x}</span>
      </div>
      <div className="score score-draw">
        <span className="label">Draws</span>
        <span className="value">{scores.draws}</span>
      </div>
      <div className={`score score-o${currentPlayer === 'O' ? ' active-o' : ''}`}>
        <span className="label">Player O</span>
        <span className="value">{scores.o}</span>
      </div>
    </div>
  )
}

function App() {
  const [cells, setCells] = useState(() => Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [scores, setScores] = useState({ x: 0, draws: 0, o: 0 })

  const winningLine = winningLines.find(([first, second, third]) =>
    cells[first] &&
    cells[first] === cells[second] &&
    cells[first] === cells[third]
  )
  const winner = winningLine ? cells[winningLine[0]] : null
  const isDraw = !winner && cells.every(Boolean)
  const isRoundOver = Boolean(winner) || isDraw

  function handleCellClick(index) {
    if (isRoundOver || cells[index]) {
      return
    }

    const nextCells = [...cells]
    nextCells[index] = currentPlayer
    setCells(nextCells)

    const nextWinningLine = winningLines.find(([first, second, third]) =>
      nextCells[first] &&
      nextCells[first] === nextCells[second] &&
      nextCells[first] === nextCells[third]
    )

    if (nextWinningLine) {
      const scoreKey = currentPlayer === 'X' ? 'x' : 'o'
      setScores((previousScores) => ({
        ...previousScores,
        [scoreKey]: previousScores[scoreKey] + 1,
      }))
    } else if (nextCells.every(Boolean)) {
      setScores((previousScores) => ({
        ...previousScores,
        draws: previousScores.draws + 1,
      }))
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }

  function startNewRound() {
    setCells(Array(9).fill(null))
    setCurrentPlayer('X')
  }

  return (
    <main className="game">
      <h1>
        Tic<span>·</span>Tac<span>·</span>Toe
      </h1>
      <Scoreboard scores={scores} currentPlayer={currentPlayer} />
      <GameStatus currentPlayer={currentPlayer} winner={winner} isDraw={isDraw} />
      <Board
        cells={cells}
        disabled={isRoundOver}
        onCellClick={handleCellClick}
        winningLine={winningLine}
      />
      <button type="button" className="restart-btn" onClick={startNewRound}>
        ↻ New Round
      </button>
    </main>
  )
}

export default App
