
exports.up = function(knex, Promise) {
    return knex.schema.table('messages', (t) => {
        t.dropColumn('id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('messages', (t) => {
        t.increments('id').primary();
    });
};
