import type { Env } from "../env";
import { applyCatalogSeed, type CatalogSeed } from "./catalog-seed";

const item = (slug: string) => `https://www.valheim.tools/items/${slug}`;

const oceanSeed: CatalogSeed = {
  marker: "catalog_ocean_v2_acquisition_precision",
  biome: "ocean",
  replaceResourceSources: true,
  items: [
    { slug:"chitin", type:"resource", category:"material", en:"Chitin", ru:"Хитин", descriptionEn:"A hard ocean material mined from Leviathan barnacles.", descriptionRu:"Твёрдый морской материал, добываемый с наростов левиафанов.", imageFile:"Chitin.png", source:item("chitin") },
    { slug:"serpent-scale", type:"resource", category:"material", en:"Serpent Scale", ru:"Змеиная чешуя", descriptionEn:"Heavy scales dropped by Sea Serpents.", descriptionRu:"Тяжёлая чешуя морских змеев.", imageFile:"Serpent_scale.png", source:item("serpent-scale") },
    { slug:"serpent-meat", type:"resource", category:"material", en:"Serpent Meat", ru:"Мясо змея", descriptionEn:"Raw meat dropped by Sea Serpents.", descriptionRu:"Сырое мясо морских змеев.", imageFile:"Serpent_meat.png", source:item("serpent-meat") },
    { slug:"raw-fish", type:"resource", category:"material", en:"Raw Fish", ru:"Сырая рыба", descriptionEn:"Fish meat prepared from caught fish.", descriptionRu:"Сырое рыбное филе из пойманной рыбы.", imageFile:"Raw_Fish.png", source:item("raw-fish") },

    { slug:"abyssal-razor", type:"item", category:"weapon", en:"Abyssal Razor", ru:"Бездна-бритва", descriptionEn:"A fast knife crafted from Chitin.", descriptionRu:"Быстрый нож из хитина.", imageFile:"Abyssal_razor.png", source:item("abyssal-razor") },
    { slug:"abyssal-harpoon", type:"item", category:"weapon", en:"Abyssal Harpoon", ru:"Гарпун бездны", descriptionEn:"A utility harpoon that tethers creatures.", descriptionRu:"Гарпун для привязывания и перетаскивания существ.", imageFile:"Abyssal_harpoon.png", source:item("abyssal-harpoon") },
    { slug:"cooked-serpent-meat", type:"item", category:"food", en:"Cooked Serpent Meat", ru:"Жареное мясо змея", descriptionEn:"Sea Serpent meat cooked on an Iron Cooking Station.", descriptionRu:"Мясо морского змея, приготовленное на железной стойке.", imageFile:"Cooked_serpent_meat.png", source:item("cooked-serpent-meat") }
  ],
  recipes: [
    { item:"abyssal-razor", station:"workbench", level:2, ingredients:[["finewood",4],["chitin",20],["leather-scraps",2]] },
    { item:"abyssal-harpoon", station:"workbench", level:2, ingredients:[["finewood",8],["chitin",30],["leather-scraps",3]] },
    { item:"cooked-serpent-meat", station:"iron-cooking-station", ingredients:[["serpent-meat",1]] }
  ],
  upgrades: [
    { item:"abyssal-razor", level:2, stationLevel:3, ingredients:[["chitin",10]] },
    { item:"abyssal-razor", level:3, stationLevel:4, ingredients:[["chitin",20]] },
    { item:"abyssal-razor", level:4, stationLevel:5, ingredients:[["chitin",40]] }
  ],
  stats: [
    ["abyssal-razor","slash_damage","20"],["abyssal-razor","pierce_damage","20"],["abyssal-razor","durability","200"],["abyssal-razor","stamina_use","8"],
    ["abyssal-harpoon","pierce_damage","10"],["abyssal-harpoon","durability","50"],["abyssal-harpoon","stamina_use","15"],
    ["cooked-serpent-meat","health","70"],["cooked-serpent-meat","stamina","23"],["cooked-serpent-meat","duration","25","min"],["cooked-serpent-meat","healing","3","hp/tick"]
  ],
  resourceSources: [
    ["chitin","Mine Abyssal Barnacles on Leviathans: each mined barnacle yields 3–4 Chitin. Mining can trigger the Leviathan to begin sinking, so work quickly.","Добывайте Абиссальные наросты на левиафанах: каждый добытый нарост даёт 3–4 Хитина. Добыча может заставить левиафана начать погружение, поэтому работайте быстро.",item("chitin")],
    ["chitin","Coral Cod caught with Heavy Fishing Bait can yield 1–2 Chitin at 67%.","Коралловая треска, пойманная на тяжёлую наживку, может дать 1–2 Хитина с шансом 67%.",item("chitin")],
    ["serpent-scale","Sea Serpents always drop 8–10 Serpent Scales. The scales sink in deep water, so drag the serpent into shallows with an Abyssal Harpoon before the kill.","Морские змеи гарантированно роняют 8–10 Змеиных чешуек. Чешуя тонет, поэтому перед убийством лучше притянуть змея Гарпуном бездны на мелководье.",item("serpent-scale")],
    ["serpent-meat","Sea Serpents always drop 6–8 Serpent Meat.","Морские змеи гарантированно роняют 6–8 Змеиного мяса.",item("serpent-meat")],
    ["raw-fish","At the Food Preparation Table, any of the 12 catchable fish can be filleted 1:1 into Raw Fish.","На Столе подготовки еды любой из 12 видов пойманной рыбы разделывается в Сырую рыбу в соотношении 1:1.",item("raw-fish")],
    ["raw-fish","Fish stranded out of water can be picked up by hand before filleting, requiring no bait for the pickup itself.","Рыбу, выброшенную из воды, можно подобрать руками и затем разделать — для самого подбора наживка не нужна.",item("raw-fish")]
  ]
};

export const ensureOceanCatalog = (env: Env): Promise<void> => applyCatalogSeed(env, oceanSeed);
