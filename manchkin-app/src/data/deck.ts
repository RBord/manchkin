import type {
  MonsterCard, CurseCard, RaceCard, ClassCard, ItemCard, PotionCard, AnyCard,
} from '../types'

// ─── DOOR CARDS — Monsters ────────────────────────────────────────────────────

const monsters: MonsterCard[] = [
  {
    id: 'monster-001', name: 'Кричущий Гоблін', category: 'door', type: 'monster',
    description: 'Маленький, але дуже галасливий. Кричить до тих пір, поки ти не втечеш.',
    flavor: '«АА-А-А-А-А-А!!!»',
    level: 2, badStuff: 'Втрачаєш 1 рівень', treasures: 1,
  },
  {
    id: 'monster-002', name: 'Нежить-Бухгалтер', category: 'door', type: 'monster',
    description: 'Підраховує твої борги навіть після смерті. Особливо після смерті.',
    flavor: 'Смерть — не причина не платити податки.',
    level: 4, badStuff: 'Втрачаєш найкращий предмет', treasures: 2,
    bonuses: [{ against: ['cleric'], bonus: -2 }],
  },
  {
    id: 'monster-003', name: 'Великий Дракон', category: 'door', type: 'monster',
    description: 'Вогнедишний, жадібний і дуже образливий щодо своїх розмірів.',
    flavor: 'Він не товстий. Він просто пухнастий.',
    level: 10, badStuff: 'Помираєш. Одразу. Без варіантів.', treasures: 4,
  },
  {
    id: 'monster-004', name: 'Плюшевий Демон', category: 'door', type: 'monster',
    description: 'Виглядає мило. Це пастка.',
    flavor: 'Обіймашки? Ні. Обгризашки.',
    level: 3, badStuff: 'Втрачаєш 2 рівні', treasures: 1,
    bonuses: [{ against: ['halfling'], bonus: 3 }],
  },
  {
    id: 'monster-005', name: 'Кіт Рівня 9000', category: 'door', type: 'monster',
    description: 'Ніхто не знає звідки він взявся. Просто сидить і дивиться.',
    flavor: 'Мяу.',
    level: 6, badStuff: 'Втрачаєш клас', treasures: 2,
  },
  {
    id: 'monster-006', name: 'Тролль під Мостом', category: 'door', type: 'monster',
    description: 'Стягує плату за прохід. Кожного разу. Навіть якщо мосту нема.',
    flavor: 'Це приватна власність!',
    level: 5, badStuff: 'Втрачаєш 500 золотих або 1 рівень', treasures: 2,
  },
  {
    id: 'monster-007', name: 'Зомбі-Піцамен', category: 'door', type: 'monster',
    description: 'Доставляє піцу. Мертву. Тобі.',
    flavor: 'Замовлення №666. Доставка до катакомб.',
    level: 3, badStuff: 'Втрачаєш расу', treasures: 1,
  },
  {
    id: 'monster-008', name: 'Злий Чарівник', category: 'door', type: 'monster',
    description: 'Дуже злий. Особливо з ранку. Не чіпай до кави.',
    flavor: 'Заклинання? Ні, просто дуже поганий настрій.',
    level: 7, badStuff: 'Рандомно втрачаєш 2 картки з руки', treasures: 3,
    bonuses: [{ against: ['wizard'], bonus: 2 }],
  },
  {
    id: 'monster-009', name: 'Павук-Іпохондрик', category: 'door', type: 'monster',
    description: 'Укушений своїм же неіснуючим хворобами. Але укус реальний.',
    flavor: '«Мені здається, у мене лихоманка і 6 лапок ниють»',
    level: 4, badStuff: 'Втрачаєш взуття', treasures: 2,
  },
  {
    id: 'monster-010', name: 'Мінотавр-Менеджер', category: 'door', type: 'monster',
    description: 'Надсилає мотиваційні листи електронною поштою навіть у лабіринті.',
    flavor: 'Синергія, дедлайни, бик.',
    level: 8, badStuff: 'Втрачаєш 3 рівні', treasures: 3,
  },
]

// ─── DOOR CARDS — Curses ──────────────────────────────────────────────────────

