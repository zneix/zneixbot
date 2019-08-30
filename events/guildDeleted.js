module.exports = async (client, guild) => {
    await guild.fetchMembers();
    client.user.setPresence({
        status: 'dnd',
        game: {
            name: `${client.config.prefix}help | ${client.users.size} users`,
            url: `https://www.twitch.tv/zneix`,
            type: 1
        }
    });
}