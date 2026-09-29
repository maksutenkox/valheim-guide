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

export const calculateCraftList = async (env: Env, craftListId: number): Promise<ResourceTotal[]> => {
  const { results: plannedItems } = await env.DB.prepare(
    "SELECT item_id, quantity, target_level FROM craft_list_items WHERE craft_list_id = ?"
  ).bind(craftListId).all<{ item_id: number; quantity: number; target_level: number }>();

  const totals = new Map<number, Omit<ResourceTotal, "owned" | "remaining">>();
  for (const planned of plannedItems) {
    const base = await env.DB.prepare(`
      SELECT ri.resource_id, ri.quantity, r.slug, r.name_en, r.name_ru
      FROM recipes re JOIN recipe_ingredients ri ON ri.recipe_id = re.id JOIN items r ON r.id = ri.resource_id
      WHERE re.item_id = ?`
    ).bind(planned.item_id).all<{ resource_id: number; quantity: number; slug: string; name_en: string; name_ru: string }>();
    const upgrades = await env.DB.prepare(`
      SELECT ui.resource_id, ui.quantity, r.slug, r.name_en, r.name_ru
      FROM item_upgrades iu JOIN upgrade_ingredients ui ON ui.upgrade_id = iu.id JOIN items r ON r.id = ui.resource_id
      WHERE iu.item_id = ? AND iu.level <= ?`
    ).bind(planned.item_id, planned.target_level).all<{ resource_id: number; quantity: number; slug: string; name_en: string; name_ru: string }>();
    for (const ingredient of [...base.results, ...upgrades.results]) {
      const existing = totals.get(ingredient.resource_id);
      const required = ingredient.quantity * planned.quantity;
      totals.set(ingredient.resource_id, {
        resource_id: ingredient.resource_id,
        slug: ingredient.slug,
        name_en: ingredient.name_en,
        name_ru: ingredient.name_ru,
        required: (existing?.required ?? 0) + required
      });
    }
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
