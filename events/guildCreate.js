module.exports = async (client, guild) => {
    let dbconfig = (await client.db.utils.find('guilds', {guildid: guild.id}))[0];
    if (!dbconfig) await client.db.utils.newGuildConfig(guild.id);
    require('../src/embeds/guildCreateDelete')(guild, client.channels.get(client.config.channels.guildlogs), true);
    require('../utils/clientPresence')(client);
}