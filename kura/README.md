# Ledger — Personal Finance & Budgeting Tracker

A full-stack personal finance tracker: Spring Boot + PostgreSQL backend, React (Vite) frontend.
Track income and expenses, set monthly budgets per category, automate recurring transactions
(rent, subscriptions, salary), import bank statement CSVs, and see spending trends on a
real analytics dashboard.

## Features

- **Auth**: JWT access tokens + rotating refresh tokens, BCrypt password hashing
- **Transactions**: manual entry, edit, delete, filter by category/date, paginated list
- **Categories**: seeded system defaults (Housing, Groceries, Salary, etc.) plus custom user categories
- **Budgets**: monthly limit per category, live spend/remaining/percent-used calculation
- **Recurring transactions**: daily/weekly/biweekly/monthly/yearly schedules, posted automatically
  by a Spring `@Scheduled` job (with catch-up logic if the server was offline)
- **CSV import**: flexible column detection (date/amount required; description/merchant optional),
  auto-classifies income vs. expense from the amount's sign, tracks import batches for audit history
- **Analytics dashboard**: income vs. expenses, net savings + savings rate, 6-month trend chart,
  category spending breakdown, budget pacing — all in one view
- **API docs**: Swagger UI at `/swagger-ui.html` once the backend is running

## Tech Stack

| Layer | Stack |
|---|---|
| Backend | Java 17, Spring Boot 3.3, Spring Security, Spring Data JPA, Flyway, PostgreSQL, JJWT, OpenCSV |
| Frontend | React 18, Vite, React Router, Recharts, Axios, lucide-react |
| Infra | Docker Compose (Postgres + backend + frontend) |
<!-- Badge achievement test -->

## Project structure

```
budget-tracker/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/budgettracker/
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Spring Data repositories
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST endpoints
│   │   ├── dto/             # Request/response records
│   │   ├── security/        # JWT filter + utils
│   │   ├── config/          # Security & CORS config
│   │   ├── scheduler/       # Recurring transaction job
│   │   └── exception/       # Global error handling
│   └── src/main/resources/
│       ├── application.yml
│       └── db/migration/    # Flyway SQL migrations
├── frontend/                 # React app
│   └── src/
│       ├── pages/            # Dashboard, Transactions, Budgets, Recurring, Import, Login, Register
│       ├── components/       # Sidebar, charts, forms, shared UI
│       ├── context/          # Auth context
│       ├── api/              # Axios client with token refresh
│       └── styles/           # Design tokens (theme.css)
└── docker-compose.yml
```

## Running locally

### Option A — Docker Compose (easiest)

Requires Docker installed.

```bash
docker compose up --build
```

- Backend: http://localhost:8080 (Swagger UI at `/swagger-ui.html`)
- Frontend: http://localhost:5173
- Postgres: localhost:5432 (user `budget_user` / password `budget_pass` / db `budget_tracker`)

### Option B — Run each piece manually

**1. Start Postgres** (or use Docker just for the DB):

```bash
docker run -d --name budget-tracker-db \
  -e POSTGRES_DB=budget_tracker \
  -e POSTGRES_USER=budget_user \
  -e POSTGRES_PASSWORD=budget_pass \
  -p 5432:5432 postgres:16-alpine
```

**2. Backend** (requires JDK 17+ and Maven):

```bash
cd backend
mvn spring-boot:run
```

Flyway will auto-create the schema and seed default categories on first run.
The API listens on `http://localhost:8080`.

**3. Frontend** (requires Node 18+):

```bash
cd frontend
cp .env.example .env   # adjust VITE_API_BASE_URL if needed
npm install
npm run dev
```

Open `http://localhost:5173`, register an account, and you're in.

## Environment variables (backend)

| Variable | Default | Purpose |
|---|---|---|
| `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` | see `application.yml` | Postgres connection |
| `JWT_SECRET` | dev placeholder | **Change this in production** — sign key for access tokens |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin |
| `PLAID_CLIENT_ID` / `PLAID_SECRET` | empty | Reserved for Plaid sandbox bank-linking (not yet wired to a controller — see below) |

## Design notes

The UI intentionally avoids the generic "AI app" look: off-white background, deep-charcoal text,
a single restrained navy accent used only for primary actions, flat 1px borders instead of drop
shadows, and a maximum 4px corner radius throughout. Forest green and muted clay-red are used only
for semantic meaning (income/under-budget vs. expense/over-budget), never decoratively.

## Extending this project (good next steps for a portfolio)

- **Wire up Plaid**: the `application.yml` already reserves `PLAID_CLIENT_ID`/`PLAID_SECRET`.
  Add a `PlaidService` + `/api/plaid/link-token` and `/api/plaid/exchange` endpoints, then map
  Plaid's `transactions/sync` response into the existing `Transaction` entity.
- **Tests**: add `@WebMvcTest` controller tests and `@DataJpaTest` repository tests using the
  H2 profile already configured in `src/test/resources/application-test.yml`.
- **CI**: a GitHub Actions workflow running `mvn test` and `npm run build` on push is a natural add.
- **Multi-currency**: `users.currency` is already modeled; add conversion at read time for a
  more advanced version.
