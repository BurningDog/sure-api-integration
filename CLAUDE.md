# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TypeScript scripts for the [Sure](https://github.com/we-promise/sure) personal finance REST API. Currently a single script, `src/app/transactions.ts`, which fetches all transactions and writes a CSV (or JSON to stdout). `API.md` documents the endpoints and `sure-api.postman_collection.json` was generated from Sure v0.6.9.

## Commands

Everything runs from inside `src/` (the only `package.json` lives there; there is no build, lint, or test setup):

```bash
cd src && npm install
cp .env.local.example .env.local   # then set apiKey and apiUrl
npm run transactions               # CSV, newest first
npm run transactions-json          # JSON to stdout
npx tsx app/transactions.ts --category-id <id> --category-id <id> --output-name "Groceries"   # ad-hoc flags
```

Other presets (`transactions-all`, `transactions-business`, `transactions-savings`) are listed in `package.json` and README.

## Architecture

- `src/app/transactions.ts` is a self-contained script: CLI flags are parsed directly from `process.argv` at module top (no arg-parsing library), then pagination fetch -> in-memory filter -> CSV/JSON output.
- `.env.local` is loaded relative to the **current working directory** (`dotenv.config({ path: ".env.local" })`), so always run from `src/`. CSVs are written to the repo-root `out/` folder (resolved from the script's location, created if missing).
- Auth is the `X-Api-Key` header against `${apiUrl}/api/v1/transactions`, paged at 100 per page.
- Filtering is split: `--category-id` (repeatable) is sent server-side as `category_id[]` query params, while `--account-name` is filtered client-side after all pages are fetched.
- `--output-name` only affects the CSV filename slug; it does not filter. Filenames are `transactions[-account][-outputname]-<Africa/Johannesburg timestamp>.csv`.
- CSV `amount` is the API's formatted string; the optional `income`/`expense` columns (`--split-income-and-expenses`) are derived from `amount_cents` and `classification`.

## Repo notes

- `.gitignore` excludes `*.csv`, `.env.local`, `scripts/`, and `out/`; generated exports and local helper scripts are not tracked.
- `CHANGELOG.md` is maintained by hand with a dated entry per feature/PR (newest first).
- Untracked `PR.md` / `MERGE-COMMIT.md` in the root are draft PR text, not project docs.

## Merging PRs

Before merging a PR, first write the squash-merge commit message (a title plus a short body), add it to the top of `CHANGELOG.md` as a new dated entry (`## <commit title> — YYYY-MM-DD`, followed by the body), and commit and push that to the PR branch. Then squash-merge using that same message, so the CHANGELOG entry and the commit on `main` match.
