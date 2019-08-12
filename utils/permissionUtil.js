module.exports = (client, message) => {
    let perms = client.perms;
    let id = message.author.id;

    let owner = function(){
        if (!perms.owner.includes(id)) return false;
        return true;
    }
    let admin = function(/*cmd*/){
        if (!perms.owner.includes(id) && !perms.admin.includes(id)) throw "This command requires **bot administrator** prvileges to run!"
        // return cmdLog(cmd, "admin");
    }
    let mod = function(/*cmd*/){
        if (!perms.owner.includes(id) && !perms.admin.includes(id) && !perms.mod.includes(id)) throw "This command requires **bot moderator** prvileges to run!"
        // return cmdLog(cmd, "mod");
    }
    let banned = function(){
        if (perms.ban.includes(id)) throw "You are banned from the bot!"
    }
    let check = function(perms){
        if (!message.member.hasPermission(perms)) throw `This command requires ${perms.length === 1?`**${perms}** permission`:`**${perms.join(", ")}** permissions`} to run!`
    }
    // function cmdLog(cmd, level){
    //     console.log(`(cmd; level ${level}) ${cmd.name.replace(/{PREFIX}/, "")}`);
    //     let logs = client.channels.get(client.config.channels.logs);
    //     if (logs) {
    //         var embed = {
    //             color: 0x0008ff,
    //             timestamp: new Date(),
    //             footer: {
    //                 text: message.author.tag,
    //                 icon_url: message.author.avatarURL
    //             },
    //             author: {
    //                 name: "Command successfully executed"
    //             },
    //             description: `${message.author} in ${message.channel} \n**Command**: ${cmd.name.replace(/{PREFIX}/, "")}\n**Arguments**: ${message.args.length?message.args.join(" "):"N/A"}`
    //         }
    //         logs.send({embed:embed});
    //     }
    //     else console.log(`(!cmd) logs channel not found!`);
    // }
    return {
        check: check,
        isOwner: owner,
        isAdmin: admin,
        isMod: mod,
        isBanned: banned
        // cmdLog: cmdLog
    }
}