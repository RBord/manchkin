import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import type { AnyCard, ItemCard } from '../../types'
import { cn } from '../../utils/cn'

const TYPE_ICONS: Record<string, string> = {
  monster: '👹', curse: '💀', race: '🧝', class: '⚔️',
  item: '🗡️', potion: '🧪', 'one-shot': '💥',
}

function CardRow({ card, selected, onClick }: { card: AnyCard; selected: boolean; onClick: () => void }) {
  const item = card.type === 'item' ? card as ItemCard : null
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition cursor-pointer',
        selected
          ? 'border-blue-500 bg-blue-900/40'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      )}
    >
      <span className="text-base">{TYPE_ICONS[card.type] ?? '📄'}</span>
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          item?.legendary ? 'text-yellow-300' : 'text-white'
        )}>
          {item?.legendary && <span className="text-yellow-500 mr-1">★</span>}
          {card.name}
        </p>
        <p className="text-[10px] text-gray-500">{card.type}{item ? ` · +${item.bonus} · ${item.value}зол.` : ''}</p>
      </div>
      {selected && <span className="text-blue-400 text-sm">✓</span>}
    </button>
  )
}

export function TradeModal() {
  const { players, tradeModal, closeTrade, tradeCards } = useGameStore()
  const [myCardId, setMyCardId] = useState<string | null>(null)
  const [theirCardId, setTheirCardId] = useState<string | null>(null)

  const isOpen = tradeModal !== null

  if (!isOpen) return null

  const fromPlayer = players.find(p => p.id === tradeModal.fromPlayerId)
  const toPlayer = players.find(p => p.id === tradeModal.toPlayerId)

  if (!fromPlayer || !toPlayer) return null

  const myCards: AnyCard[] = [...fromPlayer.hand, ...fromPlayer.showcase]
  const theirCards: AnyCard[] = [...toPlayer.hand, ...toPlayer.showcase]

  const handleTrade = () => {
    if (!myCardId || !theirCardId) return
    tradeCards(myCardId, theirCardId)
    setMyCardId(null)
    setTheirCardId(null)
  }

  const handleClose = () => {
    setMyCardId(null)
    setTheirCardId(null)
    closeTrade()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={v => !v && handleClose()}>
      <Dialog.Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  className="fixed left-1/2 top-1/2 z-50 w-[560px] max-h-[85vh] rounded-2xl border border-blue-700 bg-[#111827] shadow-2xl outline-none flex flex-col"
                  initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
                  animate={{ opacity: 1, scale: 1,   x: '-50%', y: '-50%' }}
                  exit={{    opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Header */}
                  <div className="px-5 py-4 bg-blue-900/40 flex items-center justify-between rounded-t-2xl flex-shrink-0">
                    <div>
                      <Dialog.Title className="text-white font-bold text-lg">
                        🤝 Обмін між гравцями
                      </Dialog.Title>
                      <p className="text-blue-400 text-sm">
                        {fromPlayer.name} ↔ {toPlayer.name}
                      </p>
                    </div>
                    <Dialog.Close
                      onClick={handleClose}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition cursor-pointer"
                    >
                      ✕
                    </Dialog.Close>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-0 divide-x divide-white/10">
                      {/* My cards */}
                      <div className="p-4 flex flex-col gap-2">
                        <p className="text-sm font-bold text-white">
                          {fromPlayer.name} <span className="text-gray-500 text-xs">(ви)</span>
                        </p>
                        {fromPlayer.showcase.length > 0 && (
                          <p className="text-[10px] text-purple-400 uppercase tracking-wider">На вітрині</p>
                        )}
                        {fromPlayer.showcase.map(card => (
                          <CardRow
                            key={card.id}
                            card={card}
                            selected={myCardId === card.id}
                            onClick={() => setMyCardId(myCardId === card.id ? null : card.id)}
                          />
                        ))}
                        {fromPlayer.hand.length > 0 && (
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">В руці</p>
                        )}
                        {fromPlayer.hand.map(card => (
                          <CardRow
                            key={card.id}
                            card={card}
                            selected={myCardId === card.id}
                            onClick={() => setMyCardId(myCardId === card.id ? null : card.id)}
                          />
                        ))}
                        {myCards.length === 0 && (
                          <p className="text-gray-600 text-sm text-center py-4">Немає карт</p>
                        )}
                      </div>

                      {/* Their cards */}
                      <div className="p-4 flex flex-col gap-2">
                        <p className="text-sm font-bold text-white">{toPlayer.name}</p>
                        {toPlayer.showcase.length > 0 && (
                          <p className="text-[10px] text-purple-400 uppercase tracking-wider">На вітрині</p>
                        )}
                        {toPlayer.showcase.map(card => (
                          <CardRow
                            key={card.id}
                            card={card}
                            selected={theirCardId === card.id}
                            onClick={() => setTheirCardId(theirCardId === card.id ? null : card.id)}
                          />
                        ))}
                        {toPlayer.hand.length > 0 && (
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">В руці</p>
                        )}
                        {toPlayer.hand.map(card => (
                          <CardRow
                            key={card.id}
                            card={card}
                            selected={theirCardId === card.id}
                            onClick={() => setTheirCardId(theirCardId === card.id ? null : card.id)}
                          />
                        ))}
                        {theirCards.length === 0 && (
                          <p className="text-gray-600 text-sm text-center py-4">Немає карт</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between flex-shrink-0">
                    <div className="text-sm text-gray-400">
                      {myCardId && theirCardId
                        ? <span className="text-green-400">Готово до обміну!</span>
                        : 'Оберіть по одній картці з кожної сторони'}
                    </div>
                    <button
                      onClick={handleTrade}
                      disabled={!myCardId || !theirCardId}
                      className={cn(
                        'px-6 py-2 rounded-xl font-bold text-sm transition',
                        myCardId && theirCardId
                          ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                          : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      )}
                    >
                      🤝 Обміняти
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
