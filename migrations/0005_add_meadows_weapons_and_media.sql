-- Item illustrations are original project SVGs. Biome backgrounds point to Iron Gate's public press page.

INSERT INTO crafting_stations (slug, name_en, name_ru) VALUES
  ('inventory', 'Inventory', 'Инвентарь')
ON CONFLICT(slug) DO UPDATE SET name_en = excluded.name_en, name_ru = excluded.name_ru;

UPDATE biomes SET image_path = CASE slug
  WHEN 'meadows' THEN 'https://img2.storyblok.com/fit-in/600x400/f/157036/1920x1080/15d8920edb/valheim3.png'
  WHEN 'black-forest' THEN 'https://img2.storyblok.com/fit-in/600x400/f/157036/1920x1080/cb5e84b647/valheim2.png'
  WHEN 'swamp' THEN 'https://img2.storyblok.com/fit-in/600x400/f/157036/2560x1440/ed87ecf070/news-1.jpg'
  WHEN 'mountains' THEN 'https://img2.storyblok.com/fit-in/600x400/f/157036/1920x1080/8e4a98bd6a/5-building.jpg'
  WHEN 'plains' THEN 'https://img2.storyblok.com/fit-in/600x400/f/157036/1920x1080/15d8920edb/valheim3.png'
  WHEN 'mistlands' THEN 'https://img2.storyblok.com/fit-in/600x400/f/157036/5886x3251/7e748e7f75/mistlandsart1.jpg'
  WHEN 'ashlands' THEN 'https://img2.storyblok.com/fit-in/600x400/f/157036/6000x3314/ddbf463117/ashlands-art-1.jpg'
  WHEN 'deep-north' THEN 'https://img2.storyblok.com/fit-in/600x400/f/157036/1920x1080/8e4a98bd6a/5-building.jpg'
  WHEN 'ocean' THEN 'https://img2.storyblok.com/fit-in/600x400/f/157036/2560x1440/ed87ecf070/news-1.jpg'
END,
source_name = 'Iron Gate Studio — official press kit', source_url = 'https://www.valheimgame.com/press/', updated_at = CURRENT_TIMESTAMP;

UPDATE items SET image_path = CASE slug
  WHEN 'wood' THEN '/media/items/wood.svg'
  WHEN 'flint' THEN '/media/items/flint.svg'
  WHEN 'deer-hide' THEN '/media/items/deer-hide.svg'
  WHEN 'bone-fragments' THEN '/media/items/bone-fragments.svg'
  WHEN 'leather-scraps' THEN '/media/items/leather-scraps.svg'
  WHEN 'finewood' THEN '/media/items/finewood.svg'
  WHEN 'corewood' THEN '/media/items/corewood.svg'
  WHEN 'flint-axe' THEN '/media/items/flint-axe.svg'
  WHEN 'finewood-bow' THEN '/media/items/bow.svg'
  WHEN 'leather-helmet' THEN '/media/items/leather-armor.svg'
  WHEN 'leather-tunic' THEN '/media/items/leather-armor.svg'
  WHEN 'leather-pants' THEN '/media/items/leather-armor.svg'
  WHEN 'deer-hide-cape' THEN '/media/items/leather-armor.svg'
END,
image_license_note = 'Original VALHEIM Guide vector illustration', updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('wood', 'flint', 'deer-hide', 'bone-fragments', 'leather-scraps', 'finewood', 'corewood', 'flint-axe', 'finewood-bow', 'leather-helmet', 'leather-tunic', 'leather-pants', 'deer-hide-cape');

WITH v(slug, name_en, name_ru, description_en, description_ru, source_url, image_path) AS (
  VALUES
    ('stone', 'Stone', 'Камень', 'A rough stone used in early crafting.', 'Обычный камень для раннего крафта.', 'https://valheim.fandom.com/wiki/Stone', '/media/items/flint.svg'),
    ('resin', 'Resin', 'Смола', 'A sticky resin used for torches and crafting.', 'Смола для факелов и крафта.', 'https://valheim.fandom.com/wiki/Resin', '/media/items/finewood.svg')
)
INSERT INTO items (slug, entity_type, name_en, name_ru, description_en, description_ru, biome_id, category_id, image_path, image_license_note, source_name, source_url)
SELECT v.slug, 'resource', v.name_en, v.name_ru, v.description_en, v.description_ru, b.id, c.id, v.image_path,
       'Original VALHEIM Guide vector illustration', 'Valheim Wiki (Fandom)', v.source_url
FROM v JOIN biomes b ON b.slug = 'meadows' JOIN categories c ON c.slug = 'material'
ON CONFLICT(slug) DO UPDATE SET name_en = excluded.name_en, name_ru = excluded.name_ru, description_en = excluded.description_en, description_ru = excluded.description_ru, image_path = excluded.image_path, image_license_note = excluded.image_license_note, source_name = excluded.source_name, source_url = excluded.source_url, updated_at = CURRENT_TIMESTAMP;

