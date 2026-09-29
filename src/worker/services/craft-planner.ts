import type { Env } from "../env";

export type ResourceTotal = {
  resource_id: number;
  slug: string;
  name_en: string;
  name_ru: string;
  required: number;
  owned: number;
  remaining: number;
};

type IngredientRow = {
  resource_id: number;
  quantity: number;
  slug: string;
  name_en: string;
  name_ru: string;
};

type IngredientIdentity = Omit<IngredientRow, "quantity">;

export const calculateCraftList = async (env: Env, craftListId: number): Promise<ResourceTotal[]> => {
  const { results: plannedItems } = await env.DB.prepare(
    "SELECT item_id, quantity, target_level FROM craft_list_items WHERE craft_list_id = ?"
  ).bind(craftListId).all<{ item_id: number; quantity: number; target_level: number }>();

  const totals = new Map<number, Omit<ResourceTotal, "owned" | "remaining">>();
  const recipeCache = new Map<number, { output: number; ingredients: IngredientRow[] }>();
  const identityCache = new Map<number, IngredientIdentity>();

  const itemIdentity = async (itemId: number): Promise<IngredientIdentity | null> => {
    const cached = identityCache.get(itemId);
    if (cached) return cached;
    const row = await env.DB.prepare(
      "SELECT id AS resource_id, slug, name_en, name_ru FROM items WHERE id = ?"
    ).bind(itemId).first<IngredientIdentity>();
    if (row) identityCache.set(itemId, row);
    return row ?? null;
  };

  const recipeIngredients = async (itemId: number): Promise<{ output: number; ingredients: IngredientRow[] }> => {
    const cached = recipeCache.get(itemId);
    if (cached) return cached;

    const recipe = await env.DB.prepare(
      "SELECT output_quantity FROM recipes WHERE item_id = ?"
    ).bind(itemId).first<{ output_quantity: number }>();

    if (!recipe) {
      const empty = { output: 1, ingredients: [] as IngredientRow[] };
      recipeCache.set(itemId, empty);
      return empty;
    }

    const { results } = await env.DB.prepare(`
      SELECT ri.resource_id, ri.quantity, r.slug, r.name_en, r.name_ru
      FROM recipes re
      JOIN recipe_ingredients ri ON ri.recipe_id = re.id
      JOIN items r ON r.id = ri.resource_id
      WHERE re.item_id = ?
      ORDER BY r.name_en
    `).bind(itemId).all<IngredientRow>();

    const value = { output: Math.max(1, recipe.output_quantity), ingredients: results };
    recipeCache.set(itemId, value);
    return value;
  };

  const addRaw = (ingredient: IngredientIdentity, quantity: number): void => {
    const existing = totals.get(ingredient.resource_id);
    totals.set(ingredient.resource_id, {
      resource_id: ingredient.resource_id,
      slug: ingredient.slug,
      name_en: ingredient.name_en,
      name_ru: ingredient.name_ru,
      required: (existing?.required ?? 0) + quantity
    });
  };

  const expandIngredient = async (
    ingredient: IngredientIdentity,
    quantity: number,
    path: ReadonlySet<number>
  ): Promise<void> => {
    if (quantity <= 0) return;

    // Guard against malformed recipe cycles: keep the cyclic component visible
    // instead of recursing forever.
    if (path.has(ingredient.resource_id)) {
      addRaw(ingredient, quantity);
      return;
    }

    const nested = await recipeIngredients(ingredient.resource_id);
    if (!nested.ingredients.length) {
      addRaw(ingredient, quantity);
      return;
    }

    const batches = Math.ceil(quantity / nested.output);
    const nextPath = new Set(path);
    nextPath.add(ingredient.resource_id);
    for (const child of nested.ingredients) {
      await expandIngredient(child, batches * child.quantity, nextPath);
    }
  };

  for (const planned of plannedItems) {
    const base = await recipeIngredients(planned.item_id);
    const baseBatches = Math.ceil(planned.quantity / base.output);
    for (const ingredient of base.ingredients) {
      await expandIngredient(ingredient, ingredient.quantity * baseBatches, new Set([planned.item_id]));
    }

    const { results: upgrades } = await env.DB.prepare(`
      SELECT ui.resource_id, ui.quantity, r.slug, r.name_en, r.name_ru
      FROM item_upgrades iu
      JOIN upgrade_ingredients ui ON ui.upgrade_id = iu.id
      JOIN items r ON r.id = ui.resource_id
      WHERE iu.item_id = ? AND iu.level <= ?
      ORDER BY iu.level, r.name_en
    `).bind(planned.item_id, planned.target_level).all<IngredientRow>();

    for (const ingredient of upgrades) {
      await expandIngredient(ingredient, ingredient.quantity * planned.quantity, new Set([planned.item_id]));
    }

    // Items without a recipe intentionally contribute no resource cost. This is
    // preferable to treating the planned item itself as a material.
    if (!base.ingredients.length) await itemIdentity(planned.item_id);
  }

  const progress = await env.DB.prepare(
    "SELECT resource_id, quantity_owned FROM user_resource_progress WHERE craft_list_id = ?"
  ).bind(craftListId).all<{ resource_id: number; quantity_owned: number }>();

  const ownedByResource = new Map(progress.results.map((entry) => [entry.resource_id, entry.quantity_owned]));
  return [...totals.values()]
    .map((total) => {
      const owned = ownedByResource.get(total.resource_id) ?? 0;
      return { ...total, owned, remaining: Math.max(0, total.required - owned) };
    })
    .sort((left, right) => left.name_en.localeCompare(right.name_en));
};
