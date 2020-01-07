module.exports = (client, guild) => {
    let dbconfig = (await client.db.utils.find('guilds', {guildid: message.guild.id}))[0];
    if (!dbconfig) await client.db.utils.newGuildConfig(message.guild.id);
    require('../src/embeds/guildCreatedDeleted')(guild, client.channels.get(client.config.channels.guildlogs), true);
    require('../utils/clientPresence')(client);
}