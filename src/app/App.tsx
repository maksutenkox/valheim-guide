import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { api } from "./services/api";
import type { Biome, Category, CraftList, CraftResourceTotal, GuideItem, ItemDetail, Locale, ResourceDetail } from "./types";
import "./styles.css";

type Section = "home" | "search" | "craft" | "favorites" | "biome" | "item" | "resource";
type NavSection = "home" | "search" | "craft" | "favorites";

const text = (locale: Locale, object: { name_en: string; name_ru: string }) => locale === "ru" ? object.name_ru : object.name_en;
const categoryText = (locale: Locale, item: GuideItem) => locale === "ru" ? item.category_name_ru : item.category_name_en;
const statLabel = (locale: Locale, key: string) => ({
  slash_damage: locale === "ru" ? "Урон рубящий" : "Slash damage",
  chop: locale === "ru" ? "Рубка" : "Chop",
  durability: locale === "ru" ? "Прочность" : "Durability",
  stamina_use: locale === "ru" ? "Затраты выносливости" : "Stamina use",
  armor: locale === "ru" ? "Броня" : "Armor"
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
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [favorites, setFavorites] = useState<GuideItem[]>([]);
  const [craftLists, setCraftLists] = useState<CraftList[]>([]);
  const [activeCraftList, setActiveCraftList] = useState<CraftList | null>(null);
  const [craftTotals, setCraftTotals] = useState<CraftResourceTotal[]>([]);

  useEffect(() => {
    window.Telegram?.WebApp?.ready?.();
    window.Telegram?.WebApp?.expand?.();
    api.biomes().then(({ data }) => setBiomes(data)).catch(() => setMessage(locale === "ru" ? "Не удалось загрузить биомы." : "Could not load biomes.")).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query.trim().length < 2) return setResults([]);
      api.search(query).then(({ data }) => setResults(data)).catch(() => setResults([]));
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  const title = useMemo(() => ({
    home: "VALHEIM Guide", search: locale === "ru" ? "Поиск" : "Search", craft: locale === "ru" ? "Крафт" : "Craft",
    favorites: locale === "ru" ? "Избранное" : "Favorites", biome: text(locale, currentBiome ?? { name_en: "Biome", name_ru: "Биом" }),
    item: item ? text(locale, item) : locale === "ru" ? "Предмет" : "Item",
    resource: resource ? text(locale, resource) : locale === "ru" ? "Ресурс" : "Resource"
  })[section], [currentBiome, item, locale, resource, section]);

  const openBiome = async (slug: string) => {
    setMessage(""); setSection("biome"); setCurrentBiome(null); setBiomeItems([]); setActiveCategory(undefined);
    try {
      const [{ data: biome }, { data: items }] = await Promise.all([api.biome(slug), api.items(slug)]);
      setCurrentBiome(biome); setBiomeItems(items);
    } catch { setMessage(locale === "ru" ? "Не удалось открыть биом." : "Could not open biome."); }
  };

  const filterBiome = async (category?: string) => {
    if (!currentBiome) return;
    setActiveCategory(category);
    try { setBiomeItems((await api.items(currentBiome.slug, category)).data); } catch { setMessage(locale === "ru" ? "Не удалось загрузить предметы." : "Could not load items."); }
  };

  const openEntry = async (entry: GuideItem) => {
    setMessage("");
    try {
      if (entry.entity_type === "resource") {
        setSection("resource"); setResource((await api.resource(entry.slug)).data);
      } else {
        setSection("item"); setItem((await api.item(entry.slug)).data);
      }
    } catch { setMessage(locale === "ru" ? "Не удалось загрузить карточку." : "Could not load this entry."); }
  };

  const openItem = async (slug: string) => {
    setMessage(""); setSection("item");
    try { setItem((await api.item(slug)).data); } catch { setMessage(locale === "ru" ? "Не удалось загрузить предмет." : "Could not load item."); }
  };

  const openResource = async (slug: string) => {
    setMessage(""); setSection("resource");
    try { setResource((await api.resource(slug)).data); } catch { setMessage(locale === "ru" ? "Не удалось загрузить ресурс." : "Could not load resource."); }
  };

  const goNav = async (next: NavSection) => {
    setMessage(""); setSection(next);
    if (next === "favorites") {
      try { setFavorites((await api.favorites()).data); }
      catch { setMessage(locale === "ru" ? "Избранное доступно после открытия гайда внутри Telegram." : "Favorites are available after opening the guide inside Telegram."); }
    }
    if (next === "craft") {
      try {
        const { data } = await api.craftLists();
        setCraftLists(data);
        const selected = activeCraftList && data.find((list) => list.id === activeCraftList.id) ? activeCraftList : data[0] ?? null;
        setActiveCraftList(selected);
        setCraftTotals(selected ? (await api.craftSummary(selected.id)).data : []);
      } catch { setMessage(locale === "ru" ? "Список крафта доступен после открытия гайда внутри Telegram." : "Craft lists are available after opening the guide inside Telegram."); }
    }
  };

  const createCraftList = async () => {
    try {
      const { data } = await api.createCraftList(locale === "ru" ? "Мой крафт" : "My craft list");
      setCraftLists((lists) => [data, ...lists]); setActiveCraftList(data); setCraftTotals([]);
    } catch { setMessage(locale === "ru" ? "Создание списка доступно внутри Telegram." : "Creating a list is available inside Telegram."); }
  };

  const addToCraftList = async () => {
    if (!item) return;
    try {
      let target = activeCraftList;
      if (!target) {
        const { data } = await api.createCraftList(locale === "ru" ? "Мой крафт" : "My craft list");
        target = data; setCraftLists((lists) => [data, ...lists]); setActiveCraftList(data);
      }
      await api.addCraftItem(target.id, item.id);
      setCraftTotals((await api.craftSummary(target.id)).data);
      setMessage(locale === "ru" ? "Добавлено в список крафта." : "Added to craft list.");
    } catch { setMessage(locale === "ru" ? "Добавление доступно внутри Telegram." : "Adding is available inside Telegram."); }
  };

  const selectCraftList = async (list: CraftList) => {
    setActiveCraftList(list);
    try { setCraftTotals((await api.craftSummary(list.id)).data); } catch { setMessage(locale === "ru" ? "Не удалось загрузить расчёт." : "Could not load calculation."); }
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
    } catch { setMessage(locale === "ru" ? "Сохранение доступно внутри Telegram." : "Saving is available inside Telegram."); }
  };

  const goBack = () => {
    setMessage("");
    if (section === "item" || section === "resource") return currentBiome ? setSection("biome") : setSection("search");
    if (section === "biome") return setSection("home");
    setSection("home");
  };

  const showSearch = section === "home" || section === "search";
  const saved = item ? favorites.some((favorite) => favorite.id === item.id) : false;

  return <main className="app-shell">
    <header className="topbar">
      <div>{!(["home", "search", "craft", "favorites"] as Section[]).includes(section) && <button className="back" onClick={goBack}>‹ {locale === "ru" ? "Назад" : "Back"}</button>}<p className="eyebrow">Unofficial fan guide</p><h1>{title}</h1></div>
      <button className="language" onClick={() => setLocale(locale === "ru" ? "en" : "ru")}>{locale.toUpperCase()}</button>
    </header>

    {showSearch && <label className="search"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSection("search"); }} placeholder={locale === "ru" ? "Найти предмет или ресурс..." : "Find an item or resource..."} /></label>}
    {message && <p className="notice">{message}</p>}

    {section === "home" && <section><h2>{locale === "ru" ? "Биомы" : "Biomes"}</h2>
      {loading ? <p className="muted">{locale === "ru" ? "Загрузка..." : "Loading..."}</p> : biomes.length === 0 ? <Empty message={locale === "ru" ? "Данные биомов появятся после первого проверенного импорта." : "Biome data will appear after the first verified import."} /> : <div className="biome-list">{biomes.map((biome, index) => <button className="biome-card" key={biome.slug} onClick={() => void openBiome(biome.slug)} style={{ "--accent": biome.accent_color ?? "#d89d46", "--art": biome.image_path ? `url(${biome.image_path})` : "none" } as CSSProperties}><span className="biome-order">{String(index + 1).padStart(2, "0")}</span><span className="biome-copy"><strong>{text(locale, biome)}</strong><small>{locale === "ru" ? biome.description_ru : biome.description_en}</small></span><span className="biome-arrow">›</span></button>)}</div>}
    </section>}

    {section === "search" && <section><h2>{locale === "ru" ? "Результаты" : "Results"}</h2>{query.length < 2 ? <Empty message={locale === "ru" ? "Введите минимум 2 символа." : "Type at least 2 characters."} /> : <ResultList locale={locale} items={results} onOpen={openEntry} />}</section>}

    {section === "biome" && <section>{!currentBiome ? <Empty message={locale === "ru" ? "Загружаем биом..." : "Loading biome..."} /> : <><p className="lede">{locale === "ru" ? currentBiome.description_ru : currentBiome.description_en}</p><div className="chips"><button className={!activeCategory ? "chip active" : "chip"} onClick={() => void filterBiome()}>{locale === "ru" ? "Все" : "All"}</button>{currentBiome.categories.map((category) => <button className={activeCategory === category.slug ? "chip active" : "chip"} key={category.slug} onClick={() => void filterBiome(category.slug)}>{text(locale, category)}</button>)}</div><ResultList locale={locale} items={biomeItems} onOpen={openEntry} /></>}</section>}

    {section === "item" && item && <section className="detail"><p className="item-type">{categoryText(locale, item) ?? (locale === "ru" ? "Предмет" : "Item")}</p><p className="lede">{locale === "ru" ? item.description_ru : item.description_en}</p><div className="detail-actions"><button className="save" onClick={() => void toggleFavorite()}>{saved ? "♥" : "♡"} {saved ? (locale === "ru" ? "Сохранено" : "Saved") : (locale === "ru" ? "В избранное" : "Save")}</button><button className="save" onClick={() => void addToCraftList()}>⚒ {locale === "ru" ? "В мой крафт" : "Add to craft"}</button></div><DetailStats locale={locale} item={item} /><Recipe locale={locale} item={item} onResource={openResource} /><Upgrades locale={locale} item={item} onResource={openResource} /></section>}

    {section === "resource" && resource && <section className="detail"><p className="item-type">{locale === "ru" ? "Материал" : "Material"}</p><p className="lede">{locale === "ru" ? resource.description_ru : resource.description_en}</p><h2>{locale === "ru" ? "Где найти" : "Where to find"}</h2>{resource.sources.length ? <div className="source-list">{resource.sources.map((source, index) => <p key={index}>{locale === "ru" ? source.method_ru : source.method_en}</p>)}</div> : <Empty message={locale === "ru" ? "Проверенный источник пока добавляется." : "A verified source is being added."} />}<h2>{locale === "ru" ? "Используется в" : "Used in"}</h2><ResultList locale={locale} items={resource.used_by} onOpen={openEntry} /></section>}

    {section === "craft" && <section><div className="section-row"><h2>{locale === "ru" ? "Мой крафт" : "My craft"}</h2><button className="save" onClick={() => void createCraftList()}>+ {locale === "ru" ? "Список" : "List"}</button></div>{craftLists.length > 1 && <div className="chips">{craftLists.map((list) => <button className={activeCraftList?.id === list.id ? "chip active" : "chip"} onClick={() => void selectCraftList(list)} key={list.id}>{list.name}</button>)}</div>}{!activeCraftList ? <Empty message={locale === "ru" ? "Создайте список, затем добавляйте в него предметы из их карточек." : "Create a list, then add items from their cards."} /> : <CraftTotals locale={locale} totals={craftTotals} onResource={openResource} />}</section>}
    {section === "favorites" && <section><h2>{locale === "ru" ? "Сохранённые предметы" : "Saved items"}</h2>{message ? null : <ResultList locale={locale} items={favorites} onOpen={openEntry} />}</section>}

    <nav className="bottom-nav">{([['home', '⌂', locale === "ru" ? "Главная" : "Home"], ['search', '⌕', locale === "ru" ? "Поиск" : "Search"], ['craft', '⚒', locale === "ru" ? "Крафт" : "Craft"], ['favorites', '♡', locale === "ru" ? "Избранное" : "Saved"]] as const).map(([id, icon, label]) => <button key={id} className={section === id || (id === "home" && section === "biome") ? "active" : ""} onClick={() => void goNav(id)}><span>{icon}</span>{label}</button>)}</nav>
  </main>;
}

