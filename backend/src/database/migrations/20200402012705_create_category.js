
exports.up = function(knex) {
  return knex.schema.createTable('category', table=>{
      table.increments();
      table.string('name',50).notNullable().unique();
      table.string('description',255);
      table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
      table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
      table.boolean('state').notNullable().defaultTo(true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('category');
};
