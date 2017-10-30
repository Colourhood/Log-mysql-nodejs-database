const Chat = require('socketio/Chat');

var chatrooms = {}

function getChatObject(chatID) {
    if (chatrooms.hasOwnProperty(chatID)) {
        //chatID object does exist, get ServerChat Object
        return chatrooms[chatID];
    } else {
        //create chat room
        return chatrooms[chatID] = new Chat(chatID, deleteChatRoom);
    }
}

function deleteChatRoom(chatID) {
    delete chatrooms[chatID];
    console.log(`Delete chatroom was called; Number of chatrooms: ${Object.keys(chatrooms).length}`)
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Connected to socket.io');

        /*Socketio Room Event*/
        socket.on('join room', (data) => {
            //console.log(`Number of server chat objects: ${Object.keys(chatrooms).length} \n Keys: ${Object.keys(chatrooms)}`);
            const { chatID, username } = data[0];

            socket.join(chatID, () => {
                const chatObject = getChatObject(chatID);
                chatObject.joinChat(username);
            });

            //console.log(`Rooms in io: ${JSON.stringify(socket.adapter.rooms)}`);
        });
        
        socket.on('leave room', (data) => {
            const { chatID, username } = data[0];

            socket.leave(chatID, () => {
                const chatObject = getChatObject(chatID);
                chatObject.leaveChat(username);

                if (chatObject.getUserCount() <= 0) {
                    console.log('There are no longer any users in this chat, releasing Object');
                    //Release all the timers, otherwise they will keep running globally
                    chatObject.clearTimers();
                    deleteChatRoom(chatID);
                }
            });
            //console.log(`Rooms in io: ${JSON.stringify(socket.adapter.rooms)}`);
        })

        /*Socketio Chat Events*/
        socket.on('send message', (data) => {
            const { chatID, message, username, date } = data[0];
            const chatObject = getChatObject(chatID);
            //console.log(`Send message was emitted to ${JSON.stringify(data[0])}`);

            socket.in(chatID).emit('send message', { event: 'send message', message, username, date });
            chatObject.updateActivity();
        });

        socket.on('start typing', (data) => {
            const { chatID, username } = data[0];
            const chatObject = getChatObject(chatID);
            console.log(`${username} is typing`);

            socket.in(chatID).emit('start typing', { event: 'start typing' });
            chatObject.updateActivity();
        });

        socket.on('stop typing', (data) => {
            const { chatID, username } = data[0];
            const chatObject = getChatObject(chatID);
            console.log(`${username} stopped typing`);

            socket.in(chatID).emit('stop typing', { event: 'stop typing' });
            chatObject.updateActivity();
        });

    });
}