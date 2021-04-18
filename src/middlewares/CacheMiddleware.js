const cache = require("../config/redis");

const middleware = (name) => {
   return (req, res, next) => {
     res.express_redis_cache_name = `${name}-${JSON.stringify(req.query)}-${JSON.stringify(req.params)}`

     return cache.route()(req, res, next);
   }
}

module.exports = middleware;