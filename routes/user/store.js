const knex = require('knex')(require('../../knexfile'));
const crypto = require('crypto');


//private functions
function saltHashPassword({ password, salt = randomString() } ) {
    const hash = crypto.createHmac('sha512', salt).update(password);
    return ({ 
        salt,
        hash: hash.digest('hex')
    });
}

function randomString() {
    return crypto.randomBytes(4).toString('hex');
}

//public functions/methods - exported

function signup({ username, password }) {
    console.log(`Add user ${username}`);

    const { salt, hash } = saltHashPassword(password);

    return knex('user').insert({
        salt,
        encrypted_password: hash,
        password
    });
}

function authenticate({ username, password }) {
    console.log(`Authenticating for user ${username}`);

    return knex('user').where({ username })
          .then(([user]) => {
                if (!user) { return false }
                const { hash } = saltHashPassword({ 
                    password,
                    salt: user.salt
                });
                return ({ success: hash === user.encrypted_password });
          });
}

module.exports = {
    saltHashPassword,
    authenticate,
    signup
}