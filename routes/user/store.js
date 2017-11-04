const knex = require('knex')(require('knexfile'));
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

function checkIfUserExists(user_email) {
    return knex('user').where({ wil })
          .then(([user]) => {
              console.log(user);
              if (user) { return ({ exists: true })}
              return ({ exists: false });
          })
}

//public functions/methods - exported

function signup({ user_email, password }) {
    return checkIfUserExists(user_email).then(({ exists }) => {
        if (!exists) {
            const { salt, hash } = saltHashPassword({ password });
    
            return knex('user').insert({
                user_email,
                salt,
                encrypted_password: hash,
            }).then(() => {
                return new Promise((resolve, reject) => {
                    resolve({ success: true });
                });
            });
        }
        return new Promise((resolve, reject) => {
            reject({ failure: true });
        });
    });
}

function authenticate({ user_email, password }) {
    return knex('user').where({ user_email })
          .then(([user]) => {
              if (user) {
                  const { hash } = saltHashPassword({ password, salt: user.salt });
                  if (hash === user.encrypted_password) {
                    return new Promise((resolve, reject) => {
                        resolve({ authenticated: true });
                    });
                  } else {
                      return new Promise((resolve, reject) => {
                          reject('Incorrect password');
                      })
                  }
              } else {
                  return new Promise((resolve, reject) => { 
                      reject('Account doesn\'t exist');
                  });
              }
          });
}

module.exports = {
    saltHashPassword,
    authenticate,
    signup
}