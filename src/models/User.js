const { Model } = require("objection");
const knex = require("../config/knex");
const bcrypt = require('bcrypt')


Model.knex(knex);

class User extends Model {
  static get tableName() {
    return "users"
  }

  static get relationMappings() {
    const { Role, Song } = require("./index");
    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: "user_roles.user_id",
            to: "user_roles.role_id"
          },
          to: "roles.id",
        }
      },

      songs: {
        relation: Model.HasManyRelation,
        modelClass: Song,
        join: {
          from: 'users.id',
          to: 'songs.user_id'
        }
      }
    }
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    console.log(this)
    this.password = bcrypt.hashSync(this.password, 10)
  }
}

module.exports = User