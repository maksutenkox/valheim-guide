-- First verified catalogue slice: early Meadows and Black Forest crafting.
-- Sources are stored with each record so later imports remain auditable.

INSERT INTO crafting_stations (slug, name_en, name_ru) VALUES
  ('workbench', 'Workbench', 'Верстак')
ON CONFLICT(slug) DO UPDATE SET name_en = excluded.name_en, name_ru = excluded.name_ru;

WITH v(slug, name_en, name_ru, description_en, description_ru, biome_slug, source_url) AS (
  VALUES
    ('wood', 'Wood', 'Древесина', 'A basic crafting material.', 'Базовый материал для крафта.', 'meadows', 'https://valheim.fandom.com/wiki/Wood'),
    ('flint', 'Flint', 'Кремень', 'A sharp stone used for early tools and weapons.', 'Острый камень для ранних инструментов и оружия.', 'meadows', 'https://valheim.fandom.com/wiki/Flint'),
    ('deer-hide', 'Deer hide', 'Шкура оленя', 'Hide taken from a deer.', 'Шкура, получаемая с оленя.', 'meadows', 'https://valheim.fandom.com/wiki/Deer_hide'),
    ('bone-fragments', 'Bone fragments', 'Костяные фрагменты', 'Fragments of bone used in early equipment.', 'Фрагменты костей для раннего снаряжения.', 'meadows', 'https://valheim.fandom.com/wiki/Bone_fragments'),
    ('leather-scraps', 'Leather scraps', 'Обрывки кожи', 'Scraps of leather used in early crafting.', 'Обрывки кожи для раннего крафта.', 'meadows', 'https://valheim.fandom.com/wiki/Leather_scraps'),
    ('finewood', 'Fine wood', 'Ценная древесина', 'Fine wood used in more advanced crafting.', 'Ценная древесина для более продвинутого крафта.', 'black-forest', 'https://valheim.fandom.com/wiki/Fine_wood'),
    ('corewood', 'Core wood', 'Сердцевинная древесина', 'Strong wood used in advanced crafting.', 'Прочная древесина для более продвинутого крафта.', 'black-forest', 'https://valheim.fandom.com/wiki/Core_wood')
)
INSERT INTO items (slug, entity_type, name_en, name_ru, description_en, description_ru, biome_id, category_id, source_name, source_url)
SELECT v.slug, 'resource', v.name_en, v.name_ru, v.description_en, v.description_ru, b.id, c.id,
       'Valheim Wiki', v.source_url
FROM v
JOIN biomes b ON b.slug = v.biome_slug
JOIN categories c ON c.slug = 'material'
ON CONFLICT(slug) DO UPDATE SET
  entity_type = excluded.entity_type, name_en = excluded.name_en, name_ru = excluded.name_ru,
  description_en = excluded.description_en, description_ru = excluded.description_ru,
  biome_id = excluded.biome_id, category_id = excluded.category_id,
  source_name = excluded.source_name, source_url = excluded.source_url, updated_at = CURRENT_TIMESTAMP;

WITH v(slug, name_en, name_ru, description_en, description_ru, biome_slug, category_slug, source_url) AS (
  VALUES
    ('flint-axe', 'Flint axe', 'Кремнёвый топор', 'Sharper than stone.', 'Острее камня.', 'meadows', 'tool', 'https://valheim.fandom.com/wiki/Flint_axe'),
    ('finewood-bow', 'Finewood bow', 'Лук из ценной древесины', 'A bow made from fine wood.', 'Лук из ценной древесины.', 'black-forest', 'weapon', 'https://valheim.fandom.com/wiki/Crafting'),
    ('leather-helmet', 'Leather helmet', 'Кожаный шлем', 'A leather helmet for early protection.', 'Кожаный шлем для ранней защиты.', 'meadows', 'armor', 'https://valheim.fandom.com/wiki/Leather_armor'),
    ('leather-tunic', 'Leather tunic', 'Кожаная туника', 'A leather tunic for early protection.', 'Кожаная туника для ранней защиты.', 'meadows', 'armor', 'https://valheim.fandom.com/wiki/Leather_armor'),
    ('leather-pants', 'Leather pants', 'Кожаные штаны', 'Leather pants for early protection.', 'Кожаные штаны для ранней защиты.', 'meadows', 'armor', 'https://valheim.fandom.com/wiki/Leather_armor'),
    ('deer-hide-cape', 'Deer hide cape', 'Плащ из шкуры оленя', 'A cape made from deer hide.', 'Плащ из шкуры оленя.', 'meadows', 'armor', 'https://valheim.fandom.com/wiki/Leather_armor')
)
INSERT INTO items (slug, entity_type, name_en, name_ru, description_en, description_ru, biome_id, category_id, source_name, source_url)
SELECT v.slug, 'item', v.name_en, v.name_ru, v.description_en, v.description_ru, b.id, c.id,
       'Valheim Wiki', v.source_url
