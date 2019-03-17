module.exports = {
    name: `nsfw`,
    description: `tags current text channel as nsfw or sfw (use arguments)`,
    execute(message, args) {
		if (!message.guild.members.get(message.author.id).hasPermission(['MANAGE_CHANNELS'])) return message.channel.send(`You don't have permissions to do that!`);
        if (!args.length) {
			return message.reply(`Too few arguments! use \`true\` or \`false\``);
			} else if (args[0] === `true` || args[0] === `yes`) {
				message.channel.setNSFW(`true`);
				message.channel.send(`I've tagged this channel as nsfw **( ͡° ͜ʖ ͡°)**`);
				return null;
			} else if (args[0] === `false` || args[0] === `no`) {
				message.channel.setNSFW(`false`);
				message.channel.send(`I've tagged this channel as non-nsfw`);
				return null;
			} else {
				message.reply(`wrong argument. Use \`true\` or \`false\``);
				return null;
            }
    },
};