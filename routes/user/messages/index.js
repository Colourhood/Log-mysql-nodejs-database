const messages = require('express').Router();
const store = require('routes/user/messages/store');

messages.get('/messages/:username', (request, response) => {
    const username = request.params.username;

    /*Knex-mysql*/
    console.log('Get Messages endpoint was called - user: '+JSON.stringify(request.params.username));
    store.getHomeMessages({
        username: username
    }).then((data) => {
        response.status(200).json(data);
    });
});

messages.get('/messages/:username/:friendname', (request, response) => {
    const username = request.params.username;
    const friendname = request.params.friendname;

    /*Knex-mysql*/
    store.getMessagesWithFriend({
        username: username,
        friendname: friendname
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