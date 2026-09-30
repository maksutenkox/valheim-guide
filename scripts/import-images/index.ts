import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type MediaRecord = { slug: string; url: string; output: string };
type FandomImageInfoResponse = {
  query?: {
    pages?: Record<string, {
      missing?: string;
      imageinfo?: Array<{ url?: string }>;
    }>;
  };
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = resolve(root, "data/media/wiki-manifest.json");
const seedDirectory = resolve(root, "src/worker/services");
const outputDirectory = resolve(root, "public/media/wiki");

const staticManifest = JSON.parse(await readFile(manifestPath, "utf8")) as MediaRecord[];
const seedFiles = (await readdir(seedDirectory))
  .filter((name) => /^seed-.*\.ts$/.test(name))
  .sort();
const seedSource = (await Promise.all(
  seedFiles.map((name) => readFile(resolve(seedDirectory, name), "utf8"))
)).join("\n");

const trophySeedSource = await readFile(resolve(seedDirectory, "seed-trophies.ts"), "utf8").catch(() => "");

const catalogManifest: MediaRecord[] = [...seedSource.matchAll(
  /\{\s*slug:\s*"([^"]+)"[^{}]*?imageFile:\s*"([^"]+)"/gs
)].map((match) => {
  const [, slug, imageFile] = match;
  return {
    slug,
    url: imageFile,
    output: `${slug}.png`
  };
});

const trophyManifest: MediaRecord[] = [...trophySeedSource.matchAll(
  /^\s*\["([^"]+)"\s*,\s*"[^"]+"\s*,\s*"[^"]+"\s*,\s*"[^"]+"\s*,\s*"[^"]+"\]\s*,?$/gm
)].map((match) => ({
  slug: match[1],
  url: `${match[1]}.png`,
  output: `${match[1]}.png`
}));

if (trophySeedSource && trophyManifest.length === 0) {
  throw new Error("seed-trophies.ts was found, but no TrophyDef entries were detected");
}

const manifest = new Map<string, MediaRecord>();
for (const entry of [...staticManifest, ...catalogManifest, ...trophyManifest]) {
  manifest.set(entry.output, entry);
}

const declaredCatalogImageCount = [...seedSource.matchAll(/imageFile:\s*"[^"]+"/g)].length;
if (catalogManifest.length !== declaredCatalogImageCount) {
  throw new Error(`Catalog media parser found ${catalogManifest.length} entries, but seed files declare ${declaredCatalogImageCount} literal imageFile values`);
}
console.info(`Declared catalog image count: ${declaredCatalogImageCount}`);
console.info(`Media manifest: ${manifest.size} total entries, including ${trophyManifest.length} trophy entries`);

const userAgent = "VALHEIM-Guide/0.1 (+https://github.com/maksutenkox/valheim-guide)";
const productionMediaOrigin = "https://valheim-guide.partiya-odobryaet-bot.workers.dev";

const fetchWithTimeout = (
  input: string | URL,
  init: RequestInit = {},
  timeoutMs = 16000
): Promise<Response> => fetch(input, { ...init, signal: AbortSignal.timeout(timeoutMs) });

const fetchImageWithRetry = async (
  input: string | URL,
  init: RequestInit = {},
  attempts = 3
): Promise<Response> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(input, init, 16000);
      if (response.ok || response.status < 500 || attempt === attempts) return response;
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 350 * attempt));
  }
  throw lastError instanceof Error ? lastError : new Error("Media fetch failed");
};

const resolveProductionMedia = async (output: string): Promise<string | null> => {
  const url = `${productionMediaOrigin}/media/wiki/${output}`;
  try {
    const response = await fetchWithTimeout(url, {
      method: "HEAD",
      headers: { "user-agent": userAgent }
    });
    const contentType = response.headers.get("content-type") ?? "";
    return response.ok && contentType.startsWith("image/") ? url : null;
  } catch {
    return null;
  }
};

