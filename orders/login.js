const serverList = [];
module.exports = {
    name: `login`,
    execute(bot, config, botServers) {
        botServers.forEach(guild => { serverList.push(`\n${guild.name} #${guild.id}`) });
        console.log(
            `Connected, logged as ${bot.user.tag}`
            +`\nClient servers (${serverList.length}):${serverList}`
            +`\n==================================`);
        var currentdate = new Date();
        var datetime = "" + currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
            const loginEmbed = {
                color: 0x11ff11,
                author: {
                    name: `Client logged in`
                },
                title: `Logged in as: ${bot.user.tag}`,
                description: `info message`,
                // thumbnail: {none},
                fields: [
                    {
                        name: `Time logged in`,
                        value: `${datetime}`,
                        inline: true
                    },
                    {
                        name: `User count`,
                        value: bot.users.size,
                        inline: true
                    },
                    {
                        name: `Channel count`,
                        value: bot.channels.size,
                        inline: true
                    },
                    {
                        name: `Client servers (${serverList.length})`,
                        value: `${serverList}`,
                        inline: false
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: `zneixbot by zneix#4433`
                }
            }
        bot.channels.get(config.logsLogin).send({embed:loginEmbed});
        bot.user.setPresence({ status: 'dnd', game: { name: `${config.prefix}help, ver: ${config.botver}`, url: 'https://www.twitch.tv/zneix', type: 1 } });
    },
}