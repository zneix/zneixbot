module.exports = {
    name: `user`,
    description: `displays various information about user's account`,
    execute(message, args, bot, _users) {
        const taggedUser = message.mentions.users.first();
		var taggedID = 5;
		if (!args.length) {
			const testEmbed = {
				color: 8584977,
				author: {
					name: `Userinfo`,
					// iconURL: message.author.avatarURL //(duplicated code)
					},
				title: `Your Profile`,
				url: `https://discordapp.com/users/${message.author.id}`,
				description: `desc`,
				thumbnail: {
					url: message.author.avatarURL
				},
				fields: [
					{
						name: `Username`,
						value: `${message.author.username}#${message.author.discriminator}`,
						inline: true,
					},
					{
						name: `Discord ID`,
						value: `${message.author.id}`,
						inline: true,
					},
					{
						name: `Account created`,
						value: `${message.author.createdAt}`,
						inline: false,
					}
				],
				timestamp: new Date(),
				footer: {
					icon_url: bot.user.avatarURL,
					text: `zneixbot by zneix#4433`
				}
			}; message.channel.send({embed:testEmbed});
		}
		else if (!taggedUser) {
			let ID = args[0];
			let validUID = bot.users.get(ID);
			if (!validUID) { //executing invalid User ID
				message.author.send(`ID you provided is invalid`);
				return(null);
			} else { //executing valid User ID
				const testEmbed = {
					color: 8584977,
					author: {
						name: `Userinfo`,
						// iconURL: validUID.avatarURL //(duplicated code)
						},
					title: `Their profile`,
					url: `https://discordapp.com/users/${validUID.id}`,
					description: `desc`,
					thumbnail: {
						url: validUID.avatarURL
					},
					fields: [
						{
							name: `Username`,
							value: `${validUID.username}#${validUID.discriminator}`,
							inline: true,
						},
						{
							name: `Discord ID`,
							value: `${validUID.id}`,
							inline: true,
						},
						{
							name: `Account created`,
							value: `${validUID.createdAt}`,
							inline: false,
						}
					],
					timestamp: new Date(),
					footer: {
						icon_url: bot.user.avatarURL,
						text: `zneixbot by zneix#4433`
					}
				}; message.channel.send({embed:testEmbed});
				return(null);
				}
		} else {
			const testEmbed = {
				color: 8584977,
				author: {
					name: `Userinfo`,
					// iconURL: taggedUser.avatarURL //(duplicated code)
					},
				title: `Their profile`,
				url: `https://discordapp.com/users/${taggedUser.id}`,
				description: `desc`,
				thumbnail: {
					url: taggedUser.avatarURL
				},
				fields: [
					{
						name: `Username`,
						value: `${taggedUser.username}#${taggedUser.discriminator}`,
						inline: true,
					},
					{
						name: `Discord ID`,
						value: `${taggedUser.id}`,
						inline: true,
					},
					{
						name: `Account created`,
						value: `${taggedUser.createdAt}`,
						inline: false,
					}
				],
				timestamp: new Date(),
				footer: {
					icon_url: bot.user.avatarURL,
					text: `zneixbot by zneix#4433`
				}
			}; message.channel.send({embed:testEmbed});
        }
    },
};