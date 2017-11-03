const user = require('express').Router();
const store = require('routes/user/store');
const messages = require('routes/user/messages');
const aws = require('aws-s3');

const { actions } = aws;

user.post('/signup', (request, response) => {
    console.log('The POST method to create a user was called '+request.body.user_address);
    store.signup({
            user_address: request.body.user_address,
            password: request.body.password
        })
        .then(({ success }) => {
            if (success) {
                console.log('Creating a user was a success '+success);
                response.status(200).json({ 'user_address': request.body.user_address });
            }
        })
        .catch(({ failure }) => {
            if (failure) {
                console.log('There was an error trying to create a user, maybe the user already exists?');
                response.status(500).json({ 'message': 'Account already exists, please login' });
            }
        });
});

user.post('/login', (request, response) => {
    const user_address = request.body.user_address;
    const password = request.body.password;
    
    if (user_address !== ' ' || user_address !== undefined) {
        const knexPromise = store.authenticate({ user_address: user_address, password: password });
        const awsPromise = actions.getProfileImage(user_address);

        Promise.all([knexPromise, awsPromise]).then((values) => {
            const { authenticated } = values[0]; //Database Authentication
            const { success, image, error } = values[1]; //Aws Image Object
            
            if (success && authenticated) {
                response.status(200).json({ 'user_address': user_address,
                                            'image': image });
            } else if (!success && authenticated){
                //Authentication successful, but image requested was not successful
                response.status(404).json({ 'user_address': user_address,
                                            'error': error });
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