const directIconOverrides: Record<string, string> = {
  "wooden-battle-idol": "https://www.valheim.tools/icons/items/Upgrader0Weapon.png",
  "rag-trousers": "https://www.valheim.tools/icons/items/ArmorRagsLegs.png",
  "bronze-protection-idol": "https://www.valheim.tools/icons/items/Upgrader1Armor.png",
  "queens-jam-x4": "https://www.valheim.tools/icons/items/QueensJam.png",
  "pulled-bear": "https://www.valheim.tools/icons/items/PulledBear.png",
  "mead-base-minor-healing": "https://www.valheim.tools/icons/items/MeadBaseHealthMinor.png",
  "mead-base-minor-stamina": "https://www.valheim.tools/icons/items/MeadBaseStaminaMinor.png",
  "mead-base-tasty": "https://www.valheim.tools/icons/items/MeadBaseTasty.png",
  "mead-base-poison-resistance": "https://www.valheim.tools/icons/items/MeadBasePoisonResist.png",
  "writhan-roots": "https://www.valheim.tools/icons/items/WrithanRoots.png",
  "iron-battle-idol": "https://www.valheim.tools/icons/items/Upgrader2Weapon.png",
  "shield-of-roots": "https://www.valheim.tools/icons/items/ShieldRoots.png",
  "mead-base-medium-healing": "https://www.valheim.tools/icons/items/MeadBaseHealthMedium.png",
  "mead-base-frost-resistance": "https://www.valheim.tools/icons/items/MeadBaseFrostResist.png",
  "smiths-anvil": "https://www.valheim.tools/icons/pieces/forge_ext4.png",
  "forge-tool-rack": "https://www.valheim.tools/icons/pieces/forge_ext6.png",
  "silver-battle-idol": "https://www.valheim.tools/icons/items/Upgrader3Weapon.png",
  "silver-protection-idol": "https://www.valheim.tools/icons/items/Upgrader3Armor.png",
  "goblin-totem": "https://www.valheim.tools/icons/items/GoblinTotem.png",
  "fuling-berserker-trophy": "https://www.valheim.tools/icons/items/TrophyGoblinBrute.png",
  "black-metal-battle-idol": "https://www.valheim.tools/icons/items/Upgrader4Weapon.png",
  "black-metal-protection-idol": "https://www.valheim.tools/icons/items/Upgrader4Armor.png",
  "black-metal-sword": "https://www.valheim.tools/icons/items/SwordBlackmetal.png",
  "black-metal-axe": "https://www.valheim.tools/icons/items/AxeBlackMetal.png",
  "black-metal-battleaxe": "https://www.valheim.tools/icons/items/BattleaxeBlackmetal.png",
  "black-metal-knife": "https://www.valheim.tools/icons/items/KnifeBlackMetal.png",
  "black-metal-shield": "https://www.valheim.tools/icons/items/ShieldBlackmetal.png",
  "black-metal-tower-shield": "https://www.valheim.tools/icons/items/ShieldBlackmetalTower.png",
  "lox-fur-hood": "https://www.valheim.tools/icons/items/HelmetLox.png",
  "lox-fur-jacket": "https://www.valheim.tools/icons/items/ArmorLoxChest.png",
  "lox-fur-trousers": "https://www.valheim.tools/icons/items/ArmorLoxLegs.png",
  "barley-wine-base-fire-resistance": "https://www.valheim.tools/icons/items/BarleyWineBase.png",
  "hook": "https://www.valheim.tools/icons/items/Hook.png",
  "black-marble-battle-idol": "https://www.valheim.tools/icons/items/Upgrader5Weapon.png",
  "black-marble-protection-idol": "https://www.valheim.tools/icons/items/Upgrader5Armor.png",
  "grappling-hook": "https://www.valheim.tools/icons/items/GrapplingHook.png",
  "eitr-weave-hood": "https://www.valheim.tools/icons/items/HelmetMage.png",
  "eitr-weave-robe": "https://www.valheim.tools/icons/items/ArmorMageChest.png",
  "eitr-weave-trousers": "https://www.valheim.tools/icons/items/ArmorMageLegs.png",
  "mead-base-major-healing": "https://www.valheim.tools/icons/items/MeadBaseHealthMajor.png",
  "mead-base-lingering-stamina": "https://www.valheim.tools/icons/items/MeadBaseStaminaLingering.png",
  "mead-base-minor-eitr": "https://www.valheim.tools/icons/items/MeadBaseEitrMinor.png",
  "flametal-battle-idol": "https://www.valheim.tools/icons/items/Upgrader6Weapon.png",
  "flametal-protection-idol": "https://www.valheim.tools/icons/items/Upgrader6Armor.png",
  "nidhogg": "https://www.valheim.tools/icons/items/SwordNiedhogg.png",
  "nidhogg-bleeding": "https://www.valheim.tools/icons/items/SwordNiedhoggBlood.png",
  "nidhogg-thundering": "https://www.valheim.tools/icons/items/SwordNiedhoggLightning.png",
  "nidhogg-primal": "https://www.valheim.tools/icons/items/SwordNiedhoggNature.png",
  "flametal-helmet": "https://www.valheim.tools/icons/items/HelmetFlametal.png",
  "flametal-breastplate": "https://www.valheim.tools/icons/items/ArmorFlametalChest.png",
  "flametal-greaves": "https://www.valheim.tools/icons/items/ArmorFlametalLegs.png",
  "uncooked-roasted-crust-pie": "https://www.valheim.tools/icons/items/RoastedCrustPieUncooked.png"
};

