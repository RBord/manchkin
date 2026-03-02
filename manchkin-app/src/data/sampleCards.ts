import type { MonsterCard, CurseCard, RaceCard, ClassCard, ItemCard, PotionCard } from '../types'

export const sampleMonster: MonsterCard = {
  id: 'monster-001',
  name: 'Кричущий Гоблін',
  category: 'door',
  type: 'monster',
  description: 'Маленький, але дуже галасливий. Кричить до тих пір, поки ти не втечеш.',
  flavor: '«АА-А-А-А-А-А!!!»',
  level: 4,
  badStuff: 'Втрачаєш 1 рівень',
  treasures: 1,
  bonuses: [{ against: ['elf'], bonus: 2 }],
}

export const sampleCurse: CurseCard = {
  id: 'curse-001',
  name: 'Прокляття!',
  category: 'door',
  type: 'curse',
  description: 'Ой-ой. Це неприємно.',
  flavor: 'Ти наступив на щось ліпке у темряві.',
  effect: {
    type: 'lose-level',
    value: 1,
    description: 'Втрачаєш 1 рівень (мінімум 1)',
  },
}

export const sampleRace: RaceCard = {
  id: 'race-001',
  name: 'Ельф',
  category: 'door',
  type: 'race',
  description: 'Ельфи отримують рівень кожного разу, коли допомагають іншому гравцю перемогти монстра.',
  flavor: 'Довговухі знавці лісу та балів досвіду.',
  ability: '+1 рівень за допомогу в бою',
  passiveBonus: 1,
}

export const sampleClass: ClassCard = {
  id: 'class-001',
  name: 'Воїн',
  category: 'door',
  type: 'class',
  description: 'Воїн може носити будь-яку зброю. Один раз за бій може +1d6 до своєї сили.',
  flavor: 'М\'язи є — мозку не треба.',
  ability: 'Носить будь-яку зброю. +1d6 у бою раз на раунд.',
  passiveBonus: 0,
}

export const sampleItem: ItemCard = {
  id: 'item-001',
  name: 'Магічний Молот +5',
  category: 'treasure',
  type: 'item',
  description: 'Великий молот, що світиться магічним блакитним світлом. Або це просто фарба.',
  flavor: 'Прийшов. Побачив. Вдарив.',
  bonus: 5,
  slot: 'weapon-1h',
  bigItem: false,
  value: 600,
}

export const samplePotion: PotionCard = {
  id: 'potion-001',
  name: 'Зілля Зростання',
  category: 'treasure',
  type: 'potion',
  description: 'Використай у бою. +3 до твоєї сили цього бою.',
  flavor: 'На смак — малина. На ефект — дуже дивно.',
  effect: {
    type: 'combat-bonus',
    value: 3,
    description: '+3 до сили у поточному бою',
  },
  value: 300,
}

export const allSampleCards = [
  sampleMonster,
  sampleCurse,
  sampleRace,
  sampleClass,
  sampleItem,
  samplePotion,
]
