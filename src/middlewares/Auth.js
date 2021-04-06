const jwt = require("jsonwebtoken");
const { User } = require("../models");

const checkAuth = async (req, res, next) => {
  try {
    const bearer =  req.headers.authorization;

    if(!bearer) {
      return res.status(401).send({ code: "UNAUTHORIZED", message: "É necessário estar logado para realizar esta ação"})
    }
  
    const token = bearer.replace("Bearer ", "").trim();

    if(!token) {
      return res.status(401).send({ code: "UNAUTHORIZED", message: "É necessário estar logado para realizar esta ação"})
    }
  
    const { uid } = jwt.decode(token, process.env.SECRET);

    if(!uid) {
      return res.status(401).send({ code: "UNAUTHORIZED", message: "É necessário estar logado para realizar esta ação"})
    }

    const user = await User.query()
      .where("id", uid)
      .withGraphFetched("roles")
      .first();
      
    if(!user) {
      return res.status(401).send({ code: "UNAUTHORIZED", message: "É necessário estar logado para realizar esta ação"})
    }
  
    req.user = user;
    next();
  } catch(err) {
    return res.status(401).send({ code: "UNAUTHORIZED", message: "É necessário estar logado para realizar esta ação"})
  }
  
}

module.exports = {
  checkAuth
};