import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { cn } from '../../utils/cn'

const DICE_FACES: Record<number, string> = {
  1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅',
}

export function DiceRollOverlay() {
  const { diceRoll, dismissDice } = useGameStore()

  return (
    <AnimatePresence>
      {diceRoll && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={dismissDice}
          />

          {/* Panel */}
          <motion.div
            className={cn(
              'relative z-10 flex flex-col items-center gap-5 px-10 py-8 rounded-3xl border-2',
              diceRoll.success
                ? 'bg-green-950 border-green-600'
                : 'bg-red-950 border-red-700'
            )}
            initial={{ scale: 0.4, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <p className="text-sm text-gray-400 uppercase tracking-widest">Кидок кубика</p>

            {/* Dice with rolling animation */}
            <motion.div
              className="text-[96px] leading-none select-none"
              initial={{ rotate: -720, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.05 }}
            >
              {DICE_FACES[diceRoll.value]}
            </motion.div>

            {/* Value */}
            <motion.div
              className={cn(
                'text-5xl font-black',
                diceRoll.success ? 'text-green-300' : 'text-red-300'
              )}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {diceRoll.value}
            </motion.div>

            {/* Result */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              {diceRoll.success ? (
                <>
                  <p className="text-2xl font-bold text-green-400">🏃 Втеча вдалась!</p>
                  <p className="text-sm text-gray-400 mt-1">Потрібно було 5 або 6</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-red-400">😱 Не вдалось втекти!</p>
                  {diceRoll.badStuff && (
                    <p className="text-sm text-red-300 mt-1">
                      <span className="text-red-500 font-bold">Лихо: </span>
                      {diceRoll.badStuff}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Потрібно було 5 або 6</p>
                </>
              )}
            </motion.div>

            {/* Dismiss button */}
            <motion.button
              onClick={dismissDice}
              className={cn(
                'px-8 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer',
                diceRoll.success
                  ? 'bg-green-700 hover:bg-green-600 text-white'
                  : 'bg-red-800 hover:bg-red-700 text-white'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Зрозуміло
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
