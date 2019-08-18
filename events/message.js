module.exports = (client, message) => {
    if (message.mentions.members.get(client.user.id)) message.react(client.config.emojis.peepoPinged);
    if (message.author.bot || message.channel.type === "dm") return;
    try {
        //funny thing to react on mention
        let prefix = function(){return message.content.substr(0, client.config.prefix.length).toLowerCase();}
        if (prefix() == client.config.prefix) {
            message.perms = require('../utils/permsHandler')(client, message);
            message.perms.isBanned(); //ban check
            let command = function(){
                if (prefix().endsWith(" ")) return message.content.split(/ +/g)[1].toLowerCase();
                return message.content.split(/ +/g).shift(1).slice(prefix().length).toLowerCase();
            }
            //args declaration
            if (prefix().endsWith(" ")) {
                message.args = message.content.split(/ +/g);
                message.args.splice(0, 2);
            }
            else {
                message.args = message.content.slice(prefix().length).split(/ +/g);
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