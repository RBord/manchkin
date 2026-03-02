import { useState } from 'react'
import { MunchkinCard } from './components/cards/MunchkinCard'
import { allSampleCards } from './data/sampleCards'
import type { AnyCard } from './types'

function App() {
  const [selected, setSelected] = useState<string | null>(null)

  const handleClick = (card: AnyCard) => {
    setSelected((prev) => (prev === card.id ? null : card.id))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--color-gold)' }}>
          ⚔️ МАНЧКІН
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Клікни на картку — побачиш лицьову сторону
        </p>
      </div>

      {/* Cards grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {allSampleCards.map((card) => (
          <div key={card.id} className="flex flex-col items-center gap-2">
            <MunchkinCard
              card={card}
              selected={selected === card.id}
              onClick={handleClick}
            />
            <span className="text-xs text-gray-500 capitalize">{card.type}</span>
          </div>
        ))}
      </div>

      {/* Selected card info */}
      {selected && (
        <div className="text-center text-sm text-gray-400">
          Обрано: <span className="text-white font-medium">
            {allSampleCards.find((c) => c.id === selected)?.name}
          </span>
        </div>
      )}
    </div>
  )
}

export default App
