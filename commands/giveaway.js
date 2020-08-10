exports.description = 'Start a new giveaway in specified channel for 20 winners max.'
+'\nTime should be specified without spaces, like `10m` or `5h30m`.\nSupports y, w, d, h, m, s';
exports.usage = '<channelID | #channel> <time> <number of winners (must be 1-20)> [giveaway subject]';
exports.level = 100;
exports.perms = ['ADMINISTRATOR', 'MANAGE_GUILD'];
exports.cooldown = 7000;
exports.dmable = false;

exports.run = async message => {
    if (message.args.length < 3) throw ['args', 3];
    let {humanToSec, msToHuman, dateFormat, hourFormat} = require('../src/utils/formatter');
    //valid channel clearance
    let channel = null;
    if (message.mentions.channels.size){
        let mentionID = message.mentions.channels.firstKey();
        if (message.args[0].includes(mentionID) && message.guild.channels.cache.has(mentionID)) channel = message.mentions.channels.first();
    }
    else if (message.guild.channels.cache.has(message.args[0])) channel = message.guild.channels.cache.get(message.args[0]);

    //channel clearance
    if (!channel) throw ['normal', `\`${message.args[0]}\` is not a text channel in this server!`];
    else if (channel.type != 'text') throw ['normal', `\`${message.args[0]}\` is not a text channel in this server!`];

    let missingPerms = channel.permissionsFor(client.user).missing(['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']); //all required permissions in target channel
    if (missingPerms.length) throw ['normal', `I need more permissions in ${channel} to start a giveaway there (${missingPerms.join(', ')})`];
    //time string specification
    let timeSec = humanToSec(message.args[1]);
    if (!timeSec) throw ['normal', 'Invalid time value was provided. Use numbers and time unit letters: y, w, d, h, m, s.\nExamples: 10m (10 minutes), 5h30m (5 hours and 30 minutes)'];
    //winner count clearance
    if (!Number.isInteger(parseInt(message.args[2])) || (message.args[2] < 1) || (message.args[2] > 20)) throw ['normal', 'Number of winners must be between 1 and 20!'];
    //message specification
    let userMsg = message.args.slice(3).join(' ');

    //confirmation message
    let endDateConf = new Date(Date.now() + (timeSec * 1000));
    let confirmMsg = await message.channel.send(`You're about to start a giveaway:\n`
    +`\nIn channel: ${channel}`
    +`\nNumber of winners: **${message.args[2]}**`
    +`\nGiveaway is going to last for: **${msToHuman(timeSec * 1000, 4)}** (will end approximately at \`${dateFormat(endDateConf)}, ${hourFormat(endDateConf)}\`)`
    +`\nGiveaway subject: **${userMsg ? userMsg : 'None.'}**`
    +`\n\nReact with ${client.emoteHandler.guild('asset', 'tickyes')} to confirm and start the giveaway`
    +`\nReact with ${client.emoteHandler.guild('asset', 'tickno')} (or wait 30s) to cancel`
    );
    //awaiting confirmation from command author
    await confirmMsg.react(client.emoteHandler.guild('asset', 'tickyes'));
    await confirmMsg.react(client.emoteHandler.guild('asset', 'tickno'));
    let boolStart = false;
    const collector = confirmMsg.createReactionCollector((reaction, user) => user.id == message.author.id, {time: 30000});
    collector.on('collect', r => {
        switch (r.emoji.name){
            case 'tickyes': boolStart = true; //decided to do it this way, so collector.stop() will be called anyway
            case 'tickno': collector.stop();
        }
    });
    collector.on('end', async () => {
        //clear message reactions
        try {await confirmMsg.reactions.removeAll();}
        catch(err){console.log(err)}

        //abandon giveaway
        if (!boolStart) confirmMsg.edit('Cancelled giveaway creation.');
        //throw a giveaway
        else {
            //declaring a new variable, because time starts ticking now
            let endDate = new Date(Date.now() + (timeSec * 1000));
            let giveawayMsg = await channel.send({embed: {
                color: 0x25fe4a,
                timestamp: endDate,
                footer: {
                    text: `Hosted by ${message.author.tag}`,
                    icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
                },
                author: {
                    name: `🎉 New Giveaway has started!`
                },
                description: (userMsg ? `**${userMsg}**` : '*No Subject...*')
                +`\nWinner(s): **${message.args[2]}**`
                +`\nEnds in: **${msToHuman(timeSec * 1000, 4)}** \`${dateFormat(endDate)}, ${hourFormat(endDate)}\``
                +`\n\n**React with 🎉 to enter!**`
            }});
            //scheduling the job first would be better, but over here, giveawayMsg has to be defined before it's possible to schedule a job
            let jobid = await client.cron.schedule('giveaway', timeSec, {
                channelid: message.channel.id,
                destChannelid: channel.id,
                giveawayMsgid: giveawayMsg.id,
                giveawayInfo: {
                    subject: userMsg || null,
                    winners: parseInt(message.args[2])
                }
            }).catch(err => {throw ['normal', err.toString()]});
            await giveawayMsg.react('🎉');
            confirmMsg.edit(`Successfully created giveaway in ${channel} with an ID: ${jobid}`);
        }
    });
}