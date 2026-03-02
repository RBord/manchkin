import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import type { ItemCard } from '../../types'
import { cn } from '../../utils/cn'

const RACE_ICONS: Record<string, string> = {
  human: '🧑', elf: '🧝', dwarf: '⛏️', halfling: '🍄',
}
const CLASS_ICONS: Record<string, string> = {
  none: '—', warrior: '⚔️', wizard: '🔮', thief: '🗝️', cleric: '✝️',
}

export function OpponentsPanel() {
  const {
    players, currentPlayerIndex, phase,
    helperIds, joinCombat, leaveCombat,
    helpRewards, offerReward, removeReward,
    openTrade,
  } = useGameStore()

  const [openRewardFor, setOpenRewardFor] = useState<string | null>(null)

  const opponents = players.filter((_, i) => i !== currentPlayerIndex)
  const currentPlayer = players[currentPlayerIndex]

  if (opponents.length === 0) return null

  const handItems = currentPlayer?.hand.filter(c => c.type === 'item') as ItemCard[] ?? []

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Суперники</p>

      <div className="flex gap-3 flex-wrap">
        {opponents.map((player) => {
          const isHelper = helperIds.includes(player.id)
          const canHelp = phase === 'monster-fight'
          const reward = helpRewards.find(r => r.helperId === player.id)
          const combatStr = player.level + player.equipped.reduce((s, i) => s + i.bonus, 0)

          return (
            <motion.div
              key={player.id}
              layout
              className={cn(
                'flex-1 min-w-[200px] rounded-xl border p-3 flex flex-col gap-2 transition-colors',
                isHelper ? 'border-green-600 bg-green-950/40' : 'border-white/10 bg-white/[0.03]'
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

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span className="text-yellow-400">⭐ {player.level} рів.</span>
                <span className="text-blue-400">⚔️ {combatStr} сила</span>
                {player.equipped.length > 0 && (
                  <span className="text-gray-500">🛡️ {player.equipped.length} речей</span>
                )}
                {player.gold > 0 && (
                  <span className="text-yellow-600">💰 {player.gold} зол.</span>
                )}
              </div>

              {/* Equipped items */}
              {player.equipped.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {player.equipped.map(item => (
                    <span
                      key={item.id}
                      className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full border',
                        item.legendary
                          ? 'bg-yellow-950 border-yellow-600 text-yellow-300'
                          : 'bg-yellow-950 border-yellow-800 text-yellow-400'
                      )}
                    >
                      {item.legendary && '★ '}{item.name} +{item.bonus}
                    </span>
                  ))}
                </div>
              )}

              {/* Race/Class */}
              {(player.raceCard || player.classCard) && (
                <div className="flex gap-1 flex-wrap">
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

              {/* Showcase items */}
              {player.showcase.length > 0 && (
                <div className="flex flex-col gap-1">
                  <p className="text-[9px] text-purple-400 uppercase tracking-wider">На вітрині</p>
                  <div className="flex flex-wrap gap-1">
                    {player.showcase.map(item => (
                      <div key={item.id} className="flex items-center gap-1">
                        <span className="text-[10px] px-2 py-0.5 bg-purple-950 border border-purple-800 text-purple-300 rounded-full">
                          🖼️ {item.name} +{item.bonus}
                          {item.requiredRace && <span className="text-purple-500 ml-1">({item.requiredRace.join('/')})</span>}
                          {item.requiredClass && <span className="text-purple-500 ml-1">({item.requiredClass.join('/')})</span>}
                        </span>
                        <button
                          onClick={() => openTrade(player.id)}
                          className="text-[9px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
                        >
                          обмін
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Combat actions */}
              {canHelp && (
                <div className="flex flex-col gap-1.5 mt-1">
                  <button
                    onClick={() => {
                      if (isHelper) { leaveCombat(player.id); removeReward(player.id) }
                      else joinCombat(player.id)
                    }}
                    className={cn(
                      'w-full py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
                      isHelper
                        ? 'bg-red-900 hover:bg-red-800 text-red-200'
                        : 'bg-green-800 hover:bg-green-700 text-green-100'
                    )}
                  >
                    {isHelper ? '✕ Вийти з бою' : '🤝 Допомогти'}
                  </button>

                  {/* Reward offer — only when helping */}
                  <AnimatePresence>
                    {isHelper && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-yellow-950/50 border border-yellow-800/50 rounded-lg p-2 flex flex-col gap-1.5">
                          <p className="text-[10px] text-yellow-500 font-bold uppercase">
                            🎁 Нагорода для {player.name}
                          </p>

                          {reward ? (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-yellow-300">
                                {reward.fromVictory
                                  ? `${reward.victoryCount} скарб(и) з перемоги`
                                  : players[currentPlayerIndex]?.hand.find(c => c.id === reward.cardId)?.name ?? 'картка'}
                              </span>
                              <button
                                onClick={() => { removeReward(player.id); setOpenRewardFor(null) }}
                                className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer"
                              >
                                скасувати
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setOpenRewardFor(openRewardFor === player.id ? null : player.id)}
                              className="text-[10px] text-yellow-400 hover:text-yellow-300 underline text-left cursor-pointer"
                            >
                              + Запропонувати нагороду
                            </button>
                          )}

                          {/* Reward picker */}
                          <AnimatePresence>
                            {openRewardFor === player.id && (
                              <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="flex flex-col gap-1 mt-1"
                              >
                                {/* From victory — multiple counts */}
                                {[1, 2, 3].map(count => (
                                  <button
                                    key={count}
                                    onClick={() => { offerReward(player.id, null, count); setOpenRewardFor(null) }}
                                    className="text-left text-xs px-2 py-1 rounded bg-yellow-900/60 hover:bg-yellow-800/60 text-yellow-200 cursor-pointer"
                                  >
                                    💰 {count} скарб{count === 1 ? '' : count < 5 ? 'и' : 'ів'} з перемоги
                                  </button>
                                ))}
                                {/* Hand items */}
                                {handItems.map(item => (
                                  <button
                                    key={item.id}
                                    onClick={() => { offerReward(player.id, item.id); setOpenRewardFor(null) }}
                                    className="text-left text-xs px-2 py-1 rounded bg-yellow-900/60 hover:bg-yellow-800/60 text-yellow-200 cursor-pointer"
                                  >
                                    🗡️ {item.name} (+{item.bonus})
                                  </button>
                                ))}
                                {handItems.length === 0 && (
                                  <p className="text-[10px] text-gray-600 italic">Немає предметів в руці</p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Trade button (outside combat) */}
              {!canHelp && (
                <button
                  onClick={() => openTrade(player.id)}
                  className="w-full py-1.5 rounded-lg text-xs font-bold bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 border border-blue-800/50 transition cursor-pointer mt-1"
                >
                  🤝 Запропонувати обмін
                </button>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
