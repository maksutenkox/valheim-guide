import type { Env } from "./env";
import { json, notFound, parsePositiveInt } from "./api/helpers";
import { AuthError, ensureUser, getTelegramUserId } from "./telegram/auth";

type ItemRow = {
  id: number;
  slug: string;
  entity_type: "item" | "resource";
  name_en: string;
  name_ru: string;
  description_en: string;
  description_ru: string;
  image_path: string | null;
  biome_slug: string | null;
  biome_name_en: string | null;
  biome_name_ru: string | null;
  category_slug: string | null;
  category_name_en: string | null;
  category_name_ru: string | null;
};

const itemSelect = `
  SELECT i.id, i.slug, i.entity_type, i.name_en, i.name_ru, i.description_en, i.description_ru,
         i.image_path, b.slug AS biome_slug, b.name_en AS biome_name_en, b.name_ru AS biome_name_ru,
         c.slug AS category_slug, c.name_en AS category_name_en, c.name_ru AS category_name_ru
  FROM items i
  LEFT JOIN biomes b ON b.id = i.biome_id
  LEFT JOIN categories c ON c.id = i.category_id`;

const readJson = async <T>(request: Request): Promise<T | null> => {
  try { return await request.json<T>(); } catch { return null; }
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      try {
        const result = await env.DB.prepare("SELECT 1 AS value").first<{ value: number }>();
        if (result?.value !== 1) throw new Error("Unexpected D1 health result");
        return json({ status: "ok", database: "connected" });
      } catch {
        return json({ status: "error", database: "unavailable" }, 503);
      }
    }

    if (request.method === "GET" && url.pathname === "/api/biomes") {
      const { results } = await env.DB.prepare(
        "SELECT slug, name_en, name_ru, description_en, description_ru, image_path, accent_color FROM biomes ORDER BY id"
      ).all();
      return json({ data: results });
    }

    const biomeMatch = url.pathname.match(/^\/api\/biomes\/([a-z0-9-]+)$/);
    if (request.method === "GET" && biomeMatch) {
      const biome = await env.DB.prepare(
        "SELECT id, slug, name_en, name_ru, description_en, description_ru, image_path, accent_color FROM biomes WHERE slug = ?"
      ).bind(biomeMatch[1]).first<{ id: number } & Record<string, unknown>>();
      if (!biome) return notFound();
      const { results: categories } = await env.DB.prepare(
        "SELECT DISTINCT c.slug, c.name_en, c.name_ru FROM categories c JOIN items i ON i.category_id = c.id WHERE i.biome_id = ? ORDER BY c.sort_order"
      ).bind(biome.id).all();
      return json({ data: { ...biome, categories } });
    }

    if (request.method === "GET" && url.pathname === "/api/items") {
      const page = parsePositiveInt(url.searchParams.get("page"), 1, 10_000);
      const limit = parsePositiveInt(url.searchParams.get("limit"), 30, 100);
      const filters: string[] = ["i.entity_type = 'item'"];
      const bindings: (string | number)[] = [];
      if (url.searchParams.has("biome")) { filters.push("b.slug = ?"); bindings.push(url.searchParams.get("biome")!); }
      if (url.searchParams.has("category")) { filters.push("c.slug = ?"); bindings.push(url.searchParams.get("category")!); }
      const query = `${itemSelect} WHERE ${filters.join(" AND ")} ORDER BY i.name_en LIMIT ? OFFSET ?`;
      const { results } = await env.DB.prepare(query).bind(...bindings, limit, (page - 1) * limit).all<ItemRow>();
      return json({ data: results, page, limit });
    }

    const itemMatch = url.pathname.match(/^\/api\/items\/([a-z0-9-]+)$/);
    if (request.method === "GET" && itemMatch) {
      const item = await env.DB.prepare(`${itemSelect} WHERE i.slug = ? AND i.entity_type = 'item'`).bind(itemMatch[1]).first<ItemRow>();
      if (!item) return notFound();
      const [stats, ingredients, upgrades] = await Promise.all([
        env.DB.prepare("SELECT stat_key, stat_value, unit FROM item_stats WHERE item_id = ? ORDER BY sort_order").bind(item.id).all(),
        env.DB.prepare(`SELECT ri.quantity, r.slug, r.name_en, r.name_ru FROM recipes re JOIN recipe_ingredients ri ON ri.recipe_id = re.id JOIN items r ON r.id = ri.resource_id WHERE re.item_id = ? ORDER BY r.name_en`).bind(item.id).all(),
        env.DB.prepare("SELECT id, level, station_level FROM item_upgrades WHERE item_id = ? ORDER BY level").bind(item.id).all<{ id: number; level: number; station_level: number | null }>()
      ]);
      const upgradeDetails = await Promise.all(upgrades.results.map(async (upgrade) => ({
        ...upgrade,
        ingredients: (await env.DB.prepare("SELECT ui.quantity, r.slug, r.name_en, r.name_ru FROM upgrade_ingredients ui JOIN items r ON r.id = ui.resource_id WHERE ui.upgrade_id = ? ORDER BY r.name_en").bind(upgrade.id).all()).results
      })));
      return json({ data: { ...item, stats: stats.results, ingredients: ingredients.results, upgrades: upgradeDetails } });
    }

    if (request.method === "GET" && url.pathname === "/api/resources") {
      const { results } = await env.DB.prepare(`${itemSelect} WHERE i.entity_type = 'resource' ORDER BY i.name_en`).all<ItemRow>();
      return json({ data: results });
    }

    const resourceMatch = url.pathname.match(/^\/api\/resources\/([a-z0-9-]+)$/);
    if (request.method === "GET" && resourceMatch) {
      const resource = await env.DB.prepare(`${itemSelect} WHERE i.slug = ? AND i.entity_type = 'resource'`).bind(resourceMatch[1]).first<ItemRow>();
      if (!resource) return notFound();
      const [sources, usedBy] = await Promise.all([
        env.DB.prepare("SELECT method_en, method_ru, source_url FROM resource_sources WHERE resource_id = ? ORDER BY sort_order").bind(resource.id).all(),
        env.DB.prepare(`${itemSelect} JOIN recipes re ON re.item_id = i.id JOIN recipe_ingredients ri ON ri.recipe_id = re.id WHERE ri.resource_id = ? AND i.entity_type = 'item' ORDER BY i.name_en`).bind(resource.id).all<ItemRow>()
      ]);
      return json({ data: { ...resource, sources: sources.results, used_by: usedBy.results } });
    }

    if (request.method === "GET" && url.pathname === "/api/search") {
      const query = url.searchParams.get("q")?.trim() ?? "";
      if (query.length < 2) return json({ data: [] });
      const { results } = await env.DB.prepare(`${itemSelect} WHERE i.name_en LIKE ? OR i.name_ru LIKE ? ORDER BY i.name_en LIMIT 50`)
        .bind(`%${query}%`, `%${query}%`).all<ItemRow>();
      return json({ data: results });
    }

    if (url.pathname === "/api/favorites") {
      try {
        const userId = await getTelegramUserId(request, env);
        await ensureUser(env, userId);
        if (request.method === "GET") {
          const { results } = await env.DB.prepare(`${itemSelect} JOIN favorites f ON f.item_id = i.id WHERE f.telegram_user_id = ? ORDER BY f.created_at DESC`).bind(userId).all<ItemRow>();
          return json({ data: results });
        }
      } catch (error) {
        if (error instanceof AuthError) return json({ error: error.message }, 401);
        throw error;
      }
    }

    const favoriteMatch = url.pathname.match(/^\/api\/favorites\/(\d+)$/);
    if (favoriteMatch && (request.method === "POST" || request.method === "DELETE")) {
      try {
        const userId = await getTelegramUserId(request, env);
        await ensureUser(env, userId);
        const itemId = Number(favoriteMatch[1]);
        if (request.method === "POST") {
          await env.DB.prepare("INSERT INTO favorites (telegram_user_id, item_id) VALUES (?, ?) ON CONFLICT DO NOTHING").bind(userId, itemId).run();
          return json({ status: "ok" }, 201);
        }
        await env.DB.prepare("DELETE FROM favorites WHERE telegram_user_id = ? AND item_id = ?").bind(userId, itemId).run();
        return new Response(null, { status: 204 });
      } catch (error) {
        if (error instanceof AuthError) return json({ error: error.message }, 401);
        throw error;
      }
    }

    return notFound();
  }
} satisfies ExportedHandler<Env>;

