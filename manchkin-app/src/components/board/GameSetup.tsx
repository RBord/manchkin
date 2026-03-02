import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export function GameSetup() {
  const startGame = useGameStore(s => s.startGame)
  const [names, setNames] = useState(['Герой 1', 'Герой 2'])

  const addPlayer = () => {
    if (names.length < 4) setNames([...names, `Герой ${names.length + 1}`])
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-8 w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--color-gold)' }}>⚔️ МАНЧКІН</h1>
          <p className="text-gray-500 text-sm mt-1">Нова гра</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-400 font-medium">Гравці (2–4):</p>
          {names.map((name, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-gray-600 text-sm w-5">{i + 1}.</span>
              <input
                value={name}
                onChange={e => {
                  const n = [...names]
                  n[i] = e.target.value
                  setNames(n)
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-yellow-600 transition"
                placeholder={`Ім'я гравця ${i + 1}`}
              />
              {names.length > 2 && (
                <button
                  onClick={() => setNames(names.filter((_, j) => j !== i))}
                  className="text-red-500 hover:text-red-400 text-sm cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {names.length < 4 && (
            <button
              onClick={addPlayer}
              className="text-sm text-gray-500 hover:text-gray-300 border border-dashed border-white/10 rounded-lg py-2 transition cursor-pointer"
            >
              + Додати гравця
            </button>
          )}
        </div>

        <button
          onClick={() => startGame(names.filter(Boolean))}
          disabled={names.length < 2}
          className="w-full py-3 rounded-xl font-bold text-black bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer text-lg"
        >
          🎲 Почати Гру!
        </button>
      </div>
    </div>
  )
}
