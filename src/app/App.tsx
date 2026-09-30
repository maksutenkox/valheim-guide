import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ApiError, api } from "./services/api";
import type { Biome, BossSummary, Category, CraftList, CraftListItem, CraftResourceTotal, CreatureDetail, CreatureSummary, FoodSummary, GuideItem, ItemDetail, Locale, ResourceDetail, TamingGuide } from "./types";
import { APP_BUILD } from "../shared/build";
import "./styles.css";

type Section = "home" | "search" | "craft" | "favorites" | "food-builder" | "taming" | "trophies" | "fishing" | "skills" | "builds" | "merchants" | "dungeons" | "meads" | "bosses" | "biome" | "item" | "resource" | "creature";
type NavSection = "home" | "library" | "search";
type BiomeView = "items" | "creatures" | "boss";

const text = (locale: Locale, object: { name_en: string; name_ru: string }) => locale === "ru" ? object.name_ru : object.name_en;
const categoryText = (locale: Locale, item: GuideItem) => locale === "ru" ? item.category_name_ru : item.category_name_en;
const categoryIcon = (slug?: string) => ({
  weapon: "⚔", armor: "♜", magic: "✦", tool: "⌁", food: "◆", consumable: "✚",
  trophy: "♛", material: "⬡", building: "⌂", other: "•"
}[slug ?? ""] ?? "•");

type FishingFish = { slug: string; name_en: string; name_ru: string };
type FishingBaitGuide = {
  slug: string; name_en: string; name_ru: string; recipe_en: string; recipe_ru: string;
  water_en: string; water_ru: string; fish: FishingFish[];
};
type SkillGuide = { slug: string; icon: string; name_en: string; name_ru: string; group: "combat" | "magic" | "movement" | "craft"; effect_en: string; effect_ru: string };
type BuildAsset = { slug: string; name_en: string; name_ru: string };
type BuildBiomeSlug = "meadows" | "black-forest" | "swamp" | "mountains" | "plains" | "mistlands" | "ashlands" | "deep-north" | "ocean";
type CharacterBuild = {
  id: string; biome: BuildBiomeSlug; icon: string; name_en: string; name_ru: string; tag_en: string; tag_ru: string;
  description_en: string; description_ru: string; weapons: BuildAsset[]; armor: BuildAsset[]; food: BuildAsset[];
};

type MerchantHighlight = { slug?: string; icon?: string; name_en: string; name_ru: string; price: string; unlock_en?: string; unlock_ru?: string };
type MerchantTier = { icon: string; title_en: string; title_ru: string; count: number; note_en: string; note_ru: string };
type MerchantGuide = {
  id: string; icon: string; name: string; biome_en: string; biome_ru: string; distance: string; stock_count: number;
  description_en: string; description_ru: string; highlights: MerchantHighlight[]; tiers: MerchantTier[];
};
type DungeonLoot = { slug: string; name_en: string; name_ru: string };
type DungeonGuide = {
  id: string; icon: string; biome: BuildBiomeSlug; name_en: string; name_ru: string; kind_en: string; kind_ru: string;
  access_en: string; access_ru: string; description_en: string; description_ru: string; enemies_en: string[]; enemies_ru: string[];
  loot: DungeonLoot[];
};
type MeadGroup = "recovery" | "resistance" | "utility" | "special";
type MeadGuide = {
  slug: string; icon_slug: string; group: MeadGroup; name_en: string; name_ru: string;
  effect_en: string; effect_ru: string; duration: string; cooldown_en: string; cooldown_ru: string; recipe_en: string; recipe_ru: string;
};

const fish = (slug: string, name_en: string, name_ru: string): FishingFish => ({ slug, name_en, name_ru });
const fishingGuides: FishingBaitGuide[] = [
  { slug:"fishing-bait", name_en:"Fishing Bait", name_ru:"Наживка", recipe_en:"Haldor · 10 coins for 20", recipe_ru:"Хальдор · 10 монет за 20", water_en:"Meadows · Black Forest", water_ru:"Луга · Чёрный лес", fish:[fish("perch","Perch","Окунь"),fish("pike","Pike","Щука")] },
  { slug:"mossy-fishing-bait", name_en:"Mossy Fishing Bait", name_ru:"Мшистая наживка", recipe_en:"20 Fishing Bait + Troll Trophy", recipe_ru:"20 наживки + трофей тролля", water_en:"Black Forest", water_ru:"Чёрный лес", fish:[fish("trollfish","Trollfish","Тролль-рыба")] },
  { slug:"sticky-fishing-bait", name_en:"Sticky Fishing Bait", name_ru:"Липкая наживка", recipe_en:"20 Fishing Bait + Abomination Trophy", recipe_ru:"20 наживки + трофей мерзости", water_en:"Swamp", water_ru:"Болота", fish:[fish("giant-herring","Giant Herring","Гигантская сельдь")] },
  { slug:"cold-fishing-bait", name_en:"Cold Fishing Bait", name_ru:"Холодная наживка", recipe_en:"20 Fishing Bait + Fenring Trophy", recipe_ru:"20 наживки + трофей фенринга", water_en:"Meadows / Black Forest waters · Frost Caves", water_ru:"Водоёмы Лугов / Чёрного леса · Морозные пещеры", fish:[fish("pike","Pike","Щука"),fish("tetra","Tetra","Тетра")] },
  { slug:"stingy-fishing-bait", name_en:"Stingy Fishing Bait", name_ru:"Колючая наживка", recipe_en:"20 Fishing Bait + Fuling Trophy", recipe_ru:"20 наживки + трофей фулинга", water_en:"Plains", water_ru:"Равнины", fish:[fish("grouper","Grouper","Групер")] },
  { slug:"heavy-fishing-bait", name_en:"Heavy Fishing Bait", name_ru:"Тяжёлая наживка", recipe_en:"20 Fishing Bait + Serpent Trophy", recipe_ru:"20 наживки + трофей морского змея", water_en:"Ocean", water_ru:"Океан", fish:[fish("tuna","Tuna","Тунец"),fish("coral-cod","Coral Cod","Коралловая треска")] },
  { slug:"misty-fishing-bait", name_en:"Misty Fishing Bait", name_ru:"Туманная наживка", recipe_en:"20 Fishing Bait + Lox Trophy", recipe_ru:"20 наживки + трофей локса", water_en:"Mistlands", water_ru:"Туманные земли", fish:[fish("pufferfish","Pufferfish","Иглобрюх"),fish("anglerfish","Anglerfish","Удильщик")] },
  { slug:"hot-fishing-bait", name_en:"Hot Fishing Bait", name_ru:"Горячая наживка", recipe_en:"20 Fishing Bait + Warrior Trophy", recipe_ru:"20 наживки + трофей обугленного воина", water_en:"Ashlands", water_ru:"Пепельные земли", fish:[fish("magmafish","Magmafish","Магмовая рыба")] },
  { slug:"frosty-fishing-bait", name_en:"Frosty Fishing Bait", name_ru:"Морозная наживка", recipe_en:"20 Fishing Bait + Drake Trophy", recipe_ru:"20 наживки + трофей дракона", water_en:"Deep North", water_ru:"Глубокий Север", fish:[fish("northern-salmon","Northern Salmon","Северный лосось")] }
];

const skillGuides: SkillGuide[] = [
  {slug:"axes",icon:"🪓",name_en:"Axes",name_ru:"Топоры",group:"combat",effect_en:"Increases axe damage.",effect_ru:"Повышает урон топорами."},
  {slug:"blocking",icon:"🛡",name_en:"Blocking",name_ru:"Блок",group:"combat",effect_en:"Increases damage absorbed while blocking.",effect_ru:"Повышает количество урона, поглощаемого блоком."},
  {slug:"blood-magic",icon:"♥",name_en:"Blood Magic",name_ru:"Магия крови",group:"magic",effect_en:"Improves blood-magic damage and reduces eitr and health costs.",effect_ru:"Усиливает магию крови и снижает расход эйтра и здоровья."},
  {slug:"bows",icon:"🏹",name_en:"Bows",name_ru:"Луки",group:"combat",effect_en:"Increases bow damage.",effect_ru:"Повышает урон из луков."},
  {slug:"clubs",icon:"⚒",name_en:"Clubs",name_ru:"Дубины",group:"combat",effect_en:"Increases club and mace damage.",effect_ru:"Повышает урон дубинами и булавами."},
  {slug:"cooking",icon:"♨",name_en:"Cooking",name_ru:"Готовка",group:"craft",effect_en:"Improves cooking speed, serving-tray wear and bonus-yield chance.",effect_ru:"Ускоряет готовку, снижает износ подноса и повышает шанс бонусного выхода."},
  {slug:"crafting",icon:"🔨",name_en:"Crafting",name_ru:"Крафт",group:"craft",effect_en:"Improves crafting speed, hammer wear and building stamina use.",effect_ru:"Ускоряет крафт, снижает износ молота и расход выносливости при строительстве."},
  {slug:"crossbows",icon:"➶",name_en:"Crossbows",name_ru:"Арбалеты",group:"combat",effect_en:"Improves crossbow accuracy and damage.",effect_ru:"Повышает точность и урон арбалетов."},
  {slug:"dodge",icon:"↯",name_en:"Dodge",name_ru:"Уклонение",group:"movement",effect_en:"Reduces stamina spent on dodging.",effect_ru:"Снижает расход выносливости при уклонении."},
  {slug:"elemental-magic",icon:"✦",name_en:"Elemental Magic",name_ru:"Стихийная магия",group:"magic",effect_en:"Increases elemental damage and reduces eitr use.",effect_ru:"Повышает стихийный урон и снижает расход эйтра."},
  {slug:"farming",icon:"🌱",name_en:"Farming",name_ru:"Земледелие",group:"craft",effect_en:"Reduces farming stamina and cultivator wear; improves harvest radius and bonus yields.",effect_ru:"Снижает расход выносливости и износ культиватора, увеличивает радиус сбора и шанс бонусного урожая."},
  {slug:"fishing",icon:"🎣",name_en:"Fishing",name_ru:"Рыбалка",group:"craft",effect_en:"Reduces stamina drain and increases pull speed while fishing.",effect_ru:"Снижает расход выносливости и ускоряет подтягивание рыбы."},
  {slug:"fists",icon:"✊",name_en:"Fists",name_ru:"Кулаки",group:"combat",effect_en:"Increases unarmed damage.",effect_ru:"Повышает урон без оружия."},
  {slug:"jump",icon:"↑",name_en:"Jump",name_ru:"Прыжок",group:"movement",effect_en:"Increases jump height.",effect_ru:"Увеличивает высоту прыжка."},
  {slug:"knives",icon:"†",name_en:"Knives",name_ru:"Ножи",group:"combat",effect_en:"Increases knife damage.",effect_ru:"Повышает урон ножами."},
  {slug:"pickaxes",icon:"⛏",name_en:"Pickaxes",name_ru:"Кирки",group:"craft",effect_en:"Increases pickaxe damage.",effect_ru:"Повышает урон кирками."},
  {slug:"polearms",icon:"⚔",name_en:"Polearms",name_ru:"Древковое оружие",group:"combat",effect_en:"Increases polearm damage.",effect_ru:"Повышает урон древковым оружием."},
  {slug:"riding",icon:"♞",name_en:"Riding",name_ru:"Верховая езда",group:"movement",effect_en:"Improves mount speed and stamina efficiency.",effect_ru:"Повышает скорость ездовых животных и эффективность их выносливости."},
  {slug:"run",icon:"➟",name_en:"Run",name_ru:"Бег",group:"movement",effect_en:"Increases running speed and reduces stamina drain.",effect_ru:"Повышает скорость бега и снижает расход выносливости."},
  {slug:"sneak",icon:"◌",name_en:"Sneak",name_ru:"Скрытность",group:"movement",effect_en:"Reduces stamina drain and improves stealth.",effect_ru:"Снижает расход выносливости и повышает скрытность."},
  {slug:"spears",icon:"↗",name_en:"Spears",name_ru:"Копья",group:"combat",effect_en:"Increases spear damage.",effect_ru:"Повышает урон копьями."},
  {slug:"swim",icon:"≈",name_en:"Swim",name_ru:"Плавание",group:"movement",effect_en:"Reduces stamina drain while swimming.",effect_ru:"Снижает расход выносливости при плавании."},
  {slug:"swords",icon:"⚔",name_en:"Swords",name_ru:"Мечи",group:"combat",effect_en:"Increases sword damage.",effect_ru:"Повышает урон мечами."},
  {slug:"wood-cutting",icon:"♧",name_en:"Wood Cutting",name_ru:"Рубка леса",group:"craft",effect_en:"Increases axe damage against trees.",effect_ru:"Повышает урон топором по деревьям."}
];

const asset = (slug: string, name_en: string, name_ru: string): BuildAsset => ({ slug, name_en, name_ru });
const buildBiomes: Array<{ slug: BuildBiomeSlug; icon: string; name_en: string; name_ru: string }> = [
  {slug:"meadows",icon:"🌿",name_en:"Meadows",name_ru:"Луга"},
  {slug:"black-forest",icon:"🌲",name_en:"Black Forest",name_ru:"Чёрный лес"},
  {slug:"swamp",icon:"☠",name_en:"Swamp",name_ru:"Болота"},
  {slug:"mountains",icon:"❄",name_en:"Mountains",name_ru:"Горы"},
  {slug:"plains",icon:"🌾",name_en:"Plains",name_ru:"Равнины"},
  {slug:"mistlands",icon:"◌",name_en:"Mistlands",name_ru:"Туманные земли"},
  {slug:"ashlands",icon:"🔥",name_en:"Ashlands",name_ru:"Пепельные земли"},
  {slug:"deep-north",icon:"ᛉ",name_en:"Deep North",name_ru:"Глубокий Север"},
  {slug:"ocean",icon:"🌊",name_en:"Ocean",name_ru:"Океан"}
];

