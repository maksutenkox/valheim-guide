# VALHEIM Guide

Unofficial, mobile-first Telegram Mini App guide for Valheim. The app provides sourced game data, biome/category browsing, crafting recipes, item stats, favorites, and a personal crafting planner in Russian and English.

## Architecture

Production flow:

```text
Telegram Bot
    ↓
Telegram Mini App
    ↓
Cloudflare Worker + static assets
    ↓
Cloudflare D1
    ↑
GitHub main branch / automatic Cloudflare deployment
```

There is intentionally **no Cloudflare R2 dependency** in this project.

Images are handled in two ways:

- versioned files under `public/media/`, served through Cloudflare static assets;
- verified external game-image URLs when an asset has not yet been bundled locally.

No AI-generated item art is used.

## Current functionality

- biome navigation and category filtering;
- per-biome creature combat guide with health, resistances and verified drops;
- dedicated boss cards with summon requirements, Forsaken powers and combat recommendations;
- RU / EN names and descriptions;
- global item/resource search;
- sourced item/resource detail pages;
- recipes, crafting stations, item stats and upgrades;
- Telegram-authenticated favorites;
- multiple personal craft lists;
- planned-item quantities;
- recursive resource totals for crafted intermediate components;
- resource collection progress with `+` / `−` controls;
- automatic Black Forest catalog seeding in D1;
- catalog integrity validation in CI.

## Local setup

1. Install Node.js 22+ and pnpm.
2. Copy `.env.example` to `.dev.vars` and fill only local development values.
3. Run `pnpm install`.
4. The project configuration contains the production D1 database ID. For a fork or new Cloudflare account, replace it with that account's D1 ID.
5. Run `pnpm db:migrate:local`.
6. Run `pnpm dev` for the frontend or `pnpm dev:worker` for the Worker environment.

## Cloudflare setup

1. Authenticate Wrangler with the Cloudflare account owning the project.
2. Create or connect D1 database `valheim-guide-db` and bind it as `DB`.
3. Apply the base schema with `pnpm db:migrate:remote` when provisioning a new database.
4. Set `TELEGRAM_BOT_TOKEN` as a Worker secret; never commit it to Git.
5. Set `TELEGRAM_WEBHOOK_SECRET` as a Worker secret.
6. Keep `PUBLIC_APP_URL` pointed at the production HTTPS Mini App URL.
7. Production is expected to deploy automatically from the GitHub `main` branch through the configured Cloudflare Git integration.

Content catalog seeders are idempotent and run from the Worker when needed, so normal catalog updates do not require manually applying a new D1 seed migration.

## Telegram setup

Register the webhook as:

```text
https://<worker-domain>/api/telegram/webhook
```

Pass the same value stored in `TELEGRAM_WEBHOOK_SECRET` as Telegram's webhook `secret_token`.

The `/start` command replies with a real Telegram `web_app` button. The frontend loads the official Telegram WebApp SDK and forwards signed `initData` to protected API routes. The Worker validates that signature using `TELEGRAM_BOT_TOKEN`.

## Diagnostics

Useful production endpoints:

- `GET /api/health` — D1 connection health;
- `GET /api/version` — currently deployed build marker;
- `GET /api/catalog-status` — Black Forest catalog counts after ensuring the current catalog seed;
- `GET /api/auth-status` — Telegram Mini App authentication diagnostic.

`/api/auth-status` distinguishes missing Telegram init data, a missing Worker bot-token secret, and an invalid Telegram signature.

## Validation

Run:

```bash
pnpm check
pnpm data:validate
pnpm build
```

GitHub Actions runs these checks automatically on pushes and pull requests to `main`.

The catalog validator checks duplicate slugs, broken recipe/upgrade references and invalid ingredient quantities before production build succeeds.

## Data and attribution

Every catalog entry should retain its source metadata. Current sources include Valheim community wiki pages and current game-data references used for verification.

VALHEIM Guide is an unofficial fan project and is not affiliated with Iron Gate Studio or Coffee Stain Publishing.
