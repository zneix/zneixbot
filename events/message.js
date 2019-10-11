module.exports = (client, message) => {
    if (message.author.bot || message.channel.type === "dm") return;
    let emote = require('../utils/emoteHandler')(client);
    if (message.isMemberMentioned(message.guild.me)) message.react(client.config.emojis.peepoPinged);
    if (message.mentions.everyone) message.reply("you don't ping everyone "+emote.find("DansGame")); //unfinished, add emote handler
    if (message.content.startsWith(client.user)) message.channel.send(`Hey ${message.author}, my prefix is \`${client.config.prefix}\``, {embed:{color:Math.floor(Math.random()*16777215),description:'[Support Server](https://discordapp.com/invite/cF555AV)'}});
    try {
        //funny thing to react on mention
        let prefix = function(){return message.content.substr(0, client.config.prefix.length).toLowerCase();}
        if (prefix() == client.config.prefix) {
            message.perms = require('../utils/permsHandler')(client, message);
            message.perms.isBanned(); //ban check
            let command = function(){
                if (prefix().endsWith(" ")) return message.content.split(/\s+/gm)[1].toLowerCase();
                return message.content.split(/\s+/gm).shift(1).slice(prefix().length).toLowerCase();
            }
            //args declaration
            if (prefix().endsWith(" ")) {
                message.args = message.content.split(/[ \s]+/gm);
                message.args.splice(0, 2);
            }
            else {
                message.args = message.content.slice(client.config.prefix.length).split(/[ \s]+/gm);
                message.args.splice(0, 1);
            }
            //command handling
            let cmd = client.commands.get(command());
            if (!cmd) throw `"${command()}" is not a command!`;
            //permission handler
            message.perms.isAllowed(cmd, false);
            //actual running a command
            cmd.run(client, message);
        }
        else {
            //message handling
        }
    }
    catch (err) {
        client.logger.caughtError(message, err, "message");
    }
}