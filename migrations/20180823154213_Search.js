
exports.up = function(knex, Promise) {
  return knex.schema.createTable('Search', function (t) {
    t.increments('id').primary();
    t.string('email').notNullable();
    t.string('word').notNullable();
    t.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('Search');
};