FROM v
JOIN biomes b ON b.slug = v.biome_slug
JOIN categories c ON c.slug = v.category_slug
ON CONFLICT(slug) DO UPDATE SET
  entity_type = excluded.entity_type, name_en = excluded.name_en, name_ru = excluded.name_ru,
  description_en = excluded.description_en, description_ru = excluded.description_ru,
  biome_id = excluded.biome_id, category_id = excluded.category_id,
  source_name = excluded.source_name, source_url = excluded.source_url, updated_at = CURRENT_TIMESTAMP;

WITH v(item_slug, stat_key, stat_value, unit, sort_order) AS (
  VALUES
    ('flint-axe', 'slash_damage', '20', NULL, 10),
    ('flint-axe', 'chop', '30', NULL, 20),
    ('flint-axe', 'durability', '100', NULL, 30),
    ('flint-axe', 'stamina_use', '6', NULL, 40),
    ('leather-helmet', 'armor', '2', NULL, 10),
    ('leather-tunic', 'armor', '2', NULL, 10),
    ('leather-pants', 'armor', '2', NULL, 10),
    ('deer-hide-cape', 'armor', '1', NULL, 10)
)
INSERT INTO item_stats (item_id, stat_key, stat_value, unit, sort_order)
SELECT i.id, v.stat_key, v.stat_value, v.unit, v.sort_order
FROM v
JOIN items i ON i.slug = v.item_slug
ON CONFLICT(item_id, stat_key) DO UPDATE SET stat_value = excluded.stat_value, unit = excluded.unit, sort_order = excluded.sort_order;

WITH v(item_slug, method_en, method_ru, biome_slug, source_url) AS (
  VALUES
    ('flint', 'Found along Meadows shorelines of rivers and oceans.', 'Встречается на берегах рек и океана в Лугах.', 'meadows', 'https://valheim.fandom.com/wiki/Flint'),
    ('deer-hide', 'Dropped by Deer.', 'Выпадает с оленей.', 'meadows', 'https://valheim.fandom.com/wiki/Deer_hide')
)
INSERT INTO resource_sources (resource_id, method_en, method_ru, biome_id, source_url, sort_order)
SELECT i.id, v.method_en, v.method_ru, b.id, v.source_url, 10
FROM v
JOIN items i ON i.slug = v.item_slug
JOIN biomes b ON b.slug = v.biome_slug
WHERE NOT EXISTS (
  SELECT 1 FROM resource_sources existing WHERE existing.resource_id = i.id AND existing.method_en = v.method_en
);

WITH v(item_slug, station_level) AS (
  VALUES
    ('flint-axe', 1), ('finewood-bow', 1),
    ('leather-helmet', 2), ('leather-tunic', 2), ('leather-pants', 2), ('deer-hide-cape', 1)
)
INSERT INTO recipes (item_id, crafting_station_id, station_level)
SELECT i.id, s.id, v.station_level
FROM v
JOIN items i ON i.slug = v.item_slug
JOIN crafting_stations s ON s.slug = 'workbench'
ON CONFLICT(item_id) DO UPDATE SET crafting_station_id = excluded.crafting_station_id, station_level = excluded.station_level;

