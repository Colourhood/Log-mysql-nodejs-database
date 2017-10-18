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
            const chatID = data[0].chatID;
            const username = data[0].username;

            socket.join(chatID, () => {
                const chatObject = getChatObject(chatID);
                chatObject.joinChat(username);
            });

            //console.log(`Rooms in io: ${JSON.stringify(socket.adapter.rooms)}`);
        });
        
        socket.on('leave room', (data) => {
            const chatID = data[0].chatID;
            const username = data[0].username;

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
            const chatID = data[0].chatID;
            const message = data[0].message;
            const chatObject = getChatObject(chatID);

            console.log('Send message was emitted to, message: '+message);

            socket.in(chatID).emit('receive message', { message: message });
            chatObject.updateActivity();
        });

        socket.on('start typing', (data) => {
            const chatID = data[0].chatID;
            const chatObject = getChatObject(chatID);

            socket.in(chatID).emit('start typing');
            chatObject.updateActivity();
        });

        socket.on('stop typing', (data) => {
            const chatID = data[0].chatID;
            const chatObject = getChatObject(chatID);

            socket.in(chatID).emit('stop typing');
            chatObject.updateActivity();
        });

    });
}