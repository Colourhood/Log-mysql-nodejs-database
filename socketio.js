module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Connected to socket.io');

        /*Socketio Room Event*/
        socket.on('join room', (chatID) => {
            console.log('User connected to chat room: '+chatID);
            socket.join(chatID);
        });
        
        socket.on('leave room', (chatID) => {
            socket.leave(chatID);
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