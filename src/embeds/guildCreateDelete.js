module.exports = async (guild, destination, boolCreated) => {
    let formatter = require('../utils/formatter');
    let embed = {
        color: boolCreated ? 0x0dc61a : 0xd71a42,
        timestamp: new Date(),
        footer: {
            text: guild.id,
            icon_url: guild.iconURL({ format:'png', dynamic:true})
        },
        author: {
            name: `${boolCreated ? 'Joined' : 'Left'} a server`
        },
        thumbnail: {
            url: guild.iconURL({ format:'png', dynamic:true})
        },
        fields: [
            {
                name: 'Name',
                value: guild.name,
                inline: true
            },
            {
                name: 'Size',
                value: `${guild.members.cache.filter(m => m.user.presence.status != 'offline').size}/${guild.members.cache.size} (${guild.members.cache.filter(m => m.user.bot).size} bots)`,
                inline: true
            },
            {
                name: 'Age',
                value: `${formatter.msToHuman(Date.now() - guild.createdTimestamp)} (since \`${formatter.dateFormat(guild.createdAt)}, ${formatter.hourFormat(guild.createdAt)}\`)`,
                inline: false
            }
        ]
    }
    console.log(`${boolCreated ? '{guildCreate} joined' : '{guildDelete} left'} guild '${guild.name}' | ${guild.id}`);
    if (!destination) return console.log(`{!${boolCreated ? 'guildCreated' : 'guildDeleted'}} guilds logs channel not found!`);
    destination.send({embed:embed});
} 