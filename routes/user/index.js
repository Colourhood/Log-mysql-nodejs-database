const user = require('express').Router();
const store = require('routes/user/store');
const messages = require('routes/user/messages');
const aws = require('aws-s3');

const { actions } = aws;

user.post('/signup', (request, response) => {
	const user_email = request.body.user_email;
	const password = request.body.password;
	const first_name = request.body.first_name;
	console.log(`The POST method to create a user was called ${user_email} with passkey: ${password}`);

	store.signup({ user_email, password, first_name }).then(({ success }) => {
		if (success) {
			console.log('Creating a user was a success '+success);
			response.status(200).json({ 'user_email': user_email });
		}
	}).catch(({ failure }) => {
		if (failure) {
			console.log('There was an error trying to create a user');
			response.status(500).json({ 'message': `${failure}` });
		}
	});
});

user.post('/login', (request, response) => {
	const user_email = request.body.user_email;
	const password = request.body.password;
    
	if (user_email !== ' ' || user_email !== undefined) {
		const knexPromise = store.authenticate({ user_email, password });
		const awsPromise = actions.getProfileImage(user_email);

		Promise.all([knexPromise, awsPromise]).then((values) => {
			const { authenticated, email_address, first_name } = values[0]; //Database Authentication
			const { success, image, error } = values[1]; //Aws Image Object
            
			if (success && authenticated) {
				response.status(200).json({ 'user_email': email_address, 'first_name': first_name, 'image': image });
			} else if (!success && authenticated){
				//Authentication successful, but image requested was not successful
				response.status(404).json({ 'user_email': email_address, 'first_name': first_name, 'error': error });
			}
		}).catch((error) => {
			response.status(500).json({ 'error': error });
		});
	} else {
		response.status(404).json({ 'error': 'Missing required fields' });
	}

});

user.use(messages);

module.exports = user;