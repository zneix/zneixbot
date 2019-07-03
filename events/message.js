module.exports = (client, message) => {
    if (message.author.bot || message.channel.type === "dm") return;
    try {
        message.args = message.content.split(' ');
        let prefix = client.config.prefix.toString().toLowerCase();
        if (message.content.startsWith(prefix)) {
            if (prefix.endsWith(" ")) var command = message.args[1].toLowerCase();
            else var command = message.content.split(/ +/g)[0].slice(prefix.length).toLowerCase();
            //command handling
            let cmd = client.commands.get(command);
            if (!cmd) throw `"${command}" is not a command!`;
            //permission handler
            let perms = client.perms;
            let id = message.author.id;
            switch(cmd.perms){
                case "owner":
                    if (!perms.owner.includes(id)) throw "This command requires **bot owner** prvileges to run!"
                    console.log(`owner command called!`);
                    break;
                case "admin":
                    if (!perms.owner.includes(id) && !perms.admin.includes(id)) throw "This command requires **bot administrator** prvileges to run!"
                    console.log(`admin command called!`);
                    break;
                case "mod":
                    if (!perms.owner.includes(id) && !perms.admin.includes(id) && !perms.mod.includes(id)) throw "This command requires **bot moderator** prvileges to run!"
                    console.log(`mod command called!`);
                    break;
                case "user":
                    console.log(`user command called!`);
                    break;
                default:
                    throw `Command ${cmd.name.substr(8)} missing export.permission definition or has non-standard/unusual permission definition. Check Permissions Handler SwitchCase for available permissions or add a new one if needed. Consult with others before hand.`
            }
            if (perms.ban.includes(id)) throw "You are banned from the bot!"
            cmd.run(client, message);
        }
        else {
            //message handling
        }
    }
    catch (err) {
        if (typeof err !== "string") err.stack = err;
        console.log(err);
        var embed = {
            color: 0xff5050,
            author: {
                name:message.channel.guild.name+" — \""+message.channel.name+"\"",
                icon_url: message.author.avatarURL
            },
            description: `There was an error in the message event:`,
            fields:[
                {
                    name: "Reason:",
                    value: err.substring(0,1023),
                }
            ],
            timestamp: new Date()
        }
        //deleting error
        message.channel.send({embed:embed}).then(msg => {
            if (client.config.delete.error) msg.delete(client.config.delete.time);
        });
    }
}