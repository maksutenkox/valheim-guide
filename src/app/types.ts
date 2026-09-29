export type Locale = "ru" | "en";

export type Biome = {
  slug: string;
  name_en: string;
  name_ru: string;
  description_en: string;
  description_ru: string;
  image_path: string | null;
  accent_color: string | null;
};

export type GuideItem = {
  id: number;
  slug: string;
  entity_type: "item" | "resource";
  name_en: string;
  name_ru: string;
  image_path: string | null;
  biome_slug: string | null;
  category_slug: string | null;
  category_name_en: string | null;
  category_name_ru: string | null;
  source_name: string | null;
  source_url: string | null;
};

export type Category = {
  slug: string;
  name_en: string;
  name_ru: string;
};

export type Ingredient = {
  quantity: number;
  slug: string;
  name_en: string;
  name_ru: string;
  image_path: string | null;
};

export type ItemDetail = GuideItem & {
  description_en: string;
  description_ru: string;
  biome_name_en: string | null;
  biome_name_ru: string | null;
  recipe: { slug: string; name_en: string; name_ru: string; station_level: number; output_quantity: number } | null;
  stats: { stat_key: string; stat_value: string; unit: string | null }[];
  ingredients: Ingredient[];
  upgrades: { level: number; station_level: number | null; ingredients: Ingredient[] }[];
};

export type ResourceDetail = GuideItem & {
  description_en: string;
  description_ru: string;
  sources: { method_en: string; method_ru: string; source_url: string | null }[];
  used_by: GuideItem[];
};

export type CraftList = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type CraftResourceTotal = {
  resource_id: number;
  slug: string;
  name_en: string;
  name_ru: string;
  image_path: string | null;
  required: number;
  owned: number;
  remaining: number;
};


export type CraftListItem = {
  item_id: number;
  quantity: number;
  target_level: number;
  max_level: number;
  slug: string;
  name_en: string;
  name_ru: string;
  image_path: string | null;
};


export type CreatureResistance = {
  type: string;
  level: "weak" | "very-weak" | "resistant" | "very-resistant" | "immune" | "ignore";
};

export type CreatureDrop = {
  name: string;
  chance: string | null;
  amount: string | null;
};

export type CreatureSummary = {
  slug: string;
  name_en: string;
  name_ru: string;
  biome_slug: string;
  health: number;
  kind: "creature" | "boss";
  source_url: string;
};

export type CreatureDetail = CreatureSummary & {
  image_url: string | null;
  resistances: CreatureResistance[];
  drops: CreatureDrop[];
  source_name: string;
};

export type BossSummary = CreatureSummary & {
  summon_en: string;
  summon_ru: string;
  power_en: string;
  power_ru: string;
  recommended_en: string;
  recommended_ru: string;
};
