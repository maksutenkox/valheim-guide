import type { Env } from "../env";

type CatalogItem = {
  slug: string;
  type: "item" | "resource";
  category: string;
  en: string;
  ru: string;
  descriptionEn: string;
  descriptionRu: string;
  image?: string;
  source: string;
  sourceName?: string;
  biome?: "black-forest" | "meadows" | "ocean";
};

type Recipe = {
  item: string;
  station: string;
  level?: number;
  ingredients: Array<[string, number]>;
};

type Upgrade = {
  item: string;
  level: number;
  stationLevel: number;
  ingredients: Array<[string, number]>;
};

const wiki = (page: string) => `https://valheim.fandom.com/wiki/${page}`;
const icon = (file: string) => `https://valheim.fandom.com/wiki/Special:Redirect/file/${file}`;
const sourceLabel = (item: CatalogItem): string =>
  item.sourceName ?? (item.source.includes("valheim.tools") ? "Valheim.tools" : "Valheim Wiki (Fandom)");

const items: CatalogItem[] = [
  { slug: "copper-ore", type: "resource", category: "material", en: "Copper ore", ru: "Медная руда", descriptionEn: "Ore mined from copper deposits in the Black Forest.", descriptionRu: "Руда, добываемая из залежей меди в Чёрном лесу.", image: icon("Copper_ore.png"), source: wiki("Copper_ore") },
  { slug: "tin-ore", type: "resource", category: "material", en: "Tin ore", ru: "Оловянная руда", descriptionEn: "Ore found in small deposits near Black Forest shorelines.", descriptionRu: "Руда из небольших залежей у воды в Чёрном лесу.", image: icon("Tin_ore.png"), source: wiki("Tin_ore") },
  { slug: "copper", type: "resource", category: "material", en: "Copper", ru: "Медь", descriptionEn: "Copper ingot smelted from copper ore.", descriptionRu: "Слиток меди, выплавляемый из медной руды.", image: icon("Copper.png"), source: wiki("Copper") },
  { slug: "tin", type: "resource", category: "material", en: "Tin", ru: "Олово", descriptionEn: "Tin ingot smelted from tin ore.", descriptionRu: "Слиток олова, выплавляемый из оловянной руды.", image: icon("Tin.png"), source: wiki("Tin") },
  { slug: "bronze", type: "resource", category: "material", en: "Bronze", ru: "Бронза", descriptionEn: "An alloy forged from two copper and one tin.", descriptionRu: "Сплав, создаваемый из двух единиц меди и одной единицы олова.", image: icon("Bronze.png"), source: wiki("Bronze") },
  { slug: "bronze-nails", type: "resource", category: "material", en: "Bronze nails", ru: "Бронзовые гвозди", descriptionEn: "Twenty bronze nails are forged from one bronze ingot.", descriptionRu: "Из одного слитка бронзы создаётся 20 бронзовых гвоздей.", image: icon("Bronze_nails.png"), source: wiki("Bronze_nails") },
  { slug: "greydwarf-eye", type: "resource", category: "material", en: "Greydwarf eye", ru: "Глаз грейдворфа", descriptionEn: "A glowing eye dropped by Greydwarfs.", descriptionRu: "Светящийся глаз, выпадающий из грейдворфов.", image: icon("Greydwarf_eye.png"), source: wiki("Greydwarf_eye") },
  { slug: "surtling-core", type: "resource", category: "material", en: "Surtling core", ru: "Ядро суртлинга", descriptionEn: "A fiery core commonly found inside Burial Chambers.", descriptionRu: "Огненное ядро, которое часто встречается в Погребальных комнатах.", image: icon("Surtling_core.png"), source: wiki("Surtling_core") },
  { slug: "ancient-seed", type: "resource", category: "material", en: "Ancient seed", ru: "Древнее семя", descriptionEn: "A Black Forest boss-summoning item found from Greydwarfs and their nests.", descriptionRu: "Предмет Чёрного леса для призыва босса, добываемый у грейдворфов и их гнёзд.", image: icon("Ancient_seed.png"), source: wiki("Ancient_seed") },
  { slug: "troll-hide", type: "resource", category: "material", en: "Troll hide", ru: "Шкура тролля", descriptionEn: "A thick blue hide taken from Trolls.", descriptionRu: "Толстая синяя шкура, добываемая с троллей.", image: icon("Troll_hide.png"), source: wiki("Troll_hide") },
  { slug: "blueberries", type: "resource", category: "material", en: "Blueberries", ru: "Черника", descriptionEn: "Berries gathered from bushes in the Black Forest.", descriptionRu: "Ягоды, собираемые с кустов в Чёрном лесу.", image: icon("Blueberries.png"), source: wiki("Blueberries") },
  { slug: "thistle", type: "resource", category: "material", en: "Thistle", ru: "Чертополох", descriptionEn: "A glowing plant found in dark forest terrain.", descriptionRu: "Светящееся растение, встречающееся в тёмных лесах.", image: icon("Thistle.png"), source: wiki("Thistle") },
  { slug: "yellow-mushroom", type: "resource", category: "material", en: "Yellow mushroom", ru: "Жёлтый гриб", descriptionEn: "A glowing mushroom found in Burial Chambers and caves.", descriptionRu: "Светящийся гриб из Погребальных комнат и пещер.", image: icon("Yellow_mushroom.png"), source: wiki("Yellow_mushroom") },
  { slug: "carrot-seeds", type: "resource", category: "material", en: "Carrot seeds", ru: "Семена моркови", descriptionEn: "Seeds gathered from white flowers in the Black Forest.", descriptionRu: "Семена из белых цветков, встречающихся в Чёрном лесу.", image: icon("Carrot_seeds.png"), source: wiki("Carrot_seeds") },
  { slug: "carrot", type: "resource", category: "material", en: "Carrot", ru: "Морковь", descriptionEn: "A farm crop grown from carrot seeds.", descriptionRu: "Культура, выращиваемая из семян моркови.", image: icon("Carrot.png"), source: wiki("Carrot") },
  { slug: "bear-hide", type: "resource", category: "material", en: "Bear hide", ru: "Шкура медведя", descriptionEn: "A sturdy hide dropped by Bears in the Black Forest.", descriptionRu: "Прочная шкура, выпадающая с медведей в Чёрном лесу.", image: icon("Bear_hide.png"), source: wiki("Bear_hide") },
  { slug: "bear-paw", type: "resource", category: "material", en: "Bear paw", ru: "Медвежья лапа", descriptionEn: "A clawed paw dropped by Bears.", descriptionRu: "Когтистая лапа, выпадающая с медведей.", image: icon("Bear_paw.png"), source: wiki("Bear_paw") },
  { slug: "bear-trophy", type: "resource", category: "material", en: "Bear trophy", ru: "Трофей: медведь", descriptionEn: "A rare trophy from a Bear.", descriptionRu: "Редкий трофей с медведя.", image: icon("Bear_trophy.png"), source: wiki("Bear") },
  { slug: "greydwarf-shaman-trophy", type: "resource", category: "material", en: "Greydwarf Shaman trophy", ru: "Трофей: грейдворф-шаман", descriptionEn: "A trophy taken from a Greydwarf Shaman.", descriptionRu: "Трофей, добываемый с грейдворфа-шамана.", image: icon("Greydwarf_Shaman_trophy.png"), source: wiki("Greydwarf_Shaman") },
  { slug: "ruby", type: "resource", category: "material", en: "Ruby", ru: "Рубин", descriptionEn: "A valuable gem found as dungeon treasure.", descriptionRu: "Ценный камень, встречающийся среди сокровищ подземелий.", image: icon("Ruby.png"), source: wiki("Ruby") },
  { slug: "coal", type: "resource", category: "material", en: "Coal", ru: "Уголь", descriptionEn: "Fuel produced in a charcoal kiln or by overcooking food.", descriptionRu: "Топливо из углевыжигательной печи или пережаренной еды.", image: icon("Coal.png"), source: wiki("Coal") },
  { slug: "skeleton-trophy", type: "resource", category: "material", en: "Skeleton trophy", ru: "Трофей: скелет", descriptionEn: "A trophy dropped by Skeletons in Burial Chambers.", descriptionRu: "Трофей, выпадающий со скелетов в Погребальных комнатах.", image: icon("Skeleton_trophy.png"), source: wiki("Skeleton") },
  { slug: "bronze-battle-idol", type: "resource", category: "material", en: "Bronze Battle Idol", ru: "Бронзовый боевой идол", descriptionEn: "A rare Black Forest chest item used at the Forge of Potential to push weapons beyond their normal quality cap.", descriptionRu: "Редкая добыча из сундуков Чёрного леса для улучшения оружия сверх обычного предела в Кузнице потенциала.", image: icon("Bronze_Battle_Idol.png"), source: "https://www.valheim.tools/items/bronze-battle-idol/" },
  { slug: "bronze-protection-idol", type: "resource", category: "material", en: "Bronze Protection Idol", ru: "Бронзовый защитный идол", descriptionEn: "A rare Black Forest chest item used at the Forge of Potential to push armour beyond their normal quality cap.", descriptionRu: "Редкая добыча из сундуков Чёрного леса для улучшения брони сверх обычного предела в Кузнице потенциала.", image: icon("Bronze_Protection_Idol.png"), source: "https://www.valheim.tools/items/bronze-protection-idol/" },
  { slug: "bear-meat", type: "resource", category: "material", en: "Bear meat", ru: "Медвежье мясо", descriptionEn: "Raw meat dropped by Bears in the Black Forest.", descriptionRu: "Сырое мясо, выпадающее с медведей в Чёрном лесу.", image: icon("Bear_meat.png"), source: "https://www.valheim.tools/items/bear-meat" },
  { slug: "ectoplasm", type: "resource", category: "material", en: "Ectoplasm", ru: "Эктоплазма", descriptionEn: "A spectral material dropped by Ghosts and used for combat-practice structures.", descriptionRu: "Призрачный материал, добываемый с призраков и используемый для тренировочных построек.", image: icon("Ectoplasm.png"), source: "https://www.valheim.tools/updates/0-221-4", sourceName: "Valheim.tools — 0.221.4 patch data" },
  { slug: "chitin", type: "resource", category: "material", en: "Chitin", ru: "Хитин", descriptionEn: "A hard ocean material mined from Leviathan barnacles.", descriptionRu: "Твёрдый материал из океана, добываемый с наростов левиафанов.", image: icon("Chitin.png"), source: wiki("Chitin"), biome: "ocean" },

  { slug: "mushroom", type: "resource", category: "material", en: "Mushroom", ru: "Гриб", descriptionEn: "A common edible mushroom.", descriptionRu: "Обычный съедобный гриб.", image: icon("Mushroom.png"), source: wiki("Mushroom"), biome: "meadows" },
  { slug: "raspberries", type: "resource", category: "material", en: "Raspberries", ru: "Малина", descriptionEn: "Berries gathered in the Meadows.", descriptionRu: "Ягоды, собираемые в Лугах.", image: icon("Raspberries.png"), source: wiki("Raspberries"), biome: "meadows" },
  { slug: "honey", type: "resource", category: "material", en: "Honey", ru: "Мёд", descriptionEn: "Sweet food produced by beehives.", descriptionRu: "Сладкий продукт, производимый ульями.", image: icon("Honey.png"), source: wiki("Honey"), biome: "meadows" },
  { slug: "boar-meat", type: "resource", category: "material", en: "Boar meat", ru: "Мясо кабана", descriptionEn: "Raw meat dropped by Boars.", descriptionRu: "Сырое мясо, выпадающее с кабанов.", image: icon("Boar_meat.png"), source: wiki("Boar_meat"), biome: "meadows" },
  { slug: "neck-tail", type: "resource", category: "material", en: "Neck tail", ru: "Хвост никса", descriptionEn: "A tail taken from a Neck.", descriptionRu: "Хвост, добываемый с никса.", image: icon("Neck_tail.png"), source: wiki("Neck_tail"), biome: "meadows" },
  { slug: "cooked-deer-meat", type: "resource", category: "material", en: "Cooked deer meat", ru: "Жареное мясо оленя", descriptionEn: "Deer meat cooked over a fire.", descriptionRu: "Мясо оленя, приготовленное на огне.", image: icon("Cooked_deer_meat.png"), source: wiki("Deer_meat"), biome: "meadows" },
  { slug: "feathers", type: "resource", category: "material", en: "Feathers", ru: "Перья", descriptionEn: "Light feathers used for arrows.", descriptionRu: "Лёгкие перья для изготовления стрел.", image: icon("Feathers.png"), source: wiki("Feathers"), biome: "meadows" },
  { slug: "deer-trophy", type: "resource", category: "material", en: "Deer trophy", ru: "Трофей: олень", descriptionEn: "A trophy dropped by Deer.", descriptionRu: "Трофей, выпадающий с оленей.", image: icon("Deer_trophy.png"), source: wiki("Deer"), biome: "meadows" },
  { slug: "dandelion", type: "resource", category: "material", en: "Dandelion", ru: "Одуванчик", descriptionEn: "A common yellow flower.", descriptionRu: "Обычный жёлтый цветок.", image: icon("Dandelion.png"), source: wiki("Dandelion"), biome: "meadows" },

  { slug: "bronze-sword", type: "item", category: "weapon", en: "Bronze sword", ru: "Бронзовый меч", descriptionEn: "Blood-drinker. A thirsty friend.", descriptionRu: "Кровожадный друг. Ненасытный союзник в ваших руках.", image: icon("Bronze_sword.png"), source: wiki("Bronze_sword") },
  { slug: "bronze-mace", type: "item", category: "weapon", en: "Bronze mace", ru: "Бронзовая булава", descriptionEn: "A headache on a stick.", descriptionRu: "Головная боль на рукояти.", image: icon("Bronze_mace.png"), source: wiki("Bronze_mace") },
  { slug: "bronze-spear", type: "item", category: "weapon", en: "Bronze spear", ru: "Бронзовое копьё", descriptionEn: "A sturdy spear with a head of burnished bronze.", descriptionRu: "Прочное копьё с наконечником из полированной бронзы.", image: icon("Bronze_spear.png"), source: wiki("Bronze_spear") },
  { slug: "bronze-atgeir", type: "item", category: "weapon", en: "Bronze atgeir", ru: "Бронзовый атгейр", descriptionEn: "A true warrior's tool.", descriptionRu: "Настоящее оружие воина.", image: icon("Bronze_atgeir.png"), source: wiki("Bronze_atgeir") },
  { slug: "bronze-buckler", type: "item", category: "weapon", en: "Bronze buckler", ru: "Бронзовый баклер", descriptionEn: "A small bronze shield made for parrying.", descriptionRu: "Небольшой бронзовый щит, отлично подходящий для парирования.", image: icon("Bronze_buckler.png"), source: wiki("Bronze_buckler") },
  { slug: "bronzehead-arrows-x20", type: "item", category: "weapon", en: "Bronzehead arrows ×20", ru: "Бронзовые стрелы ×20", descriptionEn: "A batch of twenty bronze-tipped arrows.", descriptionRu: "Партия из двадцати стрел с бронзовыми наконечниками.", image: icon("Bronzehead_arrow.png"), source: wiki("Bronzehead_arrow") },
  { slug: "paws-of-the-bear", type: "item", category: "weapon", en: "Paws of the Bear", ru: "Медвежьи лапы", descriptionEn: "Made for tearing and rending.", descriptionRu: "Созданы, чтобы рвать и кромсать.", image: icon("Paws_of_the_Bear.png"), source: wiki("Paws_of_the_Bear") },
  { slug: "copper-knife", type: "item", category: "weapon", en: "Copper knife", ru: "Медный нож", descriptionEn: "A glittering copper knife.", descriptionRu: "Блестящий медный нож.", image: icon("Copper_knife.png"), source: "https://www.valheim.tools/items/copper-knife/" },
  { slug: "stagbreaker", type: "item", category: "weapon", en: "Stagbreaker", ru: "Оленемор", descriptionEn: "A heavy two-handed hammer that creates a wide shockwave.", descriptionRu: "Тяжёлый двуручный молот, создающий ударную волну по площади.", image: icon("Stagbreaker.png"), source: "https://www.valheim.tools/items/stagbreaker/" },
  { slug: "bone-tower-shield", type: "item", category: "weapon", en: "Bone tower shield", ru: "Костяной башенный щит", descriptionEn: "A heavy shield built from wood and the bones of dead warriors.", descriptionRu: "Тяжёлый щит из дерева и костей павших воинов.", image: icon("Bone_tower_shield.png"), source: "https://www.valheim.tools/items/bone-tower-shield/" },
  { slug: "butcher-knife", type: "item", category: "weapon", en: "Butcher Knife", ru: "Нож мясника", descriptionEn: "A knife made specifically for slaughtering tamed animals.", descriptionRu: "Нож, предназначенный специально для забоя прирученных животных.", image: icon("Butcher_knife.png"), source: "https://www.valheim.tools/items/butcher-knife" },
  { slug: "abyssal-razor", type: "item", category: "weapon", en: "Abyssal Razor", ru: "Бездна-бритва", descriptionEn: "A fast knife crafted from chitin harvested in the Ocean.", descriptionRu: "Быстрый нож из хитина, добываемого в Океане.", image: icon("Abyssal_razor.png"), source: "https://www.valheim.tools/items/abyssal-razor" },
  { slug: "abyssal-harpoon", type: "item", category: "weapon", en: "Abyssal Harpoon", ru: "Гарпун бездны", descriptionEn: "A utility spear that can tether and drag non-boss creatures.", descriptionRu: "Гарпун, которым можно привязать и тащить существ, кроме боссов.", image: icon("Abyssal_harpoon.png"), source: "https://www.valheim.tools/items/abyssal-harpoon" },
  { slug: "wooden-atgeir", type: "item", category: "weapon", en: "Wooden Atgeir", ru: "Деревянный атгейр", descriptionEn: "A low-damage training polearm.", descriptionRu: "Тренировочное древковое оружие с минимальным уроном.", image: icon("Wooden_atgeir.png"), source: "https://www.valheim.tools/items/wooden-atgeir" },
  { slug: "wooden-axe", type: "item", category: "weapon", en: "Wooden Axe", ru: "Деревянный топор", descriptionEn: "A low-damage training axe.", descriptionRu: "Тренировочный топор с минимальным уроном.", image: icon("Wooden_axe.png"), source: "https://www.valheim.tools/items/wooden-axe" },
  { slug: "wooden-battleaxe", type: "item", category: "weapon", en: "Wooden Battleaxe", ru: "Деревянная секира", descriptionEn: "A low-damage two-handed training battleaxe.", descriptionRu: "Двуручная тренировочная секира с минимальным уроном.", image: icon("Wooden_battleaxe.png"), source: "https://www.valheim.tools/items/wooden-battleaxe" },
  { slug: "wooden-greatsword", type: "item", category: "weapon", en: "Wooden Greatsword", ru: "Деревянный двуручный меч", descriptionEn: "A low-damage two-handed training sword.", descriptionRu: "Двуручный тренировочный меч с минимальным уроном.", image: icon("Wooden_greatsword.png"), source: "https://www.valheim.tools/items/wooden-greatsword" },
  { slug: "wooden-knife", type: "item", category: "weapon", en: "Wooden Knife", ru: "Деревянный нож", descriptionEn: "A low-damage training knife.", descriptionRu: "Тренировочный нож с минимальным уроном.", image: icon("Wooden_knife.png"), source: "https://www.valheim.tools/items/wooden-knife" },
  { slug: "wooden-mace", type: "item", category: "weapon", en: "Wooden Mace", ru: "Деревянная булава", descriptionEn: "A low-damage training mace.", descriptionRu: "Тренировочная булава с минимальным уроном.", image: icon("Wooden_mace.png"), source: "https://www.valheim.tools/items/wooden-mace" },
  { slug: "wooden-sledge", type: "item", category: "weapon", en: "Wooden Sledge", ru: "Деревянная кувалда", descriptionEn: "A low-damage training sledgehammer with a wide slam.", descriptionRu: "Тренировочная кувалда с минимальным уроном и атакой по площади.", image: icon("Wooden_sledge.png"), source: "https://www.valheim.tools/items/wooden-sledge" },
  { slug: "wooden-spear", type: "item", category: "weapon", en: "Wooden Spear", ru: "Деревянное копьё", descriptionEn: "A low-damage training spear.", descriptionRu: "Тренировочное копьё с минимальным уроном.", image: icon("Wooden_spear.png"), source: "https://www.valheim.tools/items/wooden-spear" },
  { slug: "wooden-sword", type: "item", category: "weapon", en: "Wooden Sword", ru: "Деревянный меч", descriptionEn: "A low-damage training sword.", descriptionRu: "Тренировочный меч с минимальным уроном.", image: icon("Wooden_sword.png"), source: "https://www.valheim.tools/items/wooden-sword" },

  { slug: "bronze-axe", type: "item", category: "tool", en: "Bronze axe", ru: "Бронзовый топор", descriptionEn: "A bright and burnished axe capable of felling tougher trees.", descriptionRu: "Полированный бронзовый топор, способный валить более крепкие деревья.", image: icon("Bronze_axe.png"), source: wiki("Bronze_axe") },
  { slug: "bronze-pickaxe", type: "item", category: "tool", en: "Bronze pickaxe", ru: "Бронзовая кирка", descriptionEn: "A durable bronze pick for mining hard rock.", descriptionRu: "Прочная бронзовая кирка для добычи твёрдых пород.", image: icon("Bronze_pickaxe.png"), source: wiki("Bronze_pickaxe") },
  { slug: "cultivator", type: "item", category: "tool", en: "Cultivator", ru: "Культиватор", descriptionEn: "A farming tool for tilling soil and planting crops.", descriptionRu: "Инструмент для обработки земли и посадки культур.", image: icon("Cultivator.png"), source: wiki("Cultivator") },

  { slug: "bronze-helmet", type: "item", category: "armor", en: "Bronze helmet", ru: "Бронзовый шлем", descriptionEn: "A sturdy bronze helmet.", descriptionRu: "Прочный бронзовый шлем.", image: icon("Bronze_helmet.png"), source: wiki("Bronze_Armor") },
  { slug: "bronze-plate-cuirass", type: "item", category: "armor", en: "Bronze plate tunic", ru: "Бронзовая пластинчатая туника", descriptionEn: "Heavy bronze body armour.", descriptionRu: "Тяжёлая бронзовая защита корпуса.", image: icon("Bronze_plate_cuirass.png"), source: wiki("Bronze_Armor") },
  { slug: "bronze-plate-leggings", type: "item", category: "armor", en: "Bronze plate leggings", ru: "Бронзовые поножи", descriptionEn: "Heavy bronze leg armour.", descriptionRu: "Тяжёлая бронзовая защита ног.", image: icon("Bronze_plate_leggings.png"), source: wiki("Bronze_Armor") },
  { slug: "troll-leather-helmet", type: "item", category: "armor", en: "Troll leather hood", ru: "Капюшон из кожи тролля", descriptionEn: "Light armour made from tough trollskin.", descriptionRu: "Лёгкая броня из прочной шкуры тролля.", image: icon("Troll_leather_helmet.png"), source: wiki("Troll_Set") },
  { slug: "troll-leather-tunic", type: "item", category: "armor", en: "Troll leather tunic", ru: "Туника из кожи тролля", descriptionEn: "A flexible tunic made from troll hide.", descriptionRu: "Гибкая туника из шкуры тролля.", image: icon("Troll_leather_tunic.png"), source: wiki("Troll_Set") },
  { slug: "troll-leather-pants", type: "item", category: "armor", en: "Troll leather pants", ru: "Штаны из кожи тролля", descriptionEn: "Flexible leg armour made from troll hide.", descriptionRu: "Лёгкая защита ног из шкуры тролля.", image: icon("Troll_leather_pants.png"), source: wiki("Troll_Set") },
  { slug: "troll-hide-cape", type: "item", category: "armor", en: "Troll hide cape", ru: "Плащ из шкуры тролля", descriptionEn: "A cape made from tough and supple trollskin.", descriptionRu: "Плащ из прочной и эластичной шкуры тролля.", image: icon("Troll_hide_cape.png"), source: wiki("Troll_hide_cape") },
  { slug: "headdress-of-the-bear", type: "item", category: "armor", en: "Headdress of the Bear", ru: "Головной убор медведя", descriptionEn: "Part of the light Bear Set crafted from Black Forest materials.", descriptionRu: "Часть лёгкого медвежьего комплекта из материалов Чёрного леса.", image: icon("Headdress_of_the_Bear.png"), source: wiki("Bear_Set") },
  { slug: "patterns-of-the-bear", type: "item", category: "armor", en: "Patterns of the Bear", ru: "Медвежьи узоры", descriptionEn: "Bear-hide chest armour with the Berserk set effect.", descriptionRu: "Нагрудная броня из шкуры медведя с эффектом комплекта «Берсерк».", image: icon("Patterns_of_the_Bear.png"), source: wiki("Bear_Set") },
  { slug: "loincloth-of-the-bear", type: "item", category: "armor", en: "Loincloth of the Bear", ru: "Набедренная повязка медведя", descriptionEn: "Bear-hide leg armour with the Berserk set effect.", descriptionRu: "Защита ног из шкуры медведя с эффектом комплекта «Берсерк».", image: icon("Loincloth_of_the_Bear.png"), source: wiki("Bear_Set") },

  { slug: "heart-of-the-forest", type: "item", category: "trinket", en: "Heart of the Forest", ru: "Сердце леса", descriptionEn: "A Black Forest trinket that can boost health regeneration after building Adrenaline.", descriptionRu: "Оберег Чёрного леса, усиливающий восстановление здоровья после накопления адреналина.", image: icon("Heart_of_the_Forest.png"), source: wiki("Heart_of_the_Forest") },
  { slug: "bronze-pendant", type: "item", category: "trinket", en: "Bronze Pendant", ru: "Бронзовый медальон", descriptionEn: "A Black Forest trinket that can boost stamina regeneration.", descriptionRu: "Оберег Чёрного леса, усиливающий восстановление выносливости.", image: icon("Bronze_Pendant.png"), source: wiki("Bronze_Pendant") },

  { slug: "carrot-soup", type: "item", category: "food", en: "Carrot soup", ru: "Морковный суп", descriptionEn: "A warm soup focused on stamina.", descriptionRu: "Тёплый суп с упором на выносливость.", image: icon("Carrot_soup.png"), source: wiki("Carrot_soup") },
  { slug: "deer-stew", type: "item", category: "food", en: "Deer stew", ru: "Оленина тушёная", descriptionEn: "A hearty Black Forest-tier stew.", descriptionRu: "Сытное блюдо уровня Чёрного леса.", image: icon("Deer_stew.png"), source: wiki("Deer_stew") },
  { slug: "minced-meat-sauce", type: "item", category: "food", en: "Minced meat sauce", ru: "Мясной соус", descriptionEn: "Chunks of goodness in a thick gravy.", descriptionRu: "Кусочки мяса в густом соусе.", image: icon("Minced_meat_sauce.png"), source: wiki("Minced_meat_sauce") },
  { slug: "queens-jam-x4", type: "item", category: "food", en: "Queen's jam ×4", ru: "Королевский джем ×4", descriptionEn: "Four jars of stamina-focused berry jam.", descriptionRu: "Четыре порции ягодного джема с упором на выносливость.", image: icon("Queen%27s_jam.png"), source: wiki("Queen%27s_jam") },
  { slug: "boar-jerky-x2", type: "item", category: "food", en: "Boar jerky ×2", ru: "Вяленое мясо кабана ×2", descriptionEn: "Two balanced portions of boar jerky.", descriptionRu: "Две сбалансированные порции вяленого мяса кабана.", image: icon("Boar_jerky.png"), source: wiki("Boar_jerky") },
  { slug: "cooked-bear-meat", type: "item", category: "food", en: "Cooked Bear Meat", ru: "Жареное медвежье мясо", descriptionEn: "Bear meat cooked over a fire.", descriptionRu: "Медвежье мясо, приготовленное на огне.", image: icon("Cooked_bear_meat.png"), source: "https://www.valheim.tools/items/cooked-bear-meat" },
  { slug: "pulled-bear", type: "item", category: "food", en: "Pulled Bear", ru: "Томлёная медвежатина", descriptionEn: "Tender bear meat cooked with carrot and blueberries.", descriptionRu: "Томлёное медвежье мясо с морковью и черникой.", image: icon("Pulled_bear.png"), source: "https://www.valheim.tools/items/pulled-bear" },

  { slug: "mead-base-minor-healing", type: "item", category: "consumable", en: "Mead Base: Minor Healing", ru: "Основа медовухи: малое лечение", descriptionEn: "A mead base that must be fermented.", descriptionRu: "Основа медовухи, которую нужно ферментировать.", image: icon("Mead_base_minor_healing.png"), source: "https://www.valheim.tools/items/mead-base-minor-healing/" },
  { slug: "mead-base-minor-stamina", type: "item", category: "consumable", en: "Mead Base: Minor Stamina", ru: "Основа медовухи: малая выносливость", descriptionEn: "A mead base that must be fermented.", descriptionRu: "Основа медовухи, которую нужно ферментировать.", image: icon("Mead_base_minor_stamina.png"), source: "https://www.valheim.tools/items/mead-base-minor-stamina/" },
  { slug: "mead-base-tasty", type: "item", category: "consumable", en: "Mead Base: Tasty", ru: "Основа вкусной медовухи", descriptionEn: "A tasty mead base that must be fermented.", descriptionRu: "Основа вкусной медовухи, которую нужно ферментировать.", image: icon("Mead_base_tasty.png"), source: "https://www.valheim.tools/items/mead-base-tasty/" },
  { slug: "mead-base-poison-resistance", type: "item", category: "consumable", en: "Mead Base: Poison Resistance", ru: "Основа медовухи: сопротивление яду", descriptionEn: "A poison-resistance mead base that must be fermented.", descriptionRu: "Основа медовухи сопротивления яду, которую нужно ферментировать.", image: icon("Mead_base_poison_resistance.png"), source: "https://www.valheim.tools/items/mead-base-poison-resistance/" },
  { slug: "minor-healing-mead-x6", type: "item", category: "consumable", en: "Minor Healing Mead ×6", ru: "Малая лечебная медовуха ×6", descriptionEn: "A fermented batch of six minor healing meads.", descriptionRu: "Ферментированная партия из шести малых лечебных медовух.", image: icon("Minor_healing_mead.png"), source: wiki("Minor_healing_mead") },
  { slug: "minor-stamina-mead-x6", type: "item", category: "consumable", en: "Minor Stamina Mead ×6", ru: "Малая медовуха выносливости ×6", descriptionEn: "A fermented batch of six minor stamina meads.", descriptionRu: "Ферментированная партия из шести малых медовух выносливости.", image: icon("Minor_stamina_mead.png"), source: wiki("Minor_stamina_mead") },
  { slug: "tasty-mead-x6", type: "item", category: "consumable", en: "Tasty Mead ×6", ru: "Вкусная медовуха ×6", descriptionEn: "A fermented batch of six tasty meads.", descriptionRu: "Ферментированная партия из шести вкусных медовух.", image: icon("Tasty_mead.png"), source: "https://www.valheim.tools/items/tasty-mead/" },
  { slug: "poison-resistance-mead-x6", type: "item", category: "consumable", en: "Poison Resistance Mead ×6", ru: "Медовуха сопротивления яду ×6", descriptionEn: "A fermented batch of six poison-resistance meads.", descriptionRu: "Ферментированная партия из шести медовух сопротивления яду.", image: icon("Poison_resistance_mead.png"), source: "https://www.valheim.tools/items/poison-resistance-mead/" },

  { slug: "forge", type: "item", category: "building", en: "Forge", ru: "Кузница", descriptionEn: "The metalworking crafting station of the Bronze Age.", descriptionRu: "Основная станция для обработки металла бронзовой эпохи.", image: icon("Forge.png"), source: wiki("Forge") },
  { slug: "smelter", type: "item", category: "building", en: "Smelter", ru: "Плавильня", descriptionEn: "Processes ore into metal ingots.", descriptionRu: "Переплавляет руду в металлические слитки.", image: icon("Smelter.png"), source: wiki("Smelter") },
  { slug: "charcoal-kiln", type: "item", category: "building", en: "Charcoal kiln", ru: "Углевыжигательная печь", descriptionEn: "Turns wood into coal.", descriptionRu: "Перерабатывает древесину в уголь.", image: icon("Charcoal_kiln.png"), source: wiki("Charcoal_kiln") },
  { slug: "cauldron", type: "item", category: "building", en: "Cauldron", ru: "Котёл", descriptionEn: "The first major cooking crafting station.", descriptionRu: "Первая основная кулинарная станция.", image: icon("Cauldron.png"), source: wiki("Cauldron") },
  { slug: "fermenter", type: "item", category: "building", en: "Fermenter", ru: "Ферментер", descriptionEn: "Ferments mead and wine bases.", descriptionRu: "Ферментирует основы медовухи и вина.", image: icon("Fermenter.png"), source: wiki("Fermenter") },
  { slug: "portal", type: "item", category: "building", en: "Portal", ru: "Портал", descriptionEn: "Connects two portals with the same tag.", descriptionRu: "Соединяет два портала с одинаковой меткой.", image: icon("Portal.png"), source: wiki("Portal") },
  { slug: "cart", type: "item", category: "building", en: "Cart", ru: "Телега", descriptionEn: "A wheeled container for transporting heavy loads.", descriptionRu: "Телега для перевозки тяжёлых грузов.", image: icon("Cart.png"), source: wiki("Cart") },
  { slug: "karve", type: "item", category: "building", en: "Karve", ru: "Карве", descriptionEn: "A nimble early sailing vessel.", descriptionRu: "Манёвренное раннее парусное судно.", image: icon("Karve.png"), source: wiki("Karve") },
  { slug: "forge-cooler", type: "item", category: "building", en: "Forge cooler", ru: "Охладитель кузницы", descriptionEn: "An upgrade that increases Forge level.", descriptionRu: "Улучшение, повышающее уровень кузницы.", image: icon("Forge_cooler.png"), source: wiki("Forge_cooler") },
  { slug: "anvils", type: "item", category: "building", en: "Anvils", ru: "Наковальни", descriptionEn: "An upgrade that increases Forge level.", descriptionRu: "Улучшение, повышающее уровень кузницы.", image: icon("Anvils.png"), source: wiki("Anvils") },
  { slug: "adze", type: "item", category: "building", en: "Adze", ru: "Тесло", descriptionEn: "An upgrade for the Workbench.", descriptionRu: "Улучшение для верстака.", image: icon("Adze.png"), source: wiki("Adze") },
  { slug: "mead-ketill", type: "item", category: "building", en: "Mead Ketill", ru: "Котёл для медовухи", descriptionEn: "A brewing station for preparing mead bases.", descriptionRu: "Станция для приготовления основ медовухи.", image: icon("Mead_ketill.png"), source: "https://www.valheim.tools/building/mead-ketill" },
  { slug: "cartography-table", type: "item", category: "building", en: "Cartography table", ru: "Стол картографа", descriptionEn: "A table used to share map discoveries with other players.", descriptionRu: "Стол для обмена открытой картой с другими игроками.", image: icon("Cartography_table.png"), source: wiki("Cartography_table") },
  { slug: "archery-target", type: "item", category: "building", en: "Archery Target", ru: "Мишень для стрельбы", descriptionEn: "A reusable target for practising ranged combat.", descriptionRu: "Многоразовая мишень для тренировки стрельбы.", image: icon("Archery_target.png"), source: "https://www.valheim.tools/building/archery-target" },
  { slug: "twig-training-dummy", type: "item", category: "building", en: "T.W.I.G.", ru: "T.W.I.G.", descriptionEn: "A combat-practice dummy that can fight back for one point of damage.", descriptionRu: "Тренировочный манекен, который может атаковать в ответ, нанося 1 единицу урона.", image: icon("T.W.I.G..png"), source: "https://www.valheim.tools/building/t-w-i-g" },
  { slug: "bearskin-rug", type: "item", category: "building", en: "Bearskin Rug", ru: "Ковёр из медвежьей шкуры", descriptionEn: "A comfortable rug made from a bear hide, paws and trophy.", descriptionRu: "Комфортный ковёр из шкуры, лап и трофея медведя.", image: icon("Bearskin_rug.png"), source: "https://www.valheim.tools/building/bearskin-rug" },
  { slug: "ward", type: "item", category: "building", en: "Ward", ru: "Оберег", descriptionEn: "A protective ward that restricts building and container access for other players.", descriptionRu: "Защитный оберег, ограничивающий строительство и доступ к контейнерам для других игроков.", image: icon("Ward.png"), source: "https://www.valheim.tools/building" }
];

