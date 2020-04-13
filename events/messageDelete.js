module.exports = message => {
    if (message.channel.type == 'dm' || message.author.bot) return;
    require('../src/modules/logging').messageDelete(message);
}