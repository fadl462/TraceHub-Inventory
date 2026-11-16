#!/usr/bin/env node
/**
 * Static inventory of Sequelize usage to scope the D1 port.
 * Dependency-free: run with `node scripts/audit-sequelize-usage.js` from backend/.
 * This does not modify application files or connect to any database.
 */
const fs = require('fs');
const path = require('path');
const backendRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(backendRoot, 'src');
const reportPath = path.resolve(backendRoot, '../cloudflare/reports/sequelize-usage.json');
const patterns = [
  ['model_read', /\.(findAll|findOne|findByPk|findAndCountAll|count|sum|max|min)\s*\(/g],
  ['model_write', /\.(create|bulkCreate|update|upsert|destroy|increment|decrement)\s*\(/g],
  ['transaction', /\.transaction\s*\(/g],
  ['raw_query', /\.query\s*\(/g],
  ['include_join', /\binclude\s*:/g],
  ['sequelize_operator', /\bOp\.[A-Za-z_]+/g],
  ['literal_or_fn', /\bsequelize\.(literal|fn|col)\s*\(/g],
  ['row_instance', /\.(save|reload|toJSON|get|set)\s*\(/g],
];
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : /\.js$/.test(entry.name) ? [full] : [];
  });
}
const files = walk(sourceRoot);
const findings = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const [kind, regex] of patterns) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text))) {
      const line = text.slice(0, match.index).split('\n').length;
      findings.push({ file: path.relative(backendRoot, file).replace(/\\/g, '/'), line, kind, expression: match[0] });
    }
  }
}
const byKind = Object.fromEntries(patterns.map(([kind]) => [kind, findings.filter((f) => f.kind === kind).length]));
const report = {
  generatedAt: new Date().toISOString(),
  note: 'Static pattern inventory only. Review findings in context; matches are not guaranteed to be executable Sequelize calls.',
  sourceFilesScanned: files.length,
  findingCount: findings.length,
  countsByKind: byKind,
  findings,
};
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Scanned ${files.length} source files; recorded ${findings.length} candidate usages.`);
console.log(`Report: ${reportPath}`);
console.log(JSON.stringify(byKind, null, 2));
