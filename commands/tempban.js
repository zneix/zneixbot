exports.description = 'Bans user from the server and unbans after specified amount of time (without deleting user messages).'
+'\nTime should be specified without spaces, like `10m` or `5h30m`.\nSupports y, w, d, h, m, s';
exports.usage = '<@mention | user ID> <time> [reason]';
exports.level = 0;
exports.perms = ['BAN_MEMBERS'];
exports.cooldown = 3000;
exports.pipeable = false;

exports.run = async message => {
    if (message.args.length < 2) throw ['args', 2];
    if (!message.guild.me.hasPermission('BAN_MEMBERS')) throw ['botperm', 'Ban Members'];
    //checking for time before member actually
    let time = require('../src/utils/formatter').humanToSec(message.args[1]);
    if (!time) throw ['normal', 'Invalid time value was provided. Use numbers and time unit letters: y, w, d, h, m, s.\nExamples: 10m (10 minutes), 5h30m (5 hours and 30 minutes)'];
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
        if (message.args.length > 2) reason = `${message.args.slice(2).join(' ')} | ${reason}`;

        //don't ban the user, if he's already banned
        let aban = await message.guild.fetchBan(userid).catch(() => {}); //added scuffed .catch here, so stuff actually continues
        if (aban) return require('../src/embeds/kickedBanned')(message, userid, aban.reason, 'banerror');
        //check for role permissions
        let posmember = message.guild.members.cache.get(userid);
        if (posmember){
            if (!posmember.bannable) throw ['normal', `I'm unable to ban this user`];
            if (!client.perms.sufficientRole(message.member, posmember)) throw ['normal', `You can't kick that user because they may have a higher (or equal) role than you ${client.emoteHandler.guild('asset', 'Jebaited')}`];
        }
        //actual ban
        let jobid = await client.cron.schedule('tempban', time, {
            guildid: message.guild.id,
            userid: userid,
            reason: reason,
            modtag: message.author.tag
        });
        await message.guild.members.ban(userid, {reason: reason}).catch(err => {throw ['discordapi', err.toString()];})
        .then(user => require('../src/embeds/kickedBanned')(message, user.id, reason, {id: jobid, time: time}));
    }
}