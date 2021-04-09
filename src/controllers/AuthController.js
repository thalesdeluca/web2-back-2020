const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser");
const  { User, Role } = require("../models")


const ERRORS = {
  "EMAIL_TAKEN": "Email already registered",
  "USERNAME_TAKEN": "Username already registered"
}

class AuthController {
  constructor() {
    this.path = "/auth";
    this.router = Router();
    this.initRoutes([bodyParser.json()]);
  }

  initRoutes(localMiddlewares = []) {
    this.router.post(`${this.path}/login`, ...localMiddlewares,this.login);
    this.router.post(`${this.path}/signup`, ...localMiddlewares,this.signup);
  }

  async login (req, res) {
    try {
      const { email, username, password } = req.body;

      const userQuery = User.query();
  
      if(email) {
        userQuery.where("email", email);
      }
  
      if(username) {
        userQuery.where("username", username);
      }
  
      const user = await userQuery.first();
  
      if(!user) {
        return res.status(404).send({ code: "NOT_FOUND", message: "User not found. Check your credentials and try again"})
      }
  
      const isPasswordSame = bcrypt.compareSync(password, user.password);
  
      if(!isPasswordSame) {
        return res.status(401).send({ code: "WRONG_CREDENTIALS", message: "Wrong password. Check your credentials and try again"})
      }
  
      const accessToken = jwt.sign({ uid: user.id }, process.env.SECRET );
  
      return res.status(200).send({ access_token: accessToken, user: user.username })
    } catch(err) {
      console.log(err)
      return res.status(500).send({ code: 'INTERNAL_ERROR', message: "An internal error has occurred, please try again later"})
    }
   
  }

  async signup (req, res) {
    try {
      const { username, email, password } = req.body;
  
      const userQuery = User.query();

      if(!((username || email) && password)) {
        return res.status(400).send({ code: "MISSING_FIELDS", message: "Fill all fields to complete your registration"})
      }
  
      if(email) {
        userQuery.where("email", email);
      }
  
      if(username) {
        userQuery.orWhere("username", username);
      }
  
      const user = await userQuery.first();
      const errors = [];
     
      if(user) {
        if(email === user.email) {
          errors.push("EMAIL_TAKEN");
        }
    
        if(username === user.username) {
          errors.push("USERNAME_TAKEN")
        }
        
        return res.status(403).send({ code: "ALREADY_TAKEN", message: errors.reduce((acc, current) => `${acc}\n${ERRORS[current]}`, "") })
      }

  
      const userRegistered = await User.transaction(async trx => {
        const userSaved = await User.query(trx).insert({
          email,
          username,
          password
        })

        const role = await Role.query(trx).where("slug", "user").first();

        return await userSaved.$relatedQuery("roles", trx).relate(role);
      })
  
      const accessToken = jwt.sign({ uid: userRegistered.id }, process.env.SECRET);
  
      return res.status(200).send({ access_token: accessToken, user: userRegistered.name })
    } catch(err) {
      console.log(err)
      return res.status(500).send({ code: 'INTERNAL_ERROR', message: "An internal error has occurred, please try again later"})
    }
    
  }
}

module.exports = AuthController;