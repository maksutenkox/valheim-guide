-- Direct game imagery is resolved from the Valheim Wiki (Fandom) MediaWiki API.
-- Each record keeps the corresponding File: page as attribution metadata.

UPDATE biomes SET image_path = CASE slug
  WHEN 'meadows' THEN 'https://static.wikia.nocookie.net/valheim/images/5/52/Biome_meadows.png/revision/latest?cb=20210215131217'
  WHEN 'black-forest' THEN 'https://static.wikia.nocookie.net/valheim/images/5/5c/Blackforest2.jpg/revision/latest?cb=20210205163807'
  WHEN 'swamp' THEN 'https://static.wikia.nocookie.net/valheim/images/d/d4/Biome_swamp.png/revision/latest?cb=20210215131223'
  WHEN 'mountains' THEN 'https://static.wikia.nocookie.net/valheim/images/7/78/Biome_mountain.png/revision/latest?cb=20210215131220'
  WHEN 'plains' THEN 'https://static.wikia.nocookie.net/valheim/images/9/91/Biome_heath.png/revision/latest?cb=20210215131216'
  WHEN 'mistlands' THEN 'https://static.wikia.nocookie.net/valheim/images/1/1e/Biome_mistlands.png/revision/latest?cb=20221209075159'
  WHEN 'ashlands' THEN 'https://static.wikia.nocookie.net/valheim/images/2/2f/Ashlands1.jpg/revision/latest?cb=20210205140657'
  WHEN 'deep-north' THEN 'https://static.wikia.nocookie.net/valheim/images/b/bb/Deep_North_shoreline_teaser.png/revision/latest?cb=20260302215447'
  WHEN 'ocean' THEN 'https://static.wikia.nocookie.net/valheim/images/6/62/Biome_ocean.png/revision/latest?cb=20210215131222'
END,
source_name = 'Valheim Wiki (Fandom) — biome image', updated_at = CURRENT_TIMESTAMP;

UPDATE items SET image_path = CASE slug
  WHEN 'wood' THEN 'https://static.wikia.nocookie.net/valheim/images/d/df/Wood.png/revision/latest?cb=20210215132125'
  WHEN 'flint' THEN 'https://static.wikia.nocookie.net/valheim/images/2/2e/Flint.png/revision/latest?cb=20210215131615'
  WHEN 'deer-hide' THEN 'https://static.wikia.nocookie.net/valheim/images/9/94/Deer_Hide.png/revision/latest?cb=20210215131542'
  WHEN 'bone-fragments' THEN 'https://static.wikia.nocookie.net/valheim/images/7/7a/Bone_Fragments.png/revision/latest?cb=20210215131409'
  WHEN 'leather-scraps' THEN 'https://static.wikia.nocookie.net/valheim/images/d/d9/Leather_Scraps.png/revision/latest?cb=20210208222814'
  WHEN 'finewood' THEN 'https://static.wikia.nocookie.net/valheim/images/9/98/Finewood.png/revision/latest?cb=20210215131556'
  WHEN 'corewood' THEN 'https://static.wikia.nocookie.net/valheim/images/5/53/Corewood.png/revision/latest?cb=20210215131825'
  WHEN 'stone' THEN 'https://static.wikia.nocookie.net/valheim/images/d/d4/Stone.png/revision/latest?cb=20210215131958'
  WHEN 'resin' THEN 'https://static.wikia.nocookie.net/valheim/images/2/2c/Resin.png/revision/latest?cb=20210215131821'
  WHEN 'club' THEN 'https://static.wikia.nocookie.net/valheim/images/5/50/Club.png/revision/latest?cb=20210215131512'
  WHEN 'crude-bow' THEN 'https://static.wikia.nocookie.net/valheim/images/b/be/Crude_Bow.png/revision/latest?cb=20210208233336'
  WHEN 'flint-axe' THEN 'https://static.wikia.nocookie.net/valheim/images/9/92/Flint_Axe.png/revision/latest?cb=20230101110252'
  WHEN 'flint-knife' THEN 'https://static.wikia.nocookie.net/valheim/images/e/e8/Flint_Knife.png/revision/latest?cb=20210209001832'
  WHEN 'flint-spear' THEN 'https://static.wikia.nocookie.net/valheim/images/6/6b/Flint_Spear.png/revision/latest?cb=20210209152025'
  WHEN 'finewood-bow' THEN 'https://static.wikia.nocookie.net/valheim/images/a/a6/Finewood_Bow.png/revision/latest?cb=20210214051911'
  WHEN 'leather-helmet' THEN 'https://static.wikia.nocookie.net/valheim/images/6/6e/Leather_Helmet.png/revision/latest?cb=20210209040310'
  WHEN 'leather-tunic' THEN 'https://static.wikia.nocookie.net/valheim/images/9/96/Leather_Tunic.png/revision/latest?cb=20210209042720'
  WHEN 'leather-pants' THEN 'https://static.wikia.nocookie.net/valheim/images/2/28/Leather_Pants.png/revision/latest?cb=20210209042343'
  WHEN 'deer-hide-cape' THEN 'https://static.wikia.nocookie.net/valheim/images/6/67/Deer_Hide_Cape.png/revision/latest?cb=20210209041809'
