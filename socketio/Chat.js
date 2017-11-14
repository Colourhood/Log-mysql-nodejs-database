const moment = require('moment');
const twentyMinutesExpiredActivity = (1000 * 60) * 20;
//const oneSecond = 1000;

class Chat {
	constructor(chat_id, func) {
		this.chat_id = chat_id;
		this.users = {};
		this.mostRecentActivity = moment();

		this.timer = this.scheduleExpirationTimer();
		this.release = func;
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
			this.release(this.chat_id);
		}
	}

	clearTimers() {
		clearInterval(this.timer);
	}

	/*Chat Events*/
	joinChat(user_email) {
		console.log(`User joined chat ${user_email}`);
		if (this.users.hasOwnProperty(user_email)) {
			//User already exists
		} else {
			//Add user to chat room
			this.users[user_email] = user_email;
		}
		this.updateActivity();
	}

	leaveChat(user_email) {
		console.log(`User left chat ${user_email}`);
		delete this.users[user_email];
	}

	updateActivity() {
		this.mostRecentActivity = moment();
	}

	getUserCount() {
		return Object.keys(this.users).length;
	}

}

module.exports = Chat;