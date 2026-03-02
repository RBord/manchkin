import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { MunchkinCard } from '../cards/MunchkinCard'
import type { AnyCard, ItemCard } from '../../types'
import { cn } from '../../utils/cn'

const RACE_ICONS: Record<string, string> = {
  human: '🧑', elf: '🧝', dwarf: '⛏️', halfling: '🍄',
}
const CLASS_ICONS: Record<string, string> = {
  none: '—', warrior: '⚔️', wizard: '🔮', thief: '🗝️', cleric: '✝️',
}

export function PlayerArea() {
  const { players, currentPlayerIndex, phase, equipItem, discardCard, playItemInCombat } = useGameStore()
  const player = players[currentPlayerIndex]
  const [activeTab, setActiveTab] = useState<'hand' | 'equipped'>('hand')

  if (!player) return null

  const handleCardClick = (card: AnyCard) => {
    if (phase === 'monster-fight' && (card.type === 'potion' || card.type === 'one-shot')) {
      playItemInCombat(card.id)
    } else if (phase !== 'monster-fight' && card.type === 'item') {
      equipItem(card.id)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Player stats bar */}
      <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{RACE_ICONS[player.race]}</span>
          <div>
            <p className="text-white font-bold text-sm">{player.name}</p>
            <p className="text-gray-500 text-xs capitalize">{player.race} · {CLASS_ICONS[player.class]} {player.class}</p>
          </div>
        </div>

        {/* Level track */}
        <div className="flex items-center gap-1 ml-auto">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              className={cn(
                'w-5 h-5 rounded-full border text-[9px] font-bold flex items-center justify-center',
                i < player.level
                  ? 'bg-yellow-500 border-yellow-400 text-black'
                  : 'bg-white/5 border-white/10 text-gray-600'
              )}
              animate={i === player.level - 1 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>

        {/* Combat strength */}
        <div className="text-right">
          <p className="text-xs text-gray-500">Сила в бою</p>
          <p className="text-yellow-400 font-bold text-lg leading-none">
            {useGameStore.getState().currentCombatStrength()}
          </p>
        </div>
      </div>

      {/* Tabs: Hand / Equipped */}
      <div className="flex gap-2">
        {(['hand', 'equipped'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer',
              activeTab === tab
                ? 'bg-white/15 text-white'
                : 'bg-white/5 text-gray-500 hover:text-gray-300'
            )}
          >
            {tab === 'hand' ? `🃏 Рука (${player.hand.length})` : `🛡️ Екіп (${player.equipped.length})`}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-3 min-h-[260px] p-3 bg-black/20 rounded-xl border border-white/5">
        <AnimatePresence>
          {activeTab === 'hand' && player.hand.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="flex flex-col items-center gap-1">
                <MunchkinCard
                  card={card}
                  faceUp
                  onClick={handleCardClick}
                />
                <div className="flex gap-1">
                  {card.type === 'item' && phase !== 'monster-fight' && (
                    <button
                      onClick={() => equipItem(card.id)}
                      className="text-[10px] px-2 py-0.5 bg-yellow-800 hover:bg-yellow-700 text-yellow-200 rounded transition cursor-pointer"
                    >
                      + Надягнути
                    </button>
                  )}
                  {(card.type === 'potion' || card.type === 'one-shot') && phase === 'monster-fight' && (
                    <button
                      onClick={() => playItemInCombat(card.id)}
                      className="text-[10px] px-2 py-0.5 bg-cyan-800 hover:bg-cyan-700 text-cyan-200 rounded transition cursor-pointer"
                    >
                      ▶ Зіграти
                    </button>
                  )}
                  <button
                    onClick={() => discardCard(card.id)}
                    className="text-[10px] px-2 py-0.5 bg-red-900 hover:bg-red-800 text-red-300 rounded transition cursor-pointer"
                  >
                    × Скинути
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {activeTab === 'equipped' && player.equipped.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="flex flex-col items-center gap-1">
                <MunchkinCard card={card} faceUp noFlip interactive={false} />
                <span className="text-xs text-yellow-400">+{(card as ItemCard).bonus}</span>
              </div>
            </motion.div>
          ))}

          {activeTab === 'hand' && player.hand.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
              Рука порожня
            </div>
          )}
          {activeTab === 'equipped' && player.equipped.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
              Нічого не надето
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