const recipes: Recipe[] = [
  { item: "finewood-bow", station: "workbench", ingredients: [["finewood",10],["corewood",10],["deer-hide",2]] },
  { item: "bronze-sword", station: "forge", ingredients: [["wood",2],["bronze",8],["leather-scraps",2]] },
  { item: "bronze-mace", station: "forge", ingredients: [["wood",4],["bronze",8],["leather-scraps",3]] },
  { item: "bronze-spear", station: "forge", ingredients: [["wood",5],["bronze",6],["deer-hide",2]] },
  { item: "bronze-atgeir", station: "forge", ingredients: [["wood",10],["bronze",8],["leather-scraps",2]] },
  { item: "bronze-buckler", station: "forge", ingredients: [["wood",4],["bronze",10]] },
  { item: "bronzehead-arrows-x20", station: "forge", ingredients: [["wood",8],["bronze",1],["feathers",2]] },
  { item: "paws-of-the-bear", station: "workbench", level: 2, ingredients: [["bear-hide",2],["bear-paw",2],["leather-scraps",4]] },
  { item: "copper-knife", station: "forge", ingredients: [["wood",2],["copper",8]] },
  { item: "stagbreaker", station: "workbench", level: 2, ingredients: [["corewood",20],["deer-trophy",5],["leather-scraps",2]] },
  { item: "bone-tower-shield", station: "workbench", level: 3, ingredients: [["wood",10],["bone-fragments",10],["skeleton-trophy",3]] },
  { item: "butcher-knife", station: "forge", ingredients: [["wood",2],["tin",4]] },
  { item: "abyssal-razor", station: "workbench", level: 2, ingredients: [["finewood",4],["chitin",20],["leather-scraps",2]] },
  { item: "abyssal-harpoon", station: "workbench", level: 2, ingredients: [["finewood",8],["chitin",30],["leather-scraps",3]] },
  { item: "wooden-atgeir", station: "workbench", ingredients: [["wood",5],["finewood",3],["corewood",2]] },
  { item: "wooden-axe", station: "workbench", ingredients: [["wood",5],["finewood",3],["corewood",2]] },
  { item: "wooden-battleaxe", station: "workbench", ingredients: [["wood",5],["finewood",3],["corewood",2]] },
  { item: "wooden-greatsword", station: "workbench", ingredients: [["wood",5],["finewood",3],["corewood",2]] },
  { item: "wooden-knife", station: "workbench", ingredients: [["wood",5],["finewood",3],["corewood",2]] },
  { item: "wooden-mace", station: "workbench", ingredients: [["wood",5],["finewood",3],["corewood",2]] },
  { item: "wooden-sledge", station: "workbench", ingredients: [["wood",5],["finewood",3],["corewood",2]] },
  { item: "wooden-spear", station: "workbench", ingredients: [["wood",5],["finewood",3],["corewood",2]] },
  { item: "wooden-sword", station: "workbench", ingredients: [["wood",5],["finewood",3],["corewood",2]] },
  { item: "bronze-axe", station: "forge", ingredients: [["wood",4],["bronze",8],["leather-scraps",2]] },
  { item: "bronze-pickaxe", station: "forge", ingredients: [["corewood",3],["bronze",10]] },
  { item: "cultivator", station: "forge", ingredients: [["corewood",5],["bronze",5]] },
  { item: "bronze-helmet", station: "forge", ingredients: [["bronze",5],["deer-hide",2]] },
  { item: "bronze-plate-cuirass", station: "forge", ingredients: [["bronze",5],["deer-hide",2]] },
  { item: "bronze-plate-leggings", station: "forge", ingredients: [["bronze",5],["deer-hide",2]] },
  { item: "troll-leather-helmet", station: "workbench", level: 2, ingredients: [["troll-hide",5],["bone-fragments",3]] },
  { item: "troll-leather-tunic", station: "workbench", level: 2, ingredients: [["troll-hide",5]] },
  { item: "troll-leather-pants", station: "workbench", level: 2, ingredients: [["troll-hide",5]] },
  { item: "troll-hide-cape", station: "workbench", level: 2, ingredients: [["troll-hide",10],["bone-fragments",10]] },
  { item: "headdress-of-the-bear", station: "workbench", level: 2, ingredients: [["bear-hide",5],["bear-trophy",1]] },
  { item: "patterns-of-the-bear", station: "workbench", level: 2, ingredients: [["bear-hide",5],["bear-paw",2],["blueberries",4]] },
  { item: "loincloth-of-the-bear", station: "workbench", level: 2, ingredients: [["bear-hide",5],["blueberries",4]] },
  { item: "heart-of-the-forest", station: "forge", ingredients: [["bronze",5],["ancient-seed",5],["greydwarf-shaman-trophy",1]] },
  { item: "bronze-pendant", station: "forge", ingredients: [["bronze",5],["bear-trophy",1],["ruby",3]] },
  { item: "carrot-soup", station: "cauldron", ingredients: [["mushroom",1],["carrot",3]] },
  { item: "deer-stew", station: "cauldron", ingredients: [["cooked-deer-meat",1],["blueberries",1],["carrot",1]] },
  { item: "minced-meat-sauce", station: "cauldron", ingredients: [["boar-meat",1],["neck-tail",1],["carrot",1]] },
  { item: "queens-jam-x4", station: "cauldron", ingredients: [["raspberries",8],["blueberries",6]] },
  { item: "boar-jerky-x2", station: "cauldron", ingredients: [["boar-meat",1],["honey",1]] },
  { item: "cooked-bear-meat", station: "cooking-station", ingredients: [["bear-meat",1]] },
  { item: "pulled-bear", station: "cauldron", ingredients: [["cooked-bear-meat",1],["carrot",2],["blueberries",1]] },
  { item: "mead-base-minor-healing", station: "mead-ketill", ingredients: [["honey",10],["blueberries",5],["raspberries",10],["dandelion",1]] },
  { item: "mead-base-minor-stamina", station: "mead-ketill", ingredients: [["honey",10],["raspberries",10],["yellow-mushroom",10]] },
  { item: "mead-base-tasty", station: "mead-ketill", ingredients: [["honey",10],["raspberries",10],["blueberries",5]] },
  { item: "mead-base-poison-resistance", station: "mead-ketill", ingredients: [["honey",10],["thistle",5],["neck-tail",1],["coal",10]] },
  { item: "minor-healing-mead-x6", station: "fermenter", ingredients: [["mead-base-minor-healing",1]] },
  { item: "minor-stamina-mead-x6", station: "fermenter", ingredients: [["mead-base-minor-stamina",1]] },
  { item: "tasty-mead-x6", station: "fermenter", ingredients: [["mead-base-tasty",1]] },
  { item: "poison-resistance-mead-x6", station: "fermenter", ingredients: [["mead-base-poison-resistance",1]] },
  { item: "forge", station: "hammer", ingredients: [["stone",4],["coal",4],["wood",10],["copper",6]] },
  { item: "smelter", station: "hammer", ingredients: [["stone",20],["surtling-core",5]] },
  { item: "charcoal-kiln", station: "hammer", ingredients: [["stone",20],["surtling-core",5]] },
  { item: "cauldron", station: "hammer", ingredients: [["tin",10]] },
  { item: "fermenter", station: "hammer", ingredients: [["finewood",30],["bronze",5],["resin",10]] },
  { item: "portal", station: "hammer", ingredients: [["finewood",20],["greydwarf-eye",10],["surtling-core",2]] },
  { item: "cart", station: "hammer", ingredients: [["wood",20],["bronze-nails",10]] },
  { item: "karve", station: "hammer", ingredients: [["finewood",30],["deer-hide",10],["resin",20],["bronze-nails",80]] },
  { item: "forge-cooler", station: "hammer", ingredients: [["finewood",25],["copper",10]] },
  { item: "anvils", station: "hammer", ingredients: [["wood",5],["bronze",2]] },
  { item: "adze", station: "hammer", ingredients: [["finewood",10],["bronze",3]] },
  { item: "mead-ketill", station: "hammer", ingredients: [["tin",4],["copper",6],["leather-scraps",2]] },
  { item: "cartography-table", station: "hammer", ingredients: [["finewood",10],["bone-fragments",10],["bronze",2],["leather-scraps",5],["raspberries",4]] },
  { item: "archery-target", station: "hammer", ingredients: [["finewood",4],["leather-scraps",10]] },
  { item: "twig-training-dummy", station: "hammer", ingredients: [["finewood",5],["bronze-nails",10],["ectoplasm",5]] },
  { item: "bearskin-rug", station: "hammer", ingredients: [["bear-hide",1],["bear-paw",2],["bear-trophy",1]] },
  { item: "ward", station: "hammer", ingredients: [["finewood",5],["greydwarf-eye",5],["surtling-core",1]] }
];

