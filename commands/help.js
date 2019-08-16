exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `The command for getting help information on other commands.`;
exports.usage = `Running **{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** without any arguments will result in this message and Command List.\n\nRunning: **{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** **(command)** gives you information about specific commands and their usage.`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        var prefix = client.config.prefix;
        if (message.args.length) cmd = client.commands.get(message.args[0].toLowerCase());
        if (!message.args.length || !cmd) {
            let commandList = "";
            client.commands.filter(cmd => cmd.perms === "user").forEach((object, key, map) => commandList = commandList.concat(`\`${key}\`\n`));
            var cmd = client.commands.get("help");
            let embed = { //send general help with command list
                color: parseInt("0x99ff66"),
                author: {
                    name: client.user.tag+" "+client.version,
                    icon_url: client.user.avatarURL
                },
                fields: [
                    {
                        name: "**Help**",
                        value: `${cmd.usage.replace(/{PREFIX}/g, prefix)}`
                    },
                    {
                        name: "List of all commands",
                        value: commandList
                    }
                ],
            }
            //showing extra commands
            switch(message.perms.levelCheck()){
                // append owner commands
                case "owner":
                    let modList = "";
                    client.commands.filter(cmd => cmd.perms === 'mod').forEach((object, key, map) => modList = modList.concat(`\`${key}\`\n`))
                    embed.fields.push({
                        name: "Moderator commands",
                        value: modList
                    });
                // append admin commands
                case "admin":
                    let adminList = "";
                    client.commands.filter(cmd => cmd.perms === 'admin').forEach((object, key, map) => adminList = adminList.concat(`\`${key}\`\n`))
                    await embed.fields.push({
                        name: "Administrator commands",
                        value: adminList
                    });
                // append mod commands
                case "mod":
                    let ownerList = "";
                    client.commands.filter(cmd => cmd.perms === 'owner').forEach((object, key, map) => ownerList = ownerList.concat(`\`${key}\`\n`))
                    await embed.fields.push({
                        name: "Owner commands",
                        value: ownerList
                    });
                case "user":
                    break;
                default:break;
            }
            return message.channel.send({embed:embed});
        }
        embed = { //send dynamic help
            color: 0x99ff66,
            author: {
                name: `${cmd.name.replace(/{PREFIX}/g, prefix)}`,
                icon_url: client.user.avatarURL
            }, 
            description: cmd.description.replace(/{PREFIX}/g, prefix),
            fields: [
                {
                    name: "**Usage:**",
                    value: cmd.usage.replace(/{PREFIX}/g, prefix)
                },
            ],
        }
        return message.channel.send({embed:embed}).then(msg => msg.delete(90000));
    });
}