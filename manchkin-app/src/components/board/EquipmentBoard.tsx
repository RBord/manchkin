import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SLOT_LABELS, SLOT_ICONS, handsUsed } from '../../utils/equipment'
import { MunchkinCard } from '../cards/MunchkinCard'
import type { ItemSlot, ItemCard } from '../../types'
import { cn } from '../../utils/cn'

// Body slots shown in a 2-column grid
const BODY_SLOTS: ItemSlot[] = ['head', 'armor', 'footwear', 'gloves', 'accessory']
// Weapon slots shown separately with hand counter
const WEAPON_SLOTS: ItemSlot[] = ['weapon-1h', 'weapon-2h', 'weapon-ranged']

function SlotRow({
  slot, items, onUnequip,
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
        <div className="h-10 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-gray-700 text-[10px]">
          —
        </div>
      ) : (
        <AnimatePresence>
          {items.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
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
      )}
    </div>
  )
}

function WeaponCard({ item, onUnequip, handCost }: { item: ItemCard; onUnequip: (id: string) => void; handCost: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-col items-center gap-1.5"
    >
      {/* Mini card preview — interactive so ℹ works */}
      <div className="transform scale-75 origin-top -mb-6">
        <MunchkinCard card={item} faceUp noFlip />
      </div>
      <div className={cn(
        'flex items-center gap-1 px-2 py-1 rounded-lg border text-xs mt-1',
        item.legendary ? 'bg-yellow-950/60 border-yellow-600/50 text-yellow-300' : 'bg-white/5 border-white/10 text-white'
      )}>
        {item.legendary && <span className="text-yellow-500">★</span>}
        <span className="font-bold truncate max-w-[80px]">{item.name}</span>
        <span className="text-green-400">+{item.bonus}</span>
        <span className="text-gray-600 text-[10px]">{'🖐'.repeat(handCost)}</span>
      </div>
      <button
        onClick={() => onUnequip(item.id)}
        className="text-[10px] px-2 py-0.5 rounded bg-red-900/50 hover:bg-red-800 text-red-400 transition cursor-pointer"
      >
        ✕ Зняти
      </button>
    </motion.div>
  )
}

export function EquipmentBoard() {
  const { players, currentPlayerIndex, unequipItem } = useGameStore()
  const player = players[currentPlayerIndex]

  if (!player) return null

  const totalBonus = player.equipped.reduce((s, i) => s + i.bonus, 0)
  const usedHands = handsUsed(player.equipped)
  const maxHands = player.class === 'warrior' ? 4 : 2

  const bySlot = (slot: ItemSlot) => player.equipped.filter(i => i.slot === slot)

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{player.equipped.length} предметів надягнено</span>
        <span className="text-green-400 font-bold">+{totalBonus} до сили</span>
      </div>

      {/* Weapon / hands section */}
      <div className="bg-black/20 rounded-xl border border-white/10 p-3 flex flex-col gap-3">
        {/* Hand counter */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">⚔️ Зброя</p>
          <div className="flex items-center gap-2">
            {/* Hand pip indicators */}
            <div className="flex gap-1">
              {Array.from({ length: maxHands }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-5 h-5 rounded border text-[10px] flex items-center justify-center',
                    i < usedHands
                      ? 'bg-orange-700 border-orange-600 text-white'
                      : 'bg-white/5 border-white/10 text-gray-700'
                  )}
                >
                  🖐
                </div>
              ))}
            </div>
            <span className={cn('text-xs font-bold', usedHands >= maxHands ? 'text-red-400' : 'text-gray-500')}>
              {usedHands}/{maxHands} рук
            </span>
          </div>
        </div>

        {/* Weapon rule hint */}
        <p className="text-[10px] text-gray-600">
          {player.class === 'warrior'
            ? 'Воїн: 2 однорукових, або 2 дворучних, або будь-яка комбінація на 4 руки'
            : '2 однорукових зброї — або 1 дворучна (2 руки)'}
        </p>

        {/* Weapon cards */}
        {WEAPON_SLOTS.some(s => bySlot(s).length > 0) ? (
          <div className="flex flex-wrap gap-3 justify-center">
            <AnimatePresence>
              {bySlot('weapon-1h').map(item => (
                <WeaponCard key={item.id} item={item} onUnequip={unequipItem} handCost={1} />
              ))}
              {bySlot('weapon-2h').map(item => (
                <WeaponCard key={item.id} item={item} onUnequip={unequipItem} handCost={2} />
              ))}
              {bySlot('weapon-ranged').map(item => (
                <WeaponCard key={item.id} item={item} onUnequip={unequipItem} handCost={1} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <p className="text-center text-gray-700 text-xs py-2">Без зброї</p>
        )}
      </div>

      {/* Body armor grid */}
      <div className="grid grid-cols-2 gap-2">
        {BODY_SLOTS.map(slot => (
          <SlotRow
            key={slot}
            slot={slot}
            items={bySlot(slot)}
            onUnequip={unequipItem}
          />
        ))}
      </div>

      {/* 'none' slot items */}
      {bySlot('none').length > 0 && (
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{SLOT_ICONS.none} {SLOT_LABELS.none}</p>
          <div className="flex flex-wrap gap-2">
            {bySlot('none').map(item => (
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
        </div>
      )}

      {player.equipped.length === 0 && (
        <p className="text-gray-600 text-sm text-center py-4">Нічого не надето</p>
      )}
    </div>
  )
}
