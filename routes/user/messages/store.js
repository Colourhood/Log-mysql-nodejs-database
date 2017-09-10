const knex = require('knex')(require('../../../knexfile'));

function getHomeMessages({ username }) {
    console.log('Trying to get the messages from SQL store');
    return knex('messages')
          .where({ 'sentBy': username })
          .orWhere({ 'sentTo': username })
          .orderBy('created_at')
          .select('sentBy', 'sentTo', 'message');
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