import type { Player, ItemCard, ItemSlot } from '../types'

// ─── Slot labels ─────────────────────────────────────────────────────────────

export const SLOT_LABELS: Record<ItemSlot, string> = {
  head:           'Шолом',
  armor:          'Панцир',
  footwear:       'Чоботи',
  gloves:         'Рукавиці',
  'weapon-1h':    'Зброя (1 рука)',
  'weapon-2h':    'Дворучна',
  'weapon-ranged':'Метальна',
  accessory:      'Аксесуар',
  none:           'Без слоту',
}

export const SLOT_ICONS: Record<ItemSlot, string> = {
  head:           '⛑️',
  armor:          '🛡️',
  footwear:       '👢',
  gloves:         '🧤',
  'weapon-1h':    '⚔️',
  'weapon-2h':    '🪓',
  'weapon-ranged':'🏹',
  accessory:      '💍',
  none:           '📦',
}

// ─── Hand calculation ─────────────────────────────────────────────────────────

export function handsUsed(equipped: ItemCard[]): number {
  return equipped.reduce((sum, item) => {
    if (item.slot === 'weapon-1h' || item.slot === 'weapon-ranged') return sum + 1
    if (item.slot === 'weapon-2h') return sum + 2
    return sum
  }, 0)
}

// ─── Equip validation ─────────────────────────────────────────────────────────

export function canEquipItem(player: Player, item: ItemCard): { ok: boolean; reason?: string } {
  // Race restriction
  if (item.requiredRace && item.requiredRace.length > 0 && !item.requiredRace.includes(player.race)) {
    return { ok: false, reason: `Тільки для раси: ${item.requiredRace.join(', ')}` }
  }

  // Class restriction
  if (item.requiredClass && item.requiredClass.length > 0 && !item.requiredClass.includes(player.class)) {
    return { ok: false, reason: `Тільки для класу: ${item.requiredClass.join(', ')}` }
  }

  const { slot } = item
  const isDwarf = player.race === 'dwarf'

  // Dwarf can equip multiple small (non-bigItem) items ignoring slot limits
  const dwarfExempt = isDwarf && !item.bigItem

  // Single-slot body armor slots
  if (slot === 'head' && player.equipped.some(i => i.slot === 'head')) {
    return dwarfExempt ? { ok: true } : { ok: false, reason: 'Голова вже зайнята' }
  }
  if (slot === 'armor' && player.equipped.some(i => i.slot === 'armor')) {
    return dwarfExempt ? { ok: true } : { ok: false, reason: 'Броня вже надягнена' }
  }
  if (slot === 'footwear' && player.equipped.some(i => i.slot === 'footwear')) {
    return dwarfExempt ? { ok: true } : { ok: false, reason: 'Чоботи вже надягнені' }
  }
  if (slot === 'gloves' && player.equipped.some(i => i.slot === 'gloves')) {
    return dwarfExempt ? { ok: true } : { ok: false, reason: 'Рукавиці вже надягнені' }
  }

  // Hand slots: warrior gets 4 hand slots, others get 2
  if (slot === 'weapon-1h' || slot === 'weapon-ranged' || slot === 'weapon-2h') {
    const maxHands = player.class === 'warrior' ? 4 : 2
    const used = handsUsed(player.equipped)
    const needed = slot === 'weapon-2h' ? 2 : 1
    if (used + needed > maxHands) {
      const msg = slot === 'weapon-2h'
        ? `Потрібно 2 вільних руки (зайнято ${used}/${maxHands})`
        : `Руки зайняті (${used}/${maxHands})`
      return { ok: false, reason: msg }
    }
  }

  // Accessories: max 2 (or unlimited for dwarf)
  if (slot === 'accessory') {
    const accCount = player.equipped.filter(i => i.slot === 'accessory').length
    if (accCount >= 2 && !isDwarf) {
      return { ok: false, reason: 'Максимум 2 аксесуари' }
    }
  }

  return { ok: true }
}

// ─── Can showcase check ───────────────────────────────────────────────────────

export function isItemRestricted(player: Player, item: ItemCard): boolean {
  if (item.requiredRace && item.requiredRace.length > 0 && !item.requiredRace.includes(player.race)) {
    return true
  }
  if (item.requiredClass && item.requiredClass.length > 0 && !item.requiredClass.includes(player.class)) {
    return true
  }
  return false
}
