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

const catalogManifest: MediaRecord[] = seedSource
  .split("\n")
  .map((line) => {
    const match = line.match(/\{\s*slug:\s*"([^"]+)".*imageFile:\s*"([^"]+)"/);
    if (!match) return null;
    const [, slug, imageFile] = match;
    return {
      slug,
      url: imageFile,
      output: `${slug}.png`
    };
  })
  .filter((entry): entry is MediaRecord => Boolean(entry));

const manifest = new Map<string, MediaRecord>();
for (const entry of [...staticManifest, ...catalogManifest]) {
  manifest.set(entry.output, entry);
}

const userAgent = "VALHEIM-Guide/0.1 (+https://github.com/maksutenkox/valheim-guide)";
const productionMediaOrigin = "https://valheim-guide.partiya-odobryaet-bot.workers.dev";

const resolveProductionMedia = async (output: string): Promise<string | null> => {
  const url = `${productionMediaOrigin}/media/wiki/${output}`;
  try {
    const response = await fetch(url, {
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

const resolveFandomFile = async (fileName: string): Promise<string | null> => {
  const api = new URL("https://valheim.fandom.com/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("format", "json");
  api.searchParams.set("formatversion", "2");
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url");
  api.searchParams.set("titles", `File:${fileName}`);

  const response = await fetch(api, {
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
    const response = await fetch(pageUrl, {
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

for (const media of manifest.values()) {
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

  const response = await fetch(sourceUrl, {
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
}

if (failures.length) {
  throw new Error(`Media import failed for ${failures.length} entries:\n${failures.join("\n")}`);
}
