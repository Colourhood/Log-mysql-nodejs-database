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
	return knex('user').where({ 'email_address': user_email })
		.then(([user]) => {
			if (user) { return ({ exists: true });}
			return ({ exists: false });
		});
}

//public functions/methods - exported

function signup({ user_email, password, first_name }) {
	return checkIfUserExists(user_email).then(({ exists }) => {
		if (!exists) {
			const { salt, hash } = saltHashPassword({ password });
    
			return knex('user').insert({
				'email_address': user_email,
				'first_name': first_name,
				'university': 'University Of Texas',
				'salt': salt,
				'encrypted_password': hash,
			}).then(() => {
				return Promise.resolve({ success: true });
			}).catch((error) => {
				console.log(`There seemed to be an error ${error}`);
			});
		}
		return new Promise((resolve, reject) => {
			reject({ failure: true });
		});
	});
}

function authenticate({ user_email, password }) {
	return knex('user').where({ 'email_address': user_email })
		.then(([user]) => {
			if (user) {
				const { hash } = saltHashPassword({ password, salt: user.salt });
				if (hash === user.encrypted_password) {
					return Promise.resolve({ authenticated: true });
				} else {
					return Promise.reject('Incorrect password');
				}
			} else {
				return Promise.reject('Account doesn\'t exist');
			}
		});
}

module.exports = {
	saltHashPassword,
	authenticate,
	signup
};