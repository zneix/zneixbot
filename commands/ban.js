exports.description = 'Bans user from the server (without deleting user messages).';
exports.usage = '<@mention | user ID> [reason]>';
exports.level = 0;
exports.perms = ['BAN_MEMBERS'];
exports.cooldown = 3000;
exports.pipeable = false;

exports.run = async (client, message) => {
    if (message.args.length < 1) throw ['args', 1];
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) throw ['botperm', 'Ban Members'];
    let mentionedMember = message.mentions.members.first();
    if (!mentionedMember){
        if (!/^\d{17,}$/.test(message.args[0])) throw ['normal', 'You have provided invalid user ID or @mention'];
        return execute(message.args[0]);
    }
    else return execute(mentionedMember.id);
    //the function that bans users, now it does that only by their ID to make code more simple
    async function execute(userid){
        //reason compilation
        let reason = `Responsible moderator: ${message.author.tag}`;
        if (message.args.length > 1) reason = `${message.args.slice(1).join(' ')} | ${reason}`;

        //don't ban the user, if he's already banned
        let aban = await message.guild.fetchBan(userid).catch(() => {}); //added scuffed .catch here, so stuff actually continues
        if (aban) return require('../src/embeds/kickedBanned')(message, userid, aban.reason, 'banerror');
        //check for role permissions
        let posmember = message.guild.members.cache.get(userid);
        if (posmember){
            if (!posmember.bannable) throw ['normal', `I'm unable to ban this user`]; //return {code: '22', msg: posmember.user.tag};
            if (!client.perms.sufficientRole(message.member, posmember)) throw ['normal', `You can't kick that user because they may have a higher (or equal) role than you ${client.emoteHandler.guild('asset', 'Jebaited')}`]; //return {code: '12', msg: posmember.user.tag};
        }
        //actual ban
        await message.guild.members.ban(userid, {reason: reason}).catch(err => {throw ['discordapi', err.toString()];})
        .then(() => require('../src/embeds/kickedBanned')(message, userid, reason, true));
    }
}