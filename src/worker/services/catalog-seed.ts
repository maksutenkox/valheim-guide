import type { Env } from "../env";

export type SeedItem = {
  slug: string;
  type: "item" | "resource";
  category: string;
  en: string;
  ru: string;
  descriptionEn: string;
  descriptionRu: string;
  imageFile?: string;
  source: string;
  sourceName?: string;
  biome?: string;
};

export type SeedRecipe = {
  item: string;
  station: string;
  level?: number;
  output?: number;
  ingredients: Array<[string, number]>;
};

export type SeedUpgrade = {
  item: string;
  level: number;
  stationLevel: number;
  ingredients: Array<[string, number]>;
};

export type SeedStat = [slug: string, key: string, value: string, unit?: string];
export type SeedResourceSource = [slug: string, en: string, ru: string, source: string];

export type CatalogSeed = {
  marker: string;
  biome: string;
  items: SeedItem[];
  recipes?: SeedRecipe[];
  upgrades?: SeedUpgrade[];
  stats?: SeedStat[];
  resourceSources?: SeedResourceSource[];
  replaceResourceSources?: boolean;
  stations?: Array<{ slug: string; en: string; ru: string }>;
  categories?: Array<{ slug: string; en: string; ru: string; sortOrder: number }>;
};

const runBatches = async (env: Env, statements: D1PreparedStatement[]): Promise<void> => {
  for (let index = 0; index < statements.length; index += 50) {
    await env.DB.batch(statements.slice(index, index + 50));
  }
};

const sourceLabel = (item: SeedItem): string =>
  item.sourceName
    ?? (item.source.includes("valheim.tools")
      ? "Valheim.tools"
      : item.source.includes("valheim.fandom.com")
        ? "Valheim Wiki (Fandom)"
        : "Source");

const iconSource = (fileName: string): string =>
  `https://valheim.fandom.com/wiki/Special:Redirect/file/${fileName}`;

export const ensureCatalogSchema = async (env: Env): Promise<void> => {
  const { results } = await env.DB.prepare("PRAGMA table_info(recipes)").all<{ name: string }>();
  if (!results.some((column) => column.name === "output_quantity")) {
    await env.DB.prepare("ALTER TABLE recipes ADD COLUMN output_quantity INTEGER NOT NULL DEFAULT 1").run();
  }
};

