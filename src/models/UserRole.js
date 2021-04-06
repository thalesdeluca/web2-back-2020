const { Model } = require("objection");
const knex = require("../config/knex");


Model.knex(knex);

class UserRole extends Model {
  static get tableName() {
    return "user_roles"
  }

  static get relationMappings() {
    const { User, Role } = require("./index");
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_roles.user_id',
          to: 'user.id'
        }
      },

      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'user_roles.role_id',
          to: 'role.id'
        }
      }
    }
  }

}

module.exports = UserRole;