module.exports = async (client, guild) => {
    await require('../src/embeds/guildCreatedDeleted')(guild, client.channels.get(client.config.channels.guildlogs), false);
    require('../utils/clientPresence')(client);
}