module.exports = async message => {
    if (message.author.bot) return; //ignoring bots
    if (message.channel.type == 'dm') return; //ignoring dm channels
    try {
        //getting server settings
        let {getCommand, getGuildConfig} = require('../src/utils/loader');
        await getGuildConfig(message.guild);
        let config = client.go[message.guild.id].config;
        message.prefix = config.customprefix == null ? client.config.prefix : config.customprefix;
        if (!message.prefix) message.prefix = client.config.prefix; //making sure message.prefix is defined, used in DM channels

        if (message.content.toLowerCase().startsWith(message.prefix)){
            //command handling
            message.args = message.content.slice(message.prefix.length).trim().split(/\s+/gm);
            if (!message.args.length) return; //quick escape in weird cases (e.g. someone types only prefix, no command)
            let commandName = message.args.shift().toLowerCase();
            let cmd = getCommand(commandName);
            if (!cmd) return; //simple return, when command isn't found

            //checking if user can actually call the command
            if (!client.perms.isAllowed(cmd, message.channel, message.member)) return;
            try {
                cmd.run(message).then(function(){
                    //command count incrementation
                    client.cc++;
                    //logging stuff
                    client.logger.command(message, cmd, cmd.level);
                    //handling cooldowns with an exception for immune users
                    if (client.perms.getUserLvl(message.author.id) >= client.perms.levels['skipCooldowns']) return;
                    client.cooldowns[cmd.name].add(`${message.guild.id}_${message.member.id}`);
                    setTimeout(function(){ client.cooldowns[cmd.name].delete(`${message.guild.id}_${message.member.id}`); }, cmd.cooldown);
                }).catch(async err => { require('../src/utils/errors').command(message, err); });
            }
            catch (errorino){ require('../src/utils/errors').message(message, errorino); }
        }
        //message handling
        require('../src/modules/leveling')(message);
    }
    catch (err){
        console.log('Insane message event error!!!!! Stack below:');
        console.trace(err);
    }
}
