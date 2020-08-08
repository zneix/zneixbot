exports.description = 'Kicks user from the server.';
exports.usage = '<@mention | user ID> [reason]';
exports.level = 0;
exports.perms = ['KICK_MEMBERS'];
exports.cooldown = 3000;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    if (!message.guild.me.hasPermission('KICK_MEMBERS')) throw ['botperm', 'Kick Members'];
    let user = await require('../src/utils/cache').getUserFromMessage(message, {useQuery: false, withinGuild: true});
    if (!user) throw ['normal', 'No user found! @Mention someone or use user ID.'];

    let member = message.guild.member(user);
    //clearances
    if (!member.kickable) throw ['normal', 'I\'m unable to kick that user. They may have a higher (or equal) role.'];
    if (!client.perms.sufficientRole(message.member, member)) throw ['normal', `You can't kick that user because they may have a higher (or equal) role than you ${client.emoteHandler.guild('asset', 'Jebaited')}`];

    //reason
    let reason = `Responsible moderator: ${message.author.tag}`;
    if (message.args.length > 1) reason = `${message.args.slice(1).join(' ')} | ${reason}`;

    //actual kick
    member.kick(reason).then(() => require('../src/embeds/kickedBanned')(message, member.id, reason, false)).catch(err => {throw `An error occured: ${err}`});
}