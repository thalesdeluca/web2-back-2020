const jwt = require('jwt-express')
const { User } = require("../models");

const checkAuth = async (req, res, next) => {
  const user = await User.query()
  .where("id", req.jwt.payload.uid)
  .withGraphFetched("roles")
  .first();

  req.user = user;
  next();
}
console.log(jwt)
const middleware = [
  jwt.init(process.env.SECRET, {
    cookies: false,
    verify: async ({ payload }) => {
      const user = await User.query()
      .where("id", payload.uid)
      .withGraphFetched("roles")
      .first();
      
      return !!user
    }
  }),
  
  checkAuth
]

module.exports = middleware