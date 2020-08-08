exports.description = 'Bans user from the server (without deleting user messages).';
exports.usage = '<@mention | user ID> [reason]';
exports.level = 0;
exports.perms = ['BAN_MEMBERS'];
exports.cooldown = 3000;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) throw ['botperm', 'Ban Members'];
    let user = await require('../src/utils/cache').getUserFromMessage(message, {useQuery: false, withinGuild: false});
    if (!user) throw ['normal', 'No user found! @Mention someone, use user ID or exact user tag (like zneix#4433).'];

    //banning users is being done only by their IDs to make code more simple
    //reason
    let reason = `Responsible moderator: ${message.author.tag}`;
    if (message.args.length > 1) reason = `${message.args.slice(1).join(' ')} | ${reason}`;
    //don't ban the user, if he's already banned
    let aban = await message.guild.fetchBan(user.id).catch(() => {}); //added scuffed .catch here, so stuff actually continues
    if (aban) return require('../src/embeds/kickedBanned')(message, user.id, aban.reason, 'banerror');
    //check for role permissions
    let posmember = message.guild.members.cache.get(user.id);
    if (posmember){
        if (!posmember.bannable) throw ['normal', `I'm unable to ban this user`]; //return {code: '22', msg: posmember.user.tag};
        if (!client.perms.sufficientRole(message.member, posmember)) throw ['normal', `You can't kick that user because they may have a higher (or equal) role than you ${client.emoteHandler.guild('asset', 'Jebaited')}`]; //return {code: '12', msg: posmember.user.tag};
    }
    //actual ban
    await message.guild.members.ban(user.id, {reason: reason}).catch(err => {throw ['discordapi', err.toString()];})
    .then(() => require('../src/embeds/kickedBanned')(message, user.id, reason, true));
}