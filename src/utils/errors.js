exports.command = async function(message, err){
    if (Array.isArray(err)){
        let reply = `${client.emoteHandler.guild('dev', 'peepoSadDank')} 👉 `;
        //expected / handled errors
        switch (err[0]){
            case 'botperm':
                reply += `I need \`${err[1]}\` permissions to perform that action`;
                break;
            case 'normal':
                reply += err[1];
                break;
            case 'args':
                reply += `This command requires at least **${err[1]}** arguments to run`;
                break;
            case 'fetch':
                reply += `Failed to fetch link info: ${err[1].replace('TypeError: ', '')}`;
                break;
            case 'canvas':
                reply += `Canvas error: ${err[1].replace(/^Error: /, '')}`;
                break;
            case 'discordapi':
                reply += `Discord API threw an error: ${err[1].replace('DiscordAPIError: ', '')}`;
                break;
            default:
                reply += err.toString();
                break;
        }
        message.channel.send(reply);
    }
    else {
        let nextid = await client.db.utils.getAutoincrement('errors');
        await client.db.utils.insert('errors', [{
            id: nextid,
            event: 'command',
            string: err.toString(),
            stack: err.stack ? err.stack : null,
            call: message.content,
            timestamp: message.createdTimestamp,
            date: message.createdAt,
            userid: message.author.id
        }]);
        console.error(`A wild Error #${nextid} appeared!`);
        console.log(err);
        message.reply(`An error occured, ID: ${nextid}`);
        let errorCh = client.channels.cache.get(client.config.channels.errors);
        if (errorCh && !errorCh.permissionsFor(client.user).missing(['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS']).length) errorCh.send(`<@${client.levels[Math.max(...Object.keys(client.levels))][0]}> new error with ID ${nextid} pajaS`, {embed:{
            color: 0xd47993,
            timestamp: message.createdAt,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
            },
            author: {
                name: `New Error! ID: ${nextid}`,
                url: message.url
            },
            description: '\`Event:\` command'
            +`\n\`String:\` ${err.toString()}`
            +`\n\`Stack:\` ${err.stack ? err.stack : '*N/A*'}`
            +`\n\`Call:\` ${message.content}`
            +`\n\`Timestamp:\` ${message.createdTimestamp}`
            +`\n\`User ID:\` ${message.author.id}`,
        }});
        else console.log(`[!error:cmd] Error channel not found or I'm missing perms!`);
    }
}
exports.message = async function(message, err){
    //catching some dank command errors
    console.log('Critical command error!!! Stack below:');
    console.trace(err);
    let nextid = await client.db.utils.getAutoincrement('errors');
    await client.db.utils.insert('errors', [{
        id: nextid,
        event: 'message',
        timestamp: message.createdTimestamp,
        string: err.toString(),
        stack: err.stack ? err.stack : null,
        call: message.content,
        timestamp: message.createdTimestamp,
        date: message.createdAt,
        userid: message.author.id
    }]);
    //reporting critical error to developer
    let embed = {
        color: 0xff5050,
        author: {
                name: `${message.guild ? `${message.guild.name} — ` : ''}${message.channel.name}\nError #${nextid}`,
                icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
            },
            description: `event: **message**\nreference timestamp: ${message.createdTimestamp}\nuser: ${message.author.id} (${message.author.tag})\ncall: **${message.content}**`,
            fields: [
                {
                    name: 'Reason',
                    value: err.toString().substring(0,1023),
                },
                {
                    name: 'Stack',
                    value: err.stack ? err.stack.toString() : 'N / A'
                }
            ],
            timestamp: message.createdAt
    }
    let ch = client.channels.cache.get(client.config.channels.errors);
    if (ch) ch.send(`<@288028423031357441> ERRORDETECTED, investigate pls!`, {embed:embed});
}