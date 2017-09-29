const untildify = require('untildify');
const credentialPath = untildify('~/.mysql/logdatabase.json');
const credentials = require(credentialPath);
const { knexfile_database_password } = credentials;

module.exports = { knexfile_database_password };