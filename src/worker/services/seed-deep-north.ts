import type { Env } from "../env";
import { applyCatalogSeed, type CatalogSeed } from "./catalog-seed";

const item = (slug: string) => `https://www.valheim.tools/items/${slug}`;
const building = (slug: string) => `https://www.valheim.tools/building/${slug}`;

const deepNorthSeed: CatalogSeed = {
  marker: "catalog_deep_north_v1",
  biome: "deep-north",
  stations: [
    { slug: "frigid-kiln", en: "Frigid Kiln", ru: "Морозная печь" },
    { slug: "frost-foundry", en: "Frost Foundry", ru: "Морозная литейная" }
  ],
  items: [
    { slug:"kindled-ribs", type:"resource", category:"material", en:"Kindled Ribs", ru:"Пылающие рёбра", descriptionEn:"A Fader relic used to build the Eternal Pyre.", descriptionRu:"Реликвия Фейдера для строительства Вечного костра.", imageFile:"Kindled_Ribs.png", source:item("kindled-ribs"), biome:"ashlands" },
    { slug:"embers", type:"resource", category:"material", en:"Embers", ru:"Угли Фейдера", descriptionEn:"Burning embers attracted by the Eternal Pyre.", descriptionRu:"Горящие угли, собираемые у Вечного костра.", imageFile:"Embers.png", source:item("embers") },
    { slug:"petrified-tissue", type:"resource", category:"material", en:"Petrified Tissue", ru:"Окаменевшая ткань", descriptionEn:"Ore-like tissue mined from petrified Gammeltroll remains.", descriptionRu:"Рудоподобная ткань из окаменевших останков гаммельтроллей.", imageFile:"Petrified_Tissue.png", source:item("petrified-tissue") },
    { slug:"bloodgold", type:"resource", category:"material", en:"Bloodgold", ru:"Кровавое золото", descriptionEn:"Deep North metal refined from Petrified Tissue.", descriptionRu:"Металл Глубокого Севера, выплавляемый из окаменевшей ткани.", imageFile:"Bloodgold.png", source:item("bloodgold") },
    { slug:"ice", type:"resource", category:"material", en:"Ice", ru:"Лёд", descriptionEn:"Deep North ice used in food and frost processing.", descriptionRu:"Лёд Глубокого Севера для еды и морозной переработки.", imageFile:"Ice.png", source:item("ice") },
    { slug:"liquid-frost", type:"resource", category:"material", en:"Liquid Frost", ru:"Жидкий мороз", descriptionEn:"Fuel produced from ice in a Frigid Kiln.", descriptionRu:"Топливо из льда, производимое в Морозной печи.", imageFile:"Liquid_Frost.png", source:item("liquid-frost") },
    { slug:"frostcore", type:"resource", category:"material", en:"Frostcore", ru:"Морозное ядро", descriptionEn:"A rare core used for Deep North crafting machinery.", descriptionRu:"Редкое ядро для северных ремесленных построек.", imageFile:"Frostcore.png", source:item("frostcore") },
    { slug:"timberwood", type:"resource", category:"material", en:"Timberwood", ru:"Северная древесина", descriptionEn:"Heavy timber harvested from Deep North trees.", descriptionRu:"Прочная древесина деревьев Глубокого Севера.", imageFile:"Timberwood.png", source:item("timberwood") },
    { slug:"elaking-hair-bundle", type:"resource", category:"material", en:"Elaking Hair Bundle", ru:"Пучок шерсти элакинга", descriptionEn:"A bundle of hair gathered from Elaking.", descriptionRu:"Пучок шерсти, добываемый с элакингов.", imageFile:"Elaking_Hair_Bundle.png", source:item("elaking-hair-bundle") },
    { slug:"frozen-branch", type:"resource", category:"material", en:"Frozen Branch", ru:"Замёрзшая ветвь", descriptionEn:"A frozen branch dropped by Barka.", descriptionRu:"Замёрзшая ветвь, выпадающая из Барки.", imageFile:"Frozen_Branch.png", source:item("frozen-branch") },
    { slug:"leather-straps", type:"resource", category:"material", en:"Leather Straps", ru:"Кожаные ремни", descriptionEn:"Heavy leather straps used in northern equipment.", descriptionRu:"Прочные кожаные ремни для северного снаряжения.", imageFile:"Leather_Straps.png", source:item("leather-straps") },
    { slug:"memorial-coal", type:"resource", category:"material", en:"Memorial Coal", ru:"Поминальный уголь", descriptionEn:"Coal used at North Memorial Places.", descriptionRu:"Уголь для ритуалов у Северных мемориалов.", imageFile:"Memorial_Coal.png", source:item("memorial-coal") },
    { slug:"moose-hide", type:"resource", category:"material", en:"Moose Hide", ru:"Шкура лося", descriptionEn:"Heavy hide from Deep North Moose.", descriptionRu:"Прочная шкура северного лося.", imageFile:"Moose_Hide.png", source:item("moose-hide") },
    { slug:"moose-meat", type:"resource", category:"material", en:"Moose Meat", ru:"Мясо лося", descriptionEn:"Raw meat dropped by Moose.", descriptionRu:"Сырое мясо, выпадающее с лосей.", imageFile:"Moose_Meat.png", source:item("moose-meat") },
    { slug:"moose-sinew", type:"resource", category:"material", en:"Moose Sinew", ru:"Лосиное сухожилие", descriptionEn:"Strong sinew from Moose.", descriptionRu:"Прочное сухожилие, добываемое с лосей.", imageFile:"Moose_Sinew.png", source:item("moose-sinew") },
    { slug:"nornathread", type:"resource", category:"material", en:"Nornathread", ru:"Норна-нить", descriptionEn:"A mystical northern thread used in armour and magic.", descriptionRu:"Мистическая северная нить для брони и магии.", imageFile:"Nornathread.png", source:item("nornathread") },
    { slug:"seal-blubber", type:"resource", category:"material", en:"Seal Blubber", ru:"Тюлений жир", descriptionEn:"Insulating blubber from Seals.", descriptionRu:"Жир северных тюленей.", imageFile:"Seal_Blubber.png", source:item("seal-blubber") },
    { slug:"seal-pelt", type:"resource", category:"material", en:"Seal Pelt", ru:"Тюленья шкура", descriptionEn:"Thick pelt from Deep North Seals.", descriptionRu:"Толстая шкура северных тюленей.", imageFile:"Seal_Pelt.png", source:item("seal-pelt") },
    { slug:"frostfire-essence", type:"resource", category:"material", en:"Frostfire Essence", ru:"Эссенция морозного огня", descriptionEn:"An essence that converts Nord weapons into Frostfire variants.", descriptionRu:"Эссенция для превращения оружия Nord в морозно-огненные варианты.", imageFile:"Frostfire_Essence.png", source:item("frostfire-essence") },
    { slug:"thunderblood-essence", type:"resource", category:"material", en:"Thunderblood Essence", ru:"Эссенция грозовой крови", descriptionEn:"An essence that converts Nord weapons into Thunderblood variants.", descriptionRu:"Эссенция для превращения оружия Nord в грозовые варианты.", imageFile:"Thunderblood_Essence.png", source:item("thunderblood-essence") },
    { slug:"long-claws", type:"resource", category:"material", en:"Long Claws", ru:"Длинные когти", descriptionEn:"Long claws from the Eyeless One.", descriptionRu:"Длинные когти Безглазого.", imageFile:"Long_Claws.png", source:item("long-claws") },
    { slug:"hexen-trophy", type:"resource", category:"material", en:"Hexen Trophy", ru:"Трофей: Хексен", descriptionEn:"A trophy from Hexen.", descriptionRu:"Трофей с Хексен.", imageFile:"Hexen_Trophy.png", source:item("hexen-trophy") },
    { slug:"moose-trophy", type:"resource", category:"material", en:"Moose Trophy", ru:"Трофей: лось", descriptionEn:"A rare trophy from Moose.", descriptionRu:"Редкий трофей с лося.", imageFile:"Moose_Trophy.png", source:item("moose-trophy") },
    { slug:"lingonberries", type:"resource", category:"material", en:"Lingonberries", ru:"Брусника", descriptionEn:"Northern berries used in food and Moose taming.", descriptionRu:"Северные ягоды для еды и приручения лосей.", imageFile:"Lingonberries.png", source:item("lingonberries") },
    { slug:"raw-fish", type:"resource", category:"material", en:"Raw Fish", ru:"Сырая рыба", descriptionEn:"Fish meat prepared from caught fish.", descriptionRu:"Сырое рыбное филе из пойманной рыбы.", imageFile:"Raw_Fish.png", source:item("raw-fish"), biome:"ocean" },
    { slug:"kale", type:"resource", category:"material", en:"Kale", ru:"Кейл", descriptionEn:"A farmable Deep North leafy crop.", descriptionRu:"Выращиваемая листовая культура Глубокого Севера.", imageFile:"Kale.png", source:item("kale") },
    { slug:"kale-seeds", type:"resource", category:"material", en:"Kale Seeds", ru:"Семена кейла", descriptionEn:"Seeds used to grow Kale.", descriptionRu:"Семена для выращивания кейла.", imageFile:"Kale_Seeds.png", source:item("kale-seeds") },
    { slug:"oats", type:"resource", category:"material", en:"Oats", ru:"Овёс", descriptionEn:"Northern grain used directly and for flour.", descriptionRu:"Северное зерно для еды и муки.", imageFile:"Oats.png", source:item("oats") },
    { slug:"oat-seeds", type:"resource", category:"material", en:"Oat Seeds", ru:"Семена овса", descriptionEn:"Seeds used to grow Oats.", descriptionRu:"Семена для выращивания овса.", imageFile:"Oat_Seeds.png", source:item("oat-seeds") },
    { slug:"oat-flour", type:"resource", category:"material", en:"Oat Flour", ru:"Овсяная мука", descriptionEn:"Flour milled from Oats.", descriptionRu:"Мука, перемолотая из овса.", imageFile:"Oat_Flour.png", source:item("oat-flour") },
    { slug:"poteitr", type:"resource", category:"material", en:"Poteitr", ru:"Потейтер", descriptionEn:"A northern root crop that feeds health, stamina and eitr.", descriptionRu:"Северный корнеплод, дающий здоровье, выносливость и эйтр.", imageFile:"Poteitr.png", source:item("poteitr") },
    { slug:"seed-poteitr", type:"resource", category:"material", en:"Seed Poteitr", ru:"Семена Потейтера", descriptionEn:"Seeds used to grow Poteitr.", descriptionRu:"Семена для выращивания Потейтера.", imageFile:"Seed_Poteitr.png", source:item("seed-poteitr") },
    { slug:"malicious-blood", type:"resource", category:"material", en:"Malicious Blood", ru:"Зловещая кровь", descriptionEn:"A ritual material used to open the path to Kall.", descriptionRu:"Ритуальный материал для открытия пути к Каллу.", imageFile:"Malicious_Blood.png", source:item("malicious-blood") },
    { slug:"bloodgold-battle-idol", type:"resource", category:"material", en:"Bloodgold Battle Idol", ru:"Боевой идол кровавого золота", descriptionEn:"Tier-7 Forge of Potential material for weapons.", descriptionRu:"Материал 7 уровня для усиления оружия в Кузнице потенциала.", imageFile:"Bloodgold_Battle_Idol.png", source:item("bloodgold-battle-idol") },
    { slug:"bloodgold-protection-idol", type:"resource", category:"material", en:"Bloodgold Protection Idol", ru:"Защитный идол кровавого золота", descriptionEn:"Tier-7 Forge of Potential material for armour.", descriptionRu:"Материал 7 уровня для усиления брони в Кузнице потенциала.", imageFile:"Bloodgold_Protection_Idol.png", source:item("bloodgold-protection-idol") },

    { slug:"mould-nord-sword", type:"resource", category:"material", en:"Mould: Nord Sword", ru:"Форма: меч Nord", descriptionEn:"A mould for casting a Nord Sword.", descriptionRu:"Форма для отливки меча Nord.", imageFile:"Mould_Nord_Sword.png", source:item("mould-nord-sword") },
    { slug:"mould-nord-axe", type:"resource", category:"material", en:"Mould: Nord Axe", ru:"Форма: топор Nord", descriptionEn:"A mould for casting a Nord Axe.", descriptionRu:"Форма для отливки топора Nord.", imageFile:"Mould_Nord_Axe.png", source:item("mould-nord-axe") },
    { slug:"mould-nord-mace", type:"resource", category:"material", en:"Mould: Nord Mace", ru:"Форма: булава Nord", descriptionEn:"A mould for casting a Nord Mace.", descriptionRu:"Форма для отливки булавы Nord.", imageFile:"Mould_Nord_Mace.png", source:item("mould-nord-mace") },
    { slug:"mould-nord-spear", type:"resource", category:"material", en:"Mould: Nord Spear", ru:"Форма: копьё Nord", descriptionEn:"A mould for casting a Nord Spear.", descriptionRu:"Форма для отливки копья Nord.", imageFile:"Mould_Nord_Spear.png", source:item("mould-nord-spear") },
    { slug:"mould-nord-atgeir", type:"resource", category:"material", en:"Mould: Nord Atgeir", ru:"Форма: атгейр Nord", descriptionEn:"A mould for casting a Nord Atgeir.", descriptionRu:"Форма для отливки атгейра Nord.", imageFile:"Mould_Nord_Atgeir.png", source:item("mould-nord-atgeir") },
    { slug:"mould-nord-greatsword", type:"resource", category:"material", en:"Mould: Nord Greatsword", ru:"Форма: двуручный меч Nord", descriptionEn:"A mould for casting a Nord Greatsword.", descriptionRu:"Форма для отливки двуручного меча Nord.", imageFile:"Mould_Nord_Greatsword.png", source:item("mould-nord-greatsword") },
    { slug:"mould-nord-greataxe", type:"resource", category:"material", en:"Mould: Nord Greataxe", ru:"Форма: секира Nord", descriptionEn:"A mould for casting a Nord Greataxe.", descriptionRu:"Форма для отливки секиры Nord.", imageFile:"Mould_Nord_Greataxe.png", source:item("mould-nord-greataxe") },
    { slug:"mould-nord-dagger", type:"resource", category:"material", en:"Mould: Nord Dagger", ru:"Форма: кинжал Nord", descriptionEn:"A mould for casting a Nord Dagger.", descriptionRu:"Форма для отливки кинжала Nord.", imageFile:"Mould_Nord_Dagger.png", source:item("mould-nord-dagger") },
    { slug:"mould-nord-knucklechains", type:"resource", category:"material", en:"Mould: Nord Knucklechains", ru:"Форма: цепные кастеты Nord", descriptionEn:"A mould for casting Nord Knucklechains.", descriptionRu:"Форма для отливки цепных кастетов Nord.", imageFile:"Mould_Nord_Knucklechains.png", source:item("mould-nord-knucklechains") },
    { slug:"mould-nord-bow", type:"resource", category:"material", en:"Mould: Nord Bow", ru:"Форма: лук Nord", descriptionEn:"A mould for casting a Nord Bow.", descriptionRu:"Форма для отливки лука Nord.", imageFile:"Mould_Nord_Bow.png", source:item("mould-nord-bow") },
    { slug:"mould-nord-crossbow", type:"resource", category:"material", en:"Mould: Nord Crossbow", ru:"Форма: арбалет Nord", descriptionEn:"A mould for casting a Nord Crossbow.", descriptionRu:"Форма для отливки арбалета Nord.", imageFile:"Mould_Nord_Crossbow.png", source:item("mould-nord-crossbow") },
    { slug:"mould-nord-sledge", type:"resource", category:"material", en:"Mould: Nord Sledge", ru:"Форма: кувалда Nord", descriptionEn:"A mould for casting a Nord Sledge.", descriptionRu:"Форма для отливки кувалды Nord.", imageFile:"Mould_Nord_Sledge.png", source:item("mould-nord-sledge") },

    { slug:"nord-sword", type:"item", category:"weapon", en:"Nord Sword", ru:"Меч Nord", descriptionEn:"A Bloodgold sword hardened at the Frost Foundry.", descriptionRu:"Меч из кровавого золота, закалённый в Морозной литейной.", imageFile:"Nord_Sword.png", source:item("nord-sword") },
    { slug:"nord-axe", type:"item", category:"weapon", en:"Nord Axe", ru:"Топор Nord", descriptionEn:"A Bloodgold axe that also serves as a tier-6 woodcutting tool.", descriptionRu:"Топор из кровавого золота и инструмент для рубки высшего уровня.", imageFile:"Nord_Axe.png", source:item("nord-axe") },
    { slug:"nord-mace", type:"item", category:"weapon", en:"Nord Mace", ru:"Булава Nord", descriptionEn:"A heavy Bloodgold mace.", descriptionRu:"Тяжёлая булава из кровавого золота.", imageFile:"Nord_Mace.png", source:item("nord-mace") },
    { slug:"nord-spear", type:"item", category:"weapon", en:"Nord Spear", ru:"Копьё Nord", descriptionEn:"A Bloodgold spear for endgame combat.", descriptionRu:"Копьё из кровавого золота для поздней игры.", imageFile:"Nord_Spear.png", source:item("nord-spear") },
    { slug:"nord-atgeir", type:"item", category:"weapon", en:"Nord Atgeir", ru:"Атгейр Nord", descriptionEn:"A long Bloodgold polearm.", descriptionRu:"Длинное древковое оружие из кровавого золота.", imageFile:"Nord_Atgeir.png", source:item("nord-atgeir") },
    { slug:"nord-greatsword", type:"item", category:"weapon", en:"Nord Greatsword", ru:"Двуручный меч Nord", descriptionEn:"A massive northern greatsword.", descriptionRu:"Массивный северный двуручный меч.", imageFile:"Nord_Greatsword.png", source:item("nord-greatsword") },
    { slug:"nord-greataxe", type:"item", category:"weapon", en:"Nord Greataxe", ru:"Секира Nord", descriptionEn:"A massive northern greataxe.", descriptionRu:"Массивная северная секира.", imageFile:"Nord_Greataxe.png", source:item("nord-greataxe") },
    { slug:"nord-dagger", type:"item", category:"weapon", en:"Nord Dagger", ru:"Кинжал Nord", descriptionEn:"A fast Bloodgold dagger.", descriptionRu:"Быстрый кинжал из кровавого золота.", imageFile:"Nord_Dagger.png", source:item("nord-dagger") },
    { slug:"nord-knucklechains", type:"item", category:"weapon", en:"Nord Knucklechains", ru:"Цепные кастеты Nord", descriptionEn:"Endgame fist weapons forged from Bloodgold.", descriptionRu:"Поздние кулачные оружия из кровавого золота.", imageFile:"Nord_Knucklechains.png", source:item("nord-knucklechains") },
    { slug:"nord-bow", type:"item", category:"weapon", en:"Nord Bow", ru:"Лук Nord", descriptionEn:"An endgame Bloodgold bow.", descriptionRu:"Поздний лук из кровавого золота.", imageFile:"Nord_Bow.png", source:item("nord-bow") },
    { slug:"nord-crossbow", type:"item", category:"weapon", en:"Nord Crossbow", ru:"Арбалет Nord", descriptionEn:"A high-damage northern crossbow.", descriptionRu:"Мощный северный арбалет.", imageFile:"Nord_Crossbow.png", source:item("nord-crossbow") },
    { slug:"nord-sledge", type:"item", category:"weapon", en:"Nord Sledge", ru:"Кувалда Nord", descriptionEn:"A colossal Bloodgold sledgehammer.", descriptionRu:"Колоссальная кувалда из кровавого золота.", imageFile:"Nord_Sledge.png", source:item("nord-sledge") },

    { slug:"frostfire-sword", type:"item", category:"weapon", en:"Frostfire Sword", ru:"Меч морозного огня", descriptionEn:"Frostfire-infused Nord Sword.", descriptionRu:"Меч Nord, усиленный эссенцией морозного огня.", imageFile:"Frostfire_Sword.png", source:item("frostfire-sword") },
    { slug:"frostfire-axe", type:"item", category:"weapon", en:"Frostfire Axe", ru:"Топор морозного огня", descriptionEn:"Frostfire-infused Nord Axe.", descriptionRu:"Топор Nord, усиленный эссенцией морозного огня.", imageFile:"Frostfire_Axe.png", source:item("frostfire-axe") },
    { slug:"frostfire-mace", type:"item", category:"weapon", en:"Frostfire Mace", ru:"Булава морозного огня", descriptionEn:"Frostfire-infused Nord Mace.", descriptionRu:"Булава Nord, усиленная эссенцией морозного огня.", imageFile:"Frostfire_Mace.png", source:item("frostfire-mace") },
    { slug:"frostfire-spear", type:"item", category:"weapon", en:"Frostfire Spear", ru:"Копьё морозного огня", descriptionEn:"Frostfire-infused Nord Spear.", descriptionRu:"Копьё Nord, усиленное эссенцией морозного огня.", imageFile:"Frostfire_Spear.png", source:item("frostfire-spear") },
    { slug:"frostfire-atgeir", type:"item", category:"weapon", en:"Frostfire Atgeir", ru:"Атгейр морозного огня", descriptionEn:"Frostfire-infused Nord Atgeir.", descriptionRu:"Атгейр Nord, усиленный эссенцией морозного огня.", imageFile:"Frostfire_Atgeir.png", source:item("frostfire-atgeir") },
    { slug:"frostfire-greatsword", type:"item", category:"weapon", en:"Frostfire Greatsword", ru:"Двуручный меч морозного огня", descriptionEn:"Frostfire-infused Nord Greatsword.", descriptionRu:"Двуручный меч Nord с морозным огнём.", imageFile:"Frostfire_Greatsword.png", source:item("frostfire-greatsword") },
    { slug:"frostfire-greataxe", type:"item", category:"weapon", en:"Frostfire Greataxe", ru:"Секира морозного огня", descriptionEn:"Frostfire-infused Nord Greataxe.", descriptionRu:"Секира Nord с морозным огнём.", imageFile:"Frostfire_Greataxe.png", source:item("frostfire-greataxe") },
    { slug:"frostfire-dagger", type:"item", category:"weapon", en:"Frostfire Dagger", ru:"Кинжал морозного огня", descriptionEn:"Frostfire-infused Nord Dagger.", descriptionRu:"Кинжал Nord с морозным огнём.", imageFile:"Frostfire_Dagger.png", source:item("frostfire-dagger") },
    { slug:"frostfire-knucklechains", type:"item", category:"weapon", en:"Frostfire Knucklechains", ru:"Кастеты морозного огня", descriptionEn:"Frostfire-infused Nord Knucklechains.", descriptionRu:"Цепные кастеты Nord с морозным огнём.", imageFile:"Frostfire_Knucklechains.png", source:item("frostfire-knucklechains") },
    { slug:"frostfire-bow", type:"item", category:"weapon", en:"Frostfire Bow", ru:"Лук морозного огня", descriptionEn:"Frostfire-infused Nord Bow.", descriptionRu:"Лук Nord с морозным огнём.", imageFile:"Frostfire_Bow.png", source:item("frostfire-bow") },
    { slug:"frostfire-crossbow", type:"item", category:"weapon", en:"Frostfire Crossbow", ru:"Арбалет морозного огня", descriptionEn:"Frostfire-infused Nord Crossbow.", descriptionRu:"Арбалет Nord с морозным огнём.", imageFile:"Frostfire_Crossbow.png", source:item("frostfire-crossbow") },
    { slug:"frostfire-sledge", type:"item", category:"weapon", en:"Frostfire Sledge", ru:"Кувалда морозного огня", descriptionEn:"Frostfire-infused Nord Sledge.", descriptionRu:"Кувалда Nord с морозным огнём.", imageFile:"Frostfire_Sledge.png", source:item("frostfire-sledge") },

    { slug:"thunderblood-sword", type:"item", category:"weapon", en:"Thunderblood Sword", ru:"Меч грозовой крови", descriptionEn:"Thunderblood-infused Nord Sword.", descriptionRu:"Меч Nord, усиленный эссенцией грозовой крови.", imageFile:"Thunderblood_Sword.png", source:item("thunderblood-sword") },
    { slug:"thunderblood-axe", type:"item", category:"weapon", en:"Thunderblood Axe", ru:"Топор грозовой крови", descriptionEn:"Thunderblood-infused Nord Axe.", descriptionRu:"Топор Nord с грозовой кровью.", imageFile:"Thunderblood_Axe.png", source:item("thunderblood-axe") },
    { slug:"thunderblood-mace", type:"item", category:"weapon", en:"Thunderblood Mace", ru:"Булава грозовой крови", descriptionEn:"Thunderblood-infused Nord Mace.", descriptionRu:"Булава Nord с грозовой кровью.", imageFile:"Thunderblood_Mace.png", source:item("thunderblood-mace") },
    { slug:"thunderblood-spear", type:"item", category:"weapon", en:"Thunderblood Spear", ru:"Копьё грозовой крови", descriptionEn:"Thunderblood-infused Nord Spear.", descriptionRu:"Копьё Nord с грозовой кровью.", imageFile:"Thunderblood_Spear.png", source:item("thunderblood-spear") },
    { slug:"thunderblood-atgeir", type:"item", category:"weapon", en:"Thunderblood Atgeir", ru:"Атгейр грозовой крови", descriptionEn:"Thunderblood-infused Nord Atgeir.", descriptionRu:"Атгейр Nord с грозовой кровью.", imageFile:"Thunderblood_Atgeir.png", source:item("thunderblood-atgeir") },
    { slug:"thunderblood-greatsword", type:"item", category:"weapon", en:"Thunderblood Greatsword", ru:"Двуручный меч грозовой крови", descriptionEn:"Thunderblood-infused Nord Greatsword.", descriptionRu:"Двуручный меч Nord с грозовой кровью.", imageFile:"Thunderblood_Greatsword.png", source:item("thunderblood-greatsword") },
    { slug:"thunderblood-greataxe", type:"item", category:"weapon", en:"Thunderblood Greataxe", ru:"Секира грозовой крови", descriptionEn:"Thunderblood-infused Nord Greataxe.", descriptionRu:"Секира Nord с грозовой кровью.", imageFile:"Thunderblood_Greataxe.png", source:item("thunderblood-greataxe") },
    { slug:"thunderblood-dagger", type:"item", category:"weapon", en:"Thunderblood Dagger", ru:"Кинжал грозовой крови", descriptionEn:"Thunderblood-infused Nord Dagger.", descriptionRu:"Кинжал Nord с грозовой кровью.", imageFile:"Thunderblood_Dagger.png", source:item("thunderblood-dagger") },
    { slug:"thunderblood-knucklechains", type:"item", category:"weapon", en:"Thunderblood Knucklechains", ru:"Кастеты грозовой крови", descriptionEn:"Thunderblood-infused Nord Knucklechains.", descriptionRu:"Цепные кастеты Nord с грозовой кровью.", imageFile:"Thunderblood_Knucklechains.png", source:item("thunderblood-knucklechains") },
    { slug:"thunderblood-bow", type:"item", category:"weapon", en:"Thunderblood Bow", ru:"Лук грозовой крови", descriptionEn:"Thunderblood-infused Nord Bow.", descriptionRu:"Лук Nord с грозовой кровью.", imageFile:"Thunderblood_Bow.png", source:item("thunderblood-bow") },
    { slug:"thunderblood-crossbow", type:"item", category:"weapon", en:"Thunderblood Crossbow", ru:"Арбалет грозовой крови", descriptionEn:"Thunderblood-infused Nord Crossbow.", descriptionRu:"Арбалет Nord с грозовой кровью.", imageFile:"Thunderblood_Crossbow.png", source:item("thunderblood-crossbow") },
    { slug:"thunderblood-sledge", type:"item", category:"weapon", en:"Thunderblood Sledge", ru:"Кувалда грозовой крови", descriptionEn:"Thunderblood-infused Nord Sledge.", descriptionRu:"Кувалда Nord с грозовой кровью.", imageFile:"Thunderblood_Sledge.png", source:item("thunderblood-sledge") },

    { slug:"nord-shield", type:"item", category:"weapon", en:"Nord Shield", ru:"Щит Nord", descriptionEn:"A high-tier northern round shield.", descriptionRu:"Поздний северный круглый щит.", imageFile:"Nord_Shield.png", source:item("nord-shield") },
    { slug:"nord-greatshield", type:"item", category:"weapon", en:"Nord Greatshield", ru:"Большой щит Nord", descriptionEn:"A massive northern shield with extreme block.", descriptionRu:"Массивный северный щит с огромной силой блока.", imageFile:"Nord_Greatshield.png", source:item("nord-greatshield") },
    { slug:"nord-buckler", type:"item", category:"weapon", en:"Nord Buckler", ru:"Баклер Nord", descriptionEn:"A northern buckler designed for parrying.", descriptionRu:"Северный баклер для парирования.", imageFile:"Nord_Buckler.png", source:item("nord-buckler") },

    { slug:"lightning-strike", type:"item", category:"magic", en:"Lightning Strike", ru:"Удар молнии", descriptionEn:"An elemental staff that calls down lightning.", descriptionRu:"Стихийный посох, вызывающий удар молнии.", imageFile:"Lightning_Strike.png", source:item("lightning-strike") },
    { slug:"echo-spike", type:"item", category:"magic", en:"Echo Spike", ru:"Эхо-шип", descriptionEn:"A Deep North magical weapon forged from a unique mould.", descriptionRu:"Магическое оружие Глубокого Севера из уникальной формы.", imageFile:"Echo_Spike.png", source:item("echo-spike") },
    { slug:"northern-vengeance", type:"item", category:"magic", en:"Northern Vengeance", ru:"Северная месть", descriptionEn:"A frost magic weapon hardened in the Frost Foundry.", descriptionRu:"Магическое морозное оружие, закалённое в Морозной литейной.", imageFile:"Northern_Vengeance.png", source:item("northern-vengeance") },
    { slug:"spirit-caller", type:"item", category:"magic", en:"Spirit Caller", ru:"Призыватель духов", descriptionEn:"A magical staff built around Moose and Norn materials.", descriptionRu:"Магический посох из материалов лося и Норн.", imageFile:"Spirit_Caller.png", source:item("spirit-caller") },
    { slug:"voidcaller", type:"item", category:"magic", en:"Voidcaller", ru:"Зов Пустоты", descriptionEn:"A Deep North blood-magic weapon.", descriptionRu:"Оружие кровавой магии Глубокого Севера.", imageFile:"Voidcaller.png", source:item("voidcaller") },
    { slug:"ember-charge-x10", type:"item", category:"weapon", en:"Ember Charge ×10", ru:"Угольный заряд ×10", descriptionEn:"Ten charges used to crack petrified northern remains.", descriptionRu:"Десять зарядов для разрушения окаменевших северных останков.", imageFile:"Ember_Charge.png", source:item("ember-charge") },
    { slug:"snowball", type:"item", category:"weapon", en:"Snowball", ru:"Снежок", descriptionEn:"A throwable ball of snow and ice.", descriptionRu:"Метательный снежок.", imageFile:"Snowball.png", source:item("snowball") },
    { slug:"blob-bomb-pulp", type:"item", category:"weapon", en:"Blob Bomb: Pulp", ru:"Бомба с мякотью", descriptionEn:"A Deep North pulp bomb.", descriptionRu:"Бомба из северной живой мякоти.", imageFile:"Blob_Bomb_Pulp.png", source:item("blob-bomb-pulp") },

    { slug:"helmet-of-the-protector", type:"item", category:"armor", en:"Helmet of the Protector", ru:"Шлем Защитника", descriptionEn:"Heavy endgame helmet of the Protector set.", descriptionRu:"Тяжёлый шлем финального комплекта Защитника.", imageFile:"Helmet_of_the_Protector.png", source:item("helmet-of-the-protector") },
    { slug:"breastplate-of-the-protector", type:"item", category:"armor", en:"Breastplate of the Protector", ru:"Нагрудник Защитника", descriptionEn:"Heavy endgame chest armour.", descriptionRu:"Тяжёлая финальная броня корпуса.", imageFile:"Breastplate_of_the_Protector.png", source:item("breastplate-of-the-protector") },
    { slug:"trousers-of-the-protector", type:"item", category:"armor", en:"Trousers of the Protector", ru:"Штаны Защитника", descriptionEn:"Heavy endgame leg armour.", descriptionRu:"Тяжёлая финальная защита ног.", imageFile:"Trousers_of_the_Protector.png", source:item("trousers-of-the-protector") },
    { slug:"hood-of-the-vanguard", type:"item", category:"armor", en:"Hood of the Vanguard", ru:"Капюшон Авангарда", descriptionEn:"Medium Deep North armour.", descriptionRu:"Средняя броня Глубокого Севера.", imageFile:"Hood_of_the_Vanguard.png", source:item("hood-of-the-vanguard") },
    { slug:"chestpiece-of-the-vanguard", type:"item", category:"armor", en:"Chestpiece of the Vanguard", ru:"Нагрудник Авангарда", descriptionEn:"Medium Deep North body armour.", descriptionRu:"Средняя броня корпуса Глубокого Севера.", imageFile:"Chestpiece_of_the_Vanguard.png", source:item("chestpiece-of-the-vanguard") },
    { slug:"trousers-of-the-vanguard", type:"item", category:"armor", en:"Trousers of the Vanguard", ru:"Штаны Авангарда", descriptionEn:"Medium Deep North leg armour.", descriptionRu:"Средняя защита ног Глубокого Севера.", imageFile:"Trousers_of_the_Vanguard.png", source:item("trousers-of-the-vanguard") },
    { slug:"headdress-of-the-caller", type:"item", category:"armor", en:"Headdress of the Caller", ru:"Головной убор Призывателя", descriptionEn:"Deep North mage headwear.", descriptionRu:"Магический головной убор Глубокого Севера.", imageFile:"Headdress_of_the_Caller.png", source:item("headdress-of-the-caller") },
    { slug:"robes-of-the-caller", type:"item", category:"armor", en:"Robes of the Caller", ru:"Одеяния Призывателя", descriptionEn:"Deep North mage body armour.", descriptionRu:"Магическая броня корпуса Глубокого Севера.", imageFile:"Robes_of_the_Caller.png", source:item("robes-of-the-caller") },
    { slug:"trousers-of-the-caller", type:"item", category:"armor", en:"Trousers of the Caller", ru:"Штаны Призывателя", descriptionEn:"Deep North mage leg armour.", descriptionRu:"Магическая защита ног Глубокого Севера.", imageFile:"Trousers_of_the_Caller.png", source:item("trousers-of-the-caller") },
    { slug:"cape-of-the-caller", type:"item", category:"armor", en:"Cape of the Caller", ru:"Плащ Призывателя", descriptionEn:"A mage cape with frost resistance and eitr regeneration.", descriptionRu:"Магический плащ с сопротивлением морозу и регенерацией эйтра.", imageFile:"Cape_of_the_Caller.png", source:item("cape-of-the-caller") },
    { slug:"moose-hide-cape", type:"item", category:"armor", en:"Moose Hide Cape", ru:"Плащ из шкуры лося", descriptionEn:"A warm combat cape made from Moose Hide.", descriptionRu:"Тёплый боевой плащ из лосиной шкуры.", imageFile:"Moose_Hide_Cape.png", source:item("moose-hide-cape") },
    { slug:"crown-of-valheim", type:"item", category:"armor", en:"Crown of Valheim", ru:"Корона Вальхейма", descriptionEn:"The final crown forged after Kall.", descriptionRu:"Финальная корона, создаваемая после Калла.", imageFile:"Crown_of_Valheim.png", source:item("crown-of-valheim") },

    { slug:"neckstabber", type:"item", category:"trinket", en:"Neckstabber", ru:"Шейный коготь", descriptionEn:"A Deep North health trinket.", descriptionRu:"Северный оберег здоровья.", imageFile:"Neckstabber.png", source:item("neckstabber") },
    { slug:"witch-crown", type:"item", category:"trinket", en:"Witch Crown", ru:"Ведьмин венец", descriptionEn:"A Deep North stamina trinket.", descriptionRu:"Северный оберег выносливости.", imageFile:"Witch_Crown.png", source:item("witch-crown") },

    { slug:"fish-soup", type:"item", category:"food", en:"Fish Soup", ru:"Рыбный суп", descriptionEn:"A high-eitr northern fish soup.", descriptionRu:"Северный рыбный суп с высоким эйтром.", imageFile:"Fish_Soup.png", source:item("fish-soup") },
    { slug:"lingonberry-juice", type:"item", category:"food", en:"Lingonberry Juice", ru:"Брусничный сок", descriptionEn:"A stamina drink made from lingonberries and ice.", descriptionRu:"Напиток на выносливость из брусники и льда.", imageFile:"Lingonberry_Juice.png", source:item("lingonberry-juice") },
    { slug:"meat-in-bread", type:"item", category:"food", en:"Meat In Bread", ru:"Мясо в хлебе", descriptionEn:"A high-health Moose meal.", descriptionRu:"Сытное блюдо с лосиным мясом.", imageFile:"Meat_In_Bread.png", source:item("meat-in-bread") },
    { slug:"meatballs-and-poteitr", type:"item", category:"food", en:"Meatballs and Poteitr", ru:"Фрикадельки с Потейтером", descriptionEn:"A Deep North eitr meal.", descriptionRu:"Северное блюдо на эйтр.", imageFile:"Meatballs_and_Poteitr.png", source:item("meatballs-and-poteitr") },
    { slug:"oat-milk", type:"item", category:"food", en:"Oat Milk", ru:"Овсяное молоко", descriptionEn:"A high-stamina northern drink.", descriptionRu:"Северный напиток на выносливость.", imageFile:"Oat_Milk.png", source:item("oat-milk") },
    { slug:"oatmeal", type:"item", category:"food", en:"Oatmeal", ru:"Овсянка", descriptionEn:"A hybrid stamina and eitr food.", descriptionRu:"Еда одновременно на выносливость и эйтр.", imageFile:"Oatmeal.png", source:item("oatmeal") },
    { slug:"pancakes", type:"item", category:"food", en:"Pancakes", ru:"Блины", descriptionEn:"A high-stamina northern food.", descriptionRu:"Северная еда на выносливость.", imageFile:"Pancakes.png", source:item("pancakes") },
    { slug:"seal-meat-soup", type:"item", category:"food", en:"Seal Meat Soup", ru:"Суп из тюленя", descriptionEn:"A high-health northern soup.", descriptionRu:"Северный суп на здоровье.", imageFile:"Seal_Meat_Soup.png", source:item("seal-meat-soup") },
    { slug:"smoked-fish", type:"item", category:"food", en:"Smoked Fish", ru:"Копчёная рыба", descriptionEn:"A smoked northern fish meal.", descriptionRu:"Копчёное северное рыбное блюдо.", imageFile:"Smoked_Fish.png", source:item("smoked-fish") },
    { slug:"smoked-moose-meat", type:"item", category:"food", en:"Smoked Moose Meat", ru:"Копчёное мясо лося", descriptionEn:"A high-health Moose dish.", descriptionRu:"Сытное блюдо из лосятины.", imageFile:"Smoked_Moose_Meat.png", source:item("smoked-moose-meat") },
    { slug:"cooked-moose-meat", type:"item", category:"food", en:"Cooked Moose Meat", ru:"Жареное мясо лося", descriptionEn:"Moose meat cooked on an iron cooking station.", descriptionRu:"Лосиное мясо, приготовленное на железной стойке.", imageFile:"Cooked_Moose_Meat.png", source:item("cooked-moose-meat") },

    { slug:"snow-shovel", type:"item", category:"tool", en:"Snow Shovel", ru:"Снежная лопата", descriptionEn:"A tool for clearing Deep North snow.", descriptionRu:"Инструмент для расчистки глубокого снега.", imageFile:"Snow_Shovel.png", source:item("snow-shovel") },
    { slug:"moose-saddle", type:"item", category:"tool", en:"Moose Saddle", ru:"Седло для лося", descriptionEn:"A saddle for riding a tamed Moose.", descriptionRu:"Седло для езды на прирученном лосе.", imageFile:"Moose_Saddle.png", source:item("moose-saddle") },
    { slug:"eternal-pyre", type:"item", category:"building", en:"Eternal Pyre", ru:"Вечный костёр", descriptionEn:"A Fader-powered pyre that attracts Embers.", descriptionRu:"Костёр Фейдера, притягивающий угли.", imageFile:"Eternal_Pyre.png", source:building("eternal-pyre") },
    { slug:"frigid-kiln", type:"item", category:"building", en:"Frigid Kiln", ru:"Морозная печь", descriptionEn:"Processes Ice into Liquid Frost.", descriptionRu:"Перерабатывает лёд в жидкий мороз.", imageFile:"Frigid_Kiln.png", source:building("frigid-kiln") },
    { slug:"frost-foundry", type:"item", category:"building", en:"Frost Foundry", ru:"Морозная литейная", descriptionEn:"Hardens Deep North casts using Liquid Frost.", descriptionRu:"Закаляет северные отливки при помощи жидкого мороза.", imageFile:"Frost_Foundry.png", source:building("frost-foundry") }
  ],
  recipes: [
    { item:"bloodgold", station:"blast-furnace", ingredients:[["petrified-tissue",1]] },
    { item:"liquid-frost", station:"frigid-kiln", ingredients:[["ice",5]] },
    { item:"oat-flour", station:"windmill", ingredients:[["oats",1]] },
    { item:"ember-charge-x10", station:"workbench", output:10, ingredients:[["seal-pelt",2],["embers",1]] },
    { item:"snowball", station:"inventory", ingredients:[["ice",5]] },
    { item:"snow-shovel", station:"black-forge", level:3, ingredients:[["finewood",5],["flametal",4],["embers",2]] },
    { item:"moose-saddle", station:"black-forge", level:2, ingredients:[["bloodgold",4],["seal-pelt",5],["timberwood",5],["linen-thread",15]] },
    { item:"eternal-pyre", station:"stonecutter", ingredients:[["stone",10],["kindled-ribs",1]] },

    { item:"neckstabber", station:"black-forge", ingredients:[["bloodgold",5],["long-claws",5],["moose-trophy",1]] },
    { item:"witch-crown", station:"black-forge", ingredients:[["bloodgold",5],["nornathread",5],["hexen-trophy",1]] },

    { item:"fish-soup", station:"cauldron", level:7, ingredients:[["raw-fish",3],["kale",2],["ice",2]] },
    { item:"lingonberry-juice", station:"cauldron", level:6, ingredients:[["lingonberries",5],["ice",5]] },
    { item:"meat-in-bread", station:"cauldron", level:7, output:2, ingredients:[["moose-meat",1],["kale",2],["oat-flour",1],["lingonberries",2]] },
    { item:"meatballs-and-poteitr", station:"cauldron", level:7, ingredients:[["moose-meat",1],["lingonberries",2],["poteitr",2]] },
    { item:"oat-milk", station:"mead-ketill", ingredients:[["oats",5],["ice",5]] },
    { item:"oatmeal", station:"cauldron", level:6, ingredients:[["oats",2],["lingonberries",2],["oat-milk",1]] },
    { item:"pancakes", station:"cauldron", level:6, output:3, ingredients:[["oat-milk",1],["oat-flour",2],["egg",2],["blueberries",2]] },
    { item:"seal-meat-soup", station:"cauldron", level:7, ingredients:[["seal-blubber",2],["kale",2],["ice",2]] },
    { item:"smoked-moose-meat", station:"cauldron", level:7, ingredients:[["moose-meat",1],["kale",2]] },
    { item:"cooked-moose-meat", station:"iron-cooking-station", ingredients:[["moose-meat",1]] },

    { item:"cape-of-the-caller", station:"galdr-table", level:4, ingredients:[["seal-pelt",6],["nornathread",2],["bloodgold",5],["refined-eitr",15]] },
    { item:"moose-hide-cape", station:"black-forge", level:4, ingredients:[["moose-hide",6],["moose-sinew",2],["bloodgold",5]] }
  ],
  upgrades: [
    { item:"snow-shovel", level:2, stationLevel:4, ingredients:[["finewood",1],["flametal",10]] },
    { item:"snow-shovel", level:3, stationLevel:5, ingredients:[["finewood",2],["flametal",20]] },
    { item:"cape-of-the-caller", level:2, stationLevel:5, ingredients:[["seal-pelt",3],["nornathread",1],["bloodgold",2],["refined-eitr",5]] },
    { item:"cape-of-the-caller", level:3, stationLevel:6, ingredients:[["seal-pelt",6],["nornathread",2],["bloodgold",4],["refined-eitr",10]] },
    { item:"cape-of-the-caller", level:4, stationLevel:7, ingredients:[["seal-pelt",12],["nornathread",4],["bloodgold",8],["refined-eitr",20]] },
    { item:"moose-hide-cape", level:2, stationLevel:5, ingredients:[["moose-hide",3],["moose-sinew",1],["bloodgold",2]] },
    { item:"moose-hide-cape", level:3, stationLevel:6, ingredients:[["moose-hide",6],["moose-sinew",2],["bloodgold",4]] },
    { item:"moose-hide-cape", level:4, stationLevel:7, ingredients:[["moose-hide",12],["moose-sinew",4],["bloodgold",8]] }
  ],
  stats: [
    ["nord-sword","slash_damage","170"],["nord-axe","slash_damage","176"],["nord-axe","chop","90"],
    ["nord-mace","blunt_damage","170"],["nord-spear","pierce_damage","170"],["nord-atgeir","pierce_damage","182"],
    ["nord-greatsword","slash_damage","210"],["nord-greataxe","slash_damage","188"],["nord-dagger","slash_damage","75"],["nord-dagger","pierce_damage","75"],
    ["nord-knucklechains","blunt_damage","114"],["nord-bow","pierce_damage","100"],["nord-crossbow","pierce_damage","264"],["nord-sledge","blunt_damage","225"],
    ["nord-shield","block_armor","132"],["nord-greatshield","block_armor","158"],["nord-buckler","block_armor","88"],
    ["lightning-strike","lightning_damage","300"],

    ["helmet-of-the-protector","armor","44"],["breastplate-of-the-protector","armor","44"],["trousers-of-the-protector","armor","44"],
    ["hood-of-the-vanguard","armor","34"],["chestpiece-of-the-vanguard","armor","34"],["trousers-of-the-vanguard","armor","34"],
    ["headdress-of-the-caller","armor","22"],["robes-of-the-caller","armor","22"],["trousers-of-the-caller","armor","22"],
    ["cape-of-the-caller","armor","12"],["moose-hide-cape","armor","12"],["crown-of-valheim","armor","50"],

    ["neckstabber","adrenaline","65"],["witch-crown","adrenaline","60"],
    ["fish-soup","health","37"],["fish-soup","stamina","18"],["fish-soup","eitr","105"],["fish-soup","duration","30","min"],["fish-soup","healing","5","hp/tick"],
    ["lingonberry-juice","health","35"],["lingonberry-juice","stamina","105"],["lingonberry-juice","duration","25","min"],["lingonberry-juice","healing","5","hp/tick"],
    ["meat-in-bread","health","110"],["meat-in-bread","stamina","37"],["meat-in-bread","duration","30","min"],["meat-in-bread","healing","7","hp/tick"],
    ["meatballs-and-poteitr","health","35"],["meatballs-and-poteitr","stamina","18"],["meatballs-and-poteitr","eitr","105"],["meatballs-and-poteitr","duration","25","min"],["meatballs-and-poteitr","healing","5","hp/tick"],
    ["oat-milk","health","37"],["oat-milk","stamina","110"],["oat-milk","duration","25","min"],["oat-milk","healing","5","hp/tick"],
    ["oatmeal","health","39"],["oatmeal","stamina","115"],["oatmeal","eitr","85"],["oatmeal","duration","30","min"],["oatmeal","healing","5","hp/tick"],
    ["pancakes","health","39"],["pancakes","stamina","115"],["pancakes","duration","30","min"],["pancakes","healing","5","hp/tick"],
    ["seal-meat-soup","health","110"],["seal-meat-soup","stamina","37"],["seal-meat-soup","duration","30","min"],["seal-meat-soup","healing","7","hp/tick"],
    ["smoked-moose-meat","health","105"],["smoked-moose-meat","stamina","35"],["smoked-moose-meat","duration","25","min"],["smoked-moose-meat","healing","7","hp/tick"],
    ["cooked-moose-meat","health","80"],["cooked-moose-meat","stamina","27"],["cooked-moose-meat","duration","20","min"],["cooked-moose-meat","healing","7","hp/tick"]
  ],
  resourceSources: [
    ["embers","Gather beside an Eternal Pyre built after defeating Fader.","Собирается у Вечного костра после победы над Фейдером.",item("embers")],
    ["petrified-tissue","Mine petrified Gammeltroll remains in the Deep North.","Добывается из окаменевших останков гаммельтроллей.",item("petrified-tissue")],
    ["bloodgold","Smelt Petrified Tissue in a Blast Furnace.","Переплавьте окаменевшую ткань в доменной печи.",item("bloodgold")],
    ["ice","Break Deep North ice shards and frozen remains.","Добывается из ледяных осколков и замёрзших останков.",item("ice")],
    ["liquid-frost","Process five Ice in a Frigid Kiln.","Переработайте пять единиц льда в Морозной печи.",item("liquid-frost")],
    ["timberwood","Harvest Deep North trees and fallen branches.","Рубите северные деревья и собирайте упавшие ветви.",item("timberwood")],
    ["moose-hide","Dropped by Moose.","Выпадает с лосей.",item("moose-hide")],
    ["moose-meat","Dropped by Moose.","Выпадает с лосей.",item("moose-meat")],
    ["moose-sinew","Dropped by Moose.","Выпадает с лосей.",item("moose-sinew")],
    ["seal-pelt","Dropped by Seals.","Выпадает с тюленей.",item("seal-pelt")],
    ["seal-blubber","Dropped by Seals.","Выпадает с тюленей.",item("seal-blubber")],
    ["frostfire-essence","Dropped only by Fallen Warriors at North Memorial Places.","Выпадает только из Павших воинов у Северных мемориалов.",item("frostfire-essence")],
    ["thunderblood-essence","Dropped only by Fallen Warriors at North Memorial Places.","Выпадает только из Павших воинов у Северных мемориалов.",item("thunderblood-essence")],
    ["bloodgold-battle-idol","Rare Deep North treasure used at the Forge of Potential.","Редкая добыча Глубокого Севера для Кузницы потенциала.",item("bloodgold-battle-idol")],
    ["bloodgold-protection-idol","Rare Deep North treasure used at the Forge of Potential.","Редкая добыча Глубокого Севера для Кузницы потенциала.",item("bloodgold-protection-idol")]
  ]
};

