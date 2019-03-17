module.exports = {
    name: `msglog`,
    execute(message, bot, config, messAuthorID) {
        //listening 'n logging all messages
	    if ((message.channel.id != config.logsLogin) && (message.channel.id != config.logsLogin)) {
            // if (message.channel.type != "dm") console.log(`[${message.author.username}||${message.channel.name}(${message.channel.id})]`+message.content);
            // else {
                if (message.author.bot) console.log(`BOT SEND ME A MESSAGE!`);
                else console.log(`[${message.author.username}||DM(${message.channel.id})]`+message.content);
            // }
		}
        if ((message.channel.id != config.logsLogin) && (message.channel.id != config.logsLogin)) {
            // if (message.content.startsWith(prefix)) {
            // const msgCommandEmbed = {
            // 	color: 0x000000,
            // 	author: {name: `Recived a command`},
            // 	thumbnail: {url: message.author.avatarURL},
            // 	fields: [
            // 		{
            // 			name: `Name`,
            // 			value: `${command}`
            // 		}
            // 	]
            // };
            // bot.channels.get(config.logsLogin).send(msgCommandEmbed);
            // }

            if (messAuthorID === bot.user.id) {
                const msgClientEmbed = {
                    color: 0x0022ef,
                    author: {name: `I send a message`},
                    thumbnail: null,
                    fields: [
                        {
                            name: `Location`,
                            value: `Server:\`${message.guild.name}\`\nChannel:\`${message.channel.name}\``,
                            inline: true
                        },
                        {
                            name: `ID`,
                            value: message.id,
                            inline: true					
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: `zneixbot by zneix#4433`
                    }
                }; bot.channels.get(config.logsMsg).send({embed:msgClientEmbed});
            } else return null;

            // if (!message.content) var msgContent = "'null message'"
            // else var msgContent = message.content
            const msgDefaultEmbed = {
                color: 0x6441A4,
                author: {name: `${message.author.username} sent a message`},
                thumbnail: {url: message.author.avatarURL},
                fields: [
                    {
                        name: `Location`,
                        value: `Server:\`${message.guild.name}\`\nChannel:\`${message.channel.name}\``,
                        inline: true
                    },
                    // {
                    // 	name: `Type`,
                    // 	value: message.type,
                    // 	inline: true
                    // },
                    {
                        name: `Sent At`,
                        value: message.createdAt,
                        inline: true
                    },
                    {
                        name: `Timestamp`,
                        value: message.createdTimestamp,
                        inline: true
                    },
                    {
                        name: `URL to the message`,
                        value: message.url,
                        inline: true
                    },
                    {
                        name: `ID`,
                        value: message.id,
                        inline: true					
                    }
                    // ,{
                    // 	name: `Message content`,
                    // 	value: msgContent
                    // }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: `zneixbot by zneix#4433`
                }
            }; bot.channels.get(config.logsMsg).send({embed:msgDefaultEmbed});
            // bot.channels.get(config.logsLogin).send(
            // `${message.author.username}||${message.guild.name}`
            // +`\n${message.content}`
            // );
            
            // sending logs to 'config.logsLogin' channel
        } else return null;
    },
}