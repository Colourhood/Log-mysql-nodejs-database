
exports.up = function(knex, Promise) {
    return knex.schema.table('user', (t) => {
        t.string('university').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('user', (t) => {
        t.dropColumn('university');
    });
};
