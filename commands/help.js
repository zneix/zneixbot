exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `The command for getting help information on other commands.`;
exports.usage = `Running **{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** without any arguments will result in this message and Command List.\n\nRunning: **{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** **(command)** gives you information about specific commands and their usage.`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let cmdUtil = require('../utils/eventCommandHandler');
        if (message.args.length) cmd = cmdUtil.getCommand(client, message.args[0].toLowerCase());
        if (!message.args.length || !cmd || !message.perms.isAllowed(cmd, true)){
            let commandList = "";
            client.commands.filter(cmd => !cmd.perms[0] && !cmd.perms[1]).forEach((object, key, map) => commandList = commandList.concat(`\`${key}\`${cmdUtil.aliases[key]?`  aliases:  \`${cmdUtil.aliases[key].join('\`, \`')}\``:''}\n`));
            let cmd = client.commands.get("help");
            embed = { //send general help with command list
                color: parseInt("0x99ff66"),
                author: {
                    name: client.user.tag+" "+client.version,
                    icon_url: client.user.avatarURL
                },
                fields: [
                    {
                        name: "**Help**",
                        value: `${cmd.usage.replace(/{PREFIX}/g, message.guild.prefix)}`
                    },
                    {
                        name: client.emoteHandler.asset("subscriber")+" User commands",
                        value: commandList
                    }
                ],
            }
            //showing extra commands
            //append guild mod commands
            let guildModList = "";
            client.commands.filter((object, key, map) => object.perms.slice(2).length && message.perms.guildperm(object.perms.slice(2), true) && !object.cloned).forEach((object, key, map) => guildModList = guildModList.concat(`\`${key}\`${cmdUtil.aliases[key]?` aliases:  \`${cmdUtil.aliases[key].join('\`, \`')}\``:''}\n`));
            client.commands.filter((object, key, map) => object.perms[1] == 'modrole' && message.perms.isModrole(cmd, true)).forEach((object, key, map) => guildModList = guildModList.concat(`\`${key}\`${cmdUtil.aliases[key]?` aliases:  \`${cmdUtil.aliases[key].join('\`, \`')}\``:''}\n`));
            if (guildModList.length){
                embed.fields.push({
                    name: client.emoteHandler.asset("mod")+" Server Moderator commands",
                    value: guildModList
                });
            }
            // append mod commands
            if (message.perms.levelCheck().number > 0){
                let modList = "";
                client.commands.filter(cmd => cmd.perms[0] === 'mod').forEach((object, key, map) => modList = modList.concat(`\`${key}\`${cmdUtil.aliases[key]?`  aliases:  \`${cmdUtil.aliases[key].join('\`, \`')}\``:''}\n`));
                embed.fields.push({
                    name: client.emoteHandler.asset("supermod")+" Bot Moderator commands",
                    value: modList
                });
            }
            // append admin commands
            if (message.perms.levelCheck().number > 1){
                let adminList = "";
                client.commands.filter(cmd => cmd.perms[0] === 'admin').forEach((object, key, map) => adminList = adminList.concat(`\`${key}\`${cmdUtil.aliases[key]?`  aliases:  \`${cmdUtil.aliases[key].join('\`, \`')}\``:''}\n`));
                await embed.fields.push({
                    name: client.emoteHandler.asset("staff")+" Bot Administrator commands",
                    value: adminList
                });
            }
            // append owner commands
            if (message.perms.levelCheck().number > 2){
                let ownerList = "";
                client.commands.filter(cmd => cmd.perms[0] === 'owner').forEach((object, key, map) => ownerList = ownerList.concat(`\`${key}\`${cmdUtil.aliases[key]?`  aliases:  \`${cmdUtil.aliases[key].join('\`, \`')}\``:''}\n`));
                await embed.fields.push({
                    name: client.emoteHandler.asset("broadcaster")+" Bot Owner commands",
                    value: ownerList
                });
            }
        }
        //send dynamic help
        else {
            embed = {
                color: 0x99ff66,
                author: {
                    name: `${cmd.name.replace(/{PREFIX}/g, message.guild.prefix)}`,
                    icon_url: client.user.avatarURL
                }, 
                description: cmd.description.replace(/{PREFIX}/g, message.guild.prefix),
                fields: [
                    {
                        name: "**Usage:**",
                        value: cmd.usage.replace(/{PREFIX}/g, message.guild.prefix)
                    }
                ],
            }
            //appending aliases if those are present
            if (cmdUtil.aliases[cmd.name.replace(/{PREFIX}/, '')]) embed.fields.push({
                name: "**Aliases**",
                value: cmdUtil.aliases[cmd.name.replace(/{PREFIX}/, '')].join('\n')
            });
        }
        return message.channel.send({embed:embed});
    });
}