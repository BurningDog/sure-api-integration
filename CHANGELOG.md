# Changelog

## feat: add category filtering to transaction export — 2026-04-08

Adds `--category-id` and `--output-name` CLI flags to the transactions script. `--category-id`
filters the API request by passing `category_id` as a query parameter; `--output-name` labels the
output CSV filename with a category slug. Both account and category slugs are included in the
filename when both flags are set. Also excludes `scripts/` from version control and fixes a minor
syntax-hint omission in `API.md`.

## Docs: add README, CHANGELOG, LICENSE, and USERS (#1) - 2026-04-07

* Document all preset npm scripts and what each one produces
* List every CSV output column, including split income/expense columns introduced by the
  `--split-income-and-expenses` flag
* Add API reference section pointing to API.md, local interactive docs, and the Postman
  collection (generated from v0.6.9)
* Add CHANGELOG.md with initial release entry (2026-04-07) summarising the transactions
  script, API.md, and Postman collection
* Add MIT LICENSE.md attributed to Roger Saner

## Initial release — 2026-04-07

Created a TypeScript integration project for the Sure API.

Includes a `transactions.ts` script that authenticates via API key, fetches accounts and transactions from the Sure REST API, and outputs results as formatted text or JSON. The script supports filtering by account name, reversing sort order, and splitting income and expenses into separate totals via CLI flags.

Also included is `API.md`, a reference document covering authentication, pagination, and all available endpoints, plus a Postman collection (`sure-api.postman_collection.json`) for manual API exploration.
