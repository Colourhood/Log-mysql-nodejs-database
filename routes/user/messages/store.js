const knex = require('knex')(require('../../../knexfile'));

function getHomeMessages({ username }) {
    console.log('Trying to get the messages from SQL store');

    //get all the names of user's friends (friend list)
    return knex('messages')
          .distinct('sentTo')
          .where({ 'sentBy': username })
          .select('sentTo')
          .map((values) => {
              const friend = values.sentTo;
              //Get most recent message with this friend
              return knex('messages')
                    .where({ 'sentBy': username, 'sentTo': friend })
                    .orWhere({ 'sentBy': friend, 'sentTo': username })
                    .select('sentTo', 'sentBy', 'message')
                    .orderBy('created_at', 'desc')
                    .limit(1)
          });
}

function getMessagesWithFriend({ username, friendname }) {
    return knex('messages')
          .where({ 'sentBy': username, 'sentTo': friendname })
          .orWhere({ 'sentBy': friendname, 'sentTo': username })
          .select('sentBy', 'sentTo', 'message');
}

module.exports = {
    getHomeMessages,
    getMessagesWithFriend
}