const characterBuilds: CharacterBuild[] = [
  {
    id:"meadows-viking",biome:"meadows",icon:"🛡",name_en:"Viking Starter",name_ru:"Начинающий викинг",tag_en:"Balanced · first boss",tag_ru:"Баланс · первый босс",
    description_en:"Safe first-biome setup with a spear for reach, a shield for mistakes and three reliable cooked foods.",
    description_ru:"Надёжный стартовый комплект: копьё держит дистанцию, щит прощает ошибки, а три простые еды дают стабильные характеристики.",
    weapons:[asset("flint-spear","Flint Spear","Кремнёвое копьё"),asset("wood-shield","Wood Shield","Деревянный щит")],
    armor:[asset("leather-helmet","Leather Helmet","Кожаный шлем"),asset("leather-tunic","Leather Tunic","Кожаная туника"),asset("leather-pants","Leather Trousers","Кожаные штаны")],
    food:[asset("cooked-deer-meat","Cooked Deer Meat","Жареное мясо оленя"),asset("grilled-neck-tail","Grilled Neck Tail","Жареный хвост никса"),asset("cooked-boar-meat","Cooked Boar Meat","Жареное мясо кабана")]
  },
  {
    id:"meadows-hunter",biome:"meadows",icon:"🏹",name_en:"Meadows Hunter",name_ru:"Охотник Лугов",tag_en:"Ranged · mobile",tag_ru:"Дальний бой · мобильность",
    description_en:"Bow-first setup for deer, Eikthyr and safer exploration. The flint knife covers close-range fights.",
    description_ru:"Билд через лук для охоты, Эйктюра и безопасного исследования. Кремнёвый нож закрывает ближний бой.",
    weapons:[asset("crude-bow","Crude Bow","Простой лук"),asset("flint-knife","Flint Knife","Кремнёвый нож")],
    armor:[asset("leather-helmet","Leather Helmet","Кожаный шлем"),asset("leather-tunic","Leather Tunic","Кожаная туника"),asset("leather-pants","Leather Trousers","Кожаные штаны"),asset("deer-hide-cape","Deer Hide Cape","Плащ из шкуры оленя")],
    food:[asset("cooked-deer-meat","Cooked Deer Meat","Жареное мясо оленя"),asset("grilled-neck-tail","Grilled Neck Tail","Жареный хвост никса"),asset("cooked-boar-meat","Cooked Boar Meat","Жареное мясо кабана")]
  },
  {
    id:"forest-bronze-guard",biome:"black-forest",icon:"🛡",name_en:"Bronze Guard",name_ru:"Бронзовый страж",tag_en:"Melee · parry",tag_ru:"Ближний бой · парирование",
    description_en:"Classic bronze progression: mace and buckler for compact fights, backed by the full heavy set.",
    description_ru:"Классическая бронзовая прогрессия: булава с баклером для тесных боёв и полный тяжёлый комплект.",
    weapons:[asset("bronze-mace","Bronze Mace","Бронзовая булава"),asset("bronze-buckler","Bronze Buckler","Бронзовый баклер")],
    armor:[asset("bronze-helmet","Bronze Helmet","Бронзовый шлем"),asset("bronze-plate-cuirass","Bronze Plate Tunic","Бронзовая пластинчатая туника"),asset("bronze-plate-leggings","Bronze Plate Leggings","Бронзовые поножи")],
    food:[asset("deer-stew","Deer Stew","Оленина тушёная"),asset("minced-meat-sauce","Minced Meat Sauce","Мясной соус"),asset("carrot-soup","Carrot Soup","Морковный суп")]
  },
  {
    id:"forest-troll-scout",biome:"black-forest",icon:"↯",name_en:"Troll Scout",name_ru:"Тролль-разведчик",tag_en:"Light · stamina",tag_ru:"Лёгкий · выносливость",
    description_en:"Light armour keeps movement fast while the atgeir gives crowd control against greydwarfs and skeletons.",
    description_ru:"Лёгкая броня сохраняет скорость, а атгейр помогает контролировать группы грейдворфов и скелетов.",
    weapons:[asset("bronze-atgeir","Bronze Atgeir","Бронзовый атгейр"),asset("bronze-spear","Bronze Spear","Бронзовое копьё")],
    armor:[asset("troll-leather-helmet","Troll Leather Hood","Капюшон из кожи тролля"),asset("troll-leather-tunic","Troll Leather Tunic","Туника из кожи тролля"),asset("troll-leather-pants","Troll Leather Pants","Штаны из кожи тролля"),asset("troll-hide-cape","Troll Hide Cape","Плащ из шкуры тролля")],
    food:[asset("deer-stew","Deer Stew","Оленина тушёная"),asset("carrot-soup","Carrot Soup","Морковный суп"),asset("queens-jam-x4","Queen's Jam","Королевский джем")]
  },
  {
    id:"forest-bear-brawler",biome:"black-forest",icon:"🐻",name_en:"Bear Brawler",name_ru:"Медвежий боец",tag_en:"1.0 set · aggressive",tag_ru:"Комплект 1.0 · агрессия",
    description_en:"A close-range alternative built around the Black Forest bear set and Paws of the Bear.",
    description_ru:"Альтернатива для ближнего боя вокруг нового медвежьего комплекта Чёрного леса и Медвежьих лап.",
    weapons:[asset("paws-of-the-bear","Paws of the Bear","Медвежьи лапы")],
    armor:[asset("headdress-of-the-bear","Headdress of the Bear","Головной убор медведя"),asset("patterns-of-the-bear","Patterns of the Bear","Медвежьи узоры"),asset("loincloth-of-the-bear","Loincloth of the Bear","Набедренная повязка медведя")],
    food:[asset("pulled-bear","Pulled Bear","Томлёная медвежатина"),asset("carrot-soup","Carrot Soup","Морковный суп"),asset("boar-jerky-x2","Boar Jerky","Вяленое мясо кабана")]
  },
  {
    id:"swamp-bonemass",biome:"swamp",icon:"⚒",name_en:"Bonemass Breaker",name_ru:"Крушитель Массы Костей",tag_en:"Blunt · boss ready",tag_ru:"Дробящий · готов к боссу",
    description_en:"The community staple for the Swamp: iron mace, buckler and heavy armour. Strong against the biome's blunt-vulnerable threats.",
    description_ru:"Классический вариант для Болота: железная булава, баклер и тяжёлая броня. Особенно хорош против уязвимых к дробящему урону врагов.",
    weapons:[asset("iron-mace","Iron Mace","Железная булава"),asset("iron-buckler","Iron Buckler","Железный баклер")],
    armor:[asset("iron-helmet","Iron Helmet","Железный шлем"),asset("iron-scale-mail","Iron Scale Mail","Железная чешуйчатая броня"),asset("iron-greaves","Iron Greaves","Железные поножи")],
    food:[asset("sausages","Sausages","Сосиски"),asset("black-soup","Black Soup","Чёрный суп"),asset("turnip-stew","Turnip Stew","Рагу из репы")]
  },
  {
    id:"swamp-root-ranger",biome:"swamp",icon:"🏹",name_en:"Root Ranger",name_ru:"Корневой стрелок",tag_en:"Bow · light armour",tag_ru:"Лук · лёгкая броня",
    description_en:"Mobile ranged setup with the Root set and Huntsman Bow. Good for routine exploration and kiting dangerous targets.",
    description_ru:"Мобильный дальний билд с Корневым комплектом и Охотничьим луком. Удобен для исследования и кайта опасных целей.",
    weapons:[asset("huntsman-bow","Huntsman Bow","Охотничий лук"),asset("iron-buckler","Iron Buckler","Железный баклер")],
    armor:[asset("root-mask","Root Mask","Корневая маска"),asset("root-harnesk","Root Harnesk","Корневой харнеск"),asset("root-leggings","Root Leggings","Корневые поножи")],
    food:[asset("sausages","Sausages","Сосиски"),asset("turnip-stew","Turnip Stew","Рагу из репы"),asset("muckshake","Muckshake","Грязевой коктейль")]
  },
  {
    id:"swamp-crypt-crusher",biome:"swamp",icon:"💥",name_en:"Crypt Crusher",name_ru:"Крушитель склепов",tag_en:"AoE · dungeon",tag_ru:"AoE · подземелья",
    description_en:"Iron Sledge controls cramped crypt rooms and clustered enemies; sword covers ordinary single-target fights.",
    description_ru:"Железная кувалда контролирует тесные комнаты склепов и группы врагов, а меч удобен против одиночных целей.",
    weapons:[asset("iron-sledge","Iron Sledge","Железная кувалда"),asset("iron-sword","Iron Sword","Железный меч")],
    armor:[asset("iron-helmet","Iron Helmet","Железный шлем"),asset("iron-scale-mail","Iron Scale Mail","Железная чешуйчатая броня"),asset("iron-greaves","Iron Greaves","Железные поножи")],
    food:[asset("sausages","Sausages","Сосиски"),asset("black-soup","Black Soup","Чёрный суп"),asset("turnip-stew","Turnip Stew","Рагу из репы")]
  },
  {
    id:"mountain-frostner",biome:"mountains",icon:"❄",name_en:"Frostner Guard",name_ru:"Страж Морознера",tag_en:"Control · shield",tag_ru:"Контроль · щит",
    description_en:"A durable mountain setup with Frostner's slowing frost damage and a silver shield for reliable parries.",
    description_ru:"Живучий горный билд: мороз Морознера замедляет врагов, а серебряный щит даёт надёжное парирование.",
    weapons:[asset("frostner","Frostner","Морознер"),asset("silver-shield","Silver Shield","Серебряный щит")],
    armor:[asset("drake-helmet","Drake Helmet","Драконий шлем"),asset("wolf-hide-chestpiece","Wolf Hide Chestpiece","Нагрудник из волчьей шкуры"),asset("wolf-hide-trousers","Wolf Hide Trousers","Штаны из волчьей шкуры"),asset("wolf-fur-cape","Wolf Fur Cape","Плащ из волчьей шкуры")],
    food:[asset("wolf-skewer","Wolf Skewer","Волчий шашлык"),asset("onion-soup","Onion Soup","Луковый суп"),asset("eyescream","Eyescream","Глазомороженое")]
  },
  {
    id:"mountain-fenris",biome:"mountains",icon:"↯",name_en:"Fenris Runner",name_ru:"Бегун Фенриса",tag_en:"Speed · fists",tag_ru:"Скорость · кулаки",
    description_en:"High-mobility cave and mountain build. Flesh Rippers pair naturally with the lightweight Fenris set.",
    description_ru:"Очень мобильный билд для Гор и пещер. Разрыватели плоти естественно сочетаются с лёгким комплектом Фенриса.",
    weapons:[asset("flesh-rippers","Flesh Rippers","Разрыватели плоти"),asset("silver-knife","Silver Knife","Серебряный нож")],
    armor:[asset("fenris-hood","Fenris Hood","Капюшон Фенриса"),asset("fenris-coat","Fenris Coat","Куртка Фенриса"),asset("fenris-leggings","Fenris Leggings","Поножи Фенриса")],
    food:[asset("wolf-skewer","Wolf Skewer","Волчий шашлык"),asset("onion-soup","Onion Soup","Луковый суп"),asset("eyescream","Eyescream","Глазомороженое")]
  },
  {
    id:"mountain-ranger",biome:"mountains",icon:"🏹",name_en:"Draugr Ranger",name_ru:"Стрелок Драугра",tag_en:"Bow · safe range",tag_ru:"Лук · безопасная дистанция",
    description_en:"Draugr Fang handles drakes and distant threats while wolf armour keeps the build forgiving in close quarters.",
    description_ru:"Клык драугра отлично работает по драконам и дальним целям, а волчья броня прощает ошибки в ближнем бою.",
    weapons:[asset("draugr-fang","Draugr Fang","Клык драугра"),asset("silver-sword","Silver Sword","Серебряный меч")],
    armor:[asset("drake-helmet","Drake Helmet","Драконий шлем"),asset("wolf-hide-chestpiece","Wolf Hide Chestpiece","Нагрудник из волчьей шкуры"),asset("wolf-hide-trousers","Wolf Hide Trousers","Штаны из волчьей шкуры"),asset("wolf-fur-cape","Wolf Fur Cape","Плащ из волчьей шкуры")],
    food:[asset("wolf-skewer","Wolf Skewer","Волчий шашлык"),asset("onion-soup","Onion Soup","Луковый суп"),asset("eyescream","Eyescream","Глазомороженое")]
  },
  {
    id:"plains-blackmetal",biome:"plains",icon:"🛡",name_en:"Blackmetal Guard",name_ru:"Страж чёрного металла",tag_en:"Melee · durable",tag_ru:"Ближний бой · живучесть",
    description_en:"Straightforward Plains frontline with black-metal sword and shield plus the full padded set.",
    description_ru:"Надёжный фронтовой комплект Равнин: меч и щит из чёрного металла плюс полный стёганый сет.",
    weapons:[asset("black-metal-sword","Black Metal Sword","Меч из чёрного металла"),asset("black-metal-shield","Black Metal Shield","Щит из чёрного металла")],
    armor:[asset("padded-helmet","Padded Helmet","Стёганый шлем"),asset("padded-cuirass","Padded Cuirass","Стёганая кираса"),asset("padded-greaves","Padded Greaves","Стёганые поножи")],
    food:[asset("lox-meat-pie","Lox Meat Pie","Пирог с мясом локса"),asset("blood-pudding","Blood Pudding","Кровяная колбаса"),asset("bread","Bread","Хлеб")]
  },
  {
    id:"plains-atgeir",biome:"plains",icon:"↻",name_en:"Atgeir Raider",name_ru:"Рейдер с атгейром",tag_en:"AoE · stamina",tag_ru:"AoE · выносливость",
    description_en:"Uses the atgeir's reach and spin control against groups while keeping enough stamina for repositioning.",
    description_ru:"Атгейр даёт дальность и круговой контроль против групп, а рацион оставляет много выносливости для перемещения.",
    weapons:[asset("black-metal-atgeir","Black Metal Atgeir","Атгейр из чёрного металла"),asset("black-metal-knife","Black Metal Knife","Нож из чёрного металла")],
    armor:[asset("padded-helmet","Padded Helmet","Стёганый шлем"),asset("padded-cuirass","Padded Cuirass","Стёганая кираса"),asset("padded-greaves","Padded Greaves","Стёганые поножи")],
    food:[asset("lox-meat-pie","Lox Meat Pie","Пирог с мясом локса"),asset("bread","Bread","Хлеб"),asset("blood-pudding","Blood Pudding","Кровяная колбаса")]
  },
  {
    id:"plains-ranger",biome:"plains",icon:"🏹",name_en:"Plains Ranger",name_ru:"Стрелок Равнин",tag_en:"Bow · flexible",tag_ru:"Лук · универсальность",
    description_en:"Draugr Fang remains a strong ranged option in the Plains; padded armour makes deathsquito mistakes less punishing.",
    description_ru:"Клык драугра остаётся сильным дальним оружием в Равнинах, а стёганая броня делает ошибки против комаров менее болезненными.",
    weapons:[asset("draugr-fang","Draugr Fang","Клык драугра"),asset("black-metal-knife","Black Metal Knife","Нож из чёрного металла")],
    armor:[asset("padded-helmet","Padded Helmet","Стёганый шлем"),asset("padded-cuirass","Padded Cuirass","Стёганая кираса"),asset("padded-greaves","Padded Greaves","Стёганые поножи")],
    food:[asset("fish-wraps","Fish Wraps","Рыбные рулеты"),asset("bread","Bread","Хлеб"),asset("lox-meat-pie","Lox Meat Pie","Пирог с мясом локса")]
  },
  {
    id:"mistlands-melee",biome:"mistlands",icon:"⚔",name_en:"Mistwalker Frontline",name_ru:"Фронтовик с Туманником",tag_en:"Melee · parry",tag_ru:"Ближний бой · парирование",
    description_en:"Carapace armour and buckler make a forgiving frontline, while Mistwalker adds reliable control in the mist.",
    description_ru:"Панцирная броня и баклер дают надёжный фронт, а Туманный странник помогает контролировать противников в тумане.",
    weapons:[asset("mistwalker","Mistwalker","Туманный странник"),asset("carapace-buckler","Carapace Buckler","Панцирный баклер")],
    armor:[asset("carapace-helmet","Carapace Helmet","Панцирный шлем"),asset("carapace-breastplate","Carapace Breastplate","Панцирный нагрудник"),asset("carapace-greaves","Carapace Greaves","Панцирные поножи"),asset("feather-cape","Feather Cape","Перьевой плащ")],
    food:[asset("misthare-supreme","Misthare Supreme","Высший зайчатник"),asset("meat-platter","Meat Platter","Мясная тарелка"),asset("salad-x3","Salad","Салат")]
  },
  {
    id:"mistlands-mage",biome:"mistlands",icon:"✦",name_en:"Eitr Mage",name_ru:"Эйтровый маг",tag_en:"Magic · barrier",tag_ru:"Магия · барьер",
    description_en:"Two offensive staves plus Staff of Protection, full Eitr-weave and a two-eitr/one-stamina food split.",
    description_ru:"Два атакующих посоха плюс Посох защиты, полный эйтровый сет и рацион из двух эйтр-блюд и одного блюда на выносливость.",
    weapons:[asset("staff-of-embers","Staff of Embers","Посох углей"),asset("staff-of-frost","Staff of Frost","Посох мороза"),asset("staff-of-protection","Staff of Protection","Посох защиты")],
    armor:[asset("eitr-weave-hood","Eitr-weave Hood","Эйтровый капюшон"),asset("eitr-weave-robe","Eitr-weave Robe","Эйтровая мантия"),asset("eitr-weave-trousers","Eitr-weave Trousers","Эйтровые штаны"),asset("feather-cape","Feather Cape","Перьевой плащ")],
    food:[asset("seeker-aspic-x2","Seeker Aspic","Заливное из Искателя"),asset("yggdrasil-porridge","Yggdrasil Porridge","Каша Иггдрасиля"),asset("salad-x3","Salad","Салат")]
  },
  {
    id:"mistlands-ranged",biome:"mistlands",icon:"➶",name_en:"Seeker Hunter",name_ru:"Охотник на Искателей",tag_en:"Crossbow · bow",tag_ru:"Арбалет · лук",
    description_en:"A ranged toolkit for opening with Arbalest, following with Spinesnap and keeping a spear as a close fallback.",
    description_ru:"Дальний набор: открыть бой из Арбалета, продолжить Позвоночным луком и держать панцирное копьё как запасной вариант.",
    weapons:[asset("arbalest","Arbalest","Арбалет"),asset("spinesnap","Spinesnap","Позвоночный лук"),asset("carapace-spear","Carapace Spear","Панцирное копьё")],
    armor:[asset("carapace-helmet","Carapace Helmet","Панцирный шлем"),asset("carapace-breastplate","Carapace Breastplate","Панцирный нагрудник"),asset("carapace-greaves","Carapace Greaves","Панцирные поножи"),asset("feather-cape","Feather Cape","Перьевой плащ")],
    food:[asset("misthare-supreme","Misthare Supreme","Высший зайчатник"),asset("salad-x3","Salad","Салат"),asset("mushroom-omelette","Mushroom Omelette","Грибной омлет")]
  },
  {
    id:"ashlands-heavy",biome:"ashlands",icon:"🛡",name_en:"Flametal Vanguard",name_ru:"Фламеталловый авангард",tag_en:"Heavy · melee",tag_ru:"Тяжёлый · ближний бой",
    description_en:"High-survival Ashlands setup with a lightning Nidhögg variant, shield and full Flametal armour.",
    description_ru:"Живучий билд Пепельных земель: громовой Нидхёгг, щит и полный фламеталловый комплект.",
    weapons:[asset("nidhogg-thundering","Nidhögg the Thundering","Нидхёгг Громовой"),asset("flametal-shield","Flametal Shield","Фламеталловый щит")],
    armor:[asset("flametal-helmet","Flametal Helmet","Фламеталловый шлем"),asset("flametal-breastplate","Flametal Breastplate","Фламеталловый нагрудник"),asset("flametal-greaves","Flametal Greaves","Фламеталловые поножи"),asset("ashen-cape","Ashen Cape","Пепельный плащ")],
    food:[asset("fiery-svinstew","Fiery Svinstew","Огненное рагу из асксвина"),asset("roasted-crust-pie","Roasted Crust Pie","Хрустящий печёный пирог"),asset("salad-x3","Salad","Салат")]
  },
  {
    id:"ashlands-skirmisher",biome:"ashlands",icon:"🪓",name_en:"Ask Skirmisher",name_ru:"Скирмишёр Аска",tag_en:"Mobile · hybrid ranged",tag_ru:"Мобильный · гибридный дальний",
    description_en:"Fast Ask armour with dual axes and a bow gives strong mobility and several damage options in crowded fights.",
    description_ru:"Быстрый комплект Аска, парные топоры и лук дают мобильность и несколько вариантов урона в плотных боях.",
    weapons:[asset("thundering-berserkir-axes","Thundering Berserkir Axes","Громовые топоры берсерка"),asset("storm-fang","Storm Fang","Штормовой клык")],
    armor:[asset("hood-of-ask","Hood of Ask","Капюшон Аска"),asset("breastplate-of-ask","Breastplate of Ask","Нагрудник Аска"),asset("trousers-of-ask","Trousers of Ask","Штаны Аска"),asset("asksvin-cloak","Asksvin Cloak","Плащ асксвина")],
    food:[asset("fiery-svinstew","Fiery Svinstew","Огненное рагу из асксвина"),asset("roasted-crust-pie","Roasted Crust Pie","Хрустящий печёный пирог"),asset("salad-x3","Salad","Салат")]
  },
  {
    id:"ashlands-mage",biome:"ashlands",icon:"✦",name_en:"Embla Mage",name_ru:"Маг Эмблы",tag_en:"Magic · summons",tag_ru:"Магия · призывы",
    description_en:"Full caster setup built around Ashlands staves, Embla armour and enough eitr to keep pressure from range.",
    description_ru:"Полный магический билд вокруг посохов Пепельных земель, брони Эмблы и большого запаса эйтра.",
    weapons:[asset("staff-of-fracturing","Staff of Fracturing","Посох раскола"),asset("dundr","Dundr","Дундр"),asset("staff-of-the-wild","Staff of the Wild","Посох дикой природы")],
    armor:[asset("hood-of-embla","Hood of Embla","Капюшон Эмблы"),asset("robes-of-embla","Robes of Embla","Одеяния Эмблы"),asset("trousers-of-embla","Trousers of Embla","Штаны Эмблы"),asset("ashen-cape","Ashen Cape","Пепельный плащ")],
    food:[asset("seeker-aspic-x2","Seeker Aspic","Заливное из Искателя"),asset("yggdrasil-porridge","Yggdrasil Porridge","Каша Иггдрасиля"),asset("fiery-svinstew","Fiery Svinstew","Огненное рагу из асксвина")]
  },
  {
    id:"north-protector",biome:"deep-north",icon:"🛡",name_en:"Protector",name_ru:"Защитник",tag_en:"Tank · safe frontline",tag_ru:"Танк · безопасный фронт",
    description_en:"Maximum survivability for dangerous Deep North fights. Shield play, heavy armour and two health foods.",
    description_ru:"Максимальная живучесть для тяжёлых боёв Глубокого Севера. Щит, тяжёлая броня и две еды на здоровье.",
    weapons:[asset("nord-sword","Nord Sword","Меч Nord"),asset("nord-shield","Nord Shield","Щит Nord")],
    armor:[asset("helmet-of-the-protector","Helmet of the Protector","Шлем Защитника"),asset("breastplate-of-the-protector","Breastplate of the Protector","Нагрудник Защитника"),asset("trousers-of-the-protector","Trousers of the Protector","Штаны Защитника")],
    food:[asset("meat-in-bread","Meat In Bread","Мясо в хлебе"),asset("seal-meat-soup","Seal Meat Soup","Суп из тюленя"),asset("pancakes","Pancakes","Блины")]
  },
  {
    id:"north-berserker",biome:"deep-north",icon:"🪓",name_en:"Frostfire Berserker",name_ru:"Берсерк морозного огня",tag_en:"Melee DPS · two-handed",tag_ru:"Ближний DPS · двуручное",
    description_en:"Aggressive two-handed setup with Vanguard armour and a stamina-heavy food split.",
    description_ru:"Агрессивный двуручный билд в броне Авангарда с упором рациона на выносливость.",
    weapons:[asset("frostfire-greataxe","Frostfire Greataxe","Секира морозного огня"),asset("nord-buckler","Nord Buckler","Баклер Nord")],
    armor:[asset("hood-of-the-vanguard","Hood of the Vanguard","Капюшон Авангарда"),asset("chestpiece-of-the-vanguard","Chestpiece of the Vanguard","Нагрудник Авангарда"),asset("trousers-of-the-vanguard","Trousers of the Vanguard","Штаны Авангарда")],
    food:[asset("meat-in-bread","Meat In Bread","Мясо в хлебе"),asset("pancakes","Pancakes","Блины"),asset("oat-milk","Oat Milk","Овсяное молоко")]
  },
  {
    id:"north-hunter",biome:"deep-north",icon:"🏹",name_en:"Thunderblood Hunter",name_ru:"Охотник грозовой крови",tag_en:"Ranged · stamina",tag_ru:"Дальний бой · выносливость",
    description_en:"Mobile bow build for keeping distance and sustaining long draw-and-dodge chains.",
    description_ru:"Мобильный билд лучника: держим дистанцию и поддерживаем длинные серии натяжения лука и уклонений.",
    weapons:[asset("thunderblood-bow","Thunderblood Bow","Лук грозовой крови"),asset("nord-dagger","Nord Dagger","Кинжал Nord")],
    armor:[asset("hood-of-the-vanguard","Hood of the Vanguard","Капюшон Авангарда"),asset("chestpiece-of-the-vanguard","Chestpiece of the Vanguard","Нагрудник Авангарда"),asset("trousers-of-the-vanguard","Trousers of the Vanguard","Штаны Авангарда")],
    food:[asset("meat-in-bread","Meat In Bread","Мясо в хлебе"),asset("pancakes","Pancakes","Блины"),asset("oat-milk","Oat Milk","Овсяное молоко")]
  },
  {
    id:"north-caller",biome:"deep-north",icon:"✦",name_en:"Caller Mage",name_ru:"Маг Призывателя",tag_en:"Magic · high eitr",tag_ru:"Магия · высокий эйтр",
    description_en:"Full caster setup with two high-eitr foods, Caller armour and both direct-damage and summon tools.",
    description_ru:"Полный магический билд: две сильные еды на эйтр, комплект Призывателя, прямой урон и призыв.",
    weapons:[asset("lightning-strike","Lightning Strike","Удар молнии"),asset("spirit-caller","Spirit Caller","Призыватель духов"),asset("echo-spike","Echo Spike","Эхо-шип")],
    armor:[asset("headdress-of-the-caller","Headdress of the Caller","Головной убор Призывателя"),asset("robes-of-the-caller","Robes of the Caller","Одеяния Призывателя"),asset("trousers-of-the-caller","Trousers of the Caller","Штаны Призывателя"),asset("cape-of-the-caller","Cape of the Caller","Плащ Призывателя")],
    food:[asset("fish-soup","Fish Soup","Рыбный суп"),asset("meatballs-and-poteitr","Meatballs and Poteitr","Фрикадельки с Потейтером"),asset("meat-in-bread","Meat In Bread","Мясо в хлебе")]
  },
  {
    id:"north-hybrid",biome:"deep-north",icon:"◈",name_en:"Storm Battlemage",name_ru:"Грозовой боевой маг",tag_en:"Hybrid · melee + magic",tag_ru:"Гибрид · ближний бой + магия",
    description_en:"A flexible setup with a melee fallback, lightning magic and Oatmeal bridging stamina and eitr.",
    description_ru:"Гибкий билд с надёжным ближним боем, магией молний и овсянкой, которая одновременно поддерживает выносливость и эйтр.",
    weapons:[asset("nord-sword","Nord Sword","Меч Nord"),asset("nord-buckler","Nord Buckler","Баклер Nord"),asset("lightning-strike","Lightning Strike","Удар молнии")],
    armor:[asset("hood-of-the-vanguard","Hood of the Vanguard","Капюшон Авангарда"),asset("chestpiece-of-the-vanguard","Chestpiece of the Vanguard","Нагрудник Авангарда"),asset("trousers-of-the-vanguard","Trousers of the Vanguard","Штаны Авангарда")],
    food:[asset("meat-in-bread","Meat In Bread","Мясо в хлебе"),asset("oatmeal","Oatmeal","Овсянка"),asset("fish-soup","Fish Soup","Рыбный суп")]
  },
  {
    id:"ocean-serpent",biome:"ocean",icon:"🌊",name_en:"Serpent Hunter",name_ru:"Охотник на змеев",tag_en:"Sea hunt · control",tag_ru:"Морская охота · контроль",
    description_en:"Harpoon controls the serpent near shore, Draugr Fang provides ranged pressure and the scale shield is a durable backup.",
    description_ru:"Гарпун помогает контролировать морского змея у берега, Клык драугра наносит урон с дистанции, а чешуйчатый щит страхует вблизи.",
    weapons:[asset("abyssal-harpoon","Abyssal Harpoon","Гарпун бездны"),asset("draugr-fang","Draugr Fang","Клык драугра"),asset("serpent-scale-shield","Serpent Scale Shield","Щит из змеиной чешуи")],
    armor:[asset("padded-helmet","Padded Helmet","Стёганый шлем"),asset("padded-cuirass","Padded Cuirass","Стёганая кираса"),asset("padded-greaves","Padded Greaves","Стёганые поножи")],
    food:[asset("serpent-stew","Serpent Stew","Рагу из змея"),asset("bread","Bread","Хлеб"),asset("blood-pudding","Blood Pudding","Кровяная колбаса")]
  },
  {
    id:"ocean-fast",biome:"ocean",icon:"⛵",name_en:"Fast Sailor",name_ru:"Быстрый моряк",tag_en:"Light · recovery",tag_ru:"Лёгкий · спасение",
    description_en:"A lighter setup for boarding, recovering floating loot and moving quickly around coastal fights.",
    description_ru:"Более лёгкий комплект для высадки, подбора плавающего лута и быстрого перемещения в прибрежных боях.",
    weapons:[asset("abyssal-harpoon","Abyssal Harpoon","Гарпун бездны"),asset("silver-sword","Silver Sword","Серебряный меч")],
    armor:[asset("fenris-hood","Fenris Hood","Капюшон Фенриса"),asset("fenris-coat","Fenris Coat","Куртка Фенриса"),asset("fenris-leggings","Fenris Leggings","Поножи Фенриса")],
    food:[asset("serpent-stew","Serpent Stew","Рагу из змея"),asset("onion-soup","Onion Soup","Луковый суп"),asset("eyescream","Eyescream","Глазомороженое")]
  }
];


