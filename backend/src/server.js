const app = require('./app');
const { sequelize } = require('./models');
const { startCronJobs } = require('./jobs/reminderJobs');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
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
