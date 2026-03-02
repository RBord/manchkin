import { motion } from 'framer-motion'
import { useGameStore, PHASE_LABELS } from '../../store/gameStore'
import { cn } from '../../utils/cn'

const PHASE_ORDER = [
  'kick-open-door',
  'monster-fight',
  'loot-room',
  'end-turn',
] as const

export function PhaseBar() {
  const phase = useGameStore(s => s.phase)
  const currentPlayer = useGameStore(s => s.currentPlayer())
  const round = useGameStore(s => s.round)

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      {/* Round + player */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-500">Раунд {round}</span>
        <span className="text-white font-semibold">{currentPlayer?.name}</span>
        <span className="text-gray-500">|</span>
        <span className="text-yellow-400">⭐ Рівень {currentPlayer?.level}</span>
      </div>

      {/* Phase steps */}
      <div className="flex items-center gap-1">
        {PHASE_ORDER.map((p, i) => {
          const isActive = phase === p
          const isDone = PHASE_ORDER.indexOf(phase as any) > i

          return (
            <div key={p} className="flex items-center gap-1">
              <motion.div
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  isActive && 'bg-yellow-500 text-black',
                  isDone && 'bg-green-900 text-green-400',
                  !isActive && !isDone && 'bg-white/5 text-gray-600'
                )}
                animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
              >
                {PHASE_LABELS[p]}
              </motion.div>
              {i < PHASE_ORDER.length - 1 && (
                <span className="text-gray-700 text-xs">→</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
