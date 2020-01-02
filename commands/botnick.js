exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Changes bot's nickname. Running this command without arguments, removes it.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [new nick]`;
exports.perms = ['admin', false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        if (!message.guild.me.hasPermission('CHANGE_NICKNAME')) throw "I can't change my nickname in here!";
        if (!message.args.length) await message.guild.me.setNickname('');
        else await message.guild.me.setNickname(message.args.join(' '));
        message.channel.send({embed:{
            color: 0x1c98f6,
            description: message.guild.me.nickname?`Set my nickname to **${message.guild.me.nickname}**`:'Cleared nickname of mine ^_^'
        }})
    });
}