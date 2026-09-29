export type CreatureSummary = {
  slug: string;
  name_en: string;
  name_ru: string;
  biome_slug: string;
  health: number;
  kind: "creature" | "boss";
  source_url: string;
};

export type CreatureResistance = {
  type: string;
  level: "weak" | "very-weak" | "resistant" | "very-resistant" | "immune" | "ignore";
};

export type CreatureDrop = {
  name: string;
  chance: string | null;
  amount: string | null;
};

export type CreatureDetail = CreatureSummary & {
  image_url: string | null;
  resistances: CreatureResistance[];
  drops: CreatureDrop[];
  source_name: string;
};

export type BossSummary = CreatureSummary & {
  summon_en: string;
  summon_ru: string;
  power_en: string;
  power_ru: string;
  recommended_en: string;
  recommended_ru: string;
};

const source = (slug: string) => `https://www.valheim.tools/creatures/${slug}`;

const creature = (
  slug: string,
  nameEn: string,
  nameRu: string,
  biome: string,
  health: number
): CreatureSummary => ({ slug, name_en: nameEn, name_ru: nameRu, biome_slug: biome, health, kind: "creature", source_url: source(slug) });

export const creatures: CreatureSummary[] = [
  // Meadows
  creature("boar","Boar","Кабан","meadows",10),
  creature("deer","Deer","Олень","meadows",10),
  creature("neck","Neck","Никс","meadows",5),
  creature("greyling","Greyling","Грейлинг","meadows",20),

  // Black Forest
  creature("greydwarf","Greydwarf","Грейдворф","black-forest",40),
  creature("greydwarf-brute","Greydwarf Brute","Грейдворф-дикарь","black-forest",150),
  creature("greydwarf-shaman","Greydwarf Shaman","Грейдворф-шаман","black-forest",60),
  creature("skeleton","Skeleton","Скелет","black-forest",40),
  creature("ghost","Ghost","Призрак","black-forest",60),
  creature("rancid-remains","Rancid Remains","Гнилые останки","black-forest",100),
  creature("troll","Troll","Тролль","black-forest",600),
  creature("bear","Bear","Медведь","black-forest",500),
  creature("brenna","Brenna","Бренна","black-forest",1200),

  // Swamp
  creature("blob","Blob","Слизень","swamp",50),
  creature("oozer","Oozer","Гнилостный слизень","swamp",150),
  creature("draugr","Draugr","Драугр","swamp",100),
  creature("draugr-elite","Draugr Elite","Элитный драугр","swamp",200),
  creature("leech","Leech","Пиявка","swamp",60),
  creature("surtling","Surtling","Суртлинг","swamp",20),
  creature("wraith","Wraith","Призрак болот","swamp",100),
  creature("abomination","Abomination","Мерзость","swamp",800),
  creature("kvastur","Kvastur","Квастур","swamp",700),
  creature("writhan","Writhan","Вритан","swamp",400),

  // Mountains
  creature("bat","Bat","Летучая мышь","mountains",10),
  creature("drake","Drake","Дракон","mountains",100),
  creature("wolf","Wolf","Волк","mountains",80),
  creature("fenring","Fenring","Фенринг","mountains",300),
  creature("stone-golem","Stone Golem","Каменный голем","mountains",800),
  creature("cultist","Cultist","Культист","mountains",200),
  creature("ulv","Ulv","Ульв","mountains",50),
  creature("geirrhafa","Geirrhafa","Гейрхафа","mountains",3700),
  creature("frost-blob","Frost Blob","Морозный слизень","mountains",50),

  // Plains
  creature("deathsquito","Deathsquito","Комар смерти","plains",10),
  creature("fuling","Fuling","Фулинг","plains",175),
  creature("fuling-berserker","Fuling Berserker","Фулинг-берсерк","plains",800),
  creature("fuling-shaman","Fuling Shaman","Фулинг-шаман","plains",100),
  creature("growth","Growth","Нарост","plains",100),
  creature("lox","Lox","Локс","plains",1000),
  creature("vile","Vile","Мерзкий медведь","plains",1200),

  // Mistlands
  creature("seeker","Seeker","Искатель","mistlands",200),
  creature("seeker-soldier","Seeker Soldier","Искатель-солдат","mistlands",1500),
  creature("seeker-brood","Seeker Brood","Потомство Искателя","mistlands",20),
  creature("tick","Tick","Клещ","mistlands",50),
  creature("gjall","Gjall","Гьялл","mistlands",1500),
  creature("dvergr-rogue","Dvergr Rogue","Двергр-разбойник","mistlands",350),
  creature("dvergr-mage","Dvergr Mage","Двергр-маг","mistlands",350),
  creature("hare","Hare","Заяц","mistlands",10),

  // Ashlands
  creature("charred-twitcher","Charred Twitcher","Обугленный дёргун","ashlands",220),
  creature("charred-warrior","Charred Warrior","Обугленный воин","ashlands",600),
  creature("charred-marksman","Charred Marksman","Обугленный стрелок","ashlands",200),
  creature("charred-warlock","Charred Warlock","Обугленный чародей","ashlands",600),
  creature("asksvin","Asksvin","Асксвин","ashlands",800),
  creature("bonemaw","Bonemaw","Костегрыз","ashlands",1100),
  creature("fallen-valkyrie","Fallen Valkyrie","Падшая валькирия","ashlands",1500),
  creature("lava-blob","Lava Blob","Лавовый слизень","ashlands",300),
  creature("morgen","Morgen","Морген","ashlands",1600),
  creature("volture","Volture","Стервятник","ashlands",200),
  creature("lord-reto","Lord Reto","Лорд Рето","ashlands",2500),

  // Deep North
  creature("barka","Barka","Барка","deep-north",2200),
  creature("elaking","Elaking","Элакинг","deep-north",350),
  creature("eyeless-one","Eyeless One","Безглазый","deep-north",1400),
  creature("fallen-warrior","Fallen Warrior","Падший воин","deep-north",750),
  creature("gammeltroll","Gammeltroll","Древний тролль","deep-north",3000),
  creature("hexen","Hexen","Хексен","deep-north",800),
  creature("imprisoned-dvergr","Imprisoned Dvergr","Заключённый двергр","deep-north",1500),
  creature("krigen","Krigen","Криген","deep-north",1300),
  creature("moose","Moose","Лось","deep-north",1000),
  creature("seal","Seal","Тюлень","deep-north",400),
  creature("shadow","Shadow","Тень","deep-north",750),
  creature("shapeless-pulp","Shapeless Pulp","Бесформенная мякоть","deep-north",150),
  creature("captive-fuling","Captive Fuling","Пленный фулинг","deep-north",250),

  // Ocean
  creature("serpent","Serpent","Морской змей","ocean",400),
  creature("leviathan","Leviathan","Левиафан","ocean",40)
];

