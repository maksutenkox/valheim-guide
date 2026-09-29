export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  ENVIRONMENT: "development" | "staging" | "production";
  TELEGRAM_BOT_TOKEN?: string;
  DEV_MOCK_TELEGRAM_USER_ID?: string;
}

