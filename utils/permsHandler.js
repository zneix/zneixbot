module.exports = (client, message) => {
    let perms = client.perms;
    let id = message.author.id;

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

    function isOwner(){
        if (!perms.owner.includes(id)) return false;
        return true;
    }
    function isAdmin(bool){
        if (bool) {
            if (!perms.owner.includes(id) && !perms.admin.includes(id)) return false;
            return true;
        }
        if (!perms.owner.includes(id) && !perms.admin.includes(id)) throw "This command requires **bot administrator** prvileges to run!"
    }
    function isMod(bool){
        if (bool) {
            if (!perms.owner.includes(id) && !perms.admin.includes(id) && !perms.mod.includes(id)) return false;
            return true;
        }
        if (!perms.owner.includes(id) && !perms.admin.includes(id) && !perms.mod.includes(id)) throw "This command requires **bot moderator** prvileges to run!"
    }
    function isBanned(){
        if (perms.ban.includes(id)) throw "You are banned from the bot!"
    }
    function guildperm(given, bool){
        if (!isOwner() && !perms.admin.includes(id)) {
            if (!message.member.hasPermission(given)) return locexit();
        }
        else {
            let permLack;
            let ovrLack;
            given.forEach(perm => {
                if (!message.member.hasPermission(perm)) permLack = true;
                if (!adminOverrides.includes(perm)) ovrLack = true;
            });
            if (permLack && ovrLack && !isOwner()) return locexit();
        }
        if (bool) return true;
        function locexit(){
            if (bool) return false;
            throw `This command requires ${given.length === 1?`**${given}** permission`:`**${given.join(", ")}** permissions`} to run!`;
        }
    }
    function levelCheck(cmdPerms){
        if (cmdPerms) { //when cmd.perms is given
            if (typeof cmdPerms === "string") switch(cmdPerms){
                case "owner": return 3;
                case "admin": return 2;
                case "mod": return 1;
                case "user": return 0;
            }
            else return cmdPerms;
        }
        else { //when function runs without parameters
            if (perms.owner.includes(id)) return {string:"owner",number:3}
            if (perms.admin.includes(id)) return {string:"admin",number:2}
            if (perms.mod.includes(id)) return {string:"mod",number:1}
            return {string:"user",number:0}
        }
    }
    function isAllowed(cmd, beSilent){
        if (!isOwner()) { //disabling handler for users with owner perms aka bot's gods
            if (typeof cmd.perms !== "string") return guildperm(cmd.perms, beSilent); //checking guild-perms (with some overrides on admin-level)
            else switch(cmd.perms){
                case "owner":
                    if (beSilent) return false;
                    else throw "This command requires **bot owner** prvileges to run!";
                case "admin":return isAdmin(beSilent);
                case "mod":return isMod(beSilent);
                case "user":if (beSilent) return true;
            }
        }
        else if (beSilent) return true;
    }
    return {
        isOwner: isOwner,
        isAdmin: isAdmin,
        isMod: isMod,
        isBanned: isBanned,
        guildperm: guildperm,
        levelCheck: levelCheck,
        isAllowed: isAllowed
    }
}