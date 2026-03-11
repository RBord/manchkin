// ─── Card Types ───────────────────────────────────────────────────────────────

export type CardCategory = 'door' | 'treasure'

export type DoorCardType = 'monster' | 'curse' | 'race' | 'class'
export type TreasureCardType = 'item' | 'potion' | 'one-shot'

export type CardType = DoorCardType | TreasureCardType

export type ItemSlot =
  | 'head'           // шолом
  | 'armor'          // панцир
  | 'footwear'       // чоботи
  | 'gloves'         // рукавиці
  | 'weapon-1h'      // однорукова зброя / щит
  | 'weapon-2h'      // дворучна зброя
  | 'weapon-ranged'  // метальна зброя
  | 'accessory'      // аксесуар (кільце, кулон)
  | 'none'           // без слоту

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
  legendary?: boolean
  tags?: string[]   // e.g. 'undead', 'dragon', 'demon'
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
  legendary?: boolean
  requiredRace?: Race[]
  requiredClass?: Class[]
}

export interface PotionCard extends BaseCard {
  category: 'treasure'
  type: 'potion' | 'one-shot'
  effect: CardEffect
  value?: number
  requiredRace?: Race[]
  requiredClass?: Class[]
  antiCurse?: boolean    // can be played to block a curse aimed at holder
}

export type AnyCard = MonsterCard | CurseCard | RaceCard | ClassCard | ItemCard | PotionCard

// ─── Effect & Bonus Types ─────────────────────────────────────────────────────

export interface CardEffect {
  type: 'lose-level' | 'lose-item' | 'lose-race' | 'lose-class' | 'lose-hand' | 'combat-bonus' | 'lose-gold'
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
  showcase: ItemCard[]      // items on display (don't count toward hand limit)
  raceCard: RaceCard | null
  classCard: ClassCard | null
  gold: number
  hasSoldThisTurn: boolean
  isAlive: boolean
}

// ─── Game Phase Types ─────────────────────────────────────────────────────────

export type GamePhase =
  | 'waiting'
  | 'kick-open-door'
  | 'door-reveal'
  | 'monster-fight'
  | 'loot-room'
  | 'look-for-trouble'
  | 'charity'
  | 'end-turn'

export interface CombatCardEntry {
  card: AnyCard
  playedById: string
  side: 'hero' | 'monster'
  bonus: number
}

export interface HelpReward {
  helperId: string
  cardId: string | null    // null = "від перемоги"
  fromVictory: boolean
  victoryCount: number     // how many victory treasures to give (default 1)
}

export interface DiceRollResult {
  value: number
  success: boolean
  badStuff: string
}

export interface PendingCurse {
  curse: CurseCard
  targetPlayerId: string
  fromDoorReveal: boolean   // true = was drawn from deck; false = cast by another player
}

export interface GameState {
  phase: GamePhase
  players: Player[]
  currentPlayerIndex: number
  doorDeck: AnyCard[]
  treasureDeck: AnyCard[]
  doorDiscard: AnyCard[]
  treasureDiscard: AnyCard[]
  activeMonster: MonsterCard | null
  revealedCard: AnyCard | null
  combatBonus: number
  monsterBonus: number
  combatCards: CombatCardEntry[]
  helperIds: string[]
  helpRewards: HelpReward[]
  diceRoll: DiceRollResult | null
  round: number
  handLimitPending: boolean
  tradeModal: { fromPlayerId: string; toPlayerId: string } | null
  pendingCurse: PendingCurse | null
}
