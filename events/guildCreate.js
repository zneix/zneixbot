module.exports = async guild => {
    await require('../src/utils/loader').getGuildConfig(guild);
    await require('../src/embeds/guildCreateDelete')(guild, client.channels.cache.get(client.config.channels.guildlogs), true);
    require('../src/utils/presence')();
} 