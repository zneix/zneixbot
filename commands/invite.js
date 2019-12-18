exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Invite zneixbot to your server!`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let embed = {
            color: 0xf97304,
            timestamp: new Date(),
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            author: {
                name: `https://discordapp.com/api/oauth2/authorize?client_id=506606171906637855&permissions=8&scope=bot`,
                url: "https://discordapp.com/api/oauth2/authorize?client_id=506606171906637855&permissions=8&scope=bot"
            },
            description: '[Support Server](https://discordapp.com/invite/cF555AV)'
        }
        message.channel.send({embed:embed});
    });
}