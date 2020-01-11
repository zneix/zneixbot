exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Unbans previously banned member. Requires user ID.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <user ID>`;
exports.perms = [false, false, 'BAN_MEMBERS'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) return {code: '23', msg: 'Ban Members'};
        if (!/^\d{17,}$/.test(message.args[0])) return {code: '15', msg: 'That is not a user ID!'};
        return execute(message.args[0]);

        async function execute(member){
            let ban = await message.guild.fetchBan(member).catch(e => {return {code: '15', msg: e.toString()}});
            if (ban.code = '15') return ban;

            await message.guild.unban(ban.user);
            let embed = {
                color: 0xcae2cd,
                timestamp: message.createdAt,
                footer: {
                    text: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                author: {
                    name: "Successfully Unbanned"
                },
                description: `${ban.user} ${ban.reason?`, with previous ban reason: \`${ban.reason}\``:"; there was no previous ban reason."}`
            }
            message.channel.send({embed:embed});
        }
    });
}