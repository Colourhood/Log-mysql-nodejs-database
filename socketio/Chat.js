const moment = require('moment');
const twentyMinutesExpiredActivity = (1000 * 60) * 20;
const oneSecond = 1000;

class Chat {
    constructor(chatID, func) {
        this.chatID = chatID;
        this.users = {};
        this.mostRecentActivity = moment();

        this.timer = this.scheduleExpirationTimer();
        this.release = func
    }

    

    /*JS TIMERS*/
    scheduleExpirationTimer() {
        return setInterval( () => this.checkLastActivity(), oneSecond);
    }

    checkLastActivity() {
        const now = moment();
        const difference = (now - this.mostRecentActivity);

        if (difference > oneSecond) {
            console.log('Activity expired, cancelling timers and releasing object');
            this.clearTimers();
            this.release(this.chatID);
        }
    }

    clearTimers() {
        clearInterval(this.timer);
    }

    /*Chat Events*/
    joinChat(username) {
        if (this.users.hasOwnProperty(username)) {
            //User already exists
        } else {
            //Add user to chat room
            this.users[username] = username;
        }
        this.updateActivity();
    }

    leaveChat(username) {
        delete this.users[username];
    }

    updateActivity() {
        this.mostRecentActivity = moment();
    }

    getUserCount() {
        return Object.keys(this.users).length;
    }

}

module.exports = Chat;