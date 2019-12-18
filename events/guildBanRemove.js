module.exports = (client, guild, user) => {
    require('../utils/loggingHandler').guildBanRemove(client, guild, user);
}