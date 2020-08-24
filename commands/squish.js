exports.description = '\"Squishes\" provided attached image / emote / URL / server member\'s avatar (Outputs only in PNG format for now).';
exports.usage = `<:Kappa:561931926794141768>`
+`\nhttps://static-cdn.jtvnw.net/emoticons/v1/114836/3.0`
+`\n<@506606171906637855>`
+`\n506606171906637855`;
exports.level = 0;
exports.perms = [];
exports.cooldown = 7000;
exports.dmable = true;

exports.run = async message => {
    const canvas = require('canvas');
    const fetch = require('node-fetch');
    let url;
    let msg = await message.channel.send('Analyzing image...');

    //attached files
    if (message.attachments.size){
        if (!(await fetch(message.attachments.first().url)).headers.get('content-type').startsWith('image')) throw ['normal', 'Provided file is not an image!'];
        url = message.attachments.first().url;
    }
    else {
        //trying arguments
        if (!message.args.length) throw ['normal', 'You must attach an image, custom emote, URL, or userID / @Mention !'];
    
        //emote
        let res = /<(a?):([a-z0-9-_]+):(\d+)>/i.exec(message.args[0]);
        //res[0] - whole string; res[1] - is animated; res[2] - name; res[3] - id
        if (res) url = `${client.options.http.cdn}/emojis/${res[3]}.${res[1].length ? 'gif' : 'png'}`;
    
        //user avatars (mention or id)
        else if (client.users.cache.has(message.args[0])){
            if (!client.users.cache.get(message.args[0]).avatar) throw ['normal', 'Target user doesn\'t have an avatar.'];
            url = client.users.cache.get(message.args[0]).avatarURL({format: 'png', dynamic: true, size: 4096});
        }
        else if (message.mentions.users.first()){
            if (!message.mentions.users.first().avatarURL()) throw ['normal', 'Target user doesn\'t have an avatar.'];
            url = message.mentions.users.first().avatarURL({format: 'png', dynamic: true, size: 4096});
        }
    
        //url
        else {
            await fetch(message.args[0]).catch(e => {throw ['fetch', e.toString()];});
            if ((await fetch(message.args[0])).headers.get('content-type').startsWith('image')) url = message.args[0];
            else throw ['normal', 'You must attach an image, custom emote, URL, or userID / @Mention !'];
        }
    }

    //squishing
    await msg.edit('Squishing image...');
    try {
        let img = await canvas.loadImage(url);
        let sq = canvas.createCanvas(img.width, img.height);
        let ctx = sq.getContext('2d');
        ctx.drawImage(img, 0, Math.floor((sq.height - Math.floor(img.height / 3)) / 2), sq.width, Math.floor(img.height / 3));
        // ctx.drawImage(img, 0, 0, sq.width, sq.height);
        await message.channel.send('Squished image', {files: [{
            attachment: sq.toBuffer(),
            name: 'squished.png'
        }] });
        msg.delete();
    }
    catch (err){throw ['canvas', err.toString()];}
}