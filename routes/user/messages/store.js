const knex = require('knex')(require('knexfile'));
const aws = require('aws-s3');

const { actions } = aws;

function getHomeMessages({ user_address }) {
    console.log('Trying to get the messages from SQL store');

    // Process of filtering user's friends
    return knex
          .queryBuilder()
          .select('sent_to')
          .from('messages')
          .where({ 'sent_by': user_address })
          .union(function() {
              this.select('sent_by').from('messages').where({ 'sent_to': user_address });
            }).map((values) => {
                const friend = values.sent_to;
                // Processing of fetching most recent message conversation between friend and user
                const awsPromise = actions.getProfileImage(friend);
                const knexPromise = knex('messages')
                                    .where({ 'sent_by': user_address, 'sent_to': friend })
                                    .orWhere({ 'sent_by': friend, 'sent_to': user_address })
                                    .select('sent_to', 'sent_by', 'message', 'created_at')
                                    .orderBy('created_at', 'desc')
                                    .limit(1);

                return Promise.all([knexPromise, awsPromise]).then((data) => {
                    const { sent_to, sent_by, message, created_at } = data[0][0]; //Database data
                    const { success, image, error } = data[1]; //Aws Image Object

                    if (success) { //Image exists for user!
                        return [{ sent_to, sent_by, message, image, created_at }];
                    } else { //Image doesn't exist for user :(
                        return [{ sent_to, sent_by, message, created_at, error }];
                    }
                }).catch((error) => {
                    return new Promise((resolve, reject) => {
                        reject(`Internal server error: ${error}`);
                    });
                });

            });
}

function getMessagesWithFriend({ user_address, friend_email }) {
    return knex('messages')
          .where({ 'sent_by': user_address, 'sent_to': friend_email })
          .orWhere({ 'sent_by': friend_email, 'sent_to': user_address })
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