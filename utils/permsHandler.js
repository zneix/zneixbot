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
    //global ban check
    function isBanned(){
        if (perms.ban.includes(id)) return {code: '132', msg: ''};
        else return {code: '00', msg: ''};
    }
    //global permission checks
    function isOwner(){
        if (!perms.owner.includes(id)) return false;
        return true;
    }
    function isAdmin(bool){
        if (!isOwner() && !perms.admin.includes(id)){
            if (bool) return false;
            return {code: '13', msg: 'bot administrator'};
        }
        if (bool) return true;
    }
    function isMod(bool){
        if (!isOwner() && !perms.admin.includes(id) && !perms.mod.includes(id)){
            if (bool) return false;
            return {code: '13', msg: 'bot moderator'};
        }
        if (bool) return true;
    }
    //guild-based role checks (only one so far)
    function isModrole(bool){
        if (message.member.hasPermission('ADMINISTRATOR') || isOwner()) return bool?true:undefined;
        if (!message.guild.dbconfig.modrole){
            if (bool) return false;
            return {code: '13', msg: 'server moderator role'};
        }
        if (!message.member.roles.has(message.guild.dbconfig.modrole)){
            if (bool) return false;
            return {code: '13', msg: 'server moderator role'};
        }
        if (bool) return true;
    }
    //Discord permission-based system check (with some overrides for global admins)
    function guildperm(given, bool){
        if (!isOwner() && !perms.admin.includes(id)){
            if (!message.member.permissions.toArray().some(x => given.includes(x))) return locexit();
        }
        else {
            let permGrant;
            let ovrGrant;
            given.forEach(perm => {
                if (message.member.hasPermission(perm)) permGrant = true;
                if (adminOverrides.includes(perm)) ovrGrant = true;
            });
            if ((!permGrant && !ovrGrant) && !isOwner()) return locexit();
        }
        if (bool) return true;
        function locexit(){
            if (bool) return false;
            return {code: '13', msg: given.length === 1?`${given} permission`:`one of ${given.join(", ")} permissions`}
        }
    }
    function levelCheck(cmdPerms){
        if (cmdPerms){ //when cmd.perms is given
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
        if (!isOwner()){ //disabling handler for users with owner perms aka bot's gods
            if (cmd.perms[0]){
                switch(cmd.perms[0]){
                    case "owner":
                        if (beSilent) return false;
                        else return {code: '13', msg: 'bot owner'};
                    case "admin":return isAdmin(beSilent);
                    case "mod":return isMod(beSilent);
                    case false:if (beSilent) return true;
                }
            }
            if (cmd.perms[1]) switch(cmd.perms[1]){
                case "modrole":return isModrole(beSilent);
                case false:if (beSilent) return true;
            }
            if (cmd.perms.slice(2).length) return guildperm(cmd.perms.slice(2), beSilent);
        }
        if (beSilent) return true;
    }
    function sufficientRole(msgmember, reqmember){
        if (!isOwner()){
            if (msgmember.highestRole.calculatedPosition <= reqmember.highestRole.calculatedPosition) return false;
        }
        return true;
    }
    return {
        isBanned: isBanned,
        isOwner: isOwner,
        isAdmin: isAdmin,
        isMod: isMod,
        isModrole: isModrole,
        guildperm: guildperm,
        levelCheck: levelCheck,
        isAllowed: isAllowed,
        sufficientRole: sufficientRole
    }
}