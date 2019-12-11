exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Prints a lennyface.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        if (!message.guild.iconURL) return message.channel.send(`This server does not have an icon ${emote.find("peepoSadDank")}`);
        let iconpng = message.guild.iconURL.slice(0, -3).concat('png');
        if ((await client.fetch(message.guild.iconURL.slice(0, -4))).headers.get('content-type')=='image/gif') iconpng = iconpng.slice(0, -3).concat('gif');
        let embed = {
            color: 0x9c6bcc,
            timestamp: Date.now(),
            footer: {
                text: message.guild.name+"'s icon",
                icon_url: iconpng||message.guild.iconURL
            },
            author: {
                name: `Icon of ${message.guild.name}`,
                url: iconpng||message.guild.iconURL
            },
            image: {
                url: iconpng||message.guild.iconURL
            }
        }
        message.channel.send(`<${iconpng||message.guild.iconURL}>`, {embed:embed});
    });
}