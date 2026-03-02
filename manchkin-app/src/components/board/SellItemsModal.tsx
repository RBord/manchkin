import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import type { ItemCard } from '../../types'
import { cn } from '../../utils/cn'

interface SellItemsModalProps {
  open: boolean
  onClose: () => void
}

export function SellItemsModal({ open, onClose }: SellItemsModalProps) {
  const { players, currentPlayerIndex, sellItems } = useGameStore()
  const player = players[currentPlayerIndex]
  const [selected, setSelected] = useState<Set<string>>(new Set())

  if (!player) return null

  const sellableItems = player.hand.filter(c => c.type === 'item') as ItemCard[]
  const totalGold = sellableItems
    .filter(c => selected.has(c.id))
    .reduce((s, c) => s + c.value, 0)
  const pendingGold = player.gold + totalGold
  const levelsToGain = Math.floor(pendingGold / 1000)

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSell = () => {
    if (selected.size === 0) return
    sellItems([...selected])
    setSelected(new Set())
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  className="fixed left-1/2 top-1/2 z-50 w-[380px] rounded-2xl border border-yellow-700 bg-[#111827] shadow-2xl outline-none"
                  initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
                  animate={{ opacity: 1, scale: 1,   x: '-50%', y: '-50%' }}
                  exit={{    opacity: 0, scale: 0.9, x: '-50%', y: '-48%' }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Header */}
                  <div className="px-4 py-3 bg-yellow-900/40 flex items-center justify-between rounded-t-2xl">
                    <div>
                      <Dialog.Title className="text-white font-bold">💰 Продати Предмети</Dialog.Title>
                      <p className="text-xs text-yellow-600 mt-0.5">1000 золотих = +1 рівень (макс. 9)</p>
                    </div>
                    <Dialog.Close className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition cursor-pointer">
                      ✕
                    </Dialog.Close>
                  </div>

                  {/* Items list */}
                  <div className="px-4 py-3 flex flex-col gap-2 max-h-[320px] overflow-y-auto">
                    {sellableItems.length === 0 ? (
                      <p className="text-gray-600 text-sm text-center py-4">
                        Немає предметів для продажу в руці
                      </p>
                    ) : (
                      sellableItems.map(item => {
                        const isSelected = selected.has(item.id)
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggle(item.id)}
                            className={cn(
                              'flex items-center justify-between px-3 py-2 rounded-xl border transition cursor-pointer text-left',
                              isSelected
                                ? 'border-yellow-500 bg-yellow-900/40'
                                : 'border-white/10 bg-white/5 hover:border-yellow-700'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                'w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition',
                                isSelected ? 'border-yellow-500 bg-yellow-500 text-black' : 'border-white/20'
                              )}>
                                {isSelected && '✓'}
                              </span>
                              <div>
                                <p className="text-sm text-white font-medium">{item.name}</p>
                                <p className="text-[10px] text-gray-500">+{item.bonus} до бою · {item.slot}</p>
                              </div>
                            </div>
                            <span className="text-yellow-400 font-bold text-sm">{item.value} зол.</span>
                          </button>
                        )
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-white/10 flex flex-col gap-2">
                    {/* Gold progress */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Накопичено: <span className="text-yellow-400 font-bold">{player.gold}</span> зол.
                      </span>
                      {totalGold > 0 && (
                        <span className="text-yellow-300">
                          + {totalGold} = <span className="font-bold">{pendingGold}</span> зол.
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-500 rounded-full"
                        animate={{ width: `${Math.min(100, (pendingGold % 1000) / 10)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {levelsToGain > 0 && (
                      <p className="text-green-400 text-xs font-bold text-center">
                        🎉 +{levelsToGain} рівень після продажу!
                      </p>
                    )}

                    <button
                      onClick={handleSell}
                      disabled={selected.size === 0}
                      className="w-full py-2.5 rounded-xl font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-yellow-600 hover:bg-yellow-500 text-black"
                    >
                      Продати{selected.size > 0 ? ` (${totalGold} зол.)` : ''}
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
