import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const apiKey = process.env.apiKey;
const apiUrl = process.env.apiUrl;
const reverse = process.argv.includes("--reverse");
const splitIncomeAndExpenses = process.argv.includes("--split-income-and-expenses");
const jsonOutput = process.argv.includes("--json");
const accountNameIndex = process.argv.indexOf("--account-name");
const accountNameFilter = accountNameIndex !== -1 ? process.argv[accountNameIndex + 1] : null;

if (!apiKey || !apiUrl) {
  console.error(
    "Missing required environment variables: apiKey and apiUrl must be set in .env.local"
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Account {
  id: string;
  name: string;
  account_type: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Merchant {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: string;
  amount_cents: number;
  signed_amount_cents: number;
  currency: string;
  name: string;
  notes: string | null;
  classification: string;
  account: Account;
  category: Category | null;
  merchant: Merchant | null;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

interface Pagination {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}

interface TransactionsResponse {
  transactions: Transaction[];
  pagination: Pagination;
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

async function fetchTransactionsPage(
  page: number,
  perPage: number
): Promise<TransactionsResponse> {
  const url = new URL(`${apiUrl}/api/v1/transactions`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const response = await fetch(url.toString(), {
    headers: { "X-Api-Key": apiKey! },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<TransactionsResponse>;
}

async function fetchAllTransactions(): Promise<Transaction[]> {
  const perPage = 100;
  const all: Transaction[] = [];

  console.log("Fetching transactions...");

  const first = await fetchTransactionsPage(1, perPage);
  all.push(...first.transactions);

  const { total_pages, total_count } = first.pagination;
  console.log(
    `  Page 1/${total_pages} — ${total_count} total transaction(s)`
  );

  for (let page = 2; page <= total_pages; page++) {
    const data = await fetchTransactionsPage(page, perPage);
    all.push(...data.transactions);
    console.log(`  Page ${page}/${total_pages}`);
  }

  return all;
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

function escapeCsv(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toDecimalAmount(amountCents: number): string {
  return (amountCents / 100).toFixed(2);
}

function toCsv(transactions: Transaction[]): string {
  const headers = [
    "id",
    "date",
    "name",
    "amount",
    ...(splitIncomeAndExpenses ? ["income", "expense"] : []),
    "currency",
    "classification",
    "notes",
    "account_id",
    "account_name",
    "account_type",
    "category_id",
    "category_name",
    "merchant_id",
    "merchant_name",
    "tags",
    "created_at",
    "updated_at",
  ];

  const rows = transactions.map((t) =>
    [
      t.id,
      t.date,
      t.name,
      t.amount,
      ...(splitIncomeAndExpenses
        ? [
            t.classification === "income" ? toDecimalAmount(t.amount_cents) : "",
            t.classification === "expense" ? toDecimalAmount(t.amount_cents) : "",
          ]
        : []),
      t.currency,
      t.classification,
      t.notes ?? "",
      t.account.id,
      t.account.name,
      t.account.account_type,
      t.category?.id ?? "",
      t.category?.name ?? "",
      t.merchant?.id ?? "",
      t.merchant?.name ?? "",
      t.tags.map((tag) => tag.name).join("; "),
      t.created_at,
      t.updated_at,
    ]
      .map(escapeCsv)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const transactions = await fetchAllTransactions();
  if (accountNameFilter) {
    const filtered = transactions.filter((t) => t.account.name === accountNameFilter);
    if (filtered.length === 0) {
      console.warn(`Warning: no transactions found for account name "${accountNameFilter}"`);
    }
    transactions.splice(0, transactions.length, ...filtered);
  }
  if (reverse) transactions.reverse();
  if (jsonOutput) {
    console.log(JSON.stringify(transactions, null, 2));
    return;
  }

  const csv = toCsv(transactions);

  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-ZA", {
      timeZone: "Africa/Johannesburg",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(new Date())
      .map(({ type, value }) => [type, value])
  );
  const datetime = `${parts.year}-${parts.month}-${parts.day}_${parts.hour}-${parts.minute}-${parts.second}`;
  const filename = `transactions-${datetime}.csv`;
  const filepath = path.resolve(process.cwd(), filename);

  fs.writeFileSync(filepath, csv, "utf-8");

  console.log(
    `\nSaved ${transactions.length} transaction(s) to ${filename}`
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
