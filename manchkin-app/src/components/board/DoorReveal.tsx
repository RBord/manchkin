import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { MunchkinCard } from '../cards/MunchkinCard'
import type { MonsterCard, CurseCard } from '../../types'
import { cn } from '../../utils/cn'

const TYPE_DRAMA: Record<string, { title: string; subtitle: string; color: string; bg: string; icon: string }> = {
  monster: {
    title: 'МОНСТР!',
    subtitle: 'Готуйся до бою, герою...',
    color: 'text-red-400',
    bg: 'bg-red-950/60 border-red-700',
    icon: '👹',
  },
  curse: {
    title: 'ПРОКЛЯТТЯ!',
    subtitle: 'О ні. Це дуже погано.',
    color: 'text-purple-400',
    bg: 'bg-purple-950/60 border-purple-700',
    icon: '💀',
  },
  race: {
    title: 'ЗНАЙДЕНО РАСУ',
    subtitle: 'Картка іде в твою руку',
    color: 'text-green-400',
    bg: 'bg-green-950/60 border-green-700',
    icon: '🧝',
  },
  class: {
    title: 'ЗНАЙДЕНО КЛАС',
    subtitle: 'Картка іде в твою руку',
    color: 'text-blue-400',
    bg: 'bg-blue-950/60 border-blue-700',
    icon: '⚔️',
  },
}

const BUTTON_CONFIG: Record<string, { label: string; style: string }> = {
  monster: { label: '⚔️ На бій!', style: 'bg-red-700 hover:bg-red-600 text-white' },
  curse:   { label: '😱 Прийняти прокляття', style: 'bg-purple-700 hover:bg-purple-600 text-white' },
  race:    { label: '✋ Взяти в руку', style: 'bg-green-700 hover:bg-green-600 text-white' },
  class:   { label: '✋ Взяти в руку', style: 'bg-blue-700 hover:bg-blue-600 text-white' },
}

export function DoorReveal() {
  const { phase, revealedCard, acknowledgeReveal } = useGameStore()

  if (phase !== 'door-reveal' || !revealedCard) return null

  const drama = TYPE_DRAMA[revealedCard.type] ?? TYPE_DRAMA.race
  const btn = BUTTON_CONFIG[revealedCard.type] ?? BUTTON_CONFIG.race

  return (
    <AnimatePresence>
      <motion.div
        key="door-reveal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Content */}
        <motion.div
          className="relative flex flex-col items-center gap-5 z-10"
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 }}
        >
          {/* Drama header */}
          <motion.div
            className={cn('px-6 py-3 rounded-2xl border text-center', drama.bg)}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <motion.span
                className="text-3xl"
                animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1.3, 1.1, 1.1, 1] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {drama.icon}
              </motion.span>
              <h2 className={cn('text-2xl font-black tracking-widest', drama.color)}>
                {drama.title}
              </h2>
              <motion.span
                className="text-3xl"
                animate={{ rotate: [0, 15, -15, 10, -10, 0], scale: [1, 1.3, 1.3, 1.1, 1.1, 1] }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                {drama.icon}
              </motion.span>
            </div>
            <p className="text-gray-400 text-sm">{drama.subtitle}</p>
          </motion.div>

          {/* Card — flips in */}
          <motion.div
            initial={{ rotateY: 180, scale: 0.8 }}
            animate={{ rotateY: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ perspective: 1000 }}
          >
            <MunchkinCard card={revealedCard} faceUp noFlip interactive={false} className="shadow-2xl" />
          </motion.div>

          {/* Extra info for curse */}
          {revealedCard.type === 'curse' && (
            <motion.div
              className="bg-purple-950/80 border border-purple-800 rounded-xl px-5 py-3 text-center max-w-[260px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs text-purple-400 font-bold uppercase mb-1">Ефект</p>
              <p className="text-sm text-gray-300">{(revealedCard as CurseCard).effect.description}</p>
            </motion.div>
          )}

          {/* Extra info for monster */}
          {revealedCard.type === 'monster' && (
            <motion.div
              className="bg-red-950/80 border border-red-800 rounded-xl px-5 py-3 flex gap-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div>
                <p className="text-xs text-red-400 font-bold uppercase mb-0.5">Рівень</p>
                <p className="text-2xl font-black text-red-300">{(revealedCard as MonsterCard).level}</p>
              </div>
              <div className="w-px bg-red-900" />
              <div>
                <p className="text-xs text-red-400 font-bold uppercase mb-0.5">Скарби</p>
                <p className="text-2xl font-black text-yellow-400">×{(revealedCard as MonsterCard).treasures}</p>
              </div>
              <div className="w-px bg-red-900" />
              <div className="max-w-[120px]">
                <p className="text-xs text-red-400 font-bold uppercase mb-0.5">Лихо</p>
                <p className="text-xs text-gray-300">{(revealedCard as MonsterCard).badStuff}</p>
              </div>
            </motion.div>
          )}

          {/* Action button */}
          <motion.button
            onClick={acknowledgeReveal}
            className={cn(
              'px-8 py-3 rounded-xl text-base font-bold transition cursor-pointer shadow-lg',
              btn.style
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {btn.label}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