WITH v(item_slug, resource_slug, quantity) AS (
  VALUES
    ('flint-axe', 'wood', 4), ('flint-axe', 'flint', 6),
    ('finewood-bow', 'finewood', 10), ('finewood-bow', 'corewood', 10), ('finewood-bow', 'deer-hide', 2),
    ('leather-helmet', 'deer-hide', 6), ('leather-tunic', 'deer-hide', 6), ('leather-pants', 'deer-hide', 6),
    ('deer-hide-cape', 'deer-hide', 4), ('deer-hide-cape', 'bone-fragments', 5)
)
INSERT INTO recipe_ingredients (recipe_id, resource_id, quantity)
SELECT re.id, resource.id, v.quantity
FROM v
JOIN items item ON item.slug = v.item_slug
JOIN recipes re ON re.item_id = item.id
JOIN items resource ON resource.slug = v.resource_slug
ON CONFLICT(recipe_id, resource_id) DO UPDATE SET quantity = excluded.quantity;

WITH v(item_slug, level, station_level) AS (
  VALUES
    ('flint-axe', 2, 2), ('flint-axe', 3, 3), ('flint-axe', 4, 4),
    ('leather-helmet', 2, 3), ('leather-helmet', 3, 4), ('leather-helmet', 4, 5),
    ('leather-tunic', 2, 3), ('leather-tunic', 3, 4), ('leather-tunic', 4, 5),
    ('leather-pants', 2, 3), ('leather-pants', 3, 4), ('leather-pants', 4, 5),
    ('deer-hide-cape', 2, 2), ('deer-hide-cape', 3, 3), ('deer-hide-cape', 4, 4)
)
INSERT INTO item_upgrades (item_id, level, station_level)
SELECT i.id, v.level, v.station_level
FROM v
JOIN items i ON i.slug = v.item_slug
ON CONFLICT(item_id, level) DO UPDATE SET station_level = excluded.station_level;

WITH v(item_slug, level, resource_slug, quantity) AS (
  VALUES
    ('flint-axe', 2, 'flint', 3), ('flint-axe', 2, 'leather-scraps', 2),
    ('flint-axe', 3, 'flint', 6), ('flint-axe', 3, 'leather-scraps', 4),
    ('flint-axe', 4, 'flint', 9), ('flint-axe', 4, 'leather-scraps', 6),
    ('leather-helmet', 2, 'deer-hide', 6), ('leather-helmet', 2, 'bone-fragments', 5),
    ('leather-helmet', 3, 'deer-hide', 12), ('leather-helmet', 3, 'bone-fragments', 10),
    ('leather-helmet', 4, 'deer-hide', 18), ('leather-helmet', 4, 'bone-fragments', 15),
    ('leather-tunic', 2, 'deer-hide', 6), ('leather-tunic', 2, 'bone-fragments', 5),
    ('leather-tunic', 3, 'deer-hide', 12), ('leather-tunic', 3, 'bone-fragments', 10),
    ('leather-tunic', 4, 'deer-hide', 18), ('leather-tunic', 4, 'bone-fragments', 15),
    ('leather-pants', 2, 'deer-hide', 6), ('leather-pants', 2, 'bone-fragments', 5),
    ('leather-pants', 3, 'deer-hide', 12), ('leather-pants', 3, 'bone-fragments', 10),
    ('leather-pants', 4, 'deer-hide', 18), ('leather-pants', 4, 'bone-fragments', 15),
    ('deer-hide-cape', 2, 'deer-hide', 4), ('deer-hide-cape', 2, 'bone-fragments', 5),
    ('deer-hide-cape', 3, 'deer-hide', 8), ('deer-hide-cape', 3, 'bone-fragments', 10),
    ('deer-hide-cape', 4, 'deer-hide', 12), ('deer-hide-cape', 4, 'bone-fragments', 15)
)
INSERT INTO upgrade_ingredients (upgrade_id, resource_id, quantity)
SELECT upgrade.id, resource.id, v.quantity
FROM v
JOIN items item ON item.slug = v.item_slug
JOIN item_upgrades upgrade ON upgrade.item_id = item.id AND upgrade.level = v.level
JOIN items resource ON resource.slug = v.resource_slug
ON CONFLICT(upgrade_id, resource_id) DO UPDATE SET quantity = excluded.quantity;
