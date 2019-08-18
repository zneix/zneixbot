exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `The command for getting help information on other commands.`;
exports.usage = `Running **{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** without any arguments will result in this message and Command List.\n\nRunning: **{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** **(command)** gives you information about specific commands and their usage.`;
exports.perms = 'user';

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        var prefix = client.config.prefix;
        if (message.args.length) cmd = client.commands.get(message.args[0].toLowerCase());
        if (!message.args.length || !cmd || !message.perms.isAllowed(cmd, true)) {
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
                        name: "User commands",
                        value: commandList
                    }
                ],
            }
            //showing extra commands
            function emote(emoteName){
                let assets = client.guilds.get(client.config.guilds.asset);
                return assets.emojis.find(e => e.name === emoteName);
            }
            // append mod commands
            if (message.perms.levelCheck().number > 0) {
                let modList = "";
                client.commands.filter(cmd => cmd.perms === 'mod').forEach((object, key, map) => modList = modList.concat(`\`${key}\`\n`))
                embed.fields.push({
                    name: emote("mod")+" Moderator commands",
                    value: modList
                });
            }
            // append admin commands
            if (message.perms.levelCheck().number > 1) {
                let adminList = "";
                client.commands.filter(cmd => cmd.perms === 'admin').forEach((object, key, map) => adminList = adminList.concat(`\`${key}\`\n`))
                await embed.fields.push({
                    name: emote("staff")+" Administrator commands",
                    value: adminList
                });
            }
            // append owner commands
            if (message.perms.levelCheck().number > 2) {
                let ownerList = "";
                client.commands.filter(cmd => cmd.perms === 'owner').forEach((object, key, map) => ownerList = ownerList.concat(`\`${key}\`\n`))
                await embed.fields.push({
                    name: emote("broadcaster")+" Owner commands",
                    value: ownerList
                });
            }
            return message.channel.send({embed:embed});
        }
        //send dynamic help
        embed = {
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
        return message.channel.send({embed:embed});
    });
}