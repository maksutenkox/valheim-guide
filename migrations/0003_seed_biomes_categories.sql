INSERT INTO categories (slug, name_en, name_ru, sort_order) VALUES
  ('weapon', 'Weapons', 'Оружие', 10), ('armor', 'Armor', 'Броня', 20),
  ('magic', 'Magic', 'Магия', 30), ('tool', 'Tools', 'Инструменты', 40),
  ('food', 'Food', 'Еда', 50), ('consumable', 'Consumables', 'Расходники', 60),
  ('material', 'Materials', 'Материалы', 70), ('building', 'Building', 'Строительство', 80),
  ('other', 'Other', 'Другое', 90)
ON CONFLICT(slug) DO UPDATE SET name_en = excluded.name_en, name_ru = excluded.name_ru, sort_order = excluded.sort_order;

INSERT INTO biomes (slug, name_en, name_ru, description_en, description_ru, accent_color, source_name, source_url) VALUES
  ('meadows','Meadows','Луга','The starting biome of Valheim.','Стартовый биом Valheim.','#7b9f59','Valheim Wiki — Biomes','https://valheimwiki.wiki/en/biomes/'),
  ('black-forest','Black Forest','Чёрный лес','A dark forest rich in early metal resources.','Тёмный лес с ранними металлическими ресурсами.','#3f6954','Valheim Wiki — Biomes','https://valheimwiki.wiki/en/biomes/'),
  ('swamp','Swamp','Болото','A wet, dangerous biome with crypts and iron.','Сырой опасный биом с криптами и железом.','#53604a','Valheim Wiki — Biomes','https://valheimwiki.wiki/en/biomes/'),
  ('mountains','Mountains','Горы','Frozen peaks where cold protection is essential.','Ледяные вершины, где нужна защита от холода.','#aebdca','Valheim Wiki — Biomes','https://valheimwiki.wiki/en/biomes/'),
  ('plains','Plains','Равнины','Open grasslands with late-game farming resources.','Открытые земли с ресурсами для поздней фермы.','#c7a25b','Valheim Wiki — Biomes','https://valheimwiki.wiki/en/biomes/'),
  ('mistlands','Mistlands','Туманные земли','A mist-covered biome where Eitr magic appears.','Туманный биом, где появляется магия Эйтра.','#7a748d','Valheim Wiki — Biomes','https://valheimwiki.wiki/en/biomes/'),
  ('ashlands','Ashlands','Пепельные земли','A volcanic endgame biome of fire and flametal.','Вулканический биом поздней игры с огнём и фламеталлом.','#a15437','Valheim Wiki — Biomes','https://valheimwiki.wiki/en/biomes/'),
  ('deep-north','Deep North','Глубокий Север','The frozen final biome introduced with Valheim 1.0.','Ледяной финальный биом, появившийся с Valheim 1.0.','#7ca6c6','Valheim Wiki — Biomes','https://valheimwiki.wiki/en/biomes/'),
  ('ocean','Ocean','Океан','The sea biome between the continents.','Морской биом между континентами.','#477a9a','Valheim Wiki — Biomes','https://valheimwiki.wiki/en/biomes/')
ON CONFLICT(slug) DO UPDATE SET name_en = excluded.name_en, name_ru = excluded.name_ru, description_en = excluded.description_en, description_ru = excluded.description_ru, accent_color = excluded.accent_color, source_name = excluded.source_name, source_url = excluded.source_url, updated_at = CURRENT_TIMESTAMP;
