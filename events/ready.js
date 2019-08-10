module.exports = client => {
    console.log(`[ready] Connected as: '${client.user.tag}'`);
    client.user.setPresence({
        status: 'dnd',
        game: {
            // name: client.config.prefix+`help, ver: `+client.version,
            name: `🦀G🦀R🦀I🦀X🦀\n🦀G🦀O🦀N🦀E🦀`,
            url: `https://www.twitch.tv/zneix`,
            type: 1
        }
    });
    var embed = {
        color: 0xf97304,
        timestamp: new Date(),
        footer: {
            text: client.user.tag,
            icon_url: client.user.avatarURL
        },
        author: {
            name: "Logged in to WebSocket"
        },
        fields: [
            {
                name: "User",
                value: client.user+"\n"+client.user.tag+" `"+client.user.id+"`",
                inline: false
            },
            {
                name: "Size",
                value: `Users: **${client.users.size}**\nGuilds: **${client.guilds.size}**\nChannels: **${client.channels.size}**`,
                inline: false
            }
        ]
    }
    let logs = client.channels.get(client.config.channels.logs);
    if (logs) logs.send({embed:embed});
    else console.log(`[!ready] logs channel not found`); //code executed as an error message
}