function DetailStats({ locale, item }: { locale: Locale; item: ItemDetail }) {
  if (!item.stats.length) return null;
  return <><h2>{locale === "ru" ? "Характеристики" : "Stats"}</h2><div className="stats">{item.stats.map((stat) => <div key={stat.stat_key}><span>{statLabel(locale, stat.stat_key)}</span><strong>{stat.stat_value}{stat.unit ? ` ${stat.unit}` : ""}</strong></div>)}</div></>;
}

function Recipe({ locale, item, onResource }: { locale: Locale; item: ItemDetail; onResource: (slug: string) => void }) {
  if (!item.ingredients.length) return null;
  return <><h2>{locale === "ru" ? "Крафт" : "Crafting"}</h2>{item.recipe && <p className="station">⚒ {text(locale, item.recipe)} · {locale === "ru" ? "ур." : "lvl."} {item.recipe.station_level}</p>}<IngredientList locale={locale} ingredients={item.ingredients} onResource={onResource} /></>;
}

function Upgrades({ locale, item, onResource }: { locale: Locale; item: ItemDetail; onResource: (slug: string) => void }) {
  if (!item.upgrades.length) return null;
  return <><h2>{locale === "ru" ? "Улучшения" : "Upgrades"}</h2><div className="upgrades">{item.upgrades.map((upgrade) => <div className="upgrade" key={upgrade.level}><strong>{locale === "ru" ? "Уровень" : "Level"} {upgrade.level}</strong>{upgrade.station_level && <span>{locale === "ru" ? "Верстак ур." : "Workbench lvl."} {upgrade.station_level}</span>}<IngredientList locale={locale} ingredients={upgrade.ingredients} onResource={onResource} /></div>)}</div></>;
}

