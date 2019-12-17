exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Allows you to check your level progress.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = [false, false];

exports.run = (client, message) => {
    message.command(false, async () => {
        //remember to add some kind of cooldown (and comment code of course)
        if (message.args[0]){
            if (message.mentions.members.size){
                if (message.args[0].includes(message.mentions.members.first().id)){
                    let userLvl = await client.db.lvl.findUser(message.guild.id, message.mentions.members.first().id);
                    if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.mentions.members.first().id);
                    return require(`../src/embeds/rankCheck`)(message, userLvl);
                }
                else throw 'Command argument is not a valid member ID or @Mention';
            }
            let userLvl = await client.db.lvl.findUser(message.guild.id, message.args[0]);
            if (!userLvl){
                if (message.guild.member(message.args[0])) userLvl = await client.db.lvl.newUser(message.guild.id, message.args[0]);
                else throw 'Command argument is not a valid member ID or @Mention';
            }
            require(`../src/embeds/rankCheck`)(message, userLvl);
        }
        else {
            let userLvl = await client.db.lvl.findUser(message.guild.id, message.author.id);
            if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.author.id);
            require(`../src/embeds/rankCheck`)(message, userLvl);
        }
    });
}