import { create } from 'zustand'
import type { GameState, GamePhase, Player, AnyCard, MonsterCard, ItemCard } from '../types'
import { DOOR_DECK, TREASURE_DECK, shuffleDeck } from '../data/deck'

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
    isAlive: true,
  }
}

function playerCombatStrength(player: Player): number {
  const equippedBonus = player.equipped.reduce((sum, item) => sum + item.bonus, 0)
  return player.level + equippedBonus
}

function drawFromDeck(deck: AnyCard[], discard: AnyCard[]): { card: AnyCard; newDeck: AnyCard[]; newDiscard: AnyCard[] } {
  if (deck.length === 0) {
    // Reshuffle discard
    const newDeck = shuffleDeck([...discard])
    const [card, ...rest] = newDeck
    return { card, newDeck: rest, newDiscard: [] }
  }
  const [card, ...newDeck] = deck
  return { card, newDeck, newDiscard: discard }
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface GameStore extends GameState {
  // Setup
  startGame: (playerNames: string[]) => void
  resetGame: () => void

  // Phase actions
  kickOpenDoor: () => void
  lookForTrouble: (monsterId: string) => void
  lootRoom: () => void

  // Combat
  fightMonster: () => void
  playItemInCombat: (cardId: string) => void
  flee: () => void
  defeatMonster: () => void

  // Card management
  equipItem: (cardId: string) => void
  unequipItem: (cardId: string) => void
  discardCard: (cardId: string) => void
  drawTreasure: (count: number) => void

  // Turn
  endTurn: () => void

  // Computed
  currentPlayer: () => Player
  currentCombatStrength: () => number
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
  combatBonus: 0,
  helperIds: [],
  round: 0,
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

    // Deal 4 door + 4 treasure cards to each player
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

    if (card.type === 'monster') {
      get().addLog(`${players[currentPlayerIndex].name} відкрив двері — монстр! ${card.name}`)
      set({ phase: 'monster-fight', activeMonster: card as MonsterCard, doorDeck: newDeck, doorDiscard: newDiscard })
    } else if (card.type === 'curse') {
      get().addLog(`${players[currentPlayerIndex].name} відкрив двері — прокляття! ${card.name}`)
      // Apply curse effect (simplified)
      const updatedPlayers = [...players]
      const player = { ...updatedPlayers[currentPlayerIndex] }
      if (card.effect.type === 'lose-level' && player.level > 1) {
        player.level = Math.max(1, player.level - (card.effect.value ?? 1))
      }
      updatedPlayers[currentPlayerIndex] = player
      set({ phase: 'loot-room', players: updatedPlayers, doorDeck: newDeck, doorDiscard: [...newDiscard, card] })
    } else {
      // Race or class — goes to hand
      get().addLog(`${players[currentPlayerIndex].name} знайшов: ${card.name}`)
      const updatedPlayers = [...players]
      const player = { ...updatedPlayers[currentPlayerIndex] }
      player.hand = [...player.hand, card]
      updatedPlayers[currentPlayerIndex] = player
      set({ phase: 'loot-room', players: updatedPlayers, doorDeck: newDeck, doorDiscard: newDiscard })
    }
  },

  lookForTrouble: (monsterId) => {
    const { players, currentPlayerIndex } = get()
    const player = players[currentPlayerIndex]
    const monsterCard = player.hand.find(c => c.id === monsterId) as MonsterCard | undefined
    if (!monsterCard) return

    const updatedPlayers = [...players]
    const updatedPlayer = { ...player, hand: player.hand.filter(c => c.id !== monsterId) }
    updatedPlayers[currentPlayerIndex] = updatedPlayer

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
    if (strength > activeMonster.level) {
      get().defeatMonster()
    } else {
      get().addLog(`Сила ${strength} < Монстр ${activeMonster.level}. Тікай або проси допомоги!`)
    }
  },

  playItemInCombat: (cardId) => {
    const { players, currentPlayerIndex, combatBonus } = get()
    const player = players[currentPlayerIndex]
    const card = player.hand.find(c => c.id === cardId)
    if (!card) return

    if (card.type === 'potion' || card.type === 'one-shot') {
      const bonus = (card as any).effect?.value ?? 0
      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex] = { ...player, hand: player.hand.filter(c => c.id !== cardId) }
      get().addLog(`${player.name} грає ${card.name} (+${bonus} до бою)`)
      set({ players: updatedPlayers, combatBonus: combatBonus + bonus })
    }
  },

  flee: () => {
    const { activeMonster, players, currentPlayerIndex } = get()
    const roll = Math.floor(Math.random() * 6) + 1
    const player = players[currentPlayerIndex]
    get().addLog(`${player.name} тікає! Кубик: ${roll}`)

    if (roll >= 5) {
      get().addLog(`Успішна втеча!`)
      set({ phase: 'end-turn', activeMonster: null, combatBonus: 0, helperIds: [] })
    } else {
      // Bad stuff
      get().addLog(`Не вдалось втекти! ${activeMonster?.badStuff}`)
      const updatedPlayers = [...players]
      const p = { ...updatedPlayers[currentPlayerIndex] }
      if (activeMonster?.badStuff.includes('рівень')) {
        p.level = Math.max(1, p.level - 1)
      }
      updatedPlayers[currentPlayerIndex] = p
      set({ phase: 'end-turn', activeMonster: null, combatBonus: 0, helperIds: [], players: updatedPlayers })
    }
  },

  defeatMonster: () => {
    const { activeMonster, players, currentPlayerIndex, treasureDeck, treasureDiscard, doorDiscard } = get()
    if (!activeMonster) return

    const updatedPlayers = [...players]
    const player = { ...updatedPlayers[currentPlayerIndex] }

    // Level up
    player.level = Math.min(10, player.level + 1)

    // Draw treasures
    let tDeck = [...treasureDeck]
    let tDiscard = [...treasureDiscard]
    for (let i = 0; i < activeMonster.treasures; i++) {
      const { card, newDeck, newDiscard } = drawFromDeck(tDeck, tDiscard)
      player.hand = [...player.hand, card]
      tDeck = newDeck
      tDiscard = newDiscard
    }

    updatedPlayers[currentPlayerIndex] = player
    get().addLog(`${player.name} переміг ${activeMonster.name}! +1 рівень, +${activeMonster.treasures} скарби`)

    if (player.level >= 10) {
      get().addLog(`🏆 ${player.name} ПЕРЕМІГ! Рівень 10!`)
      set({ phase: 'waiting', players: updatedPlayers })
      return
    }

    set({
      phase: 'end-turn',
      players: updatedPlayers,
      activeMonster: null,
      combatBonus: 0,
      helperIds: [],
      treasureDeck: tDeck,
      treasureDiscard: tDiscard,
      doorDiscard: [...doorDiscard, activeMonster],
    })
  },

  // ── Card management ────────────────────────────────────────────────────────

  equipItem: (cardId) => {
    const { players, currentPlayerIndex } = get()
    const player = players[currentPlayerIndex]
    const card = player.hand.find(c => c.id === cardId) as ItemCard | undefined
    if (!card || card.type !== 'item') return

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

  // ── Turn ───────────────────────────────────────────────────────────────────

  endTurn: () => {
    const { players, currentPlayerIndex, round } = get()
    const nextIndex = (currentPlayerIndex + 1) % players.length
    const nextPlayer = players[nextIndex]
    const newRound = nextIndex === 0 ? round + 1 : round

    // Charity: if hand > 5 cards, must discard (simplified — auto-discard oldest)
    const updatedPlayers = [...players]
    const p = { ...updatedPlayers[currentPlayerIndex] }
    // Hand limit is 5
    while (p.hand.length > 5) {
      const [, ...rest] = p.hand
      p.hand = rest
      get().addLog(`${p.name} скидає зайву карту (ліміт руки)`)
      // discard logic simplified
    }
    updatedPlayers[currentPlayerIndex] = p

    get().addLog(`Хід переходить до: ${nextPlayer.name}`)
    set({
      phase: 'kick-open-door',
      currentPlayerIndex: nextIndex,
      round: newRound,
      activeMonster: null,
      combatBonus: 0,
      helperIds: [],
      players: updatedPlayers,
    })
  },

  // ── Computed ───────────────────────────────────────────────────────────────

  currentPlayer: () => {
    const { players, currentPlayerIndex } = get()
    return players[currentPlayerIndex]
  },

  currentCombatStrength: () => {
    const { players, currentPlayerIndex, combatBonus } = get()
    const player = players[currentPlayerIndex]
    if (!player) return 0
    return playerCombatStrength(player) + combatBonus
  },

  log: [],
  addLog: (msg) => set(s => ({ log: [msg, ...s.log].slice(0, 50) })),
}))

// ─── Selectors ────────────────────────────────────────────────────────────────

export const PHASE_LABELS: Record<GamePhase, string> = {
  waiting:          '⏳ Очікування',
  'kick-open-door': '🚪 Відкрий Двері',
  'monster-fight':  '⚔️ Бій з Монстром',
  'loot-room':      '💰 Пограбуй Кімнату',
  'look-for-trouble': '😈 Шукай Проблем',
  charity:          '🎁 Благодійність',
  'end-turn':       '🔄 Кінець Ходу',
}
