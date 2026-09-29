# VALHEIM Guide

Unofficial, mobile-first Telegram Mini App guide for Valheim. It will provide sourced game data, crafting recipes, favorites, and resource planning in Russian and English.

## Current milestone: infrastructure

The repository begins with a Cloudflare Worker, the `DB` D1 binding, static assets deployed from GitHub with the Worker, a D1 migration, and `GET /api/health`. UI work intentionally starts only after the remote GitHub and Cloudflare infrastructure is verified.

## Local setup

1. Install Node.js 22+ and pnpm.
2. Copy `.env.example` to `.dev.vars` and fill only local development values.
3. Run `pnpm install`.
4. The project configuration already contains the production D1 database ID. For a fork or a new account, replace it with that account's D1 ID.
5. Run `pnpm db:migrate:local` for local validation, then `pnpm dev`.

## Cloudflare setup

1. Authenticate Wrangler with the Cloudflare account owning the project.
2. Create D1 database `valheim-guide-db` and set its ID in `wrangler.jsonc`.
3. Apply `pnpm db:migrate:remote`.
4. Set `TELEGRAM_BOT_TOKEN` as a Worker secret; do not put it in any file tracked by Git.
5. Deploy with `pnpm deploy`, then verify `/api/health` returns `{"status":"ok","database":"connected"}`.

## Data and attribution

Future importers will retain source URLs, licensing notes, and attribution. Licensed images are versioned under `public/media/` and served by Cloudflare static assets; D1 stores only their metadata and paths. No AI-generated item art is used. VALHEIM Guide is not affiliated with Iron Gate Studio or Coffee Stain Publishing.
