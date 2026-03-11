import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { MunchkinCard } from '../cards/MunchkinCard'
import { RaceClassPanel } from './RaceClassPanel'
import { EquipmentBoard } from './EquipmentBoard'
import { canEquipItem, isItemRestricted } from '../../utils/equipment'
import type { AnyCard, ItemCard } from '../../types'
import { cn } from '../../utils/cn'

const RACE_ICONS: Record<string, string> = {
  human: '🧑', elf: '🧝', dwarf: '⛏️', halfling: '🍄',
}
const CLASS_ICONS: Record<string, string> = {
  none: '—', warrior: '⚔️', wizard: '🔮', thief: '🗝️', cleric: '✝️',
}

type HandTab = 'all' | 'monsters' | 'items' | 'potions' | 'other'
type MainTab = 'hand' | 'equipped' | 'showcase'

const HAND_LIMIT = 8

export function PlayerArea() {
  const {
    players, currentPlayerIndex, phase,
    equipItem, equipRace, equipClass, discardCard, playItemInCombat,
    showcaseItem, removeFromShowcase, castCurse,
  } = useGameStore()

  const player = players[currentPlayerIndex]
  const [mainTab, setMainTab] = useState<MainTab>('hand')
  const [handTab, setHandTab] = useState<HandTab>('all')
  const [castingCurse, setCastingCurse] = useState<string | null>(null) // cardId

  if (!player) return null

  const strength = useGameStore.getState().currentCombatStrength()

  const handleCardAction = (card: AnyCard) => {
    if (phase === 'monster-fight' && (card.type === 'potion' || card.type === 'one-shot')) {
      playItemInCombat(card.id)
    } else if (phase !== 'monster-fight' && card.type === 'item') {
      equipItem(card.id)
    }
  }

  // Filter hand cards by tab
  const filteredHand = player.hand.filter(card => {
    if (handTab === 'all') return true
    if (handTab === 'monsters') return card.type === 'monster'
    if (handTab === 'items') return card.type === 'item'
    if (handTab === 'potions') return card.type === 'potion' || card.type === 'one-shot'
    if (handTab === 'other') return card.type === 'curse' || card.type === 'race' || card.type === 'class'
    return true
  })

  const handOverLimit = player.hand.length > HAND_LIMIT
  const unlockedShowcase = player.showcase.filter(c => !isItemRestricted(player, c))
  const monstersCount = player.hand.filter(c => c.type === 'monster').length
  const itemsCount = player.hand.filter(c => c.type === 'item').length
  const potionsCount = player.hand.filter(c => c.type === 'potion' || c.type === 'one-shot').length
  const otherCount = player.hand.filter(c => ['curse', 'race', 'class'].includes(c.type)).length

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Race & Class panel */}
      <RaceClassPanel />

      {/* Player stats bar */}
      <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex-wrap gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{RACE_ICONS[player.race]}</span>
          <div>
            <p className="text-white font-bold text-sm">{player.name}</p>
            <p className="text-gray-500 text-xs capitalize">
              {player.race} · {CLASS_ICONS[player.class]} {player.class !== 'none' ? player.class : 'без класу'}
            </p>
          </div>
        </div>

        {/* Gold */}
        {player.gold > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-950/60 border border-yellow-800/50 rounded-lg">
            <span className="text-yellow-500 text-sm">💰</span>
            <span className="text-yellow-400 font-bold text-sm">{player.gold}</span>
            <span className="text-yellow-700 text-xs">/ 1000 зол.</span>
          </div>
        )}

        {/* Level track */}
        <div className="flex items-center gap-1 ml-auto">
          {Array.from({ length: 10 }, (_, i) => (
            <motion.div
              key={i}
              className={cn(
                'w-5 h-5 rounded-full border text-[9px] font-bold flex items-center justify-center',
                i < player.level
                  ? 'bg-yellow-500 border-yellow-400 text-black'
                  : 'bg-white/5 border-white/10 text-gray-600'
              )}
              animate={i === player.level - 1 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>

        {/* Combat strength */}
        <div className="text-right">
          <p className="text-xs text-gray-500">Сила</p>
          <p className="text-yellow-400 font-bold text-lg leading-none">{strength}</p>
        </div>
      </div>

      {/* Unlocked showcase notification */}
      <AnimatePresence>
        {unlockedShowcase.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <button
              onClick={() => setMainTab('showcase')}
              className="w-full flex items-center gap-2 px-3 py-2 bg-green-950/60 border border-green-700 rounded-xl text-sm cursor-pointer hover:bg-green-900/60 transition text-left"
            >
              <span className="text-green-400 font-bold text-base">✓</span>
              <span className="text-green-300 font-bold">
                {unlockedShowcase.length} {unlockedShowcase.length === 1 ? 'предмет' : 'предмети'} на вітрині тепер можна надягнути!
              </span>
              <span className="text-green-600 text-xs ml-auto">{unlockedShowcase.map(c => c.name).join(', ')}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          ['hand', `🃏 Рука (${player.hand.length}/${HAND_LIMIT})`],
          ['equipped', `🛡️ Екіп (${player.equipped.length})`],
          ['showcase', `🖼️ Вітрина (${player.showcase.length})${unlockedShowcase.length > 0 ? ' ✓' : ''}`],
        ] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setMainTab(tab)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer',
              mainTab === tab ? 'bg-white/15 text-white' : 'bg-white/5 text-gray-500 hover:text-gray-300',
              tab === 'hand' && handOverLimit && 'border border-orange-600',
              tab === 'showcase' && unlockedShowcase.length > 0 && mainTab !== 'showcase' && 'border border-green-600'
            )}
          >
            {label}
            {tab === 'hand' && handOverLimit && (
              <span className="ml-1 text-orange-400 font-bold">!</span>
            )}
          </button>
        ))}
      </div>

      {/* Hand sub-tabs */}
      {mainTab === 'hand' && (
        <div className="flex gap-1 flex-wrap">
          {([
            ['all', `Всі (${player.hand.length})`],
            ['monsters', `👹 Монстри${monstersCount > 0 ? ` (${monstersCount})` : ''}`],
            ['items', `🗡️ Предмети${itemsCount > 0 ? ` (${itemsCount})` : ''}`],
            ['potions', `🧪 Зілля${potionsCount > 0 ? ` (${potionsCount})` : ''}`],
            ['other', `📜 Інше${otherCount > 0 ? ` (${otherCount})` : ''}`],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setHandTab(tab)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs transition cursor-pointer',
                handTab === tab ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Content area */}
      <div className="min-h-[200px] p-3 bg-black/20 rounded-xl border border-white/5">
        <AnimatePresence mode="wait">
          {/* ── Hand ── */}
          {mainTab === 'hand' && (
            <motion.div
              key="hand"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-3"
            >
              {filteredHand.map((card, i) => {
                const isItem = card.type === 'item'
                const restricted = isItem && isItemRestricted(player, card as ItemCard)
                const canEquip = isItem && canEquipItem(player, card as ItemCard).ok

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <MunchkinCard card={card} faceUp onClick={handleCardAction} />

                    {/* Action buttons */}
                    <div className="flex gap-1 flex-wrap justify-center">
                      {isItem && phase !== 'monster-fight' && canEquip && (
                        <button
                          onClick={() => equipItem(card.id)}
                          className="text-[10px] px-2 py-0.5 bg-yellow-800 hover:bg-yellow-700 text-yellow-200 rounded transition cursor-pointer"
                        >
                          + Екіп
                        </button>
                      )}
                      {isItem && phase !== 'monster-fight' && (
                        <button
                          onClick={() => showcaseItem(card.id)}
                          className="text-[10px] px-2 py-0.5 bg-purple-800 hover:bg-purple-700 text-purple-200 rounded transition cursor-pointer"
                          title="Виставити на огляд — не займає руку"
                        >
                          🖼️ Вітрина
                        </button>
                      )}
                      {card.type === 'curse' && players.length > 1 && (
                        <button
                          onClick={() => setCastingCurse(castingCurse === card.id ? null : card.id)}
                          className={cn(
                            'text-[10px] px-2 py-0.5 rounded transition cursor-pointer',
                            castingCurse === card.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-purple-900 hover:bg-purple-800 text-purple-300'
                          )}
                        >
                          🎯 Направити
                        </button>
                      )}
                      {card.type === 'race' && (
                        <button
                          onClick={() => equipRace(card.id)}
                          className="text-[10px] px-2 py-0.5 bg-green-800 hover:bg-green-700 text-green-200 rounded transition cursor-pointer"
                        >
                          🧝 Раса
                        </button>
                      )}
                      {card.type === 'class' && (
                        <button
                          onClick={() => equipClass(card.id)}
                          className="text-[10px] px-2 py-0.5 bg-blue-800 hover:bg-blue-700 text-blue-200 rounded transition cursor-pointer"
                        >
                          ⚔️ Клас
                        </button>
                      )}
                      {(card.type === 'potion' || card.type === 'one-shot') && phase === 'monster-fight' && (
                        <button
                          onClick={() => playItemInCombat(card.id)}
                          className="text-[10px] px-2 py-0.5 bg-cyan-800 hover:bg-cyan-700 text-cyan-200 rounded transition cursor-pointer"
                        >
                          ▶ Зіграти
                        </button>
                      )}
                      <button
                        onClick={() => discardCard(card.id)}
                        className="text-[10px] px-2 py-0.5 bg-red-900 hover:bg-red-800 text-red-300 rounded transition cursor-pointer"
                      >
                        × Скинути
                      </button>
                    </div>

                    {/* Restriction label */}
                    {restricted && (
                      <p className="text-[9px] text-orange-500 text-center">
                        {(card as ItemCard).requiredRace && `Тільки ${(card as ItemCard).requiredRace!.join('/')}`}
                        {(card as ItemCard).requiredClass && `Тільки ${(card as ItemCard).requiredClass!.join('/')}`}
                      </p>
                    )}

                    {/* Curse target picker */}
                    <AnimatePresence>
                      {card.type === 'curse' && castingCurse === card.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -4, height: 0 }}
                          className="overflow-hidden w-full"
                        >
                          <div className="flex flex-col gap-1 mt-1 p-2 bg-purple-950/60 border border-purple-800 rounded-lg">
                            <p className="text-[9px] text-purple-400 uppercase font-bold text-center">Обери ціль</p>
                            {players
                              .filter((_, i) => i !== currentPlayerIndex)
                              .map(target => (
                                <button
                                  key={target.id}
                                  onClick={() => {
                                    castCurse(card.id, target.id)
                                    setCastingCurse(null)
                                  }}
                                  className="text-xs px-2 py-1 bg-purple-900 hover:bg-purple-700 text-purple-200 rounded-lg transition cursor-pointer text-left"
                                >
                                  😈 {target.name} (рів.{target.level})
                                </button>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}

              {filteredHand.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-600 text-sm py-8">
                  {player.hand.length === 0 ? 'Рука порожня' : 'Немає карт у цій категорії'}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Equipped ── */}
          {mainTab === 'equipped' && (
            <motion.div
              key="equipped"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EquipmentBoard />
            </motion.div>
          )}

          {/* ── Showcase ── */}
          {mainTab === 'showcase' && (
            <motion.div
              key="showcase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <p className="text-xs text-gray-500">
                Речі на вітрині — видно всім гравцям, не займають руку. Можна обміняти або надягнути якщо є потрібний клас/раса.
              </p>

              {player.showcase.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-6">Вітрина порожня</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {player.showcase.map((card, i) => {
                    const nowEquippable = !isItemRestricted(player, card)
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex flex-col items-center gap-1"
                      >
                        {/* Green pulse border when unlocked */}
                        <div className={cn(
                          'rounded-xl',
                          nowEquippable && 'ring-2 ring-green-500 ring-offset-1 ring-offset-black'
                        )}>
                          <MunchkinCard card={card} faceUp noFlip />
                        </div>

                        {nowEquippable && (
                          <motion.p
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-[10px] text-green-400 font-bold"
                          >
                            ✓ Можна надягнути!
                          </motion.p>
                        )}
                        {!nowEquippable && (
                          <p className="text-[9px] text-orange-500 text-center">
                            {card.requiredRace && `Раса: ${card.requiredRace.join('/')}`}
                            {card.requiredClass && `Клас: ${card.requiredClass.join('/')}`}
                          </p>
                        )}

                        <div className="flex gap-1 flex-wrap justify-center">
                          {nowEquippable && (
                            <button
                              onClick={() => equipItem(card.id)}
                              className="text-[10px] px-2 py-0.5 bg-green-700 hover:bg-green-600 text-green-100 rounded transition cursor-pointer font-bold"
                            >
                              ✓ Надягнути
                            </button>
                          )}
                          <button
                            onClick={() => removeFromShowcase(card.id)}
                            className="text-[10px] px-2 py-0.5 bg-white/10 hover:bg-white/15 text-gray-300 rounded transition cursor-pointer"
                          >
                            ← В руку
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
