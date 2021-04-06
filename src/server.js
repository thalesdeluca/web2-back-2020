const express = require("express");
const knex = require("knex");
const cors = require("cors");

const controllers = require("./controllers");
require("dotenv").config();
const redis = require('./config/redis')

const app = express();

app.use(cors());

app.use(express.static('public'));

Object.values(controllers).forEach(Controller => {
  const controller = new Controller();
  app.use(controller.router);
})

app.listen(process.env.PORT || 3333, () => {
  console.log(`Running on port ${process.env.PORT || 3333}`)
})