const upgrades: Upgrade[] = [
  { item:"finewood-bow", level:2, stationLevel:2, ingredients:[["finewood",5],["corewood",5],["deer-hide",2]] },
  { item:"finewood-bow", level:3, stationLevel:3, ingredients:[["finewood",10],["corewood",10],["deer-hide",4]] },
  { item:"finewood-bow", level:4, stationLevel:4, ingredients:[["finewood",20],["corewood",20],["deer-hide",8]] },
  { item:"bronze-sword", level:2, stationLevel:2, ingredients:[["wood",1],["bronze",4],["leather-scraps",1]] },
  { item:"bronze-sword", level:3, stationLevel:3, ingredients:[["wood",2],["bronze",8],["leather-scraps",2]] },
  { item:"bronze-sword", level:4, stationLevel:4, ingredients:[["wood",4],["bronze",16],["leather-scraps",4]] },
  { item:"bronze-mace", level:2, stationLevel:2, ingredients:[["bronze",4]] },
  { item:"bronze-mace", level:3, stationLevel:3, ingredients:[["bronze",8]] },
  { item:"bronze-mace", level:4, stationLevel:4, ingredients:[["bronze",16]] },
  { item:"bronze-spear", level:2, stationLevel:2, ingredients:[["wood",3],["bronze",4],["deer-hide",1]] },
  { item:"bronze-spear", level:3, stationLevel:3, ingredients:[["wood",6],["bronze",8],["deer-hide",2]] },
  { item:"bronze-spear", level:4, stationLevel:4, ingredients:[["wood",12],["bronze",16],["deer-hide",4]] },
  { item:"bronze-atgeir", level:2, stationLevel:2, ingredients:[["bronze",4]] },
  { item:"bronze-atgeir", level:3, stationLevel:3, ingredients:[["bronze",8]] },
  { item:"bronze-atgeir", level:4, stationLevel:4, ingredients:[["bronze",16]] },
  { item:"bronze-buckler", level:2, stationLevel:2, ingredients:[["bronze",5],["wood",1]] },
  { item:"bronze-buckler", level:3, stationLevel:3, ingredients:[["bronze",10],["wood",2]] },
  { item:"bronze-axe", level:2, stationLevel:2, ingredients:[["bronze",4],["leather-scraps",1]] },
  { item:"bronze-axe", level:3, stationLevel:3, ingredients:[["bronze",8],["leather-scraps",2]] },
  { item:"bronze-axe", level:4, stationLevel:4, ingredients:[["bronze",16],["leather-scraps",4]] },
  { item:"bronze-pickaxe", level:2, stationLevel:2, ingredients:[["corewood",1],["bronze",5]] },
  { item:"bronze-pickaxe", level:3, stationLevel:3, ingredients:[["corewood",2],["bronze",10]] },
  { item:"bronze-pickaxe", level:4, stationLevel:4, ingredients:[["corewood",4],["bronze",20]] },
  { item:"cultivator", level:2, stationLevel:2, ingredients:[["corewood",1],["bronze",1]] },
  { item:"cultivator", level:3, stationLevel:3, ingredients:[["corewood",2],["bronze",2]] },
  { item:"abyssal-razor", level:2, stationLevel:3, ingredients:[["chitin",10]] },
  { item:"abyssal-razor", level:3, stationLevel:4, ingredients:[["chitin",20]] },
  { item:"abyssal-razor", level:4, stationLevel:5, ingredients:[["chitin",40]] },
  ...["wooden-atgeir","wooden-axe","wooden-battleaxe","wooden-greatsword","wooden-knife","wooden-mace","wooden-sledge","wooden-spear","wooden-sword"].flatMap(item => [
    { item, level:2, stationLevel:2, ingredients:[["wood",1],["finewood",10],["corewood",2]] as Array<[string,number]> },
    { item, level:3, stationLevel:3, ingredients:[["wood",2],["finewood",20],["corewood",4]] as Array<[string,number]> },
    { item, level:4, stationLevel:4, ingredients:[["wood",4],["finewood",40],["corewood",8]] as Array<[string,number]> }
  ]),
  { item:"copper-knife", level:2, stationLevel:2, ingredients:[["copper",4],["greydwarf-eye",8]] },
  { item:"copper-knife", level:3, stationLevel:3, ingredients:[["copper",8],["greydwarf-eye",16]] },
  { item:"copper-knife", level:4, stationLevel:4, ingredients:[["copper",16],["greydwarf-eye",32]] },
  { item:"stagbreaker", level:2, stationLevel:3, ingredients:[["corewood",5],["deer-trophy",2],["leather-scraps",1],["bone-fragments",10]] },
  { item:"stagbreaker", level:3, stationLevel:4, ingredients:[["corewood",10],["deer-trophy",4],["leather-scraps",2],["bone-fragments",20]] },
  { item:"stagbreaker", level:4, stationLevel:5, ingredients:[["corewood",20],["deer-trophy",8],["leather-scraps",4],["bone-fragments",40]] },
  { item:"bone-tower-shield", level:2, stationLevel:4, ingredients:[["wood",5],["bone-fragments",5]] },
  { item:"bone-tower-shield", level:3, stationLevel:5, ingredients:[["wood",10],["bone-fragments",10]] },
  ...["bronze-helmet","bronze-plate-cuirass","bronze-plate-leggings"].flatMap(item => [
    { item, level:2, stationLevel:2, ingredients:[["bronze",3]] as Array<[string,number]> },
    { item, level:3, stationLevel:3, ingredients:[["bronze",6]] as Array<[string,number]> },
    { item, level:4, stationLevel:4, ingredients:[["bronze",12]] as Array<[string,number]> }
  ]),
  { item:"troll-leather-helmet", level:2, stationLevel:3, ingredients:[["troll-hide",2],["bone-fragments",1]] },
  { item:"troll-leather-helmet", level:3, stationLevel:4, ingredients:[["troll-hide",4],["bone-fragments",2]] },
  { item:"troll-leather-helmet", level:4, stationLevel:5, ingredients:[["troll-hide",6],["bone-fragments",3]] },
  ...["troll-leather-tunic","troll-leather-pants"].flatMap(item => [
    { item, level:2, stationLevel:3, ingredients:[["troll-hide",2]] as Array<[string,number]> },
    { item, level:3, stationLevel:4, ingredients:[["troll-hide",4]] as Array<[string,number]> },
    { item, level:4, stationLevel:5, ingredients:[["troll-hide",6]] as Array<[string,number]> }
  ]),
  { item:"troll-hide-cape", level:2, stationLevel:3, ingredients:[["troll-hide",5],["bone-fragments",5]] },
  { item:"troll-hide-cape", level:3, stationLevel:4, ingredients:[["troll-hide",10],["bone-fragments",10]] },
  { item:"troll-hide-cape", level:4, stationLevel:5, ingredients:[["troll-hide",15],["bone-fragments",15]] },
  { item:"paws-of-the-bear", level:2, stationLevel:3, ingredients:[["bear-hide",2],["leather-scraps",2]] },
  { item:"paws-of-the-bear", level:3, stationLevel:4, ingredients:[["bear-hide",4],["leather-scraps",4]] },
  { item:"paws-of-the-bear", level:4, stationLevel:5, ingredients:[["bear-hide",8],["leather-scraps",8]] },
  ...["headdress-of-the-bear"].flatMap(item => [
    { item, level:2, stationLevel:3, ingredients:[["bear-hide",2]] as Array<[string,number]> },
    { item, level:3, stationLevel:4, ingredients:[["bear-hide",4]] as Array<[string,number]> },
    { item, level:4, stationLevel:5, ingredients:[["bear-hide",8]] as Array<[string,number]> }
  ]),
  ...["patterns-of-the-bear","loincloth-of-the-bear"].flatMap(item => [
    { item, level:2, stationLevel:3, ingredients:[["bear-hide",2],["blueberries",1]] as Array<[string,number]> },
    { item, level:3, stationLevel:4, ingredients:[["bear-hide",4],["blueberries",2]] as Array<[string,number]> },
    { item, level:4, stationLevel:5, ingredients:[["bear-hide",8],["blueberries",4]] as Array<[string,number]> }
  ])
];

