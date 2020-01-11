exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Checks if user with given ID is banned in the server and shows potential ban reason.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <user ID>`;
exports.perms = [false, false, 'BAN_MEMBERS'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return {code: '23', msg: 'Ban Members'};
        if (!/^\d{17,}$/.test(message.args[0])) return {code: '15', msg: 'That is not a valid user ID'};
        let member = message.args[0];
        
        //check and 'error' emit if user is already banned
        let check = await message.guild.fetchBans();
        if (check.get(member)){
            let ban = await message.guild.fetchBan(message.args[0]).catch(err => {return {code: '27', msg: err.toString()};});
            return require('../src/embeds/memberKickedBanned')(message, `<@${member}>`, ban.reason, "banerror");
        }
        else {
            let embed = {
                color: 0x42de1a,
                timestamp: message.createdAt,
                footer: {
                    text: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                author: {
                    name: `This user is not banned in ${message.guild.name}`
                },
                description: `${client.emoteHandler.find('KKool')} ${client.emoteHandler.find('GuitarTime')}`
            }
            message.channel.send({embed:embed});
        }
    });
}