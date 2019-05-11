var GuildUsers = [];
module.exports = {
    name: `server`,
    description: `prints info about current server`,
    execute(message, bot, serverIcon) {
		const list = bot.guilds.get(message.guild.id);
		list.members.forEach(member => { GuildUsers.push(`${member.user.username}\n`) });
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
                },
                {
                    name: `Server region`,
                    value: message.guild.region,
                    inline: false
                }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: `zneixbot by zneix#4433`
            }
        }
    message.channel.send({embed:asembed});
    GuildUsers.length = 0;
	// message.channel.send(GuildUsers);
    }, //execute end
};