const stats: Array<[string,string,string,string?]> = [
  ["finewood-bow","pierce_damage","32"],["finewood-bow","durability","100"],["finewood-bow","stamina_use","6","/s"],
  ["bronze-sword","slash_damage","35"],["bronze-sword","durability","200"],["bronze-sword","stamina_use","8"],
  ["bronze-mace","blunt_damage","35"],["bronze-mace","durability","200"],["bronze-mace","stamina_use","8"],
  ["bronze-spear","pierce_damage","35"],["bronze-spear","durability","100"],["bronze-spear","stamina_use","8"],
  ["bronze-atgeir","pierce_damage","45"],["bronze-atgeir","durability","125"],["bronze-atgeir","stamina_use","12"],
  ["bronze-buckler","block_armor","16"],["bronze-buckler","parry_bonus","2.5","x"],["bronze-buckler","durability","200"],
  ["bronzehead-arrows-x20","pierce_damage","32"],
  ["paws-of-the-bear","slash_damage","25"],["paws-of-the-bear","durability","300"],["paws-of-the-bear","stamina_use","6"],
  ["copper-knife","slash_damage","12"],["copper-knife","pierce_damage","12"],["copper-knife","durability","200"],["copper-knife","stamina_use","6"],
  ["butcher-knife","damage","1000"],["butcher-knife","durability","200"],["butcher-knife","stamina_use","5"],
  ["abyssal-razor","slash_damage","20"],["abyssal-razor","pierce_damage","20"],["abyssal-razor","durability","200"],["abyssal-razor","stamina_use","8"],
  ["abyssal-harpoon","pierce_damage","10"],["abyssal-harpoon","durability","50"],["abyssal-harpoon","stamina_use","15"],
  ["wooden-atgeir","pierce_damage","1"],["wooden-atgeir","durability","175"],["wooden-atgeir","stamina_use","8"],
  ["wooden-axe","slash_damage","1"],["wooden-axe","chop","1"],["wooden-axe","durability","125"],["wooden-axe","stamina_use","4"],
  ["wooden-battleaxe","slash_damage","1"],["wooden-battleaxe","chop","1"],["wooden-battleaxe","durability","200"],["wooden-battleaxe","stamina_use","8"],
  ["wooden-greatsword","slash_damage","1"],["wooden-greatsword","durability","200"],["wooden-greatsword","stamina_use","8"],
  ["wooden-knife","slash_damage","1"],["wooden-knife","pierce_damage","1"],["wooden-knife","durability","200"],["wooden-knife","stamina_use","4"],
  ["wooden-mace","blunt_damage","1"],["wooden-mace","durability","200"],["wooden-mace","stamina_use","8"],
  ["wooden-sledge","blunt_damage","1"],["wooden-sledge","durability","100"],["wooden-sledge","stamina_use","8"],
  ["wooden-spear","pierce_damage","1"],["wooden-spear","durability","100"],["wooden-spear","stamina_use","4"],
  ["wooden-sword","slash_damage","1"],["wooden-sword","durability","200"],["wooden-sword","stamina_use","4"],
  ["stagbreaker","blunt_damage","20"],["stagbreaker","pierce_damage","5"],["stagbreaker","durability","100"],["stagbreaker","stamina_use","12"],
  ["bone-tower-shield","block_armor","32"],["bone-tower-shield","durability","200"],
  ["bronze-axe","slash_damage","40"],["bronze-axe","chop","40"],["bronze-axe","durability","125"],["bronze-axe","stamina_use","8"],
  ["bronze-pickaxe","pierce_damage","25"],["bronze-pickaxe","pickaxe","25"],["bronze-pickaxe","durability","120"],["bronze-pickaxe","stamina_use","8"],
  ["cultivator","durability","200"],
  ["bronze-helmet","armor","8"],["bronze-plate-cuirass","armor","8"],["bronze-plate-leggings","armor","8"],
  ["troll-leather-helmet","armor","6"],["troll-leather-tunic","armor","6"],["troll-leather-pants","armor","6"],["troll-hide-cape","armor","1"],
  ["headdress-of-the-bear","armor","7"],["patterns-of-the-bear","armor","7"],["loincloth-of-the-bear","armor","7"],
  ["heart-of-the-forest","health_regen_bonus","25","%"],["heart-of-the-forest","duration","60","s"],
  ["bronze-pendant","stamina_regen_bonus","25","%"],["bronze-pendant","duration","60","s"],
  ["carrot-soup","health","15"],["carrot-soup","stamina","45"],["carrot-soup","duration","25","min"],["carrot-soup","healing","2","hp/tick"],
  ["deer-stew","health","45"],["deer-stew","stamina","15"],["deer-stew","duration","25","min"],["deer-stew","healing","3","hp/tick"],
  ["minced-meat-sauce","health","40"],["minced-meat-sauce","stamina","13"],["minced-meat-sauce","duration","25","min"],["minced-meat-sauce","healing","3","hp/tick"],
  ["queens-jam-x4","health","14"],["queens-jam-x4","stamina","40"],["queens-jam-x4","duration","20","min"],["queens-jam-x4","healing","2","hp/tick"],
  ["boar-jerky-x2","health","23"],["boar-jerky-x2","stamina","23"],["boar-jerky-x2","duration","30","min"],["boar-jerky-x2","healing","2","hp/tick"],
  ["cooked-bear-meat","health","40"],["cooked-bear-meat","stamina","13"],["cooked-bear-meat","duration","20","min"],["cooked-bear-meat","healing","2","hp/tick"],
  ["pulled-bear","health","37"],["pulled-bear","stamina","16"],["pulled-bear","duration","30","min"],["pulled-bear","healing","3","hp/tick"]
];

