const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dialect === 'postgres') {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set when DB_DIALECT=postgres');
  }
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production'
        ? { require: true, rejectUnauthorized: false }
        : false,
    },
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../../', process.env.SQLITE_STORAGE || './data/tracehub.sqlite'),
    logging: false,
  });
}

module.exports = sequelize;
