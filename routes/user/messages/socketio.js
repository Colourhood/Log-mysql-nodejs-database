
function homeConnection(io, username) {
    io.on('connection', (socket) => {
        console.log('Connected to chat socket');

        socket.on(username, (data) => {
            console.log(`Received event for ${username}: ${data}`);
        });

    });
}

module.exports = { homeConnection }