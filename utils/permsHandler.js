module.exports = (client, message) => {
    let perms = client.perms;
    let id = message.author.id;

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
    let guildperm = function(perms){
        if (!message.member.hasPermission(perms)) throw `This command requires ${perms.length === 1?`**${perms}** permission`:`**${perms.join(", ")}** permissions`} to run!`
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