const curses: CurseCard[] = [
  {
    id: 'curse-001', name: 'Прокляття!', category: 'door', type: 'curse',
    description: 'Ти наступив на щось ліпке у темряві.',
    flavor: 'Ой-ой.',
    effect: { type: 'lose-level', value: 1, description: 'Втрачаєш 1 рівень' },
  },
  {
    id: 'curse-002', name: 'Зіпсований Шолом', category: 'door', type: 'curse',
    description: 'Твій найкращий головний убір розсипається на порох.',
    flavor: 'Гарантія? Яка гарантія?',
    effect: { type: 'lose-item', description: 'Скидаєш головний убір (або будь-який предмет)' },
  },
  {
    id: 'curse-003', name: 'Забув Хто Ти', category: 'door', type: 'curse',
    description: 'Магічна амнезія. Клас? Який клас?',
    flavor: 'Ти просто людина. Звичайна. Беззбройна.',
    effect: { type: 'lose-class', description: 'Скидаєш карту класу' },
  },
  {
    id: 'curse-004', name: 'Расова Плутанина', category: 'door', type: 'curse',
    description: 'Хтось переплутав твої гени. Ти знову людина.',
    flavor: 'Вуха стали нормального розміру. Жах.',
    effect: { type: 'lose-race', description: 'Скидаєш карту раси' },
  },
  {
    id: 'curse-005', name: 'Злодій у Ночі', category: 'door', type: 'curse',
    description: 'Хтось поцупив твою зброю поки ти спав.',
    flavor: 'Може, гоблін. Може, сусід по кімнаті.',
    effect: { type: 'lose-item', description: 'Скидаєш найкращу зброю' },
  },
]

// ─── DOOR CARDS — Races ───────────────────────────────────────────────────────

const races: RaceCard[] = [
  {
    id: 'race-001', name: 'Ельф', category: 'door', type: 'race',
    description: 'Ельфи отримують рівень кожного разу, коли допомагають іншому гравцю перемогти монстра.',
    flavor: 'Довговухі знавці лісу та балів досвіду.',
    ability: '+1 рівень за допомогу в бою', passiveBonus: 0,
  },
  {
    id: 'race-002', name: 'Гном', category: 'door', type: 'race',
    description: 'Гноми можуть носити будь-яку кількість малих предметів незалежно від слоту.',
    flavor: 'Маленький, але з великими кишенями.',
    ability: 'Ігнорує обмеження слотів для малих предметів', passiveBonus: 0,
  },
  {
    id: 'race-003', name: 'Хафлінг', category: 'door', type: 'race',
    description: 'Хафлінги можуть скинути 1 картку щоб уникнути прокляття.',
    flavor: 'Маленький, пухнастий і дуже спритний.',
    ability: 'Скинь картку — уникни прокляття', passiveBonus: 0,
  },
]

// ─── DOOR CARDS — Classes ─────────────────────────────────────────────────────

const classes: ClassCard[] = [
  {
    id: 'class-001', name: 'Воїн', category: 'door', type: 'class',
    description: 'Воїн може носити дві дворучні зброї одночасно.',
    flavor: 'М\'язи є — мозку не треба.',
    ability: 'Носить 2 великі зброї', passiveBonus: 0,
  },
  {
    id: 'class-002', name: 'Маг', category: 'door', type: 'class',
    description: 'Маг може кидати будь-які одноразові заклинання навіть у бою.',
    flavor: 'Знання — сила. Особливо вогняні кулі.',
    ability: 'Одноразові картки можна грати у будь-який момент', passiveBonus: 0,
  },
  {
    id: 'class-003', name: 'Злодій', category: 'door', type: 'class',
    description: 'Злодій може "позичати" предмети переможених монстрів до роздачі.',
    flavor: 'Це не крадіжка. Це перерозподіл скарбів.',
    ability: 'Бере скарби першим після перемоги над монстром', passiveBonus: 0,
  },
  {
    id: 'class-004', name: 'Клірик', category: 'door', type: 'class',
    description: 'Клірик отримує +2 проти нежиті та +1 рівень після перемоги над нею.',
    flavor: 'Святе слово і кулак — кращі аргументи.',
    ability: '+2 проти нежиті, +1 рівень за їх знищення', passiveBonus: 2,
  },
]

// ─── TREASURE CARDS — Items ───────────────────────────────────────────────────

