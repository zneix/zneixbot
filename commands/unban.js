exports.description = 'Unbans previously banned member. Can be done only with user ID.';
exports.usage = '<user ID> [unban reason]';
exports.level = 0;
exports.perms = ['BAN_MEMBERS'];
exports.cooldown = 3000;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) throw ['botperm', 'Ban Members'];
    if (!/^\d{17,}$/.test(message.args[0])) throw ['normal', 'That is not a user ID!'];

    let ban = await message.guild.fetchBan(message.args[0]).catch(err => {throw ['discordapi', err.toString()]});
    let reason = `Responsible moderator: ${message.author.tag}`;
    if (message.args.length > 1) reason = `${message.args.slice(1).join(' ')} | ${reason}`;
    await message.guild.members.unban(ban.user, reason);
    message.channel.send({embed:{
        color: 0xcae2cd,
        timestamp: message.createdAt,
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
        },
        author: {
            name: 'Successfully Unbanned'
        },
        description: `${ban.user} ${ban.reason ? `, with previous ban reason: \`${ban.reason}\`` : '; there was no previous ban reason.'}`
    }});
}