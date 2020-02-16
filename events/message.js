module.exports = async (client, message) => {
    if (message.isMemberMentioned(message.guild.me)) message.react(client.emoteHandler.guild('asset', 'peepoPinged')); //funny thing to react on mention
    if (message.author.bot || message.channel.type === "dm") return;
    if (message.mentions.everyone && (message.channel.permissionsFor(message.guild.id).missing(['SEND_MESSAGES', 'VIEW_CHANNEL']).length == 0)) message.reply("you don't ping everyone "+client.emoteHandler.find("DansGame")); //sending DansGame message, but only in channels, where everyone can freely type and read
    try {
        //getting guild settings
        message.guild.dbconfig = (await client.db.utils.find('guilds', {guildid: message.guild.id}))[0];
        if (!message.guild.dbconfig) message.guild.dbconfig = await client.db.utils.newGuildConfig(message.guild.id);
        message.guild.prefix = message.guild.dbconfig.customprefix===null?client.config.prefix:message.guild.dbconfig.customprefix;
        if (message.content.startsWith(client.user) || message.content.startsWith(`<@!${client.user.id}>`)) message.channel.send(`Hey ${message.author}, my prefix is \`${message.guild.prefix}\``, {embed:{color:Math.floor(Math.random()*16777215),description:'[Support Server](https://discordapp.com/invite/cF555AV)'}});
        //command handling
        if (message.content.substr(0, message.guild.prefix.length).toLowerCase() === message.guild.prefix){
            message.perms = require('../utils/permsHandler')(client, message);
            let isErrored = require('../utils/errorHandler').isErrored;
            let isban = message.perms.isBanned();
            isErrored(message, isban); //ban check
            //getting command name
            let command = message.content.slice(message.guild.prefix.length).trim().split(/\s+/gm)[0].toLowerCase();
            if (!command) return; //quick escape in weird cases (e.g. someone types only prefix, no command)
            //args declaration
            message.args = message.content.slice(message.guild.prefix.length).trim().split(/[ \s]+/gm).slice(1);
            //getting a command
            let cmd = require('../utils/eventCommandHandler').getCommand(client, command);
            if (!cmd) return;
            //permission handler
            let isPemitted = message.perms.isAllowed(cmd, false);
            if (typeof isPemitted == 'object') return isErrored(message, isPemitted);
            //actual running a command
            cmd.run(client, message);
        }
        //message handling (removed it from else, because I want it to be running even if someone executes a command)
        require('../utils/levelingHandler')(client, message);
    }
    catch (err){client.logger.caughtError(message, err, "message");}
}