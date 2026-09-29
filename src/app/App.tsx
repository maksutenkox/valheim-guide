import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ApiError, api } from "./services/api";
import type { Biome, BossSummary, Category, CraftList, CraftListItem, CraftResourceTotal, CreatureDetail, CreatureSummary, GuideItem, ItemDetail, Locale, ResourceDetail } from "./types";
import "./styles.css";

type Section = "home" | "search" | "craft" | "favorites" | "biome" | "item" | "resource" | "creature";
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
  const [creature, setCreature] = useState<CreatureDetail | null>(null);
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
    favorites: locale === "ru" ? "Избранное" : "Favorites", biome: text(locale, currentBiome ?? { name_en: "Biome", name_ru: "Биом" }),
    item: item ? text(locale, item) : locale === "ru" ? "Предмет" : "Item",
    resource: resource ? text(locale, resource) : locale === "ru" ? "Ресурс" : "Resource",
    creature: creature ? text(locale, creature) : locale === "ru" ? "Существо" : "Creature"
  })[section], [creature, currentBiome, item, locale, resource, section]);

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

  const openCreature = async (slug: string) => {
    setMessage("");
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
    if (section === "creature") return setSection("biome");
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
      <button className="language" onClick={() => setLocale(locale === "ru" ? "en" : "ru")}><span>文</span>{locale.toUpperCase()}</button>
    </header>

    {showSearch && <label className="search"><span className="search-icon">⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSection("search"); }} placeholder={locale === "ru" ? "Предмет, ресурс, трофей..." : "Item, resource, trophy..."} />{query && <button type="button" className="search-clear" onClick={() => { setQuery(""); setResults([]); }}>×</button>}</label>}
    {message && <div className="toast" role="status"><span>✦</span><p>{message}</p><button onClick={() => setMessage("")}>×</button></div>}

    {section === "home" && <section className="home-section">
      <div className="home-hero">
        <div className="rune-mark">ᚹ</div>
        <p className="hero-kicker">{locale === "ru" ? "ТВОЙ СПУТНИК ПО МИРУ" : "YOUR WORLD COMPANION"}</p>
        <h2>{locale === "ru" ? "Всё нужное для похода — в одном месте" : "Everything for the journey, in one place"}</h2>
        <p>{locale === "ru" ? "Рецепты, ресурсы, трофеи и личный список крафта от Лугов до Глубокого Севера." : "Recipes, resources, trophies and your personal craft plan from the Meadows to the Deep North."}</p>
        <div className="hero-metrics"><span><b>{biomes.length || 9}</b>{locale === "ru" ? "биомов" : "biomes"}</span><span><b>70+</b>{locale === "ru" ? "трофеев" : "trophies"}</span><span><b>1.0</b>{locale === "ru" ? "актуально" : "current"}</span></div>
      </div>
      <div className="section-heading"><div><p>{locale === "ru" ? "ИССЛЕДОВАНИЕ МИРА" : "WORLD EXPLORATION"}</p><h2>{locale === "ru" ? "Биомы" : "Biomes"}</h2></div><span>{String(biomes.length || 9).padStart(2,"0")}</span></div>
      {loading ? <p className="muted">{locale === "ru" ? "Загрузка..." : "Loading..."}</p> : biomes.length === 0 ? <Empty message={locale === "ru" ? "Данные биомов появятся после первого проверенного импорта." : "Biome data will appear after the first verified import."} /> : <div className="biome-list">{biomes.map((biome, index) => <button className="biome-card" key={biome.slug} onClick={() => void openBiome(biome.slug)} style={{ "--accent": biome.accent_color ?? "#d89d46", "--art": biome.image_path ? `url(${biome.image_path})` : "none" } as CSSProperties}><span className="biome-order">{String(index + 1).padStart(2, "0")}</span><span className="biome-copy"><small>{locale === "ru" ? "БИОМ" : "BIOME"} {String(index + 1).padStart(2, "0")}</small><strong>{text(locale, biome)}</strong><p>{locale === "ru" ? biome.description_ru : biome.description_en}</p></span><span className="biome-arrow">↗</span></button>)}</div>}
    <div className="legal-note">
        <strong>{locale === "ru" ? "Неофициальный фан-проект" : "Unofficial fan project"}</strong>
        <span>{locale === "ru" ? "VALHEIM Guide не связан с Iron Gate Studio или Coffee Stain Publishing. Названия, изображения и другие игровые материалы принадлежат их правообладателям и используются в информационных и образовательных целях." : "VALHEIM Guide is not affiliated with Iron Gate Studio or Coffee Stain Publishing. Game names, images and other game materials belong to their respective rights holders and are used for informational and educational purposes."}</span>
        <a href="https://www.valheimgame.com/eula/" target="_blank" rel="noreferrer">{locale === "ru" ? "Условия использования Valheim ↗" : "Valheim usage terms ↗"}</a>
      </div></section>}

    {section === "search" && <section><div className="section-heading"><div><p>{locale === "ru" ? "ПОИСК ПО СПРАВОЧНИКУ" : "GUIDE SEARCH"}</p><h2>{locale === "ru" ? "Результаты" : "Results"}</h2></div>{query.length >= 2 && <span>{String(results.length).padStart(2,"0")}</span>}</div>{query.length < 2 ? <Empty message={locale === "ru" ? "Введите минимум 2 символа." : "Type at least 2 characters."} /> : <ResultList locale={locale} items={results} onOpen={openEntry} />}</section>}

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
      <SectionTitle eyebrow={locale === "ru" ? "ПРИМЕНЕНИЕ" : "USES"} title={locale === "ru" ? "Используется в" : "Used in"} />
      <ResultList locale={locale} items={resource.used_by} onOpen={openEntry} /><SourceLink locale={locale} entry={resource} />
    </section>}

    {section === "creature" && <section className="detail creature-detail">
      {!creature ? <Empty message={locale === "ru" ? "Загружаем боевые данные..." : "Loading combat data..."} /> : <CreatureDetailView locale={locale} creature={creature} boss={biomeBoss?.slug === creature.slug ? biomeBoss : null} />}
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
      const active = section === id || (id === "home" && section === "biome");
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

function Empty({ message }: { message: string }) { return <div className="empty">{message}</div>; }
