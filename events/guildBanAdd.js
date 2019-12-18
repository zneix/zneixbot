module.exports = (client, guild, user) => {
    require('../utils/loggingHandler').guildBanAdd(client, guild, user);
}