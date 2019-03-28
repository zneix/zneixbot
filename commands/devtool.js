var frame = [];
module.exports = {
    name: "devtool",
    description: "This is a developer tool, do not use it",
    async execute(message, args, bot, config, smark, bdayboi) {
        if (message.author.id != config.devid) return message.channel.send(`This is a developer tool, you're not allowed to use it!`);
        if (!args.length) return message.reply(`You're epic, no args yikes!`);
        if (args[0] === `message` || args[0] === `msg`) {
            if (args.length < 3) return message.channel.send(`too few arguments!`);
            let destination = bot.channels.get(args[1]);
            if (!destination) return message.channel.send(`sowwy, but ID \`${args[1]}\` is not valid`);
            args.splice(0,2);
            let content = args.join(" ");
            destination.send(content);
            return null;
        }
        if (args[0] === `channels` || args[0] === `chs`) {
            frame.push(`**Channels of '${bot.guilds.get(args[1]).name}' (${bot.guilds.get(args[1]).channels.size}):**\n`);
            bot.guilds.get(args[1]).channels.forEach(ch => {
                frame.push(`[${ch.type}] '${ch.name}' (${ch.id})`);
            });
            await message.channel.send(frame);
            frame.length = 0;
            return null;
        }
        if (args[0] === `guilds` || args[0] === `servers`) {
            frame.push(`**All user guilds mapped by their ID:**`);
            bot.guilds.forEach(g => {frame.push(`${g.id} '__${g.name}__'`);});
            await message.channel.send(frame);
            frame.length = 0;
            return null;
        }
        if (args[0] === `users`) {
            frame.push(`**All users in my guilds:**`);
            bot.users.forEach(u => {frame.push(`${u.id} '__${u.tag}__'`);});
            await message.channel.send(frame);
            frame.length = 0;
            return null;
        }
        if (args[0] === `invite` || args[0] === `inv`) {
            if (args.length < 3) return message.channel.send(`too few arguments!\n1 - guild\n2 - channel`);
            try {
                bot.guilds.get(args[1]).channels.get(args[2]).createInvite({options: {maxAge: 0}})
                .then(inv => message.reply(`**Created an invite!\nserver: '${bot.guilds.get(args[1]).name}'\nchannel: '${bot.guilds.get(args[1]).channels.get(args[2]).name}'**\nhttps://discord.gg/${inv.code}`));
            } catch (error) {message.channel.send(`Error, wrong format, or no permissions!\n1 - guild\n2 - channel`)};
            return null;
        }
        message.reply(`ily UwU <3`);
        return null;
    },

}