const worldGuideIconOverrides: Record<string, string> = {
  "draught-of-vananidir": "https://www.valheim.tools/icons/items/MeadSwimmer.png",
  "brew-of-animal-whispers": "https://www.valheim.tools/icons/items/MeadTamer.png",
  "berserkir-mead": "https://www.valheim.tools/icons/items/MeadBzerker.png",
  "lightfoot-mead": "https://www.valheim.tools/icons/items/MeadLightfoot.png",
  "anti-sting-concoction": "https://www.valheim.tools/icons/items/MeadBugRepellent.png",
  "tonic-of-ratatosk": "https://www.valheim.tools/icons/items/MeadHasty.png",
  "love-potion": "https://www.valheim.tools/icons/items/MeadTrollPheromones.png",
  "dverger-circlet": "https://www.valheim.tools/icons/items/HelmetDverger.png",
  "medium-stamina-mead": "https://www.valheim.tools/icons/items/MeadStaminaMedium.png",
  "yule-hat": "https://www.valheim.tools/icons/items/HelmetYule.png",
  "mead-of-troll-endurance": "https://www.valheim.tools/icons/items/MeadStrength.png",
  "lingering-healing-mead": "https://www.valheim.tools/icons/items/MeadHealthLingering.png",
  "lingering-eitr-mead": "https://www.valheim.tools/icons/items/MeadEitrLingering.png",
  "crown-of-roots": "https://www.valheim.tools/icons/items/HelmetRootCrown.png",
  "megingjord": "https://www.valheim.tools/icons/items/BeltStrength.png",
  "barrel-hoops": "https://www.valheim.tools/icons/items/BarrelRings.png",
  "thunder-stone": "https://www.valheim.tools/icons/items/Thunderstone.png",
  "serving-tray": "https://www.valheim.tools/icons/items/Feaster.png"
};

Object.assign(directIconOverrides, worldGuideIconOverrides);

