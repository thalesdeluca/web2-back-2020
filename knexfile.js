// Update with your config settings.
require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: 'web2',
      user:     'chillted',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "./src/database/migrations"
    },
    seeds: {
      directory: "./src/database/seeds"
    }
  },

  production: {
    client: process.env.DB_CLIENT,
    connection: {
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "./src/database/migrations"
    },
    seeds: {
      directory: "./src/database/seeds"
    }
  },
};
