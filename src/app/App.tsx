import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ApiError, api } from "./services/api";
import type { Biome, BossSummary, Category, CraftList, CraftListItem, CraftResourceTotal, CreatureDetail, CreatureSummary, FoodSummary, GuideItem, ItemDetail, Locale, ResourceDetail, TamingGuide } from "./types";
import "./styles.css";

type Section = "home" | "search" | "craft" | "favorites" | "food-builder" | "taming" | "bosses" | "biome" | "item" | "resource" | "creature";
type NavSection = "home" | "search" | "craft" | "favorites";
type BiomeView = "items" | "creatures" | "boss";

const text = (locale: Locale, object: { name_en: string; name_ru: string }) => locale === "ru" ? object.name_ru : object.name_en;
const categoryText = (locale: Locale, item: GuideItem) => locale === "ru" ? item.category_name_ru : item.category_name_en;
const categoryIcon = (slug?: string) => ({
  weapon: "⚔", armor: "♜", magic: "✦", tool: "⌁", food: "◆", consumable: "✚",
  trophy: "♛", material: "⬡", building: "⌂", other: "•"
}[slug ?? ""] ?? "•");
const protectedErrorText = (locale: Locale, error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      if (error.message === "Telegram authorization required") {
        return locale === "ru"
          ? "Telegram не передал данные авторизации. Закройте Mini App полностью и откройте заново через кнопку бота."
          : "Telegram did not pass authorization data. Fully close the Mini App and reopen it from the bot button.";
      }
      if (error.message === "Telegram bot token is not configured") {
        return locale === "ru"
          ? "Cloudflare не видит TELEGRAM_BOT_TOKEN. Нужно добавить токен этого бота в Worker Secrets."
          : "Cloudflare cannot see TELEGRAM_BOT_TOKEN. Add this bot token to Worker Secrets.";
      }
      if (error.message === "Telegram authorization signature is invalid") {
        return locale === "ru"
          ? "Telegram-авторизация получена, но сервер не смог подтвердить подпись. Проверьте токен бота в Cloudflare."
          : "Telegram authorization was received, but the server could not validate its signature. Check the bot token in Cloudflare.";
      }
      return `${locale === "ru" ? "Ошибка Telegram-авторизации" : "Telegram authorization error"}: ${error.message}`;
    }
    return `${locale === "ru" ? "Ошибка сервера" : "Server error"} ${error.status}: ${error.message}`;
  }
  return locale === "ru" ? "Не удалось выполнить действие." : "Could not complete the action.";
};

const statLabel = (locale: Locale, key: string) => ({
  damage: locale === "ru" ? "Урон" : "Damage",
  slash_damage: locale === "ru" ? "Рубящий урон" : "Slash damage",
  blunt_damage: locale === "ru" ? "Дробящий урон" : "Blunt damage",
  pierce_damage: locale === "ru" ? "Колющий урон" : "Pierce damage",
  fire_damage: locale === "ru" ? "Огненный урон" : "Fire damage",
  frost_damage: locale === "ru" ? "Морозный урон" : "Frost damage",
  spirit_damage: locale === "ru" ? "Духовный урон" : "Spirit damage",
  poison_damage: locale === "ru" ? "Ядовитый урон" : "Poison damage",
  chop: locale === "ru" ? "Рубка" : "Chop",
  pickaxe: locale === "ru" ? "Урон киркой" : "Pickaxe damage",
  durability: locale === "ru" ? "Прочность" : "Durability",
  stamina_use: locale === "ru" ? "Затраты выносливости" : "Stamina use",
  armor: locale === "ru" ? "Броня" : "Armor",
  block_armor: locale === "ru" ? "Блок" : "Block armor",
  parry_bonus: locale === "ru" ? "Бонус парирования" : "Parry bonus",
  health: locale === "ru" ? "Здоровье" : "Health",
  stamina: locale === "ru" ? "Выносливость" : "Stamina",
  duration: locale === "ru" ? "Длительность" : "Duration",
  healing: locale === "ru" ? "Регенерация" : "Healing",
  health_regen_bonus: locale === "ru" ? "Регенерация здоровья" : "Health regeneration",
  stamina_regen_bonus: locale === "ru" ? "Регенерация выносливости" : "Stamina regeneration",
  adrenaline: locale === "ru" ? "Порог адреналина" : "Adrenaline threshold"
}[key] ?? key.replaceAll("_", " "));