const resourceSources: Array<[string,string,string,string]> = [
  ["copper-ore","Mine copper deposits in the Black Forest.","Добывается из залежей меди в Чёрном лесу.",wiki("Copper_ore")],
  ["tin-ore","Mine small tin deposits near Black Forest water.","Добывается из небольших залежей олова у воды в Чёрном лесу.",wiki("Tin_ore")],
  ["copper","Smelt copper ore in a Smelter.","Переплавьте медную руду в плавильне.",wiki("Copper")],
  ["tin","Smelt tin ore in a Smelter.","Переплавьте оловянную руду в плавильне.",wiki("Tin")],
  ["bronze","Forge 2 Copper + 1 Tin.","Создаётся в кузнице из 2 меди и 1 олова.",wiki("Bronze")],
  ["bronze-nails","Forge 1 Bronze into 20 Bronze nails.","В кузнице 1 бронза превращается в 20 бронзовых гвоздей.",wiki("Bronze_nails")],
  ["greydwarf-eye","Dropped by Greydwarfs.","Выпадает с грейдворфов.",wiki("Greydwarf_eye")],
  ["surtling-core","Found primarily inside Black Forest Burial Chambers.","В основном находится в Погребальных комнатах Чёрного леса.",wiki("Surtling_core")],
  ["ancient-seed","Dropped by Greydwarf Brutes and Greydwarf nests; used to summon The Elder.","Выпадает с грейдворфов-брутов и гнёзд; используется для призыва Древнего.",wiki("Ancient_seed")],
  ["troll-hide","Dropped by Trolls.","Выпадает с троллей.",wiki("Troll_hide")],
  ["blueberries","Gather from blueberry bushes in the Black Forest.","Собирается с кустов черники в Чёрном лесу.",wiki("Blueberries")],
  ["thistle","Gather glowing thistle plants in the Black Forest.","Собирается со светящихся растений в Чёрном лесу.",wiki("Thistle")],
  ["yellow-mushroom","Found in Burial Chambers and other caves.","Находится в Погребальных комнатах и других пещерах.",wiki("Yellow_mushroom")],
  ["carrot-seeds","Gather from seed-carrot flowers in the Black Forest.","Собирается с цветков семенной моркови в Чёрном лесу.",wiki("Carrot_seeds")],
  ["carrot","Grow Carrot seeds using a Cultivator.","Выращивается из семян моркови при помощи культиватора.",wiki("Carrot")],
  ["bear-hide","Dropped by Bears introduced with Valheim 1.0.","Выпадает с медведей, добавленных в Valheim 1.0.",wiki("Bear")],
  ["bear-paw","Dropped by Bears.","Выпадает с медведей.",wiki("Bear_paw")],
  ["bear-trophy","Rare drop from Bears.","Редкий трофей с медведей.",wiki("Bear")],
  ["greydwarf-shaman-trophy","Rare drop from Greydwarf Shamans.","Редкий трофей с грейдворфов-шаманов.",wiki("Greydwarf_Shaman")],
  ["ruby","Found as valuable loot in dungeons and chests.","Находится как ценная добыча в подземельях и сундуках.",wiki("Ruby")],
  ["coal","Produce it in a Charcoal kiln.","Производится в углевыжигательной печи.",wiki("Coal")],
  ["skeleton-trophy","Dropped by Skeletons, especially in Burial Chambers.","Выпадает со скелетов, особенно в Погребальных комнатах.",wiki("Skeleton")],
  ["bronze-battle-idol","Rare chest loot in Black Forest ruins, Burial Chambers and Troll Caves; used only at the Forge of Potential.","Редкая добыча из сундуков руин, Погребальных комнат и Пещер троллей; используется только в Кузнице потенциала.","https://www.valheim.tools/items/bronze-battle-idol/"],
  ["bronze-protection-idol","Rare chest loot in Black Forest ruins, Burial Chambers and Troll Caves; used only at the Forge of Potential.","Редкая добыча из сундуков руин, Погребальных комнат и Пещер троллей; используется только в Кузнице потенциала.","https://www.valheim.tools/items/bronze-protection-idol/"],
  ["bear-meat","Dropped by Bears in the Black Forest.","Выпадает с медведей в Чёрном лесу.","https://www.valheim.tools/items/bear-meat"],
  ["ectoplasm","Dropped by Ghosts encountered in Black Forest Burial Chambers.","Выпадает с призраков, встречающихся в Погребальных комнатах Чёрного леса.","https://www.valheim.tools/building/t-w-i-g"]
];