const boss = (
  slug: string,
  nameEn: string,
  nameRu: string,
  biome: string,
  health: number,
  summonEn: string,
  summonRu: string,
  powerEn: string,
  powerRu: string,
  recommendedEn: string,
  recommendedRu: string
): BossSummary => ({
  slug, name_en: nameEn, name_ru: nameRu, biome_slug: biome, health, kind: "boss", source_url: source(slug),
  summon_en: summonEn, summon_ru: summonRu, power_en: powerEn, power_ru: powerRu,
  recommended_en: recommendedEn, recommended_ru: recommendedRu
});

export const bosses: BossSummary[] = [
  boss("eikthyr","Eikthyr","Эйктюр","meadows",500,
    "2 Deer Trophies","2 трофея оленя",
    "Run, jump and swim stamina cost -60%","Расход выносливости на бег, прыжки и плавание -60%",
    "Flint weapons and a wood shield","Кремнёвое оружие и деревянный щит"),
  boss("the-elder","The Elder","Древний","black-forest",2500,
    "3 Ancient Seeds","3 древних семени",
    "Chop +60%, pickaxe +60%, health regeneration +30%","Рубка +60%, кирка +60%, регенерация здоровья +30%",
    "Finewood Bow and fire arrows","Лук из качественной древесины и огненные стрелы"),
  boss("bonemass","Bonemass","Масса Костей","swamp",5000,
    "10 Withered Bones","10 иссохших костей",
    "Physical resistance, free blocking and 5 stamina returned on block","Сопротивление физическому урону, блок без затрат и +5 выносливости за блок",
    "Iron mace, poison resistance mead and banded shield","Железная булава, медовуха от яда и полосатый щит"),
  boss("moder","Moder","Моудер","mountains",7500,
    "3 Dragon Eggs","3 яйца дракона",
    "Tailwind while sailing, +300 carry weight, +10% movement speed, frost resistance","Попутный ветер, +300 переносимого веса, +10% скорости и сопротивление морозу",
    "Draugr Fang, frost resistance and wolf/padded armor","Клык Драугра, защита от мороза и волчья/стёганая броня"),
  boss("yagluth","Yagluth","Яглут","plains",10000,
    "5 Fuling Totems","5 тотемов фулингов",
    "Lightning resistance, farming +25, all damage +10%","Сопротивление молнии, фермерство +25, весь урон +10%",
    "Black metal gear and fire resistance barley wine","Снаряжение из чёрного металла и ячменное вино от огня"),
  boss("the-queen","The Queen","Королева","mistlands",12500,
    "Sealbreaker for the first fight; 3 Seeker Soldier Trophies for a rematch","Разрушитель печатей для первого боя; 3 трофея Искателя-солдата для реванша",
    "Eitr regeneration +100%, sneaking costs no stamina, poison resistance","Регенерация эйтра +100%, скрытность без выносливости, сопротивление яду",
    "Carapace/eitr gear, Mistwalker and healing meads","Панцирная/магическая экипировка, Mistwalker и лечебные медовухи"),
  boss("fader","Fader","Фейдер","ashlands",25000,
    "3 Bells made from 9 Bell Fragments","3 колокола из 9 фрагментов колокола",
    "Fire resistance, adrenaline gain +100%, stagger taken -50%","Сопротивление огню, адреналин +100%, получаемое ошеломление -50%",
    "Flametal weapons, fire resistance and Ashlands armor","Фламеталловое оружие, защита от огня и броня Пепельных земель"),
  boss("kall-fimbulbringer","Kall Fimbulbringer","Калл Фимбулбрингер","deep-north",52800,
    "3 Malicious Blood","3 злобной крови",
    "No Forsaken power","Нет силы Павшего",
    "Blunt or slash; avoid pierce, fire, frost and lightning","Дробящий или рубящий урон; избегать колющего, огня, мороза и молнии")
];