const fishingIconOverrides: Record<string, string> = {
  "fishing-rod": "https://www.valheim.tools/icons/items/FishingRod.png",
  "fishing-hat": "https://www.valheim.tools/icons/items/HelmetFishingHat.png",
  "fishing-bait": "https://www.valheim.tools/icons/items/FishingBait.png",
  "mossy-fishing-bait": "https://www.valheim.tools/icons/items/FishingBaitForest.png",
  "sticky-fishing-bait": "https://www.valheim.tools/icons/items/FishingBaitSwamp.png",
  "cold-fishing-bait": "https://www.valheim.tools/icons/items/FishingBaitCave.png",
  "stingy-fishing-bait": "https://www.valheim.tools/icons/items/FishingBaitPlains.png",
  "heavy-fishing-bait": "https://www.valheim.tools/icons/items/FishingBaitOcean.png",
  "misty-fishing-bait": "https://www.valheim.tools/icons/items/FishingBaitMistlands.png",
  "hot-fishing-bait": "https://www.valheim.tools/icons/items/FishingBaitAshlands.png",
  "frosty-fishing-bait": "https://www.valheim.tools/icons/items/FishingBaitDeepNorth.png",
  "perch": "https://www.valheim.tools/icons/items/Fish1.png",
  "pike": "https://www.valheim.tools/icons/items/Fish2.png",
  "tuna": "https://www.valheim.tools/icons/items/Fish3.png",
  "tetra": "https://www.valheim.tools/icons/items/Fish4_cave.png",
  "trollfish": "https://www.valheim.tools/icons/items/Fish5.png",
  "giant-herring": "https://www.valheim.tools/icons/items/Fish6.png",
  "grouper": "https://www.valheim.tools/icons/items/Fish7.png",
  "coral-cod": "https://www.valheim.tools/icons/items/Fish8.png",
  "anglerfish": "https://www.valheim.tools/icons/items/Fish9.png",
  "northern-salmon": "https://www.valheim.tools/icons/items/Fish10.png",
  "magmafish": "https://www.valheim.tools/icons/items/Fish11.png",
  "pufferfish": "https://www.valheim.tools/icons/items/Fish12.png"
};

Object.assign(directIconOverrides, fishingIconOverrides);

const specialDropIconOverrides: Record<string, string> = {
  "hard-antler": "https://www.valheim.tools/icons/items/HardAntler.png",
  "antler-pickaxe": "https://www.valheim.tools/icons/items/PickaxeAntler.png",
  "swamp-key": "https://www.valheim.tools/icons/items/CryptKey.png",
  "bukeperries": "https://www.valheim.tools/icons/items/Pukeberries.png",
  "wishbone": "https://www.valheim.tools/icons/items/Wishbone.png",
  "red-jute": "https://www.valheim.tools/icons/items/JuteRed.png",
  "vile-ribcage": "https://www.valheim.tools/icons/items/UndeadBjornRibcage.png",
  "rotten-meat": "https://www.valheim.tools/icons/items/RottenMeat.png",
  "vilebone-cage": "https://www.valheim.tools/icons/items/ArmorBerserkerUndeadChest.png",
  "vilebone-drapes": "https://www.valheim.tools/icons/items/ArmorBerserkerUndeadLegs.png",
  "vilebone-maulclaws": "https://www.valheim.tools/icons/items/FistBjornUndeadClaw.png",
  "majestic-carapace": "https://www.valheim.tools/icons/items/QueenDrop.png",
  "artisan-press": "https://www.valheim.tools/icons/pieces/artisan_ext1.png",
  "sacrificial-blood": "https://www.valheim.tools/icons/items/FrozenKingDrop.png",
  "ancient-coin": "https://www.valheim.tools/icons/items/AncientCoin.png",
  "draumyx": "https://www.valheim.tools/icons/items/AncientGemstoneBlack.png",
  "grimvarn": "https://www.valheim.tools/icons/items/AncientGemstoneGreen.png",
  "solryth": "https://www.valheim.tools/icons/items/AncientGemstoneOrange.png",
  "veydris": "https://www.valheim.tools/icons/items/AncientGemstonePurple.png"
};

Object.assign(directIconOverrides, specialDropIconOverrides);

