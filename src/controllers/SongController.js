const { Router, response } = require("express");
const { checkAuth } = require("../middlewares/Auth");
const multer = require('multer');
const { Song } = require("../models");
const shortid = require("shortid");
const bodyParser = require("body-parser");
const upload = multer({ dest: 'tmp' })
const fs = require("fs")

class SongController {
  constructor() {
    this.path = "/songs";
    this.router = Router();
    this.initRoutes([checkAuth]);
  }

  initRoutes(localMiddlewares = []) {
    this.router.post(this.path, ...localMiddlewares, upload.single("image"),this.save);
    this.router.get(this.path, ...localMiddlewares, bodyParser.json(), this.index);
  }

  async index(req, res) {
    try {
      const { name, page = 0, size = 10  } = req.query;
    
      const songQuery = Song.query();
  
      if (name) {
        songQuery.where("name", "like", `%${name}%`);
      }
     
      const songs = await songQuery.page(page, size);
  
      return res.status(200).send(songs)
    } catch(err) {
      return res.status(500).send({ code: 'INTERNAL_ERROR', message: "Houve um erro interno, tente novamente mais tarde"})
    }
  }

  async save (req, res) {
    try {
      const { name, description } = req.body;
      const image = req.file;

      const newName = shortid.generate();
   
      const extension = image.originalname.split(".").pop();
  
      const imageURL = `${process.env.APP_URL}/images/${newName}.${extension}`;

      const newPath = `public/images/${newName}.${extension}`

      fs.renameSync(image.path, newPath);

      const song = await Song.query().insert({
        name, 
        description,
        image_path: imageURL,
        user_id: req.user.id
      })
  
      return res.status(200).send(song)
    } catch(err) {
      console.log(err)
      return res.status(500).send({ code: 'INTERNAL_ERROR', message: "Houve um erro interno, tente novamente mais tarde"})
    }
  }
}

module.exports = SongController;