const baseWeaponSlugs = [
  "sword","axe","mace","spear","atgeir","greatsword","greataxe","dagger","knucklechains","bow","crossbow","sledge"
] as const;

for (const name of baseWeaponSlugs) {
  deepNorthSeed.recipes!.push({
    item: `nord-${name}`,
    station: "black-forge",
    level: 4,
    ingredients: [
      ["bloodgold",20],
      [name === "greatsword" ? "frozen-branch" : "timberwood", name === "greatsword" ? 2 : 10],
      [`mould-nord-${name}`,1]
    ]
  });
  deepNorthSeed.recipes!.push({
    item: `frostfire-${name}`,
    station: "black-forge",
    level: 4,
    ingredients: [[`nord-${name}`,1],["bloodgold",20],["frostfire-essence",1]]
  });
  deepNorthSeed.recipes!.push({
    item: `thunderblood-${name}`,
    station: "black-forge",
    level: 4,
    ingredients: [[`nord-${name}`,1],["bloodgold",20],["thunderblood-essence",1]]
  });

  deepNorthSeed.upgrades!.push(
    { item:`nord-${name}`, level:2, stationLevel:5, ingredients:[["bloodgold",10],[name === "greatsword" ? "frozen-branch" : "timberwood", name === "greatsword" ? 1 : 5]] },
    { item:`nord-${name}`, level:3, stationLevel:6, ingredients:[["bloodgold",20],[name === "greatsword" ? "frozen-branch" : "timberwood", name === "greatsword" ? 2 : 10]] },
    { item:`nord-${name}`, level:4, stationLevel:7, ingredients:[["bloodgold",40],[name === "greatsword" ? "frozen-branch" : "timberwood", name === "greatsword" ? 4 : 20]] },
    { item:`frostfire-${name}`, level:2, stationLevel:5, ingredients:[["bloodgold",10],["frostfire-essence",1]] },
    { item:`frostfire-${name}`, level:3, stationLevel:6, ingredients:[["bloodgold",20],["frostfire-essence",2]] },
    { item:`frostfire-${name}`, level:4, stationLevel:7, ingredients:[["bloodgold",40],["frostfire-essence",4]] },
    { item:`thunderblood-${name}`, level:2, stationLevel:5, ingredients:[["bloodgold",10],["thunderblood-essence",1]] },
    { item:`thunderblood-${name}`, level:3, stationLevel:6, ingredients:[["bloodgold",20],["thunderblood-essence",2]] },
    { item:`thunderblood-${name}`, level:4, stationLevel:7, ingredients:[["bloodgold",40],["thunderblood-essence",4]] }
  );
}

export const ensureDeepNorthCatalog = (env: Env): Promise<void> => applyCatalogSeed(env, deepNorthSeed);
