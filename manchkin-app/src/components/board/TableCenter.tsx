import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { MunchkinCard } from '../cards/MunchkinCard'
import { cn } from '../../utils/cn'

function DeckPile({ count, label, category }: { count: number; label: string; category: 'door' | 'treasure' }) {
  const colors = category === 'door'
    ? { border: 'border-stone-600', bg: 'bg-stone-800', text: 'text-stone-400', icon: '🚪' }
    : { border: 'border-yellow-700', bg: 'bg-yellow-950', text: 'text-yellow-500', icon: '💰' }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('w-[80px] h-[116px] rounded-lg border-2 flex flex-col items-center justify-center gap-1', colors.border, colors.bg)}>
        <span className="text-2xl">{colors.icon}</span>
        <span className={cn('text-xs font-bold', colors.text)}>{count}</span>
      </div>
      <span className="text-[10px] text-gray-600">{label}</span>
    </div>
  )
}

export function TableCenter() {
  const {
    phase, activeMonster, doorDeck, treasureDeck,
    kickOpenDoor, lootRoom, endTurn,
    currentCombatStrength, activeMonsterLevel, fightMonster, flee,
    helperIds, players, monsterBonus,
  } = useGameStore()

  const strength = currentCombatStrength()
  const monsterLevel = activeMonsterLevel()
  const helpers = helperIds.map(id => players.find(p => p.id === id)).filter(Boolean)

  return (
    <div className="flex flex-col items-center gap-4 w-full px-4">
      <div className="flex items-center gap-6 w-full justify-center">
        <DeckPile count={doorDeck.length} label="Колода дверей" category="door" />

        {/* Center zone */}
        <div className="flex flex-col items-center gap-3 min-w-[220px]">
          <AnimatePresence mode="wait">
            {activeMonster ? (
              <motion.div
                key="monster"
                initial={{ scale: 0.7, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-2 w-full"
              >
                <MunchkinCard card={activeMonster} faceUp noFlip interactive={false} />

                {/* Monster boost badge */}
                {monsterBonus > 0 && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="bg-red-900 border border-red-700 rounded-full px-3 py-0.5 text-xs text-red-300 font-bold"
                  >
                    👹 +{monsterBonus} посилення!
                  </motion.div>
                )}

                {/* Helpers badges */}
                {helpers.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {helpers.map(h => h && (
                      <span key={h.id} className="text-[10px] bg-green-900 border border-green-700 text-green-300 px-2 py-0.5 rounded-full">
                        🤝 {h.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Combat scoreboard */}
                <div className="bg-black/60 rounded-xl border border-white/10 px-4 py-2 text-center w-full">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 mb-0.5">Герої</p>
                      <span className="text-blue-400 font-bold text-lg">{strength}</span>
                    </div>
                    <span className="text-gray-600 text-lg">vs</span>
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 mb-0.5">
                        Монстр{monsterBonus > 0 ? ` (+${monsterBonus})` : ''}
                      </p>
                      <span className="text-red-400 font-bold text-lg">{monsterLevel}</span>
                    </div>
                  </div>
                  <p className={cn('text-xs mt-1', strength > monsterLevel ? 'text-green-400' : 'text-red-400')}>
                    {strength > monsterLevel
                      ? '✓ Можна перемогти!'
                      : '✗ Проси допомоги або тікай!'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={fightMonster}
                    disabled={strength <= monsterLevel}
                    className={cn(
                      'px-4 py-1.5 rounded-lg text-sm font-bold transition',
                      strength > monsterLevel
                        ? 'bg-green-600 hover:bg-green-500 text-white cursor-pointer'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    )}
                  >
                    ⚔️ Битись
                  </button>
                  <button
                    onClick={flee}
                    className="px-4 py-1.5 rounded-lg text-sm font-bold bg-red-900 hover:bg-red-800 text-red-200 transition cursor-pointer"
                  >
                    🏃 Тікати
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2"
              >
                {phase === 'kick-open-door' && (
                  <button
                    onClick={kickOpenDoor}
                    className="px-6 py-3 rounded-xl text-base font-bold bg-yellow-600 hover:bg-yellow-500 text-black transition cursor-pointer shadow-lg shadow-yellow-900/40"
                  >
                    🚪 Відкрити Двері!
                  </button>
                )}
                {phase === 'loot-room' && (
                  <button
                    onClick={lootRoom}
                    className="px-6 py-3 rounded-xl text-base font-bold bg-yellow-700 hover:bg-yellow-600 text-white transition cursor-pointer"
                  >
                    💰 Пограбувати Кімнату
                  </button>
                )}
                {phase === 'end-turn' && (
                  <button
                    onClick={endTurn}
                    className="px-6 py-3 rounded-xl text-base font-bold bg-blue-700 hover:bg-blue-600 text-white transition cursor-pointer"
                  >
                    🔄 Завершити Хід
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DeckPile count={treasureDeck.length} label="Колода скарбів" category="treasure" />
      </div>
    </div>
  )
}