const trophyIconIds: Record<string, string> = {
  "boar-trophy": "TrophyBoar",
  "trophy-deer-white": "TrophyDeerWhite",
  "eikthyr-trophy": "TrophyEikthyr",
  "neck-trophy": "TrophyNeck",
  "brenna-trophy": "TrophySkeletonHildir",
  "ghost-trophy": "TrophyGhost",
  "greydwarf-trophy": "TrophyGreydwarf",
  "greydwarf-brute-trophy": "TrophyGreydwarfBrute",
  "rancid-remains-trophy": "TrophySkeletonPoison",
  "the-elder-trophy": "TrophyTheElder",
  "blob-trophy": "TrophyBlob",
  "bonemass-trophy": "TrophyBonemass",
  "draugr-trophy": "TrophyDraugr",
  "kvastur-trophy": "TrophyKvastur",
  "leech-trophy": "TrophyLeech",
  "surtling-trophy": "TrophySurtling",
  "wraith-trophy": "TrophyWraith",
  "writhan-trophy": "TrophyWrithan",
  "geirrhafa-trophy": "TrophyCultist_Hildir",
  "moder-trophy": "TrophyDragonQueen",
  "ulv-trophy": "TrophyUlv",
  "frost-blob-trophy": "TrophyBlob_Frost",
  "deathsquito-trophy": "TrophyDeathsquito",
  "fuling-trophy": "TrophyGoblin",
  "fuling-shaman-trophy": "TrophyGoblinShaman",
  "growth-trophy": "TrophyGrowth",
  "thungr-trophy": "TrophyGoblinBruteBrosBrute",
  "vile-trophy": "TrophyBjornUndead",
  "yagluth-trophy": "TrophyGoblinKing",
  "zil-trophy": "TrophyGoblinBruteBrosShaman",
  "dvergr-trophy": "TrophyDvergr",
  "hare-trophy": "TrophyHare",
  "seeker-soldier-trophy": "TrophySeekerBrute",
  "the-queen-trophy": "TrophySeekerQueen",
  "tick-trophy": "TrophyTick",
  "asksvin-trophy": "TrophyAsksvin",
  "bonemaw-trophy": "TrophyBonemawSerpent",
  "fader-trophy": "TrophyFader",
  "fallen-valkyrie-trophy": "TrophyFallenValkyrie",
  "lava-blob-trophy": "TrophyBlob_Lava",
  "marksman-trophy": "TrophyCharredArcher",
  "morgen-trophy": "TrophyMorgen",
  "volture-trophy": "TrophyVolture",
  "warlock-trophy": "TrophyCharredMage",
  "warrior-trophy": "TrophyCharredMelee",
  "barka-trophy": "TrophyBarka",
  "elaking-trophy": "TrophyElaking",
  "eyeless-one-trophy": "TrophyMole",
  "krigen-trophy": "TrophyJotunWarrior",
  "seal-trophy": "TrophySeal",
  "serpent-trophy": "TrophySerpent"
};

for (const [slug, itemId] of Object.entries(trophyIconIds)) {
  directIconOverrides[slug] = `https://www.valheim.tools/icons/items/${itemId}.png`;
}

