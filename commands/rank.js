exports.description = 'Posts your level progress. You can mention another user or provide their userID to check their progress instead. Checking ranks by usernames are not available yet!';
exports.usage = '[@mention | userID]';
exports.level = 0;
exports.perms = [];
exports.cooldown = 15000;
exports.dmable = false;

exports.run = async message => {
    //remember to add some kind of cooldown (and comment code of course)
    if (!message.args.length){
        let userLvl = await client.db.lvl.findUser(message.guild.id, message.author.id);
        if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.author.id);
        require('../src/embeds/rankCheck')(message, userLvl);
    }
    else {
        if (message.args[0].includes(message.mentions.users.firstKey())){
            //excluding bots
            if (message.mentions.users.first().bot) throw ['normal', 'Bots are excluded from gaining experience!'];
            let userLvl = await client.db.lvl.findUser(message.guild.id, message.mentions.users.firstKey());
            if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.mentions.users.firstKey());
            return require('../src/embeds/rankCheck')(message, userLvl);
        }
        let userLvl = await client.db.lvl.findUser(message.guild.id, message.args[0]);
        if (!userLvl){
            //trying to get server member if database entry wasn't found
            if (message.guild.member(message.args[0])){
                //excluding bots
                if (message.guild.member(message.args[0]).user.bot) throw ['normal', 'Bots are excluded from gaining experience!'];
                userLvl = await client.db.lvl.newUser(message.guild.id, message.args[0]);
            }
            else throw ['normal', 'Given user ID is not present in database or invalid!'];
        }
        require('../src/embeds/rankCheck')(message, userLvl);
    }
}