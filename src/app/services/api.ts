import type { Biome, BossSummary, Category, CraftList, CraftListItem, CraftResourceTotal, CreatureDetail, CreatureSummary, FoodSummary, GuideItem, ItemDetail, ResourceDetail, TamingGuide } from "../types";

declare global {
  interface Window {
    Telegram?: { WebApp?: { initData?: string; ready?: () => void; expand?: () => void } };
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const telegramInitData = (): string | undefined => {
  const fromSdk = window.Telegram?.WebApp?.initData?.trim();
  if (fromSdk) return fromSdk;

  const hashParams = new URLSearchParams(window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash);
  const searchParams = new URLSearchParams(window.location.search);
  return hashParams.get("tgWebAppData")?.trim() || searchParams.get("tgWebAppData")?.trim() || undefined;
};

const headers = (): HeadersInit => {
  const initData = telegramInitData();
  if (!initData) return {};
  return {
    "x-telegram-init-data": initData,
    authorization: `tma ${initData}`
  };
};

const apiError = async (response: Response): Promise<ApiError> => {
  let message = `API error: ${response.status}`;
  try {
    const payload = await response.json() as { error?: string };
    if (payload.error) message = payload.error;
  } catch {
    // Keep the HTTP status fallback.
  }
  return new ApiError(response.status, message);
};

const request = async <T>(path: string): Promise<T> => {
  const response = await fetch(path, { headers: { ...headers() } });
  if (!response.ok) throw await apiError(response);
  return response.json() as Promise<T>;
};

const mutation = async <T>(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<T> => {
  const response = await fetch(path, {
    method,
    headers: {
      ...headers(),
      ...(body ? { "content-type": "application/json" } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  if (!response.ok) throw await apiError(response);
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
};

export const api = {
  authStatus: () => request<{ authenticated: boolean; initDataPresent: boolean; userId?: string; error?: string }>("/api/auth-status"),
  biomes: () => request<{ data: Biome[] }>("/api/biomes"),
  biome: (slug: string) => request<{ data: Biome & { categories: Category[] } }>(`/api/biomes/${slug}`),
  items: (biome: string, category?: string) => request<{ data: GuideItem[] }>(`/api/items?biome=${encodeURIComponent(biome)}${category ? `&category=${encodeURIComponent(category)}` : ""}`),
  item: (slug: string) => request<{ data: ItemDetail }>(`/api/items/${slug}`),
  resource: (slug: string) => request<{ data: ResourceDetail }>(`/api/resources/${slug}`),
  creatures: (biome: string) => request<{ data: CreatureSummary[] }>(`/api/creatures?biome=${encodeURIComponent(biome)}`),
  creature: (slug: string) => request<{ data: CreatureDetail }>(`/api/creatures/${slug}`),
  boss: (biome: string) => request<{ data: BossSummary | null }>(`/api/bosses?biome=${encodeURIComponent(biome)}`),
  bosses: () => request<{ data: BossSummary[] }>("/api/bosses"),
  foods: () => request<{ data: FoodSummary[] }>("/api/foods"),
  taming: () => request<{ data: TamingGuide[] }>("/api/taming"),
  trophies: () => request<{ data: GuideItem[] }>("/api/trophies"),
  search: (query: string) => request<{ data: GuideItem[] }>(`/api/search?q=${encodeURIComponent(query)}`),
  favorites: () => request<{ data: GuideItem[] }>("/api/favorites"),
  addFavorite: (itemId: number) => mutation<{ status: string }>(`/api/favorites/${itemId}`, "POST"),
  removeFavorite: (itemId: number) => mutation<void>(`/api/favorites/${itemId}`, "DELETE"),
  craftLists: () => request<{ data: CraftList[] }>("/api/craft-lists"),
  createCraftList: (name: string) => mutation<{ data: CraftList }>("/api/craft-lists", "POST", { name }),
  renameCraftList: (listId: number, name: string) => mutation<{ data: CraftList }>(`/api/craft-lists/${listId}`, "PATCH", { name }),
  deleteCraftList: (listId: number) => mutation<void>(`/api/craft-lists/${listId}`, "DELETE"),
  craftItems: (listId: number) => request<{ data: CraftListItem[] }>(`/api/craft-lists/${listId}/items`),
  addCraftItem: (listId: number, itemId: number, quantity = 1, targetLevel = 1) => mutation<{ status: string }>(`/api/craft-lists/${listId}/items`, "POST", { itemId, quantity, targetLevel }),
  updateCraftItem: (listId: number, itemId: number, quantity: number, targetLevel = 1) =>
    mutation<{ status: string }>(`/api/craft-lists/${listId}/items/${itemId}`, "PATCH", { quantity, targetLevel }),
  removeCraftItem: (listId: number, itemId: number) =>
    mutation<void>(`/api/craft-lists/${listId}/items/${itemId}`, "DELETE"),
  craftSummary: (listId: number) => request<{ data: CraftResourceTotal[] }>(`/api/craft-lists/${listId}/summary`),
  updateCraftResource: (listId: number, resourceId: number, quantityOwned: number) =>
    mutation<{ status: string }>(`/api/craft-lists/${listId}/resources/${resourceId}`, "PATCH", { quantityOwned })
};
