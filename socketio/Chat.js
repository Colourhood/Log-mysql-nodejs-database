class Chat {
    constructor(chatID) {
        this.chatID = chatID;
        this.users = {};
    }

    joinChat(username) {
        if (this.users.hasOwnProperty(username)) {
            console.log('User already exists within chat room');
        } else {
            console.log(`Added user ${username} to chat`);
            this.users[username] = username;
        }
        console.log('List of users in chat server: '+Object.keys(this.users));
    }

    leaveChat(username) {
        console.log(`Removed user ${username} from chat`);
        delete this.users[username];
        console.log('List of users in chat server: '+Object.keys(this.users));
    }

    getUserCount() {
        return Object.keys(this.users).length;
    }

}

module.exports = Chat;