const merchantGuides: MerchantGuide[] = [
  {
    id:"haldor",icon:"🧙",name:"Haldor",biome_en:"Black Forest",biome_ru:"Чёрный лес",distance:"~1.9 km",stock_count:11,
    description_en:"The classic dvergr trader. His shop carries unique utility gear, fishing supplies and two permanent inventory-row upgrades added in 1.0.",
    description_ru:"Классический двегр-торговец. У него продаются уникальные полезные вещи, снасти для рыбалки и два постоянных улучшения инвентаря из 1.0.",
    highlights:[
      {slug:"yule-hat",name_en:"Yule Hat",name_ru:"Йольская шапка",price:"100"},
      {slug:"dverger-circlet",name_en:"Dverger Circlet",name_ru:"Обруч двегров",price:"620"},
      {slug:"megingjord",name_en:"Megingjord",name_ru:"Мегингъёрд",price:"950"},
      {slug:"ymir-flesh",name_en:"Ymir Flesh",name_ru:"Плоть Имира",price:"120",unlock_en:"The Elder defeated",unlock_ru:"Побеждён Древний"},
      {slug:"fishing-rod",name_en:"Fishing Rod",name_ru:"Удочка",price:"350"},
      {slug:"fishing-bait",name_en:"Fishing Bait ×20",name_ru:"Наживка ×20",price:"10"},
      {slug:"thunder-stone",name_en:"Thunder Stone",name_ru:"Громовой камень",price:"50",unlock_en:"The Elder defeated",unlock_ru:"Побеждён Древний"},
      {slug:"egg",name_en:"Egg",name_ru:"Яйцо",price:"1500",unlock_en:"Yagluth defeated",unlock_ru:"Побеждён Яглут"},
      {slug:"barrel-hoops",name_en:"Barrel Hoops ×3",name_ru:"Обручи для бочки ×3",price:"100"},
      {icon:"▤",name_en:"Wider Pockets",name_ru:"Широкие карманы",price:"1000",unlock_en:"+1 inventory row · Moder defeated",unlock_ru:"+1 ряд инвентаря · побеждена Моудер"},
      {icon:"▥",name_en:"Deeper Pockets",name_ru:"Глубокие карманы",price:"2000",unlock_en:"+1 inventory row · The Queen defeated",unlock_ru:"+1 ряд инвентаря · побеждена Королева"}
    ],
    tiers:[
      {icon:"⌖",title_en:"Where to look",title_ru:"Где искать",count:1,note_en:"Black Forest, beyond roughly 1,500 m from the world centre.",note_ru:"Чёрный лес, обычно дальше примерно 1500 м от центра мира."},
      {icon:"🎒",title_en:"1.0 upgrade",title_ru:"Новое в 1.0",count:2,note_en:"Wider and Deeper Pockets permanently add one inventory row each.",note_ru:"Широкие и Глубокие карманы навсегда добавляют по одному ряду инвентаря."}
    ]
  },
  {
    id:"hildir",icon:"🧵",name:"Hildir",biome_en:"Meadows",biome_ru:"Луга",distance:"~3.1 km",stock_count:38,
    description_en:"A cosmetic-focused trader whose stock expands when you return her three stolen chests from special dungeons.",
    description_ru:"Торговка с упором на одежду и косметику. Ассортимент расширяется, когда вы возвращаете три украденных сундука из особых подземелий.",
    highlights:[
      {icon:"◇",name_en:"Base stock",name_ru:"Базовый ассортимент",price:"8 items",unlock_en:"Available immediately",unlock_ru:"Доступен сразу"},
      {icon:"♨",name_en:"Brass tier",name_ru:"Латунный уровень",price:"11 items",unlock_en:"Smouldering Tomb · Brenna",unlock_ru:"Тлеющая гробница · Бренна"},
      {icon:"❄",name_en:"Silver tier",name_ru:"Серебряный уровень",price:"9 items",unlock_en:"Howling Cavern · Geirrhafa",unlock_ru:"Воющая пещера · Гейрхафа"},
      {icon:"♜",name_en:"Bronze tier",name_ru:"Бронзовый уровень",price:"10 items",unlock_en:"Sealed Tower · Zil & Thungr",unlock_ru:"Запечатанная башня · Зил и Тунгр"}
    ],
    tiers:[
      {icon:"♨",title_en:"Brass Chest",title_ru:"Латунный сундук",count:11,note_en:"Return Brenna's chest from a Smouldering Tomb in the Black Forest.",note_ru:"Верните сундук Бренны из Тлеющей гробницы в Чёрном лесу."},
      {icon:"❄",title_en:"Silver Chest",title_ru:"Серебряный сундук",count:9,note_en:"Return Geirrhafa's chest from a Howling Cavern in the Mountains.",note_ru:"Верните сундук Гейрхафы из Воющей пещеры в Горах."},
      {icon:"♜",title_en:"Bronze Chest",title_ru:"Бронзовый сундук",count:10,note_en:"Return Zil & Thungr's chest from a Sealed Tower in the Plains.",note_ru:"Верните сундук Зила и Тунгра из Запечатанной башни на Равнинах."}
    ]
  },
  {
    id:"bog-witch",icon:"🧪",name:"The Bog Witch",biome_en:"Swamp",biome_ru:"Болота",distance:"~3.2 km",stock_count:20,
    description_en:"The Swamp trader for brewing and feasts. Her ingredients unlock with world progression, and 1.0 extends that chain all the way through Kall.",
    description_ru:"Болотная торговка для зелий и пиров. Ингредиенты открываются по мере прогресса мира, а в 1.0 цепочка продолжается вплоть до Калла.",
    highlights:[
      {slug:"love-potion",name_en:"Love Potion ×5",name_ru:"Любовное зелье ×5",price:"110"},
      {slug:"scythe-handle",name_en:"Scythe Handle",name_ru:"Рукоять косы",price:"200",unlock_en:"Moder defeated",unlock_ru:"Побеждена Моудер"},
      {slug:"serving-tray",name_en:"Serving Tray",name_ru:"Поднос",price:"140"},
      {icon:"✿",name_en:"Fragrant Bundle ×5",name_ru:"Ароматный набор ×5",price:"140",unlock_en:"Moder defeated",unlock_ru:"Побеждена Моудер"},
      {slug:"corked-vial",name_en:"Corked Vial ×5",name_ru:"Флакон с пробкой ×5",price:"150",unlock_en:"The Elder defeated",unlock_ru:"Побеждён Древний"},
      {slug:"crown-of-roots",name_en:"Crown of Roots",name_ru:"Корона корней",price:"3000",unlock_en:"Writhan killed",unlock_ru:"Убит Врайтан"}
    ],
    tiers:[
      {icon:"🌲",title_en:"Early progression",title_ru:"Ранний прогресс",count:2,note_en:"Woodland Herb Blend and Corked Vials unlock after The Elder.",note_ru:"Лесная смесь трав и флаконы открываются после Древнего."},
      {icon:"⚓",title_en:"Sea & Mountains",title_ru:"Море и Горы",count:4,note_en:"Serpent and Moder progression unlock more feast and potion ingredients.",note_ru:"Убийство морского змея и Моудер открывает новые ингредиенты для пиров и зелий."},
      {icon:"🔥",title_en:"Late game",title_ru:"Поздняя игра",count:4,note_en:"Yagluth, The Queen, Fader and Kall each unlock later spice tiers.",note_ru:"Яглут, Королева, Фейдер и Калл последовательно открывают поздние специи."}
    ]
  }
];

const dungeonGuides: DungeonGuide[] = [
  {id:"burial-chamber",icon:"☠",biome:"black-forest",name_en:"Burial Chamber",name_ru:"Погребальная камера",kind_en:"Dungeon",kind_ru:"Подземелье",access_en:"No key required.",access_ru:"Ключ не требуется.",description_en:"The first procedural dungeon tier. Clear skeleton rooms for Surtling Cores and valuables.",description_ru:"Первый полноценный процедурный данж. Зачищайте комнаты со скелетами ради ядер суртлингов и ценностей.",enemies_en:["Skeleton","Rancid Remains","Ghost"],enemies_ru:["Скелет","Гнилые останки","Призрак"],loot:[{slug:"surtling-core",name_en:"Surtling Core",name_ru:"Ядро суртлинга"},{slug:"bone-fragments",name_en:"Bone Fragments",name_ru:"Обломки костей"}]},
  {id:"troll-cave",icon:"👣",biome:"black-forest",name_en:"Troll Cave",name_ru:"Пещера тролля",kind_en:"Dungeon",kind_ru:"Подземелье",access_en:"Open cave; usually a troll inside.",access_ru:"Открытая пещера; обычно внутри тролль.",description_en:"A compact cave used as a reliable troll hunting spot and early source of coins and Troll Hide.",description_ru:"Компактная пещера для охоты на троллей и раннего получения монет и шкуры тролля.",enemies_en:["Troll"],enemies_ru:["Тролль"],loot:[{slug:"troll-hide",name_en:"Troll Hide",name_ru:"Шкура тролля"},{slug:"troll-trophy",name_en:"Troll Trophy",name_ru:"Трофей тролля"}]},
  {id:"bear-cave",icon:"🐻",biome:"black-forest",name_en:"Bear Cave",name_ru:"Медвежья пещера",kind_en:"1.0 dungeon",kind_ru:"Подземелье 1.0",access_en:"Open cave in the Black Forest.",access_ru:"Открытая пещера в Чёрном лесу.",description_en:"A 1.0 Black Forest cave with a sleeping bear and useful beehive loot in the back.",description_ru:"Новая пещера Чёрного леса из 1.0 со спящим медведем и полезным лутом из ульев.",enemies_en:["Bear"],enemies_ru:["Медведь"],loot:[{slug:"bear-trophy",name_en:"Bear Trophy",name_ru:"Трофей медведя"},{slug:"honey",name_en:"Honey",name_ru:"Мёд"},{slug:"queen-bee",name_en:"Queen Bee",name_ru:"Пчелиная матка"}]},
  {id:"smouldering-tomb",icon:"♨",biome:"black-forest",name_en:"Smouldering Tomb",name_ru:"Тлеющая гробница",kind_en:"Hildir dungeon",kind_ru:"Задание Хильдир",access_en:"Use Hildir's map table to reveal the marked variants.",access_ru:"Карта у Хильдир отмечает специальные варианты на карте мира.",description_en:"A tougher Burial Chamber variant ending with Brenna. Her chest unlocks Hildir's Brass stock tier.",description_ru:"Усиленный вариант Погребальной камеры с Бренной в финале. Её сундук открывает латунный ассортимент Хильдир.",enemies_en:["Skeleton","Ghost","Brenna"],enemies_ru:["Скелет","Призрак","Бренна"],loot:[{slug:"brenna-trophy",name_en:"Brenna Trophy",name_ru:"Трофей Бренны"}]},
  {id:"sunken-crypt",icon:"⚿",biome:"swamp",name_en:"Sunken Crypt",name_ru:"Затонувший склеп",kind_en:"Dungeon",kind_ru:"Подземелье",access_en:"Requires the Swamp Key dropped by The Elder.",access_ru:"Нужен Болотный ключ, выпадающий с Древнего.",description_en:"The main iron dungeon of the Swamp. Muddy Scrap Piles block corridors and are the core source of Scrap Iron.",description_ru:"Главный железный данж Болот. Грязные кучи металлолома перекрывают коридоры и являются основным источником железного лома.",enemies_en:["Draugr","Draugr Elite","Blob","Oozer"],enemies_ru:["Драугр","Элитный драугр","Слизень","Гнилец"],loot:[{slug:"scrap-iron",name_en:"Scrap Iron",name_ru:"Железный лом"},{slug:"chain",name_en:"Chain",name_ru:"Цепь"}]},
  {id:"frost-cave",icon:"❄",biome:"mountains",name_en:"Frost Cave",name_ru:"Морозная пещера",kind_en:"Dungeon",kind_ru:"Подземелье",access_en:"Mountain cave; bring frost protection for the trip.",access_ru:"Пещера в Горах; для пути нужна защита от мороза.",description_en:"Large cave network with Cultists, Ulvs and bats. The key source of Fenris materials, red jute and crystal.",description_ru:"Большая сеть пещер с культистами, ульвами и летучими мышами. Главный источник материалов Фенриса, красного джута и кристаллов.",enemies_en:["Cultist","Ulv","Bat","Stone Golem"],enemies_ru:["Культист","Ульв","Летучая мышь","Каменный голем"],loot:[{slug:"fenris-hair",name_en:"Fenris Hair",name_ru:"Шерсть Фенриса"},{slug:"fenris-claw",name_en:"Fenris Claw",name_ru:"Коготь Фенриса"},{slug:"crystal",name_en:"Crystal",name_ru:"Кристалл"}]},
  {id:"howling-cavern",icon:"🐺",biome:"mountains",name_en:"Howling Cavern",name_ru:"Воющая пещера",kind_en:"Hildir dungeon",kind_ru:"Задание Хильдир",access_en:"Revealed from Hildir's map table.",access_ru:"Отмечается через карту у Хильдир.",description_en:"A special Mountain cave ending with Geirrhafa. Returning his chest unlocks Hildir's Silver stock tier.",description_ru:"Особая горная пещера с Гейрхафой в финале. Возврат его сундука открывает серебряный ассортимент Хильдир.",enemies_en:["Bat","Ulv","Geirrhafa"],enemies_ru:["Летучая мышь","Ульв","Гейрхафа"],loot:[{slug:"geirrhafa-trophy",name_en:"Geirrhafa Trophy",name_ru:"Трофей Гейрхафы"}]},
  {id:"sealed-tower",icon:"♜",biome:"plains",name_en:"Sealed Tower",name_ru:"Запечатанная башня",kind_en:"Hildir structure",kind_ru:"Задание Хильдир",access_en:"Surface dungeon; Hildir's map table reveals its locations.",access_ru:"Наземный данж; его точки отмечает карта у Хильдир.",description_en:"A vertical Plains fortress with Fulings and the miniboss pair Zil & Thungr. Their chest unlocks Hildir's Bronze tier.",description_ru:"Вертикальная крепость Равнин с фулингами и парой мини-боссов Зил и Тунгр. Их сундук открывает бронзовый уровень Хильдир.",enemies_en:["Fuling","Fuling Shaman","Zil & Thungr"],enemies_ru:["Фулинг","Шаман фулингов","Зил и Тунгр"],loot:[{slug:"zil-trophy",name_en:"Zil Trophy",name_ru:"Трофей Зила"},{slug:"thungr-trophy",name_en:"Thungr Trophy",name_ru:"Трофей Тунгра"}]},
  {id:"infested-mine",icon:"◌",biome:"mistlands",name_en:"Infested Mine",name_ru:"Заражённая шахта",kind_en:"Dungeon",kind_ru:"Подземелье",access_en:"Found through Mistlands mine entrances and ruined dvergr structures.",access_ru:"Ищите входы в шахты и разрушенные строения двегров в Туманных землях.",description_en:"The key Mistlands dungeon: Seekers and Ticks guard Black Cores, Royal Jelly and Queen progression.",description_ru:"Ключевой данж Туманных земель: Искатели и Клещи охраняют Чёрные ядра, королевское желе и прогресс к Королеве.",enemies_en:["Seeker","Seeker Soldier","Tick"],enemies_ru:["Искатель","Солдат-искатель","Клещ"],loot:[{slug:"black-core",name_en:"Black Core",name_ru:"Чёрное ядро"},{slug:"royal-jelly",name_en:"Royal Jelly",name_ru:"Королевское желе"}]},
  {id:"charred-fortress",icon:"🔥",biome:"ashlands",name_en:"Charred Fortress",name_ru:"Крепость Обугленных",kind_en:"Surface fortress",kind_ru:"Наземная крепость",access_en:"Green beam marks it from afar; breach the fortress with siege tools.",access_ru:"Зелёный луч виден издалека; стены и ворота пробиваются осадными средствами.",description_en:"The main Ashlands fortress objective with Charred defenders, Flametal loot, gemstones and Bell Fragments.",description_ru:"Главная крепость Пепельных земель с Обугленными, фламеталлом, самоцветами и фрагментами колокола.",enemies_en:["Charred Warrior","Charred Marksman","Charred Warlock"],enemies_ru:["Обугленный воин","Обугленный стрелок","Обугленный чародей"],loot:[{slug:"flametal-ore",name_en:"Flametal Ore",name_ru:"Фламеталловая руда"},{slug:"bell-fragment",name_en:"Bell Fragment",name_ru:"Фрагмент колокола"}]},
  {id:"winding-tunnels",icon:"↝",biome:"deep-north",name_en:"Winding Tunnels",name_ru:"Извилистые туннели",kind_en:"1.0 dungeon",kind_ru:"Подземелье 1.0",access_en:"No map marker; explore the Deep North on foot.",access_ru:"Не отмечаются на карте — входы нужно искать по Глубокому Северу.",description_en:"A long 32–48 room gallery dungeon. The major source of Nord moulds and Frost Cores.",description_ru:"Длинный галерейный данж на 32–48 комнат. Один из главных источников форм для Nord-экипировки и Морозных ядер.",enemies_en:["Eyeless One","Shadow","Elaking"],enemies_ru:["Безглазый","Тень","Элакинг"],loot:[{slug:"frostcore",name_en:"Frost Core",name_ru:"Морозное ядро"},{slug:"mould-nord-sword",name_en:"Nord weapon moulds",name_ru:"Формы оружия Nord"},{slug:"timberwood",name_en:"Timberwood",name_ru:"Северная древесина"}]},
  {id:"morkhalla",icon:"ᛉ",biome:"deep-north",name_en:"Mörkhalla",name_ru:"Мёркхалла",kind_en:"1.0 fortress dungeon",kind_ru:"Крепость-подземелье 1.0",access_en:"Door consumes an Intricate Key.",access_ru:"Дверь расходует Замысловатый ключ.",description_en:"A compact Deep North fortress dungeon packed with Krigen and Hexen. Ancient chests hold gemstones, coins and moulds; breaking the black ice advances the Jotun chain.",description_ru:"Компактная северная крепость с Кригенами и Хексенами. В древних сундуках лежат самоцветы, монеты и формы; разрушение чёрного льда двигает цепочку йотунов.",enemies_en:["Krigen","Hexen","Shapeless Pulp","Imprisoned Dvergr"],enemies_ru:["Криген","Хексен","Бесформенная мякоть","Пленный двегр"],loot:[{slug:"ancient-coin",name_en:"Ancient Coin",name_ru:"Древняя монета"},{slug:"draumyx",name_en:"Draumyx",name_ru:"Драумикс"},{slug:"mould-nord-sword",name_en:"Nord moulds",name_ru:"Формы Nord"}]}
];

