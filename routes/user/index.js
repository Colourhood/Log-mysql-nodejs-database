const user = require('express').Router();
const store = require('./store');

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
                response.status(401).json({ 'message': 'Account already exists, please login' });
            }
        });
});

user.post('/login', (request, response) => {
    console.log('The POST method to log in a user was called');
    store.authenticate({
        username: request.body.username,
        password: request.body.password
    })
    .then(({ success }) => {
        if (success) {
            response.status(200).json({ 'username': request.body.username });
        } else {
            response.status(401).json({ 'message': 'Check your email or password' });
        }
    })
})

module.exports = user;