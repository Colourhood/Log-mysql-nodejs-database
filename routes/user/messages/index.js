const messages = require('express').Router();
const store = require('./store');

messages.get('/:username/messages/', (request, response) => {
    console.log('Get Messages endpoint was called - user: '+JSON.stringify(request.params.username));
    store.getHomeMessages({
        username: request.params.username
    }).then((data) => {
        console.log(`Did this work, getting data from messages? ${data}`);
        response.status(200).json({ 'message': data });
    });
});

messages.get('/:username/messages&:friendname', (request, response) => {
    console.log('Get messages with friend');
    store.getMessagesWithFriend({
        username: request.params.username,
        friendname: request.params.friendname
    }).then((data) => {
        console.log(`Data from messages with friend ${data}`);
        response.status(200).json({ 'messages': data });
    });
}); 

module.exports = messages;