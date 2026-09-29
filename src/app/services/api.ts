import type { Biome, Category, CraftList, CraftResourceTotal, GuideItem, ItemDetail, ResourceDetail } from "../types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string; ready?: () => void; expand?: () => void } };
  }
}

const headers = (): HeadersInit => {
  const initData = window.Telegram?.WebApp?.initData;
  return initData ? { "x-telegram-init-data": initData } : {};
};

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(path, { headers: { ...headers() } });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json() as Promise<T>;
};

const mutation = async <T>(path: string, method: "POST" | "DELETE", body?: unknown): Promise<T> => {
  const response = await fetch(path, { method, headers: { ...headers(), ...(body ? { "content-type": "application/json" } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
};

export const api = {
  biomes: () => request<{ data: Biome[] }>("/api/biomes"),
  biome: (slug: string) => request<{ data: Biome & { categories: Category[] } }>(`/api/biomes/${slug}`),
  items: (biome: string, category?: string) => request<{ data: GuideItem[] }>(`/api/items?biome=${encodeURIComponent(biome)}${category ? `&category=${encodeURIComponent(category)}` : ""}`),
  item: (slug: string) => request<{ data: ItemDetail }>(`/api/items/${slug}`),
  resource: (slug: string) => request<{ data: ResourceDetail }>(`/api/resources/${slug}`),
  search: (query: string) => request<{ data: GuideItem[] }>(`/api/search?q=${encodeURIComponent(query)}`),
  favorites: () => request<{ data: GuideItem[] }>("/api/favorites"),
  addFavorite: (itemId: number) => mutation<{ status: string }>(`/api/favorites/${itemId}`, "POST"),
  removeFavorite: (itemId: number) => mutation<void>(`/api/favorites/${itemId}`, "DELETE"),
  craftLists: () => request<{ data: CraftList[] }>("/api/craft-lists"),
  createCraftList: (name: string) => mutation<{ data: CraftList }>("/api/craft-lists", "POST", { name }),
  addCraftItem: (listId: number, itemId: number, quantity = 1, targetLevel = 1) => mutation<{ status: string }>(`/api/craft-lists/${listId}/items`, "POST", { itemId, quantity, targetLevel }),
  craftSummary: (listId: number) => request<{ data: CraftResourceTotal[] }>(`/api/craft-lists/${listId}/summary`)
};
