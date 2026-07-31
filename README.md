# TraceHub Inventory

**Asset & Inventory Management Platform** — multi-tenant SaaS for registering,
tracking, assigning, and depreciating company and individual assets.

Built from the ground up as a real, production-oriented codebase (not a demo/prototype):
Node.js/Express + Sequelize API, React + Tailwind frontend, JWT auth, Flutterwave billing,
QR-code/scan-based location tracking, and an AI-driven depreciation engine.

---

## Project structure

```
tracehub/
├── backend/     Node.js/Express API (Sequelize ORM, SQLite dev / Postgres prod)
└── frontend/    React + Vite + Tailwind SPA
```

## Feature summary

- **Multi-tenancy** — each company/individual gets an isolated workspace; a
  Super Admin console manages all tenants platform-wide.
- **Roles & permissions** — Super Admin, Company Admin, Manager, Staff, each with
  scoped access to modules (assets, team, billing, reports).
- **Asset registration** — name, brand, model, color, serial number, manufacture
  year, purchase price/date, condition, plus **company-defined dynamic fields**
  (e.g. "Warranty Expiry", "Fuel Type") added from Settings.
- **AI-driven disposal period engine** — computes scrap value, annual
  depreciation, current estimated value, and a suggested disposal date from a
  category-based knowledge base (laptops, vehicles, machinery, generators,
  etc.), matching the worked example agreed on during scoping. Optionally
  upgradeable to real LLM-assisted estimates via `ANTHROPIC_API_KEY`.
- **QR-code tracking** — every asset gets a unique printable QR/asset tag.
  Staff scan it on a phone/tablet to check assets in/out of defined location
  checkpoints (warehouses, branches) — no IoT hardware required.
- **Assignment & reminders** — assign assets to staff or outside parties, with
  automatic email + in-app reminders 3 days before and on the return due date.
- **Subscription billing** — 10 assets free for 30 days, then Basic/Pro/
  Enterprise tiers via **Flutterwave** checkout, webhook-verified renewals, and
  automatic downgrade handling on payment failure.
- **Reporting** — asset status breakdown, depreciation report, location
  activity log, fleet value.
- **Security** — bcrypt password hashing, JWT + refresh tokens, rate limiting,
  audit logging, tenant isolation checks on every route.

---

## Quick start (local development)

### 1. Backend

```bash
cd backend
cp .env.example .env      # edit values as needed (works out of the box with SQLite)
npm install
npm run seed               # creates DB schema, subscription plans, asset categories, super admin
npm run dev                 # starts on http://localhost:5000
```

Default Super Admin login (change immediately): whatever you set in `.env` as
`SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` (defaults to
`admin@tracehub.app` / `ChangeMe123!`).

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # point VITE_API_URL at your backend
npm install
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173/register` to create your first company workspace
(auto-starts a 30-day / 10-asset free trial), or log in as Super Admin at
`/login` to see the platform-wide console at `/admin`.

---

## Configuring real integrations

The app runs immediately with zero external services (SQLite database, stub
email transport that logs to console). To go fully live:

| Integration | Where | What to set |
|---|---|---|
| **Database** | `backend/.env` | Set `DB_DIALECT=postgres` and `DATABASE_URL` (e.g. from Render/Supabase/Neon) |
| **Email (SMTP)** | `backend/.env` | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` — used for verification, password reset, assignment/return reminders |
| **Flutterwave** | `backend/.env` | `FLW_PUBLIC_KEY`, `FLW_SECRET_KEY`, `FLW_WEBHOOK_SECRET_HASH` from your Flutterwave dashboard. Point a webhook at `POST /api/billing/webhook` |
| **AI-refined depreciation (optional)** | `backend/.env` | `ANTHROPIC_API_KEY` — if present, category profiles can be sharpened via `refineWithAI()` in `src/utils/depreciationEngine.js` instead of the static seed table |

## Deployment suggestions

- **Backend**: Render, Railway, or any Node host + a managed Postgres
  (switch `DB_DIALECT` to `postgres`). Run `npm run seed` once against
  production to bootstrap plans/categories/super admin, then `npm start`.
- **Frontend**: Vercel, Netlify, or GitHub Pages (static build via
  `npm run build`, output in `frontend/dist`). Set `VITE_API_URL` to your
  deployed backend URL at build time.
- **Domains**: as discussed, a primary domain for the marketing/login
  (`tracehubinventory.com`) and a subdomain for the app/admin portal
  (`portal.tracehubinventory.com`) works well with this architecture — no
  extra backend changes needed, just DNS + hosting config.

## Branding

Uses the approved TraceHub Inventory color palette and logo files:

- Primary `#1A4D8F` · Secondary `#4DA3FF` · Accent `#7ED957` · Background `#F4F7FA` · Text `#2C2C2C`
- Logo assets live in `frontend/public/branding/` (horizontal, vertical, white, and icon/favicon versions)

## Support / next steps

Natural next additions once this is live: native mobile wrapper for the scan
page (it already works in any mobile browser via camera access), SMS
reminders alongside email, and a company custom-domain proxy for the
`custom_domain` plan feature (currently flagged as `pending_review` in
Settings and needs manual DNS/reverse-proxy setup per tenant).
