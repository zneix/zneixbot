module.exports = (client, guild) => {
    require('../src/embeds/guildCreatedDeleted')(guild, client.channels.get(client.config.channels.guildlogs), false);
    require('../utils/clientPresence')(client);
}