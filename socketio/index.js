const Chat = require('socketio/Chat');

var socketRooms = {}

function getChatObject(chatID) {
    if (socketRooms.hasOwnProperty(chatID)) {
        //chatID object does exist, get ServerChat Object
        return socketRooms[chatID];
    } else {
        //create chat room
        return socketRooms[chatID] = new Chat(chatID);
    }
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Connected to socket.io');

        /*Socketio Room Event*/
        socket.on('join room', (data) => {
            console.log(`Number of server chat objects: ${Object.keys(socketRooms).length}`);
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
                    delete socketRooms[chatObject];
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