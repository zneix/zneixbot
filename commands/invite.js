exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Invite zneixbot to your server!`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.perms = `user`

exports.run = async (client, message) => {
    message.command(false, async () => {
        var embed = {
            color: 0xf97304,
            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            author: {
                name: `https://discordapp.com/api/oauth2/authorize?client_id=506606171906637855&permissions=8&scope=bot`,
                url: "https://discordapp.com/api/oauth2/authorize?client_id=506606171906637855&permissions=8&scope=bot"
            }
        }
        message.channel.send({embed:embed});
    });
}