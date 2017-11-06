/* eslint-disable */
exports.up = function(knex, Promise) {
	return knex.schema.createTable('messages', function (t) {
		t.increments('id').primary();
		t.string('sentTo').notNullable();
		t.string('sendedBy').notNullable();
		t.string('message').notNullable();
		t.timestamps(false, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('messages');
};
