import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import type { AnyCard, MonsterCard, ItemCard, PotionCard, CurseCard, RaceCard, ClassCard } from '../../types'
import { cn } from '../../utils/cn'

// ─── Type config (copy-free — just a local lookup) ────────────────────────────

const TYPE_CONFIG = {
  monster:  { label: 'МОНСТР',     icon: '👹', accent: 'text-red-400',    border: 'border-red-700',    bg: 'bg-red-900/40'    },
  curse:    { label: 'ПРОКЛЯТТЯ',  icon: '💀', accent: 'text-purple-400', border: 'border-purple-700', bg: 'bg-purple-900/40' },
  race:     { label: 'РАСА',       icon: '🧝', accent: 'text-green-400',  border: 'border-green-700',  bg: 'bg-green-900/40'  },
  class:    { label: 'КЛАС',       icon: '⚔️', accent: 'text-blue-400',   border: 'border-blue-700',   bg: 'bg-blue-900/40'   },
  item:     { label: 'ПРЕДМЕТ',    icon: '🗡️', accent: 'text-yellow-400', border: 'border-yellow-600', bg: 'bg-yellow-900/40' },
  potion:   { label: 'ЗІЛЛЯ',      icon: '🧪', accent: 'text-cyan-400',   border: 'border-cyan-700',   bg: 'bg-cyan-900/40'   },
  'one-shot':{ label: 'РАЗОВЕ',   icon: '💥', accent: 'text-orange-400', border: 'border-orange-700', bg: 'bg-orange-900/40' },
} as const

const SLOT_LABELS: Record<string, string> = {
  head: '🪖 Голова',
  armor: '🛡️ Броня',
  footwear: '👢 Взуття',
  'hands-1': '🤜 Рука (1)',
  'hands-2': '🤛 Рука (2)',
  none: '— Немає слоту',
}

// ─── Detail rows ──────────────────────────────────────────────────────────────

function Row({ label, value, accent }: { label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className={cn('text-xs font-medium text-right', accent ?? 'text-gray-200')}>{value}</span>
    </div>
  )
}

function CardDetails({ card }: { card: AnyCard }) {
  if (card.type === 'monster') {
    const m = card as MonsterCard
    return (
      <>
        <Row label="Рівень" value={m.level} accent="text-red-400" />
        <Row label="Скарби" value={`${m.treasures} шт.`} accent="text-yellow-400" />
        <Row label="Лихо" value={m.badStuff} accent="text-red-300" />
        {m.bonuses?.map((b, i) => (
          <Row
            key={i}
            label={`Бонус проти`}
            value={`+${b.bonus} vs ${b.against?.join(', ')}`}
            accent="text-orange-400"
          />
        ))}
      </>
    )
  }

  if (card.type === 'item') {
    const i = card as ItemCard
    return (
      <>
        <Row label="Бонус до бою" value={`+${i.bonus}`} accent="text-yellow-400" />
        <Row label="Слот" value={SLOT_LABELS[i.slot] ?? i.slot} />
        {i.bigItem && <Row label="Тип" value="Великий предмет" accent="text-orange-400" />}
      </>
    )
  }

  if (card.type === 'potion' || card.type === 'one-shot') {
    const p = card as PotionCard
    return (
      <>
        <Row label="Ефект" value={p.effect.description} accent="text-cyan-300" />
        {p.value && <Row label="Вартість продажу" value={`${p.value} зол.`} accent="text-yellow-400" />}
      </>
    )
  }

  if (card.type === 'curse') {
    const c = card as CurseCard
    return <Row label="Ефект" value={c.effect.description} accent="text-purple-300" />
  }

  if (card.type === 'race') {
    const r = card as RaceCard
    return (
      <>
        <Row label="Здібність" value={r.ability} accent="text-green-300" />
        {r.passiveBonus != null && r.passiveBonus > 0 && (
          <Row label="Пасивний бонус" value={`+${r.passiveBonus}`} accent="text-green-400" />
        )}
      </>
    )
  }

  if (card.type === 'class') {
    const c = card as ClassCard
    return (
      <>
        <Row label="Здібність" value={c.ability} accent="text-blue-300" />
        {c.passiveBonus != null && c.passiveBonus > 0 && (
          <Row label="Пасивний бонус" value={`+${c.passiveBonus}`} accent="text-blue-400" />
        )}
      </>
    )
  }

  return null
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface CardInfoModalProps {
  card: AnyCard
  open: boolean
  onClose: () => void
}

export function CardInfoModal({ card, open, onClose }: CardInfoModalProps) {
  const cfg = TYPE_CONFIG[card.type]

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              {/* Overlay */}
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              {/* Panel */}
              <Dialog.Content asChild>
                <motion.div
                  className={cn(
                    'fixed left-1/2 top-1/2 z-50 w-[320px] rounded-2xl border-2 overflow-hidden shadow-2xl',
                    'bg-[#111827] outline-none',
                    cfg.border
                  )}
                  initial={{ opacity: 0, scale: 0.88, x: '-50%', y: '-48%' }}
                  animate={{ opacity: 1, scale: 1,    x: '-50%', y: '-50%' }}
                  exit={{    opacity: 0, scale: 0.92, x: '-50%', y: '-48%' }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                >
                  {/* Header */}
                  <div className={cn('px-4 py-3 flex items-center justify-between', cfg.bg)}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cfg.icon}</span>
                      <div>
                        <p className={cn('text-[10px] font-bold tracking-widest uppercase', cfg.accent)}>
                          {cfg.label}
                        </p>
                        <Dialog.Title className="text-white font-bold text-base leading-tight">
                          {card.name}
                        </Dialog.Title>
                      </div>
                    </div>

                    {/* Close */}
                    <Dialog.Close
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-gray-400 hover:text-white shrink-0"
                      aria-label="Закрити"
                    >
                      ✕
                    </Dialog.Close>
                  </div>

                  {/* Image */}
                  <div className="mx-4 mt-3 rounded-xl overflow-hidden bg-black/50 aspect-[16/9] flex items-center justify-center border border-white/10">
                    {card.imageUrl ? (
                      <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl opacity-30">{cfg.icon}</span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="px-4 pt-3 pb-4 flex flex-col gap-3">
                    {/* Description */}
                    <p className="text-sm text-gray-300 leading-relaxed">{card.description}</p>

                    {/* Stats */}
                    <div className={cn('rounded-xl border px-3 py-1', cfg.border, cfg.bg)}>
                      <CardDetails card={card} />
                    </div>

                    {/* Flavor */}
                    {card.flavor && (
                      <p className="text-xs text-gray-500 italic text-center border-t border-white/5 pt-2">
                        {card.flavor}
                      </p>
                    )}
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
