exports.description = 'Manages certain types and variables. Currently supported types: level, suggestion';
exports.usage = '<user ID | @mention> <level>';
exports.level = 1000;
exports.perms = [];
exports.cooldown = 0;
exports.dmable = false;

exports.run = async message => {
    if (!message.args.length) throw ['args', 1];
    switch (message.args.shift().toLowerCase()){ //smart shift to not change anything in modules
        case 'level': return await level();
        case 'suggestion': return await suggestion();
        default: throw ['normal', 'Invalid type provided, currently supported types: level, suggestion'];
    }
    async function level(){
        if (message.args.length > 1){
            let mentionedUser = message.mentions.members.first();
            let userid, level;
            if (!mentionedUser){
                let user = client.users.cache.get(message.args[0]);
                if (user) userid = user.id;
            }
            else userid = mentionedUser.id;
            if (!userid) throw ['normal', 'Invalid user was provided!'];
            if (isNaN(parseInt(message.args[1]))) throw ['normal', 'Invalid level value was provided!'];
            else level = parseInt(message.args[1]);
            //all test are now validated, saving data to database
            let permcol = require('../src/json/auth').db.permcol;
            let userDoc = (await client.db.utils.find(permcol, {userid: userid}))[0];
            if (!userDoc) userDoc = (await client.db.utils.insert(permcol, [{userid: userid, level: level}]))[0];
            else {
                if (level == client.perms.levels.user) await client.db.utils.delete(permcol, {userid: userid}); //deleting entries for users degraded to 0 (regular users)
                else await client.db.db().collection(permcol).updateOne({userid: userid}, {$set: {level: level}});
            }
            const levels = await client.db.utils.permlevels();
            if (!levels) throw ['normal', `An error occured while updating permission levels! ${client.emoteHandler.find('PepeS')}`];
            else {
                client.levels = levels;
                let str = `Set level of **${userid}** to **${level}**`;
                message.channel.send(str);
            }
        }
        else {
            let m = await message.channel.send('Updating global permission levels...');
            const levels = await client.db.utils.permlevels();
            if (!levels) throw ['normal', `An error occured while updating permission levels! ${client.emoteHandler.find('PepeS')}`];
            else {
                client.levels = levels;
                let str = `Updated global permission levels ${client.emoteHandler.guild('asset', 'FeelsGoodMan')}`;
                m.deleted ? message.channel.send(str) : m.edit(str);
            }
        }
    }
    async function suggestion(){
        const statuses = ['new', 'dismissed', 'denied', 'approved', 'completed', 'spam', 'not-a-suggestion', 'unlikely', 'postponed', 'duplicate'];
        if (message.args.length < 2) throw ['normal', `Provide suggestion ID and status!\nList of statuses: ${statuses.join(', ')}`];
        let fetchedSuggestion = (await client.db.utils.find('suggestions', {id: parseInt(message.args[0])}))[0];
        if (!fetchedSuggestion) throw ['normal', 'Suggestion with this ID doesn\'t exist!'];
        if (!statuses.includes(message.args[1].toLowerCase())) throw ['normal', `Status must be one of the following: ${statuses.join(', ')}`];
        const updateObj = {
            newStatus: message.args[1].toLowerCase(),
            note: message.args.slice(2).join(' ') || null,
            timestamp: message.createdTimestamp
        }
        //writing update to the database
        await client.db.db().collection('suggestions').findOneAndUpdate({id: fetchedSuggestion.id}, {
            $push: {updates: updateObj},
            $set: {status: updateObj.newStatus}
        });
        //dming the user, bool will change if message was sent successfully
        let DMError = 'User not found';
        let suggestionAuthor = client.users.cache.get(fetchedSuggestion.user.id);
        if (suggestionAuthor){
            try {
                await suggestionAuthor.send(`Your suggestion (ID ${fetchedSuggestion.id}) was updated to **${updateObj.newStatus}**!`, {embed:{
                    color: 0xbec928,
                    timestamp: message.createdAt,
                    footer: {
                        text: `Reviewed by ${message.author.tag}`,
                        icon_url: message.author.avatarURL({format: 'png', dynamic: true, size: 4096})
                    },
                    description: `\`Text:\` ${fetchedSuggestion.text}`
                    + (updateObj.note ? `\n\n\`Note:\` ${updateObj.note}` : '')
                }}).then(() => DMError = null);
            }
            catch (err){ DMError = err.toString().replace('DiscordAPIError:', 'API Error:') }
        }
        message.channel.send(`Suggestion #${fetchedSuggestion.id} was updated to ${updateObj.newStatus}!${DMError ? `\nI was unable to dm them, reason: \`${DMError}\`` : ''}`);
    }
}