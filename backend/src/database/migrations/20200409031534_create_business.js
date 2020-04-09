
exports.up = function(knex) {
    return knex.schema.createTable('business', table=>{
        table.increments();
        table.string('name', 50).notNullable();
        table.string('description', 255).notNullable();
        table.string('location', 255).notNullable();
        table.string('userID',10).notNullable();
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        table.boolean('state').notNullable().defaultTo(true);

        table.foreign('userID').references('id').inTable('user');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('business');
};
