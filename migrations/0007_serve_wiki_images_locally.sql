-- The attributed Fandom files are bundled as static Worker assets for reliable Mini App rendering.
UPDATE items SET image_path = '/media/wiki/' || slug || '.webp', updated_at = CURRENT_TIMESTAMP
WHERE slug IN ('wood', 'flint', 'deer-hide', 'bone-fragments', 'leather-scraps', 'finewood', 'corewood', 'stone', 'resin', 'club', 'crude-bow', 'flint-axe', 'flint-knife', 'flint-spear', 'finewood-bow', 'leather-helmet', 'leather-tunic', 'leather-pants', 'deer-hide-cape');
