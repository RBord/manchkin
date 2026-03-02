import type { CardCategory } from '../../types'
import { cn } from '../../utils/cn'

interface CardBackProps {
  category: CardCategory
  className?: string
}

const PATTERNS = {
  door: {
    bg: 'bg-stone-900',
    border: 'border-stone-600',
    label: 'ДВЕРІ',
    labelColor: 'text-stone-400',
    icon: '🚪',
    pattern: 'door',
  },
  treasure: {
    bg: 'bg-yellow-950',
    border: 'border-yellow-700',
    label: 'СКАРБ',
    labelColor: 'text-yellow-500',
    icon: '💰',
    pattern: 'treasure',
  },
}

export function CardBack({ category, className }: CardBackProps) {
  const config = PATTERNS[category]

  return (
    <div
      className={cn(
        'w-full h-full rounded-xl border-2 flex flex-col items-center justify-center overflow-hidden',
        config.bg,
        config.border,
        className
      )}
      style={{ backfaceVisibility: 'hidden' }}
    >
      {/* Dungeon pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 8px,
              rgba(255,255,255,0.05) 8px,
              rgba(255,255,255,0.05) 16px
            )
          `,
        }}
      />

      {/* Center emblem */}
      <div className="relative flex flex-col items-center gap-3">
        <div
          className={cn(
            'w-20 h-20 rounded-full border-2 flex items-center justify-center text-4xl',
            config.border,
            category === 'door' ? 'bg-stone-800' : 'bg-yellow-900'
          )}
        >
          {config.icon}
        </div>

        <div
          className={cn(
            'text-xs font-bold tracking-[0.3em] uppercase',
            config.labelColor
          )}
        >
          {config.label}
        </div>

        {/* Decorative lines */}
        <div className="flex items-center gap-2 w-28">
          <div className={cn('flex-1 h-px', category === 'door' ? 'bg-stone-600' : 'bg-yellow-700')} />
          <span className={cn('text-xs', config.labelColor)}>✦</span>
          <div className={cn('flex-1 h-px', category === 'door' ? 'bg-stone-600' : 'bg-yellow-700')} />
        </div>

        <div className={cn('text-xs font-semibold', config.labelColor)}>
          МАНЧКІН
        </div>
      </div>
    </div>
  )
}
