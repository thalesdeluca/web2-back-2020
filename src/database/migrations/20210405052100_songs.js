
exports.up = function(knex) {
  return knex.schema.createTable("songs", (table) => {
    table.increments('id')
    table.string("name");
    table.string("description")
    table.string("image_path")
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete("cascade");

    table.timestamps();
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('songs')
};
