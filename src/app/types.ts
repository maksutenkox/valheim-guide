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
  category_name_en: string | null;
  category_name_ru: string | null;
};
