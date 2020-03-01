exports.description = `Bans user from the server (without deleting user messages).`;
exports.usage = '<@mention | user ID> [reason]';
exports.level = 0;
exports.perms = ['BAN_MEMBERS'];
exports.cooldown = 3000;
exports.pipeable = false;

exports.run = (client, message) => {
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) throw ['botperm', 'Ban Members'];
    let taggedMember = message.mentions.members.first();
    if (!taggedMember){
        if (!/^\d{17,}$/.test(message.args[0])) throw ['normal', 'You have to specify a user by their ID nor @mention'];
        return execute(message.args[0]);
    }
    else return execute(taggedMember.id);
    //the function that bans users, now it does that only by their ID to make code more simple
    async function execute(userid){
        //reason compilation
        let reason = `${message.args.length > 1 ? message.args.slice(1).join(' ') : 'No reason given'} | Responsible moderator: ${message.author.tag}`;

        //don't ban the user, if he's already banned
        let aban = await message.guild.fetchBan(userid).catch(err => console.log(err));
        if (aban) return require('../src/embeds/kickedBanned')(message, userid, aban.reason, 'banerror');
        //check for role permissions
        console.log(userid);
        let posmember = message.guild.members.get(userid);
        if (posmember){
            if (!posmember.bannable) throw ['normal', `I'm unable to ban this user`]; //return {code: '22', msg: posmember.user.tag};
            let {sufficientRole} = require('../src/utils/perms')(client);
            if (!sufficientRole(message.member, posmember)) throw ['normal', `You're unable to ban this user because of role hierarchy`]; //return {code: '12', msg: posmember.user.tag};
        }
        //actual ban
        message.guild.ban(userid, reason).catch(err => {throw ['discordapi', err.toString()];})
        .then(() => require('../src/embeds/kickedBanned')(message, userid, reason, true));

    }
}