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

    let owner = function(){
        if (!perms.owner.includes(id)) return false;
        return true;
    }
    let admin = function(){
        if (!perms.owner.includes(id) && !perms.admin.includes(id)) throw "This command requires **bot administrator** prvileges to run!"
    }
    let mod = function(){
        if (!perms.owner.includes(id) && !perms.admin.includes(id) && !perms.mod.includes(id)) throw "This command requires **bot moderator** prvileges to run!"
    }
    let banned = function(){
        if (perms.ban.includes(id)) throw "You are banned from the bot!"
    }
    let guildperm = function(given){
        if (!owner() && !perms.admin.includes(id)) {
            if (!message.member.hasPermission(given)) locexit();
        }
        //TODO: Finish this clearance later
        let permLack;
        let ovrLack
        given.forEach(perm => {
            console.log(given)
            console.log(perm)
            console.log(!message.member.hasPermission(perm))
            console.log(!adminOverrides.includes(perm))
            if (!message.member.hasPermission(perm)) permLack = true;
            if (!adminOverrides.includes(perm)) ovrLack = true;
        });
        if (permLack && ovrLack) locexit();
        // throw "You have perms FeelsOkayMan";
        function locexit(){throw `This command requires ${given.length === 1?`**${given}** permission`:`**${given.join(", ")}** permissions`} to run!`}
    }
    let levelCheck = function(){
        if (perms.owner.includes(id)) return "owner";
        if (perms.admin.includes(id)) return "admin";
        if (perms.mod.includes(id)) return "mod";
        return "user";
    }
    return {
        guildperm: guildperm,
        levelCheck: levelCheck,
        isOwner: owner,
        isAdmin: admin,
        isMod: mod,
        isBanned: banned
    }
}