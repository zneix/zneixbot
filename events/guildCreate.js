module.exports = (client, guild) => {
    require('../src/embeds/guildCreatedDeleted')(guild, client.channels.get(client.config.channels.guildlogs), true);
    require('../utils/clientPresence')(client);
}