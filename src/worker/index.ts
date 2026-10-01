import type { Env } from "./env";
import { APP_BUILD } from "../shared/build";
import { json, notFound, parsePositiveInt } from "./api/helpers";
import { AuthError, ensureUser, getTelegramUserId } from "./telegram/auth";
import { calculateCraftList } from "./services/craft-planner";
import { ensureMeadowsCatalog } from "./services/seed-meadows";
import { ensureBlackForestCatalog } from "./services/seed-black-forest";
import { ensureCatalogSchema } from "./services/catalog-seed";
import { ensureSwampCatalog } from "./services/seed-swamp";
import { ensureMountainCatalog } from "./services/seed-mountains";
import { ensurePlainsCatalog } from "./services/seed-plains";
import { ensureMistlandsCatalog } from "./services/seed-mistlands";
import { ensureAshlandsCatalog } from "./services/seed-ashlands";
import { ensureDeepNorthCatalog } from "./services/seed-deep-north";
import { ensureOceanCatalog } from "./services/seed-ocean";
import { ensureTrophyCatalog } from "./services/seed-trophies";
import { ensureSpecialDropCatalog } from "./services/seed-special-drops";
import { handleTelegramUpdate } from "./telegram/bot";
import { bossForBiome, bosses, creaturesDroppingItem, creaturesForBiome, loadCreatureDetail } from "./services/creatures";

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
  await ensureCatalogSchema(env);
  await ensureMeadowsCatalog(env);
  await ensureBlackForestCatalog(env);
  await ensureSwampCatalog(env);
  await ensureMountainCatalog(env);
  await ensurePlainsCatalog(env);
  await ensureMistlandsCatalog(env);
  await ensureAshlandsCatalog(env);
  await ensureDeepNorthCatalog(env);
  await ensureOceanCatalog(env);
  await ensureTrophyCatalog(env);
  await ensureSpecialDropCatalog(env);
  catalogReady = true;
};

const ownsCraftList = async (env: Env, craftListId: number, userId: string): Promise<boolean> => Boolean(await env.DB.prepare(
  "SELECT 1 AS owned FROM craft_lists WHERE id = ? AND telegram_user_id = ?"
).bind(craftListId, userId).first());

const creatureIconSlug = (slug: string): string => ({
  "dvergr-rogue": "dvergr-trophy",
  "dvergr-mage": "dvergr-trophy",
  "charred-warrior": "warrior-trophy",
  "charred-marksman": "marksman-trophy",
  "charred-warlock": "warlock-trophy",
  "shapeless-pulp": "pulp-trophy",
  "deer-white": "trophy-deer-white",
  "moose-calf": "moose-trophy",
  "baby-seal": "seal-trophy",
  "boar-spiritcaller": "boar-trophy",
  "wolf-spiritcaller": "wolf-trophy",
  "moose-spiritcaller": "moose-trophy",
  "aspect-of-the-lightning-stag": "eikthyr-trophy",
  "aspect-of-the-crawling-matriarch": "the-queen-trophy",
  "aspect-of-the-emerald-flame": "fader-trophy",
  "aspect-of-the-twisted-soul": "yagluth-trophy",
  "aspect-of-the-living-forest": "the-elder-trophy",
  "aspect-of-the-writhing-dead": "bonemass-trophy",
  "aspect-of-the-dragon-mother": "moder-trophy",
  "zil-and-thungr": "thungr-trophy",
  "greyling": "greydwarf-trophy",
  "oozer": "blob-trophy",
  "bat": "leather-scraps",
  "seeker-brood": "seeker-trophy",
  "charred-twitcher": "charred-bone",
  "asksvin-hatchling": "asksvin-trophy",
  "lord-reto": "dyrnwyn-hilt-fragment",
  "bjorn-spiritcaller": "bear-trophy",
  "frost-wisp": "wisp",
  "frysling": "frostcore",
  "tendril": "writhan-roots",
  "the-void": "ectoplasm-2",
  "tiny-pulp": "pulp-trophy",
  "fallen-warrior": "frostfire-essence",
  "gammeltroll": "troll-trophy",
  "imprisoned-dvergr": "dvergr-trophy",
  "shadow": "ectoplasm",
  "captive-fuling": "fuling-trophy",
  "leviathan": "chitin",
  "kall-fimbulbringer": "crown-jewel"
}[slug] ?? `${slug}-trophy`);

