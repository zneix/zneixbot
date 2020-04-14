exports.description = 'Posts your level progress. You can mention another user or provide userID to check their progress instead.';
exports.usage = '[@mention | userID]';
exports.level = 0;
exports.perms = [];
exports.cooldown = 15000;
exports.pipeable = false;

exports.run = async message => {
    //remember to add some kind of cooldown (and comment code of course)
    if (!message.args.length){
        let userLvl = await client.db.lvl.findUser(message.guild.id, message.author.id);
        if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.author.id);
        require('../src/embeds/rankCheck')(message, userLvl);
    }
    else {
        if (message.mentions.members.size){
            if (message.args[0].includes(message.mentions.members.firstKey())){
                let userLvl = await client.db.lvl.findUser(message.guild.id, message.mentions.members.firstKey());
                if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.mentions.members.firstKey());
                return require('../src/embeds/rankCheck')(message, userLvl);
            }
            else throw ['normal', 'Given ID is not present in database or invalid'];
        }
        let userLvl = await client.db.lvl.findUser(message.guild.id, message.args[0]);
        if (!userLvl){
            if (message.guild.member(message.args[0])) userLvl = await client.db.lvl.newUser(message.guild.id, message.args[0]);
            else throw ['normal', 'Your ID is not present in database or invalid.'];
        }
        require('../src/embeds/rankCheck')(message, userLvl);
    }
}