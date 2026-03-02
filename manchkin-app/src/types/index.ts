// ─── Card Types ───────────────────────────────────────────────────────────────

export type CardCategory = 'door' | 'treasure'

export type DoorCardType = 'monster' | 'curse' | 'race' | 'class'
export type TreasureCardType = 'item' | 'potion' | 'one-shot'

export type CardType = DoorCardType | TreasureCardType

export type ItemSlot = 'head' | 'armor' | 'footwear' | 'hands-1' | 'hands-2' | 'none'

export interface BaseCard {
  id: string
  name: string
  category: CardCategory
  type: CardType
  description: string
  imageUrl?: string
  flavor?: string
}

export interface MonsterCard extends BaseCard {
  category: 'door'
  type: 'monster'
  level: number
  badStuff: string
  treasures: number
  bonuses?: CardBonus[]
}

export interface CurseCard extends BaseCard {
  category: 'door'
  type: 'curse'
  effect: CardEffect
}

export interface RaceCard extends BaseCard {
  category: 'door'
  type: 'race'
  ability: string
  passiveBonus?: number
}

export interface ClassCard extends BaseCard {
  category: 'door'
  type: 'class'
  ability: string
  passiveBonus?: number
}

export interface ItemCard extends BaseCard {
  category: 'treasure'
  type: 'item'
  bonus: number
  slot: ItemSlot
  bigItem?: boolean
  value: number
}

export interface PotionCard extends BaseCard {
  category: 'treasure'
  type: 'potion' | 'one-shot'
  effect: CardEffect
  value?: number
}

export type AnyCard = MonsterCard | CurseCard | RaceCard | ClassCard | ItemCard | PotionCard

// ─── Effect & Bonus Types ─────────────────────────────────────────────────────

export interface CardEffect {
  type: 'lose-level' | 'lose-item' | 'lose-race' | 'lose-class' | 'lose-hand' | 'combat-bonus'
  value?: number
  description: string
}

export interface CardBonus {
  against?: string[]
  bonus: number
}

// ─── Player Types ─────────────────────────────────────────────────────────────

export type Race = 'human' | 'elf' | 'dwarf' | 'halfling'
export type Class = 'warrior' | 'wizard' | 'thief' | 'cleric' | 'none'
export type Gender = 'male' | 'female'

export interface Player {
  id: string
  name: string
  level: number
  race: Race
  class: Class
  gender: Gender
  hand: AnyCard[]
  equipped: ItemCard[]
  raceCard: RaceCard | null
  classCard: ClassCard | null
  gold: number
  isAlive: boolean
}

// ─── Game Phase Types ─────────────────────────────────────────────────────────

export type GamePhase =
  | 'waiting'
  | 'kick-open-door'
  | 'monster-fight'
  | 'loot-room'
  | 'look-for-trouble'
  | 'charity'
  | 'end-turn'

export interface GameState {
  phase: GamePhase
  players: Player[]
  currentPlayerIndex: number
  doorDeck: AnyCard[]
  treasureDeck: AnyCard[]
  doorDiscard: AnyCard[]
  treasureDiscard: AnyCard[]
  activeMonster: MonsterCard | null
  combatBonus: number
  monsterBonus: number
  helperIds: string[]
  round: number
}
