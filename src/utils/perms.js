let adminOverrides = [
    // 'ADMINISTRATOR',
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    // 'BAN_MEMBERS',
    // 'MANAGE_CHANNELS',
    // 'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'VIEW_CHANNEL',
    // 'READ_MESSAGES', //deprec
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    // 'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    // 'EXTERNAL_EMOJIS', //deprec
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    // 'MANAGE_ROLES_OR_PERMISSIONS', //deprec
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS'
];
let minLevels = {
    god: 1337, //god can do literally whatever he wants, all the restrictions are ignored
    admin: 500, //admin level allows to ignore some guild permission-based restrictions
    mod: 200, //mods can execute some whitelisted commands
    user: 0, //everyone below regular user level is consideted as banned
    skipCooldowns: 400 //everyone above skipCooldowns skips every cooldown
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
    function isAllowed(cmd, member){
        if (member.client.cooldowns[cmd.name].has(`${member.guild.id}_${member.id}`)) return false;
        if (cmd.perms.length) return guildPerm(cmd.perms, member);
        return getUserLvl(member.id) >= cmd.level ? true : false;
    }
    function isBanned(userid){
        return !(getUserLvl(userid) >= minLevels['user']); // -1 is a banned user
    }
    function isGod(userid){
        return getUserLvl(userid) >= minLevels['god']; //gods are defined above level 1000
    }
    function guildPerm(gperms, member){
        if (!isGod(member.id) && (!getUserLvl(member.id) >= minLevels['admin'])){
            if (!member.permissions.toArray().some(x => gperms.includes(x))) return false;
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
        sufficientRole: sufficientRole,
        levels: minLevels
    }
}