export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ENVIRONMENT: "development" | "staging" | "production";
  PUBLIC_APP_URL: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
  DEV_MOCK_TELEGRAM_USER_ID?: string;
}

