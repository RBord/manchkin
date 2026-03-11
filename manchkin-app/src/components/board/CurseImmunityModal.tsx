import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { MunchkinCard } from '../cards/MunchkinCard'
import type { PotionCard } from '../../types'

export function CurseImmunityModal() {
  const { pendingCurse, players, useCurseImmunity, skipCurseImmunity } = useGameStore()

  if (!pendingCurse) return null

  const target = players.find(p => p.id === pendingCurse.targetPlayerId)
  if (!target) return null

  const antiCurseCards = target.hand.filter(c =>
    (c.type === 'potion' || c.type === 'one-shot') && (c as PotionCard).antiCurse
  ) as PotionCard[]

  return (
    <AnimatePresence>
      <motion.div
        key="curse-immunity-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Panel */}
        <motion.div
          className="relative z-10 bg-purple-950/95 border border-purple-600 rounded-2xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4"
          initial={{ scale: 0.8, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              className="text-4xl mb-1"
              animate={{ rotate: [0, -10, 10, -8, 8, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              🛡️
            </motion.div>
            <h2 className="text-lg font-black text-purple-200">Захист від прокляття!</h2>
            <p className="text-xs text-gray-400 mt-1">
              <span className="text-white font-bold">{target.name}</span>
              , на тебе направлено прокляття
            </p>
          </div>

          {/* Curse details */}
          <div className="bg-purple-900/60 border border-purple-800 rounded-xl p-3 text-center">
            <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1">Прокляття</p>
            <p className="text-sm font-bold text-white">{pendingCurse.curse.name}</p>
            <p className="text-xs text-gray-400 mt-1">{pendingCurse.curse.effect.description}</p>
          </div>

          {/* Immunity cards */}
          {antiCurseCards.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider text-center">
                Твої захисні карти:
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {antiCurseCards.map(card => (
                  <div key={card.id} className="flex flex-col items-center gap-2">
                    {/* Mini card preview */}
                    <div className="transform scale-[0.65] origin-top -mb-8">
                      <MunchkinCard card={card} faceUp noFlip interactive={false} />
                    </div>
                    <div className="text-center mt-1">
                      <p className="text-[10px] text-gray-300 font-bold truncate max-w-[100px]">{card.name}</p>
                    </div>
                    <button
                      onClick={() => useCurseImmunity(card.id)}
                      className="text-xs px-4 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold transition cursor-pointer whitespace-nowrap"
                    >
                      🛡️ Використати
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-white/10" />

          {/* Accept button */}
          <button
            onClick={skipCurseImmunity}
            className="w-full py-2.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-sm transition cursor-pointer"
          >
            😱 Прийняти прокляття
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
