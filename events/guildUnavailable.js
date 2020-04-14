module.exports = guild => {
    console.log(`{guildUnavailable} ${guild.id} (size ${guild.members.cache.size || 'unknown'}) ${guild.name}`);
}