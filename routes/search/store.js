const knex = require('knex')(require('knexfile'));

function search({ name }) {
   return knex('user')
          .where('first_name', 'like', `${name}%`)
          .select('first_name')
          .then((users) => {
            console.log(`Users containing search: ${JSON.stringify(users)}`);
            return users;
          });
}

module.exports = { search };