
exports.up = function(knex) {
  return knex.schema.createTable("roles", table => {
    table.increments('id');
    table.string("name").notNullable();
    table.string("slug").notNullable().unique();
    table.timestamps()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('roles')
};