export function App() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [section, setSection] = useState<Section>("home");
  const [biomes, setBiomes] = useState<Biome[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentBiome, setCurrentBiome] = useState<(Biome & { categories: Category[] }) | null>(null);
  const [biomeItems, setBiomeItems] = useState<GuideItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [biomeView, setBiomeView] = useState<BiomeView>("items");
  const [creatures, setCreatures] = useState<CreatureSummary[]>([]);
  const [biomeBoss, setBiomeBoss] = useState<BossSummary | null>(null);
  const [bosses, setBosses] = useState<BossSummary[]>([]);
  const [bossesLoading, setBossesLoading] = useState(false);
  const [foods, setFoods] = useState<FoodSummary[]>([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [selectedFoodSlugs, setSelectedFoodSlugs] = useState<string[]>([]);
  const [foodBiome, setFoodBiome] = useState("all");
  const [foodQuery, setFoodQuery] = useState("");
  const [tamingGuides, setTamingGuides] = useState<TamingGuide[]>([]);
  const [tamingLoading, setTamingLoading] = useState(false);
  const [expandedTaming, setExpandedTaming] = useState<string | null>(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [toolOrigin, setToolOrigin] = useState<Section>("home");
  const [creature, setCreature] = useState<CreatureDetail | null>(null);
  const [creatureOrigin, setCreatureOrigin] = useState<Exclude<Section, "creature">>("biome");
  const [creaturesLoading, setCreaturesLoading] = useState(false);
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [favorites, setFavorites] = useState<GuideItem[]>([]);
  const [craftLists, setCraftLists] = useState<CraftList[]>([]);
  const [activeCraftList, setActiveCraftList] = useState<CraftList | null>(null);
  const [craftItems, setCraftItems] = useState<CraftListItem[]>([]);
  const [craftTotals, setCraftTotals] = useState<CraftResourceTotal[]>([]);
  const [craftListBusy, setCraftListBusy] = useState(false);
  const [detailOrigin, setDetailOrigin] = useState<Exclude<Section, "item" | "resource">>("home");
  const craftListActionLock = useRef(false);

  useEffect(() => {
    window.Telegram?.WebApp?.ready?.();
    window.Telegram?.WebApp?.expand?.();
    api.biomes().then(({ data }) => setBiomes(data)).catch(() => setMessage(locale === "ru" ? "Не удалось загрузить биомы." : "Could not load biomes.")).finally(() => setLoading(false));
    api.favorites().then(({ data }) => setFavorites(data)).catch(() => undefined);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query.trim().length < 2) return setResults([]);
      api.search(query).then(({ data }) => setResults(data)).catch(() => setResults([]));
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3800);
    return () => window.clearTimeout(timer);
  }, [message]);

  const title = useMemo(() => ({
    home: "VALHEIM Guide", search: locale === "ru" ? "Поиск" : "Search", craft: locale === "ru" ? "Крафт" : "Craft",
    favorites: locale === "ru" ? "Избранное" : "Favorites", "food-builder": locale === "ru" ? "Конструктор еды" : "Food Builder", taming: locale === "ru" ? "Приручение" : "Taming", bosses: locale === "ru" ? "Боссы" : "Bosses", biome: text(locale, currentBiome ?? { name_en: "Biome", name_ru: "Биом" }),
    item: item ? text(locale, item) : locale === "ru" ? "Предмет" : "Item",
    resource: resource ? text(locale, resource) : locale === "ru" ? "Ресурс" : "Resource",
    creature: creature ? text(locale, creature) : locale === "ru" ? "Существо" : "Creature"
  })[section], [creature, currentBiome, item, locale, resource, section]);

  const selectedFoods = useMemo(
    () => selectedFoodSlugs.map((slug) => foods.find((food) => food.slug === slug)).filter((food): food is FoodSummary => Boolean(food)),
    [foods, selectedFoodSlugs]
  );
  const foodTotals = useMemo(() => selectedFoods.reduce((total, food) => ({
    health: total.health + food.health,
    stamina: total.stamina + food.stamina,
    eitr: total.eitr + food.eitr
  }), { health: 0, stamina: 0, eitr: 0 }), [selectedFoods]);
  const foodBiomes = useMemo(() => [...new Map(foods.filter((food) => food.biome_slug).map((food) => [
    food.biome_slug!,
    { slug: food.biome_slug!, name_en: food.biome_name_en ?? food.biome_slug!, name_ru: food.biome_name_ru ?? food.biome_slug! }
  ])).values()], [foods]);
  const visibleFoods = useMemo(() => {
    const wanted = foodQuery.trim().toLocaleLowerCase();
    return foods.filter((food) => {
      const biomeMatches = foodBiome === "all" || food.biome_slug === foodBiome;
      const queryMatches = !wanted || food.name_en.toLocaleLowerCase().includes(wanted) || food.name_ru.toLocaleLowerCase().includes(wanted);
      return biomeMatches && queryMatches;
    });
  }, [foodBiome, foodQuery, foods]);

  const openBiome = async (slug: string) => {
    setMessage(""); setSection("biome"); setCurrentBiome(null); setBiomeItems([]); setActiveCategory(undefined);
    setBiomeView("items"); setCreatures([]); setBiomeBoss(null); setCreature(null);
    try {
      const [{ data: biome }, { data: items }] = await Promise.all([api.biome(slug), api.items(slug)]);
      setCurrentBiome(biome); setBiomeItems(items);
    } catch { setMessage(locale === "ru" ? "Не удалось открыть биом." : "Could not open biome."); }
  };

  const selectBiomeView = async (view: BiomeView) => {
    if (!currentBiome || biomeView === view) return;
    setBiomeView(view);
    setMessage("");
    if (view === "items") return;
    setCreaturesLoading(true);
    try {
      if (view === "creatures" && creatures.length === 0) {
        setCreatures((await api.creatures(currentBiome.slug)).data);
      }
      if (view === "boss" && biomeBoss === null) {
        setBiomeBoss((await api.boss(currentBiome.slug)).data);
      }
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить боевой справочник." : "Could not load combat guide.");
    } finally {
      setCreaturesLoading(false);
    }
  };

  const openBosses = async () => {
    setMessage("");
    setSection("bosses");
    if (bosses.length > 0) return;
    setBossesLoading(true);
    try {
      setBosses((await api.bosses()).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить список боссов." : "Could not load bosses.");
    } finally {
      setBossesLoading(false);
    }
  };

  const openFoodBuilder = async () => {
    setMessage("");
    setToolOrigin(section === "food-builder" || section === "taming" ? "home" : section);
    setMoreMenuOpen(false);
    setSection("food-builder");
    if (foods.length > 0) return;
    setFoodsLoading(true);
    try {
      setFoods((await api.foods()).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить еду." : "Could not load food data.");
    } finally {
      setFoodsLoading(false);
    }
  };

  const openTaming = async () => {
    setMessage("");
    setToolOrigin(section === "food-builder" || section === "taming" ? "home" : section);
    setMoreMenuOpen(false);
    setSection("taming");
    if (tamingGuides.length > 0) return;
    setTamingLoading(true);
    try {
      setTamingGuides((await api.taming()).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить справочник приручения." : "Could not load taming guide.");
    } finally {
      setTamingLoading(false);
    }
  };

  const toggleFood = (food: FoodSummary) => {
    setSelectedFoodSlugs((current) => {
      if (current.includes(food.slug)) return current.filter((slug) => slug !== food.slug);
      if (current.length >= 3) {
        setMessage(locale === "ru" ? "В Valheim одновременно можно съесть максимум 3 разных блюда." : "Valheim allows up to 3 different active foods.");
        return current;
      }
      return [...current, food.slug];
    });
  };

  const openCreature = async (slug: string, origin: Exclude<Section, "creature"> = "biome") => {
    setMessage("");
    setCreatureOrigin(origin);
    setSection("creature");
    setCreature(null);
    try {
      setCreature((await api.creature(slug)).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить существо." : "Could not load creature.");
    }
  };

  const filterBiome = async (category?: string) => {
    if (!currentBiome) return;
    setActiveCategory(category);
    try { setBiomeItems((await api.items(currentBiome.slug, category)).data); } catch { setMessage(locale === "ru" ? "Не удалось загрузить предметы." : "Could not load items."); }
  };

  const openEntry = async (entry: GuideItem) => {
    setMessage("");
    if (section !== "item" && section !== "resource") setDetailOrigin(section);
    try {
      if (entry.entity_type === "resource") {
        setSection("resource"); setResource((await api.resource(entry.slug)).data);
      } else {
        setSection("item"); setItem((await api.item(entry.slug)).data);
      }
    } catch { setMessage(locale === "ru" ? "Не удалось загрузить карточку." : "Could not load this entry."); }
  };

  const openItem = async (slug: string) => {
    setMessage("");
    if (section !== "item" && section !== "resource") setDetailOrigin(section);
    setSection("item");
    try { setItem((await api.item(slug)).data); } catch { setMessage(locale === "ru" ? "Не удалось загрузить предмет." : "Could not load item."); }
  };

  const openResource = async (slug: string) => {
    setMessage("");
    if (section !== "item" && section !== "resource") setDetailOrigin(section);
    try {
      const itemResponse = await api.item(slug);
      setSection("item");
      setItem(itemResponse.data);
      return;
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 404) {
        setMessage(locale === "ru" ? "Не удалось загрузить компонент." : "Could not load component.");
        return;
      }
    }

    setSection("resource");
    try {
      setResource((await api.resource(slug)).data);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить ресурс." : "Could not load resource.");
    }
  };

  const loadCraftList = async (list: CraftList) => {
    setActiveCraftList(list);
    const [items, totals] = await Promise.all([api.craftItems(list.id), api.craftSummary(list.id)]);
    setCraftItems(items.data);
    setCraftTotals(totals.data);
  };

  const goNav = async (next: NavSection) => {
    setMessage(""); setSection(next);
    if (next === "favorites") {
      try { setFavorites((await api.favorites()).data); }
      catch (error) { setMessage(protectedErrorText(locale, error)); }
    }
    if (next === "craft") {
      try {
        const { data } = await api.craftLists();
        setCraftLists(data);
        const selected = activeCraftList && data.find((list) => list.id === activeCraftList.id)
          ? data.find((list) => list.id === activeCraftList.id)!
          : data[0] ?? null;
        if (selected) {
          await loadCraftList(selected);
        } else {
          setActiveCraftList(null);
          setCraftItems([]);
          setCraftTotals([]);
        }
      } catch (error) { setMessage(protectedErrorText(locale, error)); }
    }
  };

  const nextCraftListName = (): string => {
    if (!craftLists.length) return locale === "ru" ? "Мой крафт" : "My craft";
    const prefix = locale === "ru" ? "Список" : "List";
    const used = new Set(craftLists.map((list) => list.name));
    let index = 2;
    while (used.has(`${prefix} ${index}`)) index += 1;
    return `${prefix} ${index}`;
  };

  const createCraftList = async () => {
    if (craftListActionLock.current) return;
    if (activeCraftList && craftItems.length === 0) {
      setMessage(locale === "ru" ? "Текущий список уже пуст — можно использовать его." : "The current list is already empty — you can use it.");
      return;
    }
    craftListActionLock.current = true;
    setCraftListBusy(true);
    try {
      const { data } = await api.createCraftList(nextCraftListName());
      setCraftLists((lists) => [data, ...lists]);
      setActiveCraftList(data);
      setCraftItems([]);
      setCraftTotals([]);
      setMessage(locale === "ru" ? "Новый список создан." : "New list created.");
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    } finally {
      craftListActionLock.current = false;
      setCraftListBusy(false);
    }
  };

  const renameCraftList = async () => {
    if (!activeCraftList || craftListActionLock.current) return;
    const nextName = window.prompt(locale === "ru" ? "Название списка" : "List name", activeCraftList.name)?.trim();
    if (!nextName || nextName === activeCraftList.name) return;
    craftListActionLock.current = true;
    setCraftListBusy(true);
    try {
      const { data } = await api.renameCraftList(activeCraftList.id, nextName);
      setActiveCraftList(data);
      setCraftLists((lists) => lists.map((list) => list.id === data.id ? data : list));
      setMessage(locale === "ru" ? "Список переименован." : "List renamed.");
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    } finally {
      craftListActionLock.current = false;
      setCraftListBusy(false);
    }
  };

  const deleteCraftList = async () => {
    if (!activeCraftList || craftListActionLock.current) return;
    const confirmed = window.confirm(locale === "ru"
      ? `Удалить список «${activeCraftList.name}»? Предметы и отмеченные ресурсы в нём будут удалены.`
      : `Delete “${activeCraftList.name}”? Its items and resource progress will be removed.`);
    if (!confirmed) return;
    craftListActionLock.current = true;
    setCraftListBusy(true);
    try {
      await api.deleteCraftList(activeCraftList.id);
      const remaining = craftLists.filter((list) => list.id !== activeCraftList.id);
      setCraftLists(remaining);
      const next = remaining[0] ?? null;
      if (next) {
        await loadCraftList(next);
      } else {
        setActiveCraftList(null);
        setCraftItems([]);
        setCraftTotals([]);
      }
      setMessage(locale === "ru" ? "Список удалён." : "List deleted.");
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    } finally {
      craftListActionLock.current = false;
      setCraftListBusy(false);
    }
  };

  const addToCraftList = async () => {
    if (!item || craftListActionLock.current) return;
    craftListActionLock.current = true;
    setCraftListBusy(true);
    try {
      let target = activeCraftList;

      if (!target) {
        const { data: existingLists } = await api.craftLists();
        setCraftLists(existingLists);
        target = existingLists[0] ?? null;
      }

      if (!target) {
        const { data } = await api.createCraftList(locale === "ru" ? "Мой крафт" : "My craft");
        target = data;
        setCraftLists([data]);
      }

      setActiveCraftList(target);
      await api.addCraftItem(target.id, item.id);
      const [items, totals] = await Promise.all([api.craftItems(target.id), api.craftSummary(target.id)]);
      setCraftItems(items.data);
      setCraftTotals(totals.data);
      setMessage(locale === "ru" ? `Добавлено в «${target.name}».` : `Added to “${target.name}”.`);
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    } finally {
      craftListActionLock.current = false;
      setCraftListBusy(false);
    }
  };

  const selectCraftList = async (list: CraftList) => {
    if (craftListBusy || activeCraftList?.id === list.id) return;
    setMessage("");
    try {
      await loadCraftList(list);
    } catch {
      setMessage(locale === "ru" ? "Не удалось загрузить расчёт." : "Could not load calculation.");
    }
  };

  const updateCraftItem = async (planned: CraftListItem, nextQuantity: number) => {
    if (!activeCraftList) return;
    try {
      if (nextQuantity <= 0) {
        await api.removeCraftItem(activeCraftList.id, planned.item_id);
      } else {
        await api.updateCraftItem(activeCraftList.id, planned.item_id, nextQuantity, planned.target_level);
      }
      const [items, totals] = await Promise.all([api.craftItems(activeCraftList.id), api.craftSummary(activeCraftList.id)]);
      setCraftItems(items.data);
      setCraftTotals(totals.data);
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    }
  };

  const updateCraftLevel = async (planned: CraftListItem, nextLevel: number) => {
    if (!activeCraftList) return;
    const clamped = Math.max(1, Math.min(planned.max_level, nextLevel));
    if (clamped === planned.target_level) return;
    try {
      await api.updateCraftItem(activeCraftList.id, planned.item_id, planned.quantity, clamped);
      const [items, totals] = await Promise.all([api.craftItems(activeCraftList.id), api.craftSummary(activeCraftList.id)]);
      setCraftItems(items.data);
      setCraftTotals(totals.data);
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    }
  };

  const updateOwnedResource = async (resourceId: number, nextOwned: number) => {
    if (!activeCraftList) return;
    try {
      await api.updateCraftResource(activeCraftList.id, resourceId, Math.max(0, nextOwned));
      setCraftTotals((await api.craftSummary(activeCraftList.id)).data);
    } catch (error) {
      setMessage(protectedErrorText(locale, error));
    }
  };

  const copyMissingResources = async () => {
    if (!activeCraftList || !craftTotals.length) return;
    const missing = craftTotals.filter((total) => total.remaining > 0);
    if (!missing.length) {
      setMessage(locale === "ru" ? "Все ресурсы для этого списка уже собраны." : "All resources for this list are already collected.");
      return;
    }
    const title = locale === "ru" ? `VALHEIM — ${activeCraftList.name}` : `VALHEIM — ${activeCraftList.name}`;
    const body = missing.map((total) => `• ${text(locale, total)} — ${total.remaining}`).join("\n");
    try {
      await navigator.clipboard.writeText(`${title}\n\n${body}`);
      setMessage(locale === "ru" ? "Недостающие ресурсы скопированы." : "Missing resources copied.");
    } catch {
      setMessage(locale === "ru" ? "Не удалось скопировать список." : "Could not copy the list.");
    }
  };

  const toggleFavorite = async () => {
    if (!item) return;
    try {
      const alreadySaved = favorites.some((favorite) => favorite.id === item.id);
      if (alreadySaved) {
        await api.removeFavorite(item.id); setFavorites((saved) => saved.filter((favorite) => favorite.id !== item.id));
      } else {
        await api.addFavorite(item.id); setFavorites((saved) => [item, ...saved]);
      }
    } catch (error) { setMessage(protectedErrorText(locale, error)); }
  };

  const goBack = () => {
    setMessage("");
    if (section === "item" || section === "resource") return setSection(detailOrigin);
    if (section === "creature") return setSection(creatureOrigin);
    if (section === "food-builder" || section === "taming") return setSection(toolOrigin);
    if (section === "biome") return setSection("home");
    setSection("home");
  };

  const showSearch = section === "home" || section === "search";
  const saved = item ? favorites.some((favorite) => favorite.id === item.id) : false;

  return <main className="app-shell">
    <header className="topbar">
      <div className="topbar-copy">
        {!(["home", "search", "craft", "favorites"] as Section[]).includes(section) && <button className="back" onClick={goBack}>‹ {locale === "ru" ? "Назад" : "Back"}</button>}
        <p className="eyebrow"><span>ᚱ</span> Unofficial companion</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <button className="language" onClick={() => setLocale(locale === "ru" ? "en" : "ru")}><span>文</span>{locale.toUpperCase()}</button>
        <button className={moreMenuOpen ? "more-menu-button active" : "more-menu-button"} aria-label={locale === "ru" ? "Открыть меню" : "Open menu"} aria-expanded={moreMenuOpen} onClick={() => setMoreMenuOpen((open) => !open)}><span>•••</span></button>
      </div>
    </header>

    {moreMenuOpen && <>
      <button className="more-menu-backdrop" aria-label={locale === "ru" ? "Закрыть меню" : "Close menu"} onClick={() => setMoreMenuOpen(false)} />
      <aside className="more-menu-panel" aria-label={locale === "ru" ? "Дополнительное меню" : "More menu"}>
        <div className="more-menu-head"><div><small>{locale === "ru" ? "ДОПОЛНИТЕЛЬНО" : "MORE"}</small><strong>{locale === "ru" ? "Инструменты" : "Tools"}</strong></div><button onClick={() => setMoreMenuOpen(false)}>×</button></div>
        <button className="more-menu-item food" onClick={() => void openFoodBuilder()}>
          <span className="more-menu-icon">♨</span>
          <span><small>{locale === "ru" ? "РАЦИОН · КАЛЬКУЛЯТОР" : "DIET · CALCULATOR"}</small><strong>{locale === "ru" ? "Конструктор еды" : "Food Builder"}</strong><p>{locale === "ru" ? "Соберите три блюда и посчитайте показатели." : "Build a three-food loadout and calculate its stats."}</p></span>
          <i>›</i>
        </button>
        <button className="more-menu-item taming" onClick={() => void openTaming()}>
          <span className="more-menu-icon">♞</span>
          <span><small>{locale === "ru" ? "ЖИВОТНЫЕ · СПРАВОЧНИК" : "ANIMALS · GUIDE"}</small><strong>{locale === "ru" ? "Приручение" : "Taming"}</strong><p>{locale === "ru" ? "Корм, время, разведение и ездовые животные." : "Food, timing, breeding and rideable creatures."}</p></span>
          <i>›</i>
        </button>
      </aside>
    </>}

    {showSearch && <label className="search"><span className="search-icon">⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSection("search"); }} placeholder={locale === "ru" ? "Предмет, ресурс, трофей..." : "Item, resource, trophy..."} />{query && <button type="button" className="search-clear" onClick={() => { setQuery(""); setResults([]); }}>×</button>}</label>}
    {message && <div className="toast" role="status"><span>✦</span><p>{message}</p><button onClick={() => setMessage("")}>×</button></div>}

    {section === "home" && <section className="home-section">
      <div className="home-hero">
        <div className="rune-mark">ᚹ</div>
        <p className="hero-kicker">{locale === "ru" ? "ТВОЙ СПУТНИК ПО МИРУ" : "YOUR WORLD COMPANION"}</p>
        <h2>{locale === "ru" ? "Всё нужное для похода — в одном месте" : "Everything for the journey, in one place"}</h2>
        <p>{locale === "ru" ? "Рецепты, ресурсы, трофеи и личный список крафта от Лугов до Глубокого Севера." : "Recipes, resources, trophies and your personal craft plan from the Meadows to the Deep North."}</p>
        <div className="hero-metrics"><span><b>{biomes.length || 9}</b>{locale === "ru" ? "биомов" : "biomes"}</span><span><b>70+</b>{locale === "ru" ? "трофеев" : "trophies"}</span><span><b>1.0.16</b>{locale === "ru" ? "актуально" : "current"}</span></div>
      </div>
      <button className="bosses-entry" onClick={() => void openBosses()}>
        <span className="bosses-entry-icon">♛</span>
        <span className="bosses-entry-copy"><small>{locale === "ru" ? "БОЕВОЙ СПРАВОЧНИК" : "COMBAT GUIDE"}</small><strong>{locale === "ru" ? "Все боссы" : "All bosses"}</strong><p>{locale === "ru" ? "Призыв, здоровье, слабости, сопротивления и дроп каждого главного босса." : "Summons, health, weaknesses, resistances and drops for every major boss."}</p></span>
        <span className="bosses-entry-arrow">↗</span>
      </button>
      <div className="section-heading"><div><p>{locale === "ru" ? "ИССЛЕДОВАНИЕ МИРА" : "WORLD EXPLORATION"}</p><h2>{locale === "ru" ? "Биомы" : "Biomes"}</h2></div><span>{String(biomes.length || 9).padStart(2,"0")}</span></div>
      {loading ? <p className="muted">{locale === "ru" ? "Загрузка..." : "Loading..."}</p> : biomes.length === 0 ? <Empty message={locale === "ru" ? "Данные биомов появятся после первого проверенного импорта." : "Biome data will appear after the first verified import."} /> : <div className="biome-list">{biomes.map((biome, index) => <button className="biome-card" key={biome.slug} onClick={() => void openBiome(biome.slug)} style={{ "--accent": biome.accent_color ?? "#d89d46", "--art": biome.image_path ? `url(${biome.image_path})` : "none" } as CSSProperties}><span className="biome-order">{String(index + 1).padStart(2, "0")}</span><span className="biome-copy"><small>{locale === "ru" ? "БИОМ" : "BIOME"} {String(index + 1).padStart(2, "0")}</small><strong>{text(locale, biome)}</strong><p>{locale === "ru" ? biome.description_ru : biome.description_en}</p></span><span className="biome-arrow">↗</span></button>)}</div>}
    <div className="legal-note">
        <strong>{locale === "ru" ? "Неофициальный фан-проект" : "Unofficial fan project"}</strong>
        <span>{locale === "ru" ? "VALHEIM Guide не связан с Iron Gate Studio или Coffee Stain Publishing. Названия, изображения и другие игровые материалы принадлежат их правообладателям и используются в информационных и образовательных целях." : "VALHEIM Guide is not affiliated with Iron Gate Studio or Coffee Stain Publishing. Game names, images and other game materials belong to their respective rights holders and are used for informational and educational purposes."}</span>
        <a href="https://www.valheimgame.com/eula/" target="_blank" rel="noreferrer">{locale === "ru" ? "Условия использования Valheim ↗" : "Valheim usage terms ↗"}</a>
      </div></section>}

    {section === "search" && <section><div className="section-heading"><div><p>{locale === "ru" ? "ПОИСК ПО СПРАВОЧНИКУ" : "GUIDE SEARCH"}</p><h2>{locale === "ru" ? "Результаты" : "Results"}</h2></div>{query.length >= 2 && <span>{String(results.length).padStart(2,"0")}</span>}</div>{query.length < 2 ? <Empty message={locale === "ru" ? "Введите минимум 2 символа." : "Type at least 2 characters."} /> : <ResultList locale={locale} items={results} onOpen={openEntry} />}</section>}

    {section === "food-builder" && <section className="food-builder-section">
      <div className="food-builder-intro">
        <p>{locale === "ru" ? "КОНСТРУКТОР РАЦИОНА" : "DIET BUILDER"}</p>
        <h2>{locale === "ru" ? "Выберите до трёх блюд" : "Choose up to three foods"}</h2>
        <span>{locale === "ru" ? "Показатели пересчитываются сразу при каждом выборе. HP и выносливость включают базовые 25 HP и 50 выносливости персонажа. Это максимальные значения сразу после еды — со временем бонусы постепенно уменьшаются." : "Totals update instantly. Health and stamina include the character's base 25 health and 50 stamina. These are peak values right after eating; food bonuses gradually decay over time."}</span>
      </div>

      <div className="food-loadout">
        <div className="food-slots">
          {[0,1,2].map((slot) => {
            const picked = selectedFoods[slot];
            return picked ? <button className="food-slot filled" key={picked.slug} onClick={() => toggleFood(picked)}>
              <span>{picked.image_path ? <img src={picked.image_path} alt="" /> : "◆"}</span>
              <strong>{text(locale,picked)}</strong><small>{locale === "ru" ? "Нажмите, чтобы убрать" : "Tap to remove"}</small>
            </button> : <div className="food-slot empty" key={slot}><span>+</span><strong>{(locale === "ru" ? "Слот " : "Slot ") + (slot + 1)}</strong><small>{locale === "ru" ? "Выберите блюдо" : "Choose food"}</small></div>;
          })}
        </div>
        <div className="food-total-grid">
          <FoodMeter locale={locale} kind="health" base={25} bonus={foodTotals.health} max={380} />
          <FoodMeter locale={locale} kind="stamina" base={50} bonus={foodTotals.stamina} max={420} />
          <FoodMeter locale={locale} kind="eitr" base={0} bonus={foodTotals.eitr} max={330} />
        </div>
      </div>

      <label className="food-search"><span>⌕</span><input value={foodQuery} onChange={(event) => setFoodQuery(event.target.value)} placeholder={locale === "ru" ? "Найти блюдо..." : "Find food..."} />{foodQuery && <button type="button" onClick={() => setFoodQuery("")}>×</button>}</label>
      <div className="chips food-biome-chips">
        <button className={foodBiome === "all" ? "chip active" : "chip"} onClick={() => setFoodBiome("all")}><i>◈</i>{locale === "ru" ? "Все" : "All"}</button>
        {foodBiomes.map((biome) => <button className={foodBiome === biome.slug ? "chip active" : "chip"} key={biome.slug} onClick={() => setFoodBiome(biome.slug)}><i>⌖</i>{text(locale,biome)}</button>)}
      </div>
      <div className="food-result-heading"><span>{locale === "ru" ? "ДОСТУПНАЯ ЕДА" : "AVAILABLE FOOD"}</span><b>{visibleFoods.length}</b></div>
      {foodsLoading ? <Empty message={locale === "ru" ? "Загружаем блюда..." : "Loading food..."} /> : visibleFoods.length ? <div className="food-grid">{visibleFoods.map((food) => {
        const selected = selectedFoodSlugs.includes(food.slug);
        const locked = !selected && selectedFoodSlugs.length >= 3;
        return <button className={selected ? "food-card selected" : locked ? "food-card locked" : "food-card"} key={food.slug} onClick={() => toggleFood(food)}>
          <span className="food-card-art">{food.image_path ? <img src={food.image_path} alt="" /> : "◆"}</span>
          <span className="food-card-copy"><small>{locale === "ru" ? food.biome_name_ru : food.biome_name_en}</small><strong>{text(locale,food)}</strong><p>{locale === "ru" ? food.description_ru : food.description_en}</p>
            <span className="food-card-stats"><i className="hp">♥ {food.health}</i><i className="stam">⚡ {food.stamina}</i>{food.eitr > 0 && <i className="eitr">✦ {food.eitr}</i>}</span>
            <span className="food-card-meta">{food.duration ? <b>◷ {food.duration} {locale === "ru" ? "мин" : "min"}</b> : null}{food.healing ? <b>+{food.healing} {locale === "ru" ? "HP/тик" : "HP/tick"}</b> : null}</span>
          </span>
          <span className="food-card-action">{selected ? "✓" : "+"}</span>
        </button>;
      })}</div> : <Empty message={locale === "ru" ? "По этому фильтру ничего не найдено." : "No foods match this filter."} />}
    </section>}

    {section === "taming" && <section className="taming-section">
      <div className="taming-intro">
        <p>{locale === "ru" ? "ПРИРУЧЕНИЕ · 1.0" : "TAMING · 1.0"}</p>
        <h2>{locale === "ru" ? "Домашние звери Вальхейма" : "Tameable creatures"}</h2>
        <span>{locale === "ru" ? "Нажмите на животное — внутри корм, время приручения, условия разведения и полезные особенности." : "Open a creature for accepted food, taming time, breeding limits and useful traits."}</span>
      </div>
      <div className="taming-rules">
        <div><span>♡</span><p><strong>{locale === "ru" ? "Сыт и спокоен" : "Fed & calm"}</strong><small>{locale === "ru" ? "Приручение и размножение останавливаются, когда зверь голоден или встревожен." : "Taming and breeding pause while the creature is hungry or alerted."}</small></p></div>
        <div><span>⌖</span><p><strong>{locale === "ru" ? "Оставайтесь рядом" : "Stay nearby"}</strong><small>{locale === "ru" ? "Прогресс идёт только пока зона активна и игрок находится поблизости." : "Progress only advances while the area is active and a player is nearby."}</small></p></div>
        <div><span>★</span><p><strong>{locale === "ru" ? "Звёзды наследуются" : "Stars are inherited"}</strong><small>{locale === "ru" ? "Уровень приручённых животных передаётся потомству — двухзвёздочные особенно ценны." : "Tamed creature levels pass to offspring, making two-star animals especially valuable."}</small></p></div>
        <div><span>✦</span><p><strong>Brew of animal whispers</strong><small>{locale === "ru" ? "Сокращает непрерывное приручение примерно с 30 до 15 минут." : "Cuts uninterrupted taming time from about 30 to 15 minutes."}</small></p></div>
      </div>
      {tamingLoading ? <Empty message={locale === "ru" ? "Загружаем животных..." : "Loading tameable creatures..."} /> : <div className="taming-list">{tamingGuides.map((guide) => {
        const open = expandedTaming === guide.slug;
        return <div className={open ? "taming-card open" : "taming-card"} key={guide.slug}>
          <button className="taming-card-head" onClick={() => setExpandedTaming(open ? null : guide.slug)}>
            <span className="taming-animal-art">{guide.image_path ? <img src={guide.image_path} alt="" /> : "♞"}</span>
            <span className="taming-animal-copy"><small>{locale === "ru" ? guide.biome_ru : guide.biome_en}</small><strong>{text(locale,guide)}</strong><span><b>◷ {guide.taming_minutes} {locale === "ru" ? "мин" : "min"}</b>{guide.rideable && <b>♞ {locale === "ru" ? "Можно ездить" : "Rideable"}</b>}{guide.commandable && <b>⌁ {locale === "ru" ? "Следует за игроком" : "Commandable"}</b>}</span></span>
            <i>{open ? "−" : "+"}</i>
          </button>
          {open && <div className="taming-card-body">
            <p className="taming-tip"><span>✦</span>{locale === "ru" ? guide.tip_ru : guide.tip_en}</p>
            <div className="taming-facts">
              <div><small>{locale === "ru" ? "ПРИРУЧЕНИЕ" : "TAMING"}</small><strong>{guide.taming_minutes} {locale === "ru" ? "мин" : "min"}</strong></div>
              <div><small>{locale === "ru" ? "СЫТ ПОСЛЕ ЕДЫ" : "FED FOR"}</small><strong>{guide.fed_minutes} {locale === "ru" ? "мин" : "min"}</strong></div>
              <div><small>{locale === "ru" ? "ПОТОМСТВО" : "OFFSPRING"}</small><strong>{locale === "ru" ? guide.offspring_ru : guide.offspring_en}</strong></div>
              <div><small>{locale === "ru" ? "РАЗВЕДЕНИЕ" : "BREEDING CAP"}</small><strong>{guide.population_limit} / {guide.population_range} м</strong></div>
            </div>
            <div className="taming-food-title"><span>{locale === "ru" ? "ПОДХОДЯЩИЙ КОРМ" : "ACCEPTED FOOD"}</span><small>{locale === "ru" ? "Держите зверя сытым и спокойным" : "Keep the creature fed and calm"}</small></div>
            <div className="taming-food-grid">{guide.food.map((food) => <span className="taming-food" key={food.slug}><i>{food.image_path ? <img src={food.image_path} alt="" /> : "◆"}</i><b>{text(locale,food)}</b></span>)}</div>
            <div className="taming-breeding-note">
              <span>♡</span><p>{locale === "ru" ? "Для размножения держите двух сытых и спокойных особей рядом: партнёр должен быть в радиусе " + guide.partner_range + " м. Создание потомства занимает около " + guide.gestation_minutes + " мин." : "For breeding, keep two fed and calm creatures together within " + guide.partner_range + " m. Offspring creation takes about " + guide.gestation_minutes + " min."}</p>
            </div>
            {guide.saddle_en && <p className="taming-saddle">♞ <b>{locale === "ru" ? "Седло:" : "Saddle:"}</b> {locale === "ru" ? guide.saddle_ru : guide.saddle_en}</p>}
            <a className="taming-source" href={guide.source_url} target="_blank" rel="noreferrer">{locale === "ru" ? "Проверить игровые данные ↗" : "View game data ↗"}</a>
          </div>}
        </div>;
      })}</div>}
    </section>}

    {section === "bosses" && <section className="bosses-section">
      <div className="section-heading"><div><p>{locale === "ru" ? "БОССЫ · БОЕВОЙ СПРАВОЧНИК" : "BOSSES · COMBAT GUIDE"}</p><h2>{locale === "ru" ? "Боссы" : "Bosses"}</h2></div><span>{String(bosses.length || 8).padStart(2,"0")}</span></div>
      <p className="bosses-intro">{locale === "ru" ? "Главные боссы Valheim по порядку прохождения. Открой карточку, чтобы посмотреть призыв, силу, рекомендуемое снаряжение, резисты и дроп." : "Valheim's major bosses in progression order. Open a card for summon requirements, power, recommended gear, resistances and drops."}</p>
      {bossesLoading ? <Empty message={locale === "ru" ? "Загружаем боссов..." : "Loading bosses..."} /> : bosses.length ? <div className="bosses-list">{bosses.map((boss,index) => <div className="bosses-list-entry" key={boss.slug}><span className="bosses-order">{String(index + 1).padStart(2,"0")}</span><BossCard locale={locale} boss={boss} onOpen={(slug) => void openCreature(slug, "bosses")} /></div>)}</div> : <Empty message={locale === "ru" ? "Список боссов пока недоступен." : "Boss list is currently unavailable."} />}
    </section>}

    {section === "biome" && <section className="biome-section">{!currentBiome ? <Empty message={locale === "ru" ? "Загружаем биом..." : "Loading biome..."} /> : <>
      <div className="biome-intro" style={{ "--accent": currentBiome.accent_color ?? "#d89d46", "--art": currentBiome.image_path ? `url(${currentBiome.image_path})` : "none" } as CSSProperties}>
        <div><p>{locale === "ru" ? "ПУТЕВОДИТЕЛЬ ПО БИОМУ" : "BIOME FIELD GUIDE"}</p><h2>{text(locale,currentBiome)}</h2><span>{locale === "ru" ? currentBiome.description_ru : currentBiome.description_en}</span></div>
      </div>
      <div className="biome-view-switch">
        <button className={biomeView === "items" ? "active" : ""} onClick={() => void selectBiomeView("items")}><span>◆</span>{locale === "ru" ? "Предметы" : "Items"}</button>
        <button className={biomeView === "creatures" ? "active" : ""} onClick={() => void selectBiomeView("creatures")}><span>☠</span>{locale === "ru" ? "Существа" : "Creatures"}</button>
        <button className={biomeView === "boss" ? "active" : ""} onClick={() => void selectBiomeView("boss")}><span>♛</span>{locale === "ru" ? "Босс" : "Boss"}</button>
      </div>
      {biomeView === "items" && <>
        <div className="chips category-chips"><button className={!activeCategory ? "chip active" : "chip"} onClick={() => void filterBiome()}><i>◈</i>{locale === "ru" ? "Все" : "All"}</button>{currentBiome.categories.map((category) => <button className={activeCategory === category.slug ? "chip active" : "chip"} key={category.slug} onClick={() => void filterBiome(category.slug)}><i>{categoryIcon(category.slug)}</i>{text(locale, category)}</button>)}</div>
        {activeCategory === "trophy" ? <TrophyGrid locale={locale} items={biomeItems} onOpen={openEntry} /> : <ResultList locale={locale} items={biomeItems} onOpen={openEntry} />}
      </>}
      {biomeView === "creatures" && (creaturesLoading ? <Empty message={locale === "ru" ? "Загружаем существ..." : "Loading creatures..."} /> : <CreatureGrid locale={locale} items={creatures} onOpen={openCreature} />)}
      {biomeView === "boss" && (creaturesLoading ? <Empty message={locale === "ru" ? "Загружаем босса..." : "Loading boss..."} /> : biomeBoss ? <BossCard locale={locale} boss={biomeBoss} onOpen={openCreature} /> : <Empty message={locale === "ru" ? "В этом биоме нет отдельного Forsaken-босса." : "This biome has no dedicated Forsaken boss."} />)}
    </>}</section>}

    {section === "item" && item && <section className="detail">
      <div className="detail-hero"><Visual entry={item} hero /><div className="detail-hero-copy"><p className="item-type">{categoryText(locale, item) ?? (locale === "ru" ? "Предмет" : "Item")}</p><h2>{text(locale,item)}</h2>{item.biome_name_ru && <span className="biome-badge">⌖ {locale === "ru" ? item.biome_name_ru : item.biome_name_en}</span>}</div></div>
      <p className="lede detail-description">{locale === "ru" ? item.description_ru : item.description_en}</p>
      <div className="detail-actions"><button className={saved ? "save primary" : "save"} onClick={() => void toggleFavorite()}>{saved ? "♥" : "♡"} {saved ? (locale === "ru" ? "В избранном" : "Saved") : (locale === "ru" ? "Сохранить" : "Save")}</button><button className="save primary" disabled={craftListBusy} onClick={() => void addToCraftList()}>⚒ {locale === "ru" ? "В мой крафт" : "Add to craft"}</button></div>
      <DetailStats locale={locale} item={item} /><Recipe locale={locale} item={item} onResource={openResource} /><Upgrades locale={locale} item={item} onResource={openResource} /><SourceLink locale={locale} entry={item} />
    </section>}

    {section === "resource" && resource && <section className="detail">
      <div className="detail-hero"><Visual entry={resource} hero /><div className="detail-hero-copy"><p className="item-type">{categoryText(locale, resource) ?? (locale === "ru" ? "Материал" : "Material")}</p><h2>{text(locale,resource)}</h2></div></div>
      <p className="lede detail-description">{locale === "ru" ? resource.description_ru : resource.description_en}</p>
      <SectionTitle eyebrow={locale === "ru" ? "ИСТОЧНИК" : "SOURCE"} title={locale === "ru" ? "Где найти" : "Where to find"} />
      {resource.sources.length ? <div className="source-list">{resource.sources.map((source, index) => <p key={index}><b>{String(index + 1).padStart(2,"0")}</b><span>{locale === "ru" ? source.method_ru : source.method_en}</span></p>)}</div> : <Empty message={locale === "ru" ? "Проверенный источник пока добавляется." : "A verified source is being added."} />}
      {(resource.dropped_by?.length ?? 0) > 0 && <>
        <SectionTitle eyebrow={locale === "ru" ? "ДОБЫЧА" : "DROPS FROM"} title={locale === "ru" ? "Выпадает из" : "Dropped by"} />
        <CreatureGrid locale={locale} items={resource.dropped_by ?? []} onOpen={(slug) => void openCreature(slug, "resource")} />
      </>}
      <SectionTitle eyebrow={locale === "ru" ? "ПРИМЕНЕНИЕ" : "USES"} title={locale === "ru" ? "Как используется" : "How it is used"} />
      {(resource.use_notes?.length ?? 0) > 0 && <div className="use-note-list">{(resource.use_notes ?? []).map((note,index) => <p key={index}><span>✦</span>{locale === "ru" ? note.ru : note.en}</p>)}</div>}
      {resource.used_by.length > 0 && <>
        {(resource.use_notes?.length ?? 0) > 0 && <p className="use-recipes-label">{locale === "ru" ? "РЕЦЕПТЫ И ПОСТРОЙКИ" : "RECIPES & BUILDINGS"}</p>}
        <ResultList locale={locale} items={resource.used_by} onOpen={openEntry} />
      </>}
      {resource.used_by.length === 0 && (resource.use_notes?.length ?? 0) === 0 && <Empty message={locale === "ru" ? "Для этого ресурса пока не зафиксировано отдельного применения." : "No dedicated use has been recorded for this resource yet."} />}
      <SourceLink locale={locale} entry={resource} />
    </section>}

    {section === "creature" && <section className="detail creature-detail">
      {!creature ? <Empty message={locale === "ru" ? "Загружаем боевые данные..." : "Loading combat data..."} /> : <CreatureDetailView locale={locale} creature={creature} boss={biomeBoss?.slug === creature.slug ? biomeBoss : bosses.find((entry) => entry.slug === creature.slug) ?? null} onResource={openResource} />}
    </section>}

    {section === "craft" && <section>
      <div className="section-row craft-heading"><div><p className="section-kicker">{locale === "ru" ? "ПЛАНИРОВЩИК РЕСУРСОВ" : "RESOURCE PLANNER"}</p><h2>{locale === "ru" ? "Мой крафт" : "My craft"}</h2></div><button className="save primary" disabled={craftListBusy} onClick={() => void createCraftList()}>+ {locale === "ru" ? "Новый список" : "New list"}</button></div>
      {craftLists.length > 1 && <div className="chips">{craftLists.map((list) => <button className={activeCraftList?.id === list.id ? "chip active" : "chip"} onClick={() => void selectCraftList(list)} key={list.id}>{list.name}</button>)}</div>}
      {!activeCraftList ? <Empty message={locale === "ru" ? "Создайте список, затем добавляйте в него предметы из их карточек." : "Create a list, then add items from their cards."} /> : <>
        <div className="craft-list-toolbar">
          <div><small>{locale === "ru" ? "Активный список" : "Active list"}</small><strong>{activeCraftList.name}</strong></div>
          <div className="craft-list-actions">
            <button disabled={craftListBusy} onClick={() => void renameCraftList()} aria-label={locale === "ru" ? "Переименовать список" : "Rename list"}>✎</button>
            <button className="danger" disabled={craftListBusy} onClick={() => void deleteCraftList()} aria-label={locale === "ru" ? "Удалить список" : "Delete list"}>⌫</button>
          </div>
        </div>
        <PlannedCraftItems locale={locale} items={craftItems} onQuantityChange={updateCraftItem} onLevelChange={updateCraftLevel} onOpen={openItem} />
        <div className="section-row craft-resource-heading"><h2>{locale === "ru" ? "Нужно ресурсов" : "Resources needed"}</h2>{craftTotals.some((total) => total.remaining > 0) && <button className="save compact" onClick={() => void copyMissingResources()}>⧉ {locale === "ru" ? "Скопировать" : "Copy"}</button>}</div>
        <CraftTotals locale={locale} totals={craftTotals} onResource={openResource} onOwnedChange={updateOwnedResource} />
      </>}
    </section>}
    {section === "favorites" && <section><div className="section-heading"><div><p>{locale === "ru" ? "ЛИЧНАЯ КОЛЛЕКЦИЯ" : "PERSONAL COLLECTION"}</p><h2>{locale === "ru" ? "Избранное" : "Favorites"}</h2></div><span>{String(favorites.length).padStart(2,"0")}</span></div><ResultList locale={locale} items={favorites} onOpen={openEntry} /></section>}

    <nav className="bottom-nav" aria-label={locale === "ru" ? "Главное меню" : "Main navigation"}>{([['home', locale === "ru" ? "Главная" : "Home"], ['craft', locale === "ru" ? "Крафт" : "Craft"], ['favorites', locale === "ru" ? "Избранное" : "Saved"], ['search', locale === "ru" ? "Поиск" : "Search"]] as const).map(([id, label]) => {
      const active = section === id || (id === "home" && (section === "bosses" || section === "biome" || section === "creature"));
      return <button key={id} className={active ? "active" : ""} aria-current={active ? "page" : undefined} onClick={() => void goNav(id)}>
        <span className="nav-icon"><NavIcon id={id} /></span>
        <span className="nav-label">{label}</span>
      </button>;
    })}</nav>
  </main>;
}

function NavIcon({ id }: { id: NavSection }) {
  if (id === "home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.6 12 4l8 6.6v8.1a1.3 1.3 0 0 1-1.3 1.3H15v-5.5H9V20H5.3A1.3 1.3 0 0 1 4 18.7v-8.1Z" /></svg>;
  if (id === "craft") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.2 5.2 4.6 4.6M13 6.4l4.6 4.6M5 19l8.7-8.7M4.2 15.8 8.2 19.8M16.7 4.4l2.9-1 1 1-1 2.9-2.3 2.3-2.9-2.9 2.3-2.3Z" /></svg>;
  if (id === "favorites") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.3 4.9 13.7A5.4 5.4 0 0 1 12 5.6a5.4 5.4 0 0 1 7.1 8.1L12 20.3Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.8" /><path d="m15 15 5 5" /></svg>;
}

function DetailStats({ locale, item }: { locale: Locale; item: ItemDetail }) {
  if (!item.stats.length) return null;
  return <><SectionTitle eyebrow={locale === "ru" ? "ПАРАМЕТРЫ" : "ATTRIBUTES"} title={locale === "ru" ? "Характеристики" : "Stats"} /><div className="stats">{item.stats.map((stat) => <div key={stat.stat_key}><span>{statLabel(locale, stat.stat_key)}</span><strong>{stat.stat_value}{stat.unit ? ` ${stat.unit}` : ""}</strong></div>)}</div></>;
}

function Recipe({ locale, item, onResource }: { locale: Locale; item: ItemDetail; onResource: (slug: string) => void }) {
  if (!item.ingredients.length) return null;
  return <><SectionTitle eyebrow={locale === "ru" ? "РЕЦЕПТ" : "RECIPE"} title={locale === "ru" ? "Крафт" : "Crafting"} />{item.recipe && <p className="station">⚒ {text(locale, item.recipe)} · {locale === "ru" ? "ур." : "lvl."} {item.recipe.station_level}{item.recipe.output_quantity > 1 ? ` · ×${item.recipe.output_quantity}` : ""}</p>}<IngredientList locale={locale} ingredients={item.ingredients} onResource={onResource} /></>;
}

function Upgrades({ locale, item, onResource }: { locale: Locale; item: ItemDetail; onResource: (slug: string) => void }) {
  if (!item.upgrades.length) return null;
  return <><SectionTitle eyebrow={locale === "ru" ? "ПРОКАЧКА" : "UPGRADE PATH"} title={locale === "ru" ? "Улучшения" : "Upgrades"} /><div className="upgrades">{item.upgrades.map((upgrade) => <div className="upgrade" key={upgrade.level}><strong>{locale === "ru" ? "Уровень" : "Level"} {upgrade.level}</strong>{upgrade.station_level && <span>{locale === "ru" ? "Верстак ур." : "Workbench lvl."} {upgrade.station_level}</span>}<IngredientList locale={locale} ingredients={upgrade.ingredients} onResource={onResource} /></div>)}</div></>;
}

function IngredientList({ locale, ingredients, onResource }: { locale: Locale; ingredients: ItemDetail["ingredients"]; onResource: (slug: string) => void }) {
  return <div className="ingredients">{ingredients.map((ingredient) => <button key={ingredient.slug} onClick={() => void onResource(ingredient.slug)}>
    <span className={ingredient.image_path ? "ingredient-icon" : "ingredient-icon fallback"}>{ingredient.image_path ? <img src={ingredient.image_path} alt="" /> : "◆"}</span>
    <span className="ingredient-copy"><b>{ingredient.quantity}×</b><span>{text(locale, ingredient)}</span></span>
    <i>›</i>
  </button>)}</div>;
}

function ResultList({ locale, items, onOpen }: { locale: Locale; items: GuideItem[]; onOpen: (item: GuideItem) => void }) {
  if (!items.length) return <Empty message={locale === "ru" ? "Здесь пока ничего нет." : "Nothing here yet."} />;
  return <div className="result-list">{items.map((entry) => <button key={entry.id} className="result" onClick={() => void onOpen(entry)}><Visual entry={entry} /><span><strong>{text(locale, entry)}</strong><small><i>{categoryIcon(entry.category_slug ?? undefined)}</i>{categoryText(locale, entry) ?? (locale === "ru" ? "Материал" : "Material")}</small></span><b>↗</b></button>)}</div>;
}

function TrophyGrid({ locale, items, onOpen }: { locale: Locale; items: GuideItem[]; onOpen: (item: GuideItem) => void }) {
  if (!items.length) return <Empty message={locale === "ru" ? "Трофеи для этого биома пока не добавлены." : "No trophies have been added for this biome yet."} />;
  return <div className="trophy-grid">{items.map((entry,index) => <button className="trophy-card" key={entry.id} onClick={() => void onOpen(entry)}>
    <span className="trophy-number">{String(index + 1).padStart(2,"0")}</span>
    <Visual entry={entry} />
    <strong>{text(locale,entry)}</strong>
    <small>{locale === "ru" ? "ТРОФЕЙ" : "TROPHY"}</small>
  </button>)}</div>;
}

const damageTypeText = (locale: Locale, type: string) => ({
  blunt: locale === "ru" ? "Дробящий" : "Blunt",
  slash: locale === "ru" ? "Рубящий" : "Slash",
  pierce: locale === "ru" ? "Колющий" : "Pierce",
  chop: locale === "ru" ? "Рубка" : "Chop",
  pickaxe: locale === "ru" ? "Кирка" : "Pickaxe",
  fire: locale === "ru" ? "Огонь" : "Fire",
  frost: locale === "ru" ? "Мороз" : "Frost",
  lightning: locale === "ru" ? "Молния" : "Lightning",
  poison: locale === "ru" ? "Яд" : "Poison",
  spirit: locale === "ru" ? "Дух" : "Spirit"
}[type] ?? type);

const resistanceText = (locale: Locale, level: CreatureDetail["resistances"][number]["level"]) => ({
  weak: locale === "ru" ? "Слабость" : "Weak",
  "very-weak": locale === "ru" ? "Очень слаб" : "Very weak",
  resistant: locale === "ru" ? "Сопротивление" : "Resistant",
  "very-resistant": locale === "ru" ? "Сильное сопротивление" : "Very resistant",
  immune: locale === "ru" ? "Иммунитет" : "Immune",
  ignore: locale === "ru" ? "Не учитывается" : "Ignored"
}[level]);

function CreatureGrid({ locale, items, onOpen }: { locale: Locale; items: CreatureSummary[]; onOpen: (slug: string) => void }) {
  if (!items.length) return <Empty message={locale === "ru" ? "Существа для этого биома пока не добавлены." : "No creatures have been added for this biome yet."} />;
  return <div className="creature-grid">{items.map((entry) => <button className="creature-card" key={entry.slug} onClick={() => void onOpen(entry.slug)}>
    <span className={entry.kind === "boss" ? "creature-mark boss" : "creature-mark"}>{entry.image_path ? <img src={entry.image_path} alt="" /> : entry.kind === "boss" ? "♛" : "☠"}</span>
    <span className="creature-card-copy"><small>{entry.kind === "boss" ? (locale === "ru" ? "БОСС" : "BOSS") : (locale === "ru" ? "СУЩЕСТВО" : "CREATURE")}</small><strong>{text(locale,entry)}</strong><span><b>{entry.health.toLocaleString()}</b> HP</span></span>
    <i>↗</i>
  </button>)}</div>;
}

function BossCard({ locale, boss, onOpen }: { locale: Locale; boss: BossSummary; onOpen: (slug: string) => void }) {
  return <button className="boss-card" onClick={() => void onOpen(boss.slug)}>
    <span className="boss-crown">{boss.image_path ? <img src={boss.image_path} alt="" /> : "♛"}</span>
    <span className="boss-copy"><small>{locale === "ru" ? "FORSAKEN · БОСС БИОМА" : "FORSAKEN · BIOME BOSS"}</small><strong>{text(locale,boss)}</strong><span><b>{boss.health.toLocaleString()}</b> HP</span><p>{locale === "ru" ? boss.summon_ru : boss.summon_en}</p></span>
    <i>↗</i>
  </button>;
}

function CreatureDetailView({ locale, creature, boss, onResource }: { locale: Locale; creature: CreatureDetail; boss: BossSummary | null; onResource: (slug: string) => void }) {
  const weak = creature.resistances.filter((entry) => entry.level === "weak" || entry.level === "very-weak");
  const defended = creature.resistances.filter((entry) => !["weak","very-weak","ignore"].includes(entry.level));
  return <>
    <div className={boss ? "creature-hero boss" : "creature-hero"}>
      <div className="creature-art">{creature.image_url ? <img src={creature.image_url} alt="" /> : <span>{boss ? "♛" : "☠"}</span>}</div>
      <div><p className="item-type">{boss ? (locale === "ru" ? "FORSAKEN · БОСС" : "FORSAKEN · BOSS") : (locale === "ru" ? "СУЩЕСТВО" : "CREATURE")}</p><h2>{text(locale,creature)}</h2><span className="health-badge"><b>{creature.health.toLocaleString()}</b> HP</span></div>
    </div>

    {boss && <div className="boss-facts">
      <div><small>{locale === "ru" ? "ПРИЗЫВ" : "SUMMON"}</small><strong>{locale === "ru" ? boss.summon_ru : boss.summon_en}</strong></div>
      <div><small>{locale === "ru" ? "СИЛА ПАВШЕГО" : "FORSAKEN POWER"}</small><strong>{locale === "ru" ? boss.power_ru : boss.power_en}</strong></div>
      <div><small>{locale === "ru" ? "РЕКОМЕНДУЕТСЯ" : "RECOMMENDED"}</small><strong>{locale === "ru" ? boss.recommended_ru : boss.recommended_en}</strong></div>
    </div>}

    <SectionTitle eyebrow={locale === "ru" ? "БОЕВОЙ ПРОФИЛЬ" : "COMBAT PROFILE"} title={locale === "ru" ? "Уязвимости и защита" : "Weaknesses & defenses"} />
    {creature.resistances.length ? <div className="resistance-groups">
      <div className="resistance-block weak"><small>{locale === "ru" ? "ЛУЧШЕ БИТЬ" : "BEST AGAINST"}</small>{weak.length ? <div>{weak.map((entry) => <span key={entry.type}><b>{damageTypeText(locale,entry.type)}</b><em>{resistanceText(locale,entry.level)}</em></span>)}</div> : <p>{locale === "ru" ? "Выраженных слабостей нет." : "No listed weakness."}</p>}</div>
      <div className="resistance-block defend"><small>{locale === "ru" ? "ЗАЩИТА" : "DEFENSES"}</small>{defended.length ? <div>{defended.map((entry) => <span className={entry.level} key={entry.type}><b>{damageTypeText(locale,entry.type)}</b><em>{resistanceText(locale,entry.level)}</em></span>)}</div> : <p>{locale === "ru" ? "Нет особых сопротивлений." : "No special resistances."}</p>}</div>
    </div> : <Empty message={locale === "ru" ? "Особых слабостей и сопротивлений не зафиксировано." : "No special weaknesses or resistances are recorded."} />}

    <SectionTitle eyebrow={locale === "ru" ? "ЛУТ" : "LOOT"} title={locale === "ru" ? "Что выпадает" : "Drops"} />
    {creature.drops.length ? <div className="drop-list">{creature.drops.map((drop,index) => {
      const linkedName = locale === "ru" ? drop.name_ru : drop.name_en;
      return <button className={drop.slug ? "drop-entry linked" : "drop-entry"} disabled={!drop.slug} key={`${drop.name}-${index}`} onClick={() => drop.slug && void onResource(drop.slug)}>
        <span className={drop.image_path ? "drop-icon" : "drop-icon fallback"}>{drop.image_path ? <img src={drop.image_path} alt="" /> : "◆"}</span>
        <span className="drop-copy"><span><b>{linkedName ?? drop.name}</b>{drop.amount && <small>×{drop.amount}</small>}</span>{drop.slug && <small>{locale === "ru" ? "Открыть ресурс и применение" : "Open resource & uses"}</small>}</span>
        {drop.chance && <em>{drop.chance}</em>}
        {drop.slug && <i>›</i>}
      </button>;
    })}</div> : <Empty message={locale === "ru" ? "Это существо не роняет предметы." : "This creature does not drop items."} />}

    <p className="source-credit"><a href={creature.source_url} target="_blank" rel="noreferrer">{locale === "ru" ? "Боевые данные" : "Combat data"} ↗</a><span>{creature.source_name}</span></p>
  </>;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="detail-section-title"><p>{eyebrow}</p><h2>{title}</h2></div>;
}

function Visual({ entry, hero = false }: { entry: GuideItem; hero?: boolean }) {
  if (entry.image_path) return <span className={hero ? "visual hero" : "visual"}><img src={entry.image_path} alt="" /></span>;
  return <span className={hero ? "visual hero fallback" : "visual fallback"}>{entry.entity_type === "resource" ? "◆" : "⚔"}</span>;
}

function PlannedCraftItems({ locale, items, onQuantityChange, onLevelChange, onOpen }: { locale: Locale; items: CraftListItem[]; onQuantityChange: (item: CraftListItem, nextQuantity: number) => void; onLevelChange: (item: CraftListItem, nextLevel: number) => void; onOpen: (slug: string) => void }) {
  if (!items.length) return <Empty message={locale === "ru" ? "Пока пусто. Добавьте предмет из его карточки." : "Nothing here yet. Add an item from its card."} />;
  return <div className="planned-items">{items.map((planned) => <div className="planned-item" key={planned.item_id}>
    <button className="planned-main" onClick={() => void onOpen(planned.slug)}>
      <span className="planned-icon">{planned.image_path ? <img src={planned.image_path} alt="" /> : "⚔"}</span>
      <span><strong>{text(locale, planned)}</strong><small>{locale === "ru" ? `Уровень ${planned.target_level}` : `Level ${planned.target_level}`}</small></span>
    </button>
    <div className="planned-controls">
      {planned.max_level > 1 && <div className="planned-level">
        <span>{locale === "ru" ? "Ур." : "Lvl."}</span>
        <button disabled={planned.target_level <= 1} onClick={() => void onLevelChange(planned, planned.target_level - 1)}>−</button>
        <strong>{planned.target_level}/{planned.max_level}</strong>
        <button disabled={planned.target_level >= planned.max_level} onClick={() => void onLevelChange(planned, planned.target_level + 1)}>+</button>
      </div>}
      <div className="planned-quantity">
        <button onClick={() => void onQuantityChange(planned, planned.quantity - 1)}>−</button>
        <strong>×{planned.quantity}</strong>
        <button onClick={() => void onQuantityChange(planned, planned.quantity + 1)}>+</button>
        <button className="planned-remove" aria-label={locale === "ru" ? "Удалить предмет из списка" : "Remove item from list"} onClick={() => void onQuantityChange(planned, 0)}>⌫</button>
      </div>
    </div>
  </div>)}</div>;
}

function CraftTotals({ locale, totals, onResource, onOwnedChange }: { locale: Locale; totals: CraftResourceTotal[]; onResource: (slug: string) => void; onOwnedChange: (resourceId: number, nextOwned: number) => void }) {
  if (!totals.length) return <Empty message={locale === "ru" ? "Добавьте предмет из его карточки — здесь появится общий список ресурсов." : "Add an item from its card to see the combined resource list."} />;
  const completeCount = totals.filter((total) => total.remaining === 0).length;
  const missingUnits = totals.reduce((sum, total) => sum + total.remaining, 0);
  const overallProgress = Math.round((completeCount / totals.length) * 100);
  return <div className="craft-totals">
    <div className="craft-overview">
      <div><strong>{locale === "ru" ? `Готово ресурсов: ${completeCount}/${totals.length}` : `Resources ready: ${completeCount}/${totals.length}`}</strong><small>{locale === "ru" ? `Осталось собрать единиц: ${missingUnits}` : `Units still needed: ${missingUnits}`}</small></div>
      <b>{overallProgress}%</b>
      <span><i style={{ width: `${overallProgress}%` }} /></span>
    </div>
    {totals.map((total) => {
    const complete = total.remaining === 0;
    const progress = total.required > 0 ? Math.min(100, Math.round((total.owned / total.required) * 100)) : 0;
    return <div className={complete ? "craft-total complete" : "craft-total"} key={total.resource_id}>
      <button className="craft-resource" onClick={() => void onResource(total.slug)}>
        <span className={total.image_path ? "craft-resource-icon" : "craft-resource-icon fallback"}>{total.image_path ? <img src={total.image_path} alt="" /> : "◆"}</span>
        <span className="craft-resource-copy"><strong>{text(locale, total)}</strong><small>{locale === "ru" ? `Нужно: ${total.required} · есть: ${total.owned}` : `Need: ${total.required} · have: ${total.owned}`}</small></span>
        <b>{complete ? "✓" : total.remaining}</b>
      </button>
      <div className="craft-progress"><span style={{ width: `${progress}%` }} /></div>
      <div className="craft-owned">
        <button aria-label={locale === "ru" ? "Уменьшить количество" : "Decrease quantity"} onClick={() => void onOwnedChange(total.resource_id, total.owned - 1)}>−</button>
        <span>{locale === "ru" ? "У меня" : "Owned"} <strong>{total.owned}</strong></span>
        <button aria-label={locale === "ru" ? "Увеличить количество" : "Increase quantity"} onClick={() => void onOwnedChange(total.resource_id, total.owned + 1)}>+</button>
        <button className="owned-reset" disabled={total.owned === 0} onClick={() => void onOwnedChange(total.resource_id, 0)}>{locale === "ru" ? "0" : "0"}</button>
        <button className="owned-all" disabled={complete} onClick={() => void onOwnedChange(total.resource_id, total.required)}>✓</button>
      </div>
    </div>;
  })}</div>;
}

function SourceLink({ locale, entry }: { locale: Locale; entry: GuideItem }) {
  if (!entry.source_url) return null;
  return <p className="source-credit"><a href={entry.source_url} target="_blank" rel="noreferrer">{locale === "ru" ? "Источник данных" : "Data source"} ↗</a>{entry.source_name ? <span>{entry.source_name}</span> : null}</p>;
}

function FoodMeter({ locale, kind, base, bonus, max }: { locale: Locale; kind: "health" | "stamina" | "eitr"; base: number; bonus: number; max: number }) {
  const total = base + bonus;
  const label = kind === "health" ? (locale === "ru" ? "Здоровье" : "Health") : kind === "stamina" ? (locale === "ru" ? "Выносливость" : "Stamina") : (locale === "ru" ? "Эйтр" : "Eitr");
  const symbol = kind === "health" ? "♥" : kind === "stamina" ? "⚡" : "✦";
  return <div className={"food-meter " + kind}>
    <span className="food-meter-label"><i>{symbol}</i>{label}</span>
    <span className="food-meter-values"><strong key={kind + "-" + total}>{total}</strong><small key={kind + "-bonus-" + bonus}>+{bonus}</small></span>
    <span className="food-meter-track"><i style={{ width: Math.min(100, Math.round((total / max) * 100)) + "%" }} /></span>
  </div>;
}

function Empty({ message }: { message: string }) { return <div className="empty">{message}</div>; }
