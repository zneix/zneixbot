module.exports = (client, guild) => {
    require('../src/embeds/guildCreateDelete')(guild, client.channels.get(client.config.channels.guildlogs), false);
    require('../utils/clientPresence')(client);
}