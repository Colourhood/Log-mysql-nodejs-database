
exports.up = function(knex, Promise) {
    return knex.schema.createTable('friends', (t) => {
        t.string('user').notNullable();
        t.string('friend').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('friends');
};