const deepNorthIconIds: Record<string, string> = {
  "kindled-ribs": "FaderDrop",
  "embers": "FaderEmber",
  "petrified-tissue": "GoldOre",
  "bloodgold": "Gold",
  "ice": "Ice",
  "liquid-frost": "FrozenFuel",
  "frostcore": "FrostCore",
  "timberwood": "Frostwood",
  "elaking-hair-bundle": "ElakingHairBundle",
  "frozen-branch": "BarkaBranch",
  "leather-straps": "Leatherstraps",
  "memorial-coal": "MemorialCoal",
  "moose-hide": "MooseHide",
  "moose-meat": "MooseMeat",
  "moose-sinew": "MooseSinew",
  "nornathread": "NornThread",
  "seal-blubber": "SealBlubber",
  "seal-pelt": "SealHide",
  "frostfire-essence": "OrbFrostFire",
  "thunderblood-essence": "OrbThunderBlood",
  "long-claws": "MoleClaws",
  "hexen-trophy": "TrophyJotunWitch",
  "moose-trophy": "TrophyMoose",
  "lingonberries": "Lingonberry",
  "raw-fish": "FishRaw",
  "kale": "Kale",
  "kale-seeds": "KaleSeeds",
  "oats": "Oat",
  "oat-seeds": "OatSeeds",
  "oat-flour": "OatFlour",
  "poteitr": "Poteitr",
  "seed-poteitr": "PoteitrSeeds",
  "malicious-blood": "HatefulBlood",
  "bloodgold-battle-idol": "Upgrader7Weapon",
  "bloodgold-protection-idol": "Upgrader7Armor",

  "mould-nord-sword": "MoldSword",
  "mould-nord-axe": "MoldAxe",
  "mould-nord-mace": "MoldMace",
  "mould-nord-spear": "MoldSpear",
  "mould-nord-atgeir": "MoldAtgeir",
  "mould-nord-greatsword": "MoldSword2H",
  "mould-nord-greataxe": "MoldAxe2H",
  "mould-nord-dagger": "MoldKnife",
  "mould-nord-knucklechains": "MoldFistweapon",
  "mould-nord-bow": "MoldBow",
  "mould-nord-crossbow": "MoldCrossbow",
  "mould-nord-sledge": "MoldMace2H",
  "mould-nord-shield": "MoldShieldRound",
  "mould-nord-greatshield": "MoldShieldTower",
  "mould-nord-buckler": "MoldShieldBuckler",
  "mould-lightning-strike": "MoldStaffthunderblood",
  "mould-echo-spike": "MoldStaffOrbofAhri",
  "mould-northern-vengeance": "MoldStafffrostorbs",
  "mould-spirit-caller": "MoldStaffspiritcaller",
  "mould-helmet-of-the-protector": "MoldArmorGoldHelmet",
  "mould-breastplate-of-the-protector": "MoldArmorGoldChest",
  "mould-trousers-of-the-protector": "MoldArmorGoldLegs",
  "mould-hood-of-the-vanguard": "MoldArmorMediumHelmet",
  "mould-chestpiece-of-the-vanguard": "MoldArmormediumChest",
  "mould-trousers-of-the-vanguard": "MoldArmorMediumLegs",
  "mould-headdress-of-the-caller": "MoldArmorMageHelmet",
  "mould-robes-of-the-caller": "MoldArmorMageChest",
  "mould-trousers-of-the-caller": "MoldArmorMageLegs",
  "mould-intricate-key": "MoldKeys",

  "crown-jewel": "CrownJewel",
  "corked-vial": "BlobVial",
  "dead-pulp": "OozeMork",
  "pulp-trophy": "TrophyBlob_Morkhalla",
  "ectoplasm": "Ectoplasm",
  "ectoplasm-2": "Voidplasm",
  "seasoning-of-the-gourd": "SpiceDeepNorth",

  "nord-shield": "ShieldGold",
  "nord-greatshield": "ShieldGoldTower",
  "nord-buckler": "ShieldGoldBuckler",
  "lightning-strike": "StaffThunderBlood",
  "echo-spike": "StaffOrbofAhri",
  "northern-vengeance": "StaffFrostOrbs",
  "spirit-caller": "StaffSpiritCaller",
  "voidcaller": "KnifeVoid",
  "ember-charge-x10": "BombDynamite",
  "snowball": "Snowball",
  "blob-bomb-pulp": "BombBlob_Morkhalla",

  "helmet-of-the-protector": "HelmetDNHeavy",
  "breastplate-of-the-protector": "ArmorDeepNorthHeavyChest",
  "trousers-of-the-protector": "ArmorDeepNorthHeavylegs",
  "hood-of-the-vanguard": "HelmetDNMediumHood",
  "chestpiece-of-the-vanguard": "ArmorDeepNorthMediumChest",
  "trousers-of-the-vanguard": "ArmorDeepNorthMediumlegs",
  "headdress-of-the-caller": "HelmetDNMage",
  "robes-of-the-caller": "ArmorDeepNorthMageChest",
  "trousers-of-the-caller": "ArmorDeepNorthMagelegs",
  "cape-of-the-caller": "CapeDeepNorthMage",
  "moose-hide-cape": "CapeDeepNorth",
  "crown-of-valheim": "HelmetCrownofValheim",
  "neckstabber": "TrinketBloodGoldHealth",
  "witch-crown": "TrinketBloodGoldStamina",

  "fish-soup": "FishSoup",
  "lingonberry-juice": "Lingondricka",
  "meat-in-bread": "MooseKebab",
  "meatballs-and-poteitr": "MeatballsMashedPoteitr",
  "oat-milk": "OatMilk",
  "oatmeal": "OatmealLingonberryJam",
  "pancakes": "Pancakes",
  "seal-meat-soup": "SealSoup",
  "smoked-fish": "SmokedFish",
  "smoked-moose-meat": "SmokedMooseMeat",
  "cooked-moose-meat": "CookedMooseMeat",
  "snow-shovel": "Shovel",
  "moose-saddle": "SaddleMoose",

  "bloodgold-arrow": "ArrowBloodGold",
  "bloodgold-bolt": "BoltBloodGold",
  "bloodgold-missile": "TurretBoltBloodgold",
  "bloodgold-payload": "Catapult_Ammo_BloodGold",
  "intricate-key": "BloodGoldKey",
  "unbaked-poteitr": "BakedPoteitrUncooked",
  "baked-poteitr": "BakedPoteitr",
  "raw-kale-chips": "KaleChipsUncooked",
  "kale-chips": "KaleChips",
  "oven-pancake-batter": "OvenPancakeUncooked",
  "oven-pancake": "OvenPancake",
  "cooked-seal-blubber": "CookedSealBlubber",
  "northern-morning-fare": "FeastDeepNorth_Material"
};

