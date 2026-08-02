const app = require('./app');
const { sequelize } = require('./models');
const { startCronJobs } = require('./jobs/reminderJobs');

const PORT = process.env.PORT || 5000;

/**
 * Fail fast on missing critical secrets rather than booting successfully and
 * only discovering the problem when the first user tries to log in (JWT
 * signing throws on an undefined secret) or a webhook silently can't verify
 * (Flutterwave signature check). A misconfigured production deploy should
 * refuse to start, not appear healthy while auth is actually broken.
 */
function validateRequiredEnv() {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  if (process.env.NODE_ENV === 'production') {
    required.push('CLIENT_URL', 'DATABASE_URL');
  }
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variable(s): ${missing.join(', ')}. Refusing to start.`);
    process.exit(1);
  }
  if (process.env.NODE_ENV === 'production' && (process.env.DB_DIALECT || 'sqlite') !== 'postgres') {
    console.error('NODE_ENV=production but DB_DIALECT is not "postgres". SQLite is not safe for concurrent production traffic - set DB_DIALECT=postgres and DATABASE_URL before deploying publicly.');
    process.exit(1);
  }
}

async function start() {
  try {
    validateRequiredEnv();

    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync(); // use `npm run seed` (which runs sync({alter:true})) for schema changes
    console.log('Models synced.');

    startCronJobs();

    app.listen(PORT, () => {
      console.log(`TraceHub Inventory API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
