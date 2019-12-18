module.exports = (client, oldMessage, newMessage) => {
    if (newMessage.channel.type === 'dm' || newMessage.author.bot || !newMessage.editedTimestamp) return;
    require('../utils/loggingHandler').messageUpdate(client, oldMessage, newMessage);
}