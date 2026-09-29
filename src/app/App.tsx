import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { api } from "./services/api";
import type { Biome, GuideItem, Locale } from "./types";
import "./styles.css";

type Section = "home" | "search" | "craft" | "favorites";

const text = (locale: Locale, object: { name_en: string; name_ru: string }) => locale === "ru" ? object.name_ru : object.name_en;

export function App() {
  const [locale, setLocale] = useState<Locale>("ru");
  const [section, setSection] = useState<Section>("home");
  const [biomes, setBiomes] = useState<Biome[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.Telegram?.WebApp?.ready?.();
    window.Telegram?.WebApp?.expand?.();
    api.biomes().then(({ data }) => setBiomes(data)).catch(() => setBiomes([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (query.trim().length < 2) return setResults([]);
      api.search(query).then(({ data }) => setResults(data)).catch(() => setResults([]));
    }, 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  const title = useMemo(() => ({ home: "VALHEIM Guide", search: locale === "ru" ? "Поиск" : "Search", craft: locale === "ru" ? "Крафт" : "Craft", favorites: locale === "ru" ? "Избранное" : "Favorites" })[section], [locale, section]);

  return <main className="app-shell">
    <header className="topbar">
      <div><p className="eyebrow">Unofficial fan guide</p><h1>{title}</h1></div>
      <button className="language" onClick={() => setLocale(locale === "ru" ? "en" : "ru")}>{locale.toUpperCase()}</button>
    </header>

    {(section === "home" || section === "search") && <label className="search">
      <span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setSection("search"); }} placeholder={locale === "ru" ? "Найти предмет или ресурс..." : "Find an item or resource..."} />
    </label>}

    {section === "home" && <section>
      <h2>{locale === "ru" ? "Биомы" : "Biomes"}</h2>
      {loading ? <p className="muted">{locale === "ru" ? "Загрузка..." : "Loading..."}</p> : biomes.length === 0 ? <Empty locale={locale} message={locale === "ru" ? "Данные биомов появятся после первого проверенного импорта." : "Biome data will appear after the first verified import."} /> : <div className="biome-grid">{biomes.map((biome) => <article className="biome-card" key={biome.slug} style={{ "--accent": biome.accent_color ?? "#d89d46" } as CSSProperties}><h3>{text(locale, biome)}</h3><p>{locale === "ru" ? biome.description_ru : biome.description_en}</p></article>)}</div>}
    </section>}

    {section === "search" && <section><h2>{locale === "ru" ? "Результаты" : "Results"}</h2>{query.length < 2 ? <Empty locale={locale} message={locale === "ru" ? "Введите минимум 2 символа." : "Type at least 2 characters."} /> : <ResultList locale={locale} items={results} />}</section>}
    {section === "craft" && <Empty locale={locale} message={locale === "ru" ? "Ваш список крафта появится здесь после добавления предметов." : "Your craft list will appear here after adding items."} />}
    {section === "favorites" && <Empty locale={locale} message={locale === "ru" ? "Здесь будут сохранённые предметы." : "Saved items will appear here."} />}

    <nav className="bottom-nav">{([['home', '⌂', locale === "ru" ? "Главная" : "Home"], ['search', '⌕', locale === "ru" ? "Поиск" : "Search"], ['craft', '⚒', locale === "ru" ? "Крафт" : "Craft"], ['favorites', '♡', locale === "ru" ? "Избранное" : "Saved"]] as const).map(([id, icon, label]) => <button key={id} className={section === id ? "active" : ""} onClick={() => setSection(id)}><span>{icon}</span>{label}</button>)}</nav>
  </main>;
}

function ResultList({ locale, items }: { locale: Locale; items: GuideItem[] }) {
  if (!items.length) return <Empty locale={locale} message={locale === "ru" ? "Ничего не найдено." : "No results found."} />;
  return <div className="result-list">{items.map((item) => <article key={item.id} className="result"><div className="placeholder">{item.image_path ? "◈" : "?"}</div><div><strong>{text(locale, item)}</strong><p>{locale === "ru" ? item.category_name_ru : item.category_name_en}</p></div></article>)}</div>;
}

function Empty({ message }: { locale: Locale; message: string }) { return <div className="empty">{message}</div>; }
