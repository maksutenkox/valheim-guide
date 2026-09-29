import type { Env } from "./env";
import { json, notFound, parsePositiveInt } from "./api/helpers";
import { AuthError, ensureUser, getTelegramUserId } from "./telegram/auth";
import { calculateCraftList } from "./services/craft-planner";
import { ensureBlackForestCatalog } from "./services/seed-black-forest";
import { handleTelegramUpdate } from "./telegram/bot";

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
  source_name: string | null;
  source_url: string | null;
};

const itemSelect = `
  SELECT i.id, i.slug, i.entity_type, i.name_en, i.name_ru, i.description_en, i.description_ru,
         i.image_path, b.slug AS biome_slug, b.name_en AS biome_name_en, b.name_ru AS biome_name_ru,
         c.slug AS category_slug, c.name_en AS category_name_en, c.name_ru AS category_name_ru,
         i.source_name, i.source_url
  FROM items i
  LEFT JOIN biomes b ON b.id = i.biome_id
  LEFT JOIN categories c ON c.id = i.category_id`;

const readJson = async <T>(request: Request): Promise<T | null> => {
  try { return await request.json<T>(); } catch { return null; }
};

let catalogReady = false;

const ensureCatalog = async (env: Env): Promise<void> => {
  if (catalogReady) return;
  await ensureBlackForestCatalog(env);
  catalogReady = true;
};

