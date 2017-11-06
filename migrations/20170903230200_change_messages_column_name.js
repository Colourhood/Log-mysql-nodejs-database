/* eslint-disable */
exports.up = function(knex, Promise) {
	return knex.schema.table('messages', (t) => {
		t.string('sentBy').notNullable();
		t.dropColumn('sendedBy');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.table('messages', (t) => {
		t.dropColumn('sentBy');
		t.string('sendedBy').notNullable();
	});
};
