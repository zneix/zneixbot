exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Displays general information about the bot.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        var embed = {
            color: 0xf97304,
            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            description: `
[Invite me to your server!](https://discordapp.com/api/oauth2/authorize?client_id=506606171906637855&permissions=8&scope=bot)

[Repository on GitHub](https://github.com/zneix/zneixbot)

[Discord Server](https://discord.gg/3UZ5624)`
        }
        message.channel.send({embed:embed});
    });
}