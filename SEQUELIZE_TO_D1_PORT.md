# Sequelize-to-D1 migration inventory

The current API is built around Sequelize models and controller-level Sequelize operations. D1 is accessed through its SQL binding (`env.DB.prepare(...)`), not through the existing Sequelize SQLite/PostgreSQL connection. A database URL swap is therefore not a valid migration.

## Generate the source inventory

From `backend/`, run:

```bash
node scripts/audit-sequelize-usage.js
```

This writes `cloudflare/reports/sequelize-usage.json`. It is a dependency-free static inventory of candidate reads, writes, joins, transactions, raw queries, operators, and model-instance methods. Review matches in context before porting them.

## Porting rules

1. Preserve existing API request/response shapes and tenant scoping.
2. Replace controller use of Sequelize models with explicit D1 repositories; do not create a fake Sequelize shim.
3. Use parameterized D1 statements for all values.
4. Use D1 `batch()` for related statements where atomic batch semantics fit; redesign multi-step transactions explicitly and test failure behavior.
5. Replace `include` joins with explicit SQL joins and map rows to the response shape expected by the frontend.
6. Port each feature group with tests before switching its route to D1.
7. Do not run schema migrations against production until the generated SQL has been reviewed and backed up.

## Runtime boundaries to address separately

- `node-cron` must become Cloudflare Cron Triggers or Queues.
- Local/SQLite file persistence is not available in Workers; uploaded files belong in R2.
- Nodemailer SMTP assumptions need a supported email provider/API integration.
- PostgreSQL/SQLite drivers and Sequelize are not the D1 access path.
- Flutterwave remains an external payment integration; secrets must be Worker secrets, not frontend variables.

This document is a migration guide, not a claim that the API has already been ported.