function IngredientList({ locale, ingredients, onResource }: { locale: Locale; ingredients: ItemDetail["ingredients"]; onResource: (slug: string) => void }) {
  return <div className="ingredients">{ingredients.map((ingredient) => <button key={ingredient.slug} onClick={() => void onResource(ingredient.slug)}><b>{ingredient.quantity}×</b><span>{text(locale, ingredient)}</span><i>›</i></button>)}</div>;
}

function ResultList({ locale, items, onOpen }: { locale: Locale; items: GuideItem[]; onOpen: (item: GuideItem) => void }) {
  if (!items.length) return <Empty message={locale === "ru" ? "Ничего не найдено." : "No results found."} />;
  return <div className="result-list">{items.map((entry) => <button key={entry.id} className="result" onClick={() => void onOpen(entry)}><span className="placeholder">{entry.image_path ? "◈" : entry.entity_type === "resource" ? "◆" : "⚔"}</span><span><strong>{text(locale, entry)}</strong><small>{categoryText(locale, entry) ?? (locale === "ru" ? "Материал" : "Material")}</small></span><i>›</i></button>)}</div>;
}

function CraftTotals({ locale, totals, onResource }: { locale: Locale; totals: CraftResourceTotal[]; onResource: (slug: string) => void }) {
  if (!totals.length) return <Empty message={locale === "ru" ? "Добавьте предмет из его карточки — здесь появится общий список ресурсов." : "Add an item from its card to see the combined resource list."} />;
  return <div className="craft-totals">{totals.map((total) => <button key={total.resource_id} onClick={() => void onResource(total.slug)}><span><strong>{text(locale, total)}</strong><small>{locale === "ru" ? `Нужно: ${total.required} · есть: ${total.owned}` : `Need: ${total.required} · have: ${total.owned}`}</small></span><b>{total.remaining}</b></button>)}</div>;
}

function Empty({ message }: { message: string }) { return <div className="empty">{message}</div>; }