const creatureArtwork = async (env: Env, slug: string): Promise<string | null> => {
  const row = await env.DB.prepare("SELECT image_path FROM items WHERE slug = ? LIMIT 1")
    .bind(creatureIconSlug(slug)).first<{ image_path: string | null }>();
  return row?.image_path ?? null;
};

type TamingFoodSeed = { slug: string; name_en: string; name_ru: string };
type TamingGuideSeed = {
  slug: string;
  name_en: string;
  name_ru: string;
  biome_en: string;
  biome_ru: string;
  taming_minutes: number;
  fed_minutes: number;
  rideable: boolean;
  commandable: boolean;
  saddle_en: string | null;
  saddle_ru: string | null;
  offspring_en: string;
  offspring_ru: string;
  partner_range: number;
  population_limit: number;
  population_range: number;
  gestation_minutes: number;
  food: TamingFoodSeed[];
  tip_en: string;
  tip_ru: string;
  source_url: string;
};

const tamingGuides: TamingGuideSeed[] = [
  {
    slug:"boar", name_en:"Boar", name_ru:"Кабан", biome_en:"Meadows", biome_ru:"Луга",
    taming_minutes:30, fed_minutes:10, rideable:false, commandable:false, saddle_en:null, saddle_ru:null,
    offspring_en:"Piggy", offspring_ru:"Поросёнок", partner_range:3, population_limit:5, population_range:10, gestation_minutes:1,
    food:[
      {slug:"blueberries",name_en:"Blueberries",name_ru:"Черника"},
      {slug:"carrot",name_en:"Carrot",name_ru:"Морковь"},
      {slug:"mushroom",name_en:"Mushroom",name_ru:"Гриб"},
      {slug:"onion",name_en:"Onion",name_ru:"Лук"},
      {slug:"raspberries",name_en:"Raspberries",name_ru:"Малина"},
      {slug:"turnip",name_en:"Turnip",name_ru:"Репа"}
    ],
    tip_en:"Build a simple pen, drop food inside and move away until the boar is calm. Taming only progresses while the area is loaded.",
    tip_ru:"Сделайте простой загон, бросьте еду внутрь и отойдите, пока кабан не успокоится. Приручение идёт только пока зона загружена.",
    source_url:"https://valheim.gaming.tools/creatures/boar"
  },
  {
    slug:"wolf", name_en:"Wolf", name_ru:"Волк", biome_en:"Mountains", biome_ru:"Горы",
    taming_minutes:30, fed_minutes:10, rideable:false, commandable:true, saddle_en:null, saddle_ru:null,
    offspring_en:"Wolf Cub", offspring_ru:"Волчонок", partner_range:3, population_limit:4, population_range:10, gestation_minutes:1,
    food:[
      {slug:"boar-meat",name_en:"Boar Meat",name_ru:"Мясо кабана"},
      {slug:"chicken-meat",name_en:"Chicken Meat",name_ru:"Курятина"},
      {slug:"deer-meat",name_en:"Deer Meat",name_ru:"Мясо оленя"},
      {slug:"lox-meat",name_en:"Lox Meat",name_ru:"Мясо локса"},
      {slug:"neck-tail",name_en:"Neck Tail",name_ru:"Хвост никса"},
      {slug:"raw-fish",name_en:"Raw Fish",name_ru:"Сырая рыба"},
      {slug:"sausages",name_en:"Sausages",name_ru:"Колбаски"}
    ],
    tip_en:"A pit or strong pen is safer than fences alone. Once tamed, wolves can follow you or stay in place and make strong combat companions.",
    tip_ru:"Яма или прочный загон надёжнее обычного забора. После приручения волку можно приказать следовать за вами или оставаться на месте.",
    source_url:"https://valheim.gaming.tools/creatures/wolf"
  },
  {
    slug:"lox", name_en:"Lox", name_ru:"Локс", biome_en:"Plains", biome_ru:"Равнины",
    taming_minutes:30, fed_minutes:10, rideable:true, commandable:false, saddle_en:"Lox Saddle", saddle_ru:"Седло для локса",
    offspring_en:"Lox Calf", offspring_ru:"Детёныш локса", partner_range:8, population_limit:4, population_range:20, gestation_minutes:2,
    food:[
      {slug:"barley",name_en:"Barley",name_ru:"Ячмень"},
      {slug:"cloudberries",name_en:"Cloudberries",name_ru:"Морошка"},
      {slug:"flax",name_en:"Flax",name_ru:"Лён"}
    ],
    tip_en:"Lox hit hard and can destroy weak pens. Use terrain or sturdy walls, then keep them calm and fed. A saddle turns a tamed Lox into a mount.",
    tip_ru:"Локсы сильно бьют и ломают слабые загоны. Используйте рельеф или прочные стены, держите их спокойными и сытыми. Седло превращает приручённого локса в маунта.",
    source_url:"https://valheim.gaming.tools/creatures/lox"
  },
  {
    slug:"asksvin", name_en:"Asksvin", name_ru:"Асксвин", biome_en:"Ashlands", biome_ru:"Пепельные земли",
    taming_minutes:30, fed_minutes:10, rideable:true, commandable:false, saddle_en:"Asksvin Saddle", saddle_ru:"Седло для асксвина",
    offspring_en:"Asksvin Egg", offspring_ru:"Яйцо асксвина", partner_range:4, population_limit:10, population_range:10, gestation_minutes:1,
    food:[
      {slug:"fiddlehead",name_en:"Fiddlehead",name_ru:"Молодой папоротник"},
      {slug:"smoke-puff",name_en:"Smoke Puff",name_ru:"Дымный гриб"},
      {slug:"vineberry-cluster",name_en:"Vineberry Cluster",name_ru:"Гроздь лозовых ягод"}
    ],
    tip_en:"A tamed Asksvin can be saddled and ridden across lava safely. Breeding produces eggs that must be kept warm to hatch.",
    tip_ru:"Приручённого асксвина можно оседлать и безопасно ездить на нём по лаве. При разведении появляются яйца, которым для вылупления нужно тепло.",
    source_url:"https://valheim.gaming.tools/creatures/asksvin"
  },
  {
    slug:"moose", name_en:"Moose", name_ru:"Лось", biome_en:"Deep North", biome_ru:"Глубокий Север",
    taming_minutes:30, fed_minutes:10, rideable:true, commandable:false, saddle_en:"Moose Saddle", saddle_ru:"Седло для лося",
    offspring_en:"Moose Calf", offspring_ru:"Лосёнок", partner_range:3, population_limit:5, population_range:10, gestation_minutes:1,
    food:[{slug:"lingonberries",name_en:"Lingonberries",name_ru:"Брусника"}],
    tip_en:"Moose accept Lingonberries and make excellent Deep North mounts. Keep the animal out of combat while taming and use a sturdy enclosure.",
    tip_ru:"Лоси едят бруснику и отлично подходят для передвижения по Глубокому Северу. Во время приручения не допускайте боя и используйте прочный загон.",
    source_url:"https://valheim.gaming.tools/creatures/moose"
  }
];

