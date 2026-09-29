PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS biomes (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_ru TEXT NOT NULL DEFAULT '',
  image_path TEXT,
  accent_color TEXT,
  source_name TEXT,
  source_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS crafting_stations (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('item', 'resource')),
  name_en TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_ru TEXT NOT NULL DEFAULT '',
  biome_id INTEGER REFERENCES biomes(id),
  category_id INTEGER REFERENCES categories(id),
  image_path TEXT,
  image_source_url TEXT,
  image_license_note TEXT,
  source_name TEXT,
  source_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS items_by_biome ON items(biome_id, category_id);
CREATE INDEX IF NOT EXISTS items_by_type ON items(entity_type);
CREATE INDEX IF NOT EXISTS items_name_en ON items(name_en);
CREATE INDEX IF NOT EXISTS items_name_ru ON items(name_ru);

CREATE TABLE IF NOT EXISTS item_stats (
  id INTEGER PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  stat_key TEXT NOT NULL,
  stat_value TEXT NOT NULL,
  unit TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(item_id, stat_key)
);

CREATE TABLE IF NOT EXISTS resource_sources (
  id INTEGER PRIMARY KEY,
  resource_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  method_en TEXT NOT NULL,
  method_ru TEXT NOT NULL,
  biome_id INTEGER REFERENCES biomes(id),
  source_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY,
  item_id INTEGER NOT NULL UNIQUE REFERENCES items(id) ON DELETE CASCADE,
  crafting_station_id INTEGER REFERENCES crafting_stations(id),
  station_level INTEGER NOT NULL DEFAULT 1 CHECK (station_level > 0)
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  resource_id INTEGER NOT NULL REFERENCES items(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY(recipe_id, resource_id)
);

CREATE TABLE IF NOT EXISTS item_upgrades (
  id INTEGER PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level > 1),
  station_level INTEGER,
  UNIQUE(item_id, level)
);

CREATE TABLE IF NOT EXISTS upgrade_ingredients (
  upgrade_id INTEGER NOT NULL REFERENCES item_upgrades(id) ON DELETE CASCADE,
  resource_id INTEGER NOT NULL REFERENCES items(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY(upgrade_id, resource_id)
);

CREATE TABLE IF NOT EXISTS users (
  telegram_user_id TEXT PRIMARY KEY,
  language TEXT NOT NULL DEFAULT 'ru' CHECK (language IN ('ru', 'en')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorites (
  telegram_user_id TEXT NOT NULL REFERENCES users(telegram_user_id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(telegram_user_id, item_id)
);

CREATE TABLE IF NOT EXISTS craft_lists (
  id INTEGER PRIMARY KEY,
  telegram_user_id TEXT NOT NULL REFERENCES users(telegram_user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS craft_list_items (
  craft_list_id INTEGER NOT NULL REFERENCES craft_lists(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  target_level INTEGER NOT NULL DEFAULT 1 CHECK (target_level > 0),
  PRIMARY KEY(craft_list_id, item_id)
);

CREATE TABLE IF NOT EXISTS user_resource_progress (
  craft_list_id INTEGER NOT NULL REFERENCES craft_lists(id) ON DELETE CASCADE,
  resource_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quantity_owned INTEGER NOT NULL DEFAULT 0 CHECK (quantity_owned >= 0),
  PRIMARY KEY(craft_list_id, resource_id)
);