export const applyCatalogSeed = async (env: Env, seed: CatalogSeed): Promise<void> => {
  await ensureCatalogSchema(env);
  const marker = await env.DB.prepare("SELECT value FROM schema_metadata WHERE key = ?")
    .bind(seed.marker).first<{ value: string }>();
  if (marker?.value === "done") return;

  const categoryStatements = (seed.categories ?? []).map((category) =>
    env.DB.prepare(`
      INSERT INTO categories (slug,name_en,name_ru,sort_order)
      VALUES (?,?,?,?)
      ON CONFLICT(slug) DO UPDATE SET
        name_en=excluded.name_en,
        name_ru=excluded.name_ru,
        sort_order=excluded.sort_order
    `).bind(category.slug, category.en, category.ru, category.sortOrder)
  );
  if (categoryStatements.length) await runBatches(env, categoryStatements);

  const stationStatements = (seed.stations ?? []).map((station) =>
    env.DB.prepare(`
      INSERT INTO crafting_stations (slug,name_en,name_ru)
      VALUES (?,?,?)
      ON CONFLICT(slug) DO UPDATE SET
        name_en=excluded.name_en,
        name_ru=excluded.name_ru
    `).bind(station.slug, station.en, station.ru)
  );
  if (stationStatements.length) await runBatches(env, stationStatements);

  const itemStatements = seed.items.map((item) => env.DB.prepare(`
    INSERT INTO items (
      slug,entity_type,name_en,name_ru,description_en,description_ru,
      biome_id,category_id,image_path,image_source_url,image_license_note,source_name,source_url
    )
    VALUES (
      ?,?,?,?,?,?,
      (SELECT id FROM biomes WHERE slug=?),
      (SELECT id FROM categories WHERE slug=?),
      ?,?,?,?,?
    )
    ON CONFLICT(slug) DO UPDATE SET
      entity_type=excluded.entity_type,
      name_en=excluded.name_en,
      name_ru=excluded.name_ru,
      description_en=excluded.description_en,
      description_ru=excluded.description_ru,
      biome_id=excluded.biome_id,
      category_id=excluded.category_id,
      image_path=excluded.image_path,
      image_source_url=excluded.image_source_url,
      image_license_note=excluded.image_license_note,
      source_name=excluded.source_name,
      source_url=excluded.source_url,
      updated_at=CURRENT_TIMESTAMP
  `).bind(
    item.slug,
    item.type,
    item.en,
    item.ru,
    item.descriptionEn,
    item.descriptionRu,
    item.biome ?? seed.biome,
    item.category,
    item.imageFile ? `/media/wiki/${item.slug}.png` : null,
    item.imageFile ? iconSource(item.imageFile) : item.source,
    "Game asset / source page retained for attribution",
    sourceLabel(item),
    item.source
  ));
  await runBatches(env, itemStatements);

  const resourceSources = seed.resourceSources ?? [];
  if (resourceSources.length && seed.replaceResourceSources) {
    const sourceSlugs = [...new Set(resourceSources.map(([slug]) => slug))];
    await runBatches(env, sourceSlugs.map((slug) => env.DB.prepare(`
      DELETE FROM resource_sources
      WHERE resource_id = (SELECT id FROM items WHERE slug = ?)
    `).bind(slug)));
  }
  if (resourceSources.length) {
    await runBatches(env, resourceSources.map(([slug, en, ru, source], sort) => env.DB.prepare(`
      INSERT INTO resource_sources (resource_id,method_en,method_ru,biome_id,source_url,sort_order)
      SELECT i.id,?,?,b.id,?,?
      FROM items i
      JOIN biomes b ON b.slug=?
      WHERE i.slug=?
      AND NOT EXISTS (
        SELECT 1 FROM resource_sources rs
        WHERE rs.resource_id=i.id AND rs.method_en=?
      )
    `).bind(en, ru, source, sort + 10, seed.biome, slug, en)));
  }

  const recipeStatements: D1PreparedStatement[] = [];
  for (const recipe of seed.recipes ?? []) {
    recipeStatements.push(env.DB.prepare(`
      INSERT INTO recipes (item_id,crafting_station_id,station_level,output_quantity)
      SELECT i.id,s.id,?,?
      FROM items i
      JOIN crafting_stations s ON s.slug=?
      WHERE i.slug=?
      ON CONFLICT(item_id) DO UPDATE SET
        crafting_station_id=excluded.crafting_station_id,
        station_level=excluded.station_level,
        output_quantity=excluded.output_quantity
    `).bind(recipe.level ?? 1, recipe.output ?? 1, recipe.station, recipe.item));

    for (const [resource, quantity] of recipe.ingredients) {
      recipeStatements.push(env.DB.prepare(`
        INSERT INTO recipe_ingredients (recipe_id,resource_id,quantity)
        SELECT re.id,r.id,?
        FROM recipes re
        JOIN items i ON i.id=re.item_id
        JOIN items r ON r.slug=?
        WHERE i.slug=?
        ON CONFLICT(recipe_id,resource_id) DO UPDATE SET quantity=excluded.quantity
      `).bind(quantity, resource, recipe.item));
    }
  }
  if (recipeStatements.length) await runBatches(env, recipeStatements);

  const upgradeStatements: D1PreparedStatement[] = [];
  for (const upgrade of seed.upgrades ?? []) {
    upgradeStatements.push(env.DB.prepare(`
      INSERT INTO item_upgrades (item_id,level,station_level)
      SELECT i.id,?,?
      FROM items i
      WHERE i.slug=?
      ON CONFLICT(item_id,level) DO UPDATE SET station_level=excluded.station_level
    `).bind(upgrade.level, upgrade.stationLevel, upgrade.item));

    for (const [resource, quantity] of upgrade.ingredients) {
      upgradeStatements.push(env.DB.prepare(`
        INSERT INTO upgrade_ingredients (upgrade_id,resource_id,quantity)
        SELECT u.id,r.id,?
        FROM item_upgrades u
        JOIN items i ON i.id=u.item_id
        JOIN items r ON r.slug=?
        WHERE i.slug=? AND u.level=?
        ON CONFLICT(upgrade_id,resource_id) DO UPDATE SET quantity=excluded.quantity
      `).bind(quantity, resource, upgrade.item, upgrade.level));
    }
  }
  if (upgradeStatements.length) await runBatches(env, upgradeStatements);

  const stats = seed.stats ?? [];
  if (stats.length) {
    await runBatches(env, stats.map(([slug, key, value, unit], sort) => env.DB.prepare(`
      INSERT INTO item_stats (item_id,stat_key,stat_value,unit,sort_order)
      SELECT i.id,?,?,?,?
      FROM items i
      WHERE i.slug=?
      ON CONFLICT(item_id,stat_key) DO UPDATE SET
        stat_value=excluded.stat_value,
        unit=excluded.unit,
        sort_order=excluded.sort_order
    `).bind(key, value, unit ?? null, sort + 10, slug)));
  }

  await env.DB.prepare(`
    INSERT INTO schema_metadata (key,value,updated_at)
    VALUES (?,'done',CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value='done',
      updated_at=CURRENT_TIMESTAMP
  `).bind(seed.marker).run();
};
