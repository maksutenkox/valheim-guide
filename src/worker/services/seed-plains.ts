import type { Env } from "../env";
import { applyCatalogSeed, type CatalogSeed } from "./catalog-seed";

const item = (slug: string) => `https://www.valheim.tools/items/${slug}`;
const building = (slug: string) => `https://www.valheim.tools/building/${slug}`;

const plainsSeed: CatalogSeed = {
  marker: "catalog_plains_v1",
  biome: "plains",
  stations: [
    { slug: "blast-furnace", en: "Blast Furnace", ru: "Доменная печь" },
    { slug: "spinning-wheel", en: "Spinning Wheel", ru: "Прялка" },
    { slug: "windmill", en: "Windmill", ru: "Мельница" },
    { slug: "food-preparation-table", en: "Food Preparation Table", ru: "Стол приготовления еды" },
    { slug: "stone-oven", en: "Stone Oven", ru: "Каменная печь" }
  ],
  items: [
    { slug:"dragon-tear", type:"resource", category:"material", en:"Dragon Tear", ru:"Драконья слеза", descriptionEn:"A tear dropped by Moder and used to unlock artisan machinery.", descriptionRu:"Слеза Моудер, открывающая ремесленные механизмы.", imageFile:"Dragon_tear.png", source:item("dragon-tear"), biome:"mountains" },
    { slug:"black-metal-scrap", type:"resource", category:"material", en:"Black Metal Scrap", ru:"Обломок чёрного металла", descriptionEn:"Dense metal scrap dropped by Fulings.", descriptionRu:"Плотный металлический лом, выпадающий из фулингов.", imageFile:"Black_metal_scrap.png", source:item("black-metal-scrap") },
    { slug:"black-metal", type:"resource", category:"material", en:"Black Metal", ru:"Чёрный металл", descriptionEn:"Black metal ingot smelted in the Blast Furnace.", descriptionRu:"Слиток чёрного металла, выплавляемый в доменной печи.", imageFile:"Black_metal.png", source:item("black-metal") },
    { slug:"flax", type:"resource", category:"material", en:"Flax", ru:"Лён", descriptionEn:"A Plains crop used to make linen thread.", descriptionRu:"Равнинная культура для производства льняной нити.", imageFile:"Flax.png", source:item("flax") },
    { slug:"linen-thread", type:"resource", category:"material", en:"Linen Thread", ru:"Льняная нить", descriptionEn:"Thread spun from flax for Plains-tier gear.", descriptionRu:"Нить из льна для экипировки уровня Равнин.", imageFile:"Linen_thread.png", source:item("linen-thread") },
    { slug:"barley", type:"resource", category:"material", en:"Barley", ru:"Ячмень", descriptionEn:"A Plains crop used for flour and barley wine.", descriptionRu:"Равнинная культура для муки и ячменного вина.", imageFile:"Barley.png", source:item("barley") },
    { slug:"barley-flour", type:"resource", category:"material", en:"Barley Flour", ru:"Ячменная мука", descriptionEn:"Flour ground from barley in a Windmill.", descriptionRu:"Мука из ячменя, перемолотого в мельнице.", imageFile:"Barley_flour.png", source:item("barley-flour") },
    { slug:"needle", type:"resource", category:"material", en:"Needle", ru:"Игла", descriptionEn:"A razor-sharp needle dropped by Deathsquitos.", descriptionRu:"Острая игла, выпадающая из комаров смерти.", imageFile:"Needle.png", source:item("needle") },
    { slug:"lox-pelt", type:"resource", category:"material", en:"Lox Pelt", ru:"Шкура локса", descriptionEn:"A thick hide dropped by Lox.", descriptionRu:"Толстая шкура, выпадающая из локсов.", imageFile:"Lox_pelt.png", source:item("lox-pelt") },
    { slug:"lox-meat", type:"resource", category:"material", en:"Lox Meat", ru:"Мясо локса", descriptionEn:"Raw meat dropped by Lox.", descriptionRu:"Сырое мясо, выпадающее из локсов.", imageFile:"Lox_meat.png", source:item("lox-meat") },
    { slug:"lox-trophy", type:"resource", category:"material", en:"Lox Trophy", ru:"Трофей: локс", descriptionEn:"A rare trophy from Lox.", descriptionRu:"Редкий трофей с локса.", imageFile:"Lox_trophy.png", source:item("lox-trophy") },
    { slug:"cloudberries", type:"resource", category:"material", en:"Cloudberries", ru:"Морошка", descriptionEn:"Golden berries gathered across the Plains.", descriptionRu:"Золотистые ягоды, собираемые на Равнинах.", imageFile:"Cloudberries.png", source:item("cloudberries") },
    { slug:"tar", type:"resource", category:"material", en:"Tar", ru:"Смола", descriptionEn:"Dark tar gathered from Growths and tar pits.", descriptionRu:"Тёмная смола из наростов и смоляных ям.", imageFile:"Tar.png", source:item("tar") },
    { slug:"goblin-totem", type:"resource", category:"material", en:"Fuling Totem", ru:"Тотем фулинга", descriptionEn:"A ritual totem used to summon Yagluth.", descriptionRu:"Ритуальный тотем для призыва Яглута.", imageFile:"Goblin_totem.png", source:item("fuiling-totem") },
    { slug:"fuling-berserker-trophy", type:"resource", category:"material", en:"Fuling Berserker Trophy", ru:"Трофей: фулинг-берсерк", descriptionEn:"A rare trophy from Fuling Berserkers.", descriptionRu:"Редкий трофей с фулингов-берсерков.", imageFile:"Fuling_Berserker_trophy.png", source:item("fuling-berserker-trophy") },
    { slug:"black-metal-battle-idol", type:"resource", category:"material", en:"Black Metal Battle Idol", ru:"Боевой идол чёрного металла", descriptionEn:"Plains-tier Forge of Potential material for weapons.", descriptionRu:"Материал Равнин для усиления оружия в Кузнице потенциала.", imageFile:"Black_Metal_Battle_Idol.png", source:item("black-metal-battle-idol") },
    { slug:"black-metal-protection-idol", type:"resource", category:"material", en:"Black Metal Protection Idol", ru:"Защитный идол чёрного металла", descriptionEn:"Plains-tier Forge of Potential material for armour.", descriptionRu:"Материал Равнин для усиления брони в Кузнице потенциала.", imageFile:"Black_Metal_Protection_Idol.png", source:item("black-metal-protection-idol") },
    { slug:"cooked-fish", type:"resource", category:"material", en:"Cooked Fish", ru:"Жареная рыба", descriptionEn:"Cooked fish used in advanced meals.", descriptionRu:"Приготовленная рыба для сложных блюд.", imageFile:"Cooked_fish.png", source:item("cooked-fish"), biome:"ocean" },

    { slug:"black-metal-sword", type:"item", category:"weapon", en:"Black Metal Sword", ru:"Меч из чёрного металла", descriptionEn:"A fast one-handed sword of black metal.", descriptionRu:"Быстрый одноручный меч из чёрного металла.", imageFile:"Blackmetal_sword.png", source:item("black-metal-sword") },
    { slug:"black-metal-atgeir", type:"item", category:"weapon", en:"Black Metal Atgeir", ru:"Атгейр из чёрного металла", descriptionEn:"A long polearm with a powerful sweeping attack.", descriptionRu:"Длинное древковое оружие с мощной круговой атакой.", imageFile:"Blackmetal_atgeir.png", source:item("black-metal-atgeir") },
    { slug:"black-metal-axe", type:"item", category:"weapon", en:"Black Metal Axe", ru:"Топор из чёрного металла", descriptionEn:"A top-tier axe for combat and woodcutting.", descriptionRu:"Мощный топор для боя и рубки деревьев.", imageFile:"Blackmetal_axe.png", source:item("black-metal-axe") },
    { slug:"black-metal-battleaxe", type:"item", category:"weapon", en:"Black Metal Battleaxe", ru:"Секира из чёрного металла", descriptionEn:"A heavy two-handed axe with no multi-target penalty.", descriptionRu:"Тяжёлая двуручная секира без штрафа по нескольким целям.", imageFile:"Blackmetal_battleaxe.png", source:item("black-metal-battleaxe") },
    { slug:"black-metal-knife", type:"item", category:"weapon", en:"Black Metal Knife", ru:"Нож из чёрного металла", descriptionEn:"A fast knife with powerful backstabs.", descriptionRu:"Быстрый нож с мощными ударами в спину.", imageFile:"Blackmetal_knife.png", source:item("black-metal-knife") },
    { slug:"porcupine", type:"item", category:"weapon", en:"Porcupine", ru:"Дикобраз", descriptionEn:"A spiked mace mixing blunt and pierce damage.", descriptionRu:"Шипастая булава с дробящим и колющим уроном.", imageFile:"Porcupine.png", source:item("porcupine") },
    { slug:"black-metal-shield", type:"item", category:"weapon", en:"Black Metal Shield", ru:"Щит из чёрного металла", descriptionEn:"A strong round shield that can parry.", descriptionRu:"Прочный круглый щит, способный парировать.", imageFile:"Blackmetal_shield.png", source:item("black-metal-shield") },
    { slug:"black-metal-tower-shield", type:"item", category:"weapon", en:"Black Metal Tower Shield", ru:"Башенный щит из чёрного металла", descriptionEn:"A massive tower shield with exceptional block.", descriptionRu:"Массивный башенный щит с очень сильным блоком.", imageFile:"Blackmetal_tower_shield.png", source:item("black-metal-tower-shield") },
    { slug:"needle-arrows-x20", type:"item", category:"weapon", en:"Needle Arrows ×20", ru:"Стрелы-иглы ×20", descriptionEn:"Twenty light, deadly needle arrows.", descriptionRu:"Двадцать лёгких и смертоносных стрел-игл.", imageFile:"Needle_arrow.png", source:item("needle-arrow") },

    { slug:"padded-helmet", type:"item", category:"armor", en:"Padded Helmet", ru:"Стёганый шлем", descriptionEn:"A strong padded iron helmet.", descriptionRu:"Прочный стёганый шлем с железом.", imageFile:"Padded_helmet.png", source:item("padded-helmet") },
    { slug:"padded-cuirass", type:"item", category:"armor", en:"Padded Cuirass", ru:"Стёганая кираса", descriptionEn:"Heavy padded body armour reinforced with iron.", descriptionRu:"Тяжёлая стёганая броня корпуса, усиленная железом.", imageFile:"Padded_cuirass.png", source:item("padded-cuirass") },
    { slug:"padded-greaves", type:"item", category:"armor", en:"Padded Greaves", ru:"Стёганые поножи", descriptionEn:"Heavy padded leg armour reinforced with iron.", descriptionRu:"Тяжёлая стёганая защита ног, усиленная железом.", imageFile:"Padded_greaves.png", source:item("padded-greaves") },
    { slug:"linen-cape", type:"item", category:"armor", en:"Linen Cape", ru:"Льняной плащ", descriptionEn:"A simple cape woven from linen thread.", descriptionRu:"Простой плащ из льняной нити.", imageFile:"Linen_cape.png", source:item("linen-cape") },
    { slug:"lox-cape", type:"item", category:"armor", en:"Lox Cape", ru:"Плащ из шкуры локса", descriptionEn:"A warm cape that resists frost.", descriptionRu:"Тёплый плащ с сопротивлением морозу.", imageFile:"Lox_cape.png", source:item("lox-cape") },
    { slug:"lox-fur-hood", type:"item", category:"armor", en:"Lox Fur Hood", ru:"Капюшон из меха локса", descriptionEn:"Light Plains armour with the Boon of the Lox set bonus.", descriptionRu:"Лёгкая броня Равнин с бонусом комплекта «Благословение локса».", imageFile:"Lox_Fur_Hood.png", source:item("lox-fur-hood") },
    { slug:"lox-fur-jacket", type:"item", category:"armor", en:"Lox Fur Jacket", ru:"Куртка из меха локса", descriptionEn:"Light body armour from lox fur and roots.", descriptionRu:"Лёгкая броня корпуса из меха локса и корней.", imageFile:"Lox_Fur_Jacket.png", source:item("lox-fur-jacket") },
    { slug:"lox-fur-trousers", type:"item", category:"armor", en:"Lox Fur Trousers", ru:"Штаны из меха локса", descriptionEn:"Light leg armour from lox fur and roots.", descriptionRu:"Лёгкая защита ног из меха локса и корней.", imageFile:"Lox_Fur_Trousers.png", source:item("lox-fur-trousers") },

    { slug:"evasion-mantle", type:"item", category:"trinket", en:"Evasion Mantle", ru:"Мантия уклонения", descriptionEn:"A Plains trinket that strengthens dodging, parrying and block stamina efficiency.", descriptionRu:"Оберег Равнин, усиливающий уклонение, парирование и экономию выносливости при блоке.", imageFile:"Evasion_Mantle.png", source:item("evasion-mantle") },
    { slug:"bracelets-of-the-brave", type:"item", category:"trinket", en:"Bracelets of the Brave", ru:"Браслеты храбреца", descriptionEn:"A Plains trinket focused on blunt weapons and emergency healing.", descriptionRu:"Оберег Равнин для дробящего оружия и экстренного лечения.", imageFile:"Bracelets_of_the_Brave.png", source:item("bracelets-of-the-brave") },

    { slug:"cooked-lox-meat", type:"item", category:"food", en:"Cooked Lox Meat", ru:"Жареное мясо локса", descriptionEn:"A large serving of cooked lox meat.", descriptionRu:"Большая порция приготовленного мяса локса.", imageFile:"Cooked_lox_meat.png", source:item("cooked-lox-meat") },
    { slug:"unbaked-lox-pie", type:"item", category:"food", en:"Unbaked Lox Pie", ru:"Сырой пирог с локсом", descriptionEn:"Prepared lox pie ready for the stone oven.", descriptionRu:"Подготовленный пирог с локсом для каменной печи.", imageFile:"Unbaked_lox_pie.png", source:item("unbaked-lox-pie") },
    { slug:"lox-meat-pie", type:"item", category:"food", en:"Lox Meat Pie", ru:"Пирог с мясом локса", descriptionEn:"A powerful baked health food.", descriptionRu:"Мощная запечённая еда на здоровье.", imageFile:"Lox_meat_pie.png", source:item("lox-meat-pie") },
    { slug:"bread-dough", type:"item", category:"food", en:"Bread Dough", ru:"Тесто для хлеба", descriptionEn:"Barley dough ready for the stone oven.", descriptionRu:"Ячменное тесто для каменной печи.", imageFile:"Bread_dough.png", source:item("bread-dough") },
    { slug:"bread", type:"item", category:"food", en:"Bread", ru:"Хлеб", descriptionEn:"A cheap Plains stamina food.", descriptionRu:"Недорогая еда Равнин на выносливость.", imageFile:"Bread.png", source:item("bread") },
    { slug:"blood-pudding", type:"item", category:"food", en:"Blood Pudding", ru:"Кровяная колбаса", descriptionEn:"A high-stamina Plains food made with blood and barley flour.", descriptionRu:"Еда Равнин на выносливость из крови и ячменной муки.", imageFile:"Blood_pudding.png", source:item("blood-pudding") },
    { slug:"fish-wraps", type:"item", category:"food", en:"Fish Wraps", ru:"Рыбные рулеты", descriptionEn:"A high-health meal of cooked fish and barley flour.", descriptionRu:"Сытное блюдо из жареной рыбы и ячменной муки.", imageFile:"Fish_wraps.png", source:item("fish-wraps") },

    { slug:"barley-wine-base-fire-resistance", type:"item", category:"consumable", en:"Barley Wine Base: Fire Resistance", ru:"Основа ячменного вина: сопротивление огню", descriptionEn:"A barley wine base ready for fermentation.", descriptionRu:"Основа ячменного вина для ферментации.", imageFile:"Barley_wine_base.png", source:item("barley-wine-base-fire-resistance") },
    { slug:"fire-resistance-barley-wine-x6", type:"item", category:"consumable", en:"Fire Resistance Barley Wine ×6", ru:"Ячменное вино сопротивления огню ×6", descriptionEn:"Six bottles of fermented fire resistance barley wine.", descriptionRu:"Шесть бутылок ферментированного ячменного вина сопротивления огню.", imageFile:"Fire_resistance_barley_wine.png", source:item("fire-resistance-barley-wine") },
    { slug:"lox-saddle", type:"item", category:"tool", en:"Lox Saddle", ru:"Седло локса", descriptionEn:"A saddle that lets you ride a tamed Lox.", descriptionRu:"Седло для езды на прирученном локсе.", imageFile:"Lox_saddle.png", source:item("lox-saddle") },

    { slug:"artisan-table", type:"item", category:"building", en:"Artisan Table", ru:"Стол ремесленника", descriptionEn:"Unlocks advanced Plains crafting machinery.", descriptionRu:"Открывает продвинутые механизмы Равнин.", imageFile:"Artisan_table.png", source:building("artisan-table") },
    { slug:"blast-furnace", type:"item", category:"building", en:"Blast Furnace", ru:"Доменная печь", descriptionEn:"Smelts black metal scrap.", descriptionRu:"Переплавляет обломки чёрного металла.", imageFile:"Blast_furnace.png", source:building("blast-furnace") },
    { slug:"spinning-wheel", type:"item", category:"building", en:"Spinning Wheel", ru:"Прялка", descriptionEn:"Spins flax into linen thread.", descriptionRu:"Прядёт лён в льняную нить.", imageFile:"Spinning_wheel.png", source:building("spinning-wheel") },
    { slug:"windmill", type:"item", category:"building", en:"Windmill", ru:"Мельница", descriptionEn:"Grinds barley into barley flour.", descriptionRu:"Перемалывает ячмень в ячменную муку.", imageFile:"Windmill.png", source:building("windmill") },
    { slug:"food-preparation-table", type:"item", category:"building", en:"Food Preparation Table", ru:"Стол приготовления еды", descriptionEn:"Prepares foods that need a final baking step.", descriptionRu:"Подготавливает блюда, которые затем нужно запекать.", imageFile:"Food_preparation_table.png", source:building("food-preparation-table") },
    { slug:"stone-oven", type:"item", category:"building", en:"Stone Oven", ru:"Каменная печь", descriptionEn:"Bakes advanced doughs and pies.", descriptionRu:"Запекает сложное тесто и пироги.", imageFile:"Stone_oven.png", source:building("stone-oven") }
  ],
  recipes: [
    { item:"black-metal", station:"blast-furnace", ingredients:[["black-metal-scrap",1]] },
    { item:"linen-thread", station:"spinning-wheel", ingredients:[["flax",1]] },
    { item:"barley-flour", station:"windmill", ingredients:[["barley",1]] },

    { item:"black-metal-sword", station:"forge", level:4, ingredients:[["finewood",2],["black-metal",20],["linen-thread",5]] },
    { item:"black-metal-atgeir", station:"forge", level:4, ingredients:[["finewood",10],["black-metal",30],["linen-thread",5]] },
    { item:"black-metal-axe", station:"forge", level:4, ingredients:[["finewood",6],["black-metal",20],["linen-thread",5]] },
    { item:"black-metal-battleaxe", station:"forge", level:4, ingredients:[["finewood",10],["black-metal",30],["linen-thread",5]] },
    { item:"black-metal-knife", station:"forge", level:4, ingredients:[["finewood",4],["black-metal",10],["linen-thread",5]] },
    { item:"porcupine", station:"forge", level:4, ingredients:[["finewood",5],["iron",20],["needle",5],["linen-thread",10]] },
    { item:"black-metal-shield", station:"forge", level:3, ingredients:[["finewood",10],["black-metal",8],["chain",5]] },
    { item:"black-metal-tower-shield", station:"forge", level:3, ingredients:[["finewood",15],["black-metal",10],["chain",7]] },
    { item:"needle-arrows-x20", station:"workbench", level:4, output:20, ingredients:[["needle",4],["feathers",2]] },

    { item:"padded-helmet", station:"forge", ingredients:[["iron",10],["linen-thread",15]] },
    { item:"padded-cuirass", station:"forge", level:2, ingredients:[["iron",10],["linen-thread",20]] },
    { item:"padded-greaves", station:"forge", level:2, ingredients:[["iron",10],["linen-thread",20]] },
    { item:"linen-cape", station:"workbench", level:2, ingredients:[["linen-thread",20],["silver",1]] },
    { item:"lox-cape", station:"workbench", level:2, ingredients:[["lox-pelt",6],["silver",2]] },
    { item:"lox-fur-hood", station:"workbench", level:2, ingredients:[["lox-pelt",4],["bone-fragments",4],["writhan-roots",2]] },
    { item:"lox-fur-jacket", station:"workbench", level:2, ingredients:[["lox-pelt",5],["bone-fragments",8],["root",2]] },
    { item:"lox-fur-trousers", station:"workbench", level:2, ingredients:[["lox-pelt",5],["bone-fragments",8],["root",2]] },

    { item:"evasion-mantle", station:"forge", ingredients:[["black-metal",5],["fuling-berserker-trophy",1],["linen-thread",10]] },
    { item:"bracelets-of-the-brave", station:"forge", ingredients:[["black-metal",5],["lox-pelt",5],["lox-trophy",1]] },

    { item:"cooked-lox-meat", station:"iron-cooking-station", ingredients:[["lox-meat",1]] },
    { item:"unbaked-lox-pie", station:"food-preparation-table", ingredients:[["cloudberries",2],["lox-meat",2],["barley-flour",4]] },
    { item:"lox-meat-pie", station:"stone-oven", ingredients:[["unbaked-lox-pie",1]] },
    { item:"bread-dough", station:"food-preparation-table", output:2, ingredients:[["barley-flour",10]] },
    { item:"bread", station:"stone-oven", ingredients:[["bread-dough",1]] },
    { item:"blood-pudding", station:"cauldron", level:4, ingredients:[["thistle",2],["bloodbag",2],["barley-flour",4]] },
    { item:"fish-wraps", station:"cauldron", level:4, ingredients:[["cooked-fish",2],["barley-flour",4]] },
    { item:"barley-wine-base-fire-resistance", station:"mead-ketill", ingredients:[["barley",10],["cloudberries",10]] },
    { item:"fire-resistance-barley-wine-x6", station:"fermenter", output:6, ingredients:[["barley-wine-base-fire-resistance",1]] },

    { item:"lox-saddle", station:"workbench", ingredients:[["leather-scraps",10],["linen-thread",20],["black-metal",15]] },
    { item:"artisan-table", station:"hammer", ingredients:[["wood",10],["dragon-tear",2]] },
    { item:"blast-furnace", station:"hammer", ingredients:[["stone",20],["surtling-core",5],["iron",10],["finewood",20]] },
    { item:"spinning-wheel", station:"hammer", ingredients:[["finewood",20],["iron-nails",10],["leather-scraps",5]] },
    { item:"windmill", station:"hammer", ingredients:[["stone",20],["wood",30],["iron-nails",30]] },
    { item:"food-preparation-table", station:"hammer", ingredients:[["iron",5],["finewood",20],["leather-scraps",15]] },
    { item:"stone-oven", station:"hammer", ingredients:[["iron",15],["stone",20],["surtling-core",4]] }
  ],
  upgrades: [
    ...["black-metal-sword","black-metal-axe"].flatMap(itemSlug => [
      { item:itemSlug, level:2, stationLevel:5, ingredients:[["black-metal",10],["linen-thread",5]] as Array<[string,number]> },
      { item:itemSlug, level:3, stationLevel:6, ingredients:[["black-metal",20],["linen-thread",10]] as Array<[string,number]> },
      { item:itemSlug, level:4, stationLevel:7, ingredients:[["black-metal",40],["linen-thread",20]] as Array<[string,number]> }
    ]),
    ...["black-metal-atgeir","black-metal-battleaxe"].flatMap(itemSlug => [
      { item:itemSlug, level:2, stationLevel:5, ingredients:[["black-metal",15],["linen-thread",5]] as Array<[string,number]> },
      { item:itemSlug, level:3, stationLevel:6, ingredients:[["black-metal",30],["linen-thread",10]] as Array<[string,number]> },
      { item:itemSlug, level:4, stationLevel:7, ingredients:[["black-metal",60],["linen-thread",20]] as Array<[string,number]> }
    ]),
    { item:"black-metal-knife", level:2, stationLevel:5, ingredients:[["black-metal",4],["linen-thread",5]] },
    { item:"black-metal-knife", level:3, stationLevel:6, ingredients:[["black-metal",8],["linen-thread",10]] },
    { item:"black-metal-knife", level:4, stationLevel:7, ingredients:[["black-metal",16],["linen-thread",20]] },
    { item:"porcupine", level:2, stationLevel:5, ingredients:[["iron",2],["needle",2]] },
    { item:"porcupine", level:3, stationLevel:6, ingredients:[["iron",4],["needle",4]] },
    { item:"porcupine", level:4, stationLevel:7, ingredients:[["iron",8],["needle",8]] },
    { item:"black-metal-shield", level:2, stationLevel:4, ingredients:[["finewood",10],["black-metal",4],["chain",2]] },
    { item:"black-metal-shield", level:3, stationLevel:5, ingredients:[["finewood",20],["black-metal",8],["chain",4]] },
    { item:"black-metal-tower-shield", level:2, stationLevel:4, ingredients:[["finewood",10],["black-metal",4],["chain",2]] },
    { item:"black-metal-tower-shield", level:3, stationLevel:5, ingredients:[["finewood",20],["black-metal",8],["chain",4]] },

    { item:"padded-helmet", level:2, stationLevel:2, ingredients:[["iron",5],["linen-thread",10]] },
    { item:"padded-helmet", level:3, stationLevel:3, ingredients:[["iron",10],["linen-thread",20]] },
    { item:"padded-helmet", level:4, stationLevel:4, ingredients:[["iron",20],["linen-thread",40]] },
    ...["padded-cuirass","padded-greaves"].flatMap(itemSlug => [
      { item:itemSlug, level:2, stationLevel:3, ingredients:[["iron",3],["linen-thread",10]] as Array<[string,number]> },
      { item:itemSlug, level:3, stationLevel:4, ingredients:[["iron",6],["linen-thread",20]] as Array<[string,number]> },
      { item:itemSlug, level:4, stationLevel:5, ingredients:[["iron",12],["linen-thread",40]] as Array<[string,number]> }
    ]),
    { item:"linen-cape", level:2, stationLevel:3, ingredients:[["linen-thread",4]] },
    { item:"linen-cape", level:3, stationLevel:4, ingredients:[["linen-thread",8]] },
    { item:"linen-cape", level:4, stationLevel:5, ingredients:[["linen-thread",16]] },
    { item:"lox-cape", level:2, stationLevel:3, ingredients:[["lox-pelt",2]] },
    { item:"lox-cape", level:3, stationLevel:4, ingredients:[["lox-pelt",4]] },
    { item:"lox-cape", level:4, stationLevel:5, ingredients:[["lox-pelt",8]] },

    { item:"lox-fur-hood", level:2, stationLevel:3, ingredients:[["lox-pelt",2],["bone-fragments",2],["writhan-roots",1]] },
    { item:"lox-fur-hood", level:3, stationLevel:4, ingredients:[["lox-pelt",4],["bone-fragments",4],["writhan-roots",2]] },
    { item:"lox-fur-hood", level:4, stationLevel:5, ingredients:[["lox-pelt",8],["bone-fragments",8],["writhan-roots",4]] },
    { item:"lox-fur-jacket", level:2, stationLevel:3, ingredients:[["lox-pelt",6],["bone-fragments",4],["root",1]] },
    { item:"lox-fur-jacket", level:3, stationLevel:4, ingredients:[["lox-pelt",12],["bone-fragments",8],["root",2]] },
    { item:"lox-fur-jacket", level:4, stationLevel:5, ingredients:[["lox-pelt",24],["bone-fragments",16],["root",4]] },
    { item:"lox-fur-trousers", level:2, stationLevel:3, ingredients:[["lox-pelt",3],["bone-fragments",4],["root",1]] },
    { item:"lox-fur-trousers", level:3, stationLevel:4, ingredients:[["lox-pelt",6],["bone-fragments",8],["root",2]] },
    { item:"lox-fur-trousers", level:4, stationLevel:5, ingredients:[["lox-pelt",12],["bone-fragments",16],["root",4]] }
  ],
  stats: [
    ["black-metal-sword","slash_damage","95"],["black-metal-sword","durability","200"],["black-metal-sword","stamina_use","14"],
    ["black-metal-atgeir","pierce_damage","105"],["black-metal-atgeir","durability","175"],["black-metal-atgeir","stamina_use","18"],
    ["black-metal-axe","slash_damage","100"],["black-metal-axe","chop","60"],["black-metal-axe","durability","175"],["black-metal-axe","stamina_use","14"],
    ["black-metal-battleaxe","slash_damage","110"],["black-metal-battleaxe","chop","60"],["black-metal-battleaxe","durability","200"],["black-metal-battleaxe","stamina_use","20"],
    ["black-metal-knife","slash_damage","34"],["black-metal-knife","pierce_damage","34"],["black-metal-knife","durability","200"],["black-metal-knife","stamina_use","12"],
    ["porcupine","blunt_damage","50"],["porcupine","pierce_damage","45"],["porcupine","durability","150"],["porcupine","stamina_use","14"],
    ["black-metal-shield","block_armor","78"],["black-metal-shield","durability","200"],
    ["black-metal-tower-shield","block_armor","104"],["black-metal-tower-shield","durability","200"],
    ["needle-arrows-x20","pierce_damage","62"],

    ["padded-helmet","armor","26"],["padded-cuirass","armor","26"],["padded-greaves","armor","26"],["linen-cape","armor","1"],["lox-cape","armor","1"],
    ["lox-fur-hood","armor","16"],["lox-fur-jacket","armor","16"],["lox-fur-trousers","armor","16"],
    ["evasion-mantle","adrenaline","60"],["evasion-mantle","duration","120","s"],
    ["bracelets-of-the-brave","adrenaline","85"],["bracelets-of-the-brave","duration","60","s"],

    ["cooked-lox-meat","health","50"],["cooked-lox-meat","stamina","16"],["cooked-lox-meat","duration","20","min"],["cooked-lox-meat","healing","4","hp/tick"],
    ["lox-meat-pie","health","75"],["lox-meat-pie","stamina","24"],["lox-meat-pie","duration","30","min"],["lox-meat-pie","healing","4","hp/tick"],
    ["bread","health","23"],["bread","stamina","70"],["bread","duration","25","min"],["bread","healing","2","hp/tick"],
    ["blood-pudding","health","25"],["blood-pudding","stamina","75"],["blood-pudding","duration","30","min"],["blood-pudding","healing","2","hp/tick"],
    ["fish-wraps","health","70"],["fish-wraps","stamina","23"],["fish-wraps","duration","25","min"],["fish-wraps","healing","4","hp/tick"]
  ],
  resourceSources: [
    ["black-metal-scrap","Dropped by Fulings and Fuling Berserkers.","Выпадает из фулингов и фулингов-берсерков.",item("black-metal-scrap")],
    ["black-metal","Smelt Black Metal Scrap in a Blast Furnace.","Переплавьте обломки чёрного металла в доменной печи.",item("black-metal")],
    ["flax","Found in Fuling villages and grown only in the Plains.","Находится в деревнях фулингов и выращивается только на Равнинах.",item("flax")],
    ["linen-thread","Spin Flax in a Spinning Wheel.","Прядите лён на прялке.",item("linen-thread")],
    ["barley","Found in Fuling villages and grown only in the Plains.","Находится в деревнях фулингов и выращивается только на Равнинах.",item("barley")],
    ["barley-flour","Process Barley in a Windmill.","Перерабатывайте ячмень в мельнице.",item("barley-flour")],
    ["needle","Dropped by Deathsquitos.","Выпадает из комаров смерти.",item("needle")],
    ["lox-pelt","Dropped by Lox.","Выпадает из локсов.",item("lox-pelt")],
    ["lox-meat","Dropped by Lox.","Выпадает из локсов.",item("lox-meat")],
    ["cloudberries","Gathered from cloudberry plants across the Plains.","Собирается с кустов морошки на Равнинах.",item("cloudberries")],
    ["tar","Gathered from Tar Pits and dropped by Growths.","Добывается в смоляных ямах и выпадает из наростов.",item("tar")],
    ["goblin-totem","Dropped by Fuling Berserkers and found in Fuling villages; five summon Yagluth.","Выпадает из фулингов-берсерков и находится в деревнях; пять тотемов призывают Яглута.",item("fuiling-totem")],
    ["black-metal-battle-idol","Rare Plains-tier loot used at the Forge of Potential.","Редкая добыча Равнин для Кузницы потенциала.",item("black-metal-battle-idol")],
    ["black-metal-protection-idol","Rare Plains-tier loot used at the Forge of Potential.","Редкая добыча Равнин для Кузницы потенциала.",item("black-metal-protection-idol")]
  ]
};

export const ensurePlainsCatalog = (env: Env): Promise<void> => applyCatalogSeed(env, plainsSeed);
