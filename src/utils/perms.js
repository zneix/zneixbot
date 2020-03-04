let adminOverrides = [
    // 'ADMINISTRATOR', //(implicitly has all permissions, and bypasses all channel overwrites)
    'CREATE_INSTANT_INVITE', //(create invitations to the guild)
    // 'KICK_MEMBERS',
    // 'BAN_MEMBERS',
    // 'MANAGE_CHANNELS', //(edit and reorder channels)
    // 'MANAGE_GUILD', //(edit the guild information, region, etc.)
    'ADD_REACTIONS', //(add new reactions to messages)
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES', //(delete messages and reactions)
    'EMBED_LINKS', //(links posted will have a preview embedded)
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY', //(view messages that were posted prior to opening Discord)
    // 'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS', //(use emojis from different guilds)
    'CONNECT', //(connect to a voice channel)
    'SPEAK', //(speak in a voice channel)
    'MUTE_MEMBERS', //(mute members across all voice channels)
    'DEAFEN_MEMBERS', //(deafen members across all voice channels)
    'MOVE_MEMBERS', //(move members between voice channels)
    'USE_VAD', //(use voice activity detection)
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES', //(change other members' nicknames)
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS'
];
let levels = {
    god: 1337, //god can do literally whatever he wants, all the restrictions are ignored
    admin: 500, //admin level allows to ignore some guild permission-based restrictions
    mod: 400, //mods can execute some whitelisted commands

    maxguildmod: 300, //upper cap of the guild moderator permissions
    minguildmod: 100, //moderator of the current server (most likely, defined by role / user ID by admins)

    user: 0, //everyone below regular user level is consideted as banned
    skipCooldowns: 450 //everyone above skipCooldowns skips every cooldown
}
module.exports = client => {
    let perms = client.perms;
    function getUserLvl(userid){
        let levels = Object.keys(perms).map(k => parseInt(k)).sort();
        let userLevel = 0; //default level of a user
        for (let i = 0; i < levels.length; i++){
            if (perms[levels[i].toString()].includes(userid)) userLevel = levels[i];
        }
        return userLevel;
    }
    function isAllowed(cmd, channel, member){
        if (member.client.cooldowns[cmd.name].has(`${member.guild.id}_${member.id}`)) return false;
        if (cmd.level >= levels['minguildmod'] && cmd.level <= levels['maxguildmod']) return guildLevel(member, cmd.level);
        if (cmd.perms.length) return guildPerm(cmd.perms, channel, member);
        return getUserLvl(member.id) >= cmd.level ? true : false;
    }
    function isBanned(userid){
        return !(getUserLvl(userid) >= levels['user']); // -1 is a banned user
    }
    function isGod(userid){
        return getUserLvl(userid) >= levels['god']; //gods are defined above level 1000
    }
    function guildLevel(member, glevel){
        if (isGod(member.id)) return true;
        if (member.hasPermission('MANAGE_GUILD')) return true; //guild managers (and admins) have full rights in guild level tree
        client.go[member.guild.id].config.perms.filter(p => parseInt(p.level) >= glevel).forEach(perm => {
            if (perm.userperm) if (member.roles.cache.has(perm.id)) return true;
            else if (member.id == perm.id) return true;
        });
    }
    function guildPerm(gperms, channel, member){
        if (!isGod(member.id) && (!getUserLvl(member.id) >= levels['admin'])){
            if (!member.permissionsIn(channel).toArray().some(x => gperms.includes(x))) return false;
        }
        else {
            let permGrant;
            let ovrGrant;
            gperms.forEach(perm => {
                if (member.hasPermission(perm)) permGrant = true;
                if (adminOverrides.includes(perm)) ovrGrant = true;
            });
            if ((!permGrant && !ovrGrant) && !isGod()) return false;
        }
        return true;
    }
    function sufficientRole(msgmember, reqmember){
        if (!isGod(msgmember.id)){
            if (msgmember.roles.highest.calculatedPosition <= reqmember.roles.highest.calculatedPosition) return false;
        }
        return true;
    }
    return {
        getUserLvl: getUserLvl,
        isAllowed: isAllowed,
        isBanned: isBanned,
        isGod: isGod,
        guildPerm: guildPerm,
        guildLevel: guildLevel,
        sufficientRole: sufficientRole,
        levels: levels
    }
}