for (const [slug, itemId] of Object.entries(deepNorthIconIds)) {
  directIconOverrides[slug] = `https://www.valheim.tools/icons/items/${itemId}.png`;
}

const deepNorthWeaponIconIds: Record<string, string> = {
  "sword": "SwordGold",
  "axe": "AxeGold",
  "mace": "MaceGold",
  "spear": "SpearGold",
  "atgeir": "AtgeirGold",
  "greatsword": "THSwordGold",
  "greataxe": "BattleaxeGold",
  "dagger": "KnifeGold",
  "knucklechains": "FistGold",
  "bow": "BowGold",
  "crossbow": "CrossbowGold",
  "sledge": "SledgeGold"
};

for (const [weapon, itemId] of Object.entries(deepNorthWeaponIconIds)) {
  directIconOverrides[`nord-${weapon}`] = `https://www.valheim.tools/icons/items/${itemId}.png`;
  directIconOverrides[`frostfire-${weapon}`] = `https://www.valheim.tools/icons/items/${itemId}_FrostFire.png`;
  directIconOverrides[`thunderblood-${weapon}`] = `https://www.valheim.tools/icons/items/${itemId}_BloodLightning.png`;
}

const deepNorthPieceIconIds: Record<string, string> = {
  "eternal-pyre": "piece_EternalPyre",
  "frigid-kiln": "piece_FrostKiln",
  "frost-foundry": "piece_FrostFoundry"
};

for (const [slug, pieceId] of Object.entries(deepNorthPieceIconIds)) {
  directIconOverrides[slug] = `https://www.valheim.tools/icons/pieces/${pieceId}.png`;
}

