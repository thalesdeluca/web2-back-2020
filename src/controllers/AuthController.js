const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser");
const  { User } = require("../models")

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
        return res.status(404).send({ code: "NOT_FOUND", message: "Usuário não encontrado. Verifique suas credenciais e tente novamente"})
      }
  
      const isPasswordSame = bcyrpt.compareSync(password, user.password);
  
      if(!isPasswordSame) {
        return res.status(401).send({ code: "WRONG_CREDENTIALS", message: "Senha incorreta. Verifique suas credenciais e tente novamente"})
      }
  
      const accessToken = jwt.sign({ uid: user.id }, process.env.SECRET );
  
      return response.status(200).send({ access_token: accessToken })
    } catch(err) {
      return res.status(500).send({ code: 'INTERNAL_ERROR', message: "Houve um erro interno, tente novamente mais tarde"})
    }
   
  }

  async signup (req, res) {
    try {
      const { username, email, password } = req.body;
  
      const userQuery = User.query();

      if(!((username || email) && password)) {
        return res.status(400).send({ code: "MISSING_FIELDS", message: "Preencha todos os campos para prosseguir com o cadastro."})
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
        
        return res.status(403).send({ code: "ALREADY_TAKEN", message: errors })
      }

  
      const userRegistered = await User.query().insert({
        email,
        username,
        password
      })
  
      const accessToken = jwt.sign({ uid: userRegistered.id }, process.env.SECRET);
  
      return res.status(200).send({ access_token: accessToken })
    } catch(err) {
      console.log(err)
      return res.status(500).send({ code: 'INTERNAL_ERROR', message: "Houve um erro interno, tente novamente mais tarde"})
    }
    
  }
}

module.exports = AuthController;