const items: ItemCard[] = [
  {
    id: 'item-001', name: 'Магічний Молот +5', category: 'treasure', type: 'item',
    description: 'Великий молот, що б\'є сам. Іноді занадто само.',
    flavor: 'Прийшов. Побачив. Вдарив.',
    bonus: 5, slot: 'hands-1', value: 600,
  },
  {
    id: 'item-002', name: 'Шолом Розуму -1', category: 'treasure', type: 'item',
    description: 'Захищає голову. Не мозок.',
    flavor: 'Але виглядає круто!',
    bonus: 3, slot: 'head', value: 400,
  },
  {
    id: 'item-003', name: 'Черевики Швидкості', category: 'treasure', type: 'item',
    description: 'Тікаєш завжди на 1-5 замість 1-4 при втечі.',
    flavor: 'Ноги — найкраща зброя.',
    bonus: 2, slot: 'footwear', value: 200,
  },
  {
    id: 'item-004', name: 'Броня Бюрократа', category: 'treasure', type: 'item',
    description: 'Папери, звіти та форми перекривають будь-який удар.',
    flavor: 'Монстри теж не люблять паперову роботу.',
    bonus: 4, slot: 'armor', bigItem: true, value: 400,
  },
  {
    id: 'item-005', name: 'Меч Долі', category: 'treasure', type: 'item',
    description: 'Легендарна зброя. Дуже важка. Дуже гостра.',
    flavor: 'Ти обраний. Або просто підняв перший-ліпший меч.',
    bonus: 6, slot: 'hands-1', bigItem: true, value: 700,
  },
  {
    id: 'item-006', name: 'Рукавиці Кулачника', category: 'treasure', type: 'item',
    description: 'Просто шкіряні рукавиці. Але з шипами.',
    flavor: '«Вибач» — не в моєму словнику.',
    bonus: 3, slot: 'hands-2', value: 300,
  },
  {
    id: 'item-007', name: 'Плащ Невидимки', category: 'treasure', type: 'item',
    description: 'Ховає тебе від монстрів. І від друзів. І від боргів.',
    flavor: 'Де ти? — Тут. — Де тут?',
    bonus: 2, slot: 'armor', value: 200,
  },
  {
    id: 'item-008', name: 'Амулет Удачі', category: 'treasure', type: 'item',
    description: 'Дає +1 до всіх кидків кубика.',
    flavor: 'Удача — це теж навичка.',
    bonus: 1, slot: 'none', value: 100,
  },
  {
    id: 'item-009', name: 'Дворучний Топір', category: 'treasure', type: 'item',
    description: 'Займає обидві руки. Але яке відчуття!',
    flavor: 'Технічно це зброя. Технічно.',
    bonus: 4, slot: 'hands-1', bigItem: true, value: 500,
  },
  {
    id: 'item-010', name: 'Зачарований Щит', category: 'treasure', type: 'item',
    description: 'Відбиває удари та образи.',
    flavor: 'Образи особливо боляче відбиваються.',
    bonus: 3, slot: 'hands-2', value: 300,
  },
]

// ─── TREASURE CARDS — Potions / One-shots ─────────────────────────────────────

const potions: PotionCard[] = [
  {
    id: 'potion-001', name: 'Зілля Зростання', category: 'treasure', type: 'potion',
    description: 'Використай у бою. +3 до твоєї сили цього бою.',
    flavor: 'На смак — малина. На ефект — дуже дивно.',
    effect: { type: 'combat-bonus', value: 3, description: '+3 до сили у поточному бою' },
    value: 300,
  },
  {
    id: 'potion-002', name: 'Зілля Хоробрості', category: 'treasure', type: 'potion',
    description: '+2 до сили цього бою. Не поєднується з алкоголем.',
    flavor: 'Ціна — 200 золотих. Хоробрість — безцінна.',
    effect: { type: 'combat-bonus', value: 2, description: '+2 до сили у поточному бою' },
    value: 200,
  },
  {
    id: 'potion-003', name: 'Турбо-Ноги', category: 'treasure', type: 'one-shot',
    description: 'Одноразова карта. Автоматична втеча від монстра без кидка кубика.',
    flavor: 'Іноді мудрість — це просто швидкі ноги.',
    effect: { type: 'combat-bonus', value: 0, description: 'Автоматична втеча від монстра' },
    value: 200,
  },
  {
    id: 'potion-004', name: 'Диванна Граната', category: 'treasure', type: 'one-shot',
    description: '+5 до бою для будь-якого гравця. Одноразова.',
    flavor: 'Знайдено за підлокітником дивана підземелля.',
    effect: { type: 'combat-bonus', value: 5, description: '+5 до сили у бою (будь-який гравець)' },
    value: 500,
  },
  {
    id: 'potion-005', name: 'Зілля Посилення Монстра', category: 'treasure', type: 'one-shot',
    description: 'Можна зіграти на монстра противника. +5 до рівня монстра.',
    flavor: 'Дружба — це коли ти поганий для всіх.',
    effect: { type: 'combat-bonus', value: -5, description: '+5 до рівня монстра (грається проти гравця)' },
    value: 100,
  },
]

// ─── Full decks ───────────────────────────────────────────────────────────────

export const DOOR_DECK: AnyCard[] = [...monsters, ...curses, ...races, ...classes]
export const TREASURE_DECK: AnyCard[] = [...items, ...potions]

export function shuffleDeck<T>(deck: T[]): T[] {
  const arr = [...deck]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
