import { useState } from 'react'
import { motion } from 'framer-motion'
import type { AnyCard } from '../../types'
import { CardFront } from './CardFront'
import { CardBack } from './CardBack'
import { cn } from '../../utils/cn'

interface MunchkinCardProps {
  card: AnyCard
  /** Show the front face by default */
  faceUp?: boolean
  /** Card is selectable and highlighted on hover */
  interactive?: boolean
  /** Card is selected / active */
  selected?: boolean
  /** Called when card is clicked */
  onClick?: (card: AnyCard) => void
  className?: string
  /** Disable flip on click */
  noFlip?: boolean
}

export function MunchkinCard({
  card,
  faceUp = false,
  interactive = true,
  selected = false,
  onClick,
  className,
  noFlip = false,
}: MunchkinCardProps) {
  const [flipped, setFlipped] = useState(faceUp)

  const handleClick = () => {
    if (!noFlip) setFlipped((f) => !f)
    onClick?.(card)
  }

  return (
    <div
      className={cn(
        'relative select-none',
        // Fixed card size (standard card ratio ~1:1.45)
        'w-[160px] h-[232px]',
        interactive && 'cursor-pointer',
        className
      )}
      style={{ perspective: '1000px' }}
      onClick={handleClick}
    >
      {/* Glow on selected */}
      {selected && (
        <div
          className="absolute -inset-1 rounded-xl blur-md opacity-60 pointer-events-none z-0"
          style={{ background: 'var(--color-gold)' }}
        />
      )}

      {/* Hover lift */}
      <motion.div
        className="relative w-full h-full z-10"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 0 : 180 }}
        whileHover={interactive ? { y: -6, scale: 1.03 } : undefined}
        transition={{
          rotateY: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
          y: { duration: 0.18 },
          scale: { duration: 0.18 },
        }}
      >
        {/* Front face */}
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          <CardFront card={card} />
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <CardBack category={card.category} />
        </div>
      </motion.div>
    </div>
  )
}
