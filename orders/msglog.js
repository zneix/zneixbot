module.exports = {
    name: `msglog`,
    execute(message, bot, config) {
        let chnam = message.channel.name;
        if (chnam.startsWith('logs') && message.guild.id === config.devguild) return null;
        //listening 'n logging all messages
            console.log(`[${message.author.username}||${message.guild.name}||${message.channel.name}(CH:${message.channel.id})]`+message.content);
            const msgDefaultEmbed = { //default
                color: 0x6441A4,
                author: {name: `${message.author.username} sent a message`},
                thumbnail: {url: message.author.avatarURL},
                fields: [
                    {
                        name: `Location`,
                        value: `Server:\`${message.guild.name}\`\nChannel:\`${message.channel.name}\``,
                        inline: false
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
                        name: `IDs`,
                        value: `Guild: ${message.guild.id}\nChannel: ${message.channel.id}\nUser: ${message.author.id}\nMessage: ${message.id}`,
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
            }; bot.channels.get(config.logs.msg).send({embed:msgDefaultEmbed});
    }, //end
}