const damageTypes = ["Blunt","Slash","Pierce","Chop","Pickaxe","Fire","Frost","Lightning","Poison","Spirit"];
const resistanceLevels: Array<[string, CreatureResistance["level"]]> = [
  ["Very Resistant","very-resistant"],
  ["Very Weak","very-weak"],
  ["Resistant","resistant"],
  ["Immune","immune"],
  ["Ignore","ignore"],
  ["Weak","weak"]
];

const decodeHtml = (value: string): string => value
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">");

const toPlainText = (html: string): string => decodeHtml(html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
).trim();

const parseResistances = (plain: string): CreatureResistance[] => {
  const start = plain.indexOf("Resistances");
  if (start < 0) return [];
  const endCandidates = [plain.indexOf("Drops", start), plain.indexOf("What to know", start)].filter((value) => value > start);
  const end = endCandidates.length ? Math.min(...endCandidates) : Math.min(plain.length, start + 700);
  const segment = plain.slice(start, end);
  const result: CreatureResistance[] = [];
  for (const type of damageTypes) {
    for (const [label, level] of resistanceLevels) {
      if (segment.includes(`${type} ${label}`)) {
        result.push({ type: type.toLowerCase(), level });
        break;
      }
    }
  }
  return result;
};

const parseDrops = (plain: string): CreatureDrop[] => {
  const startMatch = plain.match(/Drops\s+\d+/i);
  if (!startMatch?.index) return [];
  const start = startMatch.index + startMatch[0].length;
  const endCandidates = [
    plain.indexOf("Star levels", start),
    plain.indexOf("What to know", start),
    plain.indexOf("About", start)
  ].filter((value) => value > start);
  const end = endCandidates.length ? Math.min(...endCandidates) : Math.min(plain.length, start + 900);
  const segment = plain.slice(start, end);
  const regex = /([A-Z][A-Za-z0-9' .:&()\-]+?)\s*(\d+(?:\.\d+)?%)\s*·\s*([0-9]+(?:-[0-9]+)?)(?:\s*·\s*within\s*\d+\s*kills)?/g;
  const drops: CreatureDrop[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(segment)) && drops.length < 12) {
    drops.push({ name: match[1].trim(), chance: match[2], amount: match[3] });
  }
  return drops;
};

const parseOgImage = (html: string): string | null => {
  const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (!match?.[1]) return null;
  try {
    const url = new URL(decodeHtml(match[1]));
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

const allEntries = [...creatures, ...bosses];

export const creatureBySlug = (slug: string): CreatureSummary | BossSummary | undefined =>
  allEntries.find((entry) => entry.slug === slug);

export const creaturesForBiome = (biome: string): CreatureSummary[] =>
  creatures.filter((entry) => entry.biome_slug === biome);

export const bossForBiome = (biome: string): BossSummary | undefined =>
  bosses.find((entry) => entry.biome_slug === biome);

export const loadCreatureDetail = async (slug: string): Promise<CreatureDetail | null> => {
  const base = creatureBySlug(slug);
  if (!base) return null;

  try {
    const response = await fetch(base.source_url, {
      headers: { accept: "text/html", "user-agent": "VALHEIM-Guide/1.0" },
      cf: { cacheTtl: 86400, cacheEverything: true }
    } as RequestInit & { cf: { cacheTtl: number; cacheEverything: boolean } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const plain = toPlainText(html);
    const healthMatch = plain.match(/Health\s+([\d,]+)/i);
    return {
      ...base,
      health: healthMatch ? Number(healthMatch[1].replaceAll(",", "")) : base.health,
      image_url: parseOgImage(html),
      resistances: parseResistances(plain),
      drops: parseDrops(plain),
      source_name: "Valheim.tools"
    };
  } catch {
    return {
      ...base,
      image_url: null,
      resistances: [],
      drops: [],
      source_name: "Valheim.tools"
    };
  }
};
