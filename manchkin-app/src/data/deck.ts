import type {
  MonsterCard, CurseCard, RaceCard, ClassCard, ItemCard, PotionCard, AnyCard,
} from '../types'
import forestTroll from '../assets/arts/forest-troll.jpg'

// ─── DOOR CARDS — Monsters ────────────────────────────────────────────────────

const monsters: MonsterCard[] = [
  {
    id: 'monster-001', name: 'Кричущий Гоблін', category: 'door', type: 'monster',
    description: 'Маленький, але дуже галасливий. Кричить до тих пір, поки ти не втечеш.',
    flavor: '«АА-А-А-А-А-А!!!»',
    level: 2, badStuff: 'Втрачаєш 1 рівень', treasures: 1,
    tags: ['goblin'],
  },
  {
    id: 'monster-002', name: 'Нежить-Бухгалтер', category: 'door', type: 'monster',
    description: 'Підраховує твої борги навіть після смерті. Особливо після смерті.',
    flavor: 'Смерть — не причина не платити податки.',
    level: 4, badStuff: 'Втрачаєш найкращий предмет', treasures: 2,
    bonuses: [{ against: ['cleric'], bonus: -2 }],
    tags: ['undead'],
  },
  {
    id: 'monster-003', name: 'Великий Дракон', category: 'door', type: 'monster',
    description: 'Вогнедишний, жадібний і дуже образливий щодо своїх розмірів.',
    flavor: 'Він не товстий. Він просто пухнастий.',
    level: 10, badStuff: 'Помираєш. Одразу. Без варіантів.', treasures: 4,
    tags: ['dragon'],
  },
  {
    id: 'monster-004', name: 'Плюшевий Демон', category: 'door', type: 'monster',
    description: 'Виглядає мило. Це пастка.',
    flavor: 'Обіймашки? Ні. Обгризашки.',
    level: 3, badStuff: 'Втрачаєш 2 рівні', treasures: 1,
    bonuses: [{ against: ['halfling'], bonus: 3 }],
    tags: ['demon'],
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
    tags: ['troll'],
  },
  {
    id: 'monster-007', name: 'Зомбі-Піцамен', category: 'door', type: 'monster',
    description: 'Доставляє піцу. Мертву. Тобі.',
    flavor: 'Замовлення №666. Доставка до катакомб.',
    level: 3, badStuff: 'Втрачаєш расу', treasures: 1,
    tags: ['undead'],
  },
  {
    id: 'monster-008', name: 'Злий Чарівник', category: 'door', type: 'monster',
    description: 'Дуже злий. Особливо з ранку. Не чіпай до кави.',
    flavor: 'Заклинання? Ні, просто дуже поганий настрій.',
    level: 7, badStuff: 'Рандомно втрачаєш 2 картки з руки', treasures: 3,
    bonuses: [{ against: ['wizard'], bonus: 2 }],
    tags: ['wizard'],
  },
  {
    id: 'monster-009', name: 'Павук-Іпохондрик', category: 'door', type: 'monster',
    description: 'Укушений своїм же неіснуючим хворобами. Але укус реальний.',
    flavor: '«Мені здається, у мене лихоманка і 6 лапок ниють»',
    level: 4, badStuff: 'Втрачаєш взуття (чоботи)', treasures: 2,
    tags: ['beast'],
  },
  {
    id: 'monster-010', name: 'Мінотавр-Менеджер', category: 'door', type: 'monster',
    description: 'Надсилає мотиваційні листи електронною поштою навіть у лабіринті.',
    flavor: 'Синергія, дедлайни, бик.',
    level: 8, badStuff: 'Втрачаєш 3 рівні', treasures: 3,
    tags: ['beast'],
  },
  // New monsters
  {
    id: 'monster-011', name: 'Скелет-Лицар', category: 'door', type: 'monster',
    description: 'Колись шляхетний воїн. Тепер просто збірка кісток у латах.',
    flavor: '«Умерти за честь — це боляче. Воювати і після смерті — ще болячіше»',
    level: 5, badStuff: 'Втрачаєш найкращу зброю', treasures: 2,
    tags: ['undead'],
  },
  {
    id: 'monster-012', name: 'Вампір-Аристократ', category: 'door', type: 'monster',
    description: 'Носить фрак і п\'є кров виключно з кришталю.',
    flavor: 'Стиль — це все. Навіть для монстрів.',
    level: 7, badStuff: 'Втрачаєш 1 рівень і 300 золотих', treasures: 3,
    tags: ['undead', 'vampire'],
  },
  {
    id: 'monster-013', name: 'Бойовий Огр', category: 'door', type: 'monster',
    description: 'Просто великий і злий. Жодних планів, тільки удари.',
    flavor: '«АААА!!!» — весь його словниковий запас.',
    level: 4, badStuff: 'Втрачаєш 1 рівень', treasures: 2,
    tags: ['giant'],
  },
  {
    id: 'monster-014', name: 'Магічний Голем', category: 'door', type: 'monster',
    description: 'Зроблений з магії і бруду. В основному бруду.',
    flavor: 'Натиснути кнопку вимкнення? Яку кнопку?',
    level: 6, badStuff: 'Втрачаєш будь-який предмет', treasures: 2,
  },
  {
    id: 'monster-015', name: 'Лісовий Тролль', category: 'door', type: 'monster',
    description: 'Виростає знову після кожного удару. Злегка нервує.',
    flavor: 'Голова відросте. Він впевнений.',
    level: 6, badStuff: 'Втрачаєш клас', treasures: 2,
    tags: ['troll'],
    imageUrl: forestTroll,
  },
  {
    id: 'monster-016', name: 'Демон Хаосу', category: 'door', type: 'monster',
    description: 'Хаос в чистому вигляді. Навіть він сам не знає чого хоче.',
    flavor: 'Порядок — це просто хаос якому ліньки рухатись.',
    level: 9, badStuff: 'Втрачаєш 2 рівні', treasures: 3,
    tags: ['demon'],
  },
  // Legendary monsters
  {
    id: 'monster-017', name: 'Давній Ліч', category: 'door', type: 'monster',
    description: 'Настільки давній, що забув коли помер. Але тебе не забуде.',
    flavor: 'Некроманти приходять і йдуть. Ліч залишається.',
    level: 12, badStuff: 'Втрачаєш 3 рівні і всю зброю', treasures: 5,
    legendary: true, tags: ['undead', 'lich'],
  },
  {
    id: 'monster-018', name: 'Дракон Хаосу', category: 'door', type: 'monster',
    description: 'Поєднує вогонь, хаос, і надзвичайно поганий настрій.',
    flavor: 'Звичайний дракон убиває. Цей — публічно принижує.',
    level: 15, badStuff: 'Помираєш. Всі предмети розкидуються по підземеллю.', treasures: 6,
    legendary: true, tags: ['dragon', 'chaos'],
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
  // New curses
  {
    id: 'curse-006', name: 'Прокляте Золото', category: 'door', type: 'curse',
    description: 'Монети перетворюються на попіл. Чи навпаки — ти боржник.',
    flavor: 'Золото прокляте. Але борги — ще більше.',
    effect: { type: 'lose-gold', value: 300, description: 'Втрачаєш 300 золотих або 1 рівень' },
  },
  {
    id: 'curse-007', name: 'Важка Голова', category: 'door', type: 'curse',
    description: 'Магічна хвороба. Голова раптово стає непідйомною.',
    flavor: 'Шолом нічого не важить, але голова зараз — тонн десять.',
    effect: { type: 'lose-item', description: 'Скидаєш шолом (або 1 рівень якщо шолому нема)' },
  },
  {
    id: 'curse-008', name: 'Загальна Слабкість', category: 'door', type: 'curse',
    description: 'Всі твої м\'язи раптово вирішили взяти відпустку.',
    flavor: '«Спина хворить, ноги не слухаються, і взагалі я втомився»',
    effect: { type: 'lose-level', value: 1, description: 'Втрачаєш 1 рівень' },
  },
]

// ─── DOOR CARDS — Races ───────────────────────────────────────────────────────

const races: RaceCard[] = [
  {
    id: 'race-001', name: 'Ельф', category: 'door', type: 'race',
    description: 'Ельфи отримують рівень кожного разу, коли допомагають іншому гравцю перемогти монстра.',
    flavor: 'Довговухі знавці лісу та балів досвіду.',
    ability: '+1 рівень за кожну допомогу в бою',
    passiveBonus: 0,
  },
  {
    id: 'race-002', name: 'Гном', category: 'door', type: 'race',
    description: 'Гноми можуть носити будь-яку кількість малих (не великих) предметів незалежно від слоту.',
    flavor: 'Маленький, але з великими кишенями.',
    ability: 'Ігнорує обмеження слотів для малих предметів',
    passiveBonus: 0,
  },
  {
    id: 'race-003', name: 'Хафлінг', category: 'door', type: 'race',
    description: 'Хафлінги можуть скинути 1 картку з руки щоб уникнути прокляття. Обмін до відкриття.',
    flavor: 'Маленький, пухнастий і дуже спритний.',
    ability: 'Скинь картку — уникни прокляття (1 раз)',
    passiveBonus: 0,
  },
]

// ─── DOOR CARDS — Classes ─────────────────────────────────────────────────────

const classes: ClassCard[] = [
  {
    id: 'class-001', name: 'Воїн', category: 'door', type: 'class',
    description: 'Воїн може носити дві дворучні зброї одночасно (4 руки замість 2).',
    flavor: 'М\'язи є — мозку не треба.',
    ability: 'Носить зброю в 4 руки замість 2',
    passiveBonus: 0,
  },
  {
    id: 'class-002', name: 'Маг', category: 'door', type: 'class',
    description: 'Маг отримує +1 до ефекту будь-якого одноразового зілля в бою.',
    flavor: 'Знання — сила. Особливо вогняні кулі.',
    ability: 'Зілля та заклинання в бою дають +1 більше',
    passiveBonus: 0,
  },
  {
    id: 'class-003', name: 'Злодій', category: 'door', type: 'class',
    description: 'Злодій отримує на 1 скарб більше після перемоги над монстром.',
    flavor: 'Це не крадіжка. Це перерозподіл скарбів.',
    ability: '+1 скарб після перемоги',
    passiveBonus: 0,
  },
  {
    id: 'class-004', name: 'Клірик', category: 'door', type: 'class',
    description: 'Клірик отримує +3 до сили проти нежиті та +1 рівень після перемоги над ними.',
    flavor: 'Святе слово і кулак — кращі аргументи.',
    ability: '+3 проти нежиті, +1 рівень за їх знищення',
    passiveBonus: 0,
  },
]

// ─── TREASURE CARDS — Items ───────────────────────────────────────────────────

const items: ItemCard[] = [
  // ── Existing items (remapped slots) ──────────────────────────────────────────
  {
    id: 'item-001', name: 'Магічний Молот +5', category: 'treasure', type: 'item',
    description: 'Великий молот, що б\'є сам. Іноді занадто само.',
    flavor: 'Прийшов. Побачив. Вдарив.',
    bonus: 5, slot: 'weapon-1h', value: 600,
  },
  {
    id: 'item-002', name: 'Шолом Розуму -1', category: 'treasure', type: 'item',
    description: 'Захищає голову. Не мозок.',
    flavor: 'Але виглядає круто!',
    bonus: 3, slot: 'head', value: 400,
  },
  {
    id: 'item-003', name: 'Черевики Швидкості', category: 'treasure', type: 'item',
    description: 'Покращуєш шанс втечі. +1 до кидка при втечі.',
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
    bonus: 6, slot: 'weapon-1h', bigItem: true, value: 700,
  },
  {
    id: 'item-006', name: 'Рукавиці Кулачника', category: 'treasure', type: 'item',
    description: 'Просто шкіряні рукавиці. Але з шипами.',
    flavor: '«Вибач» — не в моєму словнику.',
    bonus: 3, slot: 'gloves', value: 300,
  },
  {
    id: 'item-007', name: 'Плащ Невидимки', category: 'treasure', type: 'item',
    description: 'Ховає тебе від монстрів. І від друзів. І від боргів.',
    flavor: 'Де ти? — Тут. — Де тут?',
    bonus: 2, slot: 'armor', value: 200,
  },
  {
    id: 'item-008', name: 'Амулет Удачі', category: 'treasure', type: 'item',
    description: 'Дає +1 до сили в бою.',
    flavor: 'Удача — це теж навичка.',
    bonus: 1, slot: 'accessory', value: 100,
  },
  {
    id: 'item-009', name: 'Дворучний Топір', category: 'treasure', type: 'item',
    description: 'Займає обидві руки. Але яке відчуття!',
    flavor: 'Технічно це зброя. Технічно.',
    bonus: 4, slot: 'weapon-2h', bigItem: true, value: 500,
  },
  {
    id: 'item-010', name: 'Зачарований Щит', category: 'treasure', type: 'item',
    description: 'Відбиває удари та образи.',
    flavor: 'Образи особливо боляче відбиваються.',
    bonus: 3, slot: 'weapon-1h', value: 300,
  },
  // ── New items ─────────────────────────────────────────────────────────────────
  {
    id: 'item-011', name: 'Бойовий Молот', category: 'treasure', type: 'item',
    description: 'Велетенський двуручний молот. Повільний, але нищівний.',
    flavor: 'Спочатку думай, потім бий. Або навпаки — у нас так прийнято.',
    bonus: 5, slot: 'weapon-2h', bigItem: true, value: 600,
  },
  {
    id: 'item-012', name: 'Ельфійський Лук', category: 'treasure', type: 'item',
    description: 'Виготовлений зі срібного дерева. Влучає завжди. Майже.',
    flavor: 'Стріла летить як душа — без повороту.',
    bonus: 4, slot: 'weapon-ranged', value: 500,
    requiredRace: ['elf'],
  },
  {
    id: 'item-013', name: 'Кинджал Тіні', category: 'treasure', type: 'item',
    description: 'Невидимий у темряві. Що, власне, і потрібно.',
    flavor: 'Найкраща зброя — та, яку жертва не бачить.',
    bonus: 3, slot: 'weapon-ranged', value: 400,
    requiredClass: ['thief'],
  },
  {
    id: 'item-014', name: 'Рукавиці Сили', category: 'treasure', type: 'item',
    description: 'Потроюють міцність удару. І ламають кружки.',
    flavor: 'З ними навіть вітання небезпечне.',
    bonus: 3, slot: 'gloves', value: 350,
  },
  {
    id: 'item-015', name: 'Рукавиці Злодія', category: 'treasure', type: 'item',
    description: 'Надзвичайно тонкі. Сліди не залишають.',
    flavor: 'Не мої — я просто тримав.',
    bonus: 4, slot: 'gloves', value: 400,
    requiredClass: ['thief'],
  },
  {
    id: 'item-016', name: 'Кулон Удачі', category: 'treasure', type: 'item',
    description: 'Сімейна реліквія з підземелля. Хтось її точно загубив.',
    flavor: 'Тепер вона твоя. На щастя.',
    bonus: 2, slot: 'accessory', value: 250,
  },
  {
    id: 'item-017', name: 'Перстень Воїна', category: 'treasure', type: 'item',
    description: 'Символ бойового братства. Дає +3 до сили.',
    flavor: 'Тільки той, хто пережив 100 боїв, може його носити. Або купити.',
    bonus: 3, slot: 'accessory', value: 350,
    requiredClass: ['warrior'],
  },
  {
    id: 'item-018', name: 'Медальйон Клірика', category: 'treasure', type: 'item',
    description: 'Священний символ. Відлякує нежить і сусідів.',
    flavor: 'Ефективно проти 94% зла. На інші 6% — кулак.',
    bonus: 3, slot: 'accessory', value: 350,
    requiredClass: ['cleric'],
  },
  {
    id: 'item-019', name: 'Кольчуга Найманця', category: 'treasure', type: 'item',
    description: 'Перевірена в тисячах боїв. На деяких є сліди.',
    flavor: 'Сліди чиїх боїв? Краще не питай.',
    bonus: 4, slot: 'armor', value: 450,
  },
  {
    id: 'item-020', name: 'Чоботи Підземелля', category: 'treasure', type: 'item',
    description: 'Нечутна хода. Ідеальні для підземних пригод.',
    flavor: 'Крок, крок, крок... невже ніхто не чує?',
    bonus: 3, slot: 'footwear', value: 350,
  },
  // ── Legendary items ───────────────────────────────────────────────────────────
  {
    id: 'item-021', name: 'Легендарний Клинок Долі', category: 'treasure', type: 'item',
    description: 'Зброя із старовинних хронік. Говорять, вона сама вибирає господаря.',
    flavor: 'Вибрала тебе. Ну, або тебе ніхто інший не хотів.',
    bonus: 8, slot: 'weapon-2h', bigItem: true, legendary: true, value: 1200,
  },
  {
    id: 'item-022', name: 'Ельфійська Корона', category: 'treasure', type: 'item',
    description: 'Корона давніх ельфійських королів. Надає мудрість і бойову міць.',
    flavor: 'Не кожен її вартий. Ти — точно ні. Але що вдієш.',
    bonus: 6, slot: 'head', legendary: true, value: 900,
    requiredRace: ['elf'],
  },
  {
    id: 'item-023', name: 'Броня Берсерка', category: 'treasure', type: 'item',
    description: 'Виготовлена з магічного металу. Дає несамовиту силу у бою.',
    flavor: 'Клас воїна не потрібен. Але з ним набагато веселіше.',
    bonus: 7, slot: 'armor', bigItem: true, legendary: true, value: 1000,
    requiredClass: ['warrior'],
  },
  {
    id: 'item-024', name: 'Посох Великого Мага', category: 'treasure', type: 'item',
    description: 'Посилює всі магічні ефекти. Зілля стають вдвічі сильнішими.',
    flavor: 'З цим посохом навіть Маг з 1-го рівня страшний.',
    bonus: 6, slot: 'weapon-2h', bigItem: true, legendary: true, value: 1000,
    requiredClass: ['wizard'],
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
  // New potions
  {
    id: 'potion-006', name: 'Берсерк-Зілля', category: 'treasure', type: 'potion',
    description: '+3 до сили. Побічні ефекти: гикавка.',
    flavor: 'Небезпечно для серця. Зате добре для перемоги.',
    effect: { type: 'combat-bonus', value: 3, description: '+3 до сили у поточному бою' },
    value: 300,
  },
  {
    id: 'potion-007', name: 'Еліксир Магічного Кола', category: 'treasure', type: 'one-shot',
    description: 'Тільки для магів. Дає +4 до сили та додатковий ефект від посоха.',
    flavor: 'Маги знають, що з цим робити. Всі інші — просто п\'ють.',
    effect: { type: 'combat-bonus', value: 4, description: '+4 до сили (Маг отримує +5)' },
    value: 400,
    requiredClass: ['wizard'],
  },
  {
    id: 'potion-008', name: 'Ельфійське Зілля Духу', category: 'treasure', type: 'potion',
    description: '+3 до сили. Ельфи також отримують +1 рівень після бою.',
    flavor: 'Рецепт тисячоліттями зберігається в ельфійських лісах.',
    effect: { type: 'combat-bonus', value: 3, description: '+3 до сили (Ельф отримує +1 рівень після бою)' },
    value: 350,
    requiredRace: ['elf'],
  },
  // Anti-curse immunity cards
  {
    id: 'potion-009', name: 'Щит від Прокляття', category: 'treasure', type: 'one-shot',
    description: 'Зіграй коли на тебе направили прокляття — повністю блокує його ефект.',
    flavor: '«Прокляття? Не цього разу» — написано золотими буквами.',
    effect: { type: 'combat-bonus', value: 0, description: 'Блокує одне прокляття' },
    value: 400,
    antiCurse: true,
  },
  {
    id: 'potion-010', name: 'Оберіг Удачі', category: 'treasure', type: 'one-shot',
    description: 'Магічний талісман. Відводить найгірше — одного разу.',
    flavor: 'Маленька удача краще за великі проблеми.',
    effect: { type: 'combat-bonus', value: 0, description: 'Блокує одне прокляття' },
    value: 350,
    antiCurse: true,
  },
  {
    id: 'potion-011', name: 'Свята Вода', category: 'treasure', type: 'one-shot',
    description: 'Клірики освячують воду. Але пити її не рекомендується.',
    flavor: 'Тільки зовнішнє застосування. Або від прокляттів.',
    effect: { type: 'combat-bonus', value: 0, description: 'Блокує одне прокляття' },
    value: 300,
    antiCurse: true,
    requiredClass: ['cleric'],
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

export function drawFromDeck(deck: AnyCard[], discard: AnyCard[]): { card: AnyCard; newDeck: AnyCard[]; newDiscard: AnyCard[] } {
  if (deck.length === 0) {
    const newDeck = shuffleDeck([...discard])
    const [card, ...rest] = newDeck
    return { card, newDeck: rest, newDiscard: [] }
  }
  const [card, ...newDeck] = deck
  return { card, newDeck, newDiscard: discard }
}
