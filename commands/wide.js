exports.description = 'Turns provided attached image / emote / URL / server member\'s avatar into two wide images (Outputs only in PNG format for now).';
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
            if (!message.mentions.users.first().avatar) throw ['normal', 'Target user doesn\'t have an avatar.'];
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
    await msg.edit('Transforming image...');
    try {
        let img = await canvas.loadImage(url);
        let sq1 = canvas.createCanvas(img.width, img.height);
        let sq2 = canvas.createCanvas(img.width, img.height);
        let ctx1 = sq1.getContext('2d');
        let ctx2 = sq2.getContext('2d');
        ctx1.drawImage(img, 0, 0, sq1.width * 2, img.height);
        ctx2.drawImage(img, -(img.width), 0, sq2.width * 2, img.height);
        await message.channel.send('Wide Images', {files: [
            {
                attachment: sq1.toBuffer(),
                name: 'wide1.png'
            },
            {
                attachment: sq2.toBuffer(),
                name: 'wide2.png'
            }
        ]});
        msg.delete();
    }
    catch (err){throw ['canvas', err.toString()];}
}