import { create } from 'zustand'
import type {
  GameState, GamePhase, Player, AnyCard, MonsterCard, ItemCard,
  RaceCard, ClassCard, CombatCardEntry, HelpReward,
} from '../types'
import { DOOR_DECK, TREASURE_DECK, shuffleDeck, drawFromDeck } from '../data/deck'
import { canEquipItem } from '../utils/equipment'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makePlayer(id: string, name: string): Player {
  return {
    id, name,
    level: 1,
    race: 'human',
    class: 'none',
    gender: 'male',
    hand: [],
    equipped: [],
    showcase: [],
    raceCard: null,
    classCard: null,
    gold: 0,
    hasSoldThisTurn: false,
    isAlive: true,
  }
}

function playerCombatStrength(player: Player, vsMonster?: MonsterCard): number {
  const equippedBonus = player.equipped.reduce((sum, item) => sum + item.bonus, 0)
  let strength = player.level + equippedBonus
  // Cleric +3 against undead
  if (player.class === 'cleric' && vsMonster?.tags?.includes('undead')) {
    strength += 3
  }
  return strength
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface GameStore extends GameState {
  // Setup
  startGame: (playerNames: string[]) => void
  resetGame: () => void

  // Phase actions
  kickOpenDoor: () => void
  acknowledgeReveal: () => void
  lookForTrouble: (monsterId: string) => void
  lootRoom: () => void

  // Combat
  fightMonster: () => void
  playItemInCombat: (cardId: string) => void
  flee: () => void
  dismissDice: () => void
  defeatMonster: () => void
  joinCombat: (helperId: string) => void
  leaveCombat: (helperId: string) => void
  boostMonster: (cardId: string, byPlayerId: string) => void
  offerReward: (helperId: string, cardId: string | null, victoryCount?: number) => void
  removeReward: (helperId: string) => void

  // Sell items
  sellItems: (cardIds: string[]) => void

  // Card management
  equipItem: (cardId: string) => void
  unequipItem: (cardId: string) => void
  equipRace: (cardId: string) => void
  removeRace: () => void
  equipClass: (cardId: string) => void
  removeClass: () => void
  discardCard: (cardId: string) => void
  drawTreasure: (count: number) => void

  // Showcase
  showcaseItem: (cardId: string) => void
  removeFromShowcase: (cardId: string) => void

  // Trade
  openTrade: (toPlayerId: string) => void
  closeTrade: () => void
  tradeCards: (myCardId: string, theirCardId: string) => void

  // Turn
  endTurn: () => void
  confirmEndTurn: () => void

  // Computed
  currentPlayer: () => Player
  currentCombatStrength: () => number
  activeMonsterLevel: () => number
  log: string[]
  addLog: (msg: string) => void
}

// ─── Initial state ────────────────────────────────────────────────────────────

const EMPTY_STATE: GameState & { log: string[] } = {
  phase: 'waiting',
  players: [],
  currentPlayerIndex: 0,
  doorDeck: [],
  treasureDeck: [],
  doorDiscard: [],
  treasureDiscard: [],
  activeMonster: null,
  revealedCard: null,
  combatBonus: 0,
  monsterBonus: 0,
  combatCards: [],
  helperIds: [],
  helpRewards: [],
  diceRoll: null,
  round: 0,
  handLimitPending: false,
  tradeModal: null,
  log: [],
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>((set, get) => ({
  ...EMPTY_STATE,

  // ── Setup ──────────────────────────────────────────────────────────────────

  startGame: (playerNames) => {
    const players = playerNames.map((name, i) => makePlayer(`player-${i}`, name))
    const doorDeck = shuffleDeck([...DOOR_DECK])
    const treasureDeck = shuffleDeck([...TREASURE_DECK])

    let dDeck = [...doorDeck]
    let tDeck = [...treasureDeck]

    for (const player of players) {
      player.hand = [...dDeck.splice(0, 4), ...tDeck.splice(0, 4)]
    }

    set({
      ...EMPTY_STATE,
      phase: 'kick-open-door',
      players,
      doorDeck: dDeck,
      treasureDeck: tDeck,
      round: 1,
      log: ['Гра почалась! Удачі, герої!'],
    })
  },

  resetGame: () => set(EMPTY_STATE),

  // ── Phase actions ──────────────────────────────────────────────────────────

  kickOpenDoor: () => {
    const { doorDeck, doorDiscard, players, currentPlayerIndex } = get()
    const { card, newDeck, newDiscard } = drawFromDeck(doorDeck, doorDiscard)
    get().addLog(`${players[currentPlayerIndex].name} відкриває двері...`)
    set({ phase: 'door-reveal', revealedCard: card, doorDeck: newDeck, doorDiscard: newDiscard })
  },

  acknowledgeReveal: () => {
    const { revealedCard, players, currentPlayerIndex, doorDiscard } = get()
    if (!revealedCard) return
    const player = players[currentPlayerIndex]

    if (revealedCard.type === 'monster') {
      get().addLog(`Монстр! ${revealedCard.name} — рівень ${(revealedCard as MonsterCard).level}`)
      set({ phase: 'monster-fight', activeMonster: revealedCard as MonsterCard, revealedCard: null })

    } else if (revealedCard.type === 'curse') {
      get().addLog(`Прокляття! ${revealedCard.name} — ${revealedCard.effect.description}`)
      const updatedPlayers = [...players]
      const p = { ...updatedPlayers[currentPlayerIndex] }

      switch (revealedCard.effect.type) {
        case 'lose-level':
          p.level = Math.max(1, p.level - (revealedCard.effect.value ?? 1))
          break
        case 'lose-class':
          if (p.classCard) { p.classCard = null; p.class = 'none' }
          break
        case 'lose-race':
          if (p.raceCard) { p.raceCard = null; p.race = 'human' }
          break
        case 'lose-item':
          if (p.equipped.length > 0) {
            const best = [...p.equipped].sort((a, b) => b.bonus - a.bonus)[0]
            p.equipped = p.equipped.filter(i => i.id !== best.id)
          }
          break
        case 'lose-gold':
          if (p.gold >= (revealedCard.effect.value ?? 300)) {
            p.gold -= revealedCard.effect.value ?? 300
          } else {
            p.level = Math.max(1, p.level - 1)
          }
          break
      }

      updatedPlayers[currentPlayerIndex] = p
      set({
        phase: 'loot-room', revealedCard: null, players: updatedPlayers,
        doorDiscard: [...doorDiscard, revealedCard],
      })

    } else {
      // Race or class → goes to hand
      get().addLog(`${player.name} знайшов: ${revealedCard.name} — іде в руку`)
      const updatedPlayers = [...players]
      const p = { ...updatedPlayers[currentPlayerIndex] }
      p.hand = [...p.hand, revealedCard]
      updatedPlayers[currentPlayerIndex] = p
      set({ phase: 'loot-room', revealedCard: null, players: updatedPlayers })
    }
  },

  lookForTrouble: (monsterId) => {
    const { players, currentPlayerIndex } = get()
    const player = players[currentPlayerIndex]
    const monsterCard = player.hand.find(c => c.id === monsterId) as MonsterCard | undefined
    if (!monsterCard) return

    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex] = { ...player, hand: player.hand.filter(c => c.id !== monsterId) }
    get().addLog(`${player.name} шукає проблем і грає: ${monsterCard.name}`)
    set({ phase: 'monster-fight', activeMonster: monsterCard, players: updatedPlayers })
  },

  lootRoom: () => {
    const { doorDeck, doorDiscard, players, currentPlayerIndex } = get()
    const { card, newDeck, newDiscard } = drawFromDeck(doorDeck, doorDiscard)
    const updatedPlayers = [...players]
    const player = { ...updatedPlayers[currentPlayerIndex] }
    player.hand = [...player.hand, card]
    updatedPlayers[currentPlayerIndex] = player
    get().addLog(`${player.name} грабує кімнату і бере карту.`)
    set({ phase: 'end-turn', players: updatedPlayers, doorDeck: newDeck, doorDiscard: newDiscard })
  },

  // ── Combat ─────────────────────────────────────────────────────────────────

  fightMonster: () => {
    const { activeMonster } = get()
    if (!activeMonster) return
    const strength = get().currentCombatStrength()
    const monsterLevel = get().activeMonsterLevel()
    if (strength > monsterLevel) {
      get().defeatMonster()
    } else {
      get().addLog(`Сила ${strength} ≤ Монстр ${monsterLevel}. Тікай або проси допомоги!`)
    }
  },

  playItemInCombat: (cardId) => {
    const { players, currentPlayerIndex, combatBonus, combatCards } = get()
    const player = players[currentPlayerIndex]
    const card = player.hand.find(c => c.id === cardId)
    if (!card) return

    if (card.type === 'potion' || card.type === 'one-shot') {
      let bonus = (card as any).effect?.value ?? 0
      // Wizard gets +1 extra from potions/spells
      if (player.class === 'wizard' && bonus > 0) bonus += 1
      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex] = { ...player, hand: player.hand.filter(c => c.id !== cardId) }
      const entry: CombatCardEntry = { card, playedById: player.id, side: 'hero', bonus }
      get().addLog(`${player.name} грає ${card.name} (+${bonus} до бою)`)
      set({ players: updatedPlayers, combatBonus: combatBonus + bonus, combatCards: [...combatCards, entry] })
    }
  },

  flee: () => {
    const { activeMonster, players, currentPlayerIndex } = get()
    const roll = Math.floor(Math.random() * 6) + 1
    const player = players[currentPlayerIndex]
    const success = roll >= 5
    const badStuff = activeMonster?.badStuff ?? ''
    get().addLog(`${player.name} тікає! Кубик: ${roll} — ${success ? 'ВДАЛОСЬ!' : 'НЕ ВДАЛОСЬ!'}`)

    if (success) {
      set({
        diceRoll: { value: roll, success: true, badStuff: '' },
        activeMonster: null, combatBonus: 0, monsterBonus: 0,
        combatCards: [], helperIds: [], helpRewards: [], phase: 'end-turn',
      })
    } else {
      const updatedPlayers = [...players]
      const p = { ...updatedPlayers[currentPlayerIndex] }
      if (badStuff.includes('рівень')) p.level = Math.max(1, p.level - 1)
      if (badStuff.includes('предмет') && p.equipped.length > 0) {
        const best = [...p.equipped].sort((a, b) => b.bonus - a.bonus)[0]
        p.equipped = p.equipped.filter(i => i.id !== best.id)
      }
      if (badStuff.includes('золот') && p.gold > 0) {
        p.gold = Math.max(0, p.gold - 300)
      }
      updatedPlayers[currentPlayerIndex] = p
      set({
        diceRoll: { value: roll, success: false, badStuff },
        players: updatedPlayers,
        activeMonster: null, combatBonus: 0, monsterBonus: 0,
        combatCards: [], helperIds: [], helpRewards: [], phase: 'end-turn',
      })
    }
  },

  dismissDice: () => set({ diceRoll: null }),

  defeatMonster: () => {
    const { activeMonster, players, currentPlayerIndex, treasureDeck, treasureDiscard, doorDiscard, helpRewards } = get()
    if (!activeMonster) return

    const updatedPlayers = [...players]
    const player = { ...updatedPlayers[currentPlayerIndex] }

    // Level up
    player.level = Math.min(10, player.level + 1)

    // Cleric +1 level for defeating undead
    if (player.class === 'cleric' && activeMonster.tags?.includes('undead')) {
      player.level = Math.min(10, player.level + 1)
      get().addLog(`${player.name} (Клірик) отримує додатковий рівень за нежить!`)
    }

    // Thief gets +1 extra treasure
    let baseTreasures = activeMonster.treasures
    if (player.class === 'thief') {
      baseTreasures += 1
      get().addLog(`${player.name} (Злодій) отримує +1 додатковий скарб!`)
    }

    // Draw treasures
    let tDeck = [...treasureDeck]
    let tDiscard = [...treasureDiscard]
    const drawnTreasures: AnyCard[] = []
    for (let i = 0; i < baseTreasures; i++) {
      const { card, newDeck, newDiscard } = drawFromDeck(tDeck, tDiscard)
      drawnTreasures.push(card)
      tDeck = newDeck
      tDiscard = newDiscard
    }

    // Distribute rewards to helpers
    let mainTreasures = [...drawnTreasures]
    for (const reward of helpRewards) {
      const helperIdx = players.findIndex(p => p.id === reward.helperId)
      if (helperIdx === -1) continue
      const helper = { ...updatedPlayers[helperIdx] }

      if (reward.fromVictory) {
        const count = reward.victoryCount ?? 1
        for (let i = 0; i < count && mainTreasures.length > 0; i++) {
          const [last, ...rest] = mainTreasures.slice().reverse()
          mainTreasures = rest.reverse()
          helper.hand = [...helper.hand, last]
        }
        get().addLog(`${helper.name} отримує ${count} скарб(и) як нагороду за допомогу`)
      } else if (reward.cardId) {
        const promisedCard = player.hand.find(c => c.id === reward.cardId)
        if (promisedCard) {
          player.hand = player.hand.filter(c => c.id !== reward.cardId)
          helper.hand = [...helper.hand, promisedCard]
          get().addLog(`${player.name} дає ${promisedCard.name} → ${helper.name}`)
        }
      }

      // Elf: +1 level when helping
      if (helper.race === 'elf') {
        helper.level = Math.min(10, helper.level + 1)
        get().addLog(`${helper.name} (Ельф) отримує +1 рівень за допомогу!`)
      }

      updatedPlayers[helperIdx] = helper
    }

    player.hand = [...player.hand, ...mainTreasures]
    updatedPlayers[currentPlayerIndex] = player
    get().addLog(`${player.name} переміг ${activeMonster.name}! +1 рівень, +${activeMonster.treasures} скарби`)

    if (player.level >= 10) {
      get().addLog(`🏆 ${player.name} ПЕРЕМІГ! Рівень 10!`)
      set({ phase: 'waiting', players: updatedPlayers, diceRoll: null })
      return
    }

    set({
      phase: 'end-turn',
      players: updatedPlayers,
      activeMonster: null, combatBonus: 0, monsterBonus: 0,
      combatCards: [], helperIds: [], helpRewards: [], diceRoll: null,
      treasureDeck: tDeck, treasureDiscard: tDiscard,
      doorDiscard: [...doorDiscard, activeMonster],
    })
  },

  // ── Combat help ────────────────────────────────────────────────────────────

  joinCombat: (helperId) => {
    const { helperIds, players, activeMonster } = get()
    if (helperIds.includes(helperId)) return
    const helper = players.find(p => p.id === helperId)
    if (!helper) return
    const str = playerCombatStrength(helper, activeMonster ?? undefined)
    get().addLog(`${helper.name} приєднується до бою! (+${str})`)
    set({ helperIds: [...helperIds, helperId] })
  },

  leaveCombat: (helperId) => {
    const { helperIds, players } = get()
    const helper = players.find(p => p.id === helperId)
    if (helper) get().addLog(`${helper.name} виходить з бою`)
    set({ helperIds: helperIds.filter(id => id !== helperId) })
  },

  boostMonster: (cardId, byPlayerId) => {
    const { players, monsterBonus, activeMonster, treasureDiscard, combatCards } = get()
    const player = players.find(p => p.id === byPlayerId)
    if (!player || !activeMonster) return
    const card = player.hand.find(c => c.id === cardId)
    if (!card || (card.type !== 'potion' && card.type !== 'one-shot')) return

    const boost = Math.abs((card as any).effect?.value ?? 2)
    const updatedPlayers = players.map(p =>
      p.id === byPlayerId ? { ...p, hand: p.hand.filter(c => c.id !== cardId) } : p
    )
    const entry: CombatCardEntry = { card, playedById: byPlayerId, side: 'monster', bonus: boost }
    get().addLog(`${player.name} посилює монстра ${activeMonster.name}! +${boost} рівні`)
    set({
      players: updatedPlayers, monsterBonus: monsterBonus + boost,
      combatCards: [...combatCards, entry], treasureDiscard: [...treasureDiscard, card],
    })
  },

  offerReward: (helperId, cardId, victoryCount = 1) => {
    const { helpRewards } = get()
    const reward: HelpReward = {
      helperId, cardId,
      fromVictory: cardId === null,
      victoryCount: cardId === null ? victoryCount : 1,
    }
    const filtered = helpRewards.filter(r => r.helperId !== helperId)
    set({ helpRewards: [...filtered, reward] })
  },

  removeReward: (helperId) => {
    set(s => ({ helpRewards: s.helpRewards.filter(r => r.helperId !== helperId) }))
  },

  // ── Sell items ─────────────────────────────────────────────────────────────

  sellItems: (cardIds) => {
    const { players, currentPlayerIndex, treasureDiscard } = get()
    const player = players[currentPlayerIndex]

    if (player.hasSoldThisTurn) {
      get().addLog(`${player.name} вже продавав цього ходу!`)
      return
    }

    const toSell = player.hand.filter(c => cardIds.includes(c.id) && c.type === 'item') as ItemCard[]
    if (toSell.length === 0) return

    const total = toSell.reduce((s, c) => s + c.value, 0)
    const newGold = player.gold + total
    const levelsGained = Math.floor(newGold / 1000)
    const goldLeft = newGold % 1000

    const updatedPlayers = [...players]
    const p = { ...player }
    p.hand = p.hand.filter(c => !cardIds.includes(c.id))
    p.gold = goldLeft
    p.hasSoldThisTurn = true
    if (levelsGained > 0) {
      p.level = Math.min(9, p.level + levelsGained)
      get().addLog(`${player.name} продав речі за ${total} зол. і отримав +${levelsGained} рівень!`)
    } else {
      get().addLog(`${player.name} продав речі за ${total} зол. (${newGold}/1000 до рівня)`)
    }
    updatedPlayers[currentPlayerIndex] = p
    set({ players: updatedPlayers, treasureDiscard: [...treasureDiscard, ...toSell] })
  },

  // ── Card management ────────────────────────────────────────────────────────

  equipItem: (cardId) => {
    const { players, currentPlayerIndex } = get()
    const player = players[currentPlayerIndex]
    const card = player.hand.find(c => c.id === cardId) as ItemCard | undefined
    if (!card || card.type !== 'item') return

    const check = canEquipItem(player, card)
    if (!check.ok) {
      get().addLog(`${player.name} не може надягнути ${card.name}: ${check.reason}`)
      return
    }

    const updatedPlayers = [...players]
    const p = { ...player }
    p.hand = p.hand.filter(c => c.id !== cardId)
    p.equipped = [...p.equipped, card]
    updatedPlayers[currentPlayerIndex] = p
    get().addLog(`${player.name} надягнув: ${card.name} (+${card.bonus})`)
    set({ players: updatedPlayers })
  },

  unequipItem: (cardId) => {
    const { players, currentPlayerIndex } = get()
    const player = players[currentPlayerIndex]
    const card = player.equipped.find(c => c.id === cardId)
    if (!card) return

    const updatedPlayers = [...players]
    const p = { ...player }
    p.equipped = p.equipped.filter(c => c.id !== cardId)
    p.hand = [...p.hand, card]
    updatedPlayers[currentPlayerIndex] = p
    set({ players: updatedPlayers })
  },

  equipRace: (cardId) => {
    const { players, currentPlayerIndex, doorDiscard } = get()
    const player = players[currentPlayerIndex]
    const card = player.hand.find(c => c.id === cardId) as RaceCard | undefined
    if (!card || card.type !== 'race') return

    const updatedPlayers = [...players]
    const p = { ...player }
    const oldRace = p.raceCard
    p.hand = p.hand.filter(c => c.id !== cardId)
    p.raceCard = card
    p.race = card.name.toLowerCase() as any
    updatedPlayers[currentPlayerIndex] = p
    get().addLog(`${player.name} тепер ${card.name}!`)
    set({
      players: updatedPlayers,
      doorDiscard: oldRace ? [...doorDiscard, oldRace] : doorDiscard,
    })
  },

  removeRace: () => {
    const { players, currentPlayerIndex, doorDiscard } = get()
    const player = players[currentPlayerIndex]
    if (!player.raceCard) return
    const updatedPlayers = [...players]
    const p = { ...player }
    const old = p.raceCard!
    p.raceCard = null; p.race = 'human'
    updatedPlayers[currentPlayerIndex] = p
    get().addLog(`${player.name} скинув расу ${old.name}`)
    set({ players: updatedPlayers, doorDiscard: [...doorDiscard, old] })
  },

  equipClass: (cardId) => {
    const { players, currentPlayerIndex, doorDiscard } = get()
    const player = players[currentPlayerIndex]
    const card = player.hand.find(c => c.id === cardId) as ClassCard | undefined
    if (!card || card.type !== 'class') return

    const updatedPlayers = [...players]
    const p = { ...player }
    const oldClass = p.classCard
    p.hand = p.hand.filter(c => c.id !== cardId)
    p.classCard = card
    p.class = card.name.toLowerCase() as any
    updatedPlayers[currentPlayerIndex] = p
    get().addLog(`${player.name} тепер ${card.name}!`)
    set({
      players: updatedPlayers,
      doorDiscard: oldClass ? [...doorDiscard, oldClass] : doorDiscard,
    })
  },

  removeClass: () => {
    const { players, currentPlayerIndex, doorDiscard } = get()
    const player = players[currentPlayerIndex]
    if (!player.classCard) return
    const updatedPlayers = [...players]
    const p = { ...player }
    const old = p.classCard!
    p.classCard = null; p.class = 'none'
    updatedPlayers[currentPlayerIndex] = p
    get().addLog(`${player.name} скинув клас ${old.name}`)
    set({ players: updatedPlayers, doorDiscard: [...doorDiscard, old] })
  },

  discardCard: (cardId) => {
    const { players, currentPlayerIndex, doorDiscard, treasureDiscard } = get()
    const player = players[currentPlayerIndex]
    const card = player.hand.find(c => c.id === cardId)
    if (!card) return

    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex] = { ...player, hand: player.hand.filter(c => c.id !== cardId) }
    const pile = card.category === 'door'
      ? { doorDiscard: [...doorDiscard, card] }
      : { treasureDiscard: [...treasureDiscard, card] }
    set({ players: updatedPlayers, ...pile })
  },

  drawTreasure: (count) => {
    const { players, currentPlayerIndex, treasureDeck, treasureDiscard } = get()
    let deck = [...treasureDeck]
    let discard = [...treasureDiscard]
    const drawn: AnyCard[] = []
    for (let i = 0; i < count; i++) {
      const { card, newDeck, newDiscard } = drawFromDeck(deck, discard)
      drawn.push(card)
      deck = newDeck
      discard = newDiscard
    }
    const updatedPlayers = [...players]
    const p = { ...updatedPlayers[currentPlayerIndex] }
    p.hand = [...p.hand, ...drawn]
    updatedPlayers[currentPlayerIndex] = p
    set({ players: updatedPlayers, treasureDeck: deck, treasureDiscard: discard })
  },

  // ── Showcase ───────────────────────────────────────────────────────────────

  showcaseItem: (cardId) => {
    const { players, currentPlayerIndex } = get()
    const player = players[currentPlayerIndex]
    const card = player.hand.find(c => c.id === cardId) as ItemCard | undefined
    if (!card || card.type !== 'item') return

    const updatedPlayers = [...players]
    const p = { ...player }
    p.hand = p.hand.filter(c => c.id !== cardId)
    p.showcase = [...p.showcase, card]
    updatedPlayers[currentPlayerIndex] = p
    get().addLog(`${player.name} виставив ${card.name} на огляд`)
    set({ players: updatedPlayers })
  },

  removeFromShowcase: (cardId) => {
    const { players, currentPlayerIndex } = get()
    const player = players[currentPlayerIndex]
    const card = player.showcase.find(c => c.id === cardId)
    if (!card) return
    const updatedPlayers = [...players]
    const p = { ...player }
    p.showcase = p.showcase.filter(c => c.id !== cardId)
    p.hand = [...p.hand, card]
    updatedPlayers[currentPlayerIndex] = p
    set({ players: updatedPlayers })
  },

  // ── Trade ──────────────────────────────────────────────────────────────────

  openTrade: (toPlayerId) => {
    const { players, currentPlayerIndex } = get()
    const fromPlayerId = players[currentPlayerIndex].id
    set({ tradeModal: { fromPlayerId, toPlayerId } })
  },

  closeTrade: () => set({ tradeModal: null }),

  tradeCards: (myCardId, theirCardId) => {
    const { players, tradeModal } = get()
    if (!tradeModal) return

    const { fromPlayerId, toPlayerId } = tradeModal
    const fromIdx = players.findIndex(p => p.id === fromPlayerId)
    const toIdx = players.findIndex(p => p.id === toPlayerId)
    if (fromIdx === -1 || toIdx === -1) return

    const updatedPlayers = [...players]
    const fromP = { ...updatedPlayers[fromIdx] }
    const toP = { ...updatedPlayers[toIdx] }

    // Find cards in both hand + showcase
    const fromCard = [...fromP.hand, ...fromP.showcase].find(c => c.id === myCardId)
    const toCard = [...toP.hand, ...toP.showcase].find(c => c.id === theirCardId)
    if (!fromCard || !toCard) return

    // Remove from source
    fromP.hand = fromP.hand.filter(c => c.id !== myCardId)
    fromP.showcase = fromP.showcase.filter(c => c.id !== myCardId)
    toP.hand = toP.hand.filter(c => c.id !== theirCardId)
    toP.showcase = toP.showcase.filter(c => c.id !== theirCardId)

    // Add to destination
    toP.hand = [...toP.hand, fromCard]
    fromP.hand = [...fromP.hand, toCard]

    updatedPlayers[fromIdx] = fromP
    updatedPlayers[toIdx] = toP
    get().addLog(`${fromP.name} обмінявся карткою ${fromCard.name} на ${toCard.name} з ${toP.name}`)
    set({ players: updatedPlayers, tradeModal: null })
  },

  // ── Turn ───────────────────────────────────────────────────────────────────

  endTurn: () => {
    const { players, currentPlayerIndex } = get()
    const player = players[currentPlayerIndex]
    const HAND_LIMIT = 8

    if (player.hand.length > HAND_LIMIT) {
      set({ handLimitPending: true })
      get().addLog(`${player.name} має ${player.hand.length} карт — потрібно скинути до ${HAND_LIMIT}`)
      return
    }

    get().confirmEndTurn()
  },

  confirmEndTurn: () => {
    const { players, currentPlayerIndex, round } = get()
    const nextIndex = (currentPlayerIndex + 1) % players.length
    const nextPlayer = players[nextIndex]
    const newRound = nextIndex === 0 ? round + 1 : round

    // Reset hasSoldThisTurn for current player
    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex] = {
      ...updatedPlayers[currentPlayerIndex],
      hasSoldThisTurn: false,
    }

    get().addLog(`Хід переходить до: ${nextPlayer.name}`)
    set({
      phase: 'kick-open-door',
      currentPlayerIndex: nextIndex,
      round: newRound,
      activeMonster: null,
      combatBonus: 0,
      helperIds: [],
      players: updatedPlayers,
      handLimitPending: false,
    })
  },

  // ── Computed ───────────────────────────────────────────────────────────────

  currentPlayer: () => {
    const { players, currentPlayerIndex } = get()
    return players[currentPlayerIndex]
  },

  currentCombatStrength: () => {
    const { players, currentPlayerIndex, combatBonus, helperIds, activeMonster } = get()
    const player = players[currentPlayerIndex]
    if (!player) return 0
    const helperStrength = helperIds.reduce((sum, id) => {
      const h = players.find(p => p.id === id)
      return h ? sum + playerCombatStrength(h, activeMonster ?? undefined) : sum
    }, 0)
    return playerCombatStrength(player, activeMonster ?? undefined) + combatBonus + helperStrength
  },

  activeMonsterLevel: () => {
    const { activeMonster, monsterBonus } = get()
    return (activeMonster?.level ?? 0) + monsterBonus
  },

  log: [],
  addLog: (msg) => set(s => ({ log: [msg, ...s.log].slice(0, 50) })),
}))

// ─── Selectors ────────────────────────────────────────────────────────────────

export const PHASE_LABELS: Record<GamePhase, string> = {
  waiting:          '⏳ Очікування',
  'kick-open-door': '🚪 Відкрий Двері',
  'door-reveal':    '🎴 Відкриття',
  'monster-fight':  '⚔️ Бій з Монстром',
  'loot-room':      '💰 Пограбуй Кімнату',
  'look-for-trouble': '😈 Шукай Проблем',
  charity:          '🎁 Благодійність',
  'end-turn':       '🔄 Кінець Ходу',
}
