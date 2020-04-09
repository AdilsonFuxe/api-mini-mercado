
exports.up = function(knex) {
    return knex.schema.createTable('user', table => {
        table.string('id', 10).primary();
        table.string('first_name', 20).notNullable();
        table.string('last_name', 20).notNullable();
        table.string('email', 255).notNullable();
        table.string('phone', 20).notNullable();
        table.string('password', 30).notNullable();
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        table.boolean('state').notNullable().defaultTo(true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('user');
};
