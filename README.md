# TraceHub Cloudflare migration workspace

The public frontend remains on Cloudflare Pages. The API and database migration is being developed separately from the existing `main` deployment.

## First migration artifact: authoritative D1 schema export

The current backend defines its relational schema through Sequelize models and associations. Do not hand-convert only a subset of those models: missing columns or foreign keys would cause runtime failures and/or data loss.

From the `backend` directory, run:

```bash
npm install
npm run cloudflare:schema
```

This runs Sequelize against a temporary SQLite database, syncs the complete model graph, and writes `cloudflare/migrations/0001_initial_schema.sql`. The temporary database is outside the project and is deleted after export. The live development/production database is not opened or modified.

Review the generated SQL before applying it. Then, from the repository root, create a D1 database and apply the migration with Wrangler:

```bash
npx wrangler d1 create tracehub-inventory
npx wrangler d1 migrations apply tracehub-inventory --local
npx wrangler d1 migrations apply tracehub-inventory --remote
```

Do not apply the migration to a database containing important data until a backup and a tested import plan exist. This schema export is only the database-structure milestone; it does not yet make the existing Sequelize controllers compatible with D1. The API data-access layer and all controller queries must be migrated and tested before switching the frontend's API URL.
