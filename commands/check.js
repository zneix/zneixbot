exports.description = 'Checks certain variables you have set. Currently supported values: cookie, suggestion, error (developers only)';
exports.usage = '<cookie | suggestion | error> <ID>';
exports.level = 0;
exports.perms = [];
exports.cooldown = 5000;
exports.dmable = true;

exports.run = async message => {
    const formatter = require('../src/utils/formatter');
    if (!message.args.length) throw ['args', 1];
    switch (message.args[0].toLowerCase()){
        case 'error':
            if (client.perms.getUserLvl(message.author.id) < client.perms.levels['mod']){
                throw ['normal', 'Sorry, you\'re not allowed to check error stacks!']; }
            let fetchedError = (await client.db.utils.find('errors', {id: parseInt(message.args[1])}))[0];
            if (!fetchedError) throw ['normal', 'Error with given ID doesn\'t exist!'];
            await message.author.send({embed:{
                color: 0xd47993,
                timestamp: new Date(fetchedError.timestamp),
                footer: {
                    text: message.author.tag,
                    icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
                },
                author: {
                    name: `Error, ID: ${fetchedError.id}`
                },
                description: `\`Event:\` ${fetchedError.event}`
                +`\n\`String:\` ${fetchedError.string}`
                +`\n\`Stack:\` ${fetchedError.stack ? fetchedError.stack : '*N/A*'}`
                +`\n\`Call:\` ${fetchedError.call}`
                +`\n\`Timestamp:\` ${fetchedError.timestamp} (${formatter.msToHuman(new Date().getTime() - fetchedError.timestamp, 4)} ago)`
                +`\n\`User ID:\` ${fetchedError.userid}`,
            }});
            if (message.channel.type != 'dm') message.channel.send('Error stack was send to you in a private message, check it out');
            break;
        case 'suggestion':
            let fetchedSuggestion = (await client.db.utils.find('suggestions', {id: parseInt(message.args[1])}))[0];
            if (!fetchedSuggestion) throw ['normal', 'Suggestion with given ID doesn\'t exist!'];
            //filters access to quarrantined suggestions
            if (!client.perms.isGod(message.author.id) && fetchedSuggestion.quarrantined && (fetchedSuggestion.userid != message.author.id)){
                throw ['normal', 'This suggestion has been quarrantined, you can\'t inspect it!']; }
            message.channel.send({embed:{
                color: Math.floor(Math.random() * 256*256*256),
                timestamp: fetchedSuggestion.addedTimestamp,
                footer: {
                    text: 'Suggestion created at:',
                    icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
                },
                author: {
                    name: `Suggestion, ID ${fetchedSuggestion.id}`
                },
                description: `\`Status\`: ${fetchedSuggestion.status}`
                +`\n\`Author\`: ${fetchedSuggestion.user.tag.split('#')[0]}` // data may be global, but there're limits (e.g. discriminators)
                +`\n\`Text\`: ${fetchedSuggestion.text}`,
                fields: [
                    {
                        name: `Updates [${fetchedSuggestion.updates.length}]`,
                        value: fetchedSuggestion.updates.length
                            ? fetchedSuggestion.updates.map(u => `**${u.newStatus}** \`${formatter.msToHuman(new Date().getTime() - u.timestamp, 2)} ago\`\n${u.note || '*No notes...*'}`).join('\n\n')
                            : 'None so far.'
                    }
                ]
            }});
            break;
        case 'cookie':
            //to be implemented later...
            message.reply('Yet under developement, check again later!');
            break;
        default: throw ['normal', `Unsupported variable provided, refer to \`${message.prefix}help ${exports.name}\` for more info`];
    }
}