exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Links icon of current server in fancy embed.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        if (!message.guild.iconURL) return message.channel.send(`This server does not have an icon ${emote.find("peepoSadDank")}`);
        let fixedIconUrl = message.guild.iconURL.slice(0, -3).concat('png');
        if ((await client.fetch(fixedIconUrl.slice(0, -4))).headers.get('content-type')=='image/gif') fixedIconUrl = fixedIconUrl.slice(0, -3).concat('gif');
        let embed = {
            color: 0x9c6bcc,
            timestamp: Date.now(),
            footer: {
                text: message.guild.name+"'s icon",
                icon_url: fixedIconUrl||message.guild.iconURL
            },
            author: {
                name: `Icon of ${message.guild.name}`,
                url: fixedIconUrl||message.guild.iconURL
            },
            image: {
                url: fixedIconUrl||message.guild.iconURL
            }
        }
        message.channel.send(`<${fixedIconUrl||message.guild.iconURL}>`, {embed:embed});
    });
}