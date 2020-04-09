
exports.up = function(knex) {
    return knex.schema.createTable('product', table=>{
        table.increments();
        table.string('name', 50).notNullable();
        table.string('description', 255).notNullable();
        table.integer('count').notNullable();
        table.integer('count_min').notNullable().defaultTo(20);
        table.decimal('unit_price',10,2).notNullable();
        table.date('validate_date').notNullable();
        table.integer('subcategoryID').unsigned().notNullable();
        table.integer('businessID').unsigned().notNullable();
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
        table.boolean('state').notNullable().defaultTo(true);

        table.foreign('subcategoryID').references('id').inTable('subcategory');
        table.foreign('businessID').references('id').inTable('business');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('product');
};
