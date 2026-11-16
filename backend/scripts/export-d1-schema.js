#!/usr/bin/env node
/**
 * Export the authoritative Sequelize model schema as a Cloudflare D1 migration.
 * Run from backend/: npm run cloudflare:schema
 * This uses the project's own model definitions and associations, not a
 * hand-maintained approximation. It does not touch the application's DB.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const output = path.resolve(__dirname, '../../cloudflare/migrations/0001_initial_schema.sql');
const temporaryDatabase = path.join(os.tmpdir(), `tracehub-schema-${process.pid}.sqlite`);
process.env.DB_DIALECT = 'sqlite';
process.env.SQLITE_STORAGE = temporaryDatabase;

async function main() {
  // Load only after setting the isolated SQLite path.
  const { sequelize } = require('../src/models');
  try {
    await sequelize.sync({ force: true });
    const [objects] = await sequelize.query(`
      SELECT type, name, sql
      FROM sqlite_master
      WHERE sql IS NOT NULL
        AND name NOT LIKE 'sqlite_%'
        AND type IN ('table', 'index', 'trigger')
      ORDER BY CASE type WHEN 'table' THEN 0 WHEN 'index' THEN 1 ELSE 2 END, name
    `);

    const statements = objects
      .filter((item) => item.sql && !/^CREATE\s+INDEX\s+sqlite_autoindex/i.test(item.sql))
      .map((item) => `${item.sql.trim().replace(/;?$/, ';')}`);

    if (!statements.length) throw new Error('No schema objects were generated from the Sequelize models.');
    const sql = [
      '-- TraceHub Inventory: initial Cloudflare D1 schema',
      '-- Generated from backend/src/models and backend/src/models/index.js.',
      '-- Review this migration before applying it to a production D1 database.',
      'PRAGMA foreign_keys = ON;',
      ...statements,
      '',
    ].join('\n\n');

    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, sql, 'utf8');
    const tables = objects.filter((item) => item.type === 'table').length;
    const indexes = objects.filter((item) => item.type === 'index' && !item.name.startsWith('sqlite_')).length;
    console.log(`Generated ${output}`);
    console.log(`${tables} tables and ${indexes} explicit indexes exported.`);
  } finally {
    await sequelize.close();
    try { fs.rmSync(temporaryDatabase, { force: true }); } catch (_) {}
  }
}

main().catch((error) => {
  console.error('D1 schema export failed:', error.message);
  process.exitCode = 1;
});
