const knex = require('knex')(require('knexfile'));
const aws = require('aws-s3');
const crypto = require('crypto');

const { actions } = aws;

function getHomeMessages({ user_email }) {
	console.log('Trying to get the messages from SQL store');

	// Fetching friends
	return knex('friends')
		.where({ 'user': user_email })
		.select('friend')
		.map((values) => {
			const friend_email = values.friend;
			const sortedArray = [ user_email, friend_email].sort().join('');
			const chatID = crypto.createHmac('sha512', sortedArray).digest('hex');
			console.log(`Friend address: ${JSON.stringify(values)}`);
			console.log(`Chat ID: ${JSON.stringify(chatID)}`);

			// Fetch the most recent message in conversation
			const knexMessage = knex('messages')
				  .where({ 'chat_id': chatID })
				  .select('message', 'created_at')
				  .orderBy('created_at', 'desc')
				  .limit(1)
				  .then(([message]) => { return message; });
			// Fetch user details for friend
			const knexUser = knex('user')
				  .where({ 'email_address': friend_email })
				  .select('first_name', 'email_address')
				  .then(([user]) => { return user;  });

			return Promise.all([knexMessage, knexUser]).then((data) => {
				const messageObject = data[0]; //Database data - Message
				const friendObject = data[1]; //Database Friend Details
				const combinedObjects = Object.assign(messageObject, friendObject, { 'chat_id': chatID });
				return combinedObjects;
			}).catch((error) => {
				return Promise.reject(`Internal server error: ${error}`);
			});
		}).then((data) => {
			function compare(a, b) {
				if (a.created_at < b.created_at) {
					return 1;
				}
				if (a.created_at > b.created_at) {
					return -1;
				}
				return 0;
			}
			return data.sort(compare);
		});
}

function getMessagesWithFriend({ chat_id }) {
	return knex('messages').where({ 'chat_id': chat_id }).select('sent_by', 'message_index', 'message', 'created_at');
}

function storeNewMessage({ sent_by, message, chat_id }) {
	console.log(`Sent by: ${sent_by} Sent to: ${chat_id}\n Message: ${message}`);
	return knex('messages')
		   .where({ 'chat_id': chat_id })
		   .select('message_index')
		   .orderBy('created_at', 'desc')
		   .limit(1)
		   .then(([data]) => { 
			   const message_index = data.message_index+1;

			   return knex('messages').insert({ message_index, sent_by, message, chat_id });
			});
}

module.exports = {
	getHomeMessages,
	getMessagesWithFriend,
	storeNewMessage
};