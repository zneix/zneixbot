module.exports = async message => {
    if (message.author.bot) return; //ignoring bots
    try {
        //getting server settings
        let {getCommand, getGuildConfig} = require('../src/utils/loader');
        if (message.guild){
            //funny thing to react on mention, catching to prevent logging stupid fucking mistakes, man
            if (message.mentions.has(message.guild.me)) message.react(client.emoteHandler.guild('asset', 'peepoPinged')).catch(e => {return;});
            //sending DansGame message, but only in channels, where everyone can freely type and read, disabled for now
            // if (message.mentions.everyone && (message.channel.permissionsFor(message.guild.id).missing(['SEND_MESSAGES', 'VIEW_CHANNEL']).length == 0)) message.reply(`you don't ping everyone ${client.emoteHandler.find('DansGame')}`);
            await getGuildConfig(message.guild);
            let config = client.go[message.guild.id].config;
            message.prefix = config.customprefix == null ? client.config.prefix : config.customprefix;
        }
        if (!message.prefix) message.prefix = client.config.prefix; //making sure message.prefix is defined, used in DM channels
        if (message.content == client.user.toString() || message.content == `<@!${client.user.id}>`) message.channel.send(`Hey ${message.author}, my prefix is \`${message.prefix}\``, {embed:{color:Math.floor(Math.random()*16777215),description:'[Support Server](https://discordapp.com/invite/cF555AV)'}});

        if (message.content.toLowerCase().startsWith(message.prefix)){
            //command handling
            if (client.perms.isBanned(message.author.id)) return; //check for bot ban, regular return for now
            message.args = message.content.slice(message.prefix.length).trim().split(/\s+/gm);
            if (!message.args.length) return; //quick escape in weird cases (e.g. someone types only prefix, no command)
            let commandName = message.args.shift().toLowerCase();
            let cmd = getCommand(commandName);
            if (!cmd) return; //simple return, when command isn't found
            //checking if user can actually call the command
            if (!cmd.dmable && message.channel.type == 'dm') return require('../src/utils/errors').command(message, ['normal', 'This command can\'t be used in DM channels!']);
            if (message.channel.type != 'dm') if (!client.perms.isAllowed(cmd, message.channel, message.member)) return;
            try {
                cmd.run(message).then(function(){
                    //command count incrementation
                    client.cc++;
                    //logging stuff
                    client.logger.command(message, cmd, cmd.level);
                    //handling cooldowns with an exception for immune users
                    if (client.perms.getUserLvl(message.author.id) >= client.perms.levels['skipCooldowns']) return;
                    client.cooldowns[cmd.name].add(`${message.guild ? message.guild.id : message.channel.id}_${message.author.id}`);
                    setTimeout(function(){ client.cooldowns[cmd.name].delete(`${message.guild ? message.guild.id : message.channel.id}_${message.author.id}`); }, cmd.cooldown);
                }).catch(async err => { require('../src/utils/errors').command(message, err); });
            }
            catch (errorino){require('../src/utils/errors').message(message, errorino);}
        }
        //message handling
        if (message.channel.type != 'dm') require('../src/modules/leveling')(message);
    }
    catch (err){
        console.log('Insane message event error!!!!! Stack below:');
        console.trace(err);
    }
}