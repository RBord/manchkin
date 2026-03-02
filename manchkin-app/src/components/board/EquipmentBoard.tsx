import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SLOT_LABELS, SLOT_ICONS } from '../../utils/equipment'
import type { ItemSlot, ItemCard } from '../../types'
import { cn } from '../../utils/cn'

const SLOT_ORDER: ItemSlot[] = ['head', 'armor', 'footwear', 'gloves', 'weapon-1h', 'weapon-2h', 'weapon-ranged', 'accessory']

function SlotCell({
  slot, items, onUnequip
}: {
  slot: ItemSlot
  items: ItemCard[]
  onUnequip: (id: string) => void
}) {
  const isEmpty = items.length === 0
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <span className="text-sm">{SLOT_ICONS[slot]}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{SLOT_LABELS[slot]}</span>
      </div>

      {isEmpty ? (
        <div className="w-full h-14 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-gray-700 text-[10px]">
          порожньо
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <AnimatePresence>
            {items.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={cn(
                  'flex items-center justify-between px-2 py-1.5 rounded-lg border',
                  item.legendary
                    ? 'bg-yellow-950/60 border-yellow-600/50'
                    : 'bg-white/5 border-white/10'
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-xs font-bold truncate',
                    item.legendary ? 'text-yellow-300' : 'text-white'
                  )}>
                    {item.legendary && <span className="text-yellow-500 mr-1">★</span>}
                    {item.name}
                  </p>
                  <p className="text-[10px] text-green-400">+{item.bonus}</p>
                </div>
                <button
                  onClick={() => onUnequip(item.id)}
                  className="ml-2 w-5 h-5 rounded bg-red-900/50 hover:bg-red-800 text-red-400 text-[10px] flex items-center justify-center transition cursor-pointer flex-shrink-0"
                  title="Зняти"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export function EquipmentBoard() {
  const { players, currentPlayerIndex, unequipItem } = useGameStore()
  const player = players[currentPlayerIndex]

  if (!player) return null

  const totalBonus = player.equipped.reduce((s, i) => s + i.bonus, 0)

  // Group equipped items by slot
  const bySlot = SLOT_ORDER.reduce<Record<ItemSlot, ItemCard[]>>((acc, slot) => {
    acc[slot] = player.equipped.filter(i => i.slot === slot)
    return acc
  }, {} as Record<ItemSlot, ItemCard[]>)

  return (
    <div className="flex flex-col gap-3">
      {/* Summary */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{player.equipped.length} предметів надягнено</span>
        <span className="text-green-400 font-bold">+{totalBonus} до сили</span>
      </div>

      {/* Slot grid */}
      <div className="grid grid-cols-2 gap-2">
        {SLOT_ORDER.map(slot => (
          <SlotCell
            key={slot}
            slot={slot}
            items={bySlot[slot]}
            onUnequip={unequipItem}
          />
        ))}
      </div>

      {/* 'none' slot items */}
      {player.equipped.filter(i => i.slot === 'none').length > 0 && (
        <div className="flex flex-wrap gap-2">
          {player.equipped.filter(i => i.slot === 'none').map(item => (
            <div
              key={item.id}
              className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs"
            >
              <span className="text-white">{item.name}</span>
              <span className="text-green-400">+{item.bonus}</span>
              <button
                onClick={() => unequipItem(item.id)}
                className="ml-1 text-red-400 hover:text-red-300 cursor-pointer"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {player.equipped.length === 0 && (
        <p className="text-gray-600 text-sm text-center py-4">Нічого не надето</p>
      )}
    </div>
  )
}
