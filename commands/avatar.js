exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Links yours or someone's avatar.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [user ID | @mention]`;
exports.perms = 'user';

exports.run = async (client, message) => {
    const emote = require('../utils/emoteHandler')(client);
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
            if (!user.avatarURL) return message.channel.send(`User \`${user.tag}\` does not have an avatar ${emote.find("peepoSadDank")}`);
            message.channel.send(`Avatar of \`${user.tag}\`:\n${user.avatarURL}`, {file:user.avatarURL});
        }
    });
}