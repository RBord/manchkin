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
      <div
        className={cn(
          'w-[80px] h-[116px] rounded-lg border-2 flex flex-col items-center justify-center gap-1',
          colors.border, colors.bg
        )}
      >
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
    currentCombatStrength, fightMonster, flee,
  } = useGameStore()

  const strength = currentCombatStrength()

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Decks row */}
      <div className="flex items-center gap-6">
        <DeckPile count={doorDeck.length} label="Колода дверей" category="door" />

        {/* Center action zone */}
        <div className="flex flex-col items-center gap-3 min-w-[180px]">
          <AnimatePresence mode="wait">
            {activeMonster ? (
              <motion.div
                key="monster"
                initial={{ scale: 0.7, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-2"
              >
                <MunchkinCard card={activeMonster} faceUp noFlip interactive={false} />

                {/* Combat info */}
                <div className="bg-black/60 rounded-xl border border-white/10 px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <span className="text-blue-400">⚔️ Ти: <strong>{strength}</strong></span>
                    <span className="text-gray-500">vs</span>
                    <span className="text-red-400">👹 Монстр: <strong>{activeMonster.level}</strong></span>
                  </div>
                  {strength > activeMonster.level
                    ? <p className="text-green-400 text-xs mt-1">Ти сильніший! Можеш перемогти!</p>
                    : <p className="text-red-400 text-xs mt-1">Монстр сильніший! Проси допомоги або тікай!</p>
                  }
                </div>

                {/* Combat actions */}
                <div className="flex gap-2">
                  <button
                    onClick={fightMonster}
                    disabled={strength <= activeMonster.level}
                    className={cn(
                      'px-4 py-1.5 rounded-lg text-sm font-bold transition',
                      strength > activeMonster.level
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
