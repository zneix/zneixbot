exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'The dynamic help command for getting information about other commands.';
exports.usage = `Running this command without arguments will print command list.\nRunning: **{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}** **<command name>** gives you information about specific commands and their usage.`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(false, async () => {
        let cmdUtil = require('../utils/eventCommandHandler');
        if (message.args.length) cmd = cmdUtil.getCommand(client, message.args[0].toLowerCase());
        if (!message.args.length || !cmd || !message.perms.isAllowed(cmd, true)){
            let commandList = "";
            //${cmdUtil.aliases[key]?`  aliases:  \`${cmdUtil.aliases[key].join('\`, \`')}\``:''} //alias support (temporarily disabled ;_;)
            client.commands.filter(cmd => !cmd.perms[0] && !cmd.perms[1] && !cmd.perms[2]).forEach((object, key, map) => commandList = commandList.concat(`\`${key}\` | `));
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
                        value: commandList.slice(0, -2)
                    }
                ],
            }
            //showing extra commands
            //append guild mod commands
            let guildModList = "";
            //${cmdUtil.aliases[key]?` aliases:  \`${cmdUtil.aliases[key].join('\`, \`')}\``:''} //alias support for guild-based commands
            client.commands.filter((object, key, map) => object.perms.slice(2).length && message.perms.guildperm(object.perms.slice(2), true) && !object.cloned).forEach((object, key, map) => guildModList = guildModList.concat(`\`${key}\` | `));
            client.commands.filter((object, key, map) => object.perms[1] == 'modrole' && message.perms.isModrole(cmd, true)).forEach((object, key, map) => guildModList = guildModList.concat(`\`${key}\` | `));
            if (guildModList.length){
                embed.fields.push({
                    name: client.emoteHandler.asset("mod")+" Server Moderator commands",
                    value: guildModList.slice(0, -2)
                });
            }
            // append mod commands
            if (message.perms.levelCheck().number > 0){
                let modList = "";
                client.commands.filter(cmd => cmd.perms[0] === 'mod').forEach((object, key, map) => modList = modList.concat(`\`${key}\` | `));
                embed.fields.push({
                    name: client.emoteHandler.asset("supermod")+" Bot Moderator commands",
                    value: modList.slice(0, -2)
                });
            }
            // append admin commands
            if (message.perms.levelCheck().number > 1){
                let adminList = "";
                client.commands.filter(cmd => cmd.perms[0] === 'admin').forEach((object, key, map) => adminList = adminList.concat(`\`${key}\` | `));
                await embed.fields.push({
                    name: client.emoteHandler.asset("staff")+" Bot Administrator commands",
                    value: adminList.slice(0, -2)
                });
            }
            // append owner commands
            if (message.perms.levelCheck().number > 2){
                let ownerList = "";
                client.commands.filter(cmd => cmd.perms[0] === 'owner').forEach((object, key, map) => ownerList = ownerList.concat(`\`${key}\` | `));
                await embed.fields.push({
                    name: client.emoteHandler.asset("broadcaster")+" Bot Owner commands",
                    value: ownerList.slice(0, -2)
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
        message.channel.send({embed:embed});
    });
}