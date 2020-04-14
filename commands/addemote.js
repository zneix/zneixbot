exports.description = 'Adds new emote to the current server. Suported arguments: emotes, image links and image attachments';
exports.usage = '<:Kappa:630103099578646558>\nhttps://static-cdn.jtvnw.net/emoticons/v1/114836/3.0';
exports.level = 0;
exports.perms = ['MANAGE_EMOJIS'];
exports.cooldown = 5000;
exports.pipeable = false;

exports.run = async message => {
    if (!message.guild.me.hasPermission('MANAGE_EMOJIS')) throw ['botperm', 'Manage Emojis'];
    let url = '';
    let emotename = '';
    if (message.attachments.size){
        //image attachment resolver
        if (!message.attachments.first().width) throw ['normal', 'Attached file is not a valid image'];
        if (message.attachments.first().filesize > 262143) throw ['normal', `Attached image is too big: ${Math.floor(message.attachments.first().filesize / 1024)}kb > 256kb`];
        url = message.attachments.first().url;
        emotename = message.attachments.first().filename.split('.')[0];
    }
    else if (message.args.length){
        //resolving discord emotes (from nitro users)
        let res = /<(a?):([a-z0-9-_]+):(\d+)>/i.exec(message.args[0]);
        //res[0] - whole string; res[1] - is animated; res[2] - name; res[3] - id
        if (res){
            url = `https://cdn.discordapp.com/emojis/${res[3]}.${res[1].length ? 'gif' : 'png'}`;
            emotename = res[2];
        }
        else {
            //resolving URLs
            const fetch = require('node-fetch');
            await fetch(message.args[0]).catch(err => {return;throw ['fetch', err.toString()];}).then(f => { //returning in fetch errors now, those are just dank
                if (f ? f.headers.get('content-type').startsWith('image') : false){
                    if (parseInt(f.headers.get('content-length')) > 262143) throw ['normal', `Requested image is too big: ${Math.floor(f.headers.get('content-length') / 1024)}kb > 256kb`];
                    url = message.args[0];
                    emotename = f.headers.get('content-location') ? f.headers.get('content-location').split('.')[0] : `emoji_${message.guild.emojis.cache.size+1}`;
                }
            });
        }
    }
    if (!url.length || !emotename.length) throw ['normal', "You have to provide one of following: emote, image link, attached image\nFor links, make sure those lead directly to image"];
    //got an emote, resolving extension
    let m = await message.channel.send('Creating emote...');
    await message.guild.emojis.create(url, emotename).catch(err => {throw ['discordapi', err.toString()];})
    .then(async emote => {
        let psa = `Successfully created emote \`${emote.name}\` ${emote}\nReact with ❌ within 17 seconds to remove it or change it's name with typing \`emote <new_name>\``;
        !m ? message.channel.send(psa) : m.edit(psa)
        .then(async msg => {
            //initializing collectors
            await msg.react('❌');
            let Rfilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;
            let Rcollector = msg.createReactionCollector(Rfilter, {time:17000});
            //message collector for chaning new emote name
            let Mfilter = mesg => mesg.author.id === message.author.id && mesg.content.startsWith('emote');
            let Mcollector = msg.channel.createMessageCollector(Mfilter, {time:17000});
            //reaction collector for deleting emote
            Rcollector.on('collect', () => {
                //deleting emote
                emote.delete(`Responsible user: ${message.author.tag}`).catch(err => {throw ['discordapi', err.toString()];})
                .then(() => {
                    message.reply(`removed emote \`${emote.name}\``);
                    Rcollector.stop();
                });
            });
            Mcollector.on('collect', mess => {
                let newName = mess.content.slice('emote'.length).trim().split(/\s+/g)[0];
                if (!/^[a-z0-9-_]{2,}$/i.test(newName)) message.reply("Given name is invalid!");
                else if (emote){
                    let oldName = emote.name;
                    emote.setName(newName, `Responsible user: ${message.author.tag}`).catch(err => {throw ['discordapi', err.toString()];})
                    .then(() => message.channel.send(`Changed name of ${emote} from \`${oldName}\` to \`${emote.name}\`.`));
                }
            });
            Mcollector.on('end', () => {
                if (m){
                    if (emote.deleted) m.edit(`Created emote \`${emote.name}\` but deleted it afterwards`);
                    else m.edit(`Successfully created emote \`${emote.name}\` ${emote}`);
                }
            });
            Rcollector.on('end', () => {
                if (msg) msg.reactions.cache.get('❌').users.remove();
                Mcollector.stop(); //also emitting end for message handler
            });
        });
    });
}