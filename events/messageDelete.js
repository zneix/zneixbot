module.exports = async message => {
    if (message.channel.type == 'dm' || message.author.bot) return;
    await require('../src/utils/loader').getGuildConfig(message.guild);
    require('../src/modules/logging').messageDelete(message);
}