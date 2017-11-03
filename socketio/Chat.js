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
        return setInterval( () => this.checkLastActivity(), twentyMinutesExpiredActivity);
    }

    checkLastActivity() {
        const now = moment();
        const difference = (now - this.mostRecentActivity);

        if (difference > twentyMinutesExpiredActivity) {
            console.log('Activity expired, cancelling timers and releasing object');
            this.clearTimers();
            this.release(this.chatID);
        }
    }

    clearTimers() {
        clearInterval(this.timer);
    }

    /*Chat Events*/
    joinChat(user_address) {
        console.log(`User joined chat ${user_address}`)
        if (this.users.hasOwnProperty(user_address)) {
            //User already exists
        } else {
            //Add user to chat room
            this.users[user_address] = user_address;
        }
        this.updateActivity();
    }

    leaveChat(user_address) {
        console.log(`User left chat ${user_address}`)
        delete this.users[user_address];
    }

    updateActivity() {
        this.mostRecentActivity = moment();
    }

    getUserCount() {
        return Object.keys(this.users).length;
    }

}

module.exports = Chat;