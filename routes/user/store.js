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

function checkIfUserExists(username) {
    return knex('user').where({ username })
          .then(([user]) => {
              console.log(user);
              if (user) { return ({ exists: true })}
              return ({ exists: false });
          })
}

//public functions/methods - exported

function signup({ username, password }) {
    console.log(`Trying to create new account user ${username}`);

    checkIfUserExists(username).then(({ exists }) => {
        console.log('Does user exist? '+exists);
        if (!exists) {
            const { salt, hash } = saltHashPassword({ password });
    
            console.log('Successfully adding new user');
    
            return knex('user').insert({
                username,
                salt,
                encrypted_password: hash,
            });
        }
    });

    return knex('user');
}

function authenticate({ username, password }) {
    console.log(`Authenticating for user ${username}`);

    return knex('user').where({ username })
          .then(([user]) => {
                if (!user) { return ({ success: false }); }
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