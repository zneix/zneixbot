exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `The command for getting help information on other commands.`;
exports.usage = `Running **{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** without any arguments will result in this message and Command List.\n\nRunning: **{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** ***(command)*** gets you information about specific commands and their usage.`
exports.perms = `user`

exports.run = (client, message) => {
    message.command(false, async () => {
        var prefix = client.config.prefix;
        if (message.args.length) cmd = client.commands.get(message.args[0].toLowerCase());
        if (!message.args.length || !cmd) {
            let commandList = "";
            client.commands.forEach((object, key, map) => commandList = commandList.concat(`\`${key}\`\n`));
            var cmd = client.commands.get("help");
            embed = { //send general help with command list
                color: parseInt("0x99ff66"),
                author: {
                    name:`${client.user.tag} ${client.version}`,
                    icon_url: client.user.avatarURL
                },
                fields:[
                    {
                        name:"**Help**",
                        value:`${cmd.usage.replace(/{PREFIX}/g, prefix)}`
                    },
                    {
                        name: "List of all commands:",
                        value: commandList
                    }
                ],
            }
            return message.channel.send({embed:embed}).then(msg => msg.delete(90000));
        }
        embed = { //send dynamic help
            color: 0x99ff66,
            author: {
                name:`${cmd.name.replace(/{PREFIX}/g, prefix)}`,
                icon_url: client.user.avatarURL
            }, 
            description:cmd.description.replace(/{PREFIX}/g, prefix),
            fields:[
                {
                    name:"**Usage:**",
                    value:cmd.usage.replace(/{PREFIX}/g, prefix)
                },
            ],
        }
        return message.channel.send({embed:embed}).then(msg => msg.delete(90000));
    });
}