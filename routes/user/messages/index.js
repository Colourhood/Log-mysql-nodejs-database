const messages = require('express').Router();
const store = require('routes/user/messages/store');
const io = require('routes/user/messages/socketio');

messages.get('/messages/:username', (request, response) => {
    const username = request.params.username;

    /*Knex-mySQL*/
    console.log('Get Messages endpoint was called - user: '+JSON.stringify(request.params.username));
    store.getHomeMessages({
        username: username
    }).then((data) => {
        response.status(200).json(data);
    });
    /*Socket.io*/
    io.homeConnection(request.app.io, username);
});

messages.get('/messages/:username/:friendname', (request, response) => {
    store.getMessagesWithFriend({
        username: request.params.username,
        friendname: request.params.friendname
    }).then((data) => {
        response.status(200).json({ 'messages': data });
    });
});

messages.post('/messages', (request, response) => {
    console.log('Putting new message into database');
    const sentBy = request.body.sentBy;
    const sentTo = request.body.sentTo;
    const message = request.body.message;

    store.storeNewMessage({ sentBy, sentTo, message })
    .then((messageID) => {
        console.log('ID: '+messageID);
        response.status(204).send();;
    });

})

module.exports = messages;