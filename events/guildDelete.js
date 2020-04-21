module.exports = async guild => {
    //don't know it it's necessary to check for guild config when guild is being deleted
    await require('../src/embeds/guildCreateDelete')(guild, client.channels.cache.get(client.config.channels.guildlogs), false);
} 