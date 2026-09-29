import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const files = {
  blackForest: resolve(root, "src/worker/services/seed-black-forest.ts"),
  starter: resolve(root, "migrations/0004_seed_starter_catalog.sql"),
  meadows: resolve(root, "migrations/0005_add_meadows_weapons_and_media.sql")
};

const [blackForest, starter, meadows] = await Promise.all([
  readFile(files.blackForest, "utf8"),
  readFile(files.starter, "utf8"),
  readFile(files.meadows, "utf8")
]);

const defined = new Set<string>();
for (const match of blackForest.matchAll(/slug:\s*"([^"]+)"/g)) defined.add(match[1]);
for (const match of (starter + "\n" + meadows).matchAll(/'([a-z0-9-]+)'/g)) defined.add(match[1]);

const localSlugs = [...blackForest.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const duplicateSlugs = [...new Set(localSlugs.filter((slug, index) => localSlugs.indexOf(slug) !== index))];

const missingReferences: string[] = [];
const recipes = [...blackForest.matchAll(/\{\s*item:\s*"([^"]+)",\s*station:[^\n]+ingredients:\s*\[(.*?)\]\s*\}/gs)];
for (const recipe of recipes) {
  const itemSlug = recipe[1];
  if (!defined.has(itemSlug)) missingReferences.push(`recipe item: ${itemSlug}`);
  for (const ingredient of recipe[2].matchAll(/\["([^"]+)",\s*\d+\]/g)) {
    if (!defined.has(ingredient[1])) missingReferences.push(`${itemSlug} -> ${ingredient[1]}`);
  }
}

const upgrades = [...blackForest.matchAll(/\{\s*item:\s*"([^"]+)",\s*level:\s*\d+[^\n]+ingredients:\s*\[(.*?)\]\s*\}/gs)];
for (const upgrade of upgrades) {
  const itemSlug = upgrade[1];
  if (!defined.has(itemSlug)) missingReferences.push(`upgrade item: ${itemSlug}`);
  for (const ingredient of upgrade[2].matchAll(/\["([^"]+)",\s*\d+\]/g)) {
    if (!defined.has(ingredient[1])) missingReferences.push(`upgrade ${itemSlug} -> ${ingredient[1]}`);
  }
}

const invalidQuantities = [...blackForest.matchAll(/\["([^"]+)",\s*(-?\d+)\]/g)]
  .filter((match) => Number(match[2]) <= 0)
  .map((match) => `${match[1]}=${match[2]}`);

if (duplicateSlugs.length || missingReferences.length || invalidQuantities.length) {
  console.error("Catalog validation failed.");
  if (duplicateSlugs.length) console.error("Duplicate slugs:", duplicateSlugs.join(", "));
  if (missingReferences.length) console.error("Missing references:", missingReferences.join(", "));
  if (invalidQuantities.length) console.error("Invalid quantities:", invalidQuantities.join(", "));
  process.exit(1);
}

console.info(
  `Catalog validation passed: ${localSlugs.length} Black Forest entities, ${recipes.length} recipes, ${upgrades.length} upgrade rows.`
);
