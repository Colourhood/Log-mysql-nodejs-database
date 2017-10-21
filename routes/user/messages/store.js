const knex = require('knex')(require('knexfile'));
const aws = require('aws-s3');

const { actions } = aws;

function getHomeMessages({ username }) {
    console.log('Trying to get the messages from SQL store');

    // Process of filtering user's friends
    return knex
          .queryBuilder()
          .select('sentTo')
          .from('messages')
          .where({ 'sentBy': username })
          .union(function() {
              this.select('sentBy').from('messages').where({ 'sentTo': username });
            }).map((values) => {
                const friend = values.sentTo;
                // Processing of fetching most recent message conversation between friend and user
                const awsPromise = actions.getProfileImage(friend);
                const knexPromise = knex('messages')
                                    .where({ 'sentBy': username, 'sentTo': friend })
                                    .orWhere({ 'sentBy': friend, 'sentTo': username })
                                    .select('sentTo', 'sentBy', 'message')
                                    .orderBy('created_at', 'desc')
                                    .limit(1);

                return Promise.all([knexPromise, awsPromise]).then((data) => {
                    const { sentTo, sentBy, message } = data[0][0]; //Database data
                    const { success, image, error } = data[1]; //Aws Image Object

                    if (success) { //Image exists for user!
                        return [{ sentTo, sentBy, message, image }];
                    } else { //Image doesn't exist for user :(
                        return [{ sentTo, sentBy, message, error }];
                    }
                }).catch((error) => {
                    return new Promise((resolve, reject) => {
                        reject(`Internal server error: ${error}`);
                    });
                });

            });
}

function getMessagesWithFriend({ username, friendname }) {
    return knex('messages')
          .where({ 'sentBy': username, 'sentTo': friendname })
          .orWhere({ 'sentBy': friendname, 'sentTo': username })
          .select('sentBy', 'sentTo', 'message');
}

function storeNewMessage({ sentBy, sentTo, message }) {
    console.log(`Sent by: ${sentBy}\ Sent to: ${sentTo}\n Message: ${message}`);

    return knex('messages').insert({ sentBy, sentTo, message });
}

module.exports = {
    getHomeMessages,
    getMessagesWithFriend,
    storeNewMessage
}