const meadGuides: MeadGuide[] = [
  {slug:"minor-healing-mead",icon_slug:"minor-healing-mead-x6",group:"recovery",name_en:"Minor Healing Mead",name_ru:"Малая лечебная медовуха",effect_en:"Restores 50 health",effect_ru:"Восстанавливает 50 здоровья",duration:"2 min",cooldown_en:"Shared health cooldown",cooldown_ru:"Общий откат лечения",recipe_en:"Honey ×10 · Blueberries ×5 · Raspberries ×10 · Dandelion ×1",recipe_ru:"Мёд ×10 · Черника ×5 · Малина ×10 · Одуванчик ×1"},
  {slug:"medium-healing-mead",icon_slug:"medium-healing-mead",group:"recovery",name_en:"Medium Healing Mead",name_ru:"Средняя лечебная медовуха",effect_en:"Restores 75 health",effect_ru:"Восстанавливает 75 здоровья",duration:"2 min",cooldown_en:"Shared health cooldown",cooldown_ru:"Общий откат лечения",recipe_en:"Honey ×10 · Bloodbag ×4 · Raspberries ×10 · Dandelion ×1",recipe_ru:"Мёд ×10 · Кровяной мешок ×4 · Малина ×10 · Одуванчик ×1"},
  {slug:"major-healing-mead",icon_slug:"major-healing-mead-x6",group:"recovery",name_en:"Major Healing Mead",name_ru:"Большая лечебная медовуха",effect_en:"Restores 125 health",effect_ru:"Восстанавливает 125 здоровья",duration:"2 min",cooldown_en:"Shared health cooldown",cooldown_ru:"Общий откат лечения",recipe_en:"Honey ×10 · Blood Clot ×4 · Royal Jelly ×5",recipe_ru:"Мёд ×10 · Сгусток крови ×4 · Королевское желе ×5"},
  {slug:"minor-stamina-mead",icon_slug:"minor-stamina-mead-x6",group:"recovery",name_en:"Minor Stamina Mead",name_ru:"Малая медовуха выносливости",effect_en:"Restores 80 stamina",effect_ru:"Восстанавливает 80 выносливости",duration:"2 min",cooldown_en:"Shared stamina cooldown",cooldown_ru:"Общий откат выносливости",recipe_en:"Honey ×10 · Raspberries ×10 · Yellow Mushroom ×10",recipe_ru:"Мёд ×10 · Малина ×10 · Жёлтый гриб ×10"},
  {slug:"medium-stamina-mead",icon_slug:"medium-stamina-mead",group:"recovery",name_en:"Medium Stamina Mead",name_ru:"Средняя медовуха выносливости",effect_en:"Restores 160 stamina",effect_ru:"Восстанавливает 160 выносливости",duration:"2 min",cooldown_en:"Shared stamina cooldown",cooldown_ru:"Общий откат выносливости",recipe_en:"Honey ×10 · Cloudberries ×10 · Yellow Mushroom ×10",recipe_ru:"Мёд ×10 · Морошка ×10 · Жёлтый гриб ×10"},
  {slug:"minor-eitr-mead",icon_slug:"minor-eitr-mead-x6",group:"recovery",name_en:"Minor Eitr Mead",name_ru:"Малая медовуха эйтра",effect_en:"Restores 125 eitr",effect_ru:"Восстанавливает 125 эйтра",duration:"2 min",cooldown_en:"Shared eitr cooldown",cooldown_ru:"Общий откат эйтра",recipe_en:"Honey ×10 · Sap ×5 · Jotun Puffs ×2 · Magecap ×5",recipe_ru:"Мёд ×10 · Сок ×5 · Йотунские шарики ×2 · Магический колпак ×5"},
  {slug:"lingering-healing-mead",icon_slug:"lingering-healing-mead",group:"recovery",name_en:"Lingering Healing Mead",name_ru:"Длительная лечебная медовуха",effect_en:"+25% health regeneration",effect_ru:"+25% регенерации здоровья",duration:"5 min",cooldown_en:"Shared health cooldown",cooldown_ru:"Общий откат лечения",recipe_en:"Sap ×10 · Vineberry Cluster ×10 · Smoke Puff ×10",recipe_ru:"Сок ×10 · Гроздь винной ягоды ×10 · Дымчатый гриб ×10"},
  {slug:"lingering-stamina-mead",icon_slug:"lingering-stamina-mead-x6",group:"recovery",name_en:"Lingering Stamina Mead",name_ru:"Длительная медовуха выносливости",effect_en:"+25% stamina regeneration",effect_ru:"+25% регенерации выносливости",duration:"5 min",cooldown_en:"Shared stamina cooldown",cooldown_ru:"Общий откат выносливости",recipe_en:"Sap ×10 · Cloudberries ×10 · Jotun Puffs ×10",recipe_ru:"Сок ×10 · Морошка ×10 · Йотунские шарики ×10"},
  {slug:"lingering-eitr-mead",icon_slug:"lingering-eitr-mead",group:"recovery",name_en:"Lingering Eitr Mead",name_ru:"Длительная медовуха эйтра",effect_en:"+25% eitr regeneration",effect_ru:"+25% регенерации эйтра",duration:"5 min",cooldown_en:"Shared eitr cooldown",cooldown_ru:"Общий откат эйтра",recipe_en:"Sap ×10 · Vineberry Cluster ×10 · Magecap ×10",recipe_ru:"Сок ×10 · Гроздь винной ягоды ×10 · Магический колпак ×10"},
  {slug:"poison-resistance-mead",icon_slug:"poison-resistance-mead-x6",group:"resistance",name_en:"Poison Resistance Mead",name_ru:"Медовуха сопротивления яду",effect_en:"Poison resistance",effect_ru:"Сопротивление яду",duration:"10 min",cooldown_en:"No cooldown",cooldown_ru:"Без отката",recipe_en:"Honey ×10 · Thistle ×5 · Neck Tail ×1 · Coal ×10",recipe_ru:"Мёд ×10 · Чертополох ×5 · Хвост никса ×1 · Уголь ×10"},
  {slug:"frost-resistance-mead",icon_slug:"frost-resistance-mead",group:"resistance",name_en:"Frost Resistance Mead",name_ru:"Медовуха сопротивления морозу",effect_en:"Frost resistance",effect_ru:"Сопротивление морозу",duration:"10 min",cooldown_en:"No cooldown",cooldown_ru:"Без отката",recipe_en:"Honey ×10 · Thistle ×5 · Bloodbag ×2 · Greydwarf Eye ×1",recipe_ru:"Мёд ×10 · Чертополох ×5 · Кровяной мешок ×2 · Глаз грейдворфа ×1"},
  {slug:"fire-resistance-barley-wine",icon_slug:"fire-resistance-barley-wine-x6",group:"resistance",name_en:"Fire Resistance Barley Wine",name_ru:"Ячменное вино сопротивления огню",effect_en:"Fire resistance",effect_ru:"Сопротивление огню",duration:"10 min",cooldown_en:"No cooldown",cooldown_ru:"Без отката",recipe_en:"Barley ×10 · Cloudberries ×10",recipe_ru:"Ячмень ×10 · Морошка ×10"},
  {slug:"tasty-mead",icon_slug:"tasty-mead-x6",group:"utility",name_en:"Tasty Mead",name_ru:"Вкусная медовуха",effect_en:"+100% stamina regen · -50% health regen",effect_ru:"+100% регенерации выносливости · -50% регенерации здоровья",duration:"10s",cooldown_en:"No cooldown",cooldown_ru:"Без отката",recipe_en:"Honey ×10 · Raspberries ×10 · Blueberries ×5",recipe_ru:"Мёд ×10 · Малина ×10 · Черника ×5"},
  {slug:"anti-sting-concoction",icon_slug:"anti-sting-concoction",group:"utility",name_en:"Anti-Sting Concoction",name_ru:"Противокомариный отвар",effect_en:"Deathsquitos break off before stinging",effect_ru:"Комары смерти отступают, не нанося укус",duration:"10 min",cooldown_en:"No cooldown",cooldown_ru:"Без отката",recipe_en:"Cloudberries ×10 · Grouper ×3 · Fragrant Bundle ×1",recipe_ru:"Морошка ×10 · Групер ×3 · Ароматный набор ×1"},
  {slug:"brew-of-animal-whispers",icon_slug:"brew-of-animal-whispers",group:"utility",name_en:"Brew of Animal Whispers",name_ru:"Настой шёпота животных",effect_en:"Nearby creatures tame twice as fast",effect_ru:"Животные поблизости приручаются вдвое быстрее",duration:"10 min",cooldown_en:"No cooldown",cooldown_ru:"Без отката",recipe_en:"Onion ×5 · Carrot ×10 · Pungent Pebbles ×1",recipe_ru:"Лук ×5 · Морковь ×10 · Резкие камешки ×1"},
  {slug:"draught-of-vananidir",icon_slug:"draught-of-vananidir",group:"utility",name_en:"Draught of Vananidir",name_ru:"Настой Вананидира",effect_en:"-50% swimming stamina cost",effect_ru:"-50% расхода выносливости при плавании",duration:"5 min",cooldown_en:"No cooldown",cooldown_ru:"Без отката",recipe_en:"Dandelion ×10 · Perch ×2 · Fresh Seaweed ×1",recipe_ru:"Одуванчик ×10 · Окунь ×2 · Свежие водоросли ×1"},
  {slug:"lightfoot-mead",icon_slug:"lightfoot-mead",group:"utility",name_en:"Lightfoot Mead",name_ru:"Медовуха лёгких ног",effect_en:"-30% jump stamina cost · +20% jump height",effect_ru:"-30% выносливости на прыжок · +20% высоты прыжка",duration:"10 min",cooldown_en:"No cooldown",cooldown_ru:"Без отката",recipe_en:"Scale Hide ×2 · Feathers ×5 · Magecap ×5",recipe_ru:"Чешуйчатая шкура ×2 · Перья ×5 · Магический колпак ×5"},
  {slug:"mead-of-troll-endurance",icon_slug:"mead-of-troll-endurance",group:"utility",name_en:"Mead of Troll Endurance",name_ru:"Медовуха тролльей выносливости",effect_en:"+250 carry weight",effect_ru:"+250 к переносимому весу",duration:"5 min",cooldown_en:"2 min",cooldown_ru:"2 мин",recipe_en:"Trollfish ×2 · Honey ×10 · Powdered Dragon Eggshells ×1",recipe_ru:"Тролль-рыба ×2 · Мёд ×10 · Порошок скорлупы драконьего яйца ×1"},
  {slug:"tonic-of-ratatosk",icon_slug:"tonic-of-ratatosk",group:"utility",name_en:"Tonic of Ratatosk",name_ru:"Тоник Рататоска",effect_en:"+15% run/walk speed · +7.5% swim speed",effect_ru:"+15% скорости бега/ходьбы · +7,5% скорости плавания",duration:"10 min",cooldown_en:"No cooldown",cooldown_ru:"Без отката",recipe_en:"Honey ×10 · Blueberries ×10 · Cured Squirrel Hamstring ×1",recipe_ru:"Мёд ×10 · Черника ×10 · Вяленое сухожилие белки ×1"},
  {slug:"berserkir-mead",icon_slug:"berserkir-mead",group:"special",name_en:"Berserkir Mead",name_ru:"Медовуха берсерка",effect_en:"-80% attack/block/dodge stamina cost, but 1.5× physical damage taken",effect_ru:"-80% затрат выносливости на атаку/блок/уклонение, но ×1,5 физического урона по вам",duration:"20s",cooldown_en:"2 min",cooldown_ru:"2 мин",recipe_en:"Mushroom ×10 · Yellow Mushroom ×10 · Toadstool ×1",recipe_ru:"Гриб ×10 · Жёлтый гриб ×10 · Поганка ×1"},
  {slug:"love-potion",icon_slug:"love-potion",group:"special",name_en:"Love Potion",name_ru:"Любовное зелье",effect_en:"Draws trolls toward the drinker",effect_ru:"Привлекает троллей к выпившему",duration:"5 min",cooldown_en:"No cooldown",cooldown_ru:"Без отката",recipe_en:"Bought from the Bog Witch · 110 coins for 5",recipe_ru:"Покупается у Болотной ведьмы · 110 монет за 5"}
];

const meadGroups: Array<{ id:"all" | MeadGroup; icon:string; en:string; ru:string }> = [
  {id:"all",icon:"◈",en:"All",ru:"Все"},
  {id:"recovery",icon:"✚",en:"Recovery",ru:"Восстановление"},
  {id:"resistance",icon:"🛡",en:"Resistance",ru:"Сопротивления"},
  {id:"utility",icon:"↯",en:"Utility",ru:"Полезные"},
  {id:"special",icon:"✦",en:"Special",ru:"Особые"}
];

const protectedErrorText = (locale: Locale, error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      if (error.message === "Telegram authorization required") {
        return locale === "ru"
          ? "Telegram не передал данные авторизации. Закройте Mini App полностью и откройте заново через кнопку бота."
          : "Telegram did not pass authorization data. Fully close the Mini App and reopen it from the bot button.";
      }
      if (error.message === "Telegram bot token is not configured") {
        return locale === "ru"
          ? "Cloudflare не видит TELEGRAM_BOT_TOKEN. Нужно добавить токен этого бота в Worker Secrets."
          : "Cloudflare cannot see TELEGRAM_BOT_TOKEN. Add this bot token to Worker Secrets.";
      }
      if (error.message === "Telegram authorization signature is invalid") {
        return locale === "ru"
          ? "Telegram-авторизация получена, но сервер не смог подтвердить подпись. Проверьте токен бота в Cloudflare."
          : "Telegram authorization was received, but the server could not validate its signature. Check the bot token in Cloudflare.";
      }
      return `${locale === "ru" ? "Ошибка Telegram-авторизации" : "Telegram authorization error"}: ${error.message}`;
    }
    return `${locale === "ru" ? "Ошибка сервера" : "Server error"} ${error.status}: ${error.message}`;
  }
  return locale === "ru" ? "Не удалось выполнить действие." : "Could not complete the action.";
};

const statLabel = (locale: Locale, key: string) => ({
  damage: locale === "ru" ? "Урон" : "Damage",
  slash_damage: locale === "ru" ? "Рубящий урон" : "Slash damage",
  blunt_damage: locale === "ru" ? "Дробящий урон" : "Blunt damage",
  pierce_damage: locale === "ru" ? "Колющий урон" : "Pierce damage",
  fire_damage: locale === "ru" ? "Огненный урон" : "Fire damage",
  frost_damage: locale === "ru" ? "Морозный урон" : "Frost damage",
  spirit_damage: locale === "ru" ? "Духовный урон" : "Spirit damage",
  poison_damage: locale === "ru" ? "Ядовитый урон" : "Poison damage",
  chop: locale === "ru" ? "Рубка" : "Chop",
  pickaxe: locale === "ru" ? "Урон киркой" : "Pickaxe damage",
  durability: locale === "ru" ? "Прочность" : "Durability",
  stamina_use: locale === "ru" ? "Затраты выносливости" : "Stamina use",
  armor: locale === "ru" ? "Броня" : "Armor",
  block_armor: locale === "ru" ? "Блок" : "Block armor",
  parry_bonus: locale === "ru" ? "Бонус парирования" : "Parry bonus",
  health: locale === "ru" ? "Здоровье" : "Health",
  stamina: locale === "ru" ? "Выносливость" : "Stamina",
  duration: locale === "ru" ? "Длительность" : "Duration",
  healing: locale === "ru" ? "Регенерация" : "Healing",
  health_regen_bonus: locale === "ru" ? "Регенерация здоровья" : "Health regeneration",
  stamina_regen_bonus: locale === "ru" ? "Регенерация выносливости" : "Stamina regeneration",
  adrenaline: locale === "ru" ? "Порог адреналина" : "Adrenaline threshold"
}[key] ?? key.replaceAll("_", " "));

