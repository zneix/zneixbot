module.exports = {
    name: `badguy`,
    description: `You were really bad, didn't you?`,
    execute(message, args, config, fs) {
        if (!args.length) {
			return message.channel.send(`You have to specify an argument, ${message.author}!`);
		} else {
			let mentioned = message.mentions.user.first();
			if (!mentioned) {
				let validUID = bot.members.get(args[0]);
				if (!validUID) return //message.channel.send(`Invalid user`)
				//do stuff for user ID punishment...
			} else {
				//do stuff for mentioned user...
				fs.writeFile(config.dbpath, JSON.stringify(database, null, 4), (err, data) => {
					if (err) {
						console.error(err);
						return message.channel.send(`A wild error appeared!\ncontact <@!${config.devid}> for more help`);
					};
					console.log(`wrote content to ${config.dbpath}`);
				});
			}
		}
    },
}