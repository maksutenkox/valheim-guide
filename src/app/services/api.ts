import type { Biome, GuideItem } from "../types";

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

export const api = {
  biomes: () => request<{ data: Biome[] }>("/api/biomes"),
  search: (query: string) => request<{ data: GuideItem[] }>(`/api/search?q=${encodeURIComponent(query)}`),
  favorites: () => request<{ data: GuideItem[] }>("/api/favorites")
};
