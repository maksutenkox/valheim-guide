import type { Env } from "../env";
import { applyCatalogSeed, type CatalogSeed } from "./catalog-seed";

const item = (slug: string) => `https://www.valheim.tools/items/${slug}`;
const building = (slug: string) => `https://www.valheim.tools/building/${slug}`;

const seeds: CatalogSeed[] = [
  {
    marker: "catalog_special_drops_meadows_v1",
    biome: "meadows",
    items: [
      {
        slug: "hard-antler", type: "resource", category: "material",
        en: "Hard Antler", ru: "Твёрдый рог",
        descriptionEn: "A piece of Eikthyr's hard antler. It unlocks the first mining pickaxe.",
        descriptionRu: "Кусок твёрдого рога Эйктюра. Из него создаётся первая кирка для добычи руды.",
        imageFile: "hard-antler.png", source: item("hard-antler"), sourceName: "Valheim.tools"
      },
      {
        slug: "antler-pickaxe", type: "item", category: "tool",
        en: "Antler Pickaxe", ru: "Кирка из рога",
        descriptionEn: "The first mining pickaxe, able to mine stone, copper, tin, muddy scrap piles and abyssal barnacles.",
        descriptionRu: "Первая шахтёрская кирка. Добывает камень, медь, олово, грязные груды металлолома и абиссальные ракушки.",
        imageFile: "antler-pickaxe.png", source: item("antler-pickaxe"), sourceName: "Valheim.tools"
      }
    ],
    recipes: [
      { item: "antler-pickaxe", station: "workbench", ingredients: [["wood", 10], ["hard-antler", 1]] }
    ],
    stats: [
      ["antler-pickaxe", "pierce", "18"],
      ["antler-pickaxe", "pickaxe", "18"],
      ["antler-pickaxe", "durability", "100"],
      ["antler-pickaxe", "movement", "-5", "%"]
    ],
    resourceSources: [
      ["hard-antler", "Dropped by Eikthyr: 3 per kill.", "Выпадает из Эйктюра: 3 за убийство.", item("hard-antler")]
    ]
  },
  {
    marker: "catalog_special_drops_black_forest_v1",
    biome: "black-forest",
    items: [
      {
        slug: "swamp-key", type: "resource", category: "other",
        en: "Swamp Key", ru: "Болотный ключ",
        descriptionEn: "The Elder's key. It opens the sealed gates of Sunken Crypts in the Swamp and is not consumed.",
        descriptionRu: "Ключ Древнего. Открывает запечатанные входы в Затонувшие склепы Болота и не расходуется.",
        imageFile: "swamp-key.png", source: item("swamp-key"), sourceName: "Valheim.tools"
      },
      {
        slug: "bukeperries", type: "resource", category: "consumable",
        en: "Bukeperries", ru: "Тошноягоды",
        descriptionEn: "Eating one clears active food buffs over several seconds, letting you replace a meal early.",
        descriptionRu: "После употребления постепенно очищают активные эффекты еды, позволяя раньше заменить рацион.",
        imageFile: "bukeperries.png", source: item("bukeperries"), sourceName: "Valheim.tools"
      }
    ],
    resourceSources: [
      ["swamp-key", "Guaranteed drop from The Elder.", "Гарантированно выпадает из Древнего.", item("swamp-key")],
      ["bukeperries", "Dropped by Greydwarf Shamans and Fuling Shamans.", "Выпадают из грейдворфов-шаманов и фулингов-шаманов.", item("bukeperries")]
    ]
  },
  {
    marker: "catalog_special_drops_swamp_v1",
    biome: "swamp",
    items: [
      {
        slug: "wishbone", type: "resource", category: "tool",
        en: "Wishbone", ru: "Дужка",
        descriptionEn: "A utility item from Bonemass that detects buried objects, including silver veins and hidden treasure.",
        descriptionRu: "Полезный предмет с Массы Костей, который обнаруживает спрятанные объекты, включая серебряные жилы и зарытые сокровища.",
        imageFile: "wishbone.png", source: item("wishbone"), sourceName: "Valheim.tools"
      }
    ],
    resourceSources: [
      ["wishbone", "Guaranteed drop from Bonemass.", "Гарантированно выпадает из Массы Костей.", item("wishbone")]
    ]
  },
  {
    marker: "catalog_special_drops_mountains_v1",
    biome: "mountains",
    items: [
      {
        slug: "red-jute", type: "resource", category: "material",
        en: "Red Jute", ru: "Красный джут",
        descriptionEn: "A sturdy fabric dropped by Cultists and found in Frost Caves. Used for decorative building pieces.",
        descriptionRu: "Прочная ткань с культистов и из Ледяных пещер. Используется в декоративных постройках.",
        imageFile: "red-jute.png", source: item("red-jute"), sourceName: "Valheim.tools"
      }
    ],
    resourceSources: [
      ["red-jute", "Dropped by Cultists and found in Frost Cave cloth decorations.", "Выпадает из культистов и добывается из тканевых декораций Ледяных пещер.", item("red-jute")]
    ]
  },
  {
    marker: "catalog_special_drops_plains_v1",
    biome: "plains",
    items: [
      {
        slug: "vile-ribcage", type: "resource", category: "material",
        en: "Vile Ribcage", ru: "Рёбра мерзкого медведя",
        descriptionEn: "A heavy bone material dropped by Vile, used for the Vilebone armour and weapon line.",
        descriptionRu: "Тяжёлый костяной материал с мерзкого медведя, используемый для брони и оружия Vilebone.",
        imageFile: "vile-ribcage.png", source: item("vile-ribcage"), sourceName: "Valheim.tools"
      },
      {
        slug: "rotten-meat", type: "resource", category: "consumable",
        en: "Rotten Meat", ru: "Гнилое мясо",
        descriptionEn: "Spoiled meat dropped by Vile. Eating it triggers the same food-clearing sickness as Bukeperries.",
        descriptionRu: "Испорченное мясо с мерзкого медведя. При употреблении вызывает тот же эффект очистки еды, что и тошноягоды.",
        imageFile: "rotten-meat.png", source: item("rotten-meat"), sourceName: "Valheim.tools"
      },
      {
        slug: "vilebone-cage", type: "item", category: "armor",
        en: "Vilebone Cage", ru: "Кираса Vilebone",
        descriptionEn: "Heavy chest armour forged from Bear Hide, Vile Ribcage and Linen Thread.",
        descriptionRu: "Тяжёлая нагрудная броня из медвежьей шкуры, рёбер мерзкого медведя и льняной нити.",
        imageFile: "vilebone-cage.png", source: item("vilebone-cage"), sourceName: "Valheim.tools"
      },
      {
        slug: "vilebone-drapes", type: "item", category: "armor",
        en: "Vilebone Drapes", ru: "Поножи Vilebone",
        descriptionEn: "Heavy leg armour from the Vilebone set.",
        descriptionRu: "Тяжёлая броня для ног из комплекта Vilebone.",
        imageFile: "vilebone-drapes.png", source: item("vilebone-drapes"), sourceName: "Valheim.tools"
      },
      {
        slug: "vilebone-maulclaws", type: "item", category: "weapon",
        en: "Vilebone Maulclaws", ru: "Когти Vilebone",
        descriptionEn: "Two-handed fist weapons made with Vile Ribcage.",
        descriptionRu: "Двуручное кулачное оружие, создаваемое с использованием рёбер мерзкого медведя.",
        imageFile: "vilebone-maulclaws.png", source: item("vilebone-maulclaws"), sourceName: "Valheim.tools"
      }
    ],
    recipes: [
      { item: "vilebone-cage", station: "forge", level: 2, ingredients: [["bear-hide", 4], ["vile-ribcage", 3], ["linen-thread", 4]] },
      { item: "vilebone-drapes", station: "forge", level: 2, ingredients: [["bear-hide", 10], ["vile-ribcage", 1], ["linen-thread", 4]] },
      { item: "vilebone-maulclaws", station: "forge", level: 4, ingredients: [["bear-hide", 2], ["vile-ribcage", 2], ["black-metal", 2], ["linen-thread", 4]] }
    ],
    stats: [
      ["vilebone-cage", "armor", "18"],
      ["vilebone-cage", "durability", "1000"],
      ["vilebone-drapes", "armor", "18"],
      ["vilebone-drapes", "durability", "1000"],
      ["vilebone-maulclaws", "slash", "20"],
      ["vilebone-maulclaws", "pierce", "60"]
    ],
    resourceSources: [
      ["vile-ribcage", "Dropped by Vile: 1-3 every kill.", "Выпадает из мерзкого медведя: 1–3 за каждое убийство.", item("vile-ribcage")],
      ["rotten-meat", "Dropped by Vile and found in Morgen-hole piles.", "Выпадает из мерзкого медведя и встречается в кучах логова Моргена.", item("rotten-meat")]
    ]
  },
  {
    marker: "catalog_special_drops_mistlands_v1",
    biome: "mistlands",
    items: [
      {
        slug: "majestic-carapace", type: "resource", category: "material",
        en: "Majestic Carapace", ru: "Величественный панцирь",
        descriptionEn: "The Queen's progression drop. One is used to build the Artisan Press.",
        descriptionRu: "Прогрессионный дроп Королевы. Один панцирь нужен для строительства Ремесленного пресса.",
        imageFile: "majestic-carapace.png", source: item("majestic-carapace"), sourceName: "Valheim.tools"
      },
      {
        slug: "artisan-press", type: "item", category: "building",
        en: "Artisan Press", ru: "Ремесленный пресс",
        descriptionEn: "An Artisan Table extension built with the Queen's Majestic Carapace.",
        descriptionRu: "Расширение Стола ремесленника, создаваемое с Величественным панцирем Королевы.",
        imageFile: "artisan-press.png", source: building("artisan-press"), sourceName: "Valheim.tools"
      }
    ],
    recipes: [
      { item: "artisan-press", station: "hammer", ingredients: [["black-marble", 5], ["bronze", 5], ["majestic-carapace", 1]] }
    ],
    resourceSources: [
      ["majestic-carapace", "The Queen drops 5 every kill.", "Королева гарантированно роняет 5 за убийство.", item("majestic-carapace")]
    ]
  },
  {
    marker: "catalog_special_drops_deep_north_v1",
    biome: "deep-north",
    items: [
      {
        slug: "sacrificial-blood", type: "resource", category: "material",
        en: "Sacrificial Blood", ru: "Жертвенная кровь",
        descriptionEn: "The final essence dropped by Kall Fimbulbringer. It is offered at the Chiselled Platform on the Sacrificial Stones to trigger the ending.",
        descriptionRu: "Финальная сущность, выпадающая из Калла Фимбулбрингера. Её подносят на Высеченной платформе у Жертвенных камней, чтобы запустить концовку.",
        imageFile: "sacrificial-blood.png", source: item("sacrificial-blood"), sourceName: "Valheim.tools"
      },
      {
        slug: "ancient-coin", type: "resource", category: "material",
        en: "Ancient Coin", ru: "Древняя монета",
        descriptionEn: "A valuable relic from Morkhalla worth 10 coins each.",
        descriptionRu: "Ценная реликвия Мёркхаллы стоимостью 10 монет за штуку.",
        imageFile: "ancient-coin.png", source: item("ancient-coin"), sourceName: "Valheim.tools"
      },
      {
        slug: "draumyx", type: "resource", category: "material",
        en: "Draumyx", ru: "Драумикс",
        descriptionEn: "A rare black Deep North gemstone valued at 175 coins.",
        descriptionRu: "Редкий чёрный самоцвет Глубокого Севера стоимостью 175 монет.",
        imageFile: "draumyx.png", source: item("draumyx"), sourceName: "Valheim.tools"
      },
      {
        slug: "grimvarn", type: "resource", category: "material",
        en: "Grimvarn", ru: "Гримварн",
        descriptionEn: "A green Deep North gemstone valued at 55 coins.",
        descriptionRu: "Зелёный самоцвет Глубокого Севера стоимостью 55 монет.",
        imageFile: "grimvarn.png", source: item("grimvarn"), sourceName: "Valheim.tools"
      },
      {
        slug: "solryth", type: "resource", category: "material",
        en: "Solryth", ru: "Солрит",
        descriptionEn: "An orange Deep North gemstone valued at 95 coins.",
        descriptionRu: "Оранжевый самоцвет Глубокого Севера стоимостью 95 монет.",
        imageFile: "solryth.png", source: item("solryth"), sourceName: "Valheim.tools"
      },
      {
        slug: "veydris", type: "resource", category: "material",
        en: "Veydris", ru: "Вейдрис",
        descriptionEn: "A purple Deep North gemstone valued at 135 coins.",
        descriptionRu: "Фиолетовый самоцвет Глубокого Севера стоимостью 135 монет.",
        imageFile: "veydris.png", source: item("veydris"), sourceName: "Valheim.tools"
      }
    ],
    resourceSources: [
      ["sacrificial-blood", "Guaranteed drop from Kall Fimbulbringer.", "Гарантированно выпадает из Калла Фимбулбрингера.", item("sacrificial-blood")],
      ["ancient-coin", "Dropped by Captive Fulings and found throughout Morkhalla.", "Выпадает из пленных фулингов и встречается по всей Мёркхалле.", item("ancient-coin")],
      ["draumyx", "Dropped by Imprisoned Dvergr and found in Morkhalla and Deep North shipwreck chests.", "Выпадает из заключённых двергов и встречается в Мёркхалле и сундуках кораблекрушений Глубокого Севера.", item("draumyx")],
      ["grimvarn", "Dropped by Imprisoned Dvergr and found in Morkhalla and Deep North shipwreck chests.", "Выпадает из заключённых двергов и встречается в Мёркхалле и сундуках кораблекрушений Глубокого Севера.", item("grimvarn")],
      ["solryth", "Dropped by Imprisoned Dvergr and found in Morkhalla and Deep North shipwreck chests.", "Выпадает из заключённых двергов и встречается в Мёркхалле и сундуках кораблекрушений Глубокого Севера.", item("solryth")],
      ["veydris", "Dropped by Imprisoned Dvergr and found in Morkhalla and Deep North shipwreck chests.", "Выпадает из заключённых двергов и встречается в Мёркхалле и сундуках кораблекрушений Глубокого Севера.", item("veydris")]
    ]
  }
];

export const ensureSpecialDropCatalog = async (env: Env): Promise<void> => {
  for (const seed of seeds) await applyCatalogSeed(env, seed);
};
