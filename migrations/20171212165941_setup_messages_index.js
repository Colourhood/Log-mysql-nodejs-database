
exports.up = function(knex, Promise) {
	return knex.schema.table('messages', (t) => {
		t.integer('message_index').notNullable();
		t.dropColumn('sent_to');
		t.string('chat_id').notNullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.table('messages', (t) => {
		t.dropColumn('message_index');
		t.dropColumn('chat_id');
		t.string('sent_to').notNullable();
	});
};