END,
image_source_url = CASE slug
  WHEN 'wood' THEN 'https://valheim.fandom.com/wiki/File:Wood.png'
  WHEN 'flint' THEN 'https://valheim.fandom.com/wiki/File:Flint.png'
  WHEN 'deer-hide' THEN 'https://valheim.fandom.com/wiki/File:Deer_Hide.png'
  WHEN 'bone-fragments' THEN 'https://valheim.fandom.com/wiki/File:Bone_Fragments.png'
  WHEN 'leather-scraps' THEN 'https://valheim.fandom.com/wiki/File:Leather_Scraps.png'
  WHEN 'finewood' THEN 'https://valheim.fandom.com/wiki/File:Finewood.png'
  WHEN 'corewood' THEN 'https://valheim.fandom.com/wiki/File:Corewood.png'
  WHEN 'stone' THEN 'https://valheim.fandom.com/wiki/File:Stone.png'
  WHEN 'resin' THEN 'https://valheim.fandom.com/wiki/File:Resin.png'
  WHEN 'club' THEN 'https://valheim.fandom.com/wiki/File:Club.png'
  WHEN 'crude-bow' THEN 'https://valheim.fandom.com/wiki/File:Crude_Bow.png'
  WHEN 'flint-axe' THEN 'https://valheim.fandom.com/wiki/File:Flint_Axe.png'
  WHEN 'flint-knife' THEN 'https://valheim.fandom.com/wiki/File:Flint_Knife.png'
  WHEN 'flint-spear' THEN 'https://valheim.fandom.com/wiki/File:Flint_Spear.png'
  WHEN 'finewood-bow' THEN 'https://valheim.fandom.com/wiki/File:Finewood_Bow.png'
  WHEN 'leather-helmet' THEN 'https://valheim.fandom.com/wiki/File:Leather_Helmet.png'
  WHEN 'leather-tunic' THEN 'https://valheim.fandom.com/wiki/File:Leather_Tunic.png'
  WHEN 'leather-pants' THEN 'https://valheim.fandom.com/wiki/File:Leather_Pants.png'
  WHEN 'deer-hide-cape' THEN 'https://valheim.fandom.com/wiki/File:Deer_Hide_Cape.png'
END,
image_license_note = 'Valheim Wiki (Fandom) game icon; source page retained for attribution', updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('wood', 'flint', 'deer-hide', 'bone-fragments', 'leather-scraps', 'finewood', 'corewood', 'stone', 'resin', 'club', 'crude-bow', 'flint-axe', 'flint-knife', 'flint-spear', 'finewood-bow', 'leather-helmet', 'leather-tunic', 'leather-pants', 'deer-hide-cape');
