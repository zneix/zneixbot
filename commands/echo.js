exports.description = "Sends a message on my behalf. If no channel specified, send a message to current channel. Use common sense and don't abuse this.";
exports.usage = '[channel ID | #channel] <message>';
exports.level = 300;
exports.perms = [];
exports.cooldown = 7000;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['normal', 'You need to provide a message (and optionally a destination channel by it\'s ID or channel mention).'];
    let mentionedChannel = message.mentions.channels.first();
    if (message.args[0].includes(mentionedChannel ? mentionedChannel.id : null)) return await say(client.channels.cache.get(mentionedChannel.id), message.args.join(' ').slice(mentionedChannel.toString().length).trim);
    else if (client.channels.cache.has(message.args[0])) return await say(client.channels.cache.get(message.args[0]), message.args.slice(1).join(' '));
    else return await say(message.channel, message.args.join(' '));
    //exec part
    async function say(channel, msg){
        if (channel.permissionsFor(message.guild.me).missing(['SEND_MESSAGES', 'VIEW_CHANNEL']).length) throw ['botperm', 'View Channel, Send Messages']; //checks for bot's permissions
        if (!msg.length) throw ['normal', 'You also need to provide a message']; //check if message isn't empty (to avoid API errors)
        await message.delete({reason: `${message.author.tag} used echo command`});
        channel.send(msg);
    }
}