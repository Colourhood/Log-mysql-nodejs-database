const Chat = require('socketio/Chat');

var chatrooms = {}

function getChatObject(chat_id) {
    if (chatrooms.hasOwnProperty(chat_id)) {
        //chat_id object does exist, get ServerChat Object
        return chatrooms[chat_id];
    } else {
        //create chat room
        return chatrooms[chat_id] = new Chat(chat_id, deleteChatRoom);
    }
}

function deleteChatRoom(chat_id) {
    delete chatrooms[chat_id];
    console.log(`Delete chatroom was called; Number of chatrooms: ${Object.keys(chatrooms).length}`)
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Connected to socket.io');

        /*Socketio Room Event*/
        socket.on('join room', (data) => {
            //console.log(`Number of server chat objects: ${Object.keys(chatrooms).length} \n Keys: ${Object.keys(chatrooms)}`);
            const { chat_id, user_email } = data[0];

            socket.join(chat_id, () => {
                const chatObject = getChatObject(chat_id);
                chatObject.joinChat(user_email);
            });

            //console.log(`Rooms in io: ${JSON.stringify(socket.adapter.rooms)}`);
        });
        
        socket.on('leave room', (data) => {
            const { chat_id, user_email } = data[0];

            socket.leave(chat_id, () => {
                const chatObject = getChatObject(chat_id);
                chatObject.leaveChat(user_email);

                if (chatObject.getUserCount() <= 0) {
                    console.log('There are no longer any users in this chat, releasing Object');
                    //Release all the timers, otherwise they will keep running globally
                    chatObject.clearTimers();
                    deleteChatRoom(chat_id);
                }
            });
            //console.log(`Rooms in io: ${JSON.stringify(socket.adapter.rooms)}`);
        })

        /*Socketio Chat Events*/
        socket.on('send message', (data) => {
            const { chat_id, message, user_email, date } = data[0];
            const chatObject = getChatObject(chat_id);
            //console.log(`Send message was emitted to ${JSON.stringify(data[0])}`);

            socket.in(chat_id).emit('send message', { event: 'send message', message, user_email, date });
            chatObject.updateActivity();
        });

        socket.on('start typing', (data) => {
            const { chat_id, user_email } = data[0];
            const chatObject = getChatObject(chat_id);
            console.log(`${user_email} is typing`);

            socket.in(chat_id).emit('start typing', { event: 'start typing' });
            chatObject.updateActivity();
        });

        socket.on('stop typing', (data) => {
            const { chat_id, user_email } = data[0];
            const chatObject = getChatObject(chat_id);
            console.log(`${user_email} stopped typing`);

            socket.in(chat_id).emit('stop typing', { event: 'stop typing' });
            chatObject.updateActivity();
        });

    });
}