const ownsCraftList = async (env: Env, craftListId: number, userId: string): Promise<boolean> => Boolean(await env.DB.prepare(
  "SELECT 1 AS owned FROM craft_lists WHERE id = ? AND telegram_user_id = ?"
).bind(craftListId, userId).first());

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/telegram/webhook") {
      try {
        return await handleTelegramUpdate(request, env);
      } catch {
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    if (request.method === "GET" && url.pathname === "/api/auth-status") {
      const initDataPresent = Boolean(
        request.headers.get("x-telegram-init-data")
        || request.headers.get("authorization")?.startsWith("tma ")
      );
      try {
        const userId = await getTelegramUserId(request, env);
        return json({ authenticated: true, initDataPresent, userId });
      } catch (error) {
        if (error instanceof AuthError) {
          return json({ authenticated: false, initDataPresent, error: error.message }, 401);
        }
        return json({ authenticated: false, initDataPresent, error: "Authentication check failed" }, 500);
      }
    }

    if (request.method === "GET" && url.pathname === "/api/version") {
      return json({ build: "2026-09-29-black-forest-v4-craft-v3" });
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      try {
        const result = await env.DB.prepare("SELECT 1 AS value").first<{ value: number }>();
        if (result?.value !== 1) throw new Error("Unexpected D1 health result");
        return json({ status: "ok", database: "connected" });
      } catch {
        return json({ status: "error", database: "unavailable" }, 503);
      }
    }

    if (url.pathname.startsWith("/api/")) {
      await ensureCatalog(env);
    }

    if (request.method === "GET" && url.pathname === "/api/catalog-status") {
      const [blackForest, blackForestRecipes] = await Promise.all([
        env.DB.prepare(`
          SELECT COUNT(*) AS count
          FROM items i
          JOIN biomes b ON b.id = i.biome_id
          WHERE b.slug = 'black-forest'
        `).first<{ count: number }>(),
        env.DB.prepare(`
          SELECT COUNT(*) AS count
          FROM recipes re
          JOIN items i ON i.id = re.item_id
          JOIN biomes b ON b.id = i.biome_id
          WHERE b.slug = 'black-forest'
        `).first<{ count: number }>()
      ]);
      return json({
        catalog: "black-forest-v4",
        items: blackForest?.count ?? 0,
        recipes: blackForestRecipes?.count ?? 0
      });
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
      const limit = parsePositiveInt(url.searchParams.get("limit"), 100, 100);
      const filters: string[] = [];
      const bindings: (string | number)[] = [];
      if (url.searchParams.has("biome")) { filters.push("b.slug = ?"); bindings.push(url.searchParams.get("biome")!); }
      if (url.searchParams.has("category")) { filters.push("c.slug = ?"); bindings.push(url.searchParams.get("category")!); }
      const where = filters.length ? ` WHERE ${filters.join(" AND ")}` : "";
      const query = `${itemSelect}${where} ORDER BY c.sort_order, i.name_en LIMIT ? OFFSET ?`;
      const { results } = await env.DB.prepare(query).bind(...bindings, limit, (page - 1) * limit).all<ItemRow>();
      return json({ data: results, page, limit });
    }

    const itemMatch = url.pathname.match(/^\/api\/items\/([a-z0-9-]+)$/);
    if (request.method === "GET" && itemMatch) {
      const item = await env.DB.prepare(`${itemSelect} WHERE i.slug = ? AND i.entity_type = 'item'`).bind(itemMatch[1]).first<ItemRow>();
      if (!item) return notFound();
      const [stats, ingredients, upgrades, recipe] = await Promise.all([
        env.DB.prepare("SELECT stat_key, stat_value, unit FROM item_stats WHERE item_id = ? ORDER BY sort_order").bind(item.id).all(),
        env.DB.prepare(`SELECT ri.quantity, r.slug, r.name_en, r.name_ru FROM recipes re JOIN recipe_ingredients ri ON ri.recipe_id = re.id JOIN items r ON r.id = ri.resource_id WHERE re.item_id = ? ORDER BY r.name_en`).bind(item.id).all(),
        env.DB.prepare("SELECT id, level, station_level FROM item_upgrades WHERE item_id = ? ORDER BY level").bind(item.id).all<{ id: number; level: number; station_level: number | null }>(),
        env.DB.prepare("SELECT s.slug, s.name_en, s.name_ru, re.station_level FROM recipes re LEFT JOIN crafting_stations s ON s.id = re.crafting_station_id WHERE re.item_id = ?").bind(item.id).first()
      ]);
      const upgradeDetails = await Promise.all(upgrades.results.map(async (upgrade) => ({
        ...upgrade,
        ingredients: (await env.DB.prepare("SELECT ui.quantity, r.slug, r.name_en, r.name_ru FROM upgrade_ingredients ui JOIN items r ON r.id = ui.resource_id WHERE ui.upgrade_id = ? ORDER BY r.name_en").bind(upgrade.id).all()).results
      })));
      return json({ data: { ...item, recipe, stats: stats.results, ingredients: ingredients.results, upgrades: upgradeDetails } });
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

    if (url.pathname === "/api/craft-lists" && (request.method === "GET" || request.method === "POST")) {
      try {
        const userId = await getTelegramUserId(request, env);
        await ensureUser(env, userId);
        if (request.method === "GET") {
          const { results } = await env.DB.prepare(
            "SELECT id, name, created_at, updated_at FROM craft_lists WHERE telegram_user_id = ? ORDER BY updated_at DESC"
          ).bind(userId).all();
          return json({ data: results });
        }
        const body = await readJson<{ name?: string }>(request);
        const name = body?.name?.trim().slice(0, 80) || "Craft list";
        const created = await env.DB.prepare("INSERT INTO craft_lists (telegram_user_id, name) VALUES (?, ?) RETURNING id, name, created_at, updated_at")
          .bind(userId, name).first();
        return json({ data: created }, 201);
      } catch (error) {
        if (error instanceof AuthError) return json({ error: error.message }, 401);
        throw error;
      }
    }

    const craftListMatch = url.pathname.match(/^\/api\/craft-lists\/(\d+)$/);
    if (craftListMatch && ["PATCH", "DELETE"].includes(request.method)) {
      try {
        const userId = await getTelegramUserId(request, env);
        const listId = Number(craftListMatch[1]);
        if (!await ownsCraftList(env, listId, userId)) return notFound();
        if (request.method === "DELETE") {
          await env.DB.prepare("DELETE FROM craft_lists WHERE id = ? AND telegram_user_id = ?").bind(listId, userId).run();
          return new Response(null, { status: 204 });
        }
        const body = await readJson<{ name?: string }>(request);
        const name = body?.name?.trim().slice(0, 80);
        if (!name) return json({ error: "A list name is required" }, 400);
        const updated = await env.DB.prepare("UPDATE craft_lists SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND telegram_user_id = ? RETURNING id, name, updated_at")
          .bind(name, listId, userId).first();
        return json({ data: updated });
      } catch (error) {
        if (error instanceof AuthError) return json({ error: error.message }, 401);
        throw error;
      }
    }

    const craftItemsReadMatch = url.pathname.match(/^\/api\/craft-lists\/(\d+)\/items$/);
    if (craftItemsReadMatch && request.method === "GET") {
      try {
        const userId = await getTelegramUserId(request, env);
        const listId = Number(craftItemsReadMatch[1]);
        if (!await ownsCraftList(env, listId, userId)) return notFound();
        const { results } = await env.DB.prepare(`
          SELECT cli.item_id, cli.quantity, cli.target_level,
                 i.slug, i.name_en, i.name_ru, i.image_path
          FROM craft_list_items cli
          JOIN items i ON i.id = cli.item_id
          WHERE cli.craft_list_id = ?
          ORDER BY i.name_en
        `).bind(listId).all();
        return json({ data: results });
      } catch (error) {
        if (error instanceof AuthError) return json({ error: error.message }, 401);
        throw error;
      }
    }

    const craftItemMatch = url.pathname.match(/^\/api\/craft-lists\/(\d+)\/items(?:\/(\d+))?$/);
    if (craftItemMatch && ["POST", "PATCH", "DELETE"].includes(request.method)) {
      try {
        const userId = await getTelegramUserId(request, env);
        const listId = Number(craftItemMatch[1]);
        if (!await ownsCraftList(env, listId, userId)) return notFound();
        const itemId = craftItemMatch[2] ? Number(craftItemMatch[2]) : undefined;
        if (request.method === "DELETE") {
          if (!itemId) return notFound();
          await env.DB.prepare("DELETE FROM craft_list_items WHERE craft_list_id = ? AND item_id = ?").bind(listId, itemId).run();
          return new Response(null, { status: 204 });
        }
        const body = await readJson<{ itemId?: number; quantity?: number; targetLevel?: number }>(request);
        const targetItemId = itemId ?? body?.itemId;
        const quantity = body?.quantity;
        const targetLevel = body?.targetLevel;
        if (!Number.isSafeInteger(targetItemId) || !Number.isInteger(quantity) || quantity! < 1 || !Number.isInteger(targetLevel) || targetLevel! < 1) {
          return json({ error: "itemId, quantity and targetLevel must be positive integers" }, 400);
        }
        if (request.method === "POST") {
          await env.DB.prepare(`INSERT INTO craft_list_items (craft_list_id, item_id, quantity, target_level)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(craft_list_id, item_id) DO UPDATE SET
              quantity = craft_list_items.quantity + excluded.quantity,
              target_level = MAX(craft_list_items.target_level, excluded.target_level)`)
            .bind(listId, targetItemId, quantity, targetLevel).run();
        } else {
          await env.DB.prepare(`INSERT INTO craft_list_items (craft_list_id, item_id, quantity, target_level)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(craft_list_id, item_id) DO UPDATE SET
              quantity = excluded.quantity,
              target_level = excluded.target_level`)
            .bind(listId, targetItemId, quantity, targetLevel).run();
        }
        await env.DB.prepare("UPDATE craft_lists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(listId).run();
        return json({ status: "ok" }, request.method === "POST" ? 201 : 200);
      } catch (error) {
        if (error instanceof AuthError) return json({ error: error.message }, 401);
        throw error;
      }
    }

    const progressMatch = url.pathname.match(/^\/api\/craft-lists\/(\d+)\/resources\/(\d+)$/);
    if (progressMatch && request.method === "PATCH") {
      try {
        const userId = await getTelegramUserId(request, env);
        const listId = Number(progressMatch[1]);
        if (!await ownsCraftList(env, listId, userId)) return notFound();
        const body = await readJson<{ quantityOwned?: number }>(request);
        const quantityOwned = body?.quantityOwned;
        if (!Number.isInteger(quantityOwned) || quantityOwned! < 0) return json({ error: "quantityOwned must be a non-negative integer" }, 400);
        await env.DB.prepare(`INSERT INTO user_resource_progress (craft_list_id, resource_id, quantity_owned) VALUES (?, ?, ?)
          ON CONFLICT(craft_list_id, resource_id) DO UPDATE SET quantity_owned = excluded.quantity_owned`)
          .bind(listId, Number(progressMatch[2]), quantityOwned).run();
        return json({ status: "ok" });
      } catch (error) {
        if (error instanceof AuthError) return json({ error: error.message }, 401);
        throw error;
      }
    }

    const summaryMatch = url.pathname.match(/^\/api\/craft-lists\/(\d+)\/summary$/);
    if (summaryMatch && request.method === "GET") {
      try {
        const userId = await getTelegramUserId(request, env);
        const listId = Number(summaryMatch[1]);
        if (!await ownsCraftList(env, listId, userId)) return notFound();
        return json({ data: await calculateCraftList(env, listId) });
      } catch (error) {
        if (error instanceof AuthError) return json({ error: error.message }, 401);
        throw error;
      }
    }

    return notFound();
  }
} satisfies ExportedHandler<Env>;

