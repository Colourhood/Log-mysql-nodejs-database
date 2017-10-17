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
        })

        /*Socketio Chat Events*/
        socket.on('send message', (data) => {
            socket.to(data.chatID).emit(data.message);
        });

        socket.on('start typing', (data) => {
            socket.to(data.chatID).emit('start typing');
        });

        socket.on('stop typing', (data) => {
            socket.to(data.chatID).emit('stop typing');
        });

    });
}