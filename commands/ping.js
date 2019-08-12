exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Pings a bot to check if it's online.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.perms = `user`

exports.run = async (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        const time = require(`../utils/timeFormatter`);
        let m = await message.channel.send(`Pong?`);
        let ping = {
            color: 0x00ff00,
            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            fields: [
                {
                    name: `Ping`,
                    value: `Latency: **${m.createdTimestamp - message.createdTimestamp}ms**\nAPI Latency: **${Math.round(client.ping)}ms**`,
                    inline: false
                },
                {
                    name: `Uptime`,
                    value: `**${time.msFormat(client.uptime)}** since \`${time.dateFormat(client.readyAt)}\``,
                    inline: false
                }
            ]
        }
        m.edit({embed:ping});
    });
}