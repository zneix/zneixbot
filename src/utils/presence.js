module.exports = () => {
    client.user.setPresence({
        status: 'dnd',
        activity: {
            name: `${client.config.prefix}help | ${client.guilds.cache.size} servers`,
            // url: '',
            type: 'PLAYING'
        }
    });
}