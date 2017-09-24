const user = require('express').Router();
const store = require('routes/user/store');
const messages = require('routes/user/messages');
const aws = require('aws-s3');

const { actions, keys } = aws;

user.post('/signup', (request, response) => {
    console.log('The POST method to create a user was called '+request.body.username);
    store.signup({
            username: request.body.username,
            password: request.body.password
        })
        .then(({ success }) => {
            if (success) {
                console.log('Creating a user was a success '+success);
                response.status(200).json({ 'username': request.body.username });
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
    var username = request.body.username;

    console.log(username);
    
    if (username !== ' ' || username !== undefined) {
        const awsPromise = actions.getObject(keys.pImage, username);
        const mySqlPromise = store.authenticate({ username: username, password: request.body.password });

        Promise.all([awsPromise, mySqlPromise]).then((values) => {
            console.log(values);
            const image = values[0];
            response.status(200).json({ 'username': username,
                                        'image': image });
        }).catch((error) => {
            response.status(500).json({ 'error': error });
        });
    } else {
        response.status(400).json({ 'error': 'Missing required fields' });
    }

});

user.use(messages);

module.exports = user;