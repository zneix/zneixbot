module.exports = async (client, message) => {
    if (message.isMemberMentioned(message.guild.me)) message.react(client.emoteHandler.guild('asset', 'peepoPinged')); //funny thing to react on mention
    if (message.author.bot) return;
    if (message.channel.type == 'dm'){
        //handle some commands later
        return;
    }
    if (message.mentions.everyone && (message.channel.permissionsFor(message.guild.id).missing(['SEND_MESSAGES', 'VIEW_CHANNEL']).length == 0)) message.reply("you don't ping everyone "+client.emoteHandler.find("DansGame")); //sending DansGame message, but only in channels, where everyone can freely type and read
    try {
        //getting server settings
        if (!client.go[message.guild.id]){
            client.go[message.guild.id] = new Object;
            // client.go[message.guild.id].tr = new Set;
            let config = (await client.db.utils.find('guilds', {guildid: message.guild.id}))[0];
            if (!config) config = await client.db.utils.newGuildConfig(message.guild.id);
            client.go[message.guild.id].config = config;
        }
        let config = client.go[message.guild.id].config;
        let prefix = config.customprefix === null ? client.config.prefix : config.customprefix;
        if (message.content.startsWith(client.user) || message.content.startsWith(`<@!${client.user.id}>`)) message.channel.send(`Hey ${message.author}, my prefix is \`${prefix}\``, {embed:{color:Math.floor(Math.random()*16777215),description:'[Support Server](https://discordapp.com/invite/cF555AV)'}});

        if (message.content.toLowerCase().startsWith(prefix)){
            //command handling
            let perms = require('../src/utils/perms')(client);
            let {getCommand} = require('../src/utils/loader');
            if (perms.isBanned(message.author.id)) return; //check for bot ban, regular return for now
            message.args = message.content.slice(prefix.length).trim().split(/\s+/gm);
            if (!message.args.length) return; //quick escape in weird cases (e.g. someone types only prefix, no command)
            let commandName = message.args.shift().toLowerCase();
            let cmd = getCommand(client.commands, commandName);
            if (!cmd) return; //simple return, when command isn't found
            //checking if user can actually call the command
            if (!perms.isAllowed(cmd, message.member)) return;
            try {
                cmd.run(client, message).then(function(){
                    //command count incrementation
                    client.cc++;
                    //logging stuff
                    //
                    //handling cooldowns with an exception for immune users
                    if (perms.getUserLvl(message.author.id) >= perms.levels['skipCooldowns']) return;
                    client.cooldowns[cmd.name].add(`${message.guild.id}_${message.member.id}`);
                    setTimeout(function(){ client.cooldowns[cmd.name].delete(`${message.guild.id}_${message.member.id}`); }, cmd.cooldown);
                }).catch(async err => require('../src/utils/errors').command(message, err));
            }
            catch (errorino){require('../src/utils/errors').message(message, errorino);}
        }
        //message handling
    }
    catch (err){
        console.log('Insane message event error!!!!! Stack below:');
        console.error(err);
    }
}