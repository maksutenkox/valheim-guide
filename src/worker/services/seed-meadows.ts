import type { Env } from "../env";
import { applyCatalogSeed, type CatalogSeed } from "./catalog-seed";

const item = (slug: string) => `https://www.valheim.tools/items/${slug}`;
const building = (slug: string) => `https://www.valheim.tools/building/${slug}`;

const meadowsSeed: CatalogSeed = {
  marker: "catalog_meadows_v1",
  biome: "meadows",
  stations: [
    { slug: "inventory", en: "Inventory", ru: "Инвентарь" },
    { slug: "workbench", en: "Workbench", ru: "Верстак" },
    { slug: "hammer", en: "Hammer / Building", ru: "Молот / Строительство" },
    { slug: "cooking-station", en: "Cooking Station", ru: "Кулинарная стойка" }
  ],
  items: [
    { slug:"wood", type:"resource", category:"material", en:"Wood", ru:"Древесина", descriptionEn:"The basic building and crafting material.", descriptionRu:"Основной материал для строительства и крафта.", imageFile:"Wood.png", source:item("wood") },
    { slug:"stone", type:"resource", category:"material", en:"Stone", ru:"Камень", descriptionEn:"A rough stone used for early crafting and building.", descriptionRu:"Обычный камень для раннего крафта и строительства.", imageFile:"Stone.png", source:item("stone") },
    { slug:"flint", type:"resource", category:"material", en:"Flint", ru:"Кремень", descriptionEn:"Sharp stone found along Meadows shorelines.", descriptionRu:"Острый камень с берегов Лугов.", imageFile:"Flint.png", source:item("flint") },
    { slug:"resin", type:"resource", category:"material", en:"Resin", ru:"Смола", descriptionEn:"Sticky resin dropped by Greylings and Greydwarfs.", descriptionRu:"Липкая смола, выпадающая из грейлингов и грейдворфов.", imageFile:"Resin.png", source:item("resin") },
    { slug:"leather-scraps", type:"resource", category:"material", en:"Leather Scraps", ru:"Обрывки кожи", descriptionEn:"Leather scraps dropped by Boars.", descriptionRu:"Обрывки кожи, выпадающие с кабанов.", imageFile:"Leather_Scraps.png", source:item("leather-scraps") },
    { slug:"deer-hide", type:"resource", category:"material", en:"Deer Hide", ru:"Шкура оленя", descriptionEn:"Hide taken from Deer.", descriptionRu:"Шкура, добываемая с оленей.", imageFile:"Deer_Hide.png", source:item("deer-hide") },
    { slug:"bone-fragments", type:"resource", category:"material", en:"Bone Fragments", ru:"Костяные фрагменты", descriptionEn:"Bone pieces used for equipment upgrades.", descriptionRu:"Костяные фрагменты для экипировки и улучшений.", imageFile:"Bone_Fragments.png", source:item("bone-fragments") },
    { slug:"feathers", type:"resource", category:"material", en:"Feathers", ru:"Перья", descriptionEn:"Light feathers used for arrows.", descriptionRu:"Лёгкие перья для изготовления стрел.", imageFile:"Feathers.png", source:item("feathers") },
    { slug:"raspberries", type:"resource", category:"material", en:"Raspberries", ru:"Малина", descriptionEn:"Berries gathered from Meadows bushes.", descriptionRu:"Ягоды, собираемые с кустов в Лугах.", imageFile:"Raspberries.png", source:item("raspberries") },
    { slug:"mushroom", type:"resource", category:"material", en:"Mushroom", ru:"Гриб", descriptionEn:"A common edible mushroom.", descriptionRu:"Обычный съедобный гриб.", imageFile:"Mushroom.png", source:item("mushroom") },
    { slug:"dandelion", type:"resource", category:"material", en:"Dandelion", ru:"Одуванчик", descriptionEn:"A common yellow flower.", descriptionRu:"Обычный жёлтый цветок.", imageFile:"Dandelion.png", source:item("dandelion") },
    { slug:"honey", type:"resource", category:"material", en:"Honey", ru:"Мёд", descriptionEn:"Sweet food produced by Beehives.", descriptionRu:"Сладкий продукт, производимый ульями.", imageFile:"Honey.png", source:item("honey") },
    { slug:"queen-bee", type:"resource", category:"material", en:"Queen Bee", ru:"Пчелиная матка", descriptionEn:"A queen bee recovered from wild hives.", descriptionRu:"Пчелиная матка из диких ульев.", imageFile:"Queen_bee.png", source:item("queen-bee") },
    { slug:"boar-meat", type:"resource", category:"material", en:"Boar Meat", ru:"Мясо кабана", descriptionEn:"Raw meat dropped by Boars.", descriptionRu:"Сырое мясо, выпадающее с кабанов.", imageFile:"Boar_meat.png", source:item("boar-meat") },
    { slug:"deer-meat", type:"resource", category:"material", en:"Deer Meat", ru:"Мясо оленя", descriptionEn:"Raw meat dropped by Deer.", descriptionRu:"Сырое мясо, выпадающее с оленей.", imageFile:"Deer_meat.png", source:item("deer-meat") },
    { slug:"neck-tail", type:"resource", category:"material", en:"Neck Tail", ru:"Хвост никса", descriptionEn:"Raw tail meat dropped by Necks.", descriptionRu:"Сырой хвост, выпадающий из никсов.", imageFile:"Neck_tail.png", source:item("neck-tail") },
    { slug:"wooden-battle-idol", type:"resource", category:"material", en:"Wooden Battle Idol", ru:"Деревянный боевой идол", descriptionEn:"Meadows-tier Forge of Potential material for weapons.", descriptionRu:"Материал Лугов для усиления оружия в Кузнице потенциала.", imageFile:"Wooden_Battle_Idol.png", source:item("wooden-battle-idol") },
    { slug:"wooden-protection-idol", type:"resource", category:"material", en:"Wooden Protection Idol", ru:"Деревянный защитный идол", descriptionEn:"Meadows-tier Forge of Potential material for armour.", descriptionRu:"Материал Лугов для усиления брони в Кузнице потенциала.", imageFile:"Wooden_Protection_Idol.png", source:item("wooden-protection-idol") },

    { slug:"stone-axe", type:"item", category:"tool", en:"Stone Axe", ru:"Каменный топор", descriptionEn:"A crude axe of stone and wood.", descriptionRu:"Простой топор из камня и дерева.", imageFile:"Stone_axe.png", source:item("stone-axe") },
    { slug:"flint-axe", type:"item", category:"tool", en:"Flint Axe", ru:"Кремнёвый топор", descriptionEn:"Sharper than stone.", descriptionRu:"Острее камня.", imageFile:"Flint_Axe.png", source:item("flint-axe") },
    { slug:"hammer", type:"item", category:"tool", en:"Hammer", ru:"Молот", descriptionEn:"The basic tool used to build and repair structures.", descriptionRu:"Основной инструмент для строительства и ремонта.", imageFile:"Hammer.png", source:item("hammer") },
    { slug:"hoe", type:"item", category:"tool", en:"Hoe", ru:"Мотыга", descriptionEn:"A tool for levelling and shaping terrain.", descriptionRu:"Инструмент для выравнивания и обработки земли.", imageFile:"Hoe.png", source:item("hoe") },
    { slug:"torch", type:"item", category:"weapon", en:"Torch", ru:"Факел", descriptionEn:"A simple hand torch that also deals fire damage.", descriptionRu:"Простой ручной факел, наносящий огненный урон.", imageFile:"Torch.png", source:item("torch") },
    { slug:"club", type:"item", category:"weapon", en:"Club", ru:"Дубина", descriptionEn:"A simple one-handed wooden club.", descriptionRu:"Простая одноручная деревянная дубина.", imageFile:"Club.png", source:item("club") },
    { slug:"crude-bow", type:"item", category:"weapon", en:"Crude Bow", ru:"Простой лук", descriptionEn:"A basic bow for your first hunts.", descriptionRu:"Базовый лук для первых охот.", imageFile:"Crude_Bow.png", source:item("crude-bow") },
    { slug:"flint-knife", type:"item", category:"weapon", en:"Flint Knife", ru:"Кремнёвый нож", descriptionEn:"A fast early knife made with flint.", descriptionRu:"Быстрый ранний нож из кремня.", imageFile:"Flint_Knife.png", source:item("flint-knife") },
    { slug:"flint-spear", type:"item", category:"weapon", en:"Flint Spear", ru:"Кремнёвое копьё", descriptionEn:"A spear tipped with sharp flint.", descriptionRu:"Копьё с острым кремнёвым наконечником.", imageFile:"Flint_Spear.png", source:item("flint-spear") },
    { slug:"wood-shield", type:"item", category:"weapon", en:"Wood Shield", ru:"Деревянный щит", descriptionEn:"An early round shield that can parry.", descriptionRu:"Ранний круглый щит, способный парировать.", imageFile:"Wood_shield.png", source:item("wood-shield") },
    { slug:"wood-tower-shield", type:"item", category:"weapon", en:"Wood Tower Shield", ru:"Деревянный башенный щит", descriptionEn:"A heavy early shield with strong block.", descriptionRu:"Тяжёлый ранний щит с сильным блоком.", imageFile:"Wood_tower_shield.png", source:item("wood-tower-shield") },
    { slug:"wood-arrows-x20", type:"item", category:"weapon", en:"Wood Arrows ×20", ru:"Деревянные стрелы ×20", descriptionEn:"Twenty simple wooden arrows.", descriptionRu:"Двадцать простых деревянных стрел.", imageFile:"Wood_arrow.png", source:item("wood-arrow") },
    { slug:"flinthead-arrows-x20", type:"item", category:"weapon", en:"Flinthead Arrows ×20", ru:"Кремнёвые стрелы ×20", descriptionEn:"Twenty arrows tipped with flint.", descriptionRu:"Двадцать стрел с кремнёвыми наконечниками.", imageFile:"Flinthead_arrow.png", source:item("flinthead-arrow") },
    { slug:"fire-arrows-x20", type:"item", category:"weapon", en:"Fire Arrows ×20", ru:"Огненные стрелы ×20", descriptionEn:"Twenty arrows that ignite targets.", descriptionRu:"Двадцать стрел, поджигающих цели.", imageFile:"Fire_arrow.png", source:item("fire-arrow") },

    { slug:"rag-tunic", type:"item", category:"armor", en:"Rag Tunic", ru:"Тряпичная туника", descriptionEn:"Simple starting body protection.", descriptionRu:"Простая начальная защита корпуса.", imageFile:"Rag_tunic.png", source:item("rag-tunic") },
    { slug:"rag-trousers", type:"item", category:"armor", en:"Rag Trousers", ru:"Тряпичные штаны", descriptionEn:"Simple starting leg protection.", descriptionRu:"Простая начальная защита ног.", imageFile:"Rag_trousers.png", source:item("rag-trousers") },
    { slug:"leather-helmet", type:"item", category:"armor", en:"Leather Helmet", ru:"Кожаный шлем", descriptionEn:"Light leather head protection.", descriptionRu:"Лёгкая кожаная защита головы.", imageFile:"Leather_Helmet.png", source:item("leather-helmet") },
    { slug:"leather-tunic", type:"item", category:"armor", en:"Leather Tunic", ru:"Кожаная туника", descriptionEn:"Light leather body armour.", descriptionRu:"Лёгкая кожаная броня корпуса.", imageFile:"Leather_Tunic.png", source:item("leather-tunic") },
    { slug:"leather-pants", type:"item", category:"armor", en:"Leather Trousers", ru:"Кожаные штаны", descriptionEn:"Light leather leg armour.", descriptionRu:"Лёгкая кожаная защита ног.", imageFile:"Leather_Pants.png", source:item("leather-pants") },
    { slug:"deer-hide-cape", type:"item", category:"armor", en:"Deer Hide Cape", ru:"Плащ из шкуры оленя", descriptionEn:"A simple cape made from deer hide.", descriptionRu:"Простой плащ из оленьей шкуры.", imageFile:"Deer_Hide_Cape.png", source:item("deer-hide-cape") },

    { slug:"cooked-boar-meat", type:"item", category:"food", en:"Cooked Boar Meat", ru:"Жареное мясо кабана", descriptionEn:"Boar meat cooked over a fire.", descriptionRu:"Мясо кабана, приготовленное на огне.", imageFile:"Cooked_boar_meat.png", source:item("cooked-boar-meat") },
    { slug:"cooked-deer-meat", type:"item", category:"food", en:"Cooked Deer Meat", ru:"Жареное мясо оленя", descriptionEn:"Deer meat cooked over a fire.", descriptionRu:"Мясо оленя, приготовленное на огне.", imageFile:"Cooked_deer_meat.png", source:item("cooked-deer-meat") },
    { slug:"grilled-neck-tail", type:"item", category:"food", en:"Grilled Neck Tail", ru:"Жареный хвост никса", descriptionEn:"A Neck tail grilled over a fire.", descriptionRu:"Хвост никса, приготовленный на огне.", imageFile:"Grilled_neck_tail.png", source:item("grilled-neck-tail") },

    { slug:"workbench", type:"item", category:"building", en:"Workbench", ru:"Верстак", descriptionEn:"The first major crafting station.", descriptionRu:"Первая основная ремесленная станция.", imageFile:"Workbench.png", source:building("workbench") },
    { slug:"chopping-block", type:"item", category:"building", en:"Chopping Block", ru:"Колода для рубки", descriptionEn:"The first Workbench upgrade.", descriptionRu:"Первое улучшение верстака.", imageFile:"Chopping_block.png", source:building("chopping-block") },
    { slug:"tanning-rack", type:"item", category:"building", en:"Tanning Rack", ru:"Дубильная стойка", descriptionEn:"A Workbench upgrade for leatherworking.", descriptionRu:"Улучшение верстака для работы с кожей.", imageFile:"Tanning_rack.png", source:building("tanning-rack") },
    { slug:"cooking-station", type:"item", category:"building", en:"Cooking Station", ru:"Кулинарная стойка", descriptionEn:"A wooden rack for cooking small meat over a fire.", descriptionRu:"Деревянная стойка для приготовления мяса над огнём.", imageFile:"Cooking_station.png", source:building("cooking-station") },
    { slug:"beehive", type:"item", category:"building", en:"Beehive", ru:"Улей", descriptionEn:"Produces Honey when the bees are happy.", descriptionRu:"Производит мёд, когда пчёлы довольны.", imageFile:"Beehive.png", source:building("beehive") },
    { slug:"raft", type:"item", category:"building", en:"Raft", ru:"Плот", descriptionEn:"A slow early vessel for crossing water.", descriptionRu:"Медленное раннее судно для переправ через воду.", imageFile:"Raft.png", source:building("raft") },
    { slug:"chest", type:"item", category:"building", en:"Chest", ru:"Сундук", descriptionEn:"Basic ten-slot storage.", descriptionRu:"Базовое хранилище на десять ячеек.", imageFile:"Chest.png", source:building("chest") }
  ],
  recipes: [
    { item:"stone-axe", station:"inventory", ingredients:[["wood",5],["stone",4]] },
    { item:"flint-axe", station:"workbench", ingredients:[["wood",4],["flint",6]] },
    { item:"hammer", station:"inventory", ingredients:[["wood",3],["stone",2]] },
    { item:"hoe", station:"workbench", ingredients:[["wood",5],["stone",2]] },
    { item:"torch", station:"inventory", ingredients:[["wood",1],["resin",1]] },
    { item:"club", station:"inventory", ingredients:[["wood",6]] },
    { item:"crude-bow", station:"workbench", ingredients:[["wood",10],["leather-scraps",8]] },
    { item:"flint-knife", station:"workbench", ingredients:[["wood",2],["flint",4],["leather-scraps",2]] },
    { item:"flint-spear", station:"workbench", ingredients:[["wood",5],["flint",10],["leather-scraps",2]] },
    { item:"wood-shield", station:"workbench", ingredients:[["wood",10],["resin",4],["leather-scraps",4]] },
    { item:"wood-tower-shield", station:"workbench", ingredients:[["wood",10],["leather-scraps",6]] },
    { item:"wood-arrows-x20", station:"workbench", output:20, ingredients:[["wood",8]] },
    { item:"flinthead-arrows-x20", station:"workbench", level:2, output:20, ingredients:[["wood",8],["flint",2],["feathers",2]] },
    { item:"fire-arrows-x20", station:"workbench", level:2, output:20, ingredients:[["wood",8],["resin",8],["feathers",2]] },

    { item:"rag-tunic", station:"workbench", ingredients:[["leather-scraps",5]] },
    { item:"rag-trousers", station:"workbench", ingredients:[["leather-scraps",5]] },
    { item:"leather-helmet", station:"workbench", level:2, ingredients:[["deer-hide",6]] },
    { item:"leather-tunic", station:"workbench", level:2, ingredients:[["deer-hide",6]] },
    { item:"leather-pants", station:"workbench", level:2, ingredients:[["deer-hide",6]] },
    { item:"deer-hide-cape", station:"workbench", ingredients:[["deer-hide",4],["bone-fragments",5]] },

    { item:"cooked-boar-meat", station:"cooking-station", ingredients:[["boar-meat",1]] },
    { item:"cooked-deer-meat", station:"cooking-station", ingredients:[["deer-meat",1]] },
    { item:"grilled-neck-tail", station:"cooking-station", ingredients:[["neck-tail",1]] },

    { item:"workbench", station:"hammer", ingredients:[["wood",10]] },
    { item:"chopping-block", station:"hammer", ingredients:[["wood",10],["flint",10]] },
    { item:"tanning-rack", station:"hammer", ingredients:[["wood",10],["flint",15],["leather-scraps",20],["deer-hide",5]] },
    { item:"cooking-station", station:"hammer", ingredients:[["wood",2]] },
    { item:"beehive", station:"hammer", ingredients:[["wood",10],["queen-bee",1]] },
    { item:"raft", station:"hammer", ingredients:[["wood",20],["leather-scraps",6],["resin",6]] },
    { item:"chest", station:"hammer", ingredients:[["wood",10]] }
  ],
  upgrades: [
    { item:"flint-axe", level:2, stationLevel:2, ingredients:[["flint",3],["leather-scraps",2]] },
    { item:"flint-axe", level:3, stationLevel:3, ingredients:[["flint",6],["leather-scraps",4]] },
    { item:"flint-axe", level:4, stationLevel:4, ingredients:[["flint",12],["leather-scraps",8]] },
    { item:"club", level:2, stationLevel:1, ingredients:[["bone-fragments",5]] },
    { item:"club", level:3, stationLevel:1, ingredients:[["bone-fragments",10]] },
    { item:"club", level:4, stationLevel:1, ingredients:[["bone-fragments",20]] },
    { item:"flint-knife", level:2, stationLevel:2, ingredients:[["flint",2]] },
    { item:"flint-knife", level:3, stationLevel:3, ingredients:[["flint",4]] },
    { item:"flint-knife", level:4, stationLevel:4, ingredients:[["flint",8]] },
    ...["leather-helmet","leather-tunic","leather-pants"].flatMap(itemSlug => [
      { item:itemSlug, level:2, stationLevel:3, ingredients:[["deer-hide",6],["bone-fragments",5]] as Array<[string,number]> },
      { item:itemSlug, level:3, stationLevel:4, ingredients:[["deer-hide",12],["bone-fragments",10]] as Array<[string,number]> },
      { item:itemSlug, level:4, stationLevel:5, ingredients:[["deer-hide",24],["bone-fragments",20]] as Array<[string,number]> }
    ]),
    { item:"deer-hide-cape", level:2, stationLevel:2, ingredients:[["deer-hide",4],["bone-fragments",5]] },
    { item:"deer-hide-cape", level:3, stationLevel:3, ingredients:[["deer-hide",8],["bone-fragments",10]] },
    { item:"deer-hide-cape", level:4, stationLevel:4, ingredients:[["deer-hide",16],["bone-fragments",20]] }
  ],
  stats: [
    ["stone-axe","slash_damage","15"],["stone-axe","chop","20"],["stone-axe","durability","100"],
    ["flint-axe","slash_damage","20"],["flint-axe","chop","30"],["flint-axe","durability","100"],["flint-axe","stamina_use","6"],
    ["club","blunt_damage","12"],["club","durability","100"],
    ["crude-bow","pierce_damage","22"],["crude-bow","durability","50"],
    ["flint-knife","slash_damage","6"],["flint-knife","pierce_damage","6"],["flint-knife","durability","100"],
    ["flint-spear","pierce_damage","20"],["flint-spear","durability","100"],
    ["wood-shield","block_armor","6"],["wood-shield","durability","200"],
    ["wood-tower-shield","block_armor","10"],["wood-tower-shield","durability","200"],
    ["wood-arrows-x20","pierce_damage","22"],["flinthead-arrows-x20","pierce_damage","27"],["fire-arrows-x20","pierce_damage","11"],["fire-arrows-x20","fire_damage","22"],
    ["rag-tunic","armor","1"],["rag-trousers","armor","1"],
    ["leather-helmet","armor","2"],["leather-tunic","armor","2"],["leather-pants","armor","2"],["deer-hide-cape","armor","1"]
  ],
  resourceSources: [
    ["wood","Pick branches from the ground or chop Meadows trees.","Собирайте ветви или рубите деревья в Лугах.",item("wood")],
    ["stone","Pick stones from the ground or mine rocks.","Собирайте камни или добывайте их из скал.",item("stone")],
    ["flint","Gather along Meadows shorelines.","Собирается вдоль берегов Лугов.",item("flint")],
    ["resin","Dropped by Greylings and Greydwarfs.","Выпадает из грейлингов и грейдворфов.",item("resin")],
    ["leather-scraps","Dropped by Boars.","Выпадает с кабанов.",item("leather-scraps")],
    ["deer-hide","Dropped by Deer.","Выпадает с оленей.",item("deer-hide")],
    ["queen-bee","Destroy wild Beehives in abandoned Meadows buildings.","Разрушайте дикие ульи в заброшенных домах Лугов.",item("queen-bee")],
    ["wooden-battle-idol","Rare Meadows chest loot for the Forge of Potential.","Редкая добыча из сундуков Лугов для Кузницы потенциала.",item("wooden-battle-idol")],
    ["wooden-protection-idol","Rare Meadows chest loot for the Forge of Potential.","Редкая добыча из сундуков Лугов для Кузницы потенциала.",item("wooden-protection-idol")]
  ]
};

export const ensureMeadowsCatalog = (env: Env): Promise<void> => applyCatalogSeed(env, meadowsSeed);