const runBatches = async (env: Env, statements: D1PreparedStatement[]): Promise<void> => {
  for (let index = 0; index < statements.length; index += 50) {
    await env.DB.batch(statements.slice(index, index + 50));
  }
};

export const ensureBlackForestCatalog = async (env: Env): Promise<void> => {
  const marker = await env.DB.prepare("SELECT value FROM schema_metadata WHERE key = ?")
    .bind("catalog_black_forest_v4").first<{ value: string }>();
  if (marker?.value === "done") return;

  await env.DB.batch([
    env.DB.prepare("INSERT INTO categories (slug,name_en,name_ru,sort_order) VALUES ('trinket','Trinkets','Обереги',35) ON CONFLICT(slug) DO UPDATE SET name_en=excluded.name_en,name_ru=excluded.name_ru,sort_order=excluded.sort_order"),
    env.DB.prepare("INSERT INTO crafting_stations (slug,name_en,name_ru) VALUES ('forge','Forge','Кузница') ON CONFLICT(slug) DO UPDATE SET name_en=excluded.name_en,name_ru=excluded.name_ru"),
    env.DB.prepare("INSERT INTO crafting_stations (slug,name_en,name_ru) VALUES ('hammer','Hammer / Building','Молот / Строительство') ON CONFLICT(slug) DO UPDATE SET name_en=excluded.name_en,name_ru=excluded.name_ru"),
    env.DB.prepare("INSERT INTO crafting_stations (slug,name_en,name_ru) VALUES ('cauldron','Cauldron','Котёл') ON CONFLICT(slug) DO UPDATE SET name_en=excluded.name_en,name_ru=excluded.name_ru"),
    env.DB.prepare("INSERT INTO crafting_stations (slug,name_en,name_ru) VALUES ('mead-ketill','Mead Ketill','Котёл для медовухи') ON CONFLICT(slug) DO UPDATE SET name_en=excluded.name_en,name_ru=excluded.name_ru"),
    env.DB.prepare("INSERT INTO crafting_stations (slug,name_en,name_ru) VALUES ('fermenter','Fermenter','Ферментер') ON CONFLICT(slug) DO UPDATE SET name_en=excluded.name_en,name_ru=excluded.name_ru"),
    env.DB.prepare("INSERT INTO crafting_stations (slug,name_en,name_ru) VALUES ('cooking-station','Cooking station','Кулинарная стойка') ON CONFLICT(slug) DO UPDATE SET name_en=excluded.name_en,name_ru=excluded.name_ru")
  ]);

  const itemStatements = items.map((item) => env.DB.prepare(`
    INSERT INTO items (slug,entity_type,name_en,name_ru,description_en,description_ru,biome_id,category_id,image_path,image_source_url,image_license_note,source_name,source_url)
    VALUES (?,?,?,?,?,?,(SELECT id FROM biomes WHERE slug=?),(SELECT id FROM categories WHERE slug=?),?,?,?,?,?)
    ON CONFLICT(slug) DO UPDATE SET
      entity_type=excluded.entity_type,name_en=excluded.name_en,name_ru=excluded.name_ru,
      description_en=excluded.description_en,description_ru=excluded.description_ru,
      biome_id=excluded.biome_id,category_id=excluded.category_id,
      image_path=excluded.image_path,image_source_url=excluded.image_source_url,
      image_license_note=excluded.image_license_note,source_name=excluded.source_name,source_url=excluded.source_url,
      updated_at=CURRENT_TIMESTAMP
  `).bind(
    item.slug,item.type,item.en,item.ru,item.descriptionEn,item.descriptionRu,item.biome ?? "black-forest",item.category,
    item.image ?? null,item.source,"Game asset / source page retained for attribution",sourceLabel(item),item.source
  ));
  await runBatches(env, itemStatements);

  await runBatches(env, resourceSources.map(([slug,en,ru,source], sort) => env.DB.prepare(`
    INSERT INTO resource_sources (resource_id,method_en,method_ru,biome_id,source_url,sort_order)
    SELECT i.id,?,?,b.id,?,? FROM items i JOIN biomes b ON b.slug='black-forest' WHERE i.slug=?
    AND NOT EXISTS (SELECT 1 FROM resource_sources rs WHERE rs.resource_id=i.id AND rs.method_en=?)
  `).bind(en,ru,source,sort + 10,slug,en)));

  const recipeStatements: D1PreparedStatement[] = [];
  for (const recipe of recipes) {
    recipeStatements.push(env.DB.prepare(`
      INSERT INTO recipes (item_id,crafting_station_id,station_level)
      SELECT i.id,s.id,? FROM items i JOIN crafting_stations s ON s.slug=? WHERE i.slug=?
      ON CONFLICT(item_id) DO UPDATE SET crafting_station_id=excluded.crafting_station_id,station_level=excluded.station_level
    `).bind(recipe.level ?? 1, recipe.station, recipe.item));
    for (const [resource, quantity] of recipe.ingredients) {
      recipeStatements.push(env.DB.prepare(`
        INSERT INTO recipe_ingredients (recipe_id,resource_id,quantity)
        SELECT re.id,r.id,? FROM recipes re JOIN items i ON i.id=re.item_id JOIN items r ON r.slug=? WHERE i.slug=?
        ON CONFLICT(recipe_id,resource_id) DO UPDATE SET quantity=excluded.quantity
      `).bind(quantity, resource, recipe.item));
    }
  }
  await runBatches(env, recipeStatements);

  const upgradeStatements: D1PreparedStatement[] = [];
  for (const upgrade of upgrades) {
    upgradeStatements.push(env.DB.prepare(`
      INSERT INTO item_upgrades (item_id,level,station_level)
      SELECT i.id,?,? FROM items i WHERE i.slug=?
      ON CONFLICT(item_id,level) DO UPDATE SET station_level=excluded.station_level
    `).bind(upgrade.level,upgrade.stationLevel,upgrade.item));
    for (const [resource, quantity] of upgrade.ingredients) {
      upgradeStatements.push(env.DB.prepare(`
        INSERT INTO upgrade_ingredients (upgrade_id,resource_id,quantity)
        SELECT u.id,r.id,? FROM item_upgrades u JOIN items i ON i.id=u.item_id JOIN items r ON r.slug=? WHERE i.slug=? AND u.level=?
        ON CONFLICT(upgrade_id,resource_id) DO UPDATE SET quantity=excluded.quantity
      `).bind(quantity,resource,upgrade.item,upgrade.level));
    }
  }
  await runBatches(env, upgradeStatements);

  await runBatches(env, stats.map(([slug,key,value,unit], sort) => env.DB.prepare(`
    INSERT INTO item_stats (item_id,stat_key,stat_value,unit,sort_order)
    SELECT i.id,?,?,?,? FROM items i WHERE i.slug=?
    ON CONFLICT(item_id,stat_key) DO UPDATE SET stat_value=excluded.stat_value,unit=excluded.unit,sort_order=excluded.sort_order
  `).bind(key,value,unit ?? null,sort + 10,slug)));

  await env.DB.prepare(`
    INSERT INTO schema_metadata (key,value,updated_at) VALUES ('catalog_black_forest_v4','done',CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value='done',updated_at=CURRENT_TIMESTAMP
  `).run();
};
