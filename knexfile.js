const { knexfile_database_password } = require('./passwords');

module.exports = {
    client: 'mysql',
    connection: {
        user: 'root',
        password: knexfile_database_password,
        database: 'log_node_database'
    }
}