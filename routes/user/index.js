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
                return;
                response.status(200).json({ 'username': request.body.username });
            }
        })
        .catch(({ failure }) => {
            if (failure) {
                console.log('Did this fail? '+failure);
                response.sendStatus(401);
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
            return;
        } else {
            response.sendStatus(401);
        }
    })
})

module.exports = user;