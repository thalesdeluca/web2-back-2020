
exports.up = function(knex) {
  return knex.schema.createTable("user_roles", (table) => {
    table
    .integer('user_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('users')
    .onDelete("cascade");

    table
    .integer('role_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('roles')
    .onDelete("cascade");
    table.timestamps();
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('user_roles')
};