const hydrateTamingFood = async (env: Env, food: TamingFoodSeed) => {
  const row = await env.DB.prepare("SELECT name_en, name_ru, image_path FROM items WHERE slug = ? LIMIT 1")
    .bind(food.slug).first<{ name_en: string; name_ru: string; image_path: string | null }>();
  return {
    slug: food.slug,
    name_en: row?.name_en ?? food.name_en,
    name_ru: row?.name_ru ?? food.name_ru,
    image_path: row?.image_path ?? null
  };
};

const specialResourceUseNotes: Record<string, Array<{ en: string; ru: string }>> = {
  "swamp-key": [
    {
      en: "Keep it in your inventory to unlock the sealed gate of each Sunken Crypt. The key is not consumed.",
      ru: "Держите ключ в инвентаре, чтобы открыть запечатанный вход каждого Затонувшего склепа. Ключ не расходуется."
    }
  ],
  "wishbone": [
    {
      en: "Equip it in the utility slot to detect buried silver veins, muddy scrap piles and hidden treasure.",
      ru: "Наденьте в слот полезного предмета, чтобы находить скрытые серебряные жилы, грязные груды металлолома и зарытые сокровища."
    }
  ],
  "sacrificial-blood": [
    {
      en: "After defeating Kall Fimbulbringer, offer it at the Chiselled Platform on the Sacrificial Stones to trigger the ending.",
      ru: "После победы над Каллом Фимбулбрингером поднесите её на Высеченной платформе у Жертвенных камней, чтобы запустить концовку."
    }
  ],
  "bukeperries": [
    {
      en: "Eating one applies Feeling sick and clears your active food buffs over several seconds so you can replace your meal early.",
      ru: "После употребления накладывают эффект тошноты и за несколько секунд очищают активные эффекты еды, позволяя заменить рацион раньше."
    }
  ],
  "rotten-meat": [
    {
      en: "Eating it causes the same food-clearing sickness as Bukeperries.",
      ru: "При употреблении вызывает тот же эффект очистки еды, что и тошноягоды."
    }
  ],
  "ancient-coin": [
    { en: "A Deep North valuable worth 10 coins.", ru: "Ценность Глубокого Севера стоимостью 10 монет." }
  ],
  "grimvarn": [
    { en: "A Deep North valuable worth 55 coins.", ru: "Ценность Глубокого Севера стоимостью 55 монет." }
  ],
  "solryth": [
    { en: "A Deep North valuable worth 95 coins.", ru: "Ценность Глубокого Севера стоимостью 95 монет." }
  ],
  "veydris": [
    { en: "A Deep North valuable worth 135 coins.", ru: "Ценность Глубокого Севера стоимостью 135 монет." }
  ],
  "draumyx": [
    { en: "A Deep North valuable worth 175 coins.", ru: "Ценность Глубокого Севера стоимостью 175 монет." }
  ]
};

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
      return json({ build: APP_BUILD });
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
      const { results } = await env.DB.prepare(`
        SELECT b.slug,
               COUNT(DISTINCT i.id) AS items,
               COUNT(DISTINCT re.id) AS recipes
        FROM biomes b
        LEFT JOIN items i ON i.biome_id = b.id
        LEFT JOIN recipes re ON re.item_id = i.id
        GROUP BY b.id, b.slug
        ORDER BY b.id
      `).all<{ slug: string; items: number; recipes: number }>();
      return json({
        catalog: "world-v6",
        biomes: Object.fromEntries(results.map((row) => [
          row.slug,
          { items: row.items, recipes: row.recipes }
        ]))
      });
    }

    if (request.method === "GET" && url.pathname === "/api/trophies") {
      const { results } = await env.DB.prepare(`
        SELECT i.id, i.slug, i.entity_type, i.name_en, i.name_ru, i.description_en, i.description_ru,
               i.image_path, b.slug AS biome_slug, b.name_en AS biome_name_en, b.name_ru AS biome_name_ru,
               c.slug AS category_slug, c.name_en AS category_name_en, c.name_ru AS category_name_ru,
               i.source_name, i.source_url
        FROM items i
        JOIN categories c ON c.id = i.category_id
        LEFT JOIN biomes b ON b.id = i.biome_id
        WHERE c.slug = 'trophy'
        ORDER BY b.id, i.name_en
      `).all<ItemRow>();
      return json({ data: results });
    }

    if (request.method === "GET" && url.pathname === "/api/foods") {
      const { results } = await env.DB.prepare(`
        SELECT i.id, i.slug, i.name_en, i.name_ru, i.description_en, i.description_ru, i.image_path,
               b.slug AS biome_slug, b.name_en AS biome_name_en, b.name_ru AS biome_name_ru,
               COALESCE(MAX(CASE WHEN s.stat_key = 'health' THEN CAST(s.stat_value AS REAL) END), 0) AS health,
               COALESCE(MAX(CASE WHEN s.stat_key = 'stamina' THEN CAST(s.stat_value AS REAL) END), 0) AS stamina,
               COALESCE(MAX(CASE WHEN s.stat_key = 'eitr' THEN CAST(s.stat_value AS REAL) END), 0) AS eitr,
               MAX(CASE WHEN s.stat_key = 'duration' THEN CAST(s.stat_value AS REAL) END) AS duration,
               MAX(CASE WHEN s.stat_key = 'healing' THEN CAST(s.stat_value AS REAL) END) AS healing
        FROM items i
        JOIN categories c ON c.id = i.category_id
        JOIN item_stats s ON s.item_id = i.id
        LEFT JOIN biomes b ON b.id = i.biome_id
        WHERE c.slug = 'food' AND i.entity_type = 'item'
        GROUP BY i.id, i.slug, i.name_en, i.name_ru, i.description_en, i.description_ru, i.image_path,
                 b.id, b.slug, b.name_en, b.name_ru
        HAVING MAX(CASE WHEN s.stat_key IN ('health','stamina','eitr') THEN 1 ELSE 0 END) = 1
        ORDER BY b.id, i.name_en
      `).all();
      return json({ data: results });
    }

    if (request.method === "GET" && url.pathname === "/api/taming") {
      const data = await Promise.all(tamingGuides.map(async (guide) => ({
        ...guide,
        image_path: await creatureArtwork(env, guide.slug),
        food: await Promise.all(guide.food.map((food) => hydrateTamingFood(env, food)))
      })));
      return json({ data });
    }

    if (request.method === "GET" && url.pathname === "/api/creatures") {
      const biome = url.searchParams.get("biome")?.trim() ?? "";
      const entries = biome ? creaturesForBiome(biome) : [];
      return json({ data: await Promise.all(entries.map(async (entry) => ({
        ...entry,
        image_path: await creatureArtwork(env, entry.slug)
      }))) });
    }

    const creatureMatch = url.pathname.match(/^\/api\/creatures\/([a-z0-9-]+)$/);
    if (request.method === "GET" && creatureMatch) {
      const detail = await loadCreatureDetail(creatureMatch[1]);
      if (!detail) return notFound();
      const drops = await Promise.all(detail.drops.map(async (drop) => {
        const fallbackSlug = drop.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const linked = await env.DB.prepare(
          `SELECT slug, entity_type, name_en, name_ru, image_path
           FROM items
           WHERE LOWER(name_en) = LOWER(?) OR slug = ?
           ORDER BY CASE WHEN LOWER(name_en) = LOWER(?) THEN 0 ELSE 1 END
           LIMIT 1`
        ).bind(drop.name, fallbackSlug, drop.name).first<{ slug: string; entity_type: "item" | "resource"; name_en: string; name_ru: string; image_path: string | null }>();
        return linked ? { ...drop, ...linked, image_path: linked.image_path ?? `/media/wiki/${linked.slug}.png` } : drop;
      }));
      return json({ data: { ...detail, image_url: detail.image_url ?? await creatureArtwork(env, detail.slug), drops } });
    }

    if (request.method === "GET" && url.pathname === "/api/bosses") {
      const biome = url.searchParams.get("biome")?.trim();
      if (biome) {
        const boss = bossForBiome(biome);
        return json({ data: boss ? { ...boss, image_path: await creatureArtwork(env, boss.slug) } : null });
      }
      return json({ data: await Promise.all(bosses.map(async (boss) => ({ ...boss, image_path: await creatureArtwork(env, boss.slug) }))) });
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
      const [stats, ingredients, upgrades, recipe, sources] = await Promise.all([
        env.DB.prepare("SELECT stat_key, stat_value, unit FROM item_stats WHERE item_id = ? ORDER BY sort_order").bind(item.id).all(),
        env.DB.prepare(`SELECT ri.quantity, r.slug, r.name_en, r.name_ru, r.image_path FROM recipes re JOIN recipe_ingredients ri ON ri.recipe_id = re.id JOIN items r ON r.id = ri.resource_id WHERE re.item_id = ? ORDER BY r.name_en`).bind(item.id).all(),
        env.DB.prepare("SELECT id, level, station_level FROM item_upgrades WHERE item_id = ? ORDER BY level").bind(item.id).all<{ id: number; level: number; station_level: number | null }>(),
        env.DB.prepare("SELECT s.slug, s.name_en, s.name_ru, re.station_level, re.output_quantity FROM recipes re LEFT JOIN crafting_stations s ON s.id = re.crafting_station_id WHERE re.item_id = ?").bind(item.id).first<{ slug: string | null; name_en: string | null; name_ru: string | null; station_level: number; output_quantity: number }>(),
        env.DB.prepare("SELECT method_en, method_ru, source_url FROM resource_sources WHERE resource_id = ? ORDER BY sort_order").bind(item.id).all<{ method_en: string; method_ru: string; source_url: string | null }>()
      ]);
      const upgradeDetails = await Promise.all(upgrades.results.map(async (upgrade) => ({
        ...upgrade,
        ingredients: (await env.DB.prepare("SELECT ui.quantity, r.slug, r.name_en, r.name_ru, r.image_path FROM upgrade_ingredients ui JOIN items r ON r.id = ui.resource_id WHERE ui.upgrade_id = ? ORDER BY r.name_en").bind(upgrade.id).all()).results
      })));
      const acquisitionSources = [...sources.results];
      if (!acquisitionSources.length && recipe) {
        const stationEn = recipe.name_en ?? "crafting station";
        const stationRu = recipe.name_ru ?? "ремесленная станция";
        acquisitionSources.push({
          method_en: `Craft at ${stationEn} (level ${recipe.station_level}). The required materials are listed in the recipe below.`,
          method_ru: `Создаётся на станции «${stationRu}» (уровень ${recipe.station_level}). Все необходимые материалы указаны в рецепте ниже.`,
          source_url: item.source_url
        });
      }
      return json({ data: { ...item, recipe, stats: stats.results, ingredients: ingredients.results, upgrades: upgradeDetails, sources: acquisitionSources } });
    }

    if (request.method === "GET" && url.pathname === "/api/resources") {
      const { results } = await env.DB.prepare(`${itemSelect} WHERE i.entity_type = 'resource' ORDER BY i.name_en`).all<ItemRow>();
      return json({ data: results });
    }

    const resourceMatch = url.pathname.match(/^\/api\/resources\/([a-z0-9-]+)$/);
    if (request.method === "GET" && resourceMatch) {
      const resource = await env.DB.prepare(`${itemSelect} WHERE i.slug = ? AND i.entity_type = 'resource'`).bind(resourceMatch[1]).first<ItemRow>();
      if (!resource) return notFound();
      const [sources, recipeUsedBy, upgradeUsedBy] = await Promise.all([
        env.DB.prepare("SELECT method_en, method_ru, source_url FROM resource_sources WHERE resource_id = ? ORDER BY sort_order").bind(resource.id).all(),
        env.DB.prepare(`${itemSelect} JOIN recipes re ON re.item_id = i.id JOIN recipe_ingredients ri ON ri.recipe_id = re.id WHERE ri.resource_id = ? AND i.entity_type = 'item' ORDER BY i.name_en`).bind(resource.id).all<ItemRow>(),
        env.DB.prepare(`${itemSelect} JOIN item_upgrades iu ON iu.item_id = i.id JOIN upgrade_ingredients ui ON ui.upgrade_id = iu.id WHERE ui.resource_id = ? AND i.entity_type = 'item' ORDER BY i.name_en`).bind(resource.id).all<ItemRow>()
      ]);
      const usedBy = [...recipeUsedBy.results, ...upgradeUsedBy.results];
      const uniqueUsedBy = [...new Map(usedBy.map((entry) => [entry.id, entry])).values()];
      const droppedBy = await Promise.all(creaturesDroppingItem(resource.name_en).map(async (entry) => ({
        ...entry,
        image_path: await creatureArtwork(env, entry.slug)
      })));
      return json({ data: {
        ...resource,
        sources: sources.results,
        used_by: uniqueUsedBy,
        dropped_by: droppedBy,
        use_notes: specialResourceUseNotes[resource.slug] ?? []
      } });
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
                 COALESCE((SELECT MAX(iu.level) FROM item_upgrades iu WHERE iu.item_id = i.id), 1) AS max_level,
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
        const maxLevelRow = await env.DB.prepare("SELECT COALESCE(MAX(level), 1) AS max_level FROM item_upgrades WHERE item_id = ?")
          .bind(targetItemId).first<{ max_level: number }>();
        const maxLevel = Math.max(1, Number(maxLevelRow?.max_level ?? 1));
        if (targetLevel! > maxLevel) {
          return json({ error: `targetLevel cannot exceed ${maxLevel}` }, 400);
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

