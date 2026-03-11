import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { PhaseBar } from './PhaseBar'
import { TableCenter } from './TableCenter'
import { PlayerArea } from './PlayerArea'
import { OpponentsPanel } from './OpponentsPanel'
import { GameLog } from './GameLog'
import { GameSetup } from './GameSetup'
import { SellItemsModal } from './SellItemsModal'
import { DoorReveal } from './DoorReveal'
import { DiceRollOverlay } from './DiceRollOverlay'
import { HandLimitModal } from './HandLimitModal'
import { TradeModal } from './TradeModal'
import { CurseImmunityModal } from './CurseImmunityModal'

export function GameBoard() {
  const { phase, resetGame, players } = useGameStore()
  const [sellOpen, setSellOpen] = useState(false)

  if (phase === 'waiting' && players.length === 0) {
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSellOpen(true)}
              className="text-xs text-yellow-600 hover:text-yellow-400 transition cursor-pointer"
            >
              💰 Продати
            </button>
            <button
              onClick={resetGame}
              className="text-xs text-gray-600 hover:text-gray-400 transition cursor-pointer"
            >
              ↩ Нова гра
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-4 flex flex-col gap-4">
        {/* Opponents */}
        <OpponentsPanel />

        {/* Game table */}
        <div className="flex flex-col items-center py-4 bg-black/20 rounded-2xl border border-white/5">
          <TableCenter />
        </div>

        {/* Player area */}
        <PlayerArea />

        {/* Log */}
        <GameLog />
      </main>

      <SellItemsModal open={sellOpen} onClose={() => setSellOpen(false)} />
      <DoorReveal />
      <DiceRollOverlay />
      <HandLimitModal />
      <TradeModal />
      <CurseImmunityModal />
    </div>
  )
}
