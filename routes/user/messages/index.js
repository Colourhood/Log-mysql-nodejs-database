const messages = require('express').Router();
const store = require('routes/user/messages/store');
const aws = require('aws-s3');

const { actions } = aws;

messages.get('/messages/:user_email', (request, response) => {
    const user_email = request.params.user_email;

    /*Knex-mysql*/
    console.log('Get Messages endpoint was called - user: '+user_email);
    store.getHomeMessages({ user_email }).then((data) => {
        response.status(200).json(data);
    }).catch((error) => {
        response.status(500).json({ 'error': error });
    });
});

messages.get('/messages/:user_email/:friend_email', (request, response) => {
    const user_email = request.params.user_email;
    const friend_email = request.params.friend_email;

    /*Knex-mysql*/
    store.getMessagesWithFriend({ user_email, friend_email }).then((data) => {
        response.status(200).json({ 'messages': data });
    });
});

messages.post('/messages', (request, response) => {
    console.log('Putting new message into database');
    const sent_by = request.body.sent_by;
    const sent_to = request.body.sent_to;
    const message = request.body.message;

    store.storeNewMessage({ sent_by, sent_to, message }).then((messageID) => {
        console.log('ID: '+messageID);
        response.status(204).send();;
    });

})

module.exports = messages;