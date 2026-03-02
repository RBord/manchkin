import { useGameStore } from '../../store/gameStore'

export function GameLog() {
  const log = useGameStore(s => s.log)

  return (
    <div className="flex flex-col gap-1 h-36 overflow-y-auto px-3 py-2 bg-black/30 rounded-xl border border-white/5">
      <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Лог подій</p>
      {log.length === 0 && (
        <p className="text-gray-700 text-xs italic">Гра ще не почалась...</p>
      )}
      {log.map((entry, i) => (
        <p key={i} className="text-xs text-gray-400 leading-snug">
          <span className="text-gray-600 mr-1">›</span>{entry}
        </p>
      ))}
    </div>
  )
}
