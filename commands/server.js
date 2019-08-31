exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Displays various information about current server.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        const time = require('../utils/timeFormatter');
        var embed = {
            color: 0xcc44ff,
            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            author: {
                name: message.guild.name,
                icon_url: message.guild.iconURL.slice(0, -3).concat("png")
            },
            thumbnail: {
                url: message.guild.iconURL.slice(0, -3).concat("png")
            },
            fields: [
                {
                    name: "Time created",
                    value: time.dateFormat(message.guild.createdAt)+`\n\`${time.msFormat(Date.now()-message.guild.createdTimestamp)} ago\``,
                    inline: true
                },
                {
                    name: "ID",
                    value: "Server: "+message.guild.id+"\nOwner: "+message.guild.owner.id,
                    inline: true
                },
                {
                    name: "Owner",
                    value: message.guild.owner.user+" "+message.guild.owner.user.tag,
                    inline: false
                },
                {
                    name: "Members",
                    value: message.guild.members.filter(m => m.user.presence.status !== "offline").size+"/"+message.guild.members.size+` (${message.guild.members.filter(m => m.user.bot).size} bots)`,
                    inline: true
                },
                {
                    name: "Roles",
                    value: message.guild.roles.size,
                    inline: true
                },
                {
                    name: "Channels",
                    value: `Total: **${message.guild.channels.size}**`
                    +`\nCategories: **${message.guild.channels.filter(ch => ch.type === "category").size}**`
                    +`\nText: **${message.guild.channels.filter(ch => ch.type === "text").size}**`
                    +`\nVoice: **${message.guild.channels.filter(ch => ch.type === "voice").size}**`,
                    inline: false
                }
            ]
        }
        message.channel.send({embed:embed});
    });
}