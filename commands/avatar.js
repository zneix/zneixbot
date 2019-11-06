exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Links yours or someone's avatar.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [user ID | @mention]`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        if (!message.args.length) return link(message.author);
        let taggedUser = message.mentions.users.first();
        if (!taggedUser) {
            let validUser = client.users.get(message.args[0]);
            if (validUser) return link(validUser);
            else return link(message.author);
        }
        else return link(taggedUser);
        function link(user){
            if (!user.avatarURL) return message.channel.send(`User \`${user.tag}\` does not have an avatar ${client.emoteHandler.find("peepoSadDank")}`);
            let embed = {
                color: 0x852442,
                timestamp: Date.now(),
                footer: {
                    text: "Avatar of "+user.tag,
                    icon_url: user.avatarURL
                },
                author: {
                    name: `Avatar of ${user.tag}`,
                    url: user.avatarURL
                },
                image: {
                    url: user.avatarURL
                }
            }
            message.channel.send(`<${user.avatarURL}>`, {embed:embed});
        }
    });
}