const resolveFandomFile = async (fileName: string): Promise<string | null> => {
  const api = new URL("https://valheim.fandom.com/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("format", "json");
  api.searchParams.set("formatversion", "2");
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url");
  api.searchParams.set("titles", `File:${fileName}`);

  const response = await fetchWithTimeout(api, {
    headers: {
      accept: "application/json",
      "user-agent": userAgent
    }
  });

  if (!response.ok) {
    throw new Error(`Could not resolve Fandom file ${fileName}: HTTP ${response.status}`);
  }

  const payload = await response.json() as FandomImageInfoResponse;
  const pages = Object.values(payload.query?.pages ?? {});
  const imageUrl = pages[0]?.imageinfo?.[0]?.url;
  if (!imageUrl) return null;

  const resolved = new URL(imageUrl);
  if (resolved.hostname !== "static.wikia.nocookie.net") {
    throw new Error(`Unexpected resolved image host for ${fileName}: ${resolved.hostname}`);
  }
  return resolved.toString();
};

const resolveValheimToolsIcon = async (slug: string): Promise<string | null> => {
  const candidates = [
    `https://www.valheim.tools/items/${slug}`,
    `https://www.valheim.tools/building/${slug}`
  ];

  for (const pageUrl of candidates) {
    const response = await fetchWithTimeout(pageUrl, {
      headers: {
        accept: "text/html",
        "user-agent": userAgent
      }
    });
    if (!response.ok) continue;

    const html = await response.text();
    const match =
      html.match(/(?:src|href)=["']([^"']*\/icons\/[^"']+\.png)["']/i)
      ?? html.match(/https:\/\/www\.valheim\.tools\/icons\/[^"'<> ]+\.png/i);

    const raw = match?.[1] ?? match?.[0];
    if (raw) {
      const iconUrl = new URL(raw, pageUrl);
      if (iconUrl.hostname === "www.valheim.tools" && iconUrl.pathname.startsWith("/icons/")) {
        return iconUrl.toString();
      }
    }

    const plainText = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;|&#160;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ");

    const idMatch =
      html.match(/"itemId"\s*:\s*"([^"]+)"/i)
      ?? html.match(/"pieceId"\s*:\s*"([^"]+)"/i)
      ?? plainText.match(/(?:Item|Piece) ID:?\s*([A-Za-z0-9_]+)/i);
    const itemId = idMatch?.[1];
    if (itemId) {
      const folder = pageUrl.includes("/building/") ? "pieces" : "items";
      return `https://www.valheim.tools/icons/${folder}/${itemId}.png`;
    }
  }
  return null;
};

await mkdir(outputDirectory, { recursive: true });

const failures: string[] = [];

const importMedia = async (media: MediaRecord): Promise<void> => {
  try {
  const isBundledManifestUrl = media.url.startsWith("https://static.wikia.nocookie.net/");
  const deployedIcon = isBundledManifestUrl ? null : await resolveProductionMedia(media.output);

  let resolvedCatalogIcon: string | null = null;
  if (!isBundledManifestUrl && !directIconOverrides[media.slug] && !deployedIcon) {
    try {
      resolvedCatalogIcon = await resolveValheimToolsIcon(media.slug);
    } catch (error) {
      console.warn(`Valheim.tools lookup failed for ${media.slug}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  let resolvedFandomIcon: string | null = null;
  if (!isBundledManifestUrl && !directIconOverrides[media.slug] && !deployedIcon && !resolvedCatalogIcon) {
    try {
      resolvedFandomIcon = await resolveFandomFile(media.url);
    } catch (error) {
      console.warn(`Fandom lookup failed for ${media.slug}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const sourceUrl = directIconOverrides[media.slug]
    ?? (isBundledManifestUrl ? media.url : deployedIcon ?? resolvedCatalogIcon ?? resolvedFandomIcon);

  if (!sourceUrl) {
    throw new Error(`No image source found for ${media.slug} (Fandom file: ${media.url})`);
  }

  const response = await fetchImageWithRetry(sourceUrl, {
    headers: {
      accept: media.output.endsWith(".png") ? "image/png,image/*;q=0.8" : "image/webp,image/*;q=0.8",
      "user-agent": userAgent
    }
  });

  const finalUrl = new URL(response.url);
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.startsWith("image/") || !["static.wikia.nocookie.net", "www.valheim.tools", "valheim-guide.partiya-odobryaet-bot.workers.dev"].includes(finalUrl.hostname)) {
    throw new Error(`Could not import ${media.slug}: ${response.status} ${response.url} ${contentType}`);
  }

  const destination = resolve(outputDirectory, media.output);
  if (!destination.startsWith(outputDirectory)) throw new Error(`Unsafe media output path for ${media.slug}`);

  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  console.info(`Imported ${media.slug} → public/media/wiki/${media.output}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${media.slug}: ${message}`);
    console.error(`FAILED ${media.slug}: ${message}`);
  }
};

const mediaEntries = [...manifest.values()];
const importConcurrency = 8;
for (let index = 0; index < mediaEntries.length; index += importConcurrency) {
  const batch = mediaEntries.slice(index, index + importConcurrency);
  await Promise.all(batch.map(importMedia));
  console.info(`Media import progress: ${Math.min(index + batch.length, mediaEntries.length)}/${mediaEntries.length}`);
}
if (failures.length) {
  throw new Error(`Media import failed for ${failures.length} entries:\n${failures.join("\n")}`);
}
