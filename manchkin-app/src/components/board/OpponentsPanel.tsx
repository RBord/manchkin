import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { cn } from '../../utils/cn'

const RACE_ICONS: Record<string, string> = {
  human: '🧑', elf: '🧝', dwarf: '⛏️', halfling: '🍄',
}
const CLASS_ICONS: Record<string, string> = {
  none: '—', warrior: '⚔️', wizard: '🔮', thief: '🗝️', cleric: '✝️',
}

export function OpponentsPanel() {
  const { players, currentPlayerIndex, phase, helperIds, joinCombat, leaveCombat } = useGameStore()
  const opponents = players.filter((_, i) => i !== currentPlayerIndex)

  if (opponents.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Суперники</p>

      <div className="flex gap-3 flex-wrap">
        {opponents.map((player) => {
          const isHelper = helperIds.includes(player.id)
          const canHelp = phase === 'monster-fight'
          const combatStr = player.level + player.equipped.reduce((s, i) => s + i.bonus, 0)

          return (
            <motion.div
              key={player.id}
              layout
              className={cn(
                'flex-1 min-w-[200px] rounded-xl border p-3 flex flex-col gap-2 transition-colors',
                isHelper
                  ? 'border-green-600 bg-green-950/40'
                  : 'border-white/10 bg-white/[0.03]'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{RACE_ICONS[player.race]}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{player.name}</p>
                    <p className="text-[10px] text-gray-500">
                      {player.race} · {CLASS_ICONS[player.class]} {player.class !== 'none' ? player.class : 'без класу'}
                    </p>
                  </div>
                </div>
                {isHelper && (
                  <span className="text-[10px] text-green-400 font-bold bg-green-900/50 px-2 py-0.5 rounded-full">
                    ДОПОМАГАЄ
                  </span>
                )}
              </div>

              {/* Level track */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-4 h-4 rounded-full border text-[8px] font-bold flex items-center justify-center',
                      i < player.level
                        ? 'bg-yellow-500 border-yellow-400 text-black'
                        : 'bg-white/5 border-white/10 text-gray-600'
                    )}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-3 text-xs">
                <span className="text-yellow-400">⭐ {player.level} рівень</span>
                <span className="text-blue-400">⚔️ {combatStr} сила</span>
                {player.equipped.length > 0 && (
                  <span className="text-gray-500">🛡️ {player.equipped.length} речей</span>
                )}
                {player.gold > 0 && (
                  <span className="text-yellow-600">💰 {player.gold} зол.</span>
                )}
              </div>

              {/* Equipped items — compact */}
              {player.equipped.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {player.equipped.map(item => (
                    <span
                      key={item.id}
                      className="text-[10px] px-2 py-0.5 bg-yellow-950 border border-yellow-800 text-yellow-400 rounded-full"
                    >
                      {item.name} +{item.bonus}
                    </span>
                  ))}
                </div>
              )}

              {/* Race / Class cards */}
              {(player.raceCard || player.classCard) && (
                <div className="flex gap-1">
                  {player.raceCard && (
                    <span className="text-[10px] px-2 py-0.5 bg-green-950 border border-green-800 text-green-400 rounded-full">
                      🧝 {player.raceCard.name}
                    </span>
                  )}
                  {player.classCard && (
                    <span className="text-[10px] px-2 py-0.5 bg-blue-950 border border-blue-800 text-blue-400 rounded-full">
                      ⚔️ {player.classCard.name}
                    </span>
                  )}
                </div>
              )}

              {/* Help button */}
              {canHelp && (
                <button
                  onClick={() => isHelper ? leaveCombat(player.id) : joinCombat(player.id)}
                  className={cn(
                    'w-full py-1.5 rounded-lg text-xs font-bold transition cursor-pointer mt-1',
                    isHelper
                      ? 'bg-red-900 hover:bg-red-800 text-red-200'
                      : 'bg-green-800 hover:bg-green-700 text-green-100'
                  )}
                >
                  {isHelper ? '✕ Вийти з бою' : '🤝 Допомогти'}
                </button>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
