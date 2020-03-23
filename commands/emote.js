exports.description = 'Sends emote as an image and link to it.';
exports.usage = '<discord emote>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.pipeable = false;

exports.run = async (client, message) => {
    let res = /<(a?):([a-z0-9-_]+):(\d+)>/i.exec(message.args[0]);
    //res[0] - whole string; res[1] - is animated; res[2] - name; res[3] - id
    if (res){
        let id = res[3];
        let url = `https://cdn.discordapp.com/emojis/${id}.${res[1] ? 'gif' : 'png'}`;
        message.channel.send(`<${url}>`, {file:url});
    }
    //TODO: Finish this later ;)
    else if (/^\d+$/.test(message.args[0])){
        let r = await require('node-fetch')(`https://cdn.discordapp.com/emojis/${message.args[0]}`);
        console.log(r.status)
        if (r.status == 200){
            message.channel.send(`Emote link: https://cdn.discordapp.com/emojis/${message.args[0]}.png\nAnimated emote link: https://cdn.discordapp.com/emojis/${message.args[0]}.gif`);
            return;
        }
    }
    throw ['normal', `That's not an emote or ID you provided is invalid ${client.emoteHandler.find('NaM')}`];
}
