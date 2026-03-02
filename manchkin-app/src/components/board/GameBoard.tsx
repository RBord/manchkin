import { useGameStore } from '../../store/gameStore'
import { PhaseBar } from './PhaseBar'
import { TableCenter } from './TableCenter'
import { PlayerArea } from './PlayerArea'
import { GameLog } from './GameLog'
import { GameSetup } from './GameSetup'

export function GameBoard() {
  const { phase, resetGame } = useGameStore()

  if (phase === 'waiting' && useGameStore.getState().players.length === 0) {
    return <GameSetup />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="border-b border-white/10 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-2">
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-gold)' }}>
            ⚔️ Манчкін
          </h1>
          <PhaseBar />
          <button
            onClick={resetGame}
            className="text-xs text-gray-600 hover:text-gray-400 transition cursor-pointer"
          >
            ↩ Нова гра
          </button>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-4 flex flex-col gap-4">
        {/* Game table */}
        <div className="flex flex-col items-center py-4 bg-black/20 rounded-2xl border border-white/5">
          <TableCenter />
        </div>

        {/* Player area */}
        <PlayerArea />

        {/* Log */}
        <GameLog />
      </main>
    </div>
  )
}
