# Changelog

## Initial release — 2026-04-07

Created a TypeScript integration project for the Sure API.

Includes a `transactions.ts` script that authenticates via API key, fetches accounts and transactions from the Sure REST API, and outputs results as formatted text or JSON. The script supports filtering by account name, reversing sort order, and splitting income and expenses into separate totals via CLI flags.

Also included is `API.md`, a reference document covering authentication, pagination, and all available endpoints, plus a Postman collection (`sure-api.postman_collection.json`) for manual API exploration.
