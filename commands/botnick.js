exports.description = "Changes bot's nickname. Running this command without arguments, removes it.";
exports.usage = '[new nick]';
exports.level = 500;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = false;

exports.run = async message => {
    if (!message.guild.me.hasPermission('CHANGE_NICKNAME')) throw ['botperm', 'Change Nickname'];
    if (!message.args.length) await message.guild.me.setNickname('');
    else await message.guild.me.setNickname(message.args.join(' ')).catch(err => {console.log(err);throw ['discordapi', err.toString()];}); //slicing
    message.channel.send({embed:{
        color: 0x1c98f6,
        description: message.guild.me.nickname ? `Set my nickname to **${message.guild.me.nickname}**` : 'Cleared nickname of mine ^_^'
    }});
}