exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Start a new giveaway in specified channel, specified winner amount and optional message!\nThere can be 20 winners at most.\nUse word "in" to specify time unit.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} <channelID | #channel> <number_of_winners> [optional message] <time>`;
exports.perms = [false, false, 'MANAGE_CHANNELS'];

exports.run = (client, message) => {
    message.cmd = this;
    message.command(2, async () => {
        let {humanParser, msFormat, dateFormat} = require('../utils/timeFormatter');
        //valid channel clearance
        let channel = null;
        if (message.mentions.channels.size){
            if (message.args[0].includes(message.mentions.channels.first().id) && message.guild.channels.has(message.mentions.channels.first().id)){
                channel = message.mentions.channels.first();
            }
        }
        else if (message.guild.channels.has(message.args[0])) channel = message.guild.channels.get(message.args[0]);
        if (channel){if (channel.type != 'text') throw `\`${message.args[0]}\` is not a text channel in this server!`;}
        else throw `\`${message.args[0]}\` is not a text channel in this server!`;
        if (channel.permissionsFor(client.user).missing(['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']).length) throw `I don't have permissions in ${channel} to start a giveaway in there!`;
        //winner count clearance
        if (!Number.isInteger(parseInt(message.args[1])) || (message.args[1] < 1) || (message.args[1] > 20)) throw 'Number of winners must be a number between 1 and 20!';
        //time string specification
        let cutStr = message.args.slice(2).join(' ');
        let timeIndex = cutStr.lastIndexOf('in ');
        if (timeIndex == -1) throw 'No time string specified!';
        let timeStr = cutStr.slice(timeIndex+2).trim();
        if (!timeStr.length) throw 'No time string specified!';
        if (!humanParser(timeStr)) throw 'Invalid time string';
        // if (humanParser(timeStr) < 180) throw 'Giveaway should last at least 3 minutes!';
        //message specification
        let userMsg = cutStr.slice(0, timeIndex).trim();
        //confirmation
        let cmsg = await message.channel.send(`You're about to start a giveaway:\n`
        +`\nChannel: ${channel}`
        +`\nNumber of winners: **${message.args[1]}**`
        +`\nGiveaway is going to last for: **${msFormat(humanParser(timeStr)*1000)}** (will end approx. at \`${dateFormat(new Date(Date.now()+humanParser(timeStr)*1000))})\``
        +`\nExtra message: **${userMsg?userMsg:'Not specified.'}**`
        +`\n\nReact with ${client.emoteHandler.asset('tickyes')} to start giveaway`
        +`\nReact with ${client.emoteHandler.asset('tickno')} or wait 15s to try again`
        );
        //awaiting confirmation from command author
        await cmsg.react(client.emoteHandler.asset('tickyes'));
        await cmsg.react(client.emoteHandler.asset('tickno'));
        let gStart = false;
        const collector = cmsg.createReactionCollector((reaction, user) => user.id == message.author.id, {time: 15000});
        collector.on('collect', async r => {
            await r.remove(message.author.id);
            switch (r.emoji.name){
                case 'tickyes':
                    gStart = true;
                    return collector.stop();
                case 'tickno':
                    return collector.stop();
            }
        });
        collector.on('end', async () => {
            await cmsg.clearReactions();
            if (!gStart){
                //abandon giveaway
                await cmsg.edit('Abandoned giveaway creation.');
                return;
            }
            else {
                //do a giveaway
                let embed = {
                    color: 0x25fe4a,
                    timestamp: new Date(Date.now()+humanParser(timeStr)*1000),
                    footer: {
                        text: `Hosted by ${message.author.tag}`,
                        icon_url: message.author.avatarURL
                    },
                    author: {
                        name: `🎉 New Giveaway has started!`
                    },
                    description: `Subject: **${userMsg || 'Not specified.'}**`
                    +`\nWinner(s): **${message.args[1]}**`
                    +`\nEnds in: **${msFormat(humanParser(timeStr)*1000)}** \`${dateFormat(new Date(Date.now()+humanParser(timeStr)*1000))}\``
                    +`\n\n**React with 🎉 to enter!**`
                }
                let gamsg = await channel.send({embed: embed});
                await gamsg.react('🎉');
                await client.agenda.schedule(`in ${msFormat(humanParser(timeStr)*1000)}`, 'giveaway', {
                    orig: [message.channel.id],
                    dest: [channel.id, gamsg.id],
                    ginfo: {
                        subject: userMsg || null,
                        winners: message.args[1],
                        time: humanParser(timeStr)
                    }
                });
                cmsg.edit(`Successfully created giveaway in ${channel} with an ID: ${gamsg.id}`);
            }
        });
    });
}