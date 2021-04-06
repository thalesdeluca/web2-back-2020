const { Model } = require("objection");
const knex = require("../config/knex");

Model.knex(knex);

class Role extends Model {
  static get tableName() {
    return "roles"
  }

  static get relationMappings() {
    const { User } = require("./index");

    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          through: {
            from: "user_roles.role_id",
            to: "user_roles.user_id"
          },
          to: "users.id",
        }
      },
    }
  }
}

module.exports = Role;