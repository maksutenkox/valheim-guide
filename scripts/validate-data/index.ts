import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const seedDirectory = resolve(root, "src/worker/services");
const seedFiles = (await readdir(seedDirectory))
  .filter((name) => /^seed-.*\.ts$/.test(name))
  .sort();

const migrationFiles = [
  resolve(root, "migrations/0004_seed_starter_catalog.sql"),
  resolve(root, "migrations/0005_add_meadows_weapons_and_media.sql")
];

const [seedContents, migrationContents] = await Promise.all([
  Promise.all(seedFiles.map(async (name) => ({
    name,
    content: await readFile(resolve(seedDirectory, name), "utf8")
  }))),
  Promise.all(migrationFiles.map((path) => readFile(path, "utf8")))
]);

const defined = new Set<string>();
for (const seed of seedContents) {
  for (const match of seed.content.matchAll(/slug:\s*"([^"]+)"/g)) defined.add(match[1]);
}
for (const match of migrationContents.join("\n").matchAll(/'([a-z0-9-]+)'/g)) defined.add(match[1]);

const duplicateSlugs: string[] = [];
const seenSeedSlugs = new Map<string, string>();
for (const seed of seedContents) {
  for (const match of seed.content.matchAll(/\{\s*slug:\s*"([^"]+)",\s*type:\s*"(?:item|resource)"/g)) {
    const slug = match[1];
    const previous = seenSeedSlugs.get(slug);
    if (previous && previous !== seed.name) duplicateSlugs.push(`${slug} (${previous}, ${seed.name})`);
    else if (!previous) seenSeedSlugs.set(slug, seed.name);
  }
}

const missingReferences: string[] = [];
const invalidQuantities: string[] = [];
const invalidOutputs: string[] = [];
let recipeCount = 0;
let upgradeCount = 0;
let entityCount = 0;

for (const seed of seedContents) {
  entityCount += [...seed.content.matchAll(/\{\s*slug:\s*"([^"]+)",\s*type:\s*"(?:item|resource)"/g)].length;

  const recipes = [...seed.content.matchAll(/\{\s*item:\s*"([^"]+)",\s*station:[^\n]+ingredients:\s*\[(.*?)\]\s*\}/gs)];
  recipeCount += recipes.length;
  for (const recipe of recipes) {
    const itemSlug = recipe[1];
    if (!defined.has(itemSlug)) missingReferences.push(`${seed.name}: recipe item ${itemSlug}`);
    for (const ingredient of recipe[2].matchAll(/\["([^"]+)",\s*(-?\d+)\]/g)) {
      if (!defined.has(ingredient[1])) missingReferences.push(`${seed.name}: ${itemSlug} -> ${ingredient[1]}`);
      if (Number(ingredient[2]) <= 0) invalidQuantities.push(`${seed.name}: ${itemSlug} -> ${ingredient[1]}=${ingredient[2]}`);
    }
  }

  const upgrades = [...seed.content.matchAll(/\{\s*item:\s*"([^"]+)",\s*level:\s*\d+[^\n]+ingredients:\s*\[(.*?)\]\s*\}/gs)];
  upgradeCount += upgrades.length;
  for (const upgrade of upgrades) {
    const itemSlug = upgrade[1];
    if (!defined.has(itemSlug)) missingReferences.push(`${seed.name}: upgrade item ${itemSlug}`);
    for (const ingredient of upgrade[2].matchAll(/\["([^"]+)",\s*(-?\d+)\]/g)) {
      if (!defined.has(ingredient[1])) missingReferences.push(`${seed.name}: upgrade ${itemSlug} -> ${ingredient[1]}`);
      if (Number(ingredient[2]) <= 0) invalidQuantities.push(`${seed.name}: upgrade ${itemSlug} -> ${ingredient[1]}=${ingredient[2]}`);
    }
  }

  for (const output of seed.content.matchAll(/output:\s*(-?\d+)/g)) {
    if (Number(output[1]) <= 0) invalidOutputs.push(`${seed.name}: output=${output[1]}`);
  }
}

if (duplicateSlugs.length || missingReferences.length || invalidQuantities.length || invalidOutputs.length) {
  console.error("Catalog validation failed.");
  if (duplicateSlugs.length) console.error("Duplicate seed slugs:", duplicateSlugs.join(", "));
  if (missingReferences.length) console.error("Missing references:", missingReferences.join(", "));
  if (invalidQuantities.length) console.error("Invalid quantities:", invalidQuantities.join(", "));
  if (invalidOutputs.length) console.error("Invalid outputs:", invalidOutputs.join(", "));
  process.exit(1);
}

console.info(
  `Catalog validation passed across ${seedFiles.length} biome seeds: ${entityCount} entities, ${recipeCount} recipes, ${upgradeCount} upgrade rows.`
);
