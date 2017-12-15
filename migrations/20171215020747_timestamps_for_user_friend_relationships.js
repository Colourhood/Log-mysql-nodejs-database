
exports.up = function(knex, Promise) {
    return knex.schema.table('friends', (t) => {
        t.timestamps(false, true);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('friends', (t) => {
        t.dropTimestamps();
    });
};
