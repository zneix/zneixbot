module.exports = (client, message) => {
    if (message.mentions.members.get(client.user.id)) message.react(client.config.emojis.peepoPinged);
    if (message.author.bot || message.channel.type === "dm") return;
    try {
        //funny thing to react on mention
        let prefix = function(){return message.content.substr(0, client.config.prefix.length).toLowerCase();}
        if (prefix() == client.config.prefix) {
            const perms = require(`../utils/permissionUtil`)(client, message);
            perms.isBanned(); //ban check
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
            if (!perms.isOwner()) {
                if (typeof cmd.perms !== "string") perms.check(cmd.perms);
                else switch(cmd.perms){
                    case "owner":throw "This command requires **bot owner** prvileges to run!";break;
                    case "user":console.log(`user command called!`);break;
                    case "admin":perms.isAdmin(cmd);break;
                    case "mod":perms.isMod(cmd);break;
                    default:throw `Command ${cmd.name.substr(8)} missing export.permission definition or has non-standard/unusual permission definition. Check Permissions Handler SwitchCase for available permissions or add a new one if needed. Consult with others before hand.`;
                }
            }
            else console.log((typeof cmd.perms !== "string"?"guild-perm":cmd.perms)+" command called!");
            cmd.run(client, message);
        }
        else {
            //message handling
        }
    }
    catch (err) {
        if (typeof err !== "string") err.stack = err;
        console.log(err);
        var embed = {
            color: 0xff5050,
            author: {
                name:message.channel.guild.name+" — \""+message.channel.name+"\"",
                icon_url: message.author.avatarURL
            },
            description: `There was an error in the message event:`,
            fields:[
                {
                    name: "Reason:",
                    value: err.substring(0,1023),
                }
            ],
            timestamp: new Date()
        }
        //deleting error
        message.channel.send({embed:embed}).then(msg => {
            if (client.config.delete.error) msg.delete(client.config.delete.time);
        });
    }
}