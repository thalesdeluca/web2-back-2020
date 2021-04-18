const cache = require("express-redis-cache")({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

module.exports = cache