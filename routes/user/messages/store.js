const knex = require('knex')(require('knexfile'));

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
                return knex('messages')
                      .where({ 'sentBy': username, 'sentTo': friend })
                      .orWhere({ 'sentBy': friend, 'sentTo': username })
                      .select('sentTo', 'sentBy', 'message')
                      .orderBy('created_at', 'desc')
                      .limit(1);

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