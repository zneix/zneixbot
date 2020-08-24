exports.description = 'Sends emote as an image and link to it.';
exports.usage = '<discord emote>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = true;

exports.run = async message => {
    let res = /<(a?):([a-z0-9-_]+):(\d+)>/i.exec(message.args[0]);
    //res[0] - whole string; res[1] - is animated; res[2] - name; res[3] - id
    if (res){
        let id = res[3];
        let url = `${client.options.http.cdn}/emojis/${id}.${res[1] ? 'gif' : 'png'}`;
        message.channel.send(`<${url}>`, {files:[url]});
        return;
    }
    //TODO: Finish this later ;)
    else if (/^\d+$/.test(message.args[0])){
        let r = await require('node-fetch')(`${client.options.http.cdn}/emojis/${message.args[0]}`);
        if (r.status == 200){
            message.channel.send(`Emote link: ${client.options.http.cdn}/emojis/${message.args[0]}.png\nAnimated emote link: ${client.options.http.cdn}/emojis/${message.args[0]}.gif`);
            return;
        }
    }
    throw ['normal', `ID you provided is invalid ${client.emoteHandler.find('NaM')}`];
}
