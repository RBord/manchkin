import type { AnyCard, MonsterCard, ItemCard, PotionCard } from '../../types'
import { cn } from '../../utils/cn'

// ─── Per-type visual config ────────────────────────────────────────────────────

const TYPE_CONFIG = {
  monster: {
    label: 'МОНСТР',
    bg: 'bg-red-950',
    border: 'border-red-700',
    headerBg: 'bg-red-900',
    badge: 'bg-red-700 text-red-100',
    icon: '👹',
    accent: 'text-red-400',
    divider: 'bg-red-800',
  },
  curse: {
    label: 'ПРОКЛЯТТЯ',
    bg: 'bg-purple-950',
    border: 'border-purple-700',
    headerBg: 'bg-purple-900',
    badge: 'bg-purple-700 text-purple-100',
    icon: '💀',
    accent: 'text-purple-400',
    divider: 'bg-purple-800',
  },
  race: {
    label: 'РАСА',
    bg: 'bg-green-950',
    border: 'border-green-700',
    headerBg: 'bg-green-900',
    badge: 'bg-green-700 text-green-100',
    icon: '🧝',
    accent: 'text-green-400',
    divider: 'bg-green-800',
  },
  class: {
    label: 'КЛАС',
    bg: 'bg-blue-950',
    border: 'border-blue-700',
    headerBg: 'bg-blue-900',
    badge: 'bg-blue-700 text-blue-100',
    icon: '⚔️',
    accent: 'text-blue-400',
    divider: 'bg-blue-800',
  },
  item: {
    label: 'ПРЕДМЕТ',
    bg: 'bg-yellow-950',
    border: 'border-yellow-600',
    headerBg: 'bg-yellow-900',
    badge: 'bg-yellow-600 text-yellow-100',
    icon: '🗡️',
    accent: 'text-yellow-400',
    divider: 'bg-yellow-800',
  },
  potion: {
    label: 'ЗІЛЛЯ',
    bg: 'bg-cyan-950',
    border: 'border-cyan-700',
    headerBg: 'bg-cyan-900',
    badge: 'bg-cyan-700 text-cyan-100',
    icon: '🧪',
    accent: 'text-cyan-400',
    divider: 'bg-cyan-800',
  },
  'one-shot': {
    label: 'РАЗОВЕ',
    bg: 'bg-orange-950',
    border: 'border-orange-700',
    headerBg: 'bg-orange-900',
    badge: 'bg-orange-700 text-orange-100',
    icon: '💥',
    accent: 'text-orange-400',
    divider: 'bg-orange-800',
  },
} as const

// ─── Extra stats per card type ─────────────────────────────────────────────────

function CardStats({ card }: { card: AnyCard }) {
  if (card.type === 'monster') {
    const m = card as MonsterCard
    return (
      <div className="flex justify-between items-center text-xs mt-auto pt-2">
        <span className="flex items-center gap-1 text-red-300">
          <span>⚔️</span>
          <span>Рівень {m.level}</span>
        </span>
        <span className="flex items-center gap-1 text-yellow-400">
          <span>💰</span>
          <span>×{m.treasures}</span>
        </span>
      </div>
    )
  }

  if (card.type === 'item') {
    const i = card as ItemCard
    return (
      <div className="flex justify-between items-center text-xs mt-auto pt-2">
        <span className="text-yellow-400 font-bold">+{i.bonus} до бою</span>
        {i.bigItem && (
          <span className="text-orange-400 font-semibold">ВЕЛИКИЙ</span>
        )}
      </div>
    )
  }

  if (card.type === 'potion' || card.type === 'one-shot') {
    const p = card as PotionCard
    if (p.value) {
      return (
        <div className="flex justify-end text-xs mt-auto pt-2">
          <span className="text-yellow-400">{p.value} зол.</span>
        </div>
      )
    }
  }

  return null
}

// ─── Bad stuff for monsters ────────────────────────────────────────────────────

function BadStuff({ card }: { card: AnyCard }) {
  if (card.type !== 'monster') return null
  const m = card as MonsterCard
  return (
    <div className="bg-red-950 border border-red-800 rounded px-2 py-1 text-xs text-red-300 mt-1">
      <span className="text-red-500 font-bold">Лихо: </span>
      {m.badStuff}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface CardFrontProps {
  card: AnyCard
  className?: string
}

export function CardFront({ card, className }: CardFrontProps) {
  const cfg = TYPE_CONFIG[card.type]

  return (
    <div
      className={cn(
        'w-full h-full rounded-xl border-2 flex flex-col overflow-hidden',
        cfg.bg,
        cfg.border,
        className
      )}
      style={{ backfaceVisibility: 'hidden' }}
    >
      {/* Header */}
      <div className={cn('px-3 py-2 flex items-center justify-between', cfg.headerBg)}>
        <span className={cn('text-[10px] font-bold tracking-widest uppercase', cfg.accent)}>
          {cfg.label}
        </span>
        <span className="text-base leading-none">{cfg.icon}</span>
      </div>

      {/* Image area */}
      <div className="mx-2 mt-2 rounded-lg overflow-hidden bg-black/40 aspect-[4/3] flex items-center justify-center border border-white/10">
        {card.imageUrl ? (
          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl opacity-40">{cfg.icon}</span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-2 pb-2 pt-1 gap-1 min-h-0">
        {/* Name */}
        <div className="font-bold text-sm text-white leading-tight">{card.name}</div>

        {/* Divider */}
        <div className={cn('h-px w-full', cfg.divider)} />

        {/* Description */}
        <p className="text-[11px] text-gray-300 leading-snug line-clamp-3 flex-1">
          {card.description}
        </p>

        {/* Bad stuff */}
        <BadStuff card={card} />

        {/* Flavor */}
        {card.flavor && (
          <p className="text-[10px] text-gray-500 italic leading-tight line-clamp-2">
            {card.flavor}
          </p>
        )}

        {/* Stats */}
        <CardStats card={card} />
      </div>
    </div>
  )
}
