exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Emote showcaser - under developement.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} :emote:`;
exports.perms = 'user';

exports.run = (client, message) => {
    let emote = require('../utils/emoteHandler')(client);
    message.cmd = this;
    message.command(1, async () => {
        if (/<:[a-zA-Z0-9-_]+:\d+>/.test(message.args[0]) || /<a:[a-zA-Z0-9-_]+:\d+>/.test(message.args[0])) {
            let id = /:\d+>/g.exec(message.args[0]).toString().slice(1, -1);
            let url = `https://cdn.discordapp.com/emojis/${id}.${/<a:/.test(message.args[0])?"gif":"png"}`;
            message.channel.send(`<${url}>`, {file:url});
        }
        //TODO: Finish this later ;)
        // else if (/^\d+$/.test(message.args[0])) {
        //     let url = `https://cdn.discordapp.com/emojis/${message.args[0]}`;
        //     try {message.channel.send(`<${url}>`, {file:url});}
        //     catch (issue) {throw "coś poszło nie tak ;c\n"+issue}
        // }
        else message.channel.send("that's not an emote nor it's ID "+emote.find("NaM"));
    });
}