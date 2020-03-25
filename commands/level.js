exports.description = 'Manages level entries level of specified user. If no args are specified, prints level entries from database.';
exports.usage = '<user ID | @mention> <level>';
exports.level = 1000;
exports.perms = [];
exports.cooldown = 0;
exports.pipeable = false;

exports.run = async (client, message) => {
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
            const userlevel = require('../src/utils/perms')(client).levels.user;
            if (level == userlevel) await client.db.utils.delete(permcol, {userid: userid}); //deleting entries for users degraded to 0 (regular users)
            else await client.db.db().collection(permcol).updateOne({userid: userid}, {$set: {level: level}});
        }
        const perms = await client.db.utils.permlevels();
        if (!perms) throw ['normal', `An error occured while updating permission levels! ${client.emoteHandler.find('PepeS')}`];
        else {
            client.perms = perms;
            let str = `Set level of **${userid}** to **${level}**`;
            message.channel.send(str);
        }
    }
    else {
        let m = await message.channel.send('Updating global permission levels...');
        const perms = await client.db.utils.permlevels();
        if (!perms) throw ['normal', `An error occured while updating permission levels! ${client.emoteHandler.find('PepeS')}`];
        else {
            client.perms = perms;
            let str = `Updated global permission levels ${client.emoteHandler.guild('asset', 'FeelsGoodMan')}`;
            m.deleted ? message.channel.send(str) : m.edit(str);
        }
    }
}