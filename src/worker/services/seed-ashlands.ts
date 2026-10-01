import type { Env } from "../env";
import { applyCatalogSeed, type CatalogSeed } from "./catalog-seed";

const item = (slug: string) => `https://www.valheim.tools/items/${slug}`;

const ashlandsSeed: CatalogSeed = {
  marker: "catalog_ashlands_acquisition_v2_precision",
  biome: "ashlands",
  replaceResourceSources: true,
  items: [
    { slug:"ashwood", type:"resource", category:"material", en:"Ashwood", ru:"Ясеневая древесина", descriptionEn:"Fire-hardened wood harvested from Ashlands trees.", descriptionRu:"Закалённая огнём древесина деревьев Пепельных земель.", imageFile:"Ashwood.png", source:item("ashwood") },
    { slug:"flametal-ore", type:"resource", category:"material", en:"Flametal Ore", ru:"Фламеталловая руда", descriptionEn:"Ore mined from Flametal deposits in the lava.", descriptionRu:"Руда, добываемая из фламеталловых залежей в лаве.", imageFile:"Flametal_ore.png", source:item("flametal-ore") },
    { slug:"flametal", type:"resource", category:"material", en:"Flametal", ru:"Фламеталл", descriptionEn:"A divine metal smelted from Flametal Ore.", descriptionRu:"Божественный металл, выплавляемый из фламеталловой руды.", imageFile:"Flametal.png", source:item("flametal") },
    { slug:"asksvin-hide", type:"resource", category:"material", en:"Asksvin Hide", ru:"Шкура асксвина", descriptionEn:"Tough hide dropped by Asksvin.", descriptionRu:"Прочная шкура, выпадающая из асксвинов.", imageFile:"Asksvin_hide.png", source:item("asksvin-hide") },
    { slug:"asksvin-bladder", type:"resource", category:"material", en:"Asksvin Bladder", ru:"Пузырь асксвина", descriptionEn:"A volatile bladder dropped by Asksvin.", descriptionRu:"Пузырь, выпадающий из асксвинов.", imageFile:"Asksvin_bladder.png", source:item("asksvin-bladder") },
    { slug:"asksvin-tail", type:"resource", category:"material", en:"Asksvin Tail", ru:"Хвост асксвина", descriptionEn:"Raw meat from an Asksvin tail.", descriptionRu:"Сырое мясо хвоста асксвина.", imageFile:"Asksvin_tail.png", source:item("asksvin-tail") },
    { slug:"charred-bone", type:"resource", category:"material", en:"Charred Bone", ru:"Обугленная кость", descriptionEn:"Burnt bone taken from the Charred.", descriptionRu:"Обгоревшая кость, добываемая с Обугленных.", imageFile:"Charred_bone.png", source:item("charred-bone") },
    { slug:"morgen-sinew", type:"resource", category:"material", en:"Morgen Sinew", ru:"Сухожилие моргена", descriptionEn:"A strong sinew dropped by Morgens.", descriptionRu:"Прочное сухожилие, выпадающее из моргенов.", imageFile:"Morgen_sinew.png", source:item("morgen-sinew") },
    { slug:"morgen-heart", type:"resource", category:"material", en:"Morgen Heart", ru:"Сердце моргена", descriptionEn:"A rare organ taken from Morgens.", descriptionRu:"Редкий орган, добываемый с моргенов.", imageFile:"Morgen_heart.png", source:item("morgen-heart") },
    { slug:"bonemaw-tooth", type:"resource", category:"material", en:"Bonemaw Tooth", ru:"Зуб костепасти", descriptionEn:"A huge tooth from a Bonemaw.", descriptionRu:"Огромный зуб костепасти.", imageFile:"Bonemaw_tooth.png", source:item("bonemaw-tooth") },
    { slug:"bonemaw-meat", type:"resource", category:"material", en:"Bonemaw Meat", ru:"Мясо костепасти", descriptionEn:"Raw meat from a Bonemaw.", descriptionRu:"Сырое мясо костепасти.", imageFile:"Bonemaw_meat.png", source:item("bonemaw-meat") },
    { slug:"celestial-feather", type:"resource", category:"material", en:"Celestial Feather", ru:"Небесное перо", descriptionEn:"A bright feather dropped by Fallen Valkyries.", descriptionRu:"Сияющее перо, выпадающее из павших валькирий.", imageFile:"Celestial_feather.png", source:item("celestial-feather") },
    { slug:"proustite-powder", type:"resource", category:"material", en:"Proustite Powder", ru:"Порошок прустита", descriptionEn:"Explosive mineral powder dropped by Lava Blobs.", descriptionRu:"Взрывчатый минеральный порошок из лавовых сгустков.", imageFile:"Proustite_powder.png", source:item("proustite-powder") },
    { slug:"sulfur", type:"resource", category:"material", en:"Sulfur", ru:"Сера", descriptionEn:"Sulfur gathered in the Ashlands.", descriptionRu:"Сера, добываемая в Пепельных землях.", imageFile:"Sulfur.png", source:item("sulfur") },
    { slug:"vineberry-cluster", type:"resource", category:"material", en:"Vineberry Cluster", ru:"Гроздь винной ягоды", descriptionEn:"A cluster of cultivated Ashlands berries.", descriptionRu:"Гроздь выращиваемых ягод Пепельных земель.", imageFile:"Vineberry_cluster.png", source:item("vineberry-cluster") },
    { slug:"smoke-puff", type:"resource", category:"material", en:"Smoke Puff", ru:"Дымчатый гриб", descriptionEn:"An Ashlands crop used in advanced food.", descriptionRu:"Культура Пепельных земель для продвинутой еды.", imageFile:"Smoke_puff.png", source:item("smoke-puff") },
    { slug:"fiddlehead", type:"resource", category:"material", en:"Fiddlehead", ru:"Папоротник", descriptionEn:"An edible Ashlands plant.", descriptionRu:"Съедобное растение Пепельных земель.", imageFile:"Fiddlehead.png", source:item("fiddlehead") },
    { slug:"volture-egg", type:"resource", category:"material", en:"Volture Egg", ru:"Яйцо вольтюра", descriptionEn:"An egg gathered from Volture nests.", descriptionRu:"Яйцо из гнёзд вольтюров.", imageFile:"Volture_egg.png", source:item("volture-egg") },
    { slug:"volture-meat", type:"resource", category:"material", en:"Volture Meat", ru:"Мясо вольтюра", descriptionEn:"Raw meat dropped by Voltures.", descriptionRu:"Сырое мясо, выпадающее из вольтюров.", imageFile:"Volture_meat.png", source:item("volture-meat") },
    { slug:"bloodstone", type:"resource", category:"material", en:"Bloodstone", ru:"Кровавый камень", descriptionEn:"A red gemstone used to infuse Ashlands weapons.", descriptionRu:"Красный самоцвет для усиления оружия Пепельных земель.", imageFile:"Bloodstone.png", source:item("bloodstone") },
    { slug:"iolite", type:"resource", category:"material", en:"Iolite", ru:"Иолит", descriptionEn:"A storm-blue gemstone used to infuse weapons with lightning.", descriptionRu:"Сине-фиолетовый самоцвет для грозовых вариантов оружия.", imageFile:"Iolite.png", source:item("iolite") },
    { slug:"jade", type:"resource", category:"material", en:"Jade", ru:"Нефрит", descriptionEn:"A green gemstone used for primal weapon infusions.", descriptionRu:"Зелёный самоцвет для первобытных вариантов оружия.", imageFile:"Jade.png", source:item("jade") },
    { slug:"flametal-battle-idol", type:"resource", category:"material", en:"Flametal Battle Idol", ru:"Фламеталловый боевой идол", descriptionEn:"Ashlands-tier Forge of Potential material for weapons.", descriptionRu:"Материал Пепельных земель для усиления оружия в Кузнице потенциала.", imageFile:"Flametal_Battle_Idol.png", source:item("flametal-battle-idol") },
    { slug:"flametal-protection-idol", type:"resource", category:"material", en:"Flametal Protection Idol", ru:"Фламеталловый защитный идол", descriptionEn:"Ashlands-tier Forge of Potential material for armour.", descriptionRu:"Материал Пепельных земель для усиления брони в Кузнице потенциала.", imageFile:"Flametal_Protection_Idol.png", source:item("flametal-protection-idol") },
    { slug:"troll-trophy", type:"resource", category:"trophy", en:"Troll Trophy", ru:"Трофей: тролль", descriptionEn:"A rare trophy from Trolls.", descriptionRu:"Редкий трофей с троллей.", imageFile:"Troll_trophy.png", source:item("troll-trophy"), biome:"black-forest" },
    { slug:"dyrnwyn-hilt-fragment", type:"resource", category:"material", en:"Dyrnwyn Hilt Fragment", ru:"Фрагмент рукояти Дюрнвина", descriptionEn:"One of the unique fragments needed to restore Dyrnwyn.", descriptionRu:"Один из уникальных фрагментов для восстановления Дюрнвина.", imageFile:"Dyrnwyn_hilt_fragment.png", source:item("dyrnwyn-hilt-fragment") },
    { slug:"dyrnwyn-blade-fragment", type:"resource", category:"material", en:"Dyrnwyn Blade Fragment", ru:"Фрагмент клинка Дюрнвина", descriptionEn:"One of the unique fragments needed to restore Dyrnwyn.", descriptionRu:"Один из уникальных фрагментов для восстановления Дюрнвина.", imageFile:"Dyrnwyn_blade_fragment.png", source:item("dyrnwyn-blade-fragment") },
    { slug:"dyrnwyn-tip-fragment", type:"resource", category:"material", en:"Dyrnwyn Tip Fragment", ru:"Фрагмент острия Дюрнвина", descriptionEn:"One of the unique fragments needed to restore Dyrnwyn.", descriptionRu:"Один из уникальных фрагментов для восстановления Дюрнвина.", imageFile:"Dyrnwyn_tip_fragment.png", source:item("dyrnwyn-tip-fragment") },

    { slug:"nidhogg", type:"item", category:"weapon", en:"Nidhögg", ru:"Нидхёгг", descriptionEn:"A brutal one-handed Flametal sword.", descriptionRu:"Мощный одноручный меч из фламеталла.", imageFile:"Nidhogg.png", source:item("nidh-gg") },
    { slug:"nidhogg-bleeding", type:"item", category:"weapon", en:"Nidhögg the Bleeding", ru:"Нидхёгг Кровоточащий", descriptionEn:"Bloodstone-infused Nidhögg.", descriptionRu:"Нидхёгг, усиленный кровавым камнем.", imageFile:"Nidhogg_the_Bleeding.png", source:item("nidh-gg-the-bleeding") },
    { slug:"nidhogg-thundering", type:"item", category:"weapon", en:"Nidhögg the Thundering", ru:"Нидхёгг Громовой", descriptionEn:"Iolite-infused Nidhögg.", descriptionRu:"Нидхёгг, усиленный иолитом.", imageFile:"Nidhogg_the_Thundering.png", source:item("nidh-gg-the-thundering") },
    { slug:"nidhogg-primal", type:"item", category:"weapon", en:"Nidhögg the Primal", ru:"Нидхёгг Первобытный", descriptionEn:"Jade-infused Nidhögg.", descriptionRu:"Нидхёгг, усиленный нефритом.", imageFile:"Nidhogg_the_Primal.png", source:item("nidh-gg-the-primal") },

    { slug:"berserkir-axes", type:"item", category:"weapon", en:"Berserkir Axes", ru:"Топоры берсерка", descriptionEn:"A fast dual-wielded pair of Flametal axes.", descriptionRu:"Быстрая парная пара топоров из фламеталла.", imageFile:"Berserkir_axes.png", source:item("berserkir-axes") },
    { slug:"bleeding-berserkir-axes", type:"item", category:"weapon", en:"Bleeding Berserkir Axes", ru:"Кровоточащие топоры берсерка", descriptionEn:"Bloodstone-infused Berserkir Axes.", descriptionRu:"Топоры берсерка с кровавым камнем.", imageFile:"Bleeding_Berserkir_axes.png", source:item("bleeding-berserkir-axes") },
    { slug:"thundering-berserkir-axes", type:"item", category:"weapon", en:"Thundering Berserkir Axes", ru:"Громовые топоры берсерка", descriptionEn:"Iolite-infused Berserkir Axes.", descriptionRu:"Топоры берсерка с иолитом.", imageFile:"Thundering_Berserkir_axes.png", source:item("thundering-berserkir-axes") },
    { slug:"primal-berserkir-axes", type:"item", category:"weapon", en:"Primal Berserkir Axes", ru:"Первобытные топоры берсерка", descriptionEn:"Jade-infused Berserkir Axes.", descriptionRu:"Топоры берсерка с нефритом.", imageFile:"Primal_Berserkir_axes.png", source:item("primal-berserkir-axes") },

    { slug:"slayer", type:"item", category:"weapon", en:"Slayer", ru:"Убийца", descriptionEn:"A massive two-handed Flametal greatsword.", descriptionRu:"Массивный двуручный меч из фламеталла.", imageFile:"Slayer.png", source:item("slayer") },
    { slug:"brutal-slayer", type:"item", category:"weapon", en:"Brutal Slayer", ru:"Жестокий Убийца", descriptionEn:"Bloodstone-infused Slayer.", descriptionRu:"Убийца с кровавым камнем.", imageFile:"Brutal_Slayer.png", source:item("brutal-slayer") },
    { slug:"scourging-slayer", type:"item", category:"weapon", en:"Scourging Slayer", ru:"Карающий Убийца", descriptionEn:"Iolite-infused Slayer.", descriptionRu:"Убийца с иолитом.", imageFile:"Scourging_Slayer.png", source:item("scourging-slayer") },
    { slug:"primal-slayer", type:"item", category:"weapon", en:"Primal Slayer", ru:"Первобытный Убийца", descriptionEn:"Jade-infused Slayer.", descriptionRu:"Убийца с нефритом.", imageFile:"Primal_Slayer.png", source:item("primal-slayer") },

    { slug:"splitnir", type:"item", category:"weapon", en:"Splitnir", ru:"Сплитнир", descriptionEn:"A Flametal spear made for late-game combat.", descriptionRu:"Фламеталловое копьё поздней игры.", imageFile:"Splitnir.png", source:item("splitnir") },
    { slug:"splitnir-bleeding", type:"item", category:"weapon", en:"Splitnir the Bleeding", ru:"Сплитнир Кровоточащий", descriptionEn:"Bloodstone-infused Splitnir.", descriptionRu:"Сплитнир с кровавым камнем.", imageFile:"Splitnir_the_Bleeding.png", source:item("splitnir-the-bleeding") },
    { slug:"splitnir-storming", type:"item", category:"weapon", en:"Splitnir the Storming", ru:"Сплитнир Грозовой", descriptionEn:"Iolite-infused Splitnir.", descriptionRu:"Сплитнир с иолитом.", imageFile:"Splitnir_the_Storming.png", source:item("splitnir-the-storming") },
    { slug:"splitnir-primal", type:"item", category:"weapon", en:"Splitnir the Primal", ru:"Сплитнир Первобытный", descriptionEn:"Jade-infused Splitnir.", descriptionRu:"Сплитнир с нефритом.", imageFile:"Splitnir_the_Primal.png", source:item("splitnir-the-primal") },

    { slug:"ripper", type:"item", category:"weapon", en:"Ripper", ru:"Потрошитель", descriptionEn:"A heavy Ashlands crossbow.", descriptionRu:"Тяжёлый арбалет Пепельных земель.", imageFile:"Ripper.png", source:item("ripper") },
    { slug:"wound-ripper", type:"item", category:"weapon", en:"Wound Ripper", ru:"Кровавый Потрошитель", descriptionEn:"Bloodstone-infused Ripper.", descriptionRu:"Потрошитель с кровавым камнем.", imageFile:"Wound_Ripper.png", source:item("wound-ripper") },
    { slug:"storm-ripper", type:"item", category:"weapon", en:"Storm Ripper", ru:"Штормовой Потрошитель", descriptionEn:"Iolite-infused Ripper.", descriptionRu:"Потрошитель с иолитом.", imageFile:"Storm_Ripper.png", source:item("storm-ripper") },
    { slug:"root-ripper", type:"item", category:"weapon", en:"Root Ripper", ru:"Корневой Потрошитель", descriptionEn:"Jade-infused Ripper.", descriptionRu:"Потрошитель с нефритом.", imageFile:"Root_Ripper.png", source:item("root-ripper") },

    { slug:"ash-fang", type:"item", category:"weapon", en:"Ash Fang", ru:"Пепельный клык", descriptionEn:"A powerful Ashlands bow.", descriptionRu:"Мощный лук Пепельных земель.", imageFile:"Ash_Fang.png", source:item("ash-fang") },
    { slug:"blood-fang", type:"item", category:"weapon", en:"Blood Fang", ru:"Кровавый клык", descriptionEn:"Bloodstone-infused Ash Fang.", descriptionRu:"Пепельный клык с кровавым камнем.", imageFile:"Blood_Fang.png", source:item("blood-fang") },
    { slug:"storm-fang", type:"item", category:"weapon", en:"Storm Fang", ru:"Штормовой клык", descriptionEn:"Iolite-infused Ash Fang.", descriptionRu:"Пепельный клык с иолитом.", imageFile:"Storm_Fang.png", source:item("storm-fang") },
    { slug:"root-fang", type:"item", category:"weapon", en:"Root Fang", ru:"Корневой клык", descriptionEn:"Jade-infused Ash Fang.", descriptionRu:"Пепельный клык с нефритом.", imageFile:"Root_Fang.png", source:item("root-fang") },

    { slug:"flametal-mace", type:"item", category:"weapon", en:"Flametal Mace", ru:"Фламеталловая булава", descriptionEn:"A heavy mace forged from Flametal.", descriptionRu:"Тяжёлая булава из фламеталла.", imageFile:"Flametal_mace.png", source:item("flametal-mace") },
    { slug:"bloodgeon", type:"item", category:"weapon", en:"Bloodgeon", ru:"Кровогеон", descriptionEn:"Bloodstone variant of the Flametal Mace.", descriptionRu:"Вариант фламеталловой булавы с кровавым камнем.", imageFile:"Bloodgeon.png", source:item("bloodgeon") },
    { slug:"storm-star", type:"item", category:"weapon", en:"Storm Star", ru:"Штормовая звезда", descriptionEn:"Iolite variant of the Flametal Mace.", descriptionRu:"Вариант фламеталловой булавы с иолитом.", imageFile:"Storm_Star.png", source:item("storm-star") },
    { slug:"klossen", type:"item", category:"weapon", en:"Klossen", ru:"Клоссен", descriptionEn:"Jade variant of the Flametal Mace.", descriptionRu:"Вариант фламеталловой булавы с нефритом.", imageFile:"Klossen.png", source:item("klossen") },

    { slug:"flametal-shield", type:"item", category:"weapon", en:"Flametal Shield", ru:"Фламеталловый щит", descriptionEn:"The strongest round shield that can still parry.", descriptionRu:"Сильнейший круглый щит, способный парировать.", imageFile:"Flametal_shield.png", source:item("flametal-shield") },
    { slug:"flametal-tower-shield", type:"item", category:"weapon", en:"Flametal Tower Shield", ru:"Фламеталловый башенный щит", descriptionEn:"A massive shield with exceptional block power.", descriptionRu:"Массивный щит с исключительной силой блока.", imageFile:"Flametal_tower_shield.png", source:item("flametal-tower-shield") },
    { slug:"dyrnwyn", type:"item", category:"weapon", en:"Dyrnwyn", ru:"Дюрнвин", descriptionEn:"A unique flaming sword restored from three fragments.", descriptionRu:"Уникальный пылающий меч из трёх фрагментов.", imageFile:"Dyrnwyn.png", source:item("dyrnwyn") },

    { slug:"staff-of-fracturing", type:"item", category:"magic", en:"Staff of Fracturing", ru:"Посох раскола", descriptionEn:"An elemental staff that bursts into fiery fragments.", descriptionRu:"Стихийный посох, разбрасывающий огненные осколки.", imageFile:"Staff_of_Fracturing.png", source:item("staff-of-fracturing") },
    { slug:"dundr", type:"item", category:"magic", en:"Dundr", ru:"Дундр", descriptionEn:"A short-range lightning staff.", descriptionRu:"Магический посох ближней молнии.", imageFile:"Dundr.png", source:item("dundr") },
    { slug:"staff-of-the-wild", type:"item", category:"magic", en:"Staff of the Wild", ru:"Посох дикой природы", descriptionEn:"A staff that summons attacking roots.", descriptionRu:"Посох, призывающий атакующие корни.", imageFile:"Staff_of_the_Wild.png", source:item("staff-of-the-wild") },
    { slug:"trollstav", type:"item", category:"magic", en:"Trollstav", ru:"Тролльстав", descriptionEn:"A blood-magic staff that summons a raging troll.", descriptionRu:"Посох кровавой магии, призывающий яростного тролля.", imageFile:"Trollstav.png", source:item("trollstav") },

    { slug:"flametal-helmet", type:"item", category:"armor", en:"Flametal Helmet", ru:"Фламеталловый шлем", descriptionEn:"Heavy Ashlands helmet with heat resistance.", descriptionRu:"Тяжёлый шлем Пепельных земель с сопротивлением жаре.", imageFile:"Flametal_helmet.png", source:item("flametal-helmet") },
    { slug:"flametal-breastplate", type:"item", category:"armor", en:"Flametal Breastplate", ru:"Фламеталловый нагрудник", descriptionEn:"Heavy Flametal body armour.", descriptionRu:"Тяжёлая броня корпуса из фламеталла.", imageFile:"Flametal_breastplate.png", source:item("flametal-breastplate") },
    { slug:"flametal-greaves", type:"item", category:"armor", en:"Flametal Greaves", ru:"Фламеталловые поножи", descriptionEn:"Heavy Flametal leg armour.", descriptionRu:"Тяжёлая защита ног из фламеталла.", imageFile:"Flametal_greaves.png", source:item("flametal-greaves") },
    { slug:"hood-of-ask", type:"item", category:"armor", en:"Hood of Ask", ru:"Капюшон Аска", descriptionEn:"Part of the stamina-efficient Ask set.", descriptionRu:"Часть выносливого комплекта Аска.", imageFile:"Hood_of_Ask.png", source:item("hood-of-ask") },
    { slug:"breastplate-of-ask", type:"item", category:"armor", en:"Breastplate of Ask", ru:"Нагрудник Аска", descriptionEn:"Part of the stamina-efficient Ask set.", descriptionRu:"Часть выносливого комплекта Аска.", imageFile:"Breastplate_of_Ask.png", source:item("breastplate-of-ask") },
    { slug:"trousers-of-ask", type:"item", category:"armor", en:"Trousers of Ask", ru:"Штаны Аска", descriptionEn:"Part of the stamina-efficient Ask set.", descriptionRu:"Часть выносливого комплекта Аска.", imageFile:"Trousers_of_Ask.png", source:item("trousers-of-ask") },
    { slug:"hood-of-embla", type:"item", category:"armor", en:"Hood of Embla", ru:"Капюшон Эмблы", descriptionEn:"Ashlands mage hood with strong eitr regeneration.", descriptionRu:"Магический капюшон Пепельных земель с регенерацией эйтра.", imageFile:"Hood_of_Embla.png", source:item("hood-of-embla") },
    { slug:"robes-of-embla", type:"item", category:"armor", en:"Robes of Embla", ru:"Одеяния Эмблы", descriptionEn:"Ashlands mage body armour.", descriptionRu:"Магическая броня корпуса Пепельных земель.", imageFile:"Robes_of_Embla.png", source:item("robes-of-embla") },
    { slug:"trousers-of-embla", type:"item", category:"armor", en:"Trousers of Embla", ru:"Штаны Эмблы", descriptionEn:"Ashlands mage leg armour.", descriptionRu:"Магическая защита ног Пепельных земель.", imageFile:"Trousers_of_Embla.png", source:item("trousers-of-embla") },
    { slug:"ashen-cape", type:"item", category:"armor", en:"Ashen Cape", ru:"Пепельный плащ", descriptionEn:"A combat cape woven with metal thread.", descriptionRu:"Боевой плащ, сотканный с металлическими нитями.", imageFile:"Ashen_cape.png", source:item("ashen-cape") },
    { slug:"asksvin-cloak", type:"item", category:"armor", en:"Asksvin Cloak", ru:"Плащ асксвина", descriptionEn:"A wind-catching cloak for fast exploration.", descriptionRu:"Плащ, использующий ветер для быстрого передвижения.", imageFile:"Asksvin_cloak.png", source:item("asksvin-cloak") },

    { slug:"fiery-svinstew", type:"item", category:"food", en:"Fiery Svinstew", ru:"Огненное рагу из асксвина", descriptionEn:"A high-health Ashlands stew.", descriptionRu:"Сытное рагу Пепельных земель на здоровье.", imageFile:"Fiery_Svinstew.png", source:item("fiery-svinstew") },
    { slug:"uncooked-roasted-crust-pie", type:"item", category:"food", en:"Uncooked Roasted Crust Pie", ru:"Сырой хрустящий пирог", descriptionEn:"Prepared pie ready for the stone oven.", descriptionRu:"Подготовленный пирог для каменной печи.", imageFile:"Roasted_Crust_Pie_Uncooked.png", source:item("uncooked-roasted-crust-pie") },
    { slug:"roasted-crust-pie", type:"item", category:"food", en:"Roasted Crust Pie", ru:"Хрустящий печёный пирог", descriptionEn:"A stamina-focused baked Ashlands pie.", descriptionRu:"Запечённый пирог Пепельных земель на выносливость.", imageFile:"Roasted_Crust_Pie.png", source:item("roasted-crust-pie") },

    { slug:"basalt-bomb-x5", type:"item", category:"weapon", en:"Basalt Bomb ×5", ru:"Базальтовая бомба ×5", descriptionEn:"Five bombs that create temporary basalt platforms on lava.", descriptionRu:"Пять бомб, создающих временные базальтовые платформы на лаве.", imageFile:"Basalt_bomb.png", source:item("basalt-bomb") },
    { slug:"explosive-payload-x5", type:"item", category:"consumable", en:"Explosive Payload ×5", ru:"Взрывной заряд ×5", descriptionEn:"Catapult ammunition for siege warfare.", descriptionRu:"Боеприпас для катапульты при осаде.", imageFile:"Explosive_payload.png", source:item("explosive-payload") }
  ],
  recipes: [
    { item:"flametal", station:"blast-furnace", ingredients:[["flametal-ore",1]] },

    { item:"nidhogg", station:"black-forge", level:3, ingredients:[["charred-bone",3],["flametal",12],["asksvin-hide",2]] },
    { item:"nidhogg-bleeding", station:"black-forge", level:4, ingredients:[["nidhogg",1],["flametal",6],["bloodstone",1]] },
    { item:"nidhogg-thundering", station:"black-forge", level:4, ingredients:[["nidhogg",1],["flametal",6],["iolite",1]] },
    { item:"nidhogg-primal", station:"black-forge", level:4, ingredients:[["nidhogg",1],["flametal",6],["jade",1]] },

    { item:"berserkir-axes", station:"black-forge", level:3, ingredients:[["charred-bone",15],["flametal",24],["asksvin-hide",3]] },
    { item:"bleeding-berserkir-axes", station:"black-forge", level:4, ingredients:[["berserkir-axes",1],["flametal",5],["bloodstone",1]] },
    { item:"thundering-berserkir-axes", station:"black-forge", level:4, ingredients:[["berserkir-axes",1],["flametal",5],["iolite",1]] },
    { item:"primal-berserkir-axes", station:"black-forge", level:4, ingredients:[["berserkir-axes",1],["flametal",5],["jade",1]] },

    { item:"slayer", station:"black-forge", level:3, ingredients:[["flametal",30],["asksvin-hide",5],["morgen-sinew",3]] },
    { item:"brutal-slayer", station:"black-forge", level:4, ingredients:[["slayer",1],["flametal",15],["bloodstone",1]] },
    { item:"scourging-slayer", station:"black-forge", level:4, ingredients:[["slayer",1],["flametal",15],["iolite",1]] },
    { item:"primal-slayer", station:"black-forge", level:4, ingredients:[["slayer",1],["flametal",15],["jade",1]] },

    { item:"splitnir", station:"black-forge", level:3, ingredients:[["ashwood",10],["flametal",6],["asksvin-hide",2],["bonemaw-tooth",3]] },
    { item:"splitnir-bleeding", station:"black-forge", level:4, ingredients:[["splitnir",1],["flametal",6],["bloodstone",1]] },
    { item:"splitnir-storming", station:"black-forge", level:4, ingredients:[["splitnir",1],["flametal",6],["iolite",1]] },
    { item:"splitnir-primal", station:"black-forge", level:4, ingredients:[["splitnir",1],["flametal",6],["jade",1]] },

    { item:"ripper", station:"black-forge", level:3, ingredients:[["ashwood",10],["flametal",8],["morgen-sinew",2],["bonemaw-tooth",4]] },
    { item:"wound-ripper", station:"black-forge", level:4, ingredients:[["ripper",1],["flametal",8],["bloodstone",1]] },
    { item:"storm-ripper", station:"black-forge", level:4, ingredients:[["ripper",1],["flametal",8],["iolite",1]] },
    { item:"root-ripper", station:"black-forge", level:4, ingredients:[["ripper",1],["flametal",8],["jade",1]] },

    { item:"ash-fang", station:"black-forge", level:3, ingredients:[["ashwood",10],["charred-bone",16],["flametal",5],["bonemaw-tooth",5]] },
    { item:"blood-fang", station:"black-forge", level:4, ingredients:[["ash-fang",1],["flametal",5],["bloodstone",1]] },
    { item:"storm-fang", station:"black-forge", level:4, ingredients:[["ash-fang",1],["flametal",5],["iolite",1]] },
    { item:"root-fang", station:"black-forge", level:4, ingredients:[["ash-fang",1],["flametal",5],["jade",1]] },

    { item:"flametal-mace", station:"black-forge", level:3, ingredients:[["charred-bone",10],["flametal",15],["sulfur",5],["asksvin-hide",3]] },
    { item:"bloodgeon", station:"black-forge", level:4, ingredients:[["flametal-mace",1],["flametal",8],["bloodstone",1]] },
    { item:"storm-star", station:"black-forge", level:4, ingredients:[["flametal-mace",1],["flametal",8],["iolite",1]] },
    { item:"klossen", station:"black-forge", level:4, ingredients:[["flametal-mace",1],["flametal",8],["jade",1]] },

    { item:"flametal-shield", station:"black-forge", level:3, ingredients:[["ashwood",10],["flametal",8],["asksvin-hide",2]] },
    { item:"flametal-tower-shield", station:"black-forge", level:3, ingredients:[["ashwood",15],["flametal",10],["asksvin-hide",5]] },
    { item:"dyrnwyn", station:"black-forge", level:4, ingredients:[["dyrnwyn-hilt-fragment",1],["dyrnwyn-blade-fragment",1],["dyrnwyn-tip-fragment",1],["flametal",20],["bloodstone",1]] },

    { item:"staff-of-fracturing", station:"galdr-table", level:2, ingredients:[["charred-bone",15],["ashwood",5],["proustite-powder",8]] },
    { item:"dundr", station:"galdr-table", level:2, ingredients:[["ashwood",10],["flametal",4],["celestial-feather",3],["bloodstone",1]] },
    { item:"staff-of-the-wild", station:"galdr-table", level:2, ingredients:[["ashwood",15],["fiddlehead",10],["celestial-feather",3],["jade",1]] },
    { item:"trollstav", station:"galdr-table", level:2, ingredients:[["charred-bone",15],["troll-trophy",1],["flametal",3],["bloodstone",1]] },

    { item:"flametal-helmet", station:"black-forge", level:3, ingredients:[["flametal",16],["asksvin-hide",3],["charred-bone",2],["refined-eitr",4]] },
    { item:"flametal-breastplate", station:"black-forge", level:3, ingredients:[["flametal",20],["asksvin-hide",3],["charred-bone",5],["morgen-heart",1]] },
    { item:"flametal-greaves", station:"black-forge", level:3, ingredients:[["flametal",20],["asksvin-hide",3],["charred-bone",5]] },

    { item:"hood-of-ask", station:"black-forge", level:3, ingredients:[["linen-thread",15],["lox-pelt",4],["asksvin-hide",10]] },
    { item:"breastplate-of-ask", station:"black-forge", level:3, ingredients:[["linen-thread",15],["lox-pelt",4],["asksvin-hide",10]] },
    { item:"trousers-of-ask", station:"black-forge", level:3, ingredients:[["linen-thread",15],["lox-pelt",4],["asksvin-hide",10]] },

    { item:"hood-of-embla", station:"galdr-table", level:2, ingredients:[["linen-thread",16],["refined-eitr",15],["asksvin-hide",2]] },
    { item:"robes-of-embla", station:"galdr-table", level:2, ingredients:[["linen-thread",20],["refined-eitr",20],["asksvin-hide",10],["flametal",5]] },
    { item:"trousers-of-embla", station:"galdr-table", level:2, ingredients:[["linen-thread",20],["refined-eitr",20],["asksvin-hide",10]] },

    { item:"ashen-cape", station:"black-forge", level:3, ingredients:[["asksvin-hide",6],["morgen-sinew",2],["flametal",5]] },
    { item:"asksvin-cloak", station:"galdr-table", level:2, ingredients:[["asksvin-hide",6],["morgen-sinew",2]] },

    { item:"fiery-svinstew", station:"cauldron", level:5, ingredients:[["asksvin-tail",1],["vineberry-cluster",2],["smoke-puff",1]] },
    { item:"uncooked-roasted-crust-pie", station:"food-preparation-table", ingredients:[["vineberry-cluster",2],["volture-egg",1],["barley-flour",4]] },
    { item:"roasted-crust-pie", station:"stone-oven", ingredients:[["uncooked-roasted-crust-pie",1]] },

    { item:"basalt-bomb-x5", station:"workbench", output:5, ingredients:[["asksvin-hide",1],["asksvin-bladder",1],["proustite-powder",3]] },
    { item:"explosive-payload-x5", station:"workbench", output:5, ingredients:[["asksvin-hide",2],["sulfur",2],["proustite-powder",3]] }
  ],
  upgrades: [
    { item:"nidhogg", level:2, stationLevel:4, ingredients:[["flametal",10],["asksvin-hide",2]] },
    { item:"nidhogg", level:3, stationLevel:5, ingredients:[["flametal",20],["asksvin-hide",4]] },
    { item:"nidhogg", level:4, stationLevel:6, ingredients:[["flametal",40],["asksvin-hide",8]] },

    { item:"berserkir-axes", level:2, stationLevel:4, ingredients:[["flametal",15],["asksvin-hide",1]] },
    { item:"berserkir-axes", level:3, stationLevel:5, ingredients:[["flametal",30],["asksvin-hide",2]] },
    { item:"berserkir-axes", level:4, stationLevel:6, ingredients:[["flametal",60],["asksvin-hide",4]] },

    { item:"slayer", level:2, stationLevel:4, ingredients:[["flametal",15],["asksvin-hide",5],["morgen-sinew",3]] },
    { item:"slayer", level:3, stationLevel:5, ingredients:[["flametal",30],["asksvin-hide",10],["morgen-sinew",6]] },
    { item:"slayer", level:4, stationLevel:6, ingredients:[["flametal",60],["asksvin-hide",20],["morgen-sinew",12]] },

    { item:"splitnir", level:2, stationLevel:4, ingredients:[["ashwood",5],["flametal",6],["asksvin-hide",1],["bonemaw-tooth",3]] },
    { item:"splitnir", level:3, stationLevel:5, ingredients:[["ashwood",10],["flametal",12],["asksvin-hide",2],["bonemaw-tooth",6]] },
    { item:"splitnir", level:4, stationLevel:6, ingredients:[["ashwood",20],["flametal",24],["asksvin-hide",4],["bonemaw-tooth",12]] },

    { item:"ripper", level:2, stationLevel:4, ingredients:[["ashwood",5],["flametal",4],["morgen-sinew",1],["bonemaw-tooth",4]] },
    { item:"ripper", level:3, stationLevel:5, ingredients:[["ashwood",10],["flametal",8],["morgen-sinew",2],["bonemaw-tooth",8]] },
    { item:"ripper", level:4, stationLevel:6, ingredients:[["ashwood",20],["flametal",16],["morgen-sinew",4],["bonemaw-tooth",16]] },

    { item:"ash-fang", level:2, stationLevel:4, ingredients:[["ashwood",5],["charred-bone",10],["flametal",5],["bonemaw-tooth",5]] },
    { item:"ash-fang", level:3, stationLevel:5, ingredients:[["ashwood",10],["charred-bone",20],["flametal",10],["bonemaw-tooth",10]] },
    { item:"ash-fang", level:4, stationLevel:6, ingredients:[["ashwood",20],["charred-bone",40],["flametal",20],["bonemaw-tooth",20]] },

    { item:"flametal-mace", level:2, stationLevel:4, ingredients:[["charred-bone",5],["flametal",8],["sulfur",3],["asksvin-hide",2]] },
    { item:"flametal-mace", level:3, stationLevel:5, ingredients:[["charred-bone",10],["flametal",16],["sulfur",6],["asksvin-hide",4]] },
    { item:"flametal-mace", level:4, stationLevel:6, ingredients:[["charred-bone",20],["flametal",32],["sulfur",12],["asksvin-hide",8]] },

    { item:"flametal-shield", level:2, stationLevel:4, ingredients:[["ashwood",10],["flametal",4],["asksvin-hide",2]] },
    { item:"flametal-shield", level:3, stationLevel:5, ingredients:[["ashwood",20],["flametal",8],["asksvin-hide",4]] },
    { item:"flametal-tower-shield", level:2, stationLevel:4, ingredients:[["ashwood",10],["flametal",4],["asksvin-hide",2]] },
    { item:"flametal-tower-shield", level:3, stationLevel:5, ingredients:[["ashwood",20],["flametal",8],["asksvin-hide",4]] },

    { item:"dyrnwyn", level:2, stationLevel:5, ingredients:[["flametal",10],["bloodstone",1]] },
    { item:"dyrnwyn", level:3, stationLevel:6, ingredients:[["flametal",20],["bloodstone",2]] },
    { item:"dyrnwyn", level:4, stationLevel:7, ingredients:[["flametal",40],["bloodstone",4]] },

    { item:"staff-of-fracturing", level:2, stationLevel:3, ingredients:[["charred-bone",5],["ashwood",3],["proustite-powder",1]] },
    { item:"staff-of-fracturing", level:3, stationLevel:4, ingredients:[["charred-bone",10],["ashwood",6],["proustite-powder",2]] },
    { item:"staff-of-fracturing", level:4, stationLevel:5, ingredients:[["charred-bone",20],["ashwood",12],["proustite-powder",4]] },
    { item:"dundr", level:2, stationLevel:3, ingredients:[["ashwood",5],["flametal",2],["celestial-feather",3],["bloodstone",1]] },
    { item:"dundr", level:3, stationLevel:4, ingredients:[["ashwood",10],["flametal",4],["celestial-feather",6],["bloodstone",2]] },
    { item:"dundr", level:4, stationLevel:5, ingredients:[["ashwood",20],["flametal",8],["celestial-feather",12],["bloodstone",4]] },
    { item:"staff-of-the-wild", level:2, stationLevel:3, ingredients:[["ashwood",5],["fiddlehead",2],["celestial-feather",3],["jade",1]] },
    { item:"staff-of-the-wild", level:3, stationLevel:4, ingredients:[["ashwood",10],["fiddlehead",4],["celestial-feather",6],["jade",2]] },
    { item:"staff-of-the-wild", level:4, stationLevel:5, ingredients:[["ashwood",20],["fiddlehead",8],["celestial-feather",12],["jade",4]] },
    { item:"trollstav", level:2, stationLevel:3, ingredients:[["charred-bone",5],["troll-trophy",1],["flametal",3],["bloodstone",1]] },
    { item:"trollstav", level:3, stationLevel:4, ingredients:[["charred-bone",10],["troll-trophy",2],["flametal",6],["bloodstone",2]] },
    { item:"trollstav", level:4, stationLevel:5, ingredients:[["charred-bone",20],["troll-trophy",4],["flametal",12],["bloodstone",4]] },

    ...["flametal-helmet"].flatMap(itemSlug => [
      { item:itemSlug, level:2, stationLevel:4, ingredients:[["flametal",8],["asksvin-hide",1],["refined-eitr",2]] as Array<[string,number]> },
      { item:itemSlug, level:3, stationLevel:5, ingredients:[["flametal",16],["asksvin-hide",2],["refined-eitr",4]] as Array<[string,number]> },
      { item:itemSlug, level:4, stationLevel:6, ingredients:[["flametal",24],["asksvin-hide",3],["refined-eitr",6]] as Array<[string,number]> }
    ]),
    ...["flametal-breastplate","flametal-greaves"].flatMap(itemSlug => [
      { item:itemSlug, level:2, stationLevel:4, ingredients:[["flametal",10],["asksvin-hide",1]] as Array<[string,number]> },
      { item:itemSlug, level:3, stationLevel:5, ingredients:[["flametal",20],["asksvin-hide",2]] as Array<[string,number]> },
      { item:itemSlug, level:4, stationLevel:6, ingredients:[["flametal",30],["asksvin-hide",3]] as Array<[string,number]> }
    ]),
    ...["hood-of-ask","breastplate-of-ask","trousers-of-ask"].flatMap(itemSlug => [
      { item:itemSlug, level:2, stationLevel:4, ingredients:[["linen-thread",10],["lox-pelt",2],["asksvin-hide",5]] as Array<[string,number]> },
      { item:itemSlug, level:3, stationLevel:5, ingredients:[["linen-thread",20],["lox-pelt",4],["asksvin-hide",10]] as Array<[string,number]> },
      { item:itemSlug, level:4, stationLevel:6, ingredients:[["linen-thread",30],["lox-pelt",6],["asksvin-hide",15]] as Array<[string,number]> }
    ]),
    { item:"hood-of-embla", level:2, stationLevel:3, ingredients:[["linen-thread",8],["refined-eitr",5]] },
    { item:"hood-of-embla", level:3, stationLevel:4, ingredients:[["linen-thread",16],["refined-eitr",10]] },
    { item:"hood-of-embla", level:4, stationLevel:5, ingredients:[["linen-thread",24],["refined-eitr",15]] },
    { item:"robes-of-embla", level:2, stationLevel:3, ingredients:[["linen-thread",10],["refined-eitr",5],["flametal",2]] },
    { item:"robes-of-embla", level:3, stationLevel:4, ingredients:[["linen-thread",20],["refined-eitr",10],["flametal",4]] },
    { item:"robes-of-embla", level:4, stationLevel:5, ingredients:[["linen-thread",30],["refined-eitr",15],["flametal",6]] },
    { item:"trousers-of-embla", level:2, stationLevel:3, ingredients:[["linen-thread",10],["refined-eitr",5]] },
    { item:"trousers-of-embla", level:3, stationLevel:4, ingredients:[["linen-thread",20],["refined-eitr",10]] },
    { item:"trousers-of-embla", level:4, stationLevel:5, ingredients:[["linen-thread",30],["refined-eitr",15]] },
    ...["ashen-cape","asksvin-cloak"].flatMap(itemSlug => [
      { item:itemSlug, level:2, stationLevel:itemSlug === "ashen-cape" ? 4 : 3, ingredients:[["asksvin-hide",2]] as Array<[string,number]> },
      { item:itemSlug, level:3, stationLevel:itemSlug === "ashen-cape" ? 5 : 4, ingredients:[["asksvin-hide",4]] as Array<[string,number]> },
      { item:itemSlug, level:4, stationLevel:itemSlug === "ashen-cape" ? 6 : 5, ingredients:[["asksvin-hide",8]] as Array<[string,number]> }
    ])
  ],
  stats: [
    ["nidhogg","slash_damage","135"],["berserkir-axes","slash_damage","140"],["slayer","slash_damage","170"],
    ["splitnir","pierce_damage","135"],["ripper","pierce_damage","220"],["ash-fang","pierce_damage","82"],
    ["flametal-mace","blunt_damage","135"],["flametal-shield","block_armor","114"],["flametal-tower-shield","block_armor","140"],
    ["dyrnwyn","slash_damage","145"],["dyrnwyn","fire_damage","10"],
    ["staff-of-fracturing","blunt_damage","12"],["staff-of-fracturing","fire_damage","12"],
    ["dundr","lightning_damage","20"],["staff-of-the-wild","blunt_damage","20"],["staff-of-the-wild","poison_damage","20"],
    ["flametal-helmet","armor","38"],["flametal-breastplate","armor","38"],["flametal-greaves","armor","38"],
    ["hood-of-ask","armor","28"],["breastplate-of-ask","armor","28"],["trousers-of-ask","armor","28"],
    ["hood-of-embla","armor","19"],["robes-of-embla","armor","19"],["trousers-of-embla","armor","19"],
    ["ashen-cape","armor","12"],["asksvin-cloak","armor","1"],
    ["fiery-svinstew","health","95"],["fiery-svinstew","stamina","32"],["fiery-svinstew","duration","25","min"],["fiery-svinstew","healing","6","hp/tick"],
    ["roasted-crust-pie","health","34"],["roasted-crust-pie","stamina","100"],["roasted-crust-pie","duration","30","min"],["roasted-crust-pie","healing","4","hp/tick"]
  ],
  resourceSources: [
    ["flametal-ore","Mine exposed Flametal Ore deposits in the Ashlands. A normal deposit rolls 67% twice and yields 3–8 ore on a successful roll.","Добывайте открытые залежи Фламеталловой руды в Пепельных землях. Обычная залежь делает два броска с шансом 67% и даёт 3–8 руды при успехе.",item("flametal-ore")],
    ["flametal-ore","Mine Flametal Ore from Lava Leviathans in the lava: 2–4 ore rolls of 1 each; the creature begins sinking once mined.","Добывайте Фламеталловую руду с лавовых левиафанов: 2–4 выпадения по 1 руде; после начала добычи левиафан начинает погружаться.",item("flametal-ore")],
    ["flametal-ore","Charred Fortress chests: 16% per roll, 5–6 rolls, yielding 10–20 Flametal Ore.","Сундуки крепостей Обугленных: 16% за бросок, 5–6 бросков, по 10–20 Фламеталловой руды.",item("flametal-ore")],
    ["flametal-ore","Break Dvergr crates in Ashlands tower ruins: 50% per roll across 1–4 rolls, 1 ore each.","Разбивайте ящики двегров в башенных руинах Пепельных земель: 50% за бросок при 1–4 бросках, по 1 руде.",item("flametal-ore")],
    ["flametal-ore","Magmafish can yield 1–2 Flametal Ore at 23%.","Магмовая рыба может дать 1–2 Фламеталловой руды с шансом 23%.",item("flametal-ore")],
    ["flametal","Smelt Flametal Ore in a Blast Furnace.","Переплавьте Фламеталловую руду в доменной печи.",item("flametal")],
    ["asksvin-hide","Adult Asksvin always drop 2–3 Asksvin Hide.","Взрослые асксвины гарантированно роняют 2–3 шкуры.",item("asksvin-hide")],
    ["asksvin-hide","Asksvin Hatchlings have a 20% chance to drop 1 Asksvin Hide.","Детёныши асксвина имеют 20% шанс уронить 1 шкуру.",item("asksvin-hide")],
    ["asksvin-bladder","Adult Asksvin always drop 1 Asksvin Bladder.","Взрослые асксвины гарантированно роняют 1 пузырь.",item("asksvin-bladder")],
    ["asksvin-bladder","Asksvin Hatchlings have a 20% chance to drop 1 Asksvin Bladder.","Детёныши асксвина имеют 20% шанс уронить 1 пузырь.",item("asksvin-bladder")],
    ["asksvin-tail","Adult Asksvin always drop 2–3 Asksvin Tail.","Взрослые асксвины гарантированно роняют 2–3 хвоста.",item("asksvin-tail")],
    ["asksvin-tail","Asksvin Hatchlings have a 20% chance to drop 1 Asksvin Tail.","Детёныши асксвина имеют 20% шанс уронить 1 хвост.",item("asksvin-tail")],
    ["charred-bone","Charred Warriors, Marksmen and Warlocks always drop 1–3 Charred Bone.","Обугленные воины, стрелки и чародеи гарантированно роняют 1–3 Обугленные кости.",item("charred-bone")],
    ["charred-bone","Charred Twitchers and Warlock-summoned Twitchers always drop 1–2 Charred Bone.","Обугленные дёргуны и призванные чародеями дёргуны гарантированно роняют 1–2 Обугленные кости.",item("charred-bone")],
    ["morgen-sinew","Morgen always drop 1–2 Morgen Sinew. Morgens commonly erupt from Putrid Holes and buried fortress areas.","Моргены гарантированно роняют 1–2 сухожилия. Часто они поднимаются из Гнилостных нор и из-под районов разрушенных крепостей.",item("morgen-sinew")],
    ["morgen-heart","Morgen have an 80% chance to drop 1 Morgen Heart.","Морген имеет 80% шанс уронить 1 сердце.",item("morgen-heart")],
    ["bonemaw-tooth","Bonemaw always drops 8–10 Bonemaw Teeth. Hunt them in the boiling sea around the Ashlands.","Костепасть гарантированно роняет 8–10 зубов. Ищите их в кипящем море вокруг Пепельных земель.",item("bonemaw-tooth")],
    ["celestial-feather","Fallen Valkyries always drop 2–4 Celestial Feathers.","Павшие валькирии гарантированно роняют 2–4 Небесных пера.",item("celestial-feather")],
    ["proustite-powder","Lava Blobs always drop 1–2 Proustite Powder.","Лавовые сгустки гарантированно роняют 1–2 Пруститового порошка.",item("proustite-powder")],
    ["proustite-powder","Destroy Unstable Lava Rock for 4–7 drops of 1 Proustite Powder.","Разрушайте Нестабильную лавовую породу: она даёт 4–7 выпадений по 1 Пруститовому порошку.",item("proustite-powder")],
    ["sulfur","Lava Blobs always drop 1–2 Sulfur.","Лавовые сгустки гарантированно роняют 1–2 Серы.",item("sulfur")],
    ["sulfur","Sulfur is also found directly in Ashlands environmental deposits and breakables.","Сера также встречается непосредственно в залежах и разрушаемых объектах Пепельных земель.",item("sulfur")],
    ["bloodstone","Charred Fortress chests: 8% per roll, 5–6 rolls, 1 Bloodstone at a time.","Сундуки крепостей Обугленных: 8% за бросок, 5–6 бросков, по 1 Кровавому камню.",item("bloodstone")],
    ["bloodstone","A gemstone eye inside Mörkhalla in the Deep North contains Bloodstone.","Один из самоцветных глаз в Мёркхалле Глубокого Севера содержит Кровавый камень.",item("bloodstone")],
    ["iolite","Charred Fortress chests: 8% per roll, 5–6 rolls, 1 Iolite at a time.","Сундуки крепостей Обугленных: 8% за бросок, 5–6 бросков, по 1 Иолиту.",item("iolite")],
    ["iolite","A gemstone eye inside Mörkhalla in the Deep North contains Iolite.","Один из самоцветных глаз в Мёркхалле Глубокого Севера содержит Иолит.",item("iolite")],
    ["jade","Charred Fortress chests: 8% per roll, 5–6 rolls, 1 Jade at a time.","Сундуки крепостей Обугленных: 8% за бросок, 5–6 бросков, по 1 Нефриту.",item("jade")],
    ["jade","A gemstone eye inside Mörkhalla in the Deep North contains Jade.","Один из самоцветных глаз в Мёркхалле Глубокого Севера содержит Нефрит.",item("jade")],
    ["flametal-battle-idol","Very rare loot in Ashlands Morgen Hole chests and Charred Fortress chests.","Очень редкая добыча из сундуков Гнилостных нор и крепостей Обугленных в Пепельных землях.",item("flametal-battle-idol")],
    ["flametal-battle-idol","Later alternatives include Deep North village/hut and ship-setting chests, shipwrecks and Mörkhalla Ancient/Jotun chests.","Поздние альтернативы: сундуки деревень/хижин и каменных кораблей Глубокого Севера, кораблекрушения и Древние/йотунские сундуки Мёркхаллы.",item("flametal-battle-idol")],
    ["flametal-protection-idol","Very rare loot in Ashlands Morgen Hole chests, Charred Fortress chests and breakable Ashlands pots.","Очень редкая добыча из сундуков Гнилостных нор, крепостей Обугленных и разрушаемых горшков Пепельных земель.",item("flametal-protection-idol")],
    ["flametal-protection-idol","Later alternatives include Deep North village/hut and ship-setting chests, shipwrecks and Mörkhalla Ancient/Jotun chests.","Поздние альтернативы: сундуки деревень/хижин и каменных кораблей Глубокого Севера, кораблекрушения и Древние/йотунские сундуки Мёркхаллы.",item("flametal-protection-idol")],
    ["ashwood","Chop scorched Ashlands trees and break fallen branches, bushes and tree stumps.","Рубите обгоревшие деревья Пепельных земель и ломайте упавшие ветви, кусты и пни.",item("ashwood")],
    ["ashwood","Morgen Hole chests roll Ashwood at 19% per roll across 2–4 rolls, yielding 1–2.","Сундуки Гнилостных нор дают Ясеневую древесину с шансом 19% за бросок при 2–4 бросках, по 1–2.",item("ashwood")],
    ["ashwood","Break Dvergr crates in Ashlands tower ruins: 50% per roll across 1–4 rolls, 1 Ashwood each.","Разбивайте ящики двегров в башенных руинах: 50% за бросок при 1–4 бросках, по 1 Ясеневой древесине.",item("ashwood")],
    ["bonemaw-meat","Bonemaw always drops 6–8 Bonemaw Meat.","Костепасть гарантированно роняет 6–8 мяса.",item("bonemaw-meat")],
    ["vineberry-cluster","Harvest Vineberry vines in the Ashlands; Vineberry Seeds are found on Ashlands vines and ruins.","Собирайте гроздья с лоз Пепельных земель; семена находятся на лозах и в руинах.",item("vineberry-cluster")],
    ["smoke-puff","Pick Smoke Puffs in the Ashlands, especially around ruined structures.","Собирайте Дымчатые грибы в Пепельных землях, особенно возле руин.",item("smoke-puff")],
    ["fiddlehead","Pick Fiddleheads around Ashlands ruins and Dvergr/Charred structures.","Собирайте папоротник у руин Пепельных земель и построек двегров/Обугленных.",item("fiddlehead")],
    ["volture-egg","Voltures drop 1–2 Eggs at 50%; hunt them around coastal nests.","Вольтюры роняют 1–2 яйца с шансом 50%; ищите птиц у прибрежных гнёзд.",item("volture-egg")],
    ["volture-meat","Voltures always drop 1 Volture Meat.","Вольтюры гарантированно роняют 1 мясо.",item("volture-meat")],
    ["troll-trophy","Trolls in the Black Forest drop a Troll Trophy at 50%.","Тролли Чёрного леса роняют трофей с шансом 50%.",item("troll-trophy")],
    ["dyrnwyn-hilt-fragment","Defeat Lord Reto in the Tomb of Lord Reto at the third Mysterious Location; he always drops the Hilt Fragment.","Победите Лорда Рето в его гробнице у третьего Таинственного места; он гарантированно роняет фрагмент рукояти.",item("dyrnwyn-hilt-fragment")],
    ["dyrnwyn-blade-fragment","Unique pickup at the second Mysterious Location; the first location's Vegvisir reveals it.","Уникальная находка на втором Таинственном месте; его показывает вегвизир первой точки.",item("dyrnwyn-blade-fragment")],
    ["dyrnwyn-tip-fragment","Unique pickup at the first Mysterious Location. Its Vegvisir is found in some Putrid Holes; break into the sealed Grausten ruin and take it from the altar.","Уникальная находка на первом Таинственном месте. Вегвизир встречается в некоторых Гнилостных норах; разрушьте стену запечатанной граустеновой руины и заберите фрагмент с алтаря.",item("dyrnwyn-tip-fragment")]
  ]
};

export const ensureAshlandsCatalog = (env: Env): Promise<void> => applyCatalogSeed(env, ashlandsSeed);
