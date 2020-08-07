exports.description = 'Checks if user with given ID is banned in the server and shows potential ban reason.';
exports.usage = '<user ID>';
exports.level = 0;
exports.perms = ['BAN_MEMBERS'];
exports.cooldown = 3000;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) throw ['botperm', 'Ban Members'];
    if (!/^\d{17,}$/.test(message.args[0])) throw ['normal', 'That is not a valid user ID'];

    let member = message.args[0];
    //check and 'error' emit if user is already banned
    let bans = await message.guild.fetchBans();
    if (bans.get(member)){
        let ban = await message.guild.fetchBan(message.args[0]).catch(err => {throw ['normal', err.toString()];});
        require('../src/embeds/kickedBanned')(message, member, ban.reason, 'banerror');
    }
    else {
        message.channel.send({embed:{
            color: 0x42de1a,
            timestamp: message.createdAt,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
            },
            author: {
                name: `This user is not banned in ${message.guild.name}`
            },
            description: `${client.emoteHandler.find('KKool')} ${client.emoteHandler.find('GuitarTime')}`
        }});
    }
}