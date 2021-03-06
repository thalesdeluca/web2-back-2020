
exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments('id');
    table.string("email").unique().notNullable();
    table.string("username").unique().notNullable();
    table.string("password").notNullable();
    table.timestamps();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};
