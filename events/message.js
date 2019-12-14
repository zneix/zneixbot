module.exports = (client, message) => {
    if (message.author.bot || message.channel.type === "dm") return;
    if (message.isMemberMentioned(message.guild.me)) message.react(client.config.emojis.peepoPinged);
    if (message.mentions.everyone) message.reply("you don't ping everyone "+client.emoteHandler.find("DansGame")); //unfinished, add emote handler
    if (message.content.startsWith(client.user) || message.content.startsWith(`<@!${client.user.id}>`)) message.channel.send(`Hey ${message.author}, my prefix is \`${client.config.prefix}\``, {embed:{color:Math.floor(Math.random()*16777215),description:'[Support Server](https://discordapp.com/invite/cF555AV)'}});
    try {
        //funny thing to react on mention
        let prefix = function(){return message.content.substr(0, client.config.prefix.length).toLowerCase();}
        if (prefix() == client.config.prefix){
            message.perms = require('../utils/permsHandler')(client, message);
            message.perms.isBanned(); //ban check
            //function for getting command name
            function command(){
                if (prefix().endsWith(" ")) return message.content.split(/\s+/gm)[1].toLowerCase();
                return message.content.split(/\s+/gm).shift(1).slice(prefix().length).toLowerCase();
            }
            if (!command()) return; //quick escape in weird cases (e.g. someone types only prefix, no command)
            //args declaration
            if (prefix().endsWith(" ")) message.args = message.content.split(/[ \s]+/gm).slice(2);
            else message.args = message.content.slice(client.config.prefix.length).split(/[ \s]+/gm).slice(1);
            //command handling
            let cmd = client.commands.get(command());
            if (!cmd) throw `"${command()}" is not a command!`;
            //permission handler
            message.perms.isAllowed(cmd, false);
            //actual running a command
            cmd.run(client, message);
        }
        //message handling (removed it from else, because I want it to be running even if someone executes a command)
    }
    catch (err) {client.logger.caughtError(message, err, "message");}
}