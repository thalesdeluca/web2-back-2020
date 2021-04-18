const Knex = require("knex");
require('dotenv').config()

module.exports = Knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
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
  },
  debug: true,
})