module.exports = async guild => {
    await require('../src/utils/loader').getGuildConfig(guild);
    console.log(`{guildUnavailable} ${guild.id} (size ${guild.members.cache.size || 'unknown'}) ${guild.name}`);
}