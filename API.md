# Sure API

## Overview

Sure provides a REST API at `/api/v1/`. All responses are JSON.

**Base URL (production):** `https://app.sure.am`

**Base URL (local dev):** `http://localhost:3000`

**Interactive docs (dev only):** `http://localhost:3000/api-docs`

## Authentication

All endpoints (except Auth) require an API key passed as a header:

```sh
X-Api-Key: your_api_key_here
```

Generate an API key from your account settings in the app.

## Pagination

Paginated endpoints accept these query parameters:

| Parameter  | Default | Max | Description      |
| ---------- | ------- | --- | ---------------- |
| `page`     | 1       | —   | Page number      |
| `per_page` | 25      | 100 | Results per page |

Paginated responses include a `pagination` object:

```json
{
  "pagination": {
    "page": 1,
    "per_page": 25,
    "total_count": 142,
    "total_pages": 6
  }
}
```

## Endpoints

### Auth

| Method | Path                      | Description                            |
| ------ | ------------------------- | -------------------------------------- |
| POST   | `/api/v1/auth/signup`     | Sign up a new user                     |
| POST   | `/api/v1/auth/login`      | Log in with email and password         |
| POST   | `/api/v1/auth/refresh`    | Refresh an access token                |
| POST   | `/api/v1/auth/sso_exchange` | Exchange mobile SSO code for tokens  |
| PATCH  | `/api/v1/auth/enable_ai`  | Enable AI features for current user    |

### Accounts

| Method | Path                  | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/api/v1/accounts`    | List accounts        |

Query parameters:

| Parameter  | Description                          |
| ---------- | ------------------------------------ |
| `page`     | Page number                          |
| `per_page` | Items per page (default: 25, max: 100) |

### Transactions

| Method | Path                         | Description              |
| ------ | ---------------------------- | ------------------------ |
| GET    | `/api/v1/transactions`       | List transactions        |
| POST   | `/api/v1/transactions`       | Create a transaction     |
| GET    | `/api/v1/transactions/:id`   | Retrieve a transaction   |
| PATCH  | `/api/v1/transactions/:id`   | Update a transaction     |
| DELETE | `/api/v1/transactions/:id`   | Delete a transaction     |

#### List transactions — query parameters

| Parameter       | Description                                   |
| --------------- | --------------------------------------------- |
| `page`          | Page number                                   |
| `per_page`      | Items per page (default: 25, max: 100)        |
| `account_id`    | Filter by a single account ID                 |
| `account_ids[]` | Filter by multiple account IDs                |
| `category_id`   | Filter by a single category ID                |
| `category_ids[]`| Filter by multiple category IDs               |
| `merchant_id`   | Filter by a single merchant ID                |
| `merchant_ids[]`| Filter by multiple merchant IDs               |
| `tag_ids[]`     | Filter by tag IDs                             |
| `start_date`    | From date, inclusive (e.g. `2025-01-01`)      |
| `end_date`      | To date, inclusive                            |
| `min_amount`    | Minimum amount                                |
| `max_amount`    | Maximum amount                                |
| `type`          | `income` or `expense`                         |
| `search`        | Search by name, notes, or merchant name       |

#### Create/update transaction — request body

```json
{
  "transaction": {
    "account_id": "uuid",
    "date": "2025-03-15",
    "amount": 42.50,
    "name": "Coffee",
    "notes": "optional",
    "currency": "USD",
    "nature": "expense",
    "category_id": "uuid",
    "merchant_id": "uuid",
    "tag_ids": ["uuid"]
  }
}
```

`nature` values: `income`, `expense`, `inflow`, `outflow` — determines the sign of the amount.

#### Example: list all transactions

```bash
curl -H "X-Api-Key: your_api_key" \
  "http://localhost:3000/api/v1/transactions?per_page=100&start_date=2025-01-01"
```

### Categories

| Method | Path                       | Description            |
| ------ | -------------------------- | ---------------------- |
| GET    | `/api/v1/categories`       | List categories        |
| GET    | `/api/v1/categories/:id`   | Retrieve a category    |

Query parameters:

| Parameter        | Description                                      |
| ---------------- | ------------------------------------------------ |
| `classification` | `income` or `expense`                            |
| `roots_only`     | `true` to return only top-level categories       |
| `parent_id`      | Filter by parent category UUID                   |

### Merchants

| Method | Path                      | Description           |
| ------ | ------------------------- | --------------------- |
| GET    | `/api/v1/merchants`       | List merchants        |
| GET    | `/api/v1/merchants/:id`   | Retrieve a merchant   |

### Tags

| Method | Path                  | Description       |
| ------ | --------------------- | ----------------- |
| GET    | `/api/v1/tags`        | List tags         |
| POST   | `/api/v1/tags`        | Create a tag      |
| GET    | `/api/v1/tags/:id`    | Retrieve a tag    |
| PATCH  | `/api/v1/tags/:id`    | Update a tag      |
| DELETE | `/api/v1/tags/:id`    | Delete a tag      |

#### Create/update tag — request body

```json
{
  "tag": {
    "name": "Travel",
    "color": "#ff5733"
  }
}
```

`color` is optional — auto-assigned if omitted.

### Trades

| Method | Path                   | Description       |
| ------ | ---------------------- | ----------------- |
| GET    | `/api/v1/trades`       | List trades       |
| POST   | `/api/v1/trades`       | Create a trade    |
| GET    | `/api/v1/trades/:id`   | Retrieve a trade  |
| PATCH  | `/api/v1/trades/:id`   | Update a trade    |
| DELETE | `/api/v1/trades/:id`   | Delete a trade    |

Query parameters (list): `page`, `per_page`, `account_id`, `account_ids[]`, `start_date`, `end_date`.

### Holdings

| Method | Path                      | Description          |
| ------ | ------------------------- | -------------------- |
| GET    | `/api/v1/holdings`        | List holdings        |
| GET    | `/api/v1/holdings/:id`    | Retrieve a holding   |

Query parameters: `page`, `per_page`, `account_id`, `account_ids[]`, `date`, `start_date`, `end_date`, `security_id`.

### Imports

| Method | Path                    | Description          |
| ------ | ----------------------- | -------------------- |
| GET    | `/api/v1/imports`       | List imports         |
| POST   | `/api/v1/imports`       | Create an import     |
| GET    | `/api/v1/imports/:id`   | Retrieve an import   |

Import types: `TransactionImport`, `TradeImport`, `AccountImport`, `MintImport`, `CategoryImport`, `RuleImport`.

### Chats (AI)

| Method | Path                                    | Description                      |
| ------ | --------------------------------------- | -------------------------------- |
| GET    | `/api/v1/chats`                         | List chats                       |
| POST   | `/api/v1/chats`                         | Create a chat                    |
| GET    | `/api/v1/chats/:id`                     | Retrieve a chat                  |
| PATCH  | `/api/v1/chats/:id`                     | Update a chat                    |
| DELETE | `/api/v1/chats/:id`                     | Delete a chat                    |
| POST   | `/api/v1/chats/:chat_id/messages`       | Send a message                   |
| POST   | `/api/v1/chats/:chat_id/messages/retry` | Retry last assistant response    |

Requires AI features to be enabled on the account.

## Error Responses

All errors follow this shape:

```json
{
  "error": "not_found",
  "message": "Transaction not found",
  "errors": []
}
```

Common status codes:

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 401  | Missing or invalid API key           |
| 403  | Insufficient scope or feature disabled |
| 404  | Resource not found                   |
| 422  | Validation failed                    |
| 500  | Internal server error                |
