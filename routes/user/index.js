const user = require('express').Router();
const store = require('./store');

user.post('/signup', (request, response) => {
    console.log('The POST method to create a user was called '+request.body.username);
    store.signup({
            username: request.body.username,
            password: request.body.password
        })
        .then(() => { 
            response.sendStatus(200);/*.json({username: request.body.username})*/
            return;            
            response.json({ 'username': request.body.username });
        })
        .catch((error) => { console.log(error)});
});

user.post('/login', (request, response) => {
    console.log('The POST method to log in a user was called');
    store.authenticate({
        username: request.body.username,
        password: request.body.password
    })
    .then(({ success }) => {
        if (success) {
            response.sendStatus(200);
        } else {
            response.sendStatus(401);
        }
    })
})

module.exports = user;