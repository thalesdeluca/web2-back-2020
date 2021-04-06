const { Model } = require("objection");
const knex = require("../config/knex");


Model.knex(knex);

class Song extends Model {
  static get tableName() {
    return "songs"
  }

  static get relationMappings() {
    const  User  = require("./User");
    return {
      songs: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'songs.user_id'
        }
      }
    }
  }
}

module.exports = Song;