export function App() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [section, setSection] = useState<Section>("home");
  const [biomes, setBiomes] = useState<Biome[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentBiome, setCurrentBiome] = useState<(Biome & { categories: Category[] }) | null>(null);
  const [biomeItems, setBiomeItems] = useState<GuideItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [biomeView, setBiomeView] = useState<BiomeView>("items");
  const [creatures, setCreatures] = useState<CreatureSummary[]>([]);
  const [biomeBoss, setBiomeBoss] = useState<BossSummary | null>(null);
  const [bosses, setBosses] = useState<BossSummary[]>([]);
  const [bossesLoading, setBossesLoading] = useState(false);
  const [foods, setFoods] = useState<FoodSummary[]>([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [selectedFoodSlugs, setSelectedFoodSlugs] = useState<string[]>([]);
  const [foodBiome, setFoodBiome] = useState("all");
  const [foodQuery, setFoodQuery] = useState("");
  const [tamingGuides, setTamingGuides] = useState<TamingGuide[]>([]);
  const [tamingLoading, setTamingLoading] = useState(false);
  const [expandedTaming, setExpandedTaming] = useState<string | null>(null);
  const [trophies, setTrophies] = useState<GuideItem[]>([]);
  const [trophiesLoading, setTrophiesLoading] = useState(false);
  const [trophyBiome, setTrophyBiome] = useState("all");
  const [collectedTrophies, setCollectedTrophies] = useState<string[]>(() => {
    try {
      const stored = window.localStorage.getItem("valheim-guide-collected-trophies-v1");
      return stored ? JSON.parse(stored) as string[] : [];
    } catch {
      return [];
    }
  });
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [buildBiome, setBuildBiome] = useState<BuildBiomeSlug>("meadows");
  const [dungeonBiome, setDungeonBiome] = useState<"all" | BuildBiomeSlug>("all");
  const [meadGroup, setMeadGroup] = useState<"all" | MeadGroup>("all");
  const [toolOrigin, setToolOrigin] = useState<Section>("home");
  const [libraryTab, setLibraryTab] = useState<"craft" | "favorites">("craft");
  const [creature, setCreature] = useState<CreatureDetail | null>(null);
  const [creatureOrigin, setCreatureOrigin] = useState<Exclude<Section, "creature">>("biome");
  const [creaturesLoading, setCreaturesLoading] = useState(false);
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [favorites, setFavorites] = useState<GuideItem[]>([]);
  const [craftLists, setCraftLists] = useState<CraftList[]>([]);
  const [activeCraftList, setActiveCraftList] = useState<CraftList | null>(null);
  const [craftItems, setCraftItems] = useState<CraftListItem[]>([]);
  const [craftTotals, setCraftTotals] = useState<CraftResourceTotal[]>([]);
  const [craftListBusy, setCraftListBusy] = useState(false);
  const [detailOrigin, setDetailOrigin] = useState<Exclude<Section, "item" | "resource">>("home");
  const craftListActionLock = useRef(false);

  useEffect(() => {
    if (!moreMenuOpen) return;
    const body = document.body;
    const root = document.documentElement;
    const scrollY = window.scrollY;
    const previous = {
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      rootOverflow: root.style.overflow,
      rootOverscroll: root.style.overscrollBehavior
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    return () => {
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.left = previous.bodyLeft;
      body.style.right = previous.bodyRight;
      body.style.width = previous.bodyWidth;
      body.style.overflow = previous.bodyOverflow;
      root.style.overflow = previous.rootOverflow;
      root.style.overscrollBehavior = previous.rootOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, [moreMenuOpen]);

  useEffect(() => {
    window.Telegram?.WebApp?.ready?.();
    window.Telegram?.WebApp?.expand?.();
    api.biomes().then(({ data }) => setBiomes(data)).catch(() => setMessage(locale === "ru" ? "Не удалось загрузить биомы." : "Could not load biomes.")).finally(() => setLoading(false));
    api.favorites().then(({ data }) => setFavorites(data)).catch(() => undefined);
  }, []);

  useEffect(() => {
    let reloading = false;
    const checkBuild = async () => {
      if (reloading || document.visibilityState === "hidden") return;
      try {
        const response = await fetch(`/api/version?client=${encodeURIComponent(APP_BUILD)}&t=${Date.now()}`, {
          cache: "no-store"
        });
        if (!response.ok) return;
        const payload = await response.json() as { build?: string };
        if (!payload.build || payload.build === APP_BUILD) return;

        reloading = true;
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("v", payload.build);
        window.location.replace(nextUrl.toString());
      } catch {
        // Version checks are best-effort and must never block the guide.
      }
    };

    void checkBuild();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void checkBuild();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query.trim().length < 2) return setResults([]);
      api.search(query).then(({ data }) => setResults(data)).catch(() => setResults([]));
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3800);
    return () => window.clearTimeout(timer);
  }, [message]);

  const title = useMemo(() => ({
    home: "VALHEIM Guide", search: locale === "ru" ? "Поиск" : "Search", craft: locale === "ru" ? "Крафт" : "Craft",
    favorites: locale === "ru" ? "Избранное" : "Favorites", "food-builder": locale === "ru" ? "Конструктор еды" : "Food Builder", taming: locale === "ru" ? "Приручение" : "Taming", trophies: locale === "ru" ? "Трофеи" : "Trophies", fishing: locale === "ru" ? "Рыбалка" : "Fishing", skills: locale === "ru" ? "Навыки" : "Skills", builds: locale === "ru" ? "Билды" : "Builds", merchants: locale === "ru" ? "Торговцы" : "Traders", dungeons: locale === "ru" ? "Подземелья" : "Dungeons", meads: locale === "ru" ? "Зелья" : "Meads", bosses: locale === "ru" ? "Боссы" : "Bosses", biome: text(locale, currentBiome ?? { name_en: "Biome", name_ru: "Биом" }),
    item: item ? text(locale, item) : locale === "ru" ? "Предмет" : "Item",
    resource: resource ? text(locale, resource) : locale === "ru" ? "Ресурс" : "Resource",
    creature: creature ? text(locale, creature) : locale === "ru" ? "Существо" : "Creature"
  })[section], [creature, currentBiome, item, locale, resource, section]);

  const selectedFoods = useMemo(
    () => selectedFoodSlugs.map((slug) => foods.find((food) => food.slug === slug)).filter((food): food is FoodSummary => Boolean(food)),
    [foods, selectedFoodSlugs]
  );
  const foodTotals = useMemo(() => selectedFoods.reduce((total, food) => ({
    health: total.health + food.health,
    stamina: total.stamina + food.stamina,
    eitr: total.eitr + food.eitr
  }), { health: 0, stamina: 0, eitr: 0 }), [selectedFoods]);
  const foodBiomes = useMemo(() => [...new Map(foods.filter((food) => food.biome_slug).map((food) => [
    food.biome_slug!,
    { slug: food.biome_slug!, name_en: food.biome_name_en ?? food.biome_slug!, name_ru: food.biome_name_ru ?? food.biome_slug! }
  ])).values()], [foods]);
  const visibleFoods = useMemo(() => {
    const wanted = foodQuery.trim().toLocaleLowerCase();
    return foods.filter((food) => {
      const biomeMatches = foodBiome === "all" || food.biome_slug === foodBiome;
      const queryMatches = !wanted || food.name_en.toLocaleLowerCase().includes(wanted) || food.name_ru.toLocaleLowerCase().includes(wanted);
      return biomeMatches && queryMatches;
    });
  }, [foodBiome, foodQuery, foods]);

  const trophyBiomes = useMemo(() => [...new Map(trophies.filter((entry) => entry.biome_slug).map((entry) => [
    entry.biome_slug!,
    { slug: entry.biome_slug!, name_en: entry.biome_name_en ?? entry.biome_slug!, name_ru: entry.biome_name_ru ?? entry.biome_slug! }
  ])).values()], [trophies]);
  const visibleTrophies = useMemo(
    () => trophies.filter((entry) => trophyBiome === "all" || entry.biome_slug === trophyBiome),
    [trophies, trophyBiome]
  );
  const collectedCount = trophies.reduce((count, entry) => count + (collectedTrophies.includes(entry.slug) ? 1 : 0), 0);
  const selectedBuildBiome = buildBiomes.find((biome) => biome.slug === buildBiome) ?? buildBiomes[0];
  const visibleCharacterBuilds = characterBuilds.filter((build) => build.biome === buildBiome);
  const dungeonBiomes = buildBiomes.filter((biome) => dungeonGuides.some((dungeon) => dungeon.biome === biome.slug));
  const visibleDungeons = dungeonGuides.filter((dungeon) => dungeonBiome === "all" || dungeon.biome === dungeonBiome);
  const visibleMeads = meadGuides.filter((mead) => meadGroup === "all" || mead.group === meadGroup);

  const openBiome = async (slug: string) => {
    setMessage(""); setSection("biome"); setCurrentBiome(null); setBiomeItems([]); setActiveCategory(undefined);
    setBiomeView("items"); setCreatures([]); setBiomeBoss(null); setCreature(null);
    try {
      const [{ data: biome }, { data: items }] = await Promise.all([api.biome(slug), api.items(slug)]);
      setCurrentBiome(biome); setBiomeItems(items);
    } catch { setMessage(locale === "ru" ? "Не удалось открыть биом." : "Could not open biome."); }
  };

  const selectBiomeView = async (view: BiomeView) => {
    if (!currentBiome || biomeView === view) return;
    setBiomeView(view);
    setMessage("");
    if (view === "items") return;
    setCreaturesLoading(true);
    try {
      if (view === "creatures" && creatures.length === 0) {
        setCreatures((await api.creatures(currentBiome.slug)).data);
      }
      if (view === "boss" && biomeBoss === null) {
        setBiomeBoss((await api.boss(currentBiome.slug)).data);
      }
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить боевой справочник." : "Could not load combat guide.");
    } finally {
      setCreaturesLoading(false);
    }
  };

  const openBosses = async () => {
    setMessage("");
    setSection("bosses");
    if (bosses.length > 0) return;
    setBossesLoading(true);
    try {
      setBosses((await api.bosses()).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить список боссов." : "Could not load bosses.");
    } finally {
      setBossesLoading(false);
    }
  };

  const openFoodBuilder = async () => {
    setMessage("");
    setToolOrigin(section === "food-builder" || section === "taming" ? "home" : section);
    setMoreMenuOpen(false);
    setSection("food-builder");
    if (foods.length > 0) return;
    setFoodsLoading(true);
    try {
      setFoods((await api.foods()).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить еду." : "Could not load food data.");
    } finally {
      setFoodsLoading(false);
    }
  };

  const openTaming = async () => {
    setMessage("");
    setToolOrigin(section === "food-builder" || section === "taming" ? "home" : section);
    setMoreMenuOpen(false);
    setSection("taming");
    if (tamingGuides.length > 0) return;
    setTamingLoading(true);
    try {
      setTamingGuides((await api.taming()).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить справочник приручения." : "Could not load taming guide.");
    } finally {
      setTamingLoading(false);
    }
  };

  const openTrophies = async () => {
    setMessage("");
    setToolOrigin(section === "food-builder" || section === "taming" || section === "trophies" ? "home" : section);
    setMoreMenuOpen(false);
    setSection("trophies");
    if (trophies.length > 0) return;
    setTrophiesLoading(true);
    try {
      setTrophies((await api.trophies()).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить список трофеев." : "Could not load trophies.");
    } finally {
      setTrophiesLoading(false);
    }
  };

  const toggleTrophy = (slug: string) => {
    setCollectedTrophies((current) => {
      const next = current.includes(slug) ? current.filter((entry) => entry !== slug) : [...current, slug];
      try { window.localStorage.setItem("valheim-guide-collected-trophies-v1", JSON.stringify(next)); } catch { /* best effort */ }
      return next;
    });
  };

  const openGuideSection = (next: "fishing" | "skills" | "builds" | "merchants" | "dungeons" | "meads") => {
    const moreSections: Section[] = ["food-builder", "taming", "trophies", "fishing", "skills", "builds", "merchants", "dungeons", "meads"];
    setToolOrigin(moreSections.includes(section) ? "home" : section);
    setMoreMenuOpen(false);
    setSection(next);
  };

  const toggleFood = (food: FoodSummary) => {
    setSelectedFoodSlugs((current) => {
      if (current.includes(food.slug)) return current.filter((slug) => slug !== food.slug);
      if (current.length >= 3) {
        setMessage(locale === "ru" ? "В Valheim одновременно можно съесть максимум 3 разных блюда." : "Valheim allows up to 3 different active foods.");
        return current;
      }
      return [...current, food.slug];
    });
  };

  const openCreature = async (slug: string, origin: Exclude<Section, "creature"> = "biome") => {
    setMessage("");
    setCreatureOrigin(origin);
    setSection("creature");
    setCreature(null);
    try {
      setCreature((await api.creature(slug)).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить существо." : "Could not load creature.");
    }
  };

  const filterBiome = async (category?: string) => {
    if (!currentBiome) return;
    setActiveCategory(category);
    try { setBiomeItems((await api.items(currentBiome.slug, category)).data); } catch { setMessage(locale === "ru" ? "Не удалось загрузить предметы." : "Could not load items."); }
  };

  const openEntry = async (entry: GuideItem) => {
    setMessage("");
    if (section !== "item" && section !== "resource") setDetailOrigin(section);
    try {
      if (entry.entity_type === "resource") {
        setSection("resource"); setResource((await api.resource(entry.slug)).data);
      } else {
        setSection("item"); setItem((await api.item(entry.slug)).data);
      }
    } catch { setMessage(locale === "ru" ? "Не удалось загрузить карточку." : "Could not load this entry."); }
  };

  const openItem = async (slug: string) => {
    setMessage("");
    if (section !== "item" && section !== "resource") setDetailOrigin(section);
    setSection("item");
    try { setItem((await api.item(slug)).data); } catch { setMessage(locale === "ru" ? "Не удалось загрузить предмет." : "Could not load item."); }
  };

  const openResource = async (slug: string) => {
    setMessage("");
    if (section !== "item" && section !== "resource") setDetailOrigin(section);
    try {
      const itemResponse = await api.item(slug);
      setSection("item");
      setItem(itemResponse.data);
      return;
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 404) {
        setMessage(locale === "ru" ? "Не удалось загрузить компонент." : "Could not load component.");
        return;
      }
    }

    setSection("resource");
    try {
      setResource((await api.resource(slug)).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить ресурс." : "Could not load resource.");
    }
  };

  const loadCraftList = async (list: CraftList) => {
    setActiveCraftList(list);
    const [items, totals] = await Promise.all([api.craftItems(list.id), api.craftSummary(list.id)]);
    setCraftItems(items.data);
    setCraftTotals(totals.data);
  };

  const openLibraryTab = async (next: "craft" | "favorites") => {
    setMessage("");
    setLibraryTab(next);
    setSection(next);
    if (next === "favorites") {
      try { setFavorites((await api.favorites()).data); }
      catch (error) { setMessage(protectedErrorText(locale, error)); }
      return;
    }
    try {
      const { data } = await api.craftLists();
      setCraftLists(data);
      const selected = activeCraftList && data.find((list) => list.id === activeCraftList.id)
        ? data.find((list) => list.id === activeCraftList.id)!
        : data[0] ?? null;
      if (selected) {
        await loadCraftList(selected);
      } else {
        setActiveCraftList(null);
        setCraftItems([]);
        setCraftTotals([]);
      }
    } catch (error) { setMessage(protectedErrorText(locale, error)); }
  };

  const goNav = async (next: NavSection) => {
    setMessage("");
    if (next === "library") {
      await openLibraryTab(libraryTab);
      return;
    }
    setSection(next);
  };

  const nextCraftListName = (): string => {
    if (!craftLists.length) return locale === "ru" ? "Мой крафт" : "My craft";
    const prefix = locale === "ru" ? "Список" : "List";
    const used = new Set(craftLists.map((list) => list.name));
    let index = 2;
    while (used.has(`${prefix} ${index}`)) index += 1;
    return `${prefix} ${index}`;
  };

  const createCraftList = async () => {
    if (craftListActionLock.current) return;
    if (activeCraftList && craftItems.length === 0) {
      setMessage(locale === "ru" ? "Текущий список уже пуст — можно использовать его." : "The current list is already empty — you can use it.");
      return;
    }
    craftListActionLock.current = true;
    setCraftListBusy(true);
    try {
      const { data } = await api.createCraftList(nextCraftListName());
      setCraftLists((lists) => [data, ...lists]);
      setActiveCraftList(data);
      setCraftItems([]);
      setCraftTotals([]);
      setMessage(locale === "ru" ? "Новый список создан." : "New list created.");
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    } finally {
      craftListActionLock.current = false;
      setCraftListBusy(false);
    }
  };

  const renameCraftList = async () => {
    if (!activeCraftList || craftListActionLock.current) return;
    const nextName = window.prompt(locale === "ru" ? "Название списка" : "List name", activeCraftList.name)?.trim();
    if (!nextName || nextName === activeCraftList.name) return;
    craftListActionLock.current = true;
    setCraftListBusy(true);
    try {
      const { data } = await api.renameCraftList(activeCraftList.id, nextName);
      setActiveCraftList(data);
      setCraftLists((lists) => lists.map((list) => list.id === data.id ? data : list));
      setMessage(locale === "ru" ? "Список переименован." : "List renamed.");
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    } finally {
      craftListActionLock.current = false;
      setCraftListBusy(false);
    }
  };

  const deleteCraftList = async () => {
    if (!activeCraftList || craftListActionLock.current) return;
    const confirmed = window.confirm(locale === "ru"
      ? `Удалить список «${activeCraftList.name}»? Предметы и отмеченные ресурсы в нём будут удалены.`
      : `Delete “${activeCraftList.name}”? Its items and resource progress will be removed.`);
    if (!confirmed) return;
    craftListActionLock.current = true;
    setCraftListBusy(true);
    try {
      await api.deleteCraftList(activeCraftList.id);
      const remaining = craftLists.filter((list) => list.id !== activeCraftList.id);
      setCraftLists(remaining);
      const next = remaining[0] ?? null;
      if (next) {
        await loadCraftList(next);
      } else {
        setActiveCraftList(null);
        setCraftItems([]);
        setCraftTotals([]);
      }
      setMessage(locale === "ru" ? "Список удалён." : "List deleted.");
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    } finally {
      craftListActionLock.current = false;
      setCraftListBusy(false);
    }
  };

  const addToCraftList = async () => {
    if (!item || craftListActionLock.current) return;
    craftListActionLock.current = true;
    setCraftListBusy(true);
    try {
      let target = activeCraftList;

      if (!target) {
        const { data: existingLists } = await api.craftLists();
        setCraftLists(existingLists);
        target = existingLists[0] ?? null;
      }

      if (!target) {
        const { data } = await api.createCraftList(locale === "ru" ? "Мой крафт" : "My craft");
        target = data;
        setCraftLists([data]);
      }

      setActiveCraftList(target);
      await api.addCraftItem(target.id, item.id);
      const [items, totals] = await Promise.all([api.craftItems(target.id), api.craftSummary(target.id)]);
      setCraftItems(items.data);
      setCraftTotals(totals.data);
      setMessage(locale === "ru" ? `Добавлено в «${target.name}».` : `Added to “${target.name}”.`);
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    } finally {
      craftListActionLock.current = false;
      setCraftListBusy(false);
    }
  };

  const selectCraftList = async (list: CraftList) => {
    if (craftListBusy || activeCraftList?.id === list.id) return;
    setMessage("");
    try {
      await loadCraftList(list);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить расчёт." : "Could not load calculation.");
    }
  };

  const updateCraftItem = async (planned: CraftListItem, nextQuantity: number) => {
    if (!activeCraftList) return;
    try {
      if (nextQuantity <= 0) {
        await api.removeCraftItem(activeCraftList.id, planned.item_id);
      } else {
        await api.updateCraftItem(activeCraftList.id, planned.item_id, nextQuantity, planned.target_level);
      }
      const [items, totals] = await Promise.all([api.craftItems(activeCraftList.id), api.craftSummary(activeCraftList.id)]);
      setCraftItems(items.data);
      setCraftTotals(totals.data);
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    }
  };

  const updateCraftLevel = async (planned: CraftListItem, nextLevel: number) => {
    if (!activeCraftList) return;
    const clamped = Math.max(1, Math.min(planned.max_level, nextLevel));
    if (clamped === planned.target_level) return;
    try {
      await api.updateCraftItem(activeCraftList.id, planned.item_id, planned.quantity, clamped);
      const [items, totals] = await Promise.all([api.craftItems(activeCraftList.id), api.craftSummary(activeCraftList.id)]);
      setCraftItems(items.data);
      setCraftTotals(totals.data);
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    }
  };

  const updateOwnedResource = async (resourceId: number, nextOwned: number) => {
    if (!activeCraftList) return;
    try {
      await api.updateCraftResource(activeCraftList.id, resourceId, Math.max(0, nextOwned));
      setCraftTotals((await api.craftSummary(activeCraftList.id)).data);
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    }
  };

  const copyMissingResources = async () => {
    if (!activeCraftList || !craftTotals.length) return;
    const missing = craftTotals.filter((total) => total.remaining > 0);
    if (!missing.length) {
      setMessage(locale === "ru" ? "Все ресурсы для этого списка уже собраны." : "All resources for this list are already collected.");
      return;
    }
    const title = locale === "ru" ? `VALHEIM — ${activeCraftList.name}` : `VALHEIM — ${activeCraftList.name}`;
    const body = missing.map((total) => `• ${text(locale, total)} — ${total.remaining}`).join("\n");
    try {
      await navigator.clipboard.writeText(`${title}\n\n${body}`);
      setMessage(locale === "ru" ? "Недостающие ресурсы скопированы." : "Missing resources copied.");
    } catch {
      setMessage(locale === "ru" ? "Не удалось скопировать список." : "Could not copy the list.");
    }
  };

  const toggleFavorite = async () => {
    if (!item) return;
    try {
      const alreadySaved = favorites.some((favorite) => favorite.id === item.id);
      if (alreadySaved) {
        await api.removeFavorite(item.id); setFavorites((saved) => saved.filter((favorite) => favorite.id !== item.id));
      } else {
        await api.addFavorite(item.id); setFavorites((saved) => [item, ...saved]);
      }
    } catch (error) { setMessage(protectedErrorText(locale, error)); }
  };

  const goBack = () => {
    setMessage("");
    if (section === "item" || section === "resource") return setSection(detailOrigin);
    if (section === "creature") return setSection(creatureOrigin);
    if (section === "food-builder" || section === "taming" || section === "trophies" || section === "fishing" || section === "skills" || section === "builds" || section === "merchants" || section === "dungeons" || section === "meads") return setSection(toolOrigin);
    if (section === "biome") return setSection("home");
    setSection("home");
  };

  const showSearch = section === "home" || section === "search";
  const saved = item ? favorites.some((favorite) => favorite.id === item.id) : false;

  return <main className="app-shell">
    <header className="topbar">
      <div className="topbar-copy">
        {!(["home", "search", "craft", "favorites"] as Section[]).includes(section) && <button className="back" onClick={goBack}>‹ {locale === "ru" ? "Назад" : "Back"}</button>}
        <p className="eyebrow"><span>ᚱ</span> Unofficial companion</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <button className="language" onClick={() => setLocale(locale === "ru" ? "en" : "ru")}><span>文</span>{locale.toUpperCase()}</button>
      </div>
    </header>

    {moreMenuOpen && <>
      <button className="more-menu-backdrop" aria-label={locale === "ru" ? "Закрыть меню" : "Close menu"} onClick={() => setMoreMenuOpen(false)} />
      <aside className="more-menu-panel" aria-label={locale === "ru" ? "Дополнительное меню" : "More menu"}>
        <div className="more-menu-head"><div><small>{locale === "ru" ? "ДОПОЛНИТЕЛЬНО" : "MORE"}</small><strong>{locale === "ru" ? "Инструменты" : "Tools"}</strong></div><button onClick={() => setMoreMenuOpen(false)}>×</button></div>
        <button className="more-menu-item food" onClick={() => void openFoodBuilder()}>
          <span className="more-menu-icon">♨</span>
          <span><small>{locale === "ru" ? "РАЦИОН · КАЛЬКУЛЯТОР" : "DIET · CALCULATOR"}</small><strong>{locale === "ru" ? "Конструктор еды" : "Food Builder"}</strong><p>{locale === "ru" ? "Соберите три блюда и посчитайте показатели." : "Build a three-food loadout and calculate its stats."}</p></span>
          <i>›</i>
        </button>
        <button className="more-menu-item taming" onClick={() => void openTaming()}>
          <span className="more-menu-icon">♞</span>
          <span><small>{locale === "ru" ? "ЖИВОТНЫЕ · СПРАВОЧНИК" : "ANIMALS · GUIDE"}</small><strong>{locale === "ru" ? "Приручение" : "Taming"}</strong><p>{locale === "ru" ? "Корм, время, разведение и ездовые животные." : "Food, timing, breeding and rideable creatures."}</p></span>
          <i>›</i>
        </button>
        <button className="more-menu-item trophies" onClick={() => void openTrophies()}>
          <span className="more-menu-icon">♛</span>
          <span><small>{locale === "ru" ? "КОЛЛЕКЦИЯ · 70 ТРОФЕЕВ" : "COLLECTION · 70 TROPHIES"}</small><strong>{locale === "ru" ? "Добытые трофеи" : "Trophy Collection"}</strong><p>{locale === "ru" ? "Отмечайте найденные трофеи и следите за прогрессом коллекции." : "Mark collected trophies and track your collection progress."}</p></span>
          <i>›</i>
        </button>
        <button className="more-menu-item fishing" onClick={() => openGuideSection("fishing")}>
          <span className="more-menu-icon">🎣</span>
          <span><small>{locale === "ru" ? "12 РЫБ · 9 НАЖИВОК" : "12 FISH · 9 BAITS"}</small><strong>{locale === "ru" ? "Энциклопедия рыбалки" : "Fishing Encyclopedia"}</strong><p>{locale === "ru" ? "Где ловить, на что клюёт и как получить нужную наживку." : "Where to fish, what bites and which bait to use."}</p></span>
          <i>›</i>
        </button>
        <button className="more-menu-item skills" onClick={() => openGuideSection("skills")}>
          <span className="more-menu-icon">⚔</span>
          <span><small>{locale === "ru" ? "ПЕРСОНАЖ · 24 НАВЫКА" : "CHARACTER · 24 SKILLS"}</small><strong>{locale === "ru" ? "Навыки персонажа" : "Character Skills"}</strong><p>{locale === "ru" ? "Что прокачивает каждый навык и какой эффект дают уровни." : "What each skill governs and how levels improve it."}</p></span>
          <i>›</i>
        </button>
        <button className="more-menu-item builds" onClick={() => openGuideSection("builds")}>
          <span className="more-menu-icon">🛡</span>
          <span><small>{locale === "ru" ? "ОРУЖИЕ · БРОНЯ · ЕДА" : "WEAPONS · ARMOUR · FOOD"}</small><strong>{locale === "ru" ? "Билды персонажа" : "Character Builds"}</strong><p>{locale === "ru" ? "Готовые наборы экипировки под разные стили игры." : "Ready-to-use loadouts for different playstyles."}</p></span>
          <i>›</i>
        </button>
        <button className="more-menu-item merchants" onClick={() => openGuideSection("merchants")}>
          <span className="more-menu-icon">🧙</span>
          <span><small>{locale === "ru" ? "3 ТОРГОВЦА · 69 ТОВАРОВ" : "3 TRADERS · 69 GOODS"}</small><strong>{locale === "ru" ? "Торговцы" : "Traders"}</strong><p>{locale === "ru" ? "Где искать, что продают и чем открывается ассортимент." : "Where to find them, what they sell and how stock unlocks."}</p></span>
          <i>›</i>
        </button>
        <button className="more-menu-item dungeons" onClick={() => openGuideSection("dungeons")}>
          <span className="more-menu-icon">🏚</span>
          <span><small>{locale === "ru" ? "ДАНЖИ · ОСОБЫЕ ЛОКАЦИИ" : "DUNGEONS · SPECIAL LOCATIONS"}</small><strong>{locale === "ru" ? "Подземелья" : "Dungeons"}</strong><p>{locale === "ru" ? "Вход, враги и главный лут по биомам." : "Access, enemies and key loot by biome."}</p></span>
          <i>›</i>
        </button>
        <button className="more-menu-item meads" onClick={() => openGuideSection("meads")}>
          <span className="more-menu-icon">🧪</span>
          <span><small>{locale === "ru" ? "21 ЗЕЛЬЕ · ЭФФЕКТЫ" : "21 MEADS · EFFECTS"}</small><strong>{locale === "ru" ? "Зелья и медовуха" : "Meads & Potions"}</strong><p>{locale === "ru" ? "Рецепты, длительность, откаты и эффекты." : "Recipes, duration, cooldowns and effects."}</p></span>
          <i>›</i>
        </button>
      </aside>
    </>}

    {showSearch && <label className="search"><span className="search-icon">⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSection("search"); }} placeholder={locale === "ru" ? "Предмет, ресурс, трофей..." : "Item, resource, trophy..."} />{query && <button type="button" className="search-clear" onClick={() => { setQuery(""); setResults([]); }}>×</button>}</label>}
    {message && <div className="toast" role="status"><span>✦</span><p>{message}</p><button onClick={() => setMessage("")}>×</button></div>}

    {section === "home" && <section className="home-section">
      <div className="home-hero">
        <div className="rune-mark">ᚹ</div>
        <p className="hero-kicker">{locale === "ru" ? "ТВОЙ СПУТНИК ПО МИРУ" : "YOUR WORLD COMPANION"}</p>
        <h2>{locale === "ru" ? "Всё нужное для похода — в одном месте" : "Everything for the journey, in one place"}</h2>
        <p>{locale === "ru" ? "Рецепты, ресурсы, трофеи и личный список крафта от Лугов до Глубокого Севера." : "Recipes, resources, trophies and your personal craft plan from the Meadows to the Deep North."}</p>
        <div className="hero-metrics"><span><b>{biomes.length || 9}</b>{locale === "ru" ? "биомов" : "biomes"}</span><span><b>70+</b>{locale === "ru" ? "трофеев" : "trophies"}</span><span><b>1.0.16</b>{locale === "ru" ? "актуально" : "current"}</span></div>
      </div>
      <button className="bosses-entry" onClick={() => void openBosses()}>
        <span className="bosses-entry-icon">♛</span>
        <span className="bosses-entry-copy"><small>{locale === "ru" ? "БОЕВОЙ СПРАВОЧНИК" : "COMBAT GUIDE"}</small><strong>{locale === "ru" ? "Все боссы" : "All bosses"}</strong><p>{locale === "ru" ? "Призыв, здоровье, слабости, сопротивления и дроп каждого главного босса." : "Summons, health, weaknesses, resistances and drops for every major boss."}</p></span>
        <span className="bosses-entry-arrow">↗</span>
      </button>
      <div className="section-heading"><div><p>{locale === "ru" ? "ИССЛЕДОВАНИЕ МИРА" : "WORLD EXPLORATION"}</p><h2>{locale === "ru" ? "Биомы" : "Biomes"}</h2></div><span>{String(biomes.length || 9).padStart(2,"0")}</span></div>
      {loading ? <p className="muted">{locale === "ru" ? "Загрузка..." : "Loading..."}</p> : biomes.length === 0 ? <Empty message={locale === "ru" ? "Данные биомов появятся после первого проверенного импорта." : "Biome data will appear after the first verified import."} /> : <div className="biome-list">{biomes.map((biome, index) => <button className="biome-card" key={biome.slug} onClick={() => void openBiome(biome.slug)} style={{ "--accent": biome.accent_color ?? "#d89d46", "--art": biome.image_path ? `url(${biome.image_path})` : "none" } as CSSProperties}><span className="biome-order">{String(index + 1).padStart(2, "0")}</span><span className="biome-copy"><small>{locale === "ru" ? "БИОМ" : "BIOME"} {String(index + 1).padStart(2, "0")}</small><strong>{text(locale, biome)}</strong><p>{locale === "ru" ? biome.description_ru : biome.description_en}</p></span><span className="biome-arrow">↗</span></button>)}</div>}
    <div className="legal-note">
        <strong>{locale === "ru" ? "Неофициальный фан-проект" : "Unofficial fan project"}</strong>
        <span>{locale === "ru" ? "VALHEIM Guide не связан с Iron Gate Studio или Coffee Stain Publishing. Названия, изображения и другие игровые материалы принадлежат их правообладателям и используются в информационных и образовательных целях." : "VALHEIM Guide is not affiliated with Iron Gate Studio or Coffee Stain Publishing. Game names, images and other game materials belong to their respective rights holders and are used for informational and educational purposes."}</span>
        <a href="https://www.valheimgame.com/eula/" target="_blank" rel="noreferrer">{locale === "ru" ? "Условия использования Valheim ↗" : "Valheim usage terms ↗"}</a>
      </div></section>}

    {section === "search" && <section><div className="section-heading"><div><p>{locale === "ru" ? "ПОИСК ПО СПРАВОЧНИКУ" : "GUIDE SEARCH"}</p><h2>{locale === "ru" ? "Результаты" : "Results"}</h2></div>{query.length >= 2 && <span>{String(results.length).padStart(2,"0")}</span>}</div>{query.length < 2 ? <Empty message={locale === "ru" ? "Введите минимум 2 символа." : "Type at least 2 characters."} /> : <ResultList locale={locale} items={results} onOpen={openEntry} />}</section>}

    {section === "food-builder" && <section className="food-builder-section">
      <div className="food-builder-intro">
        <p>{locale === "ru" ? "КОНСТРУКТОР РАЦИОНА" : "DIET BUILDER"}</p>
        <h2>{locale === "ru" ? "Выберите до трёх блюд" : "Choose up to three foods"}</h2>
        <span>{locale === "ru" ? "Показатели пересчитываются сразу при каждом выборе. HP и выносливость включают базовые 25 HP и 50 выносливости персонажа. Это максимальные значения сразу после еды — со временем бонусы постепенно уменьшаются." : "Totals update instantly. Health and stamina include the character's base 25 health and 50 stamina. These are peak values right after eating; food bonuses gradually decay over time."}</span>
      </div>

      <div className="food-loadout">
        <div className="food-slots">
          {[0,1,2].map((slot) => {
            const picked = selectedFoods[slot];
            return picked ? <button className="food-slot filled" key={picked.slug} onClick={() => toggleFood(picked)}>
              <span>{picked.image_path ? <img src={picked.image_path} alt="" /> : "◆"}</span>
              <strong>{text(locale,picked)}</strong><small>{locale === "ru" ? "Нажмите, чтобы убрать" : "Tap to remove"}</small>
            </button> : <div className="food-slot empty" key={slot}><span>+</span><strong>{(locale === "ru" ? "Слот " : "Slot ") + (slot + 1)}</strong><small>{locale === "ru" ? "Выберите блюдо" : "Choose food"}</small></div>;
          })}
        </div>
        <div className="food-total-grid">
          <FoodMeter locale={locale} kind="health" base={25} bonus={foodTotals.health} max={380} />
          <FoodMeter locale={locale} kind="stamina" base={50} bonus={foodTotals.stamina} max={420} />
          <FoodMeter locale={locale} kind="eitr" base={0} bonus={foodTotals.eitr} max={330} />
        </div>
      </div>

      <label className="food-search"><span>⌕</span><input value={foodQuery} onChange={(event) => setFoodQuery(event.target.value)} placeholder={locale === "ru" ? "Найти блюдо..." : "Find food..."} />{foodQuery && <button type="button" onClick={() => setFoodQuery("")}>×</button>}</label>
      <div className="chips food-biome-chips">
        <button className={foodBiome === "all" ? "chip active" : "chip"} onClick={() => setFoodBiome("all")}><i>◈</i>{locale === "ru" ? "Все" : "All"}</button>
        {foodBiomes.map((biome) => <button className={foodBiome === biome.slug ? "chip active" : "chip"} key={biome.slug} onClick={() => setFoodBiome(biome.slug)}><i>⌖</i>{text(locale,biome)}</button>)}
      </div>
      <div className="food-result-heading"><span>{locale === "ru" ? "ДОСТУПНАЯ ЕДА" : "AVAILABLE FOOD"}</span><b>{visibleFoods.length}</b></div>
      {foodsLoading ? <Empty message={locale === "ru" ? "Загружаем блюда..." : "Loading food..."} /> : visibleFoods.length ? <div className="food-grid">{visibleFoods.map((food) => {
        const selected = selectedFoodSlugs.includes(food.slug);
        const locked = !selected && selectedFoodSlugs.length >= 3;
        return <button className={selected ? "food-card selected" : locked ? "food-card locked" : "food-card"} key={food.slug} onClick={() => toggleFood(food)}>
          <span className="food-card-art">{food.image_path ? <img src={food.image_path} alt="" /> : "◆"}</span>
          <span className="food-card-copy"><small>{locale === "ru" ? food.biome_name_ru : food.biome_name_en}</small><strong>{text(locale,food)}</strong><p>{locale === "ru" ? food.description_ru : food.description_en}</p>
            <span className="food-card-stats"><i className="hp">♥ {food.health}</i><i className="stam">⚡ {food.stamina}</i>{food.eitr > 0 && <i className="eitr">✦ {food.eitr}</i>}</span>
            <span className="food-card-meta">{food.duration ? <b>◷ {food.duration} {locale === "ru" ? "мин" : "min"}</b> : null}{food.healing ? <b>+{food.healing} {locale === "ru" ? "HP/тик" : "HP/tick"}</b> : null}</span>
          </span>
          <span className="food-card-action">{selected ? "✓" : "+"}</span>
        </button>;
      })}</div> : <Empty message={locale === "ru" ? "По этому фильтру ничего не найдено." : "No foods match this filter."} />}
    </section>}

    {section === "taming" && <section className="taming-section">
      <div className="taming-intro">
        <p>{locale === "ru" ? "ПРИРУЧЕНИЕ · 1.0" : "TAMING · 1.0"}</p>
        <h2>{locale === "ru" ? "Домашние звери Вальхейма" : "Tameable creatures"}</h2>
        <span>{locale === "ru" ? "Нажмите на животное — внутри корм, время приручения, условия разведения и полезные особенности." : "Open a creature for accepted food, taming time, breeding limits and useful traits."}</span>
      </div>
      <div className="taming-rules">
        <div><span>♡</span><p><strong>{locale === "ru" ? "Сыт и спокоен" : "Fed & calm"}</strong><small>{locale === "ru" ? "Приручение и размножение останавливаются, когда зверь голоден или встревожен." : "Taming and breeding pause while the creature is hungry or alerted."}</small></p></div>
        <div><span>⌖</span><p><strong>{locale === "ru" ? "Оставайтесь рядом" : "Stay nearby"}</strong><small>{locale === "ru" ? "Прогресс идёт только пока зона активна и игрок находится поблизости." : "Progress only advances while the area is active and a player is nearby."}</small></p></div>
        <div><span>★</span><p><strong>{locale === "ru" ? "Звёзды наследуются" : "Stars are inherited"}</strong><small>{locale === "ru" ? "Уровень приручённых животных передаётся потомству — двухзвёздочные особенно ценны." : "Tamed creature levels pass to offspring, making two-star animals especially valuable."}</small></p></div>
        <div><span>✦</span><p><strong>Brew of animal whispers</strong><small>{locale === "ru" ? "Сокращает непрерывное приручение примерно с 30 до 15 минут." : "Cuts uninterrupted taming time from about 30 to 15 minutes."}</small></p></div>
      </div>
      {tamingLoading ? <Empty message={locale === "ru" ? "Загружаем животных..." : "Loading tameable creatures..."} /> : <div className="taming-list">{tamingGuides.map((guide) => {
        const open = expandedTaming === guide.slug;
        return <div className={open ? "taming-card open" : "taming-card"} key={guide.slug}>
          <button className="taming-card-head" onClick={() => setExpandedTaming(open ? null : guide.slug)}>
            <span className="taming-animal-art">{guide.image_path ? <img src={guide.image_path} alt="" /> : "♞"}</span>
            <span className="taming-animal-copy"><small>{locale === "ru" ? guide.biome_ru : guide.biome_en}</small><strong>{text(locale,guide)}</strong><span><b>◷ {guide.taming_minutes} {locale === "ru" ? "мин" : "min"}</b>{guide.rideable && <b>♞ {locale === "ru" ? "Можно ездить" : "Rideable"}</b>}{guide.commandable && <b>⌁ {locale === "ru" ? "Следует за игроком" : "Commandable"}</b>}</span></span>
            <i>{open ? "−" : "+"}</i>
          </button>
          {open && <div className="taming-card-body">
            <p className="taming-tip"><span>✦</span>{locale === "ru" ? guide.tip_ru : guide.tip_en}</p>
            <div className="taming-facts">
              <div><small>{locale === "ru" ? "ПРИРУЧЕНИЕ" : "TAMING"}</small><strong>{guide.taming_minutes} {locale === "ru" ? "мин" : "min"}</strong></div>
              <div><small>{locale === "ru" ? "СЫТ ПОСЛЕ ЕДЫ" : "FED FOR"}</small><strong>{guide.fed_minutes} {locale === "ru" ? "мин" : "min"}</strong></div>
              <div><small>{locale === "ru" ? "ПОТОМСТВО" : "OFFSPRING"}</small><strong>{locale === "ru" ? guide.offspring_ru : guide.offspring_en}</strong></div>
              <div><small>{locale === "ru" ? "РАЗВЕДЕНИЕ" : "BREEDING CAP"}</small><strong>{guide.population_limit} / {guide.population_range} м</strong></div>
            </div>
            <div className="taming-food-title"><span>{locale === "ru" ? "ПОДХОДЯЩИЙ КОРМ" : "ACCEPTED FOOD"}</span><small>{locale === "ru" ? "Держите зверя сытым и спокойным" : "Keep the creature fed and calm"}</small></div>
            <div className="taming-food-grid">{guide.food.map((food) => <span className="taming-food" key={food.slug}><i>{food.image_path ? <img src={food.image_path} alt="" /> : "◆"}</i><b>{text(locale,food)}</b></span>)}</div>
            <div className="taming-breeding-note">
              <span>♡</span><p>{locale === "ru" ? "Для размножения держите двух сытых и спокойных особей рядом: партнёр должен быть в радиусе " + guide.partner_range + " м. Создание потомства занимает около " + guide.gestation_minutes + " мин." : "For breeding, keep two fed and calm creatures together within " + guide.partner_range + " m. Offspring creation takes about " + guide.gestation_minutes + " min."}</p>
            </div>
            {guide.saddle_en && <p className="taming-saddle">♞ <b>{locale === "ru" ? "Седло:" : "Saddle:"}</b> {locale === "ru" ? guide.saddle_ru : guide.saddle_en}</p>}
            <a className="taming-source" href={guide.source_url} target="_blank" rel="noreferrer">{locale === "ru" ? "Проверить игровые данные ↗" : "View game data ↗"}</a>
          </div>}
        </div>;
      })}</div>}
    </section>}

    {section === "trophies" && <section className="trophy-collection-section">
      <div className="trophy-collection-hero">
        <span className="trophy-collection-rune">♛</span>
        <div><p>{locale === "ru" ? "КОЛЛЕКЦИЯ ТРОФЕЕВ" : "TROPHY COLLECTION"}</p><h2>{collectedCount} / {trophies.length || 70}</h2><span>{locale === "ru" ? "Отмечайте трофеи, которые уже добыли. Прогресс сохраняется на этом устройстве." : "Mark trophies you have collected. Progress is saved on this device."}</span></div>
        <div className="trophy-progress"><i style={{ width: ((collectedCount / Math.max(1, trophies.length || 70)) * 100) + "%" }} /></div>
      </div>
      <div className="chips trophy-biome-chips">
        <button className={trophyBiome === "all" ? "chip active" : "chip"} onClick={() => setTrophyBiome("all")}><i>◈</i>{locale === "ru" ? "Все" : "All"}</button>
        {trophyBiomes.map((biome) => <button className={trophyBiome === biome.slug ? "chip active" : "chip"} key={biome.slug} onClick={() => setTrophyBiome(biome.slug)}><i>⌖</i>{text(locale,biome)}</button>)}
      </div>
      {trophiesLoading ? <Empty message={locale === "ru" ? "Загружаем трофеи..." : "Loading trophies..."} /> : <div className="trophy-check-grid">{visibleTrophies.map((entry) => {
        const collected = collectedTrophies.includes(entry.slug);
        return <button className={collected ? "trophy-check-card collected" : "trophy-check-card"} key={entry.slug} onClick={() => toggleTrophy(entry.slug)}>
          <span className="trophy-check-art">{entry.image_path ? <img src={entry.image_path} alt="" /> : "♛"}</span>
          <span className="trophy-check-copy"><small>{locale === "ru" ? entry.biome_name_ru : entry.biome_name_en}</small><strong>{text(locale,entry)}</strong><span>{collected ? (locale === "ru" ? "Добыт" : "Collected") : (locale === "ru" ? "Не найден" : "Missing")}</span></span>
          <i className="trophy-check-mark">{collected ? "✓" : "+"}</i>
        </button>;
      })}</div>}
    </section>}

    {section === "fishing" && <section className="fishing-guide-section">
      <div className="guide-hero fishing-guide-hero">
        <span className="guide-hero-icon">🎣</span>
        <div><p>{locale === "ru" ? "РЫБАЛКА · 1.0" : "FISHING · 1.0"}</p><h2>{locale === "ru" ? "12 видов рыбы" : "12 fish species"}</h2><span>{locale === "ru" ? "Удочка продаётся у Хальдора за 350 монет. Для поздних биомов берите еду на выносливость: крупная рыба быстро опустошает её запас." : "Haldor sells the rod for 350 coins. Bring stamina food for late-biome catches: large fish drain stamina quickly."}</span></div>
        <div className="guide-hero-tools"><span><img src="/media/wiki/fishing-rod.png" alt="" /><b>{locale === "ru" ? "Удочка" : "Fishing Rod"}</b></span><span><img src="/media/wiki/fishing-hat.png" alt="" /><b>{locale === "ru" ? "Рыбацкая шляпа" : "Fishing Hat"}</b></span></div>
      </div>
      <div className="fishing-bait-list">{fishingGuides.map((bait,index) => <article className="fishing-bait-card" key={bait.slug}>
        <div className="fishing-bait-head"><span className="fishing-bait-art"><img src={`/media/wiki/${bait.slug}.png`} alt="" /></span><span><small>{String(index + 1).padStart(2,"0")} · {locale === "ru" ? bait.water_ru : bait.water_en}</small><strong>{locale === "ru" ? bait.name_ru : bait.name_en}</strong><p>{locale === "ru" ? bait.recipe_ru : bait.recipe_en}</p></span></div>
        <div className="fishing-catches">{bait.fish.map((entry) => <div className="fish-chip" key={entry.slug}><i><img src={`/media/wiki/${entry.slug}.png`} alt="" /></i><span><small>{locale === "ru" ? "КЛЮЁТ" : "CATCH"}</small><b>{locale === "ru" ? entry.name_ru : entry.name_en}</b></span></div>)}</div>
      </article>)}</div>
      <p className="guide-source"><a href="https://www.valheim.tools/guides/fishing" target="_blank" rel="noreferrer">{locale === "ru" ? "Проверить данные рыбалки ↗" : "View fishing data ↗"}</a></p>
    </section>}

    {section === "skills" && <section className="skills-guide-section">
      <div className="guide-hero skills-guide-hero">
        <span className="guide-hero-icon">⚔</span>
        <div><p>{locale === "ru" ? "ПЕРСОНАЖ · 0—100" : "CHARACTER · 0—100"}</p><h2>{locale === "ru" ? "24 навыка" : "24 skills"}</h2><span>{locale === "ru" ? "Навыки растут от соответствующих действий. Более высокий уровень обычно повышает эффективность и/или снижает расход выносливости или эйтра." : "Skills grow by performing their related actions. Higher levels generally improve effectiveness and/or reduce stamina or eitr costs."}</span></div>
      </div>
      {(["combat","magic","movement","craft"] as const).map((group) => {
        const titles = { combat:[locale === "ru" ? "БОЙ" : "COMBAT",locale === "ru" ? "Боевые" : "Combat"], magic:[locale === "ru" ? "МАГИЯ" : "MAGIC",locale === "ru" ? "Магические" : "Magic"], movement:[locale === "ru" ? "ДВИЖЕНИЕ" : "MOVEMENT",locale === "ru" ? "Передвижение" : "Movement"], craft:[locale === "ru" ? "РЕМЕСЛО" : "UTILITY",locale === "ru" ? "Ремесло и быт" : "Craft & utility"] }[group];
        const entries = skillGuides.filter((skill) => skill.group === group);
        return <div className="skill-group" key={group}><div className="section-heading"><div><p>{titles[0]}</p><h2>{titles[1]}</h2></div><span>{String(entries.length).padStart(2,"0")}</span></div><div className="skill-grid">{entries.map((skill) => <article className="skill-card" key={skill.slug}><span className="skill-icon">{skill.icon}</span><span><strong>{locale === "ru" ? skill.name_ru : skill.name_en}</strong><p>{locale === "ru" ? skill.effect_ru : skill.effect_en}</p></span></article>)}</div></div>;
      })}
      <p className="guide-source"><a href="https://www.valheim.tools/skills" target="_blank" rel="noreferrer">{locale === "ru" ? "Проверить данные навыков ↗" : "View skill data ↗"}</a></p>
    </section>}

    {section === "builds" && <section className="builds-guide-section">
      <div className="guide-hero builds-guide-hero">
        <span className="guide-hero-icon">🛡</span>
        <div><p>{locale === "ru" ? "ПРОГРЕССИЯ · ПО БИОМАМ" : "PROGRESSION · BY BIOME"}</p><h2>{locale === "ru" ? "Билды персонажа" : "Character builds"}</h2><span>{locale === "ru" ? "Выберите биом. Внутри — практические пресеты из снаряжения, доступного на этом этапе или непосредственно перед ним. Это рекомендации, а не единственно правильный способ игры." : "Choose a biome. Each tab contains practical loadouts using gear available at that stage or immediately before it. These are recommendations, not the only correct way to play."}</span></div>
      </div>
      <div className="chips build-biome-chips" role="tablist" aria-label={locale === "ru" ? "Биомы для билдов" : "Build biomes"}>
        {buildBiomes.map((biome) => <button className={buildBiome === biome.slug ? "chip active" : "chip"} role="tab" aria-selected={buildBiome === biome.slug} key={biome.slug} onClick={() => setBuildBiome(biome.slug)}><i>{biome.icon}</i>{locale === "ru" ? biome.name_ru : biome.name_en}</button>)}
      </div>
      <div className="build-stage-heading">
        <span>{selectedBuildBiome.icon}</span>
        <div><small>{locale === "ru" ? "РЕКОМЕНДУЕМЫЕ ПРЕСЕТЫ" : "RECOMMENDED LOADOUTS"}</small><strong>{locale === "ru" ? selectedBuildBiome.name_ru : selectedBuildBiome.name_en}</strong><p>{locale === "ru" ? `${visibleCharacterBuilds.length} варианта под разные стили игры` : `${visibleCharacterBuilds.length} options for different playstyles`}</p></div>
      </div>
      <div className="build-list">{visibleCharacterBuilds.map((build) => <article className="build-card" key={build.id}>
        <div className="build-head"><span>{build.icon}</span><div><small>{locale === "ru" ? build.tag_ru : build.tag_en}</small><h3>{locale === "ru" ? build.name_ru : build.name_en}</h3><p>{locale === "ru" ? build.description_ru : build.description_en}</p></div></div>
        {([
          ["weapons",locale === "ru" ? "ОРУЖИЕ" : "WEAPONS",build.weapons],
          ["armor",locale === "ru" ? "БРОНЯ" : "ARMOUR",build.armor],
          ["food",locale === "ru" ? "ЕДА · 3 СЛОТА" : "FOOD · 3 SLOTS",build.food]
        ] as const).map(([kind,label,entries]) => <div className={`build-row ${kind}`} key={kind}><small>{label}</small><div>{entries.map((entry) => <button key={entry.slug} onClick={() => void openItem(entry.slug)}><i className="build-asset-art"><img src={`/media/wiki/${entry.slug}.png`} alt="" onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.parentElement?.classList.add("fallback"); }} /><b>◆</b></i><span>{locale === "ru" ? entry.name_ru : entry.name_en}</span></button>)}</div></div>)}
      </article>)}</div>
      <p className="guide-source"><a href="https://www.valheim.tools/guides/progression" target="_blank" rel="noreferrer">{locale === "ru" ? "Сверить прогрессию и предметы ↗" : "Review progression and gear ↗"}</a></p>
    </section>}


    {section === "merchants" && <section className="merchants-guide-section">
      <div className="guide-hero merchants-guide-hero"><span className="guide-hero-icon">🧙</span><div><p>{locale === "ru" ? "ТОРГОВЛЯ · ПРОГРЕСС МИРА" : "TRADING · WORLD PROGRESSION"}</p><h2>{locale === "ru" ? "Три торговца Valheim" : "Valheim's three traders"}</h2><span>{locale === "ru" ? "Где искать каждого торговца, что у него действительно важно купить и какие победы или задания расширяют ассортимент." : "Where to find each trader, which purchases matter and which bosses or quests expand their stock."}</span></div></div>
      <div className="merchant-list">{merchantGuides.map((merchant) => <article className="merchant-card" key={merchant.id}>
        <div className="merchant-head"><span>{merchant.icon}</span><div><small>{locale === "ru" ? merchant.biome_ru : merchant.biome_en}</small><h3>{merchant.name}</h3><p>{locale === "ru" ? merchant.description_ru : merchant.description_en}</p></div></div>
        <div className="merchant-meta"><span>⌖ {merchant.distance}</span><span>¤ {merchant.stock_count} {locale === "ru" ? "товаров" : "goods"}</span></div>
        <div className="merchant-stock">{merchant.highlights.map((entry) => <div className="merchant-stock-row" key={entry.name_en}>
          {entry.slug ? <GuideArt slug={entry.slug} /> : <span className="guide-symbol-art">{entry.icon ?? "◆"}</span>}
          <span className="merchant-stock-copy"><strong>{locale === "ru" ? entry.name_ru : entry.name_en}</strong>{(entry.unlock_en || entry.unlock_ru) && <small>{locale === "ru" ? entry.unlock_ru : entry.unlock_en}</small>}</span><b>{entry.price}</b>
        </div>)}</div>
        <div className="merchant-tier-list">{merchant.tiers.map((tier) => <div className="merchant-tier" key={tier.title_en}><span>{tier.icon}</span><div><small>{locale === "ru" ? tier.title_ru : tier.title_en} · {tier.count}</small><p>{locale === "ru" ? tier.note_ru : tier.note_en}</p></div></div>)}</div>
      </article>)}</div>
      <p className="guide-source"><a href="https://www.valheim.tools/traders" target="_blank" rel="noreferrer">{locale === "ru" ? "Полная таблица цен и разблокировок ↗" : "Full prices and unlock table ↗"}</a></p>
    </section>}

    {section === "dungeons" && <section className="dungeons-guide-section">
      <div className="guide-hero dungeons-guide-hero"><span className="guide-hero-icon">🏚</span><div><p>{locale === "ru" ? "ПОДЗЕМЕЛЬЯ · ОСОБЫЕ ЛОКАЦИИ" : "DUNGEONS · SPECIAL LOCATIONS"}</p><h2>{locale === "ru" ? "Куда идти и зачем" : "Where to go and why"}</h2><span>{locale === "ru" ? "Основные данжи и прогрессионные крепости: условия входа, противники и лут, ради которого их стоит зачищать." : "Major dungeons and progression fortresses with access requirements, enemies and the loot that makes them worth clearing."}</span></div></div>
      <div className="chips dungeon-biome-chips" role="tablist"><button className={dungeonBiome === "all" ? "chip active" : "chip"} onClick={() => setDungeonBiome("all")}><i>◈</i>{locale === "ru" ? "Все" : "All"}</button>{dungeonBiomes.map((biome) => <button className={dungeonBiome === biome.slug ? "chip active" : "chip"} key={biome.slug} onClick={() => setDungeonBiome(biome.slug)}><i>{biome.icon}</i>{locale === "ru" ? biome.name_ru : biome.name_en}</button>)}</div>
      <div className="dungeon-list">{visibleDungeons.map((dungeon) => {
        const biome = buildBiomes.find((entry) => entry.slug === dungeon.biome);
        return <article className="dungeon-card" key={dungeon.id}>
          <div className="dungeon-head"><span>{dungeon.icon}</span><div><small>{locale === "ru" ? dungeon.kind_ru : dungeon.kind_en}</small><h3>{locale === "ru" ? dungeon.name_ru : dungeon.name_en}</h3><p>{biome ? biome.icon + " " + (locale === "ru" ? biome.name_ru : biome.name_en) : dungeon.biome}</p></div></div>
          <p className="dungeon-description">{locale === "ru" ? dungeon.description_ru : dungeon.description_en}</p>
          <div className="dungeon-access"><b>⚿</b><span><small>{locale === "ru" ? "ВХОД / ПОИСК" : "ACCESS / FINDING"}</small>{locale === "ru" ? dungeon.access_ru : dungeon.access_en}</span></div>
          <div className="dungeon-enemies"><small>{locale === "ru" ? "ВРАГИ" : "ENEMIES"}</small><div>{(locale === "ru" ? dungeon.enemies_ru : dungeon.enemies_en).map((enemy) => <span key={enemy}>{enemy}</span>)}</div></div>
          <div className="dungeon-loot"><small>{locale === "ru" ? "ГЛАВНЫЙ ЛУТ" : "KEY LOOT"}</small><div>{dungeon.loot.map((loot) => <span key={loot.slug}><GuideArt slug={loot.slug}/><b>{locale === "ru" ? loot.name_ru : loot.name_en}</b></span>)}</div></div>
        </article>;
      })}</div>
      <p className="guide-source"><a href="https://www.valheim.tools/locations" target="_blank" rel="noreferrer">{locale === "ru" ? "База локаций Valheim ↗" : "Valheim locations database ↗"}</a></p>
    </section>}

    {section === "meads" && <section className="meads-guide-section">
      <div className="guide-hero meads-guide-hero"><span className="guide-hero-icon">🧪</span><div><p>{locale === "ru" ? "21 ЗЕЛЬЕ · РЕЦЕПТЫ · ОТКАТЫ" : "21 MEADS · RECIPES · COOLDOWNS"}</p><h2>{locale === "ru" ? "Зелья и медовуха" : "Meads & potions"}</h2><span>{locale === "ru" ? "Весь актуальный набор 1.0: лечение, выносливость, эйтр, сопротивления и специальные отвары Болотной ведьмы." : "The current 1.0 set: healing, stamina, eitr, resistances and the Bog Witch's special brews."}</span></div></div>
      <div className="chips mead-group-chips" role="tablist">{meadGroups.map((group) => <button className={meadGroup === group.id ? "chip active" : "chip"} key={group.id} onClick={() => setMeadGroup(group.id)}><i>{group.icon}</i>{locale === "ru" ? group.ru : group.en}</button>)}</div>
      <div className="mead-grid">{visibleMeads.map((mead) => <article className="mead-card" key={mead.slug}>
        <div className="mead-head"><GuideArt slug={mead.icon_slug}/><div><small>{meadGroups.find((group) => group.id === mead.group)?.[locale === "ru" ? "ru" : "en"]}</small><h3>{locale === "ru" ? mead.name_ru : mead.name_en}</h3></div></div>
        <strong className="mead-effect">{locale === "ru" ? mead.effect_ru : mead.effect_en}</strong>
        <div className="mead-meta"><span>◷ {mead.duration}</span><span>↻ {locale === "ru" ? mead.cooldown_ru : mead.cooldown_en}</span></div>
        <div className="mead-recipe"><small>{locale === "ru" ? "ОСНОВА / ПОЛУЧЕНИЕ" : "BASE / SOURCE"}</small><p>{locale === "ru" ? mead.recipe_ru : mead.recipe_en}</p></div>
      </article>)}</div>
      <p className="mead-note">{locale === "ru" ? "Обычные основы готовятся и ферментируются. Любовное зелье — исключение: оно покупается у Болотной ведьмы." : "Normal bases are brewed and fermented. Love Potion is the exception: it is bought from the Bog Witch."}</p>
      <p className="guide-source"><a href="https://www.valheim.tools/meads" target="_blank" rel="noreferrer">{locale === "ru" ? "Проверить эффекты и рецепты ↗" : "Review effects and recipes ↗"}</a></p>
    </section>}

    {section === "bosses" && <section className="bosses-section">
      <div className="section-heading"><div><p>{locale === "ru" ? "БОССЫ · БОЕВОЙ СПРАВОЧНИК" : "BOSSES · COMBAT GUIDE"}</p><h2>{locale === "ru" ? "Боссы" : "Bosses"}</h2></div><span>{String(bosses.length || 8).padStart(2,"0")}</span></div>
      <p className="bosses-intro">{locale === "ru" ? "Главные боссы Valheim по порядку прохождения. Открой карточку, чтобы посмотреть призыв, силу, рекомендуемое снаряжение, резисты и дроп." : "Valheim's major bosses in progression order. Open a card for summon requirements, power, recommended gear, resistances and drops."}</p>
      {bossesLoading ? <Empty message={locale === "ru" ? "Загружаем боссов..." : "Loading bosses..."} /> : bosses.length ? <div className="bosses-list">{bosses.map((boss,index) => <div className="bosses-list-entry" key={boss.slug}><span className="bosses-order">{String(index + 1).padStart(2,"0")}</span><BossCard locale={locale} boss={boss} onOpen={(slug) => void openCreature(slug, "bosses")} /></div>)}</div> : <Empty message={locale === "ru" ? "Список боссов пока недоступен." : "Boss list is currently unavailable."} />}
    </section>}

    {section === "biome" && <section className="biome-section">{!currentBiome ? <Empty message={locale === "ru" ? "Загружаем биом..." : "Loading biome..."} /> : <>
      <div className="biome-intro" style={{ "--accent": currentBiome.accent_color ?? "#d89d46", "--art": currentBiome.image_path ? `url(${currentBiome.image_path})` : "none" } as CSSProperties}>
        <div><p>{locale === "ru" ? "ПУТЕВОДИТЕЛЬ ПО БИОМУ" : "BIOME FIELD GUIDE"}</p><h2>{text(locale,currentBiome)}</h2><span>{locale === "ru" ? currentBiome.description_ru : currentBiome.description_en}</span></div>
      </div>
      <div className="biome-view-switch">
        <button className={biomeView === "items" ? "active" : ""} onClick={() => void selectBiomeView("items")}><span>◆</span>{locale === "ru" ? "Предметы" : "Items"}</button>
        <button className={biomeView === "creatures" ? "active" : ""} onClick={() => void selectBiomeView("creatures")}><span>☠</span>{locale === "ru" ? "Существа" : "Creatures"}</button>
        <button className={biomeView === "boss" ? "active" : ""} onClick={() => void selectBiomeView("boss")}><span>♛</span>{locale === "ru" ? "Босс" : "Boss"}</button>
      </div>
      {biomeView === "items" && <>
        <div className="chips category-chips"><button className={!activeCategory ? "chip active" : "chip"} onClick={() => void filterBiome()}><i>◈</i>{locale === "ru" ? "Все" : "All"}</button>{currentBiome.categories.map((category) => <button className={activeCategory === category.slug ? "chip active" : "chip"} key={category.slug} onClick={() => void filterBiome(category.slug)}><i>{categoryIcon(category.slug)}</i>{text(locale, category)}</button>)}</div>
        {activeCategory === "trophy" ? <TrophyGrid locale={locale} items={biomeItems} onOpen={openEntry} /> : <ResultList locale={locale} items={biomeItems} onOpen={openEntry} />}
      </>}
      {biomeView === "creatures" && (creaturesLoading ? <Empty message={locale === "ru" ? "Загружаем существ..." : "Loading creatures..."} /> : <CreatureGrid locale={locale} items={creatures} onOpen={openCreature} />)}
      {biomeView === "boss" && (creaturesLoading ? <Empty message={locale === "ru" ? "Загружаем босса..." : "Loading boss..."} /> : biomeBoss ? <BossCard locale={locale} boss={biomeBoss} onOpen={openCreature} /> : <Empty message={locale === "ru" ? "В этом биоме нет отдельного Forsaken-босса." : "This biome has no dedicated Forsaken boss."} />)}
    </>}</section>}

    {section === "item" && item && <section className="detail">
      <div className="detail-hero"><Visual entry={item} hero /><div className="detail-hero-copy"><p className="item-type">{categoryText(locale, item) ?? (locale === "ru" ? "Предмет" : "Item")}</p><h2>{text(locale,item)}</h2>{item.biome_name_ru && <span className="biome-badge">⌖ {locale === "ru" ? item.biome_name_ru : item.biome_name_en}</span>}</div></div>
      <p className="lede detail-description">{locale === "ru" ? item.description_ru : item.description_en}</p>
      <div className="detail-actions"><button className={saved ? "save primary" : "save"} onClick={() => void toggleFavorite()}>{saved ? "♥" : "♡"} {saved ? (locale === "ru" ? "В избранном" : "Saved") : (locale === "ru" ? "Сохранить" : "Save")}</button><button className="save primary" disabled={craftListBusy} onClick={() => void addToCraftList()}>⚒ {locale === "ru" ? "В мой крафт" : "Add to craft"}</button></div>
      <DetailStats locale={locale} item={item} /><Recipe locale={locale} item={item} onResource={openResource} /><Upgrades locale={locale} item={item} onResource={openResource} /><SourceLink locale={locale} entry={item} />
    </section>}

    {section === "resource" && resource && <section className="detail">
      <div className="detail-hero"><Visual entry={resource} hero /><div className="detail-hero-copy"><p className="item-type">{categoryText(locale, resource) ?? (locale === "ru" ? "Материал" : "Material")}</p><h2>{text(locale,resource)}</h2></div></div>
      <p className="lede detail-description">{locale === "ru" ? resource.description_ru : resource.description_en}</p>
      <SectionTitle eyebrow={locale === "ru" ? "ИСТОЧНИК" : "SOURCE"} title={locale === "ru" ? "Где найти" : "Where to find"} />
      {resource.sources.length ? <div className="source-list">{resource.sources.map((source, index) => <p key={index}><b>{String(index + 1).padStart(2,"0")}</b><span>{locale === "ru" ? source.method_ru : source.method_en}</span></p>)}</div> : <Empty message={locale === "ru" ? "Проверенный источник пока добавляется." : "A verified source is being added."} />}
      {(resource.dropped_by?.length ?? 0) > 0 && <>
        <SectionTitle eyebrow={locale === "ru" ? "ДОБЫЧА" : "DROPS FROM"} title={locale === "ru" ? "Выпадает из" : "Dropped by"} />
        <CreatureGrid locale={locale} items={resource.dropped_by ?? []} onOpen={(slug) => void openCreature(slug, "resource")} />
      </>}
      <SectionTitle eyebrow={locale === "ru" ? "ПРИМЕНЕНИЕ" : "USES"} title={locale === "ru" ? "Как используется" : "How it is used"} />
      {(resource.use_notes?.length ?? 0) > 0 && <div className="use-note-list">{(resource.use_notes ?? []).map((note,index) => <p key={index}><span>✦</span>{locale === "ru" ? note.ru : note.en}</p>)}</div>}
      {resource.used_by.length > 0 && <>
        {(resource.use_notes?.length ?? 0) > 0 && <p className="use-recipes-label">{locale === "ru" ? "РЕЦЕПТЫ И ПОСТРОЙКИ" : "RECIPES & BUILDINGS"}</p>}
        <ResultList locale={locale} items={resource.used_by} onOpen={openEntry} />
      </>}
      {resource.used_by.length === 0 && (resource.use_notes?.length ?? 0) === 0 && <Empty message={locale === "ru" ? "Для этого ресурса пока не зафиксировано отдельного применения." : "No dedicated use has been recorded for this resource yet."} />}
      <SourceLink locale={locale} entry={resource} />
    </section>}

    {section === "creature" && <section className="detail creature-detail">
      {!creature ? <Empty message={locale === "ru" ? "Загружаем боевые данные..." : "Loading combat data..."} /> : <CreatureDetailView locale={locale} creature={creature} boss={biomeBoss?.slug === creature.slug ? biomeBoss : bosses.find((entry) => entry.slug === creature.slug) ?? null} onResource={openResource} />}
    </section>}

    {section === "craft" && <section className="library-section">
      <LibraryTabs locale={locale} active="craft" onChange={openLibraryTab} />
      <div className="section-row craft-heading"><div><p className="section-kicker">{locale === "ru" ? "ПЛАНИРОВЩИК РЕСУРСОВ" : "RESOURCE PLANNER"}</p><h2>{locale === "ru" ? "Мой крафт" : "My craft"}</h2></div><button className="save primary" disabled={craftListBusy} onClick={() => void createCraftList()}>+ {locale === "ru" ? "Новый список" : "New list"}</button></div>
      {craftLists.length > 1 && <div className="chips">{craftLists.map((list) => <button className={activeCraftList?.id === list.id ? "chip active" : "chip"} onClick={() => void selectCraftList(list)} key={list.id}>{list.name}</button>)}</div>}
      {!activeCraftList ? <Empty message={locale === "ru" ? "Создайте список, затем добавляйте в него предметы из их карточек." : "Create a list, then add items from their cards."} /> : <>
        <div className="craft-list-toolbar">
          <div><small>{locale === "ru" ? "Активный список" : "Active list"}</small><strong>{activeCraftList.name}</strong></div>
          <div className="craft-list-actions">
            <button disabled={craftListBusy} onClick={() => void renameCraftList()} aria-label={locale === "ru" ? "Переименовать список" : "Rename list"}>✎</button>
            <button className="danger" disabled={craftListBusy} onClick={() => void deleteCraftList()} aria-label={locale === "ru" ? "Удалить список" : "Delete list"}>⌫</button>
          </div>
        </div>
        <PlannedCraftItems locale={locale} items={craftItems} onQuantityChange={updateCraftItem} onLevelChange={updateCraftLevel} onOpen={openItem} />
        <div className="section-row craft-resource-heading"><h2>{locale === "ru" ? "Нужно ресурсов" : "Resources needed"}</h2>{craftTotals.some((total) => total.remaining > 0) && <button className="save compact" onClick={() => void copyMissingResources()}>⧉ {locale === "ru" ? "Скопировать" : "Copy"}</button>}</div>
        <CraftTotals locale={locale} totals={craftTotals} onResource={openResource} onOwnedChange={updateOwnedResource} />
      </>}
    </section>}
    {section === "favorites" && <section className="library-section">
      <LibraryTabs locale={locale} active="favorites" onChange={openLibraryTab} />
      <div className="section-heading"><div><p>{locale === "ru" ? "ЛИЧНАЯ КОЛЛЕКЦИЯ" : "PERSONAL COLLECTION"}</p><h2>{locale === "ru" ? "Избранное" : "Favorites"}</h2></div><span>{String(favorites.length).padStart(2,"0")}</span></div>
      <ResultList locale={locale} items={favorites} onOpen={openEntry} />
    </section>}

    <nav className="bottom-nav" aria-label={locale === "ru" ? "Главное меню" : "Main navigation"}>
      <button className={section === "home" || section === "bosses" || section === "biome" || section === "creature" ? "active" : ""} aria-current={section === "home" || section === "bosses" || section === "biome" || section === "creature" ? "page" : undefined} onClick={() => void goNav("home")}>
        <span className="nav-icon"><NavIcon id="home" /></span>
        <span className="nav-label">{locale === "ru" ? "Главная" : "Home"}</span>
      </button>
      <button className={section === "craft" || section === "favorites" ? "active" : ""} aria-current={section === "craft" || section === "favorites" ? "page" : undefined} onClick={() => void goNav("library")}>
        <span className="nav-icon"><NavIcon id="library" /></span>
        <span className="nav-label">{locale === "ru" ? "Моё" : "Mine"}</span>
      </button>
      <button className={section === "search" ? "active" : ""} aria-current={section === "search" ? "page" : undefined} onClick={() => void goNav("search")}>
        <span className="nav-icon"><NavIcon id="search" /></span>
        <span className="nav-label">{locale === "ru" ? "Поиск" : "Search"}</span>
      </button>
      <button className={moreMenuOpen || section === "food-builder" || section === "taming" || section === "trophies" || section === "fishing" || section === "skills" || section === "builds" || section === "merchants" || section === "dungeons" || section === "meads" ? "active nav-more" : "nav-more"} aria-expanded={moreMenuOpen} aria-label={locale === "ru" ? "Дополнительное меню" : "More menu"} onClick={() => setMoreMenuOpen((open) => !open)}>
        <span className="nav-icon"><NavIcon id="more" /></span>
        <span className="nav-label">{locale === "ru" ? "Ещё" : "More"}</span>
      </button>
    </nav>
  </main>;
} 

function GuideArt({ slug }: { slug: string }) {
  return <span className="guide-mini-art"><img src={"/media/wiki/" + slug + ".png"} alt="" onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.parentElement?.classList.add("fallback"); }} /><b>◆</b></span>;
}

function NavIcon({ id }: { id: "home" | "library" | "search" | "more" }) {
  if (id === "home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.6 12 4l8 6.6v8.1a1.3 1.3 0 0 1-1.3 1.3H15v-5.5H9V20H5.3A1.3 1.3 0 0 1 4 18.7v-8.1Z" /></svg>;
  if (id === "library") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14v13H5z"/><path d="M8 9h8M8 12h5"/><path d="M15.2 14.7c1.8-2.3 5.1.2 2.6 2.3l-2.6 2.2-2.6-2.2c-2.5-2.1.8-4.6 2.6-2.3Z"/></svg>;
  if (id === "search") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.8" /><path d="m15 15 5 5" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/></svg>;
}

function LibraryTabs({ locale, active, onChange }: { locale: Locale; active: "craft" | "favorites"; onChange: (next: "craft" | "favorites") => Promise<void> }) {
  return <div className="library-tabs" role="tablist" aria-label={locale === "ru" ? "Моё" : "Mine"}>
    <button className={active === "craft" ? "active" : ""} role="tab" aria-selected={active === "craft"} onClick={() => void onChange("craft")}><span>⚒</span>{locale === "ru" ? "Крафт" : "Craft"}</button>
    <button className={active === "favorites" ? "active" : ""} role="tab" aria-selected={active === "favorites"} onClick={() => void onChange("favorites")}><span>♡</span>{locale === "ru" ? "Избранное" : "Favorites"}</button>
  </div>;
}

function DetailStats({ locale, item }: { locale: Locale; item: ItemDetail }) {
  if (!item.stats.length) return null;
  return <><SectionTitle eyebrow={locale === "ru" ? "ПАРАМЕТРЫ" : "ATTRIBUTES"} title={locale === "ru" ? "Характеристики" : "Stats"} /><div className="stats">{item.stats.map((stat) => <div key={stat.stat_key}><span>{statLabel(locale, stat.stat_key)}</span><strong>{stat.stat_value}{stat.unit ? ` ${stat.unit}` : ""}</strong></div>)}</div></>;
}

function Recipe({ locale, item, onResource }: { locale: Locale; item: ItemDetail; onResource: (slug: string) => void }) {
  if (!item.ingredients.length) return null;
  return <><SectionTitle eyebrow={locale === "ru" ? "РЕЦЕПТ" : "RECIPE"} title={locale === "ru" ? "Крафт" : "Crafting"} />{item.recipe && <p className="station">⚒ {text(locale, item.recipe)} · {locale === "ru" ? "ур." : "lvl."} {item.recipe.station_level}{item.recipe.output_quantity > 1 ? ` · ×${item.recipe.output_quantity}` : ""}</p>}<IngredientList locale={locale} ingredients={item.ingredients} onResource={onResource} /></>;
}

function Upgrades({ locale, item, onResource }: { locale: Locale; item: ItemDetail; onResource: (slug: string) => void }) {
  if (!item.upgrades.length) return null;
  return <><SectionTitle eyebrow={locale === "ru" ? "ПРОКАЧКА" : "UPGRADE PATH"} title={locale === "ru" ? "Улучшения" : "Upgrades"} /><div className="upgrades">{item.upgrades.map((upgrade) => <div className="upgrade" key={upgrade.level}><strong>{locale === "ru" ? "Уровень" : "Level"} {upgrade.level}</strong>{upgrade.station_level && <span>{locale === "ru" ? "Верстак ур." : "Workbench lvl."} {upgrade.station_level}</span>}<IngredientList locale={locale} ingredients={upgrade.ingredients} onResource={onResource} /></div>)}</div></>;
}

function IngredientList({ locale, ingredients, onResource }: { locale: Locale; ingredients: ItemDetail["ingredients"]; onResource: (slug: string) => void }) {
  return <div className="ingredients">{ingredients.map((ingredient) => <button key={ingredient.slug} onClick={() => void onResource(ingredient.slug)}>
    <span className={ingredient.image_path ? "ingredient-icon" : "ingredient-icon fallback"}>{ingredient.image_path ? <img src={ingredient.image_path} alt="" /> : "◆"}</span>
    <span className="ingredient-copy"><b>{ingredient.quantity}×</b><span>{text(locale, ingredient)}</span></span>
    <i>›</i>
  </button>)}</div>;
}

function ResultList({ locale, items, onOpen }: { locale: Locale; items: GuideItem[]; onOpen: (item: GuideItem) => void }) {
  if (!items.length) return <Empty message={locale === "ru" ? "Здесь пока ничего нет." : "Nothing here yet."} />;
  return <div className="result-list">{items.map((entry) => <button key={entry.id} className="result" onClick={() => void onOpen(entry)}><Visual entry={entry} /><span><strong>{text(locale, entry)}</strong><small><i>{categoryIcon(entry.category_slug ?? undefined)}</i>{categoryText(locale, entry) ?? (locale === "ru" ? "Материал" : "Material")}</small></span><b>↗</b></button>)}</div>;
}

function TrophyGrid({ locale, items, onOpen }: { locale: Locale; items: GuideItem[]; onOpen: (item: GuideItem) => void }) {
  if (!items.length) return <Empty message={locale === "ru" ? "Трофеи для этого биома пока не добавлены." : "No trophies have been added for this biome yet."} />;
  return <div className="trophy-grid">{items.map((entry,index) => <button className="trophy-card" key={entry.id} onClick={() => void onOpen(entry)}>
    <span className="trophy-number">{String(index + 1).padStart(2,"0")}</span>
    <Visual entry={entry} />
    <strong>{text(locale,entry)}</strong>
    <small>{locale === "ru" ? "ТРОФЕЙ" : "TROPHY"}</small>
  </button>)}</div>;
}

const damageTypeText = (locale: Locale, type: string) => ({
  blunt: locale === "ru" ? "Дробящий" : "Blunt",
  slash: locale === "ru" ? "Рубящий" : "Slash",
  pierce: locale === "ru" ? "Колющий" : "Pierce",
  chop: locale === "ru" ? "Рубка" : "Chop",
  pickaxe: locale === "ru" ? "Кирка" : "Pickaxe",
  fire: locale === "ru" ? "Огонь" : "Fire",
  frost: locale === "ru" ? "Мороз" : "Frost",
  lightning: locale === "ru" ? "Молния" : "Lightning",
  poison: locale === "ru" ? "Яд" : "Poison",
  spirit: locale === "ru" ? "Дух" : "Spirit"
}[type] ?? type);

const resistanceText = (locale: Locale, level: CreatureDetail["resistances"][number]["level"]) => ({
  weak: locale === "ru" ? "Слабость" : "Weak",
  "very-weak": locale === "ru" ? "Очень слаб" : "Very weak",
  resistant: locale === "ru" ? "Сопротивление" : "Resistant",
  "very-resistant": locale === "ru" ? "Сильное сопротивление" : "Very resistant",
  immune: locale === "ru" ? "Иммунитет" : "Immune",
  ignore: locale === "ru" ? "Не учитывается" : "Ignored"
}[level]);

function CreatureGrid({ locale, items, onOpen }: { locale: Locale; items: CreatureSummary[]; onOpen: (slug: string) => void }) {
  if (!items.length) return <Empty message={locale === "ru" ? "Существа для этого биома пока не добавлены." : "No creatures have been added for this biome yet."} />;
  return <div className="creature-grid">{items.map((entry) => <button className="creature-card" key={entry.slug} onClick={() => void onOpen(entry.slug)}>
    <span className={entry.kind === "boss" ? "creature-mark boss" : "creature-mark"}>{entry.image_path ? <img src={entry.image_path} alt="" /> : entry.kind === "boss" ? "♛" : "☠"}</span>
    <span className="creature-card-copy"><small>{entry.kind === "boss" ? (locale === "ru" ? "БОСС" : "BOSS") : (locale === "ru" ? "СУЩЕСТВО" : "CREATURE")}</small><strong>{text(locale,entry)}</strong><span><b>{entry.health.toLocaleString()}</b> HP</span></span>
    <i>↗</i>
  </button>)}</div>;
}

function BossCard({ locale, boss, onOpen }: { locale: Locale; boss: BossSummary; onOpen: (slug: string) => void }) {
  return <button className="boss-card" onClick={() => void onOpen(boss.slug)}>
    <span className="boss-crown">{boss.image_path ? <img src={boss.image_path} alt="" /> : "♛"}</span>
    <span className="boss-copy"><small>{locale === "ru" ? "FORSAKEN · БОСС БИОМА" : "FORSAKEN · BIOME BOSS"}</small><strong>{text(locale,boss)}</strong><span><b>{boss.health.toLocaleString()}</b> HP</span><p>{locale === "ru" ? boss.summon_ru : boss.summon_en}</p></span>
    <i>↗</i>
  </button>;
}

function CreatureDetailView({ locale, creature, boss, onResource }: { locale: Locale; creature: CreatureDetail; boss: BossSummary | null; onResource: (slug: string) => void }) {
  const weak = creature.resistances.filter((entry) => entry.level === "weak" || entry.level === "very-weak");
  const defended = creature.resistances.filter((entry) => !["weak","very-weak","ignore"].includes(entry.level));
  return <>
    <div className={boss ? "creature-hero boss" : "creature-hero"}>
      <div className="creature-art">{creature.image_url ? <img src={creature.image_url} alt="" /> : <span>{boss ? "♛" : "☠"}</span>}</div>
      <div><p className="item-type">{boss ? (locale === "ru" ? "FORSAKEN · БОСС" : "FORSAKEN · BOSS") : (locale === "ru" ? "СУЩЕСТВО" : "CREATURE")}</p><h2>{text(locale,creature)}</h2><span className="health-badge"><b>{creature.health.toLocaleString()}</b> HP</span></div>
    </div>

    {boss && <div className="boss-facts">
      <div><small>{locale === "ru" ? "ПРИЗЫВ" : "SUMMON"}</small><strong>{locale === "ru" ? boss.summon_ru : boss.summon_en}</strong></div>
      <div><small>{locale === "ru" ? "СИЛА ПАВШЕГО" : "FORSAKEN POWER"}</small><strong>{locale === "ru" ? boss.power_ru : boss.power_en}</strong></div>
      <div><small>{locale === "ru" ? "РЕКОМЕНДУЕТСЯ" : "RECOMMENDED"}</small><strong>{locale === "ru" ? boss.recommended_ru : boss.recommended_en}</strong></div>
    </div>}

    <SectionTitle eyebrow={locale === "ru" ? "БОЕВОЙ ПРОФИЛЬ" : "COMBAT PROFILE"} title={locale === "ru" ? "Уязвимости и защита" : "Weaknesses & defenses"} />
    {creature.resistances.length ? <div className="resistance-groups">
      <div className="resistance-block weak"><small>{locale === "ru" ? "ЛУЧШЕ БИТЬ" : "BEST AGAINST"}</small>{weak.length ? <div>{weak.map((entry) => <span key={entry.type}><b>{damageTypeText(locale,entry.type)}</b><em>{resistanceText(locale,entry.level)}</em></span>)}</div> : <p>{locale === "ru" ? "Выраженных слабостей нет." : "No listed weakness."}</p>}</div>
      <div className="resistance-block defend"><small>{locale === "ru" ? "ЗАЩИТА" : "DEFENSES"}</small>{defended.length ? <div>{defended.map((entry) => <span className={entry.level} key={entry.type}><b>{damageTypeText(locale,entry.type)}</b><em>{resistanceText(locale,entry.level)}</em></span>)}</div> : <p>{locale === "ru" ? "Нет особых сопротивлений." : "No special resistances."}</p>}</div>
    </div> : <Empty message={locale === "ru" ? "Особых слабостей и сопротивлений не зафиксировано." : "No special weaknesses or resistances are recorded."} />}

    <SectionTitle eyebrow={locale === "ru" ? "ЛУТ" : "LOOT"} title={locale === "ru" ? "Что выпадает" : "Drops"} />
    {creature.drops.length ? <div className="drop-list">{creature.drops.map((drop,index) => {
      const linkedName = locale === "ru" ? drop.name_ru : drop.name_en;
      return <button className={drop.slug ? "drop-entry linked" : "drop-entry"} disabled={!drop.slug} key={`${drop.name}-${index}`} onClick={() => drop.slug && void onResource(drop.slug)}>
        <span className={drop.image_path ? "drop-icon" : "drop-icon fallback"}>{drop.image_path ? <img src={drop.image_path} alt="" /> : "◆"}</span>
        <span className="drop-copy"><span><b>{linkedName ?? drop.name}</b>{drop.amount && <small>×{drop.amount}</small>}</span>{drop.slug && <small>{locale === "ru" ? "Открыть ресурс и применение" : "Open resource & uses"}</small>}</span>
        {drop.chance && <em>{drop.chance}</em>}
        {drop.slug && <i>›</i>}
      </button>;
    })}</div> : <Empty message={locale === "ru" ? "Это существо не роняет предметы." : "This creature does not drop items."} />}

    <p className="source-credit"><a href={creature.source_url} target="_blank" rel="noreferrer">{locale === "ru" ? "Боевые данные" : "Combat data"} ↗</a><span>{creature.source_name}</span></p>
  </>;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="detail-section-title"><p>{eyebrow}</p><h2>{title}</h2></div>;
}

function Visual({ entry, hero = false }: { entry: GuideItem; hero?: boolean }) {
  if (entry.image_path) return <span className={hero ? "visual hero" : "visual"}><img src={entry.image_path} alt="" /></span>;
  return <span className={hero ? "visual hero fallback" : "visual fallback"}>{entry.entity_type === "resource" ? "◆" : "⚔"}</span>;
}

function PlannedCraftItems({ locale, items, onQuantityChange, onLevelChange, onOpen }: { locale: Locale; items: CraftListItem[]; onQuantityChange: (item: CraftListItem, nextQuantity: number) => void; onLevelChange: (item: CraftListItem, nextLevel: number) => void; onOpen: (slug: string) => void }) {
  if (!items.length) return <Empty message={locale === "ru" ? "Пока пусто. Добавьте предмет из его карточки." : "Nothing here yet. Add an item from its card."} />;
  return <div className="planned-items">{items.map((planned) => <div className="planned-item" key={planned.item_id}>
    <button className="planned-main" onClick={() => void onOpen(planned.slug)}>
      <span className="planned-icon">{planned.image_path ? <img src={planned.image_path} alt="" /> : "⚔"}</span>
      <span><strong>{text(locale, planned)}</strong><small>{locale === "ru" ? `Уровень ${planned.target_level}` : `Level ${planned.target_level}`}</small></span>
    </button>
    <div className="planned-controls">
      {planned.max_level > 1 && <div className="planned-level">
        <span>{locale === "ru" ? "Ур." : "Lvl."}</span>
        <button disabled={planned.target_level <= 1} onClick={() => void onLevelChange(planned, planned.target_level - 1)}>−</button>
        <strong>{planned.target_level}/{planned.max_level}</strong>
        <button disabled={planned.target_level >= planned.max_level} onClick={() => void onLevelChange(planned, planned.target_level + 1)}>+</button>
      </div>}
      <div className="planned-quantity">
        <button onClick={() => void onQuantityChange(planned, planned.quantity - 1)}>−</button>
        <strong>×{planned.quantity}</strong>
        <button onClick={() => void onQuantityChange(planned, planned.quantity + 1)}>+</button>
        <button className="planned-remove" aria-label={locale === "ru" ? "Удалить предмет из списка" : "Remove item from list"} onClick={() => void onQuantityChange(planned, 0)}>⌫</button>
      </div>
    </div>
  </div>)}</div>;
}

function CraftTotals({ locale, totals, onResource, onOwnedChange }: { locale: Locale; totals: CraftResourceTotal[]; onResource: (slug: string) => void; onOwnedChange: (resourceId: number, nextOwned: number) => void }) {
  if (!totals.length) return <Empty message={locale === "ru" ? "Добавьте предмет из его карточки — здесь появится общий список ресурсов." : "Add an item from its card to see the combined resource list."} />;
  const completeCount = totals.filter((total) => total.remaining === 0).length;
  const missingUnits = totals.reduce((sum, total) => sum + total.remaining, 0);
  const overallProgress = Math.round((completeCount / totals.length) * 100);
  return <div className="craft-totals">
    <div className="craft-overview">
      <div><strong>{locale === "ru" ? `Готово ресурсов: ${completeCount}/${totals.length}` : `Resources ready: ${completeCount}/${totals.length}`}</strong><small>{locale === "ru" ? `Осталось собрать единиц: ${missingUnits}` : `Units still needed: ${missingUnits}`}</small></div>
      <b>{overallProgress}%</b>
      <span><i style={{ width: `${overallProgress}%` }} /></span>
    </div>
    {totals.map((total) => {
    const complete = total.remaining === 0;
    const progress = total.required > 0 ? Math.min(100, Math.round((total.owned / total.required) * 100)) : 0;
    return <div className={complete ? "craft-total complete" : "craft-total"} key={total.resource_id}>
      <button className="craft-resource" onClick={() => void onResource(total.slug)}>
        <span className={total.image_path ? "craft-resource-icon" : "craft-resource-icon fallback"}>{total.image_path ? <img src={total.image_path} alt="" /> : "◆"}</span>
        <span className="craft-resource-copy"><strong>{text(locale, total)}</strong><small>{locale === "ru" ? `Нужно: ${total.required} · есть: ${total.owned}` : `Need: ${total.required} · have: ${total.owned}`}</small></span>
        <b>{complete ? "✓" : total.remaining}</b>
      </button>
      <div className="craft-progress"><span style={{ width: `${progress}%` }} /></div>
      <div className="craft-owned">
        <button aria-label={locale === "ru" ? "Уменьшить количество" : "Decrease quantity"} onClick={() => void onOwnedChange(total.resource_id, total.owned - 1)}>−</button>
        <span>{locale === "ru" ? "У меня" : "Owned"} <strong>{total.owned}</strong></span>
        <button aria-label={locale === "ru" ? "Увеличить количество" : "Increase quantity"} onClick={() => void onOwnedChange(total.resource_id, total.owned + 1)}>+</button>
        <button className="owned-reset" disabled={total.owned === 0} onClick={() => void onOwnedChange(total.resource_id, 0)}>{locale === "ru" ? "0" : "0"}</button>
        <button className="owned-all" disabled={complete} onClick={() => void onOwnedChange(total.resource_id, total.required)}>✓</button>
      </div>
    </div>;
  })}</div>;
}

function SourceLink({ locale, entry }: { locale: Locale; entry: GuideItem }) {
  if (!entry.source_url) return null;
  return <p className="source-credit"><a href={entry.source_url} target="_blank" rel="noreferrer">{locale === "ru" ? "Источник данных" : "Data source"} ↗</a>{entry.source_name ? <span>{entry.source_name}</span> : null}</p>;
}

function FoodMeter({ locale, kind, base, bonus, max }: { locale: Locale; kind: "health" | "stamina" | "eitr"; base: number; bonus: number; max: number }) {
  const total = base + bonus;
  const label = kind === "health" ? (locale === "ru" ? "Здоровье" : "Health") : kind === "stamina" ? (locale === "ru" ? "Выносливость" : "Stamina") : (locale === "ru" ? "Эйтр" : "Eitr");
  const symbol = kind === "health" ? "♥" : kind === "stamina" ? "⚡" : "✦";
  return <div className={"food-meter " + kind}>
    <span className="food-meter-label"><i>{symbol}</i>{label}</span>
    <span className="food-meter-values"><strong key={kind + "-" + total}>{total}</strong><small key={kind + "-bonus-" + bonus}>+{bonus}</small></span>
    <span className="food-meter-track"><i style={{ width: Math.min(100, Math.round((total / max) * 100)) + "%" }} /></span>
  </div>;
}

function Empty({ message }: { message: string }) { return <div className="empty">{message}</div>; }