WITH v(slug, name_en, name_ru, description_en, description_ru, image_path, source_url) AS (
  VALUES
    ('club', 'Club', 'Дубина', 'A simple one-handed wooden club.', 'Простое одноручное деревянное оружие.', '/media/items/wood.svg', 'https://valheim.fandom.com/wiki/Club'),
    ('crude-bow', 'Crude bow', 'Простой лук', 'A basic bow for your first hunts.', 'Базовый лук для первых охот.', '/media/items/bow.svg', 'https://valheim.fandom.com/wiki/Crafting'),
    ('flint-knife', 'Flint knife', 'Кремнёвый нож', 'A quick knife made with flint.', 'Быстрый нож из кремня.', '/media/items/flint-axe.svg', 'https://valheim.fandom.com/wiki/Flint_knife'),
    ('flint-spear', 'Flint spear', 'Кремнёвое копьё', 'A spear with a flint point.', 'Копьё с кремнёвым наконечником.', '/media/items/flint-axe.svg', 'https://valheim.fandom.com/wiki/Crafting')
)
INSERT INTO items (slug, entity_type, name_en, name_ru, description_en, description_ru, biome_id, category_id, image_path, image_license_note, source_name, source_url)
SELECT v.slug, 'item', v.name_en, v.name_ru, v.description_en, v.description_ru, b.id, c.id, v.image_path,
       'Original VALHEIM Guide vector illustration', 'Valheim Wiki (Fandom)', v.source_url
FROM v JOIN biomes b ON b.slug = 'meadows' JOIN categories c ON c.slug = 'weapon'
ON CONFLICT(slug) DO UPDATE SET name_en = excluded.name_en, name_ru = excluded.name_ru, description_en = excluded.description_en, description_ru = excluded.description_ru, image_path = excluded.image_path, image_license_note = excluded.image_license_note, source_name = excluded.source_name, source_url = excluded.source_url, updated_at = CURRENT_TIMESTAMP;

WITH v(item_slug, station_slug, station_level) AS (
  VALUES ('club', 'inventory', 1), ('crude-bow', 'workbench', 1), ('flint-knife', 'workbench', 1), ('flint-spear', 'workbench', 1)
)
INSERT INTO recipes (item_id, crafting_station_id, station_level)
SELECT i.id, s.id, v.station_level FROM v JOIN items i ON i.slug = v.item_slug JOIN crafting_stations s ON s.slug = v.station_slug
ON CONFLICT(item_id) DO UPDATE SET crafting_station_id = excluded.crafting_station_id, station_level = excluded.station_level;

WITH v(item_slug, resource_slug, quantity) AS (
  VALUES
    ('club', 'wood', 6),
    ('crude-bow', 'wood', 10), ('crude-bow', 'leather-scraps', 8),
    ('flint-knife', 'wood', 2), ('flint-knife', 'flint', 4), ('flint-knife', 'leather-scraps', 2),
    ('flint-spear', 'wood', 5), ('flint-spear', 'flint', 10), ('flint-spear', 'leather-scraps', 2)
)
INSERT INTO recipe_ingredients (recipe_id, resource_id, quantity)
SELECT recipe.id, resource.id, v.quantity FROM v JOIN items item ON item.slug = v.item_slug JOIN recipes recipe ON recipe.item_id = item.id JOIN items resource ON resource.slug = v.resource_slug
ON CONFLICT(recipe_id, resource_id) DO UPDATE SET quantity = excluded.quantity;

WITH v(item_slug, level, station_level) AS (
  VALUES ('club', 2, 1), ('club', 3, 1), ('club', 4, 1), ('flint-knife', 2, 2), ('flint-knife', 3, 3), ('flint-knife', 4, 4)
)
INSERT INTO item_upgrades (item_id, level, station_level)
SELECT i.id, v.level, v.station_level FROM v JOIN items i ON i.slug = v.item_slug
ON CONFLICT(item_id, level) DO UPDATE SET station_level = excluded.station_level;

WITH v(item_slug, level, resource_slug, quantity) AS (
  VALUES
    ('club', 2, 'bone-fragments', 5), ('club', 3, 'bone-fragments', 10), ('club', 4, 'bone-fragments', 15),
    ('flint-knife', 2, 'flint', 2), ('flint-knife', 3, 'flint', 4), ('flint-knife', 4, 'flint', 6)
)
INSERT INTO upgrade_ingredients (upgrade_id, resource_id, quantity)
SELECT upgrade.id, resource.id, v.quantity FROM v JOIN items item ON item.slug = v.item_slug JOIN item_upgrades upgrade ON upgrade.item_id = item.id AND upgrade.level = v.level JOIN items resource ON resource.slug = v.resource_slug
ON CONFLICT(upgrade_id, resource_id) DO UPDATE SET quantity = excluded.quantity;
