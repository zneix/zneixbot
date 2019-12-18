module.exports = (client, message) => {
    if (message.channel.type === 'dm' || message.author?message.author.bot:false) return;
    require('../utils/loggingHandler').messageDelete(client, message);
}