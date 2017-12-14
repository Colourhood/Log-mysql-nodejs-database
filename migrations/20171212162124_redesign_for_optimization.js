
exports.up = function(knex, Promise) {
    return knex.schema.table('user', (t) => {
        t.dropColumn('id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('user', (t) => {
        t.increments('id').primary();
    });
};
