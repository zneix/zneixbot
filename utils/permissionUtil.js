module.exports = (client, message) => {
    let perms = client.perms;
    let id = message.author.id;

    let owner = function(){
        if (!perms.owner.includes(id)) return false;
        return true;
    }
    let admin = function(cmd){
        if (!perms.owner.includes(id) && !perms.admin.includes(id)) throw "This command requires **bot administrator** prvileges to run!"
        return console.log("admin command called!");
    }
    let mod = function(cmd){
        if (!perms.owner.includes(id) && !perms.admin.includes(id) && !perms.mod.includes(id)) throw "This command requires **bot moderator** prvileges to run!"
        return console.log("mod command called!");
    }
    let banned = function(){
        if (perms.ban.includes(id)) throw "You are banned from the bot!"
    }
    let check = function(perms){
        if (!message.member.hasPermission(perms)) throw `This command requires ${perms.length === 1?`**${perms}** permission`:`**${perms.join(", ")}** permissions`} to run!`
    }
    return {
        check: check,
        isOwner: owner,
        isAdmin: admin,
        isMod: mod,
        isBanned: banned
    }
}