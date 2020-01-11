module.exports = client => {
    function ready(){
        console.log(`[ready] Connected as: '${client.user.tag}'`);
        let embed = {
            color: 0xf97304,
            timestamp: client.readyAt,
            footer: {
                text: client.user.tag,
                icon_url: client.user.avatarURL
            },
            author: {
                name: "Logged in to WebSocket"
            },
            fields: [
                {
                    name: "User",
                    value: client.user+"\n"+client.user.tag+" `"+client.user.id+"`",
                    inline: false
                },
                {
                    name: "Size",
                    value: `Users: **${client.users.size}**\nGuilds: **${client.guilds.size}**\nChannels: **${client.channels.size}**\nEmotes: **${client.emojis.size}**`,
                    inline: false
                }
            ]
        }
        let logs = client.channels.get(client.config.channels.logs);
        if (logs && !logs.permissionsFor(client.user).missing(['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS']).length) logs.send({embed:embed});
        else console.log("[!ready] logs channel not found or I'm missing perms!"); //code executed as an error message
    }
    function command(message, cmd, level){
        console.log(`(cmd; level ${level}) ${cmd.name.replace(/{PREFIX}/, "")}`);
        let embed = {
            color: 0x0008ff,
            timestamp: message.createdAt,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            author: {
                name: "Command executed"
            },
            description: `**User**: ${message.author} ${message.author.tag}\n**Channel**: ${message.channel} (${message.channel.name} : ${message.channel.id}) \n**Command**: ${cmd.name.replace(/{PREFIX}/, "")}\n**Arguments**: ${message.args.length?(message.content.slice(message.guild.prefix.length).trim().split(/[ \s]+/gm).slice(1).join(" ")):"N/A"}`
        }
        let logs = client.channels.get(client.config.channels.logs);
        if (logs && !logs.permissionsFor(message.guild.me).missing(['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS']).length) logs.send({embed:embed});
        else console.log("(!cmd) logs channel not found or I'm missing perms!");
    }
    function caughtError(message, err, type){
        let errortimestamp = new Date();
        console.log(`A wild error ${errortimestamp} has appeared!`);
        console.log(err);
        switch(type){
            case "message":
                if (typeof err !== "string") err.stack = err.toString();
                break;
            case "reject":
                console.trace("Async/Promise rejection error: "+err);
                break;
            case "sync":
                console.trace("Sync error: "+err);
                break;
            default:console.trace("Unspecified error: "+err);
        }
        //temporary disabling that until Promise rejection system will be done
        let embed = {
            color: 0xff5050,
            author: {
                    name: message.guild.name+" — \""+message.channel.name+"\"",
                    icon_url: message.author.avatarURL
                },
                description: `type: ${type || 'unknown'}\nreference timestamp: ${errortimestamp}\n**${message.author.tag} (${message.author.id})** failed to call: **${message.content}**`,
                fields: [
                    {
                        name: "Reason:",
                        value: err.toString().substring(0,1023),
                    }
                ],
                timestamp: new Date(errortimestamp)
        }
        let errors = client.channels.get(client.config.channels.errors);
        if (errors) errors.send(`<@${client.perms.owner[0]}> ERRORDETECTED, investigate pls!`, {embed:embed});
    }
    return {
        ready: ready,
        command: command,
        caughtError: caughtError
    }
}