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
    'VIEW_GUILD_INSIGHTS', //(see server statistics on discord developer portal)
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
let guildModOverrides = [
    // 'ADMINISTRATOR',
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    // 'MANAGE_CHANNELS', //there are yet no command featuring this, so it's better to have it disabled either way
    // 'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    // 'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    // 'MANAGE_ROLES', //same as with MANAGE_CHANNELS
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS'
];
let levels = {
    god: 1000, //god can do literally whatever he wants, all the restrictions are ignored
    admin: 500, //admin level allows to ignore some guild permission-based restrictions
    mod: 300, //mods can execute some whitelisted commands

    maxguildmod: 200, //upper cap of the guild moderator permissions
    minguildmod: 100, //moderator of the current server (most likely, defined by role / user ID by admins)

    user: 0, //everyone below regular user level is consideted as banned
    skipCooldowns: 400 //everyone above skipCooldowns skips every cooldown
}
function isGod(userid){
    return getUserLvl(userid) >= levels['god']; //gods are defined above level 1000
}
function getUserLvl(userid){
    let levels = Object.keys(client.levels).map(k => parseInt(k)).sort();
    let userLevel = 0; //default level of a user
    for (let i = 0; i < levels.length; i++){
        if (client.levels[levels[i].toString()].includes(userid)) userLevel = levels[i];
    }
    return userLevel;
}
exports.levels = levels;
exports.isGod = isGod;
exports.getUserLvl = getUserLvl;
exports.isAllowed = (cmd, channel, member) => {
    if (client.cooldowns[cmd.name].has(`${member.guild ? member.guild.id : message.channel.id}_${member.id}`)) return false; //user on cooldown = not allowed
    console.log('1');
    if (cmd.level >= levels['minguildmod'] && cmd.level <= levels['maxguildmod']) return exports.isGuildAllowed(member, cmd.level); //command.level = 100-200
    console.log('2');
    if (cmd.perms.length) return exports.guildPerm(cmd.perms, channel, member); //command requires guild permissions
    console.log('3');
    return Boolean(getUserLvl(member.id) >= cmd.level); //global permission level
}
exports.isBanned = (userid) => {
    return !(getUserLvl(userid) >= levels['user']); // -1 is a banned user
}
exports.isGuildAllowed = (member, glevel) => {
    return exports.getGuildLevel(member) >= glevel;
}
exports.getGuildLevel = (member) => {
    //gods and guild admins have full rights in guild level tree (obviously)
    if (isGod(member.id) || member.hasPermission('ADMINISTRATOR') || member.hasPermission('MANAGE_GUILD')) return levels['maxguildmod'];
    //going through every permission definition in current guild
    let level = 0;
    client.go[member.guild.id].config.perms.forEach(perm => {
        switch (perm.type){
            case 'user':
                if (member.id == perm.id) return level = perm.level;
                break;
            case 'role':
                if (member.roles.cache.has(perm.id)) return level = perm.level;
                break;
        }
    });
    return level;
}
exports.guildPerm = (gperms, channel, member) => {
    //gods are gods
    if (isGod(member.id)) return true;
    //bot admins
    if (getUserLvl(member.id) < levels['admin']){
        let permGrant, ovrGrant;
        gperms.forEach(perm => {
            if (member.permissionsIn(channel).toArray().includes(perm)) permGrant = true;
            if (adminOverrides.includes(perm)) ovrGrant = true;
        });
        if (permGrant || ovrGrant) return true;
    }
    //guild mods' overrides
    if (exports.isGuildAllowed(member, levels['minguildmod'])){
        console.log('ayy lmao');
        if (guildModOverrides.some(x => gperms.includes(x))) return true;
    }
    //guild members with right permissions
    if (member.permissionsIn(channel).toArray().some(x => gperms.includes(x))) return true;
    return false;
}
exports.sufficientRole = (msgmember, reqmember) => {
    if (isGod(msgmember.id)) return true;
    if (msgmember.roles.highest.position > reqmember.roles.highest.position) return true;
    return false;
}