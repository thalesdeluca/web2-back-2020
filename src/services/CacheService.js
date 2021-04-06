module.exports = (redis) => {
  setCache: (params, value) => {
    return redis.set(JSON.stringify(params), JSON.stringify(value))
  },
  getCache: params => {
    return redis.get(JSON.stringify("params"))
  }
  clearCache: () => {
    return redis.flushAll('SYNC')
  }
}