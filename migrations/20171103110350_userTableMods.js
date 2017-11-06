/* eslint-disable */
exports.up = function(knex, Promise) {
	return knex.schema.table('user', (t) => {
		t.string('email_address').notNullable();
		t.dropColumn('username');

		t.string('first_name').notNullable();
		t.string('last_name').notNullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.table('user', (t) => {
		t.dropColumn('email_address');
		t.dropColumn('first_name');
		t.dropColumn('last_name');
		t.string('username').notNullable();
	});
};
