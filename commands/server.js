module.exports = {
    name: `server`,
    description: `prints info about current server`,
    execute(message, bot, GuildIntel, serverIcon, GuildUsers) {
		const list = bot.guilds.get(message.guild.id);
		list.members.forEach(member => { GuildUsers.push(`${member.user.username}\n`) });
    // message.channel.send(GuildIntel); //first form of non-embed message
        asembed = {
            color: 8584977,
		author: {
			name: `Information about current server`,
			// iconURL: message.guild.iconURL
		},
		thumbnail: {
			url: serverIcon
		},
		fields: [
                {
                    name: `Name`,
                    value: message.guild.name,
                    inline: true
                },
                {
                    name: `Created at`,
                    value: message.guild.createdAt,
                    inline: false
                },
                {
                    name: `Owner`,
                    value: message.guild.ownerID,
                    inline: true
                },
                {
                    name: `User Count`,
                    value: GuildUsers.length,
                    inline: true
                }
		    ],
        }
	message.channel.send({embed:asembed});
	// message.channel.send(GuildUsers);
    }, //execute end
};