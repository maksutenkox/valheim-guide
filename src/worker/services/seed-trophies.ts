import type { Env } from "../env";
import { applyCatalogSeed, type CatalogSeed, type SeedItem, type SeedResourceSource } from "./catalog-seed";

const source = "https://www.valheim.tools/materials";

type TrophyDef = [slug: string, en: string, ru: string, creatureEn: string, creatureRu: string];

const trophyItem = (biome: string, [slug, en, ru, creatureEn, creatureRu]: TrophyDef): SeedItem => ({
  slug,
  type: "resource",
  category: "trophy",
  en,
  ru,
  descriptionEn: `A trophy taken from ${creatureEn}. It can be displayed on an item stand and used by systems or recipes that accept this trophy.`,
  descriptionRu: `Трофей, получаемый с ${creatureRu}. Его можно выставить на стойке для предметов и использовать в системах или рецептах, где нужен этот трофей.`,
  imageFile: `${slug}.png`,
  source,
  sourceName: "Valheim.tools",
  biome
});

const trophySource = ([slug, , , creatureEn, creatureRu]: TrophyDef): SeedResourceSource => [
  slug,
  `Dropped by ${creatureEn}.`,
  `Выпадает из: ${creatureRu}.`,
  source
];

const makeSeed = (biome: string, marker: string, trophies: TrophyDef[]): CatalogSeed => ({
  marker,
  biome,
  categories: [{ slug: "trophy", en: "Trophies", ru: "Трофеи", sortOrder: 65 }],
  items: trophies.map((entry) => trophyItem(biome, entry)),
  resourceSources: trophies.map(trophySource)
});

const meadows = makeSeed("meadows", "catalog_trophies_meadows_v1", [
  ["boar-trophy","Boar Trophy","Трофей: кабан","Boar","кабана"],
  ["deer-trophy","Deer Trophy","Трофей: олень","Deer","оленя"],
  ["trophy-deer-white","Trophy Deer White","Трофей: белый олень","White Deer","белого оленя"],
  ["eikthyr-trophy","Eikthyr Trophy","Трофей: Эйктюр","Eikthyr","Эйктюра"],
  ["neck-trophy","Neck Trophy","Трофей: никс","Neck","никса"]
]);

const blackForest = makeSeed("black-forest", "catalog_trophies_black_forest_v1", [
  ["bear-trophy","Bear Trophy","Трофей: медведь","Bear","медведя"],
  ["brenna-trophy","Brenna Trophy","Трофей: Бренна","Brenna","Бренны"],
  ["ghost-trophy","Ghost Trophy","Трофей: призрак","Ghost","призрака"],
  ["greydwarf-trophy","Greydwarf Trophy","Трофей: грейдворф","Greydwarf","грейдворфа"],
  ["greydwarf-brute-trophy","Greydwarf Brute Trophy","Трофей: грейдворф-дикарь","Greydwarf Brute","грейдворфа-дикаря"],
  ["greydwarf-shaman-trophy","Greydwarf Shaman Trophy","Трофей: грейдворф-шаман","Greydwarf Shaman","грейдворфа-шамана"],
  ["rancid-remains-trophy","Rancid Remains Trophy","Трофей: гнилые останки","Rancid Remains","гнилых останков"],
  ["skeleton-trophy","Skeleton Trophy","Трофей: скелет","Skeleton","скелета"],
  ["the-elder-trophy","The Elder Trophy","Трофей: Древний","The Elder","Древнего"],
  ["troll-trophy","Troll Trophy","Трофей: тролль","Troll","тролля"]
]);

const swamp = makeSeed("swamp", "catalog_trophies_swamp_v1", [
  ["abomination-trophy","Abomination Trophy","Трофей: мерзость","Abomination","мерзости"],
  ["blob-trophy","Blob Trophy","Трофей: слизень","Blob","слизня"],
  ["bonemass-trophy","Bonemass Trophy","Трофей: Масса Костей","Bonemass","Массы Костей"],
  ["draugr-trophy","Draugr Trophy","Трофей: драугр","Draugr","драугра"],
  ["draugr-elite-trophy","Draugr Elite Trophy","Трофей: элитный драугр","Draugr Elite","элитного драугра"],
  ["kvastur-trophy","Kvastur Trophy","Трофей: Квастур","Kvastur","Квастура"],
  ["leech-trophy","Leech Trophy","Трофей: пиявка","Leech","пиявки"],
  ["surtling-trophy","Surtling Trophy","Трофей: суртлинг","Surtling","суртлинга"],
  ["wraith-trophy","Wraith Trophy","Трофей: призрак болот","Wraith","болотного призрака"],
  ["writhan-trophy","Writhan Trophy","Трофей: Вритан","Writhan","Вритана"]
]);

const mountains = makeSeed("mountains", "catalog_trophies_mountains_v1", [
  ["cultist-trophy","Cultist Trophy","Трофей: культист","Cultist","культиста"],
  ["drake-trophy","Drake Trophy","Трофей: дракон","Drake","дракона"],
  ["fenring-trophy","Fenring Trophy","Трофей: фенринг","Fenring","фенринга"],
  ["geirrhafa-trophy","Geirrhafa Trophy","Трофей: Гейрхафа","Geirrhafa","Гейрхафы"],
  ["moder-trophy","Moder Trophy","Трофей: Моудер","Moder","Моудер"],
  ["stone-golem-trophy","Stone Golem Trophy","Трофей: каменный голем","Stone Golem","каменного голема"],
  ["ulv-trophy","Ulv Trophy","Трофей: ульв","Ulv","ульва"],
  ["wolf-trophy","Wolf Trophy","Трофей: волк","Wolf","волка"],
  ["frost-blob-trophy","Frost Blob Trophy","Трофей: морозный слизень","Frost Blob","морозного слизня"]
]);

