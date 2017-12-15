
exports.up = function(knex, Promise) {
	return knex.schema.table('user', (t) => {
		t.dropColumn('last_name');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.table('user', (t) => {
		t.string('last_name').notNullable();
	});
};
