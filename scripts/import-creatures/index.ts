import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type ResistanceLevel = "weak" | "very-weak" | "resistant" | "very-resistant" | "immune" | "ignore";
type Detail = {
  health: number;
  image_url: string | null;
  resistances: Array<{ type: string; level: ResistanceLevel }>;
  drops: Array<{ name: string; chance: string | null; amount: string | null }>;
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const catalogPath = resolve(root, "src/worker/services/creatures.ts");
const outputPath = resolve(root, "src/worker/generated/creature-details.ts");
const source = await readFile(catalogPath, "utf8");

const slugs = [...new Set([
  ...[...source.matchAll(/creature\("([^"]+)"/g)].map((match) => match[1]),
  ...[...source.matchAll(/boss\("([^"]+)"/g)].map((match) => match[1])
])];

const decodeHtml = (value: string): string => value
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">");

const plainText = (html: string): string => decodeHtml(html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
).trim();

const damageTypes = ["Blunt","Slash","Pierce","Chop","Pickaxe","Fire","Frost","Lightning","Poison","Spirit"];
const levels: Array<[string, ResistanceLevel]> = [
  ["Very Resistant","very-resistant"],
  ["Very Weak","very-weak"],
  ["Resistant","resistant"],
  ["Immune","immune"],
  ["Ignore","ignore"],
  ["Weak","weak"]
];

const parseResistances = (plain: string) => {
  const start = plain.indexOf("Resistances");
  if (start < 0) return [];
  const ends = [plain.indexOf("Drops", start), plain.indexOf("What to know", start)].filter((v) => v > start);
  const segment = plain.slice(start, ends.length ? Math.min(...ends) : Math.min(plain.length, start + 900));
  const output: Detail["resistances"] = [];
  for (const type of damageTypes) {
    for (const [label, level] of levels) {
      if (segment.includes(`${type} ${label}`)) {
        output.push({ type: type.toLowerCase(), level });
        break;
      }
    }
  }
  return output;
};

const parseDrops = (plain: string) => {
  const startMatch = plain.match(/Drops\s+\d+/i);
  if (!startMatch || startMatch.index == null) return [];
  const start = startMatch.index + startMatch[0].length;
  const ends = [plain.indexOf("Star levels", start), plain.indexOf("What to know", start), plain.indexOf("About", start)]
    .filter((v) => v > start);
  const segment = plain.slice(start, ends.length ? Math.min(...ends) : Math.min(plain.length, start + 1400));
  const regex = /([A-Z][A-Za-z0-9' .:&()\-]+?)(\d+(?:\.\d+)?%)\s*·\s*([0-9]+(?:-[0-9]+)?)(?:\s*·\s*within\s*\d+\s*kills)?/g;
  const drops: Detail["drops"] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(segment)) && drops.length < 16) {
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

const fetchDetail = async (slug: string): Promise<[string, Detail]> => {
  const url = `https://www.valheim.tools/creatures/${slug}`;
  const response = await fetch(url, {
    headers: { accept: "text/html", "user-agent": "VALHEIM-Guide/1.0 (+https://github.com/maksutenkox/valheim-guide)" },
    signal: AbortSignal.timeout(20_000)
  });
  if (!response.ok) throw new Error(`${slug}: HTTP ${response.status}`);
  const html = await response.text();
  const plain = plainText(html);
  const healthMatch = plain.match(/Health(?:, whole fight)?\s+([\d,]+)/i);
  if (!healthMatch) throw new Error(`${slug}: health not found`);
  return [slug, {
    health: Number(healthMatch[1].replaceAll(",", "")),
    image_url: parseOgImage(html),
    resistances: parseResistances(plain),
    drops: parseDrops(plain)
  }];
};

const result: Record<string, Detail> = {};
const failures: string[] = [];
const queue = [...slugs];
const workers = Array.from({ length: 6 }, async () => {
  while (queue.length) {
    const slug = queue.shift();
    if (!slug) break;
    try {
      const [key, value] = await fetchDetail(slug);
      result[key] = value;
      console.info(`Imported combat data: ${slug} (${value.health} HP, ${value.resistances.length} resistances, ${value.drops.length} drops)`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(message);
      console.warn(`Combat data fallback: ${message}`);
    }
  }
});
await Promise.all(workers);

if (!result.morgen?.resistances.some((entry) => entry.type === "lightning" && entry.level === "weak")) {
  throw new Error("Combat import verification failed: Morgen lightning weakness missing");
}
if (!result.morgen?.drops.some((drop) => drop.name === "Morgen Sinew")) {
  throw new Error("Combat import verification failed: Morgen Sinew drop missing");
}

const generated = `export type GeneratedCreatureResistance = {
  type: string;
  level: "weak" | "very-weak" | "resistant" | "very-resistant" | "immune" | "ignore";
};

export type GeneratedCreatureDrop = {
  name: string;
  chance: string | null;
  amount: string | null;
};

export type GeneratedCreatureDetail = {
  health: number;
  image_url: string | null;
  resistances: GeneratedCreatureResistance[];
  drops: GeneratedCreatureDrop[];
};

export const generatedCreatureDetails: Record<string, GeneratedCreatureDetail> = ${JSON.stringify(result, null, 2)};
`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, generated, "utf8");
console.info(`Combat data imported: ${Object.keys(result).length}/${slugs.length} entries`);
if (failures.length) console.warn(`Combat data unavailable for ${failures.length} entries: ${failures.join(", ")}`);
