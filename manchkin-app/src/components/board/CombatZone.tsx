import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { MunchkinCard } from '../cards/MunchkinCard'
import { cn } from '../../utils/cn'

export function CombatZone() {
  const { combatCards, players } = useGameStore()

  const heroCards = combatCards.filter(e => e.side === 'hero')
  const monsterCards = combatCards.filter(e => e.side === 'monster')

  if (combatCards.length === 0) return null

  const playerName = (id: string) => players.find(p => p.id === id)?.name ?? id

  return (
    <div className="flex gap-4 w-full justify-center">
      {/* Hero side */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {heroCards.length > 0 && (
          <>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider text-center">
              🦸 Герої
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <AnimatePresence>
                {heroCards.map((entry, i) => (
                  <motion.div
                    key={entry.card.id}
                    initial={{ opacity: 0, y: -20, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className="transform scale-[0.6] origin-top">
                      <MunchkinCard card={entry.card} faceUp noFlip interactive={false} />
                    </div>
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      'bg-green-900 text-green-300'
                    )}>
                      +{entry.bonus} · {playerName(entry.playedById)}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      {heroCards.length > 0 && monsterCards.length > 0 && (
        <div className="w-px bg-white/10 self-stretch mx-1" />
      )}

      {/* Monster side */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {monsterCards.length > 0 && (
          <>
            <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider text-center">
              👿 Монстр
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <AnimatePresence>
                {monsterCards.map((entry, i) => (
                  <motion.div
                    key={entry.card.id}
                    initial={{ opacity: 0, y: -20, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className="transform scale-[0.6] origin-top">
                      <MunchkinCard card={entry.card} faceUp noFlip interactive={false} />
                    </div>
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      'bg-red-900 text-red-300'
                    )}>
                      +{entry.bonus} · {playerName(entry.playedById)}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
