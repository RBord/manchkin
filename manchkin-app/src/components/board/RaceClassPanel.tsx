import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { MunchkinCard } from '../cards/MunchkinCard'
import { cn } from '../../utils/cn'

interface SlotProps {
  label: string
  sublabel: string
  emptyIcon: string
  emptyText: string
  borderColor: string
  bgColor: string
  accentColor: string
  children?: React.ReactNode
  onRemove?: () => void
}

function CardSlot({ label, sublabel, emptyIcon, emptyText, borderColor, bgColor, accentColor, children, onRemove }: SlotProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Slot label */}
      <div className="text-center">
        <p className={cn('text-[10px] font-bold tracking-widest uppercase', accentColor)}>{label}</p>
        <p className="text-[9px] text-gray-600">{sublabel}</p>
      </div>

      {/* Card or placeholder */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {children ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'w-[160px] h-[232px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2',
                borderColor, bgColor
              )}
            >
              <span className="text-3xl opacity-30">{emptyIcon}</span>
              <span className={cn('text-[10px] text-center px-4', accentColor, 'opacity-40')}>{emptyText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Remove button — only when slot is filled */}
        {children && onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-900 hover:bg-red-700 border border-red-700 text-red-300 text-xs flex items-center justify-center transition z-20 cursor-pointer"
            title="Скинути"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function RaceClassPanel() {
  const player = useGameStore(s => s.players[s.currentPlayerIndex])
  const removeRace = useGameStore(s => s.removeRace)
  const removeClass = useGameStore(s => s.removeClass)

  if (!player) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Персонаж</p>

      <div className="flex gap-4 p-3 bg-black/20 rounded-xl border border-white/5">
        {/* Race slot */}
        <CardSlot
          label="Раса"
          sublabel={player.raceCard ? player.raceCard.name : 'Людина (за замовчуванням)'}
          emptyIcon="🧑"
          emptyText="Зіграй карту раси з руки"
          borderColor="border-green-800"
          bgColor="bg-green-950/30"
          accentColor="text-green-500"
          onRemove={player.raceCard ? removeRace : undefined}
        >
          {player.raceCard && (
            <MunchkinCard card={player.raceCard} faceUp noFlip interactive={false} />
          )}
        </CardSlot>

        {/* Divider */}
        <div className="w-px bg-white/5 self-stretch" />

        {/* Class slot */}
        <CardSlot
          label="Клас"
          sublabel={player.classCard ? player.classCard.name : 'Без класу'}
          emptyIcon="⚔️"
          emptyText="Зіграй карту класу з руки"
          borderColor="border-blue-800"
          bgColor="bg-blue-950/30"
          accentColor="text-blue-500"
          onRemove={player.classCard ? removeClass : undefined}
        >
          {player.classCard && (
            <MunchkinCard card={player.classCard} faceUp noFlip interactive={false} />
          )}
        </CardSlot>

        {/* Abilities summary — shows when at least one slot is filled */}
        {(player.raceCard || player.classCard) && (
          <div className="flex-1 flex flex-col gap-2 justify-center pl-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Здібності</p>
            {player.raceCard && (
              <div className="bg-green-950/40 border border-green-900 rounded-lg px-3 py-2">
                <p className="text-[10px] text-green-500 font-bold uppercase mb-0.5">{player.raceCard.name}</p>
                <p className="text-xs text-gray-300">{player.raceCard.ability}</p>
              </div>
            )}
            {player.classCard && (
              <div className="bg-blue-950/40 border border-blue-900 rounded-lg px-3 py-2">
                <p className="text-[10px] text-blue-500 font-bold uppercase mb-0.5">{player.classCard.name}</p>
                <p className="text-xs text-gray-300">{player.classCard.ability}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
