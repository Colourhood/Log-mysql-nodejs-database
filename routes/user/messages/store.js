const knex = require('knex')(require('knexfile'));
const aws = require('aws-s3');

const { actions } = aws;

function getHomeMessages({ user_email }) {
    console.log('Trying to get the messages from SQL store');

    // Process of filtering user's friends
    return knex
          .queryBuilder()
          .select('sent_to')
          .from('messages')
          .where({ 'sent_by': user_email })
          .union(function() {
              this.select('sent_by').from('messages').where({ 'sent_to': user_email });
            }).map((values) => {
                const friend_email = values.sent_to;
                // Processing of fetching most recent message conversation between friend and user
                const awsPromise = actions.getProfileImage(friend_email);
                const knexPromise = knex('messages')
                                    .where({ 'sent_by': user_email, 'sent_to': friend_email })
                                    .orWhere({ 'sent_by': friend_email, 'sent_to': user_email })
                                    .select('message', 'created_at')
                                    .orderBy('created_at', 'desc')
                                    .limit(1)
                                    .then(([message]) => { return message });
                const knexPromise2 = knex('user')
                                    .where({ 'email_address': friend_email })
                                    .select('first_name', 'last_name', 'email_address')
                                    .then(([user]) => { return user })

                return Promise.all([knexPromise, knexPromise2, awsPromise]).then((data) => {
                    const { message, created_at } = data[0]; //Database data - Message
                    const { first_name, last_name, email_address } = data[1]; //Database Friend Details
                    const { success, image, error } = data[2]; //Aws Image Object

                    if (success) { //Image exists for user!
                        return { email_address, first_name, last_name, message, image, created_at };
                    } else { //Image doesn't exist for user :(
                        return { email_address, first_name, last_name, message, created_at, error };
                    }
                }).catch((error) => {
                    return new Promise((resolve, reject) => {
                        reject(`Internal server error: ${error}`);
                    });
                });

            });
}

function getMessagesWithFriend({ user_email, friend_email }) {
    return knex('messages')
          .where({ 'sent_by': user_email, 'sent_to': friend_email })
          .orWhere({ 'sent_by': friend_email, 'sent_to': user_email })
          .select('sent_by', 'sent_to', 'message', 'created_at');
}

function storeNewMessage({ sent_by, sent_to, message }) {
    console.log(`Sent by: ${sent_by}\ Sent to: ${sent_to}\n Message: ${message}`);
    return knex('messages').insert({ sent_by, sent_to, message });
}

module.exports = {
    getHomeMessages,
    getMessagesWithFriend,
    storeNewMessage
}