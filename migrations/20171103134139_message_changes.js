
exports.up = function(knex, Promise) {
    return knex.schema.table('messages', (t) => {
        t.string('sent_by').notNullable();
        t.string('sent_to').notNullable();

        t.dropColumn('sentBy');
        t.dropColumn('sentTo');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('messages', (t) => {
        t.string('sentBy');
        t.string('sentTo');

        t.dropColumn('sent_by');
        t.dropColumn('sent_to');
    });
};
