import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import type { ItemCard } from '../../types'
import { cn } from '../../utils/cn'

const HAND_LIMIT = 8

const TYPE_ICONS: Record<string, string> = {
  monster: '👹', curse: '💀', race: '🧝', class: '⚔️',
  item: '🗡️', potion: '🧪', 'one-shot': '💥',
}

export function HandLimitModal() {
  const {
    players, currentPlayerIndex, handLimitPending,
    discardCard, showcaseItem, sellItems, confirmEndTurn,
  } = useGameStore()

  const [selectedToSell, setSelectedToSell] = useState<Set<string>>(new Set())
  const player = players[currentPlayerIndex]

  if (!handLimitPending || !player) return null

  const excess = player.hand.length - HAND_LIMIT
  const canSell = !player.hasSoldThisTurn

  const sellableItems = player.hand.filter(c => c.type === 'item') as ItemCard[]
  const totalSellGold = sellableItems
    .filter(c => selectedToSell.has(c.id))
    .reduce((s, c) => s + c.value, 0)

  const toggleSell = (id: string) => {
    setSelectedToSell(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSell = () => {
    if (selectedToSell.size === 0) return
    sellItems([...selectedToSell])
    setSelectedToSell(new Set())
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <motion.div
          className="relative z-10 w-[480px] max-h-[85vh] flex flex-col rounded-2xl border border-orange-700 bg-[#111827] shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-orange-900/40 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h2 className="text-white font-bold">Ліміт Руки!</h2>
              <p className="text-orange-400 text-sm">
                У вас {player.hand.length} карт — потрібно скинути {excess} карт(и) до {HAND_LIMIT}
              </p>
            </div>
          </div>

          {/* Card list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1.5">
            {player.hand.map(card => {
              const isItem = card.type === 'item'
              const isSellSelected = selectedToSell.has(card.id)
              return (
                <div
                  key={card.id}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-xl border',
                    isSellSelected
                      ? 'border-yellow-500 bg-yellow-900/30'
                      : 'border-white/10 bg-white/5'
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-base">{TYPE_ICONS[card.type] ?? '📄'}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{card.name}</p>
                      <p className="text-[10px] text-gray-500 capitalize">{card.type}</p>
                    </div>
                    {isItem && <span className="text-yellow-600 text-xs ml-auto">{(card as ItemCard).value} зол.</span>}
                  </div>

                  <div className="flex gap-1 ml-3 flex-shrink-0">
                    {isItem && canSell && (
                      <button
                        onClick={() => toggleSell(card.id)}
                        className={cn(
                          'text-[10px] px-2 py-1 rounded-lg border transition cursor-pointer',
                          isSellSelected
                            ? 'border-yellow-500 bg-yellow-700 text-yellow-100'
                            : 'border-yellow-800 bg-yellow-950 text-yellow-400 hover:border-yellow-600'
                        )}
                      >
                        {isSellSelected ? '✓ Продати' : '💰 Продати'}
                      </button>
                    )}
                    {isItem && !canSell && (
                      <button
                        onClick={() => showcaseItem(card.id)}
                        className="text-[10px] px-2 py-1 rounded-lg border border-purple-800 bg-purple-950 text-purple-400 hover:border-purple-600 transition cursor-pointer"
                      >
                        🖼️ Вітрина
                      </button>
                    )}
                    <button
                      onClick={() => discardCard(card.id)}
                      className="text-[10px] px-2 py-1 rounded-lg border border-red-800 bg-red-950 text-red-400 hover:border-red-600 transition cursor-pointer"
                    >
                      🗑️ Скинути
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 flex flex-col gap-2">
            {selectedToSell.size > 0 && (
              <button
                onClick={handleSell}
                className="w-full py-2 rounded-xl bg-yellow-700 hover:bg-yellow-600 text-black font-bold text-sm transition cursor-pointer"
              >
                Продати вибране ({totalSellGold} зол.)
              </button>
            )}
            <div className="flex items-center justify-between">
              <span className={cn(
                'text-sm font-bold',
                player.hand.length <= HAND_LIMIT ? 'text-green-400' : 'text-orange-400'
              )}>
                {player.hand.length} / {HAND_LIMIT} карт
              </span>
              <button
                onClick={confirmEndTurn}
                disabled={player.hand.length > HAND_LIMIT}
                className={cn(
                  'px-5 py-2 rounded-xl font-bold text-sm transition',
                  player.hand.length <= HAND_LIMIT
                    ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                )}
              >
                Завершити хід →
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
