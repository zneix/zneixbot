exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Checks if user with given ID is banned and shows ban reason if yes.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [userID]`;
exports.perms = ['BAN_MEMBERS'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) throw "I don't have **BAN_MEMBERS** permission!\nContact moderators.";
        if (!/^\d{17,}$/.test(message.args[0])) throw "That is not a valid user ID!";
        let member = message.args[0];
        
        //check and 'error' throw if user is already banned
        let check = await message.guild.fetchBans();
        if (check.get(member)) {
            let ban = await message.guild.fetchBan(message.args[0]).catch(err => {throw err.toString()});
            return require('../src/embeds/memberKickedBanned')(message, `<@${member}>`, ban.reason, "banerror");
        }
        else {
            let embed = {
                color: 0x42de1a,
                timestamp: Date.now(),
                footer: {
                    text: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                author: {
                    name: `This user is not banned in ${message.guild.name}`
                },
                description: `KKool GuitarTime`
            };
            return message.channel.send({embed:embed});
        }
    });
}