const plains = makeSeed("plains", "catalog_trophies_plains_v1", [
  ["deathsquito-trophy","Deathsquito Trophy","Трофей: комар смерти","Deathsquito","комара смерти"],
  ["fuling-trophy","Fuling Trophy","Трофей: фулинг","Fuling","фулинга"],
  ["fuling-berserker-trophy","Fuling Berserker Trophy","Трофей: фулинг-берсерк","Fuling Berserker","фулинга-берсерка"],
  ["fuling-shaman-trophy","Fuling Shaman Trophy","Трофей: фулинг-шаман","Fuling Shaman","фулинга-шамана"],
  ["growth-trophy","Growth Trophy","Трофей: нарост","Growth","нароста"],
  ["lox-trophy","Lox Trophy","Трофей: локс","Lox","локса"],
  ["thungr-trophy","Thungr Trophy","Трофей: Тунгр","Thungr","Тунгра"],
  ["vile-trophy","Vile Trophy","Трофей: мерзкий медведь","Vile","мерзкого медведя"],
  ["yagluth-trophy","Yagluth Trophy","Трофей: Яглут","Yagluth","Яглута"],
  ["zil-trophy","Zil Trophy","Трофей: Зил","Zil","Зила"]
]);

const mistlands = makeSeed("mistlands", "catalog_trophies_mistlands_v1", [
  ["dvergr-trophy","Dvergr Trophy","Трофей: двергр","Dvergr","двергра"],
  ["gjall-trophy","Gjall Trophy","Трофей: гьялл","Gjall","гьялла"],
  ["hare-trophy","Hare Trophy","Трофей: заяц","Hare","зайца"],
  ["seeker-trophy","Seeker Trophy","Трофей: Искатель","Seeker","Искателя"],
  ["seeker-soldier-trophy","Seeker Soldier Trophy","Трофей: Искатель-солдат","Seeker Soldier","Искателя-солдата"],
  ["the-queen-trophy","The Queen Trophy","Трофей: Королева","The Queen","Королевы"],
  ["tick-trophy","Tick Trophy","Трофей: клещ","Tick","клеща"]
]);

const ashlands = makeSeed("ashlands", "catalog_trophies_ashlands_v1", [
  ["asksvin-trophy","Asksvin Trophy","Трофей: асксвин","Asksvin","асксвина"],
  ["bonemaw-trophy","Bonemaw Trophy","Трофей: костегрыз","Bonemaw","костегрыза"],
  ["fader-trophy","Fader Trophy","Трофей: Фейдер","Fader","Фейдера"],
  ["fallen-valkyrie-trophy","Fallen Valkyrie Trophy","Трофей: падшая валькирия","Fallen Valkyrie","падшей валькирии"],
  ["lava-blob-trophy","Lava Blob Trophy","Трофей: лавовый слизень","Lava Blob","лавового слизня"],
  ["marksman-trophy","Marksman Trophy","Трофей: обугленный стрелок","Charred Marksman","обугленного стрелка"],
  ["morgen-trophy","Morgen Trophy","Трофей: Морген","Morgen","Моргена"],
  ["volture-trophy","Volture Trophy","Трофей: стервятник","Volture","стервятника"],
  ["warlock-trophy","Warlock Trophy","Трофей: обугленный чародей","Charred Warlock","обугленного чародея"],
  ["warrior-trophy","Warrior Trophy","Трофей: обугленный воин","Charred Warrior","обугленного воина"]
]);

const deepNorth = makeSeed("deep-north", "catalog_trophies_deep_north_v1", [
  ["barka-trophy","Barka Trophy","Трофей: Барка","Barka","Барки"],
  ["elaking-trophy","Elaking Trophy","Трофей: Элакинг","Elaking","Элакинга"],
  ["eyeless-one-trophy","Eyeless One Trophy","Трофей: Безглазый","Eyeless One","Безглазого"],
  ["hexen-trophy","Hexen Trophy","Трофей: Хексен","Hexen","Хексен"],
  ["krigen-trophy","Krigen Trophy","Трофей: Криген","Krigen","Кригена"],
  ["moose-trophy","Moose Trophy","Трофей: лось","Moose","лося"],
  ["pulp-trophy","Pulp Trophy","Трофей: мякоть","Pulp","мякоти"],
  ["seal-trophy","Seal Trophy","Трофей: тюлень","Seal","тюленя"]
]);

const ocean = makeSeed("ocean", "catalog_trophies_ocean_v1", [
  ["serpent-trophy","Serpent Trophy","Трофей: морской змей","Sea Serpent","морского змея"]
]);

const seeds = [meadows, blackForest, swamp, mountains, plains, mistlands, ashlands, deepNorth, ocean];

export const ensureTrophyCatalog = async (env: Env): Promise<void> => {
  for (const seed of seeds) await applyCatalogSeed(env, seed);
};
