module.exports = {
    name: "devtool",
    description: "This is a developer tool, do not use it",
    execute(message, args, bot, config, smark, bdayboi) {
        if (message.author.id != config.devid) return message.channel.send(`This is a developer tool, you're not allowed to use it!`);
        if (!args.length) return message.reply(`You're epic!`);
        // if (args[0] === `66`) {
        //     bot.guilds.get(smark).members.get(config.devid).addRole(bdayboi);
        //     message.react('👌');
        //     return null;
        // }
        // if (args[0] === `99`) {
        //     bot.guilds.get(smark).members.get(config.devid).removeRole(bdayboi);
        //     message.react('🥚');
        //     return null;
        // } else message.reply(`yes, sir!`);
        return null;
    },

}