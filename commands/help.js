exports.description = 'Lists all commands available for you to use in current channel.'
+`\nUse: **{PREFIX}help <command name>** to get information about specific commands and their usage.`;
exports.usage = '\n<command name>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 3000;
exports.dmable = false;

exports.run = async message => {
    let cmdUtil = require('../src/utils/loader');
    let embed, cmd;
    if (message.args.length) cmd = cmdUtil.getCommand(message.args[0].toLowerCase());
    if (!message.args.length || !cmd){
        //${cmdUtil.aliases[key]?`  aliases:  \`${cmdUtil.aliases[key].join('\`, \`')}\``:''} //alias support (temporarily disabled ;_;)
        embed = { //send general help with command list
            color: parseInt('0x99ff66'),
            author: {
                name: `${client.user.tag}, ver ${client.version}`,
                icon_url: client.user.avatarURL({format: 'png', dynamic: true, size: 4096})
            },
            description: exports.description.replace(/{PREFIX}/, message.prefix),
            fields: [
                {
                    name: `${client.emoteHandler.guild('asset', 'subscriber')} User commands`,
                    value: client.commands.filter(cmd => !cmd.perms.length && cmd.level < client.perms.levels.minguildmod).map((object, key, map) => `\`${key}\``).join(' | ')
                }
            ],
        }
        //showing extra commands
        //append guild mod commands
        let guildModList = client.commands.filter(cmd => (cmd.perms.length && client.perms.guildPerm(cmd.perms, message.channel, message.member)) || (cmd.level >= client.perms.levels.minguildmod && cmd.level <= client.perms.levels.maxguildmod && client.perms.getGuildLevel(message.member, cmd.level))).map((object, key, map) => `\`${key}\``).join(' | ');
        //${cmdUtil.aliases[key]?` aliases:  \`${cmdUtil.aliases[key].join('\`, \`')}\``:''} //alias support for guild-based commands
        if (guildModList.length){
            embed.fields.push({
                name: `${client.emoteHandler.guild('asset', 'mod')} Server Moderator commands`,
                value: guildModList
            });
        }
        // append mod commands
        if (client.perms.getUserLvl(message.author.id) >= client.perms.levels.mod){
            embed.fields.push({
                name: `${client.emoteHandler.guild('asset', 'supermod')} Bot Moderator commands`,
                value: client.commands.filter(cmd => cmd.level >= client.perms.levels.mod && cmd.level < client.perms.levels.admin).map((object, key, map) => `\`${key}\``).join(' | ')
            });
        }
        // append admin commands
        if (client.perms.getUserLvl(message.author.id) >= client.perms.levels.admin){
            embed.fields.push({
                name: `${client.emoteHandler.guild('asset', 'broadcaster')} Bot Administrator commands`,
                value: client.commands.filter(cmd => cmd.level >= client.perms.levels.admin && cmd.level < client.perms.levels.god).map((object, key, map) => `\`${key}\``).join(' | ')
            });
        }
        // append owner commands
        if (client.perms.isGod(message.author.id)){
            embed.fields.push({
                name: `${client.emoteHandler.guild('asset', 'staff')} Bot Owner commands`,
                value: client.commands.filter(cmd => cmd.level >= client.perms.levels.god).map((object, key, map) => `\`${key}\``).join(' | ')
            });
        }
    }
    //send dynamic help
    else {
        if (!client.perms.isAllowed(cmd, message.channel, message.member)) return message.channel.send(`You're not allowed to use this command ${client.emoteHandler.guild('asset', 'Jebaited')}`);
        embed = {
            color: 0x99ff66,
            author: {
                name: `${cmd.name} [${cmd.cooldown ? `${cmd.cooldown / 1000}s`: 'no'} cooldown]`,
                icon_url: client.user.avatarURL({format: 'png', dynamic: true, size: 4096})
            }, 
            description: cmd.description.replace(/{PREFIX}/g, message.prefix),
            fields: [
                {
                    name: '**Usage:**',
                    value: cmd.usage.split('\n').map(u => `${message.prefix}${cmd.name} ${u}`).join(`\n`)
                }
            ],
        }
        //appending aliases if those are present
        if (cmdUtil.getAliases(cmd.name)) embed.fields.push({
            name: '**Aliases:**',
            value: cmdUtil.getAliases(cmd.name).join(' | ')
        });
    }
    if (message.args.length && !cmd) message.channel.send(`Provided command isn't loaded or you're not allowed to use it ${client.emoteHandler.guild('asset', 'Jebaited')}`);
    else message.channel.send({embed:embed});
}