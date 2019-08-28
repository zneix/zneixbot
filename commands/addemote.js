exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Adds new emote to the current server (currently supports custom emotes only, not links ~~yet~~).`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} (emote)`;
exports.perms = ['MANAGE_EMOJIS'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(1, async () => {
        if (!message.guild.me.hasPermission('MANAGE_EMOJIS')) throw "I don't have **MANAGE_EMOJIS** permission!\nContact moderators.";
        if (!/^<:[a-z0-9-_]+:\d+>/i.test(message.args[0]) && !/^<a:[a-z0-9-_]+:\d+>/i.test(message.args[0])) throw "That's not an emote!";
        //got an emote, resolving extension
        let id = /:\d+>/g.exec(message.args[0])[0].slice(1, -1);
        let url = `https://cdn.discordapp.com/emojis/${id}.${/^<a:[a-z0-9-_]+:\d+>/i.test(message.args[0])?"gif":"png"}`;
        let m = await message.channel.send('Creating emote...');
        await message.guild.createEmoji(url, /^<[a]?:([a-z0-9-_]+):\d+>/gi.exec(message.args[0])[1]).catch(err => console.error(err))
        .then(async emote => {
            let psa = `Successfully created emote \`${emote.name}\` ${emote}\nReact with ❌ within 15 seconds to remove it or change it's name with typing \`emote <new_name>\``;
            await !m?message.channel.send(psa):m.edit(psa)
            .then(async msg => {
                //reaction collector
                await msg.react('❌');
                let Rfilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id
                let Rcollector = msg.createReactionCollector(Rfilter, {time:15000});
                Rcollector.on('collect', () => {
                    //delete emote
                    let old = emote.name;
                    message.guild.deleteEmoji(emote)
                    .then(() => message.reply(`removed emote \`${old}\``));
                    Rcollector.emit('end');
                });
                Rcollector.on('end', () => {
                    if (msg) msg.reactions.get('❌').remove();
                });
                let Mfilter = mesg => mesg.author.id === message.author.id && mesg.content.startsWith('emote ');
                let Mcollector = msg.channel.createMessageCollector(Mfilter, {time:15000});
                Mcollector.on('collect', mess => {
                    let newName = mess.content.split(/ +/)[1];
                    if (!/^[a-z0-9-_]{2,}$/i.test(newName)) message.reply("That's not a valid emote name!");
                    else if (emote) {let old = emote.name;emote.setName(newName).then(e => message.channel.send(`Changed name of ${e} from \`${old}\` to \`${e.name}\`.`));}
                });
                Mcollector.on('end', mess => {
                    if (m) m.edit(`Successfully created emote \`${emote.name}\` ${emote}`);
                });
            });
        });
    });
}