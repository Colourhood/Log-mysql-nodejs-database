const messages = require('express').Router();
const store = require('routes/user/messages/store');

messages.get('/messages/:username', (request, response) => {
    console.log('Get Messages endpoint was called - user: '+JSON.stringify(request.params.username));
    store.getHomeMessages({
        username: request.params.username
    }).then((data) => {
        response.status(200).json(data);
    });
});

messages.get('/messages/:username/:friendname', (request, response) => {
    console.log('Get messages with friend');
    store.getMessagesWithFriend({
        username: request.params.username,
        friendname: request.params.friendname
    }).then((data) => {
        console.log(`Data from messages with friend ${data}`);
        response.status(200).json({ 'messages': data });
    });
});

messages